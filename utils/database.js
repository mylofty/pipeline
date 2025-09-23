/**
 * SQLite数据库管理工具类
 * 用于管理管网数据采集系统的本地数据库
 */
import databaseLoader from '@/utils/databaseLoader.js';

class DatabaseManager {
  constructor() {
    this.dbName = 'base.db';
    this.adapter = null;
  }

  /**
   * 初始化数据库
   */
  async initDatabase(forceReset = false) {
    try {
      console.log('开始初始化数据库...', forceReset ? '(强制重置模式)' : '');
      
      // 如果是强制重置，先清理现有连接
      if (forceReset && this.adapter) {
        console.log('强制重置：清理现有数据库连接');
        this.adapter = null;
      }
      
      // 使用数据库文件加载器
      const dbPath = await databaseLoader.initDatabaseFile();
      const success = dbPath !== null;
      
      if (success) {
        this.adapter = databaseLoader;
        console.log(`数据库文件加载成功，路径: ${dbPath}`);
        
        // 记录初始化时间
        uni.setStorageSync('database_init_time', new Date().toISOString());
        
        return true;
      } else {
        console.error('数据库文件加载失败');
        return false;
      }
    } catch (error) {
      console.error('数据库初始化异常:', error);
      return false;
    }
  }

  /**
   * 执行SQL语句
   */
  async executeSql(sql, params = []) {
    if (!this.adapter) {
      throw new Error('数据库适配器未初始化');
    }
    
    try {
      const result = await this.adapter.executeSql(sql, params);
      return result;
    } catch (error) {
      console.error('SQL执行失败:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   */
  closeDatabase() {
    if (this.adapter) {
      this.adapter.close();
    }
  }
}

// 导出单例实例
export default new DatabaseManager();