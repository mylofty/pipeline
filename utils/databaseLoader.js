/**
 * 数据库文件加载器
 * 用于加载现有的SQLite数据库文件
 */

class DatabaseLoader {
  constructor() {
    this.dbPath = '/static/database/base.db';
    this.localDbPath = '_doc/pipeline/base.db';
    this.fallbackDbName = 'base.db';
  }

  /**
   * 复制数据库文件到本地目录
   */
  async copyDatabaseToLocal() {
    try {
      // 检查本地文件是否已存在
      const localExists = await this.checkLocalFileExists();
      if (localExists) {
        console.log('本地数据库文件已存在');
        return true;
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
                // 复制文件
                sourceEntry.copyTo(
                  targetDirEntry,
                  'base.db',
                  () => {
                    console.log('文件复制成功');
                    resolve(true);
                  },
                  (error) => {
                    console.error('文件复制失败:', error);
                    resolve(false);
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
      // 在App环境下复制数据库文件
      // #ifdef APP-PLUS
      const copySuccess = await this.copyDatabaseToLocal();
      if (!copySuccess) {
        console.warn('数据库文件复制失败，将使用空数据库');
      }
      // #endif

      return this.getDatabasePath();
    } catch (error) {
      console.error('初始化数据库文件失败:', error);
      return null;
    }
  }
}

export default new DatabaseLoader();