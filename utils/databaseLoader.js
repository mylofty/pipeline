/**
 * 数据库文件加载器
 * 用于加载现有的SQLite数据库文件
 */

class DatabaseLoader {
  constructor() {
    this.dbPath = '/static/database/base.db';
    this.localDbPath = '_doc/pipeline/base.db';
    this.fallbackDbName = 'base.db';
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * 复制数据库文件到本地目录
   */
  async copyDatabaseToLocal() {
    try {
      // 检查本地文件是否已存在
      const localExists = await this.checkLocalFileExists();
      if (localExists) {
        console.log('本地数据库文件已存在，强制覆盖为最新版本');
        console.log('删除旧文件:', this.localDbPath);
        
        // 删除现有文件
        const deleteSuccess = await this.deleteLocalFile();
        if (!deleteSuccess) {
          console.warn('删除旧数据库文件失败，尝试直接覆盖');
        }
      }

      console.log('开始复制数据库文件...');
      console.log('源文件路径:', this.dbPath);
      console.log('目标文件路径:', this.localDbPath);

      // 从static目录复制数据库文件到本地
      const success = await this.copyFile(this.dbPath, this.localDbPath);
      if (success) {
        console.log('数据库文件复制成功');
        return true;
      } else {
        console.error('数据库文件复制失败，将使用备选方案');
        return false;
      }
    } catch (error) {
      console.error('复制数据库文件时出错:', error);
      return false;
    }
  }

  /**
   * 检查本地文件是否存在
   */
  async checkLocalFileExists() {
    return new Promise((resolve) => {
      // #ifdef APP-PLUS
      plus.io.resolveLocalFileSystemURL(this.localDbPath, 
        () => resolve(true),
        () => resolve(false)
      );
      // #endif
      
      // #ifndef APP-PLUS
      // 非App环境，假设文件不存在
      resolve(false);
      // #endif
    });
  }

  /**
   * 删除本地数据库文件
   */
  async deleteLocalFile() {
    return new Promise((resolve) => {
      // #ifdef APP-PLUS
      try {
        plus.io.resolveLocalFileSystemURL(this.localDbPath, 
          (fileEntry) => {
            fileEntry.remove(
              () => {
                console.log('旧数据库文件删除成功');
                resolve(true);
              },
              (error) => {
                console.error('删除旧数据库文件失败:', error);
                resolve(false);
              }
            );
          },
          (error) => {
            console.log('旧数据库文件不存在，无需删除');
            resolve(true);
          }
        );
      } catch (error) {
        console.error('删除文件异常:', error);
        resolve(false);
      }
      // #endif
      
      // #ifndef APP-PLUS
      // 非App环境，假设删除成功
      resolve(true);
      // #endif
    });
  }

  /**
   * 创建目录
   */
  async createDirectory(dirPath) {
    return new Promise((resolve) => {
      // #ifdef APP-PLUS
      try {
        plus.io.resolveLocalFileSystemURL(
          plus.io.convertLocalFileSystemURL('_doc/'),
          (docEntry) => {
            docEntry.getDirectory('pipeline', {
              create: true,
              exclusive: false
            }, (pipelineEntry) => {
              console.log('目录创建成功:', pipelineEntry.fullPath);
              resolve(true);
            }, (error) => {
              console.error('创建pipeline目录失败:', error);
              resolve(false);
            });
          },
          (error) => {
            console.error('无法访问_doc目录:', error);
            resolve(false);
          }
        );
      } catch (error) {
        console.error('创建目录异常:', error);
        resolve(false);
      }
      // #endif
      
      // #ifndef APP-PLUS
      resolve(true);
      // #endif
    });
  }

  /**
   * 复制文件
   */
  async copyFile(sourcePath, targetPath) {
    return new Promise(async (resolve) => {
      // #ifdef APP-PLUS
      try {
        // 首先确保目标目录存在
        const dirCreated = await this.createDirectory();
        if (!dirCreated) {
          console.error('无法创建目标目录');
          resolve(false);
          return;
        }

        // 获取应用资源目录中的数据库文件
        plus.io.resolveLocalFileSystemURL(
          plus.io.convertLocalFileSystemURL(sourcePath),
          (sourceEntry) => {
            // 获取目标目录
            plus.io.resolveLocalFileSystemURL(
              plus.io.convertLocalFileSystemURL('_doc/pipeline/'),
              (targetDirEntry) => {
                // 复制文件（覆盖模式）
                sourceEntry.copyTo(
                  targetDirEntry,
                  'base.db',
                  () => {
                    console.log('文件复制成功（已覆盖旧文件）');
                    resolve(true);
                  },
                  (error) => {
                    console.error('文件复制失败:', error);
                    // 如果复制失败，可能是因为文件已存在，尝试先删除再复制
                    console.log('尝试删除目标文件后重新复制...');
                    plus.io.resolveLocalFileSystemURL(
                      plus.io.convertLocalFileSystemURL('_doc/pipeline/base.db'),
                      (existingFile) => {
                        existingFile.remove(() => {
                          // 删除成功后重新复制
                          sourceEntry.copyTo(
                            targetDirEntry,
                            'base.db',
                            () => {
                              console.log('删除旧文件后复制成功');
                              resolve(true);
                            },
                            (retryError) => {
                              console.error('重试复制仍然失败:', retryError);
                              resolve(false);
                            }
                          );
                        }, (deleteError) => {
                          console.error('删除旧文件失败:', deleteError);
                          resolve(false);
                        });
                      },
                      () => {
                        // 文件不存在，直接返回失败
                        resolve(false);
                      }
                    );
                  }
                );
              },
              (error) => {
                console.error('无法访问目标目录:', error);
                resolve(false);
              }
            );
          },
          (error) => {
            console.error('无法访问源文件:', error);
            resolve(false);
          }
        );
      } catch (error) {
        console.error('复制文件异常:', error);
        resolve(false);
      }
      // #endif
      
      // #ifndef APP-PLUS
      // 非App环境，无法复制文件
      console.warn('非App环境，无法复制数据库文件');
      resolve(false);
      // #endif
    });
  }

  /**
   * 获取数据库文件路径
   */
  getDatabasePath() {
    // #ifdef APP-PLUS
    return this.localDbPath;
    // #endif
    
    // #ifndef APP-PLUS
    return this.dbPath;
    // #endif
  }

  /**
   * 初始化数据库文件
   */
  async initDatabaseFile() {
    try {
      // 避免重复初始化
      if (this.isInitialized && this.db) {
        console.log('数据库已初始化，直接返回现有路径');
        return this.getDatabasePath();
      }
      // 在App环境下复制数据库文件
      // #ifdef APP-PLUS
      const copySuccess = await this.copyDatabaseToLocal();
      if (!copySuccess) {
        console.warn('数据库文件复制失败，将使用空数据库');
      }
      // #endif

      const dbPath = this.getDatabasePath();
      
      // 初始化SQLite连接
      await this.initSQLiteConnection(dbPath);
      
      return dbPath;
    } catch (error) {
      console.error('初始化数据库文件失败:', error);
      return null;
    }
  }

  /**
   * 初始化SQLite连接
   */
  async initSQLiteConnection(dbPath) {
    try {
      // 检查平台
      const systemInfo = uni.getSystemInfoSync();
      console.log('当前平台:', systemInfo.platform);
      
      // #ifdef APP-PLUS
      // 使用plus.sqlite API
      if (plus.sqlite) {
        console.log('找到SQLite API，连接现有数据库');
        
        return new Promise((resolve, reject) => {
          try {
            // 避免重复初始化
            if (this.isInitialized && this.db) {
              console.log('数据库已初始化，直接返回');
              resolve(true);
              return;
            }
            
            console.log('尝试打开数据库名称:', this.fallbackDbName);
            console.log('数据库目录路径:', '_doc/pipeline/');
            
            plus.sqlite.openDatabase({
              name: this.fallbackDbName,
              path: this.localDbPath,
              success: (e) => {
                console.log('SQLite数据库连接成功:', JSON.stringify(e));
                this.db = {
                  type: 'plus_sqlite',
                  instance: plus.sqlite,
                  db: e
                };
                this.isInitialized = true;
                resolve(true);
              },
              fail: (e) => {
                console.error('SQLite数据库连接失败:', JSON.stringify(e));
                console.error('错误分析: 数据库名称:', this.fallbackDbName);
                console.error('错误分析: 当前实例状态 - isInitialized:', this.isInitialized);
                console.error('错误分析: 当前db对象:', this.db);
                
                // 显示弹窗提醒用户数据库初始化失败
                uni.showModal({
                  title: '数据库初始化失败',
                  content: 'SQLite数据库连接失败，系统将自动切换到备用存储方案。这可能会影响部分功能的性能，但不会影响数据的正常使用。',
                  showCancel: false,
                  confirmText: '我知道了',
                  success: () => {
                    console.log('用户已确认数据库初始化失败提醒');
                  }
                });
                
                // 回退到Storage方案
                this.initStorageWithExistingData().then(() => resolve(true)).catch(reject);
              }
            });
          } catch (error) {
            console.error('SQLite API调用异常:', error);
            // 回退到Storage方案
            this.initStorageWithExistingData().then(() => resolve(true)).catch(reject);
          }
        });
      }
      // #endif
      
      // 其他平台或原生插件不可用时，使用Storage方案
      console.log('原生SQLite不可用，使用Storage备用方案');
      await this.initStorageWithExistingData();
      
    } catch (error) {
      console.error('SQLite连接初始化失败:', error);
      throw error;
    }
  }

  /**
   * 打开新的数据库连接
   */
  openNewDatabase_bak(resolve, reject) {
    const dbPath = plus.io.convertLocalFileSystemURL(this.localDbPath);
    console.log('尝试打开数据库:', dbPath);
    
    plus.sqlite.openDatabase({
      name: this.fallbackDbName,
      path: '_doc/pipeline/',
      success: (e) => {
        console.log('SQLite数据库连接成功:', JSON.stringify(e));
        this.db = {
          type: 'plus_sqlite',
          instance: plus.sqlite,
          db: e
        };
        this.isInitialized = true;
        resolve(true);
      },
      fail: (e) => {
        console.error('SQLite数据库连接失败:', JSON.stringify(e));
        
        // 如果是"Same Name Already Open"错误，尝试强制关闭后重试
        if (e.code === -1402) {
          console.log('检测到同名数据库已打开，尝试强制处理');
          this.forceCloseAndRetry_bak(resolve, reject);
        } else {
          // 其他错误，回退到Storage方案
          this.initStorageWithExistingData().then(() => resolve(true)).catch(reject);
        }
      }
    });
  }

  /**
   * 强制关闭并重试打开数据库
   */
  forceCloseAndRetry_bak(resolve, reject) {
    console.log('强制关闭数据库连接');
    
    // 清理当前连接状态
    this.db = null;
    this.isInitialized = false;
    
    // 等待一小段时间后重试
    setTimeout(() => {
      plus.sqlite.closeDatabase({
        name: this.fallbackDbName,
        success: () => {
          console.log('强制关闭成功，重新尝试打开');
          setTimeout(() => {
            this.openNewDatabase_bak(resolve, reject);
          }, 100);
        },
        fail: () => {
          console.log('强制关闭失败，回退到Storage方案');
          this.initStorageWithExistingData().then(() => resolve(true)).catch(reject);
        }
      });
    }, 100);
  }

  /**
   * 使用现有数据初始化Storage方案
   */
  async initStorageWithExistingData() {
    try {
      console.log('初始化Storage数据库（基于现有数据）');
      
      // 检查是否已经有Storage数据
      const existingProjects = uni.getStorageSync('db_projects');
      if (existingProjects && existingProjects.length > 0) {
        console.log('Storage中已有数据，直接使用');
      } else {
        console.log('Storage中无数据，初始化空表结构');
        // 初始化基本表结构
        const tables = [
          'projects', 'pipe_points', 'pipe_lines', 
          'pipe_categories', 'attribute_settings', 'features',
          'virtual_lines', 'shared_pipes'
        ];
        
        tables.forEach(tableName => {
          const existingData = uni.getStorageSync(`db_${tableName}`);
          if (!existingData) {
            uni.setStorageSync(`db_${tableName}`, []);
            console.log(`初始化表: ${tableName}`);
          }
        });
      }
      
      this.db = {
        type: 'storage',
        instance: null,
        tables: new Map()
      };
      
      this.isInitialized = true;
      console.log('Storage数据库初始化成功');
      
    } catch (error) {
      console.error('Storage数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 执行SQL语句
   */
  async executeSql(sql, params = []) {
    if (!this.isInitialized || !this.db) {
      throw new Error('数据库未初始化');
    }

    if (this.db.type === 'plus_sqlite') {
      // 使用plus.sqlite API
      return new Promise((resolve, reject) => {
        try {
          // 判断是查询还是执行操作
          const sqlUpper = sql.toUpperCase().trim();
          
          if (sqlUpper.startsWith('SELECT') || sqlUpper.startsWith('PRAGMA')) {
            // 查询操作
            // 对于plus.sqlite，可能需要将参数直接替换到SQL中
            let finalSql = sql;
            if (params && params.length > 0) {
              // 手动替换参数
              params.forEach((param, index) => {
                const placeholder = '?';
                const value = typeof param === 'string' ? `'${param}'` : param;
                finalSql = finalSql.replace(placeholder, value);
              });
            }
            
            console.log('最终查询SQL:', finalSql);
            
            this.db.instance.selectSql({
              name: this.fallbackDbName,
              sql: finalSql,
              success: (e) => {
                console.log('SQLite查询成功:', finalSql);
                console.log('原始参数:', JSON.stringify(params));
                console.log('查询结果:', JSON.stringify(e));
                resolve(e || []);
              },
              fail: (e) => {
                console.error('SQLite查询失败:', finalSql);
                console.error('原始参数:', JSON.stringify(params));
                console.error('错误信息:', JSON.stringify(e));
                reject(e);
              }
            });
          } else {
            // 执行操作（INSERT, UPDATE, DELETE, CREATE等）
            // 对于plus.sqlite，可能需要将参数直接替换到SQL中
            let finalSql = sql;
            if (params && params.length > 0) {
              // 手动替换参数
              params.forEach((param, index) => {
                const placeholder = '?';
                const value = typeof param === 'string' ? `'${param}'` : param;
                finalSql = finalSql.replace(placeholder, value);
              });
            }
            
            console.log('最终SQL:', finalSql);
            
            this.db.instance.executeSql({
              name: this.fallbackDbName,
              sql: finalSql,
              success: (e) => {
                console.log('SQLite执行成功:', finalSql);
                console.log('原始参数:', JSON.stringify(params));
                console.log('执行结果:', JSON.stringify(e));
                resolve(e || []);
              },
              fail: (e) => {
                console.error('SQLite执行失败:', finalSql);
                console.error('原始参数:', JSON.stringify(params));
                console.error('错误信息:', JSON.stringify(e));
                reject(e);
              }
            });
          }
        } catch (error) {
          console.error('SQLite API调用异常:', error);
          reject(error);
        }
      });
    } else if (this.db.type === 'storage') {
      // Storage方案 - 使用简化的SQL解析
      return this.executeStorageSQL(sql, params);
    } else {
      throw new Error('不支持的数据库类型');
    }
  }

  /**
   * Storage SQL执行（简化版本）
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
   * 关闭数据库连接
   */
  close() {
    if (this.db && this.db.type === 'plus_sqlite') {
      try {
        this.db.instance.closeDatabase({
          name: this.fallbackDbName,
          success: (e) => {
            console.log('数据库关闭成功:', JSON.stringify(e));
          },
          fail: (e) => {
            console.warn('关闭数据库失败:', JSON.stringify(e));
          }
        });
      } catch (error) {
        console.warn('关闭数据库异常:', error);
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
   * 检查数据库是否已打开
   */
  isOpenDatabase() {
    if (this.db && this.db.type === 'plus_sqlite') {
      return new Promise((resolve) => {
        try {
          this.db.instance.isOpenDatabase({
            name: this.fallbackDbName,
            success: (e) => {
              console.log('检查数据库状态成功:', JSON.stringify(e));
              resolve(e.isOpen || false);
            },
            fail: (e) => {
              console.warn('检查数据库状态失败:', JSON.stringify(e));
              resolve(false);
            }
          });
        } catch (error) {
          console.warn('检查数据库状态异常:', error);
          resolve(false);
        }
      });
    }
    return Promise.resolve(this.isInitialized);
  }

  /**
   * 获取数据库类型
   */
  getType() {
    return this.db ? this.db.type : 'unknown';
  }

  /**
   * 执行事务
   */
  async transaction(callback) {
    if (this.db && this.db.type === 'plus_sqlite') {
      return new Promise((resolve, reject) => {
        try {
          this.db.instance.transaction({
            name: this.fallbackDbName,
            operation: callback,
            success: (e) => {
              console.log('事务执行成功:', JSON.stringify(e));
              resolve(e);
            },
            fail: (e) => {
              console.error('事务执行失败:', JSON.stringify(e));
              reject(e);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    } else {
      // Storage方案不支持事务，直接执行回调
      try {
        await callback();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
}

export default new DatabaseLoader();