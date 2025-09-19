# 数据库修复指南

## 问题解决

✅ **已修复的问题**：
- `uni.openDatabase is not a function` 错误
- 数据库适配器初始化失败
- 跨平台兼容性问题

## 修复方案

### 1. 多层级数据库适配
- **原生SQLite**: 优先使用原生插件（Android）
- **WebSQL**: 备选方案（支持的浏览器）
- **Storage适配器**: 最终备选方案（使用uni.storage）

### 2. 新增文件
- `utils/simpleDatabaseAdapter.js` - 简单数据库适配器
- `utils/databaseTest.js` - 数据库功能测试
- `pages/test/simple-db-test.vue` - 简单测试页面

### 3. 更新的文件
- `utils/database.js` - 增强的数据库管理器
- `utils/sqliteAdapter.js` - 改进的SQLite适配器
- `App.vue` - 增强的初始化和错误处理

## 使用方法

### 1. 重新启动应用
应用现在会自动选择最适合的数据库适配器：

```
尝试SQLite适配器 → WebSQL适配器 → Storage适配器
```

### 2. 测试数据库功能
访问简单测试页面验证功能：
```
/pages/test/simple-db-test
```

### 3. 查看初始化日志
在控制台查看详细的初始化过程：
```
App Launch - 绘管通启动
开始初始化数据库...
尝试初始化SQLite适配器...
SQLite适配器失败，使用简单数据库适配器...
简单数据库适配器初始化成功
✓ 数据库初始化成功
```

## 功能特性

### Storage适配器特性
- ✅ 使用 `uni.storage` 作为数据存储
- ✅ 支持基本的CRUD操作
- ✅ 自动生成ID
- ✅ 简单的WHERE条件支持
- ✅ 软删除支持
- ✅ 时间戳自动管理

### 支持的SQL操作
```sql
-- 创建表
CREATE TABLE IF NOT EXISTS table_name (...)

-- 插入数据
INSERT INTO table_name (col1, col2) VALUES (?, ?)

-- 查询数据
SELECT * FROM table_name WHERE condition = ?
SELECT COUNT(*) FROM table_name

-- 更新数据
UPDATE table_name SET col1 = ? WHERE id = ?

-- 删除数据（软删除）
UPDATE table_name SET status = 'deleted' WHERE id = ?
```

## 测试验证

### 1. 自动测试
应用启动时会在开发环境自动运行测试：
- 数据库初始化测试
- 建表测试
- CRUD操作测试

### 2. 手动测试
使用测试页面进行手动验证：
- 基本操作测试
- 项目服务测试
- 数据清除功能

### 3. 服务层测试
所有业务服务都已适配新的数据库系统：
- ProjectService - 项目管理
- PipePointService - 管点管理
- PipeLineService - 管线管理
- SettingsService - 设置管理
- DataService - 数据导入导出

## 性能说明

### Storage适配器性能
- **优点**: 兼容性好，无需额外插件
- **缺点**: 性能相对较低，适合中小型数据
- **建议**: 适用于开发测试和小规模部署

### 数据存储格式
```javascript
// 存储键名格式
db_projects      // 项目数据
db_pipe_points   // 管点数据
db_pipe_lines    // 管线数据
// ...

// 数据格式
{
  id: 1,
  field_0: "value1",
  field_1: "value2",
  created_time: "2023-09-18T13:14:49.577Z",
  updated_time: "2023-09-18T13:14:49.577Z"
}
```

## 故障排除

### 常见问题

1. **数据库初始化失败**
   - 检查控制台日志
   - 确认存储权限
   - 尝试清除应用数据

2. **数据查询为空**
   - 检查表名是否正确
   - 确认数据是否已插入
   - 使用测试页面验证

3. **服务调用失败**
   - 确认数据库已初始化
   - 检查服务导入路径
   - 查看错误日志

### 调试方法

1. **查看存储数据**
```javascript
// 在控制台执行
console.log(uni.getStorageSync('db_projects'));
```

2. **手动清除数据**
```javascript
// 清除特定表数据
uni.removeStorageSync('db_projects');

// 清除所有数据库数据
const keys = uni.getStorageInfoSync().keys;
keys.forEach(key => {
  if (key.startsWith('db_')) {
    uni.removeStorageSync(key);
  }
});
```

3. **重新初始化**
```javascript
import database from '@/utils/database.js';
await database.initDatabase();
```

## 升级路径

### 生产环境建议
1. **Android**: 配置原生SQLite插件
2. **iOS**: 使用WebSQL或原生插件
3. **H5**: 使用WebSQL或IndexedDB
4. **小程序**: 使用云数据库或本地存储

### 数据迁移
当升级到更高性能的数据库时：
1. 导出Storage数据
2. 转换为目标格式
3. 导入新数据库
4. 验证数据完整性

## 下一步

1. ✅ 验证数据库功能正常
2. ✅ 测试所有业务服务
3. ✅ 集成到现有页面
4. 🔄 根据需要优化性能
5. 🔄 考虑生产环境升级方案