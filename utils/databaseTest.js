/**
 * 数据库功能测试
 */
import database from '@/utils/database.js';

class DatabaseTest {
  
  /**
   * 运行所有测试
   */
  async runAllTests() {
    console.log('开始数据库功能测试...');
    
    const results = {
      initialization: false,
      createTable: false,
      insert: false,
      select: false,
      update: false,
      delete: false
    };
    
    try {
      // 测试初始化
      // results.initialization = await this.testInitialization();
      
      // 测试建表
      results.createTable = await this.testCreateTable();
      
      // 测试插入
      results.insert = await this.testInsert();
      
      // 测试查询
      results.select = await this.testSelect();
      
      // 测试更新
      results.update = await this.testUpdate();
      
      // 测试删除
      results.delete = await this.testDelete();
      
    } catch (error) {
      console.error('测试过程中发生错误:', error);
    }
    
    console.log('数据库测试结果:', results);
    return results;
  }
  
  /**
   * 测试数据库初始化
   */
  async testInitialization() {
    try {
      const success = await database.initDatabase();
      console.log('✓ 数据库初始化测试:', success ? '成功' : '失败');
      return success;
    } catch (error) {
      console.error('✗ 数据库初始化测试失败:', error);
      return false;
    }
  }
  
  /**
   * 测试建表
   */
  async testCreateTable() {
    try {
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          value INTEGER,
          created_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ 建表测试: 成功');
      return true;
    } catch (error) {
      console.error('✗ 建表测试失败:', error);
      return false;
    }
  }
  
  /**
   * 测试插入数据
   */
  async testInsert() {
    try {
      const result = await database.executeSql(
        'INSERT INTO test_table (name, value) VALUES (?, ?)',
        ['测试数据', 123]
      );
      console.log('✓ 插入测试: 成功', result);
      return true;
    } catch (error) {
      console.error('✗ 插入测试失败:', error);
      return false;
    }
  }
  
  /**
   * 测试查询数据
   */
  async testSelect() {
    try {
      const result = await database.executeSql('SELECT * FROM test_table');
      console.log('✓ 查询测试: 成功', result);
      return Array.isArray(result);
    } catch (error) {
      console.error('✗ 查询测试失败:', error);
      return false;
    }
  }
  
  /**
   * 测试更新数据
   */
  async testUpdate() {
    try {
      await database.executeSql(
        'UPDATE test_table SET value = ? WHERE name = ?',
        [456, '测试数据']
      );
      console.log('✓ 更新测试: 成功');
      return true;
    } catch (error) {
      console.error('✗ 更新测试失败:', error);
      return false;
    }
  }
  
  /**
   * 测试删除数据
   */
  async testDelete() {
    try {
      await database.executeSql(
        'DELETE FROM test_table WHERE name = ?',
        ['测试数据']
      );
      console.log('✓ 删除测试: 成功');
      return true;
    } catch (error) {
      console.error('✗ 删除测试失败:', error);
      return false;
    }
  }
}

export default new DatabaseTest();