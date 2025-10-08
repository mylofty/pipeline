<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库内容查看器</text>
      <view class="db-info">
        <text class="db-type">数据库类型: {{ dbType }}</text>
        <text class="db-status">状态: {{ dbStatus }}</text>
      </view>
    </view>
    
    <view class="table-selector">
      <text class="selector-title">选择表:</text>
      <picker @change="onTableChange" :value="selectedTableIndex" :range="tableNames">
        <view class="picker">
          {{ currentTable || '请选择表' }}
          <text class="picker-arrow">▼</text>
        </view>
      </picker>
    </view>
    
    <view class="table-info" v-if="currentTable">
      <view class="info-row">
        <text class="info-label">表名:</text>
        <text class="info-value">{{ currentTable }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">记录数:</text>
        <text class="info-value">{{ tableData.length }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">最后更新:</text>
        <text class="info-value">{{ lastUpdateTime }}</text>
      </view>
    </view>
    
    <view class="actions">
      <button @click="refreshData" class="btn">刷新数据</button>
      <button @click="exportTableData" class="btn secondary">导出表数据</button>
      <button @click="checkOriginalData" class="btn primary">检查原始数据</button>
    </view>
    
    <view class="data-container" v-if="tableData.length > 0">
      <text class="data-title">表数据 ({{ tableData.length }} 条记录):</text>
      
      <!-- 数据表格 -->
      <scroll-view scroll-x="true" class="table-scroll">
        <view class="data-table">
          <!-- 表头 -->
          <view class="table-header" v-if="tableColumns.length > 0">
            <view v-for="column in tableColumns" :key="column" class="table-cell header-cell">
              <text class="cell-text">{{ column }}</text>
            </view>
          </view>
          
          <!-- 数据行 -->
          <view v-for="(row, index) in displayData" :key="index" class="table-row">
            <view v-for="column in tableColumns" :key="column" class="table-cell">
              <text class="cell-text">{{ formatCellValue(row[column]) }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      
      <!-- 分页 -->
      <view class="pagination" v-if="tableData.length > pageSize">
        <button @click="prevPage" :disabled="currentPage <= 1" class="page-btn">上一页</button>
        <text class="page-info">{{ currentPage }} / {{ totalPages }}</text>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="page-btn">下一页</button>
      </view>
    </view>
    
    <view class="empty-data" v-else-if="currentTable">
      <text class="empty-text">该表暂无数据</text>
      <text class="empty-hint">这可能表示使用的是新创建的空表，而不是原始数据</text>
    </view>
    
    <!-- 原始数据验证结果 -->
    <view class="verification-result" v-if="verificationResult">
      <text class="result-title">原始数据验证结果:</text>
      <view v-for="(result, table) in verificationResult" :key="table" class="result-item">
        <text class="result-table">{{ table }}:</text>
        <text class="result-status" :class="{ 
          'has-data': result.hasData, 
          'no-data': !result.hasData 
        }">
          {{ result.hasData ? `有数据 (${result.count}条)` : '无数据 (可能是新表)' }}
        </text>
      </view>
    </view>
    
    <view class="logs">
      <text class="logs-title">操作日志:</text>
      <view v-for="(log, index) in logs" :key="index" class="log-item">
        <text class="log-text">{{ log }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import database from '@/utils/database.js';
import databaseDiagnostic from '@/utils/databaseDiagnostic.js';

export default {
  data() {
    return {
      dbType: '未知',
      dbStatus: '未初始化',
      tableNames: [
        'feature_appendant_entity',
              'project_manager',
      'pipe_point_entity', 
	  'pipe_line_entity',
      'pipe_Line_type_entity',
        'projects', 'pipe_points', 'pipe_lines', 
        'pipe_categories', 'attribute_settings', 'features',
        'virtual_lines', 'shared_pipes'
      ],
      selectedTableIndex: 0,
      currentTable: '',
      tableData: [],
      tableColumns: [],
      currentPage: 1,
      pageSize: 20,
      lastUpdateTime: '',
      verificationResult: null,
      logs: []
    };
  },
  
  computed: {
    displayData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.tableData.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.tableData.length / this.pageSize);
    }
  },
  
  onLoad() {
    this.addLog('数据库查看器启动');
    this.initViewer();
  },
  
  methods: {
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.logs.unshift(`[${timestamp}] ${message}`);
      if (this.logs.length > 30) {
        this.logs.pop();
      }
    },
    
    async initViewer() {
      try {
        // 检查数据库状态
        if (database.adapter) {
          this.dbType = database.adapter.getType ? database.adapter.getType() : '未知';
          this.dbStatus = database.adapter.isReady() ? '已连接' : '未连接';
        }
        
        this.addLog(`数据库类型: ${this.dbType}, 状态: ${this.dbStatus}`);
        
        // 默认选择第一个表
        if (this.tableNames.length > 0) {
          this.currentTable = this.tableNames[0];
          await this.loadTableData();
        }
      } catch (error) {
        this.addLog('初始化查看器失败: ' + error.message);
      }
    },
    
    onTableChange(e) {
      this.selectedTableIndex = e.detail.value;
      this.currentTable = this.tableNames[this.selectedTableIndex];
      this.currentPage = 1;
      this.loadTableData();
    },
    
    async loadTableData() {
      if (!this.currentTable) return;
      
      this.addLog(`加载表数据: ${this.currentTable}`);
      
      try {
        // 查询表数据
        const data = await database.executeSql(`SELECT * FROM ${this.currentTable}`);
        this.tableData = Array.isArray(data) ? data : [];
        
        // 获取表列名
        if (this.tableData.length > 0) {
          this.tableColumns = Object.keys(this.tableData[0]);
        } else {
          this.tableColumns = [];
        }
        
        this.lastUpdateTime = new Date().toLocaleString();
        this.addLog(`加载完成: ${this.tableData.length} 条记录`);
        
        // 如果有数据，显示前几条的详细信息
        if (this.tableData.length > 0) {
          this.addLog(`表结构: ${this.tableColumns.join(', ')}`);
          const firstRow = this.tableData[0];
          this.addLog(`第一条数据示例: ${JSON.stringify(firstRow).substring(0, 100)}...`);
        }
        
      } catch (error) {
        this.addLog(`加载表数据失败: ${error.message}`);
        this.tableData = [];
        this.tableColumns = [];
      }
    },
    
    async refreshData() {
      this.addLog('刷新数据...');
      await this.loadTableData();
    },
    
    async exportTableData() {
      if (this.tableData.length === 0) {
        uni.showToast({
          title: '没有数据可导出',
          icon: 'none'
        });
        return;
      }
      
      try {
        const jsonData = JSON.stringify(this.tableData, null, 2);
        
        // 显示数据预览
        uni.showModal({
          title: `${this.currentTable} 数据`,
          content: `共 ${this.tableData.length} 条记录\n\n${jsonData.substring(0, 500)}${jsonData.length > 500 ? '...' : ''}`,
          showCancel: true,
          cancelText: '关闭',
          confirmText: '复制',
          success: (res) => {
            if (res.confirm) {
              // 复制到剪贴板
              uni.setClipboardData({
                data: jsonData,
                success: () => {
                  uni.showToast({
                    title: '已复制到剪贴板',
                    icon: 'success'
                  });
                }
              });
            }
          }
        });
        
        this.addLog(`导出表数据: ${this.currentTable}, ${this.tableData.length} 条记录`);
      } catch (error) {
        this.addLog(`导出失败: ${error.message}`);
      }
    },
    
    async checkOriginalData() {
      this.addLog('开始运行完整数据库诊断...');
      
      uni.showLoading({
        title: '诊断中...'
      });
      
      try {
        const diagnosticResult = await databaseDiagnostic.runFullDiagnostic();
        
        // 更新验证结果显示
        const result = {};
        Object.values(diagnosticResult.tables).forEach(table => {
          result[table.name] = {
            hasData: table.recordCount > 0,
            count: table.recordCount,
            hasRealData: table.hasRealData,
            characteristics: table.dataCharacteristics
          };
        });
        
        this.verificationResult = result;
        
        // 生成详细报告
        const report = databaseDiagnostic.generateReport(diagnosticResult);
        this.addLog('诊断完成，生成详细报告');
        
        // 显示诊断结果
        const { summary } = diagnosticResult;
        let title, content;
        
        if (summary.totalRecords === 0) {
          title = '⚠️ 未检测到数据';
          content = '所有表都是空的，当前使用的是新创建的空表，而不是你原始的 base.db 数据。建议检查数据库文件是否正确放置在 static/database/base.db 位置。';
        } else if (summary.isUsingOriginalData) {
          title = '✅ 检测到原始数据';
          content = '成功检测到原始数据！统计信息：总记录数：' + summary.totalRecords + ' 条，有数据的表：' + summary.tablesWithData + '/' + summary.totalTables + ' 个，数据库类型：' + diagnosticResult.databaseType + '。这表明你的 base.db 文件已成功加载。';
        } else {
          title = '⚠️ 数据来源不确定';
          content = '检测到 ' + summary.totalRecords + ' 条记录，但可能不是原始数据。这些数据可能来自：测试数据、初始化过程、部分原始数据。建议查看具体表内容进行确认。';
        }
        
        uni.showModal({
          title: title,
          content: content,
          showCancel: true,
          cancelText: '关闭',
          confirmText: '查看报告',
          success: (res) => {
            if (res.confirm) {
              // 显示详细报告
              uni.showModal({
                title: '详细诊断报告',
                content: report.length > 1000 ? report.substring(0, 1000) + '...' : report,
                showCancel: true,
                cancelText: '关闭',
                confirmText: '复制报告',
                success: (res2) => {
                  if (res2.confirm) {
                    uni.setClipboardData({
                      data: report,
                      success: () => {
                        uni.showToast({
                          title: '报告已复制',
                          icon: 'success'
                        });
                      }
                    });
                  }
                }
              });
            }
          }
        });
        
      } catch (error) {
        this.addLog(`诊断失败: ${error.message}`);
        uni.showToast({
          title: '诊断失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    formatCellValue(value) {
      if (value === null || value === undefined) {
        return 'NULL';
      }
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 15px;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.db-info {
  display: flex;
  justify-content: space-between;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 6px;
}

.db-type, .db-status {
  font-size: 14px;
  color: #666;
}

.table-selector {
  margin-bottom: 15px;
}

.selector-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.picker-arrow {
  color: #999;
}

.table-info {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #007aff;
  color: white;
  font-size: 14px;
  min-width: 80px;
}

.btn.secondary {
  background-color: #6c757d;
}

.btn.primary {
  background-color: #28a745;
}

.data-container {
  margin-bottom: 20px;
}

.data-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.table-scroll {
  white-space: nowrap;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.data-table {
  display: inline-block;
  min-width: 100%;
}

.table-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  min-width: 120px;
  max-width: 200px;
  padding: 8px 12px;
  border-right: 1px solid #eee;
  overflow: hidden;
}

.table-cell:last-child {
  border-right: none;
}

.header-cell {
  background-color: #f8f9fa;
  font-weight: bold;
}

.cell-text {
  font-size: 12px;
  color: #333;
  word-break: break-all;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 14px;
}

.page-btn:disabled {
  opacity: 0.5;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.empty-data {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  display: block;
}

.empty-hint {
  font-size: 14px;
  color: #999;
  display: block;
}

.verification-result {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.result-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.result-table {
  font-size: 14px;
  color: #333;
}

.result-status {
  font-size: 14px;
  font-weight: bold;
}

.result-status.has-data {
  color: #28a745;
}

.result-status.no-data {
  color: #dc3545;
}

.logs {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.logs-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
  color: #333;
}

.log-item {
  margin-bottom: 5px;
  padding: 3px 8px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #007aff;
}

.log-text {
  font-size: 12px;
  color: #666;
  font-family: monospace;
}
</style>