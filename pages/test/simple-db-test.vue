<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库简单测试</text>
      <button @click="runTest" class="test-btn">运行测试</button>
    </view>
    
    <view class="test-results">
      <view v-for="(result, test) in testResults" :key="test" class="test-item">
        <text class="test-name">{{ getTestName(test) }}</text>
        <text class="test-status" :class="{ success: result, failed: !result }">
          {{ result ? '✓ 通过' : '✗ 失败' }}
        </text>
      </view>
    </view>
    
    <view class="actions">
      <button @click="testBasicOperations" class="action-btn">测试基本操作</button>
      <button @click="testProjectService" class="action-btn">测试项目服务</button>
      <button @click="clearTestData" class="action-btn warning">清除测试数据</button>
    </view>
    
    <view class="logs">
      <text class="logs-title">测试日志:</text>
      <text v-for="(log, index) in logs" :key="index" class="log-item">{{ log }}</text>
    </view>
  </view>
</template>

<script>
import database from '@/utils/database.js';
import databaseTest from '@/utils/databaseTest.js';
import projectService from '@/services/projectService.js';

export default {
  data() {
    return {
      testResults: {},
      logs: []
    };
  },
  
  methods: {
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.logs.unshift(`[${timestamp}] ${message}`);
      if (this.logs.length > 20) {
        this.logs.pop();
      }
    },
    
    async runTest() {
      this.addLog('开始运行完整测试...');
      
      try {
        const results = await databaseTest.runAllTests();
        this.testResults = results;
        
        const passedTests = Object.values(results).filter(r => r).length;
        const totalTests = Object.keys(results).length;
        
        this.addLog(`测试完成: ${passedTests}/${totalTests} 通过`);
        
        uni.showToast({
          title: `测试完成 ${passedTests}/${totalTests}`,
          icon: passedTests === totalTests ? 'success' : 'error'
        });
      } catch (error) {
        this.addLog('测试失败: ' + error.message);
        uni.showToast({
          title: '测试失败',
          icon: 'error'
        });
      }
    },
    
    async testBasicOperations() {
      this.addLog('测试基本数据库操作...');
      
      try {
        // 测试插入
        const insertResult = await database.executeSql(
          'INSERT INTO projects (project_name, work_group) VALUES (?, ?)',
          ['测试项目', 'TEST']
        );
        this.addLog('插入测试: ' + (insertResult.insertId ? '成功' : '失败'));
        
        // 测试查询
        const selectResult = await database.executeSql(
          'SELECT * FROM projects WHERE project_name = ?',
          ['测试项目']
        );
        this.addLog('查询测试: ' + (selectResult.length > 0 ? '成功' : '失败'));
        
        uni.showToast({
          title: '基本操作测试完成',
          icon: 'success'
        });
      } catch (error) {
        this.addLog('基本操作测试失败: ' + error.message);
        uni.showToast({
          title: '测试失败',
          icon: 'error'
        });
      }
    },
    
    async testProjectService() {
      this.addLog('测试项目服务...');
      
      try {
        // 测试创建项目
        const createResult = await projectService.createProject({
          project_name: '服务测试项目_' + Date.now(),
          work_group: 'SERVICE_TEST'
        });
        
        this.addLog('创建项目: ' + (createResult.success ? '成功' : '失败'));
        
        if (createResult.success) {
          // 测试获取项目列表
          const listResult = await projectService.getAllProjects();
          this.addLog('获取项目列表: ' + (listResult.success ? '成功' : '失败'));
          
          // 测试设置当前项目
          const setResult = await projectService.setCurrentProject(createResult.projectId);
          this.addLog('设置当前项目: ' + (setResult.success ? '成功' : '失败'));
        }
        
        uni.showToast({
          title: '项目服务测试完成',
          icon: 'success'
        });
      } catch (error) {
        this.addLog('项目服务测试失败: ' + error.message);
        uni.showToast({
          title: '测试失败',
          icon: 'error'
        });
      }
    },
    
    async clearTestData() {
      uni.showModal({
        title: '确认清除',
        content: '确定要清除所有测试数据吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 清除本地存储的数据库数据
              const tableNames = [
                'projects', 'pipe_points', 'pipe_lines', 
                'pipe_categories', 'attribute_settings', 'features',
                'virtual_lines', 'shared_pipes', 'test_table'
              ];
              
              for (const tableName of tableNames) {
                uni.removeStorageSync(`db_${tableName}`);
              }
              
              this.addLog('测试数据已清除');
              this.testResults = {};
              
              uni.showToast({
                title: '数据已清除',
                icon: 'success'
              });
            } catch (error) {
              this.addLog('清除数据失败: ' + error.message);
              uni.showToast({
                title: '清除失败',
                icon: 'error'
              });
            }
          }
        }
      });
    },
    
    getTestName(test) {
      const names = {
        initialization: '数据库初始化',
        createTable: '创建表',
        insert: '插入数据',
        select: '查询数据',
        update: '更新数据',
        delete: '删除数据'
      };
      return names[test] || test;
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.test-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
}

.test-results {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.test-item:last-child {
  border-bottom: none;
}

.test-name {
  font-size: 14px;
  color: #333;
}

.test-status {
  font-size: 14px;
  font-weight: bold;
}

.test-status.success {
  color: #28a745;
}

.test-status.failed {
  color: #dc3545;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.action-btn {
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #007aff;
  color: white;
  font-size: 14px;
}

.action-btn.warning {
  background-color: #ffc107;
  color: #212529;
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
}

.log-item {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-family: monospace;
}
</style>