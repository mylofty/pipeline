/**
 * 数据库诊断工具
 * 用于检测是否使用了原始数据库文件
 */

import database from '@/utils/database.js';

class DatabaseDiagnostic {
  
  /**
   * 运行完整诊断
   */
  async runFullDiagnostic() {
    const results = {
      timestamp: new Date().toISOString(),
      databaseType: 'unknown',
      isConnected: false,
      tables: {},
      summary: {
        totalTables: 0,
        tablesWithData: 0,
        totalRecords: 0,
        isUsingOriginalData: false
      },
      recommendations: []
    };
    
    try {
      // 检查数据库连接状态
      results.isConnected = database.adapter && database.adapter.isReady();
      results.databaseType = database.adapter?.getType ? database.adapter.getType() : 'unknown';
      
      console.log('=== 数据库诊断开始 ===');
      console.log(`数据库类型: ${results.databaseType}`);
      console.log(`连接状态: ${results.isConnected}`);
      
      if (!results.isConnected) {
        results.recommendations.push('数据库未连接，请检查初始化过程');
        return results;
      }
      
      // 检查每个表
      const tableNames = [
        'projects', 'pipe_points', 'pipe_lines', 
        'pipe_categories', 'attribute_settings', 'features',
        'virtual_lines', 'shared_pipes'
      ];
      
      for (const tableName of tableNames) {
        const tableInfo = await this.analyzeTable(tableName);
        results.tables[tableName] = tableInfo;
        results.summary.totalRecords += tableInfo.recordCount;
        
        if (tableInfo.recordCount > 0) {
          results.summary.tablesWithData++;
        }
      }
      
      results.summary.totalTables = tableNames.length;
      
      // 判断是否使用了原始数据
      results.summary.isUsingOriginalData = this.determineOriginalDataUsage(results);
      
      // 生成建议
      results.recommendations = this.generateRecommendations(results);
      
      console.log('=== 诊断结果 ===');
      console.log(`总表数: ${results.summary.totalTables}`);
      console.log(`有数据的表: ${results.summary.tablesWithData}`);
      console.log(`总记录数: ${results.summary.totalRecords}`);
      console.log(`使用原始数据: ${results.summary.isUsingOriginalData}`);
      
    } catch (error) {
      console.error('诊断过程中出错:', error);
      results.error = error.message;
    }
    
    return results;
  }
  
  /**
   * 分析单个表
   */
  async analyzeTable(tableName) {
    const tableInfo = {
      name: tableName,
      exists: false,
      recordCount: 0,
      columns: [],
      sampleData: null,
      hasRealData: false,
      dataCharacteristics: {}
    };
    
    try {
      // 检查表是否存在并获取记录数
      const countResult = await database.executeSql(`SELECT COUNT(*) as count FROM ${tableName}`);
      tableInfo.exists = true;
      tableInfo.recordCount = countResult[0]?.count || 0;
      
      console.log(`表 ${tableName}: ${tableInfo.recordCount} 条记录`);
      
      if (tableInfo.recordCount > 0) {
        // 获取表结构
        const sampleResult = await database.executeSql(`SELECT * FROM ${tableName} LIMIT 1`);
        if (sampleResult.length > 0) {
          tableInfo.columns = Object.keys(sampleResult[0]);
          tableInfo.sampleData = sampleResult[0];
          
          // 分析数据特征
          tableInfo.dataCharacteristics = this.analyzeDataCharacteristics(sampleResult[0]);
          tableInfo.hasRealData = this.isRealData(sampleResult[0], tableName);
        }
        
        // 获取更多样本数据进行分析
        const moreData = await database.executeSql(`SELECT * FROM ${tableName} LIMIT 5`);
        if (moreData.length > 1) {
          tableInfo.hasVariedData = this.hasVariedData(moreData);
        }
      }
      
    } catch (error) {
      console.error(`分析表 ${tableName} 失败:`, error);
      tableInfo.error = error.message;
    }
    
    return tableInfo;
  }
  
  /**
   * 分析数据特征
   */
  analyzeDataCharacteristics(data) {
    const characteristics = {
      hasIds: false,
      hasTimestamps: false,
      hasRealContent: false,
      hasTestData: false,
      fieldCount: 0
    };
    
    if (!data) return characteristics;
    
    characteristics.fieldCount = Object.keys(data).length;
    
    // 检查是否有ID字段
    if (data.id !== undefined) {
      characteristics.hasIds = true;
    }
    
    // 检查是否有时间戳字段
    const timeFields = ['created_time', 'updated_time', 'create_time', 'update_time'];
    characteristics.hasTimestamps = timeFields.some(field => data[field] !== undefined);
    
    // 检查是否有实际内容
    const contentFields = ['name', 'project_name', 'description', 'point_number', 'line_number'];
    characteristics.hasRealContent = contentFields.some(field => {
      const value = data[field];
      return value && typeof value === 'string' && value.length > 0 && !value.startsWith('测试');
    });
    
    // 检查是否是测试数据
    const testKeywords = ['测试', 'test', 'TEST', 'demo', 'sample'];
    characteristics.hasTestData = Object.values(data).some(value => {
      if (typeof value === 'string') {
        return testKeywords.some(keyword => value.includes(keyword));
      }
      return false;
    });
    
    return characteristics;
  }
  
