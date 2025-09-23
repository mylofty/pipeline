/**
 * 数据库强制重置工具
 * 用于解决数据库缓存问题，强制使用原始数据
 */

class DatabaseReset {
  constructor() {
    this.originalDbPath = '/static/database/base.db';
    this.appDbPath = null; // 将在运行时确定
  }

  /**
   * 检查原始数据库文件是否存在
   */
  async checkOriginalDatabaseFile() {
    try {
      // 尝试读取原始文件信息
      const fileManager = uni.getFileSystemManager();
      
      return new Promise((resolve) => {
        fileManager.getFileInfo({
          filePath: this.originalDbPath,
          success: (res) => {
            resolve({
              exists: true,
              size: res.size,
              path: this.originalDbPath
            });
          },
          fail: (error) => {
            console.log('原始数据库文件检查失败:', error);
            resolve({
              exists: false,
              size: 0,
              path: this.originalDbPath,
              error: error.errMsg
            });
          }
        });
      });
    } catch (error) {
      return {
        exists: false,
        size: 0,
        path: this.originalDbPath,
        error: error.message
      };
    }
  }

  /**
   * 获取应用数据库路径
   */
  getAppDatabasePath() {
    if (this.appDbPath) {
      return this.appDbPath;
    }

    // 根据平台确定数据库路径
    // #ifdef APP-PLUS
    this.appDbPath = plus.io.convertLocalFileSystemURL('_doc/base.db');
    // #endif

    // #ifdef H5
    this.appDbPath = 'base.db'; // H5使用相对路径
    // #endif

    // #ifdef MP
    this.appDbPath = wx.env.USER_DATA_PATH + '/base.db'; // 小程序使用用户目录
    // #endif

    return this.appDbPath || 'base.db';
  }

  /**
   * 清除所有相关缓存
   */
  clearDatabaseCache() {
    const cacheKeys = [
      'database_initialized',
      'database_version',
      'database_init_time',
      'current_project_id',
      'last_sync_time',
      'database_schema_version'
    ];

    let clearedCount = 0;
    cacheKeys.forEach(key => {
      try {
        uni.removeStorageSync(key);
        clearedCount++;
      } catch (error) {
        console.warn(`清除缓存 ${key} 失败:`, error);
      }
    });

    // 记录清除时间
    uni.setStorageSync('database_cache_cleared', new Date().toISOString());
    
    return {
      success: true,
      clearedCount: clearedCount,
      totalKeys: cacheKeys.length
    };
  }

  /**
   * 删除现有数据库文件
   */
  async deleteExistingDatabase() {
    return new Promise((resolve) => {
      const fileManager = uni.getFileSystemManager();
      const dbPath = this.getAppDatabasePath();

      fileManager.unlink({
        filePath: dbPath,
        success: () => {
          console.log('现有数据库文件已删除:', dbPath);
          resolve({ success: true, path: dbPath });
        },
        fail: (error) => {
          // 文件不存在也算成功
          if (error.errMsg.includes('no such file')) {
            console.log('数据库文件不存在，无需删除');
            resolve({ success: true, path: dbPath, note: '文件不存在' });
          } else {
            console.error('删除数据库文件失败:', error);
            resolve({ success: false, path: dbPath, error: error.errMsg });
          }
        }
      });
    });
  }

