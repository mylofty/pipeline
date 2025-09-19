<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库重置工具</text>
      <text class="subtitle">解决数据库缓存问题，强制使用原始数据</text>
    </view>

    <!-- 当前状态 -->
    <view class="status-section">
      <text class="section-title">当前状态</text>
      <view class="status-item">
        <text class="status-label">数据库状态:</text>
        <text class="status-value" :class="dbStatus.connected ? 'success' : 'error'">
          {{ dbStatus.connected ? '已连接' : '未连接' }}
        </text>
      </view>
      <view class="status-item">
        <text class="status-label">项目数量:</text>
        <text class="status-value">{{ dbStatus.projectCount }}</text>
      </view>
      <view class="status-item">
        <text class="status-label">管点数量:</text>
        <text class="status-value">{{ dbStatus.pointCount }}</text>
      </view>
      <view class="status-item">
        <text class="status-label">管线数量:</text>
        <text class="status-value">{{ dbStatus.lineCount }}</text>
      </view>
    </view>

    <!-- 重置历史 -->
    <view class="history-section">
      <text class="section-title">重置历史</text>
      <view class="history-item" v-if="resetHistory.lastCompleteReset">
        <text class="history-label">上次完全重置:</text>
        <text class="history-value">{{ formatTime(resetHistory.lastCompleteReset) }}</text>
      </view>
      <view class="history-item" v-if="resetHistory.lastQuickReset">
        <text class="history-label">上次快速重置:</text>
        <text class="history-value">{{ formatTime(resetHistory.lastQuickReset) }}</text>
      </view>
      <view class="history-item" v-if="resetHistory.lastInitialized">
        <text class="history-label">上次初始化:</text>
        <text class="history-value">{{ formatTime(resetHistory.lastInitialized) }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <text class="section-title">重置操作</text>
      
      <button @click="checkOriginalFile" class="btn btn-info" :disabled="isProcessing">
        检查原始数据库文件
      </button>
      
      <button @click="quickReset" class="btn btn-warning" :disabled="isProcessing">
        快速重置 (清除缓存)
      </button>
      
      <button @click="completeReset" class="btn btn-danger" :disabled="isProcessing">
        完全重置 (重新复制文件)
      </button>
      
      <button @click="validateResult" class="btn btn-success" :disabled="isProcessing">
        验证重置效果
      </button>
    </view>

    <!-- 操作结果 -->
    <view class="result-section" v-if="operationResult">
      <text class="section-title">操作结果</text>
      <view class="result-content">
        <text class="result-message" :class="operationResult.success ? 'success' : 'error'">
          {{ operationResult.message }}
        </text>
        
        <!-- 详细步骤 -->
        <view v-if="operationResult.steps" class="steps-container">
          <text class="steps-title">详细步骤:</text>
          <view v-for="(step, index) in operationResult.steps" :key="index" class="step-item">
            <text class="step-text">{{ step }}</text>
          </view>
        </view>
        
        <!-- 详细信息 -->
        <view v-if="operationResult.details" class="details-container">
          <text class="details-title">详细信息:</text>
          <text class="details-text">{{ JSON.stringify(operationResult.details, null, 2) }}</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isProcessing" class="loading-overlay">
      <view class="loading-content">
        <text class="loading-text">{{ processingMessage }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import databaseReset from '@/utils/databaseReset.js';
import database from '@/utils/database.js';

export default {
  data() {
    return {
      isProcessing: false,
      processingMessage: '',
      operationResult: null,
      dbStatus: {
        connected: false,
        projectCount: 0,
        pointCount: 0,
        lineCount: 0
      },
      resetHistory: {}
    };
  },

  onLoad() {
    this.loadStatus();
    this.loadResetHistory();
  },

  methods: {
    /**
     * 加载数据库状态
     */
    async loadStatus() {
      try {
        // 检查数据库连接
        this.dbStatus.connected = database.adapter && database.adapter.isReady();
        
        if (this.dbStatus.connected) {
          // 获取数据量
          try {
            const projectsResult = await database.executeSql('SELECT COUNT(*) as count FROM projects');
            const pointsResult = await database.executeSql('SELECT COUNT(*) as count FROM pipe_points');
            const linesResult = await database.executeSql('SELECT COUNT(*) as count FROM pipe_lines');
            
            this.dbStatus.projectCount = projectsResult[0]?.count || 0;
            this.dbStatus.pointCount = pointsResult[0]?.count || 0;
            this.dbStatus.lineCount = linesResult[0]?.count || 0;
          } catch (error) {
            console.error('获取数据量失败:', error);
          }
        }
      } catch (error) {
        console.error('加载状态失败:', error);
        this.dbStatus.connected = false;
      }
    },

    /**
     * 加载重置历史
     */
    loadResetHistory() {
      this.resetHistory = databaseReset.getResetHistory();
    },

    /**
     * 检查原始数据库文件
     */
    async checkOriginalFile() {
      this.isProcessing = true;
      this.processingMessage = '检查原始数据库文件...';
      
      try {
        const result = await databaseReset.checkOriginalDatabaseFile();
        
        this.operationResult = {
          success: result.exists,
          message: result.exists ? 
            `原始文件存在 (${result.size} 字节)` : 
            `原始文件不存在: ${result.error || '未知错误'}`,
          details: result
        };
      } catch (error) {
        this.operationResult = {
          success: false,
          message: '检查原始文件失败: ' + error.message,
          error: error
        };
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * 快速重置
     */
    async quickReset() {
      this.isProcessing = true;
      this.processingMessage = '执行快速重置...';
      
      try {
        const result = await databaseReset.forceResetDatabase();
        this.operationResult = result;
        
        if (result.success) {
          // 重新加载状态
          await this.loadStatus();
          this.loadResetHistory();
        }
      } catch (error) {
        this.operationResult = {
          success: false,
          message: '快速重置失败: ' + error.message,
          error: error
        };
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * 完全重置
     */
    async completeReset() {
      // 确认操作
      const confirmed = await this.showConfirm(
        '完全重置将删除现有数据库并重新复制原始文件，确定继续吗？'
      );
      
      if (!confirmed) {
        return;
      }

      this.isProcessing = true;
      this.processingMessage = '执行完全重置...';
      
      try {
        const result = await databaseReset.performCompleteReset();
        this.operationResult = result;
        
        if (result.success) {
          // 重新加载状态
          await this.loadStatus();
          this.loadResetHistory();
        }
      } catch (error) {
        this.operationResult = {
          success: false,
          message: '完全重置失败: ' + error.message,
          error: error
        };
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * 验证重置效果
     */
    async validateResult() {
      this.isProcessing = true;
      this.processingMessage = '验证重置效果...';
      
      try {
        const result = await databaseReset.validateResetResult();
        this.operationResult = result;
        
        // 重新加载状态
        await this.loadStatus();
      } catch (error) {
        this.operationResult = {
          success: false,
          message: '验证失败: ' + error.message,
          error: error
        };
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * 显示确认对话框
     */
    showConfirm(message) {
      return new Promise((resolve) => {
        uni.showModal({
          title: '确认操作',
          content: message,
          success: (res) => {
            resolve(res.confirm);
          },
          fail: () => {
            resolve(false);
          }
        });
      });
    },

    /**
     * 格式化时间
     */
    formatTime(timeStr) {
      if (!timeStr) return '无';
      
      try {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN');
      } catch (error) {
        return timeStr;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

/* 状态部分 */
.status-section {
  background-color: white;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.status-label {
  font-size: 28rpx;
  color: #666;
}

.status-value {
  font-size: 28rpx;
  font-weight: bold;
}

.status-value.success {
  color: #4CAF50;
}

.status-value.error {
  color: #F44336;
}

/* 历史部分 */
.history-section {
  background-color: white;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.history-label {
  font-size: 28rpx;
  color: #666;
}

.history-value {
  font-size: 24rpx;
  color: #999;
}

/* 操作部分 */
.action-section {
  background-color: white;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.btn {
  width: 100%;
  margin-bottom: 20rpx;
  padding: 25rpx;
  border-radius: 10rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
}

.btn-info {
  background-color: #2196F3;
  color: white;
}

.btn-warning {
  background-color: #FF9800;
  color: white;
}

.btn-danger {
  background-color: #F44336;
  color: white;
}

.btn-success {
  background-color: #4CAF50;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
}

/* 结果部分 */
.result-section {
  background-color: white;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.result-message {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.result-message.success {
  color: #4CAF50;
}

.result-message.error {
  color: #F44336;
}

.steps-container {
  margin-top: 20rpx;
}

.steps-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.step-item {
  margin-bottom: 10rpx;
}

.step-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.details-container {
  margin-top: 20rpx;
}

.details-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.details-text {
  font-size: 24rpx;
  color: #666;
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 5rpx;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 40rpx;
  border-radius: 10rpx;
  text-align: center;
}

.loading-text {
  font-size: 30rpx;
  color: #333;
}
</style>