  /**
   * 判断是否是真实数据
   */
  isRealData(data, tableName) {
    if (!data) return false;
    
    // 检查是否有实际的业务数据
    const businessFields = {
      'projects': ['project_name', 'work_group'],
      'pipe_points': ['point_number', 'longitude', 'latitude'],
      'pipe_lines': ['line_number', 'start_point_id', 'end_point_id'],
      'pipe_categories': ['category_name', 'category_type'],
      'attribute_settings': ['attribute_name', 'display_name'],
      'features': ['feature_name', 'feature_type']
    };
    
    const relevantFields = businessFields[tableName] || [];
    
    // 检查关键字段是否有值
    const hasBusinessData = relevantFields.some(field => {
      const value = data[field];
      return value && value !== '' && value !== null && value !== undefined;
    });
    
    // 检查是否不是明显的测试数据
    const testKeywords = ['测试', 'test', 'TEST', 'demo', 'sample', 'field_'];
    const isNotTestData = !Object.values(data).some(value => {
      if (typeof value === 'string') {
        return testKeywords.some(keyword => value.includes(keyword));
      }
      return false;
    });
    
    return hasBusinessData && isNotTestData;
  }
  
  /**
   * 检查是否有多样化的数据
   */
  hasVariedData(dataArray) {
    if (dataArray.length < 2) return false;
    
    // 检查关键字段是否有不同的值
    const firstRow = dataArray[0];
    const keyFields = ['id', 'name', 'project_name', 'point_number', 'line_number'];
    
    return keyFields.some(field => {
      if (firstRow[field] === undefined) return false;
      
      const firstValue = firstRow[field];
      return dataArray.slice(1).some(row => row[field] !== firstValue);
    });
  }
  
  /**
   * 判断是否使用了原始数据
   */
  determineOriginalDataUsage(results) {
    const { tables, summary } = results;
    
    // 如果没有任何数据，肯定不是原始数据
    if (summary.totalRecords === 0) {
      return false;
    }
    
    // 如果只有很少的表有数据，可能不是原始数据
    if (summary.tablesWithData < 2) {
      return false;
    }
    
    // 检查是否有真实的业务数据
    const tablesWithRealData = Object.values(tables).filter(table => table.hasRealData).length;
    
    // 如果大部分有数据的表都包含真实数据，可能是原始数据
    return tablesWithRealData >= Math.max(1, Math.floor(summary.tablesWithData * 0.5));
  }
  
  /**
   * 生成建议
   */
  generateRecommendations(results) {
    const recommendations = [];
    const { summary, databaseType } = results;
    
    if (!results.isConnected) {
      recommendations.push('数据库未连接，请检查数据库初始化过程');
      return recommendations;
    }
    
    if (summary.totalRecords === 0) {
      recommendations.push('⚠️ 所有表都是空的，当前使用的是新创建的空表');
      recommendations.push('建议检查 static/database/base.db 文件是否存在');
      recommendations.push('建议重新复制原始数据库文件到正确位置');
    } else if (summary.isUsingOriginalData) {
      recommendations.push('✅ 检测到原始数据，数据库文件加载成功');
      recommendations.push(`当前使用 ${databaseType} 适配器，性能良好`);
    } else {
      recommendations.push('⚠️ 检测到数据但可能不是原始数据');
      recommendations.push('数据可能来自测试或初始化过程');
      recommendations.push('建议验证数据内容是否符合预期');
    }
    
    if (databaseType === 'storage') {
      recommendations.push('当前使用Storage适配器，建议在Android设备上测试原生SQLite');
    }
    
    return recommendations;
  }
  
  /**
   * 生成诊断报告
   */
  generateReport(results) {
    let report = '=== 数据库诊断报告 ===\n\n';
    
    report += `诊断时间: ${new Date(results.timestamp).toLocaleString()}\n`;
    report += `数据库类型: ${results.databaseType}\n`;
    report += `连接状态: ${results.isConnected ? '已连接' : '未连接'}\n\n`;
    
    report += '=== 数据统计 ===\n';
    report += `总表数: ${results.summary.totalTables}\n`;
    report += `有数据的表: ${results.summary.tablesWithData}\n`;
    report += `总记录数: ${results.summary.totalRecords}\n`;
    report += `使用原始数据: ${results.summary.isUsingOriginalData ? '是' : '否'}\n\n`;
    
    report += '=== 表详情 ===\n';
    Object.values(results.tables).forEach(table => {
      report += `${table.name}: ${table.recordCount} 条记录`;
      if (table.hasRealData) {
        report += ' (包含真实数据)';
      }
      report += '\n';
    });
    
    report += '\n=== 建议 ===\n';
    results.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    
    return report;
  }
}

export default new DatabaseDiagnostic();