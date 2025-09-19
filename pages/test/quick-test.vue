<template>
  <view class="container">
    <view class="header">
      <text class="title">快速数据库测试</text>
    </view>
    
    <view class="status">
      <text class="status-text">数据库状态: {{ dbStatus }}</text>
    </view>
    
    <view class="actions">
      <button @click="testInit" class="btn">测试初始化</button>
      <button @click="testBasic" class="btn">测试基本操作</button>
      <button @click="clearLogs" class="btn secondary">清除日志</button>
    </view>
    
    <view class="logs">
      <text class="logs-title">测试日志:</text>
      <view v-for="(log, index) in logs" :key="index" class="log-item">
        <text class="log-text">{{ log }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import database from '@/utils/database.js';

export default {
  data() {
    return {
      dbStatus: '未知',
      logs: []
    };
  },
  
  onLoad() {
    this.addLog('页面加载完成');
    this.checkDatabaseStatus();
  },
  
  methods: {
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.logs.unshift(`[${timestamp}] ${message}`);
      if (this.logs.length > 50) {
        this.logs.pop();
      }
    },
    
    checkDatabaseStatus() {
      try {
        if (database && database.adapter) {
          this.dbStatus = '已初始化';
          this.addLog('数据库适配器已就绪');
        } else {
          this.dbStatus = '未初始化';
          this.addLog('数据库适配器未就绪');
        }
      } catch (error) {
        this.dbStatus = '错误';
        this.addLog('检查数据库状态失败: ' + error.message);
      }
    },
    
    async testInit() {
      this.addLog('开始测试数据库初始化...');
      
      try {
        const success = await database.initDatabase();
        if (success) {
          this.dbStatus = '初始化成功';
          this.addLog('✓ 数据库初始化成功');
        } else {
          this.dbStatus = '初始化失败';
          this.addLog('✗ 数据库初始化失败');
        }
      } catch (error) {
        this.dbStatus = '初始化错误';
        this.addLog('✗ 数据库初始化异常: ' + error.message);
      }
    },
    
    async testBasic() {
      this.addLog('开始测试基本操作...');
      
      try {
        // 测试建表
        await database.executeSql(`
          CREATE TABLE IF NOT EXISTS test_quick (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            value INTEGER
          )
        `);
        this.addLog('✓ 建表测试成功');
        
        // 测试插入
        const insertResult = await database.executeSql(
          'INSERT INTO test_quick (name, value) VALUES (?, ?)',
          ['快速测试', 999]
        );
        this.addLog('✓ 插入测试成功: ' + JSON.stringify(insertResult));
        
        // 测试查询
        const selectResult = await database.executeSql(
          'SELECT * FROM test_quick WHERE name = ?',
          ['快速测试']
        );
        this.addLog('✓ 查询测试成功: ' + JSON.stringify(selectResult));
        
        uni.showToast({
          title: '基本操作测试完成',
          icon: 'success'
        });
        
      } catch (error) {
        this.addLog('✗ 基本操作测试失败: ' + error.message);
        uni.showToast({
          title: '测试失败',
          icon: 'error'
        });
      }
    },
    
    clearLogs() {
      this.logs = [];
      this.addLog('日志已清除');
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

.status {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.status-text {
  font-size: 16px;
  color: #666;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
}

.btn.secondary {
  background-color: #6c757d;
}

.logs {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  max-height: 400px;
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
  margin-bottom: 8px;
  padding: 5px;
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