<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库状态检查</text>
    </view>
    
    <view class="status-card">
      <text class="card-title">数据库信息</text>
      <view class="info-item">
        <text class="label">类型:</text>
        <text class="value">{{ dbType }}</text>
      </view>
      <view class="info-item">
        <text class="label">状态:</text>
        <text class="value">{{ dbStatus }}</text>
      </view>
    </view>
    
    <view class="actions">
      <button @click="checkAllTables" class="btn primary">检查所有表</button>
      <button @click="showTableData" class="btn">查看表数据</button>
    </view>
    
    <view class="results" v-if="checkResults.length > 0">
      <text class="results-title">检查结果:</text>
      <view v-for="(result, index) in checkResults" :key="index" class="result-item">
        <text class="result-text">{{ result }}</text>
      </view>
    </view>
    
    <view class="table-selector" v-if="showTables">
      <text class="selector-title">选择表查看数据:</text>
      <view class="table-buttons">
        <button 
          v-for="table in tableNames" 
          :key="table" 
          @click="viewTable(table)" 
          class="table-btn"
        >
          {{ table }}
        </button>
      </view>
    </view>
    
    <view class="table-data" v-if="currentTableData.length > 0">
      <text class="data-title">{{ currentTable }} ({{ currentTableData.length }} 条记录)</text>
      <scroll-view scroll-y="true" class="data-scroll">
        <view v-for="(item, index) in currentTableData.slice(0, 10)" :key="index" class="data-item">
          <text class="data-text">{{ formatData(item) }}</text>
        </view>
        <view v-if="currentTableData.length > 10" class="more-data">
          <text class="more-text">还有 {{ currentTableData.length - 10 }} 条记录...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import database from '@/utils/database.js';

export default {
  data() {
    return {
      dbType: '检测中...',
      dbStatus: '检测中...',
      checkResults: [],
      showTables: false,
      tableNames: [
        'projects', 'pipe_points', 'pipe_lines', 
        'pipe_categories', 'attribute_settings'
      ],
      currentTable: '',
      currentTableData: []
    };
  },
  
  onLoad() {
    this.initCheck();
  },
  
  methods: {
    initCheck() {
      try {
        if (database.adapter) {
          this.dbType = database.adapter.getType ? database.adapter.getType() : '未知';
          this.dbStatus = database.adapter.isReady() ? '已连接' : '未连接';
        } else {
          this.dbType = '未初始化';
          this.dbStatus = '未连接';
        }
      } catch (error) {
        this.dbType = '错误';
        this.dbStatus = '连接失败';
        console.error('数据库检查失败:', error);
      }
    },
    
    async checkAllTables() {
      this.checkResults = [];
      this.checkResults.push('开始检查所有表...');
      
      let totalRecords = 0;
      let tablesWithData = 0;
      
      for (const tableName of this.tableNames) {
        try {
          const data = await database.executeSql(`SELECT COUNT(*) as count FROM ${tableName}`);
          const count = data[0]?.count || 0;
          
          this.checkResults.push(`${tableName}: ${count} 条记录`);
          
          if (count > 0) {
            tablesWithData++;
            totalRecords += count;
          }
        } catch (error) {
          this.checkResults.push(`${tableName}: 查询失败`);
        }
      }
      
      this.checkResults.push('--- 汇总 ---');
      this.checkResults.push(`总记录数: ${totalRecords}`);
      this.checkResults.push(`有数据的表: ${tablesWithData}/${this.tableNames.length}`);
      
      if (totalRecords === 0) {
        this.checkResults.push('结论: 所有表都是空的，可能使用了新建的空表');
      } else if (tablesWithData >= 3) {
        this.checkResults.push('结论: 检测到大量数据，可能使用了原始数据');
      } else {
        this.checkResults.push('结论: 有少量数据，需要进一步检查');
      }
    },
    
    showTableData() {
      this.showTables = true;
    },
    
    async viewTable(tableName) {
      this.currentTable = tableName;
      this.currentTableData = [];
      
      try {
        const data = await database.executeSql(`SELECT * FROM ${tableName} LIMIT 20`);
        this.currentTableData = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(`查询表 ${tableName} 失败:`, error);
        uni.showToast({
          title: '查询失败',
          icon: 'error'
        });
      }
    },
    
    formatData(item) {
      if (!item) return 'null';
      
      const keys = Object.keys(item);
      const displayKeys = keys.slice(0, 3); // 只显示前3个字段
      
      let result = '';
      displayKeys.forEach(key => {
        const value = item[key];
        result += `${key}: ${value}, `;
      });
      
      if (keys.length > 3) {
        result += '...';
      }
      
      return result.replace(/, $/, ''); // 移除最后的逗号
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.status-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: #6c757d;
  color: white;
  font-size: 14px;
}

.btn.primary {
  background-color: #007aff;
}

.results {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.results-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.result-item {
  margin-bottom: 5px;
}

.result-text {
  font-size: 14px;
  color: #666;
  font-family: monospace;
}

.table-selector {
  margin-bottom: 20px;
}

.selector-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.table-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.table-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 12px;
}

.table-data {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
}

.data-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.data-scroll {
  max-height: 300px;
}

.data-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.data-text {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.more-data {
  text-align: center;
  padding: 10px;
}

.more-text {
  font-size: 14px;
  color: #999;
}
</style>