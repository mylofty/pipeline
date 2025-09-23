<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库文件管理</text>
    </view>
    
    <view class="file-info">
      <view class="info-item">
        <text class="label">数据库文件:</text>
        <text class="value">base.db</text>
      </view>
      <view class="info-item">
        <text class="label">文件位置:</text>
        <text class="value">{{ dbPath }}</text>
      </view>
      <view class="info-item">
        <text class="label">文件状态:</text>
        <text class="value" :class="{ success: fileExists, error: !fileExists }">
          {{ fileExists ? '已存在' : '不存在' }}
        </text>
      </view>
    </view>
    
    <view class="actions">
      <button @click="checkDatabaseFile" class="btn">检查数据库文件</button>
      <button @click="copyDatabaseFile" class="btn">复制数据库文件</button>
      <button @click="initializeDatabase" class="btn">初始化数据库</button>
      <button @click="viewDatabaseInfo" class="btn secondary">查看数据库信息</button>
    </view>
    
    <view class="instructions">
      <text class="instructions-title">数据库文件说明:</text>
      <text class="instruction-item">1. 数据库文件应放在 static/database/ 目录下</text>
      <text class="instruction-item">2. 文件名应为 base.db</text>
      <text class="instruction-item">3. 首次运行时会自动复制到本地目录</text>
      <text class="instruction-item">4. Android平台使用原生SQLite，其他平台使用备选方案</text>
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
import databaseLoader from '@/utils/databaseLoader.js';
import database from '@/utils/database.js';

export default {
  data() {
    return {
      dbPath: '',
      fileExists: false,
      logs: []
    };
  },
  
  onLoad() {
    this.addLog('页面加载完成');
    this.initPageData();
  },
  
  methods: {
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.logs.unshift(`[${timestamp}] ${message}`);
      if (this.logs.length > 20) {
        this.logs.pop();
      }
    },
    
    async initPageData() {
      try {
        this.dbPath = databaseLoader.getDatabasePath();
        this.addLog('获取数据库路径: ' + this.dbPath);
        await this.checkDatabaseFile();
      } catch (error) {
        this.addLog('初始化页面数据失败: ' + error.message);
      }
    },
    
    async checkDatabaseFile() {
      this.addLog('检查数据库文件...');
      
      try {
        this.fileExists = await databaseLoader.checkLocalFileExists();
        
        if (this.fileExists) {
          this.addLog('✓ 数据库文件存在');
          uni.showToast({
            title: '数据库文件存在',
            icon: 'success'
          });
        } else {
          this.addLog('✗ 数据库文件不存在');
          uni.showToast({
            title: '数据库文件不存在',
            icon: 'error'
          });
        }
      } catch (error) {
        this.addLog('检查数据库文件失败: ' + error.message);
        uni.showToast({
          title: '检查失败',
          icon: 'error'
        });
      }
    },
    
    async copyDatabaseFile() {
      this.addLog('开始复制数据库文件...');
      
      uni.showLoading({
        title: '复制中...'
      });
      
      try {
        const success = await databaseLoader.copyDatabaseToLocal();
        
        if (success) {
          this.fileExists = true;
          this.addLog('✓ 数据库文件复制成功');
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          });
        } else {
          this.addLog('✗ 数据库文件复制失败');
          uni.showToast({
            title: '复制失败',
            icon: 'error'
          });
        }
      } catch (error) {
        this.addLog('复制数据库文件异常: ' + error.message);
        uni.showToast({
          title: '复制异常',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    async initializeDatabase() {
      this.addLog('开始初始化数据库...');
      
      uni.showLoading({
        title: '初始化中...'
      });
      
      try {
        const success = await database.initDatabase();
        
        if (success) {
          this.addLog('✓ 数据库初始化成功');
          uni.showToast({
            title: '初始化成功',
            icon: 'success'
          });
        } else {
          this.addLog('✗ 数据库初始化失败');
          uni.showToast({
            title: '初始化失败',
            icon: 'error'
          });
        }
      } catch (error) {
        this.addLog('数据库初始化异常: ' + error.message);
        uni.showToast({
          title: '初始化异常',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    async viewDatabaseInfo() {
      this.addLog('查看数据库信息...');
      
      try {
        // 查询一些基本信息
        const projectCount = await database.executeSql('SELECT COUNT(*) as count FROM projects');
        const pointCount = await database.executeSql('SELECT COUNT(*) as count FROM pipe_points');
        const lineCount = await database.executeSql('SELECT COUNT(*) as count FROM pipe_lines');
        
        const info = `
项目数量: ${projectCount[0]?.count || 0}
管点数量: ${pointCount[0]?.count || 0}
管线数量: ${lineCount[0]?.count || 0}
        `;
        
        uni.showModal({
          title: '数据库信息',
          content: info,
          showCancel: false
        });
        
        this.addLog('数据库信息查看完成');
      } catch (error) {
        this.addLog('查看数据库信息失败: ' + error.message);
        uni.showToast({
          title: '查看失败',
          icon: 'error'
        });
      }
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

.file-info {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
}

.value.success {
  color: #28a745;
}

.value.error {
  color: #dc3545;
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

.instructions {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.instructions-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
  color: #333;
}

.instruction-item {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  line-height: 1.4;
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