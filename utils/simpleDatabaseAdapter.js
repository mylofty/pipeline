/**
 * 简单数据库适配器
 * 使用 uni.storage 作为数据存储，适用于开发和测试环境
 */

class SimpleDatabaseAdapter {
  constructor() {
    this.isInitialized = false;
    this.tables = new Map();
    this.autoIncrementIds = new Map();
  }

  /**
   * 初始化数据库
   */
  async init(dbName = 'pipeline.db') {
    try {
      console.log('使用简单数据库适配器');
      
      // 加载已存在的表数据
      const tableNames = [
        'projects', 'pipe_points', 'pipe_lines', 
        'pipe_categories', 'attribute_settings', 'features',
        'virtual_lines', 'shared_pipes'
      ];
      
      for (const tableName of tableNames) {
        const data = uni.getStorageSync(`db_${tableName}`) || [];
        this.tables.set(tableName, data);
        
        // 计算自增ID
        const maxId = data.length > 0 ? Math.max(...data.map(row => row.id || 0)) : 0;
        this.autoIncrementIds.set(tableName, maxId);
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('简单数据库适配器初始化失败:', error);
      return false;
    }
  }

  /**
   * 执行SQL语句
   */
  async executeSql(sql, params = []) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    const sqlUpper = sql.toUpperCase().trim();
    
    try {
      if (sqlUpper.startsWith('CREATE TABLE')) {
        return this.handleCreateTable(sql);
      } else if (sqlUpper.startsWith('INSERT')) {
        return this.handleInsert(sql, params);
      } else if (sqlUpper.startsWith('SELECT')) {
        return this.handleSelect(sql, params);
      } else if (sqlUpper.startsWith('UPDATE')) {
        return this.handleUpdate(sql, params);
      } else if (sqlUpper.startsWith('DELETE')) {
        return this.handleDelete(sql, params);
      }
      
      return [];
    } catch (error) {
      console.error('SQL执行失败:', error);
      throw error;
    }
  }

  /**
   * 处理CREATE TABLE语句
   */
  handleCreateTable(sql) {
    const match = sql.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i);
    if (match) {
      const tableName = match[1];
      if (!this.tables.has(tableName)) {
        this.tables.set(tableName, []);
        this.autoIncrementIds.set(tableName, 0);
        console.log(`创建表: ${tableName}`);
      }
    }
    return [];
  }

  /**
   * 处理INSERT语句
   */
  handleInsert(sql, params) {
    const match = sql.match(/INSERT INTO (\w+)\s*\((.*?)\)\s*VALUES/i);
    if (!match) return [];
    
    const tableName = match[1];
    const columns = match[2].split(',').map(col => col.trim());
    
    let table = this.tables.get(tableName) || [];
    
    // 生成新ID
    const currentId = this.autoIncrementIds.get(tableName) || 0;
    const newId = currentId + 1;
    this.autoIncrementIds.set(tableName, newId);
    
    // 创建新记录
    const newRow = { id: newId };
    
    // 映射参数到字段
    columns.forEach((column, index) => {
      if (index < params.length) {
        newRow[column] = params[index];
      }
    });
    
    // 添加时间戳
    if (!newRow.created_time) {
      newRow.created_time = new Date().toISOString();
    }
    if (!newRow.updated_time) {
      newRow.updated_time = new Date().toISOString();
    }
    
    table.push(newRow);
    this.tables.set(tableName, table);
    
    // 保存到本地存储
    uni.setStorageSync(`db_${tableName}`, table);
    
    return { insertId: newId };
  }

  /**
   * 处理SELECT语句
   */
  handleSelect(sql, params) {
    const match = sql.match(/FROM (\w+)/i);
    if (!match) return [];
    
    const tableName = match[1];
    let table = this.tables.get(tableName) || [];
    
    // 从本地存储重新加载数据
    const storedData = uni.getStorageSync(`db_${tableName}`);
    if (storedData) {
      table = storedData;
      this.tables.set(tableName, table);
    }
    
    // 处理COUNT查询
    if (sql.includes('COUNT(*)')) {
      let count = table.length;
      
      // 简单的WHERE条件处理
      if (sql.includes('WHERE')) {
        if (sql.includes('is_active = 1')) {
          count = table.filter(row => row.is_active === 1).length;
        } else if (sql.includes('status = "active"')) {
          count = table.filter(row => row.status === 'active').length;
        }
      }
      
      return [{ count: count }];
    }
    
    // 处理WHERE条件
    let result = table;
    if (sql.includes('WHERE')) {
      if (sql.includes('is_active = 1')) {
        result = table.filter(row => row.is_active === 1);
      } else if (sql.includes('status = "active"')) {
        result = table.filter(row => row.status === 'active');
      } else if (params.length > 0) {
        // 简单的参数匹配
        result = table.filter(row => {
          return Object.values(row).some(value => 
            params.some(param => value === param)
          );
        });
      }
    }
    
    // 处理ORDER BY
    if (sql.includes('ORDER BY')) {
      if (sql.includes('created_time DESC')) {
        result.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
      }
    }
    
    return result;
  }

  /**
   * 处理UPDATE语句
   */
  handleUpdate(sql, params) {
    const match = sql.match(/UPDATE (\w+)/i);
    if (!match) return [];
    
    const tableName = match[1];
    let table = this.tables.get(tableName) || [];
    
    // 简单的更新逻辑
    if (params.length > 0) {
      const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        const whereColumn = whereMatch[1];
        const whereValue = params[params.length - 1]; // 最后一个参数通常是WHERE条件的值
        
        table.forEach(row => {
          if (row[whereColumn] === whereValue) {
            // 更新字段
            const setMatch = sql.match(/SET\s+(.*?)\s+WHERE/i);
            if (setMatch) {
              const setPart = setMatch[1];
              const setFields = setPart.split(',');
              
              setFields.forEach((field, index) => {
                const fieldMatch = field.trim().match(/(\w+)\s*=\s*\?/);
                if (fieldMatch && index < params.length - 1) {
                  const fieldName = fieldMatch[1];
                  row[fieldName] = params[index];
                }
              });
            }
            
            row.updated_time = new Date().toISOString();
          }
        });
      }
    }
    
    this.tables.set(tableName, table);
    uni.setStorageSync(`db_${tableName}`, table);
    
    return [];
  }

  /**
   * 处理DELETE语句
   */
  handleDelete(sql, params) {
    const match = sql.match(/FROM (\w+)/i);
    if (!match) return [];
    
    const tableName = match[1];
    let table = this.tables.get(tableName) || [];
    
    // 软删除 - 标记为删除状态
    if (params.length > 0) {
      const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        const whereColumn = whereMatch[1];
        const whereValue = params[0];
        
        table.forEach(row => {
          if (row[whereColumn] === whereValue) {
            if (sql.includes('UPDATE') && sql.includes('SET')) {
              // 软删除
              row.status = 'deleted';
              row.is_active = 0;
            } else {
              // 标记删除
              row.deleted = true;
            }
            row.updated_time = new Date().toISOString();
          }
        });
      }
    }
    
    this.tables.set(tableName, table);
    uni.setStorageSync(`db_${tableName}`, table);
    
    return [];
  }

  /**
   * 关闭数据库
   */
  close() {
    this.isInitialized = false;
    this.tables.clear();
    this.autoIncrementIds.clear();
  }

  /**
   * 检查是否已初始化
   */
  isReady() {
    return this.isInitialized;
  }
}

export default new SimpleDatabaseAdapter();