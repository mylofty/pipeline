# 数据库使用指南

## 快速开始

### 1. 数据库自动初始化
应用启动时会自动初始化数据库，无需手动操作。

### 2. 测试数据库功能
访问测试页面验证数据库是否正常工作：
```
页面路径: pages/test/database-test
```

### 3. 项目管理
使用项目选择页面管理项目：
```
页面路径: pages/project/project-select
```

## 核心功能使用

### 项目管理
```javascript
import projectService from '@/services/projectService.js';

// 创建项目
const result = await projectService.createProject({
  project_name: '新项目',
  work_group: 'GROUP1',
  offline_map_path: '/path/to/map.shp',
  map_type: 'shp'
});

// 获取当前项目
const currentProject = await projectService.getCurrentProject();

// 获取项目统计
const stats = await projectService.getProjectStatistics(projectId);
```

### 管点管理
```javascript
import pipePointService from '@/services/pipePointService.js';

// 创建管点
const result = await pipePointService.createPipePoint({
  project_id: 1,
  point_number: 'P001',
  longitude: 113.264385,
  latitude: 23.129163,
  pipe_type: '给水管',
  material: 'PE',
  diameter: 200,
  depth: 1.5
});

// 搜索管点
const points = await pipePointService.searchPipePointByNumber(projectId, 'P001');

// 收点操作
await pipePointService.collectPipePoint(pointId);
```

### 管线管理
```javascript
import pipeLineService from '@/services/pipeLineService.js';

// 创建管线
const result = await pipeLineService.createPipeLine({
  project_id: 1,
  start_point_id: 1,
  end_point_id: 2,
  pipe_type: '给水管',
  material: 'PE',
  diameter: 200,
  length: 50.5,
  flow_direction: 'forward'
});

// 创建虚拟线
await pipeLineService.createVirtualLine({
  project_id: 1,
  start_point_id: 1,
  direction_angle: 45,
  length: 30,
  pipe_type: '给水管'
});

// 虚拟线转实线
await pipeLineService.convertVirtualToReal(virtualLineId, endPointId);
```

### 设置管理
```javascript
import settingsService from '@/services/settingsService.js';

// 获取管类设置
const categories = await settingsService.getPipeCategories();

// 添加管类
await settingsService.addPipeCategory({
  category_name: '新管类',
  category_type: 'line',
  color: '#FF0000'
});

// 获取属性设置
const attributes = await settingsService.getAttributeSettings();

// 更新属性显示状态
await settingsService.updateAttributeVisibility(attributeId, true);
```

### 数据导入导出
```javascript
import dataService from '@/services/dataService.js';

// 导出数据
const result = await dataService.exportToExcel(projectId, 'comprehensive');

// 导入数据
await dataService.importFromExcel(filePath, 'comprehensive');

// 清空项目数据
await dataService.clearProjectData(projectId);
```

## 数据库健康检查
```javascript
import dbChecker from '@/utils/dbCheck.js';

// 完整健康检查
const health = await dbChecker.healthCheck();

// 修复数据库
if (!health.success) {
  await dbChecker.repairDatabase();
}
```

## 错误处理

所有服务方法都返回统一格式：
```javascript
{
  success: boolean,    // 操作是否成功
  data?: any,         // 返回数据（成功时）
  message?: string,   // 错误或成功消息
  // 其他特定字段...
}
```

使用示例：
```javascript
const result = await projectService.createProject(projectData);
if (result.success) {
  console.log('项目创建成功:', result.data);
  uni.showToast({ title: result.message, icon: 'success' });
} else {
  console.error('项目创建失败:', result.message);
  uni.showToast({ title: result.message, icon: 'error' });
}
```

## 性能优化建议

1. **分页查询**：大量数据时使用LIMIT和OFFSET
2. **索引优化**：为常用查询字段添加索引
3. **批量操作**：使用事务处理批量插入/更新
4. **缓存策略**：缓存常用的配置数据

## 数据备份

定期备份数据库文件：
```javascript
// 手动备份
const backup = await dataService.backupDatabase();

// 自动备份（建议在应用退出时）
uni.onAppHide(() => {
  dataService.backupDatabase();
});
```

## 故障排除

### 常见问题

1. **数据库初始化失败**
   - 检查存储权限
   - 查看控制台错误信息
   - 尝试重新安装应用

2. **SQL执行错误**
   - 检查SQL语法
   - 验证参数类型和数量
   - 确认表结构是否正确

3. **数据查询为空**
   - 检查查询条件
   - 验证数据是否存在
   - 确认项目ID是否正确

### 调试方法

1. 使用数据库测试页面验证功能
2. 查看控制台日志输出
3. 使用健康检查工具诊断问题

## 扩展开发

### 添加新表
1. 在`database.js`的`createTables`方法中添加建表SQL
2. 创建对应的服务类
3. 实现CRUD操作方法

### 自定义字段
1. 使用ALTER TABLE添加字段
2. 更新相关服务方法
3. 修改前端表单和显示逻辑

### 数据同步
可以基于现有架构扩展云端同步功能：
1. 添加同步状态字段
2. 实现增量同步逻辑
3. 处理冲突解决策略