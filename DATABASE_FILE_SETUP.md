# 数据库文件配置指南

## 📁 文件位置

你的 `docs/base.db` 文件应该放在以下位置：

```
项目根目录/
├── static/
│   └── database/
│       └── base.db  ← 将你的数据库文件放在这里
├── docs/
│   └── base.db     ← 原始位置
└── ...
```

## 🔧 配置步骤

### 1. 复制数据库文件
```bash
# 创建目录
mkdir -p static/database

# 复制数据库文件
cp docs/base.db static/database/base.db
```

### 2. 文件权限设置
确保数据库文件有正确的读取权限：
- Android: 文件会自动复制到应用私有目录
- 其他平台: 使用备选的Storage适配器

### 3. 验证配置
访问数据库文件管理页面进行验证：
```
/pages/settings/database-file
```

## 🚀 工作原理

### Android平台
1. **文件复制**: 应用启动时自动将 `static/database/base.db` 复制到 `_doc/pipeline/base.db`
2. **原生SQLite**: 使用原生SQLite插件访问数据库
3. **高性能**: 直接访问SQLite文件，性能最佳

### 其他平台
1. **WebSQL**: 尝试使用WebSQL（如果支持）
2. **Storage适配器**: 使用uni.storage作为备选方案
3. **数据导入**: 从现有数据库结构初始化表

## 📱 使用方法

### 自动初始化
应用启动时会自动：
1. 检查数据库文件是否存在
2. 复制文件到本地目录（Android）
3. 初始化适当的数据库适配器
4. 创建必要的表结构

### 手动管理
访问数据库文件管理页面可以：
- 检查文件状态
- 手动复制文件
- 重新初始化数据库
- 查看数据库信息

## 🔍 故障排除

### 常见问题

#### 1. 文件不存在
**症状**: "数据库文件不存在"
**解决**: 
```bash
# 确保文件在正确位置
ls static/database/base.db

# 如果不存在，复制文件
cp docs/base.db static/database/base.db
```

#### 2. 权限问题
**症状**: "无法访问数据库文件"
**解决**: 
- 检查文件权限
- 重新安装应用
- 清除应用数据

#### 3. 复制失败
**症状**: "文件复制失败"
**解决**: 
- 检查存储空间
- 确认文件路径正确
- 重启应用

### 调试方法

#### 1. 查看日志
```javascript
// 在控制台查看详细日志
console.log('数据库初始化日志');
```

#### 2. 检查文件
```javascript
// 检查本地存储
console.log(uni.getStorageInfoSync());
```

#### 3. 测试连接
访问快速测试页面验证数据库连接：
```
/pages/test/quick-test
```

## 📊 数据库结构

你的 `base.db` 应该包含以下表：
- `projects` - 项目信息
- `pipe_points` - 管点数据
- `pipe_lines` - 管线数据
- `pipe_categories` - 管类设置
- `attribute_settings` - 属性配置
- `features` - 特征附属物
- `virtual_lines` - 虚拟线
- `shared_pipes` - 共管

## 🔄 数据迁移

如果需要更新数据库文件：
1. 替换 `static/database/base.db`
2. 清除应用数据或卸载重装
3. 重新启动应用
4. 验证数据完整性

## 📋 检查清单

- [ ] 数据库文件已放在 `static/database/base.db`
- [ ] 文件大小正常（不为0字节）
- [ ] 应用可以正常启动
- [ ] 数据库初始化成功
- [ ] 可以查询到数据
- [ ] 所有功能正常工作

## 🎯 下一步

1. **复制文件**: 将 `docs/base.db` 复制到 `static/database/base.db`
2. **重启应用**: 让系统自动初始化数据库
3. **验证功能**: 访问数据库管理页面检查状态
4. **测试功能**: 使用各个功能模块验证数据访问

完成这些步骤后，你的uniapp项目就可以正常使用现有的数据库文件了！