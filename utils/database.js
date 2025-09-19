/**
 * SQLite数据库管理工具类
 * 用于管理管网数据采集系统的本地数据库
 */
import simpleDatabaseLoader from '@/utils/simpleDatabaseLoader.js';

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
      
      // 使用简单数据库加载器
      const success = await simpleDatabaseLoader.init(forceReset);
      
      if (success) {
        this.adapter = simpleDatabaseLoader;
        console.log(`数据库初始化成功，使用 ${simpleDatabaseLoader.getType()} 适配器`);
        
        // 创建表结构
        await this.createTables();
        console.log('数据库表结构创建完成');
        
        // 记录初始化时间
        uni.setStorageSync('database_init_time', new Date().toISOString());
        
        return true;
      } else {
        console.error('数据库初始化失败');
        return false;
      }
    } catch (error) {
      console.error('数据库初始化异常:', error);
      return false;
    }
  }

  /**
   * 创建所有数据表
   */
  async createTables() {
    const tables = [
      // 项目表
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_name TEXT NOT NULL,
        work_group TEXT,
        offline_map_path TEXT,
        map_type TEXT DEFAULT 'shp',
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
      )`,

      // 管点表
      `CREATE TABLE IF NOT EXISTS pipe_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        point_number TEXT NOT NULL,
        longitude REAL,
        latitude REAL,
        elevation REAL,
        pipe_type TEXT,
        material TEXT,
        diameter REAL,
        depth REAL,
        status TEXT DEFAULT 'active',
        description TEXT,
        photo_paths TEXT,
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_collected INTEGER DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // 管线表
      `CREATE TABLE IF NOT EXISTS pipe_lines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        line_number TEXT,
        start_point_id INTEGER,
        end_point_id INTEGER,
        pipe_type TEXT,
        material TEXT,
        diameter REAL,
        length REAL,
        flow_direction TEXT,
        status TEXT DEFAULT 'active',
        description TEXT,
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (start_point_id) REFERENCES pipe_points (id),
        FOREIGN KEY (end_point_id) REFERENCES pipe_points (id)
      )`,

      // 管类设置表
      `CREATE TABLE IF NOT EXISTS pipe_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL,
        category_type TEXT NOT NULL, -- 'point' 或 'line'
        color TEXT DEFAULT '#000000',
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )`,

      // 属性设置表
      `CREATE TABLE IF NOT EXISTS attribute_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attribute_name TEXT NOT NULL,
        attribute_type TEXT NOT NULL, -- 'point' 或 'line'
        field_name TEXT NOT NULL,
        field_type TEXT DEFAULT 'text', -- 'text', 'number', 'select', 'regex'
        is_visible INTEGER DEFAULT 1,
        is_required INTEGER DEFAULT 0,
        default_value TEXT,
        validation_rule TEXT,
        sort_order INTEGER DEFAULT 0
      )`,

      // 特征附属物表
      `CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feature_name TEXT NOT NULL,
        feature_type TEXT NOT NULL, -- 'feature' 或 'attachment'
        description TEXT,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )`,

      // 虚拟线表
      `CREATE TABLE IF NOT EXISTS virtual_lines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        start_point_id INTEGER,
        direction_angle REAL,
        length REAL,
        pipe_type TEXT,
        status TEXT DEFAULT 'virtual',
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (start_point_id) REFERENCES pipe_points (id)
      )`,

      // 共管表
      `CREATE TABLE IF NOT EXISTS shared_pipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_line_id INTEGER NOT NULL,
        shared_pipe_type TEXT NOT NULL,
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (original_line_id) REFERENCES pipe_lines (id)
      )`
    ];

    for (const sql of tables) {
      await this.executeSql(sql);
    }

    // 插入默认数据
    await this.insertDefaultData();
  }

  /**
   * 插入默认数据
   */
  async insertDefaultData() {
    // 默认管类设置
    const defaultCategories = [
      { name: '给水管', type: 'line', color: '#0066CC' },
      { name: '污水管', type: 'line', color: '#8B4513' },
      { name: '雨水管', type: 'line', color: '#32CD32' },
      { name: '燃气管', type: 'line', color: '#FFD700' },
      { name: '电力管', type: 'line', color: '#FF0000' },
      { name: '通信管', type: 'line', color: '#800080' },
      { name: '检查井', type: 'point', color: '#000000' },
      { name: '阀门井', type: 'point', color: '#0066CC' },
      { name: '水表井', type: 'point', color: '#0066CC' }
    ];

    for (const category of defaultCategories) {
      const exists = await this.executeSql(
        'SELECT COUNT(*) as count FROM pipe_categories WHERE category_name = ?',
        [category.name]
      );
      
      if (exists[0].count === 0) {
        await this.executeSql(
          'INSERT INTO pipe_categories (category_name, category_type, color) VALUES (?, ?, ?)',
          [category.name, category.type, category.color]
        );
      }
    }

    // 默认属性设置
    const defaultAttributes = [
      { name: '管径', type: 'both', field: 'diameter', fieldType: 'number', visible: 1, required: 1 },
      { name: '材质', type: 'both', field: 'material', fieldType: 'select', visible: 1, required: 1 },
      { name: '埋深', type: 'point', field: 'depth', fieldType: 'number', visible: 1, required: 0 },
      { name: '高程', type: 'point', field: 'elevation', fieldType: 'number', visible: 1, required: 0 },
      { name: '长度', type: 'line', field: 'length', fieldType: 'number', visible: 1, required: 0 },
      { name: '流向', type: 'line', field: 'flow_direction', fieldType: 'select', visible: 1, required: 0 }
    ];

    for (const attr of defaultAttributes) {
      const exists = await this.executeSql(
        'SELECT COUNT(*) as count FROM attribute_settings WHERE field_name = ? AND attribute_type = ?',
        [attr.field, attr.type]
      );
      
      if (exists[0].count === 0) {
        await this.executeSql(
          'INSERT INTO attribute_settings (attribute_name, attribute_type, field_name, field_type, is_visible, is_required) VALUES (?, ?, ?, ?, ?, ?)',
          [attr.name, attr.type, attr.field, attr.fieldType, attr.visible, attr.required]
        );
      }
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