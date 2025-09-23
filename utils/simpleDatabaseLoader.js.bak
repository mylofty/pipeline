/**
 * 简单数据库加载器
 * 使用更简单的方式处理数据库文件
 */

class SimpleDatabaseLoader {
  constructor() {
    this.dbName = 'base.db';
    this.isInitialized = false;
  }

  /**
   * 初始化数据库
   */
  async init(forceReset = false) {
    try {
      console.log('使用简单数据库加载器', forceReset ? '(强制重置)' : '');
      
      // 如果是强制重置，重置初始化状态
      if (forceReset) {
        console.log('SimpleDatabaseLoader: 强制重置，清理初始化状态');
        this.isInitialized = false;
        if (this.storage) {
          this.storage.clear();
        }
      }
      
      // 检查是否已经初始化
      if (this.isInitialized && !forceReset) {
        console.log('SimpleDatabaseLoader: 已经初始化，跳过');
        return true;
      }
      
      // 检查平台
      const systemInfo = uni.getSystemInfoSync();
      console.log('当前平台:', systemInfo.platform);
      
      if (systemInfo.platform === 'android') {
        // Android平台尝试使用原生SQLite
        return await this.initAndroidDatabase();
      } else {
        // 其他平台使用Storage方案
        return await this.initStorageDatabase();
      }
    } catch (error) {
      console.error('简单数据库加载器初始化失败:', error);
      return false;
    }
  }

  /**
   * Android平台数据库初始化
   */
  async initAndroidDatabase() {
    try {
      // 尝试使用原生SQLite插件
      const sqlite = uni.requireNativePlugin('SQLite');
      if (sqlite) {
        console.log('找到原生SQLite插件');
        
        // 直接在应用目录创建数据库
        const dbPath = `${this.dbName}`;
        
        return new Promise((resolve) => {
          sqlite.openDatabase({
            name: dbPath,
            path: '_doc/'
          }, (db) => {
            console.log('原生SQLite数据库打开成功');
            this.db = {
              type: 'native',
              instance: sqlite,
              db: db
            };
            this.isInitialized = true;
            resolve(true);
          }, (error) => {
            console.error('原生SQLite数据库打开失败:', error);
            // 降级到Storage方案
            this.initStorageDatabase().then(resolve);
          });
        });
      } else {
        console.log('原生SQLite插件不可用，使用Storage方案');
        return await this.initStorageDatabase();
      }
    } catch (error) {
      console.error('Android数据库初始化失败:', error);
      return await this.initStorageDatabase();
    }
  }

  /**
   * Storage数据库初始化
   */
  async initStorageDatabase() {
    try {
      console.log('初始化Storage数据库');
      
      // 初始化基本表结构
      const tables = [
        'projects', 'pipe_points', 'pipe_lines', 
        'pipe_categories', 'attribute_settings', 'features',
        'virtual_lines', 'shared_pipes'
      ];
      
      // 检查并初始化表
      tables.forEach(tableName => {
        const existingData = uni.getStorageSync(`db_${tableName}`);
        if (!existingData) {
          // 初始化空表
          uni.setStorageSync(`db_${tableName}`, []);
          console.log(`初始化表: ${tableName}`);
        } else {
          console.log(`表已存在: ${tableName}, 记录数: ${existingData.length}`);
        }
      });
      
      this.db = {
        type: 'storage',
        instance: null,
        tables: new Map()
      };
      
      this.isInitialized = true;
      console.log('Storage数据库初始化成功');
      return true;
    } catch (error) {
      console.error('Storage数据库初始化失败:', error);
      return false;
    }
  }

  /**
   * 执行SQL语句
   */
  async executeSql(sql, params = []) {
    if (!this.isInitialized || !this.db) {
      throw new Error('数据库未初始化');
    }

    if (this.db.type === 'native') {
      // 原生SQLite
      return new Promise((resolve, reject) => {
        this.db.instance.executeSql({
          sql: sql,
          params: params
        }, (result) => {
          resolve(result.data || []);
        }, (error) => {
          reject(error);
        });
      });
    } else if (this.db.type === 'storage') {
      // Storage方案
      return this.executeStorageSQL(sql, params);
    }
  }

