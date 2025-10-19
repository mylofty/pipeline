/**
 * Domain 表服务：提供统一的域/字典/代码表选项服务
 * 表结构参考 docs/db.md:
 * CREATE TABLE domain (
 *   _id     INTEGER PRIMARY KEY AUTOINCREMENT,
 *   name    TEXT,    -- 域名/字典名
 *   value   TEXT,    -- 选项值
 *   count   INTEGER  -- (可选)引用计数或排序等
 * );
 */
import database from '@/utils/database.js';

class DomainService {
  // 确保表存在
  async ensureTable() {
    try {
      await database.executeSql(
        `CREATE TABLE IF NOT EXISTS domain (
          _id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          value TEXT,
          count INTEGER
        )`,
        []
      );
      return true;
    } catch (e) {
      console.error('确保 domain 表存在失败:', e);
      return false;
    }
  }

  // 按 name 读取域选项
  async getDomainsByName(name) {
    try {
      if (!name) return { success: true, data: [] };
      
      const rows = await database.executeSql(
        `SELECT value FROM domain WHERE name = ? ORDER BY _id`,
        [name]
      );
      
      const data = rows.map(r => ({
        text: r.value ?? r.VALUE,
        value: r.value ?? r.VALUE
      }));
      
      return { success: true, data };
    } catch (e) {
      console.warn(`域(${name})选项读取失败，返回空列表: ${e.message}`);
      return { success: true, data: [] };
    }
  }

  // 读取所有域选项，并按 name 分组
  async getAllDomains() {
    try {
      const rows = await database.executeSql(
        `SELECT name, value FROM domain ORDER BY name, _id`,
        []
      );

      const groupedDomains = rows.reduce((acc, row) => {
        const domainName = row.name || row.NAME;
        const domainValue = row.value ?? row.VALUE;
        
        if (!acc[domainName]) {
          acc[domainName] = [];
        }
        
        acc[domainName].push({
          text: domainValue,
          value: domainValue,
        });
        
        return acc;
      }, {});

      return { success: true, data: groupedDomains };
    } catch (e) {
      console.error('读取所有 domain 失败:', e);
      return { success: false, message: '读取所有域选项失败: ' + e.message, data: {} };
    }
  }
}

export default new DomainService();