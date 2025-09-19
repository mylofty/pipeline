/**
 * 数据库检查工具
 * 用于检查数据库是否正确初始化
 */
import database from '@/utils/database.js';

class DatabaseChecker {
  
  /**
   * 检查数据库连接
   */
  async checkConnection() {
    try {
      const result = await database.executeSql('SELECT 1 as test');
      return {
        success: true,
        message: '数据库连接正常'
      };
    } catch (error) {
      return {
        success: false,
        message: '数据库连接失败: ' + error.message
      };
    }
  }

  /**
   * 检查表是否存在
   */
  async checkTables() {
    const requiredTables = [
      'projects',
      'pipe_points', 
      'pipe_lines',
      'pipe_categories',
      'attribute_settings',
      'features',
      'virtual_lines',
      'shared_pipes'
    ];

    const results = {};
    
    for (const tableName of requiredTables) {
      try {
        const result = await database.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
          [tableName]
        );
        results[tableName] = result.length > 0;
      } catch (error) {
        results[tableName] = false;
      }
    }

    const allTablesExist = Object.values(results).every(exists => exists);
    
    return {
      success: allTablesExist,
      tables: results,
      message: allTablesExist ? '所有表都存在' : '部分表缺失'
    };
  }

  /**
   * 检查默认数据
   */
  async checkDefaultData() {
    try {
      // 检查管类设置
      const categories = await database.executeSql(
        'SELECT COUNT(*) as count FROM pipe_categories WHERE is_active = 1'
      );

      // 检查属性设置
      const attributes = await database.executeSql(
        'SELECT COUNT(*) as count FROM attribute_settings'
      );

      return {
        success: true,
        data: {
          categoriesCount: categories[0].count,
          attributesCount: attributes[0].count
        },
        message: '默认数据检查完成'
      };
    } catch (error) {
      return {
        success: false,
        message: '检查默认数据失败: ' + error.message
      };
    }
  }

  /**
   * 完整的数据库健康检查
   */
  async healthCheck() {
    const results = {
      connection: await this.checkConnection(),
      tables: await this.checkTables(),
      defaultData: await this.checkDefaultData()
    };

    const isHealthy = results.connection.success && 
                     results.tables.success && 
                     results.defaultData.success;

    return {
      success: isHealthy,
      results: results,
      message: isHealthy ? '数据库状态良好' : '数据库存在问题'
    };
  }

  /**
   * 修复数据库（重新初始化）
   */
  async repairDatabase() {
    try {
      const success = await database.initDatabase();
      return {
        success: success,
        message: success ? '数据库修复成功' : '数据库修复失败'
      };
    } catch (error) {
      return {
        success: false,
        message: '数据库修复失败: ' + error.message
      };
    }
  }
}

export default new DatabaseChecker();