  /**
   * 强制复制原始数据库文件
   */
  async forceCopyOriginalDatabase() {
    return new Promise(async (resolve, reject) => {
      try {
        // 首先检查原始文件
        const originalCheck = await this.checkOriginalDatabaseFile();
        if (!originalCheck.exists) {
          reject(new Error('原始数据库文件不存在: ' + this.originalDbPath));
          return;
        }

        const fileManager = uni.getFileSystemManager();
        const targetPath = this.getAppDatabasePath();

        // 确保目标目录存在
        const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/'));
        if (targetDir) {
          try {
            fileManager.mkdirSync(targetDir, true);
          } catch (error) {
            // 目录可能已存在，忽略错误
          }
        }

        // 复制文件
        fileManager.copyFile({
          srcPath: this.originalDbPath,
          destPath: targetPath,
          success: () => {
            console.log('数据库文件复制成功:', this.originalDbPath, '->', targetPath);
            resolve({
              success: true,
              srcPath: this.originalDbPath,
              destPath: targetPath,
              size: originalCheck.size
            });
          },
          fail: (error) => {
            console.error('数据库文件复制失败:', error);
            reject(new Error('复制失败: ' + error.errMsg));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 快速重置数据库（清除缓存并重新初始化）
   */
  async forceResetDatabase() {
    try {
      console.log('开始快速重置数据库...');
      
      // 1. 清除缓存
      const cacheResult = this.clearDatabaseCache();
      console.log('缓存清除结果:', cacheResult);

      // 2. 重新初始化数据库
      const database = require('@/utils/database.js').default;
      const initResult = await database.initDatabase();

      if (initResult) {
        // 记录重置时间
        uni.setStorageSync('database_reset_time', new Date().toISOString());
        
        return {
          success: true,
          message: '快速重置成功！数据库已重新初始化。',
          details: {
            cacheCleared: cacheResult.clearedCount,
            databaseInitialized: true
          }
        };
      } else {
        return {
          success: false,
          message: '数据库重新初始化失败',
          details: {
            cacheCleared: cacheResult.clearedCount,
            databaseInitialized: false
          }
        };
      }
    } catch (error) {
      console.error('快速重置失败:', error);
      return {
        success: false,
        message: '快速重置失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 完全重置数据库（删除现有文件并重新复制）
   */
  async performCompleteReset() {
    const steps = [];
    let success = true;

    try {
      steps.push('🔄 开始完全重置数据库...');

      // 1. 检查原始文件
      steps.push('📁 检查原始数据库文件...');
      const originalCheck = await this.checkOriginalDatabaseFile();
      if (originalCheck.exists) {
        steps.push(`✓ 原始文件存在 (${originalCheck.size} 字节)`);
      } else {
        steps.push('❌ 原始文件不存在');
        success = false;
      }

      if (!success) {
        return {
          success: false,
          message: '原始数据库文件不存在，无法进行完全重置',
          steps: steps
        };
      }

      // 2. 清除缓存
      steps.push('🗑️ 清除数据库缓存...');
      const cacheResult = this.clearDatabaseCache();
      steps.push(`✓ 已清除 ${cacheResult.clearedCount} 个缓存项`);

      // 3. 删除现有数据库
      steps.push('🗑️ 删除现有数据库文件...');
      const deleteResult = await this.deleteExistingDatabase();
      if (deleteResult.success) {
        steps.push(`✓ 现有数据库已删除: ${deleteResult.path}`);
      } else {
        steps.push(`⚠️ 删除现有数据库失败: ${deleteResult.error}`);
      }

      // 4. 复制原始文件
      steps.push('📋 复制原始数据库文件...');
      try {
        const copyResult = await this.forceCopyOriginalDatabase();
        steps.push(`✓ 原始文件复制成功 (${copyResult.size} 字节)`);
      } catch (error) {
        steps.push(`❌ 复制原始文件失败: ${error.message}`);
        success = false;
      }

      // 5. 重新初始化数据库
      if (success) {
        steps.push('🔄 重新初始化数据库...');
        try {
          const database = require('@/utils/database.js').default;
          const initResult = await database.initDatabase();
          
          if (initResult) {
            steps.push('✓ 数据库初始化成功');
            
            // 记录完全重置时间
            uni.setStorageSync('database_complete_reset_time', new Date().toISOString());
          } else {
            steps.push('❌ 数据库初始化失败');
            success = false;
          }
        } catch (error) {
          steps.push(`❌ 数据库初始化异常: ${error.message}`);
          success = false;
        }
      }

      steps.push(success ? '🎉 完全重置成功！' : '❌ 完全重置失败');

      return {
        success: success,
        message: success ? 
          '完全重置成功！数据库已使用原始文件重新初始化。' : 
          '完全重置过程中出现错误，请查看详细步骤。',
        steps: steps
      };

    } catch (error) {
      steps.push(`❌ 完全重置异常: ${error.message}`);
      return {
        success: false,
        message: '完全重置过程中发生异常: ' + error.message,
        steps: steps,
        error: error
      };
    }
  }

  /**
   * 验证数据库重置效果
   */
  async validateResetResult() {
    try {
      const database = require('@/utils/database.js').default;
      
      // 检查数据库连接
      if (!database.adapter || !database.adapter.isReady()) {
        return {
          success: false,
          message: '数据库未连接',
          details: {}
        };
      }

      // 检查数据量
      const projectsResult = await database.executeSql('SELECT COUNT(*) as count FROM projects');
      const pointsResult = await database.executeSql('SELECT COUNT(*) as count FROM pipe_points');
      const linesResult = await database.executeSql('SELECT COUNT(*) as count FROM pipe_lines');

      const projectCount = projectsResult[0]?.count || 0;
      const pointCount = pointsResult[0]?.count || 0;
      const lineCount = linesResult[0]?.count || 0;

      const isLikelyOriginalData = projectCount > 0 && pointCount > 100; // 假设原始数据有较多管点

      return {
        success: true,
        message: isLikelyOriginalData ? '验证成功，数据似乎是原始数据' : '验证完成，但数据量较少',
        details: {
          projectCount: projectCount,
          pointCount: pointCount,
          lineCount: lineCount,
          isLikelyOriginalData: isLikelyOriginalData
        }
      };

    } catch (error) {
      return {
        success: false,
        message: '验证过程中出错: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 获取重置历史记录
   */
  getResetHistory() {
    try {
      return {
        lastCacheCleared: uni.getStorageSync('database_cache_cleared'),
        lastQuickReset: uni.getStorageSync('database_reset_time'),
        lastCompleteReset: uni.getStorageSync('database_complete_reset_time'),
        lastInitialized: uni.getStorageSync('database_init_time')
      };
    } catch (error) {
      return {
        error: error.message
      };
    }
  }
}

// 导出单例
export default new DatabaseReset();