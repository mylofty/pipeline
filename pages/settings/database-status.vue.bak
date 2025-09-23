<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库状态</text>
      <button @click="refreshStatus" class="refresh-btn">刷新</button>
    </view>
    
    <view class="status-section">
      <view class="section-title">连接状态</view>
      <view class="status-item" :class="{ success: connectionStatus.success, error: !connectionStatus.success }">
        <text class="status-text">{{ connectionStatus.message }}</text>
        <text class="status-icon">{{ connectionStatus.success ? '✓' : '✗' }}</text>
      </view>
    </view>
    
    <view class="status-section">
      <view class="section-title">数据表状态</view>
      <view v-for="(exists, tableName) in tableStatus" :key="tableName" class="status-item" :class="{ success: exists, error: !exists }">
        <text class="status-text">{{ tableName }}</text>
        <text class="status-icon">{{ exists ? '✓' : '✗' }}</text>
      </view>
    </view>
    
    <view class="status-section">
      <view class="section-title">数据统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-number">{{ stats.projectCount || 0 }}</text>
          <text class="stat-label">项目数量</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ stats.pointCount || 0 }}</text>
          <text class="stat-label">管点数量</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ stats.lineCount || 0 }}</text>
          <text class="stat-label">管线数量</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ stats.categoryCount || 0 }}</text>
          <text class="stat-label">管类数量</text>
        </view>
      </view>
    </view>
    
    <view class="actions">
      <button @click="runHealthCheck" class="action-btn primary">健康检查</button>
      <button @click="repairDatabase" class="action-btn warning">修复数据库</button>
      <button @click="backupDatabase" class="action-btn success">备份数据库</button>
    </view>
    
    <view v-if="healthResult" class="health-result">
      <view class="section-title">检查结果</view>
      <text class="result-text">{{ healthResult }}</text>
    </view>
    
    <!-- 加载提示 -->
    <view v-if="loading" class="loading-overlay">
      <view class="loading-content">
        <text>{{ loadingText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import dbChecker from '@/utils/dbCheck.js';
import database from '@/utils/database.js';
import dataService from '@/services/dataService.js';

export default {
  data() {
    return {
      loading: false,
      loadingText: '加载中...',
      connectionStatus: { success: false, message: '未检查' },
      tableStatus: {},
      stats: {},
      healthResult: ''
    };
  },
  
  async onLoad() {
    await this.refreshStatus();
  },
  
  methods: {
    async refreshStatus() {
      this.loading = true;
      this.loadingText = '检查数据库状态...';
      
      try {
        // 检查连接状态
        this.connectionStatus = await dbChecker.checkConnection();
        
        // 检查表状态
        const tableResult = await dbChecker.checkTables();
        this.tableStatus = tableResult.tables || {};
        
        // 获取数据统计
        await this.loadStats();
        
      } catch (error) {
        console.error('状态检查失败:', error);
        uni.showToast({
          title: '状态检查失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async loadStats() {
      try {
        // 项目数量
        const projects = await database.executeSql('SELECT COUNT(*) as count FROM projects WHERE is_active = 1');
        this.stats.projectCount = projects[0]?.count || 0;
        
        // 管点数量
        const points = await database.executeSql('SELECT COUNT(*) as count FROM pipe_points WHERE status = "active"');
        this.stats.pointCount = points[0]?.count || 0;
        
        // 管线数量
        const lines = await database.executeSql('SELECT COUNT(*) as count FROM pipe_lines WHERE status = "active"');
        this.stats.lineCount = lines[0]?.count || 0;
        
        // 管类数量
        const categories = await database.executeSql('SELECT COUNT(*) as count FROM pipe_categories WHERE is_active = 1');
        this.stats.categoryCount = categories[0]?.count || 0;
        
      } catch (error) {
        console.error('统计数据加载失败:', error);
      }
    },
    
    async runHealthCheck() {
      this.loading = true;
      this.loadingText = '执行健康检查...';
      
      try {
        const result = await dbChecker.healthCheck();
        this.healthResult = JSON.stringify(result, null, 2);
        
        if (result.success) {
          uni.showToast({
            title: '数据库状态良好',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: '发现问题，建议修复',
            icon: 'error'
          });
        }
      } catch (error) {
        this.healthResult = '健康检查失败: ' + error.message;
        uni.showToast({
          title: '健康检查失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async repairDatabase() {
      uni.showModal({
        title: '确认修复',
        content: '修复数据库将重新初始化表结构，是否继续？',
        success: async (res) => {
          if (res.confirm) {
            this.loading = true;
            this.loadingText = '修复数据库...';
            
            try {
              const result = await dbChecker.repairDatabase();
              
              if (result.success) {
                uni.showToast({
                  title: '修复成功',
                  icon: 'success'
                });
                await this.refreshStatus();
              } else {
                uni.showToast({
                  title: result.message,
                  icon: 'error'
                });
              }
            } catch (error) {
              uni.showToast({
                title: '修复失败',
                icon: 'error'
              });
            } finally {
              this.loading = false;
            }
          }
        }
      });
    },
    
    async backupDatabase() {
      this.loading = true;
      this.loadingText = '备份数据库...';
      
      try {
        const result = await dataService.backupDatabase();
        
        if (result.success) {
          uni.showToast({
            title: '备份成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: result.message,
            icon: 'error'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '备份失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.refresh-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
}

.status-section {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.status-item.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.status-item.error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.status-text {
  font-size: 14px;
  color: #333;
}

.status-icon {
  font-size: 16px;
  font-weight: bold;
}

.success .status-icon {
  color: #28a745;
}

.error .status-icon {
  color: #dc3545;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.action-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
}

.action-btn.primary {
  background-color: #007aff;
  color: white;
}

.action-btn.warning {
  background-color: #ffc107;
  color: #212529;
}

.action-btn.success {
  background-color: #28a745;
  color: white;
}

.health-result {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.result-text {
  font-size: 12px;
  color: #666;
  white-space: pre-wrap;
  word-break: break-all;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>