  /**
   * Storage SQL执行
   */
  async executeStorageSQL(sql, params = []) {
    const sqlUpper = sql.toUpperCase().trim();
    
    try {
      if (sqlUpper.startsWith('CREATE TABLE')) {
        // 创建表
        const match = sql.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i);
        if (match) {
          const tableName = match[1];
          const existingData = uni.getStorageSync(`db_${tableName}`) || [];
          if (existingData.length === 0) {
            uni.setStorageSync(`db_${tableName}`, []);
          }
          console.log(`表已准备: ${tableName}`);
        }
        return [];
      } else if (sqlUpper.startsWith('INSERT')) {
        // 插入数据
        const match = sql.match(/INSERT INTO (\w+)/i);
        if (match) {
          const tableName = match[1];
          let table = uni.getStorageSync(`db_${tableName}`) || [];
          
          // 生成新ID
          const newId = table.length + 1;
          const newRow = { 
            id: newId,
            created_time: new Date().toISOString(),
            updated_time: new Date().toISOString()
          };
          
          // 解析字段和值
          const columnsMatch = sql.match(/\((.*?)\)\s*VALUES/i);
          if (columnsMatch && params.length > 0) {
            const columns = columnsMatch[1].split(',').map(col => col.trim());
            columns.forEach((column, index) => {
              if (index < params.length) {
                newRow[column] = params[index];
              }
            });
          }
          
          table.push(newRow);
          uni.setStorageSync(`db_${tableName}`, table);
          
          return { insertId: newId };
        }
        return [];
      } else if (sqlUpper.startsWith('SELECT')) {
        // 查询数据
        const match = sql.match(/FROM (\w+)/i);
        if (match) {
          const tableName = match[1];
          let table = uni.getStorageSync(`db_${tableName}`) || [];
          
          // 处理COUNT查询
          if (sql.includes('COUNT(*)')) {
            return [{ count: table.length }];
          }
          
          // 简单的WHERE条件处理
          if (sql.includes('WHERE') && params.length > 0) {
            table = table.filter(row => {
              return Object.values(row).some(value => 
                params.some(param => value === param)
              );
            });
          }
          
          return table;
        }
        return [];
      } else if (sqlUpper.startsWith('UPDATE')) {
        // 更新数据
        const match = sql.match(/UPDATE (\w+)/i);
        if (match) {
          const tableName = match[1];
          let table = uni.getStorageSync(`db_${tableName}`) || [];
          
          // 简单的更新逻辑
          table.forEach(row => {
            row.updated_time = new Date().toISOString();
          });
          
          uni.setStorageSync(`db_${tableName}`, table);
        }
        return [];
      } else if (sqlUpper.startsWith('DELETE')) {
        // 删除数据（软删除）
        const match = sql.match(/FROM (\w+)/i);
        if (match) {
          const tableName = match[1];
          let table = uni.getStorageSync(`db_${tableName}`) || [];
          
          table.forEach(row => {
            row.deleted = true;
            row.updated_time = new Date().toISOString();
          });
          
          uni.setStorageSync(`db_${tableName}`, table);
        }
        return [];
      }
      
      return [];
    } catch (error) {
      console.error('Storage SQL执行失败:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库
   */
  close() {
    if (this.db && this.db.type === 'native') {
      try {
        this.db.instance.closeDatabase();
      } catch (error) {
        console.warn('关闭数据库失败:', error);
      }
    }
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * 检查是否已初始化
   */
  isReady() {
    return this.isInitialized && this.db !== null;
  }

  /**
   * 获取数据库类型
   */
  getType() {
    return this.db ? this.db.type : 'unknown';
  }
}

export default new SimpleDatabaseLoader();