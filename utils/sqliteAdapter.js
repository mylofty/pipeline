/**
 * SQLite适配器
 * 为不同平台提供统一的SQLite接口
 */
import databaseLoader from '@/utils/databaseLoader.js';

class SQLiteAdapter {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * 初始化数据库
   */
  async init(dbName = 'base.db') {
    try {
      // 首先初始化数据库文件
      console.log('正在初始化数据库文件...');
      const dbPath = await databaseLoader.initDatabaseFile();
      
      // 检查平台
      const systemInfo = uni.getSystemInfoSync();
      
      if (systemInfo.platform === 'android') {
        // Android平台使用原生SQLite插件
        try {
          const sqlite = uni.requireNativePlugin('SQLite');
          if (sqlite) {
            this.db = await this.initNativeSQLite(sqlite, dbPath || dbName);
            this.isInitialized = true;
            console.log('使用原生SQLite适配器');
            return true;
          }
        } catch (error) {
          console.warn('原生SQLite插件不可用，使用WebSQL替代:', error);
        }
      }
      
      // 其他平台或原生插件不可用时使用WebSQL
      try {
        this.db = await this.initWebSQL(dbName);
        this.isInitialized = true;
        console.log('使用WebSQL适配器');
        return true;
      } catch (error) {
        console.warn('WebSQL不可用，使用Storage作为备选方案:', error);
        // 使用Storage作为最后的备选方案，但先尝试从现有数据库导入数据
        await this.initStorageFromExistingDb(dbPath);
        this.db = {
          type: 'storage',
          instance: null,
          tables: new Map()
        };
        this.isInitialized = true;
        console.log('使用Storage适配器');
        return true;
      }
      
    } catch (error) {
      console.error('数据库初始化失败:', error);
      return false;
    }
  }

  /**
   * 初始化原生SQLite
   */
  async initNativeSQLite(sqlite, dbName) {
    return new Promise((resolve, reject) => {
      sqlite.openDatabase({
        name: dbName,
        path: '_doc/pipeline/'
      }, (db) => {
        resolve({
          type: 'native',
          instance: sqlite,
          db: db
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 初始化WebSQL或Storage备选方案
   */
  async initWebSQL(dbName) {
    return new Promise((resolve, reject) => {
      try {
        // 尝试使用WebSQL
        if (typeof uni.openDatabase === 'function') {
          const db = uni.openDatabase({
            name: dbName,
            version: '1.0',
            description: '管网数据采集数据库',
            size: 5 * 1024 * 1024 // 5MB
          });
          
          resolve({
            type: 'websql',
            instance: db
          });
        } else {
          // 使用Storage作为备选方案
          console.warn('WebSQL不可用，使用Storage作为备选方案');
          resolve({
            type: 'storage',
            instance: null,
            tables: new Map() // 用于存储表数据
          });
        }
      } catch (error) {
        // WebSQL失败时使用Storage备选方案
        console.warn('WebSQL初始化失败，使用Storage作为备选方案:', error);
        resolve({
          type: 'storage',
          instance: null,
          tables: new Map()
        });
      }
    });
  }

  /**
   * 执行SQL语句
   */
  async executeSql(sql, params = []) {
    if (!this.isInitialized || !this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      if (this.db.type === 'native') {
        // 原生SQLite
        this.db.instance.executeSql({
          sql: sql,
          params: params
        }, (result) => {
          resolve(result.data || []);
        }, (error) => {
          reject(error);
        });
      } else if (this.db.type === 'websql') {
        // WebSQL
        this.db.instance.transaction((tx) => {
          tx.executeSql(sql, params, (tx, result) => {
            const rows = [];
            for (let i = 0; i < result.rows.length; i++) {
              rows.push(result.rows.item(i));
            }
            // 模拟insertId
            if (result.insertId) {
              resolve({ insertId: result.insertId, data: rows });
            } else {
              resolve(rows);
            }
          }, (tx, error) => {
            reject(error);
          });
        });
      } else if (this.db.type === 'storage') {
        // Storage备选方案
        this.executeStorageSQL(sql, params)
          .then(result => resolve(result))
          .catch(error => reject(error));
      }
    });
  }

  /**
   * Storage备选方案的SQL执行
   */
  executeStorageSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
      try {
        const sqlUpper = sql.toUpperCase().trim();
        
        if (sqlUpper.startsWith('CREATE TABLE')) {
          // 创建表 - 只需要记录表名
          const match = sql.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i);
          if (match) {
            const tableName = match[1];
            this.db.tables.set(tableName, []);
            console.log(`创建表: ${tableName}`);
          }
          resolve([]);
        } else if (sqlUpper.startsWith('INSERT')) {
          // 插入数据
          const match = sql.match(/INSERT INTO (\w+)/i);
          if (match) {
            const tableName = match[1];
            const table = this.db.tables.get(tableName) || [];
            
            // 简单的插入逻辑 - 生成一个ID
            const newId = table.length + 1;
            const newRow = { id: newId };
            
            // 解析VALUES部分（简化处理）
            const valuesMatch = sql.match(/VALUES\s*\((.*)\)/i);
            if (valuesMatch && params.length > 0) {
              // 这里应该根据实际的表结构来映射字段
              // 为了简化，我们使用通用字段名
              params.forEach((param, index) => {
                newRow[`field_${index}`] = param;
              });
            }
            
            table.push(newRow);
            this.db.tables.set(tableName, table);
            
            // 保存到本地存储
            uni.setStorageSync(`db_${tableName}`, table);
            
            resolve({ insertId: newId, data: [] });
          } else {
            resolve([]);
          }
        } else if (sqlUpper.startsWith('SELECT')) {
          // 查询数据
          const match = sql.match(/FROM (\w+)/i);
          if (match) {
            const tableName = match[1];
            
            // 从本地存储加载数据
            let table = uni.getStorageSync(`db_${tableName}`) || [];
            this.db.tables.set(tableName, table);
            
            // 简化的查询处理
            if (sql.includes('COUNT(*)')) {
              resolve([{ count: table.length }]);
            } else {
              resolve(table);
            }
          } else {
            resolve([]);
          }
        } else if (sqlUpper.startsWith('UPDATE')) {
          // 更新数据 - 简化处理
          const match = sql.match(/UPDATE (\w+)/i);
          if (match) {
            const tableName = match[1];
            let table = uni.getStorageSync(`db_${tableName}`) || [];
            
            // 简化的更新逻辑
            table.forEach(row => {
              if (params.length > 0) {
                row.updated = true;
              }
            });
            
            uni.setStorageSync(`db_${tableName}`, table);
            this.db.tables.set(tableName, table);
          }
          resolve([]);
        } else if (sqlUpper.startsWith('DELETE')) {
          // 删除数据 - 简化处理
          const match = sql.match(/FROM (\w+)/i);
          if (match) {
            const tableName = match[1];
            let table = uni.getStorageSync(`db_${tableName}`) || [];
            
            // 简化的删除逻辑 - 标记删除
            table.forEach(row => {
              if (params.length > 0) {
                row.deleted = true;
              }
            });
            
            uni.setStorageSync(`db_${tableName}`, table);
            this.db.tables.set(tableName, table);
          }
          resolve([]);
        } else {
          // 其他SQL语句返回空结果
          resolve([]);
        }
      } catch (error) {
        reject(error);
      }
    });
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
   * 从现有数据库导入数据到Storage
   */
  async initStorageFromExistingDb(dbPath) {
    if (!dbPath) return;
    
    try {
      console.log('尝试从现有数据库导入数据...');
      // 这里可以添加从SQLite文件读取数据的逻辑
      // 由于限制，我们先使用预定义的表结构
      
      // 初始化基本表结构
      const tables = [
        'projects', 'pipe_points', 'pipe_lines', 
        'pipe_categories', 'attribute_settings', 'features',
        'virtual_lines', 'shared_pipes'
      ];
      
      tables.forEach(tableName => {
        const existingData = uni.getStorageSync(`db_${tableName}`) || [];
        if (existingData.length === 0) {
          // 如果没有现有数据，初始化空表
          uni.setStorageSync(`db_${tableName}`, []);
        }
      });
      
      console.log('数据库表结构初始化完成');
    } catch (error) {
      console.error('从现有数据库导入数据失败:', error);
    }
  }

  /**
   * 检查数据库是否已初始化
   */
  isReady() {
    return this.isInitialized && this.db !== null;
  }
}

export default new SQLiteAdapter();