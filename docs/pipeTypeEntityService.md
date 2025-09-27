# 管线类型实体服务 (PipeTypeEntityService)

## 概述

`PipeTypeEntityService` 是用于管理管线类型实体的服务类，支持管线类型的层级结构管理，包括大类和二级分类的完整CRUD操作。

## 数据结构

### 数据库表：`pipe_Line_type_entity`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| PID | VARCHAR(50) | 主键，唯一标识符 |
| TYPE_NAME | VARCHAR(100) | 类型名称 |
| TYPE_CODE | VARCHAR(20) | 类型代码 |
| PRE_TYPE_CODE | VARCHAR(20) | 父类型代码（大类为NULL，二级分类指向大类的TYPE_CODE） |
| COLOR_CODE_16 | VARCHAR(10) | 16进制颜色代码 |

### 层级关系

- **大类**：`PRE_TYPE_CODE` 为 `NULL` 或空字符串
- **二级分类**：`PRE_TYPE_CODE` 指向大类的 `TYPE_CODE`

## API 方法

### 1. 获取全量带层级结构的数据

```javascript
const result = await pipeTypeEntityService.getAllPipeTypesWithStructure();

// 返回格式
{
  success: true,
  data: [
    {
      pid: "080b6d73-0e2f-493b-af6a-07ccb3146059",
      typeName: "排水",
      typeCode: "PS",
      preTypeCode: null,
      colorCode: null,
      children: [
        {
          pid: "5e8c41fa8d784172ba890ca1e59e0289",
          typeName: "雨水",
          typeCode: "YS",
          preTypeCode: "PS",
          colorCode: "#7F0000"
        }
      ]
    }
  ]
}
```

### 2. 获取所有大类

```javascript
const result = await pipeTypeEntityService.getMainCategories();
```

### 3. 获取指定大类下的二级分类

```javascript
const result = await pipeTypeEntityService.getSubCategoriesByParent('PS');
```

### 4. 添加二级类别

```javascript
const subCategoryData = {
  typeName: '新排水类型',
  typeCode: 'NEW_PS',
  colorCode: '#FF5733'
};

const result = await pipeTypeEntityService.addSubCategory('PS', subCategoryData);
```

### 5. 删除二级类别

```javascript
const result = await pipeTypeEntityService.deleteSubCategory(pid);
```

**注意**：只能删除二级类别，不能删除大类。

### 6. 更新类别信息

```javascript
const updateData = {
  typeName: '更新后的名称',
  colorCode: '#33FF57'
};

const result = await pipeTypeEntityService.updatePipeTypeEntity(pid, updateData);
```

### 7. 根据PID获取单个类别信息

```javascript
const result = await pipeTypeEntityService.getPipeTypeEntityById(pid);
```

### 8. 根据TYPE_CODE获取类别信息

```javascript
const result = await pipeTypeEntityService.getPipeTypeEntityByCode('PS');
```

### 9. 检查TYPE_CODE是否存在

```javascript
const result = await pipeTypeEntityService.checkTypeCodeExists('PS');
// 返回: { success: true, exists: true/false }
```

### 10. 添加大类

```javascript
const categoryData = {
  typeName: '新大类',
  typeCode: 'NEW_MAIN',
  colorCode: '#FF0000'
};

const result = await pipeTypeEntityService.addMainCategory(categoryData);
```

### 11. 批量导入管线类型数据

```javascript
const pipeTypesData = [
  {
    pid: "new-uuid-1",
    typeName: "新类型1",
    typeCode: "NEW1",
    preTypeCode: null,
    colorCode: "#FF0000"
  }
];

const result = await pipeTypeEntityService.batchImportPipeTypes(pipeTypesData);
```

## 使用示例

### 在页面中使用

```javascript
// 导入服务
import pipeTypeEntityService from '@/services/pipeTypeEntityService.js';

export default {
  data() {
    return {
      pipeTypes: [],
      mainCategories: []
    };
  },
  
  async mounted() {
    await this.loadPipeTypes();
    await this.loadMainCategories();
  },
  
  methods: {
    // 加载管线类型结构
    async loadPipeTypes() {
      const result = await pipeTypeEntityService.getAllPipeTypesWithStructure();
      if (result.success) {
        this.pipeTypes = result.data;
      } else {
        uni.showToast({
          title: result.message,
          icon: 'error'
        });
      }
    },
    
    // 加载大类列表
    async loadMainCategories() {
      const result = await pipeTypeEntityService.getMainCategories();
      if (result.success) {
        this.mainCategories = result.data;
      }
    },
    
    // 添加子分类
    async addSubCategory(parentTypeCode) {
      const subCategoryData = {
        typeName: '新子分类',
        typeCode: 'NEW_SUB',
        colorCode: '#FF5733'
      };
      
      const result = await pipeTypeEntityService.addSubCategory(parentTypeCode, subCategoryData);
      if (result.success) {
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        });
        await this.loadPipeTypes(); // 重新加载数据
      } else {
        uni.showToast({
          title: result.message,
          icon: 'error'
        });
      }
    },
    
    // 删除子分类
    async deleteSubCategory(pid) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个分类吗？',
        success: async (res) => {
          if (res.confirm) {
            const result = await pipeTypeEntityService.deleteSubCategory(pid);
            if (result.success) {
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              await this.loadPipeTypes(); // 重新加载数据
            } else {
              uni.showToast({
                title: result.message,
                icon: 'error'
              });
            }
          }
        }
      });
    }
  }
};
```

## 错误处理

所有方法都返回统一的响应格式：

```javascript
// 成功响应
{
  success: true,
  data: {...}, // 或其他相关数据
  message: "操作成功"
}

// 失败响应
{
  success: false,
  message: "错误信息"
}
```

## 数据验证

1. **TYPE_CODE唯一性**：添加或更新时会自动检查TYPE_CODE是否已存在
2. **父类存在性**：添加二级分类时会验证父类是否存在
3. **删除限制**：只能删除二级分类，不能删除大类
4. **必填字段**：typeName和typeCode为必填字段

## 测试

运行测试文件来验证服务功能：

```javascript
import pipeTypeEntityServiceTest from '@/services/pipeTypeEntityService.test.js';

// 运行完整测试
await pipeTypeEntityServiceTest.runFullTest();
```

## 注意事项

1. 确保数据库表 `pipe_Line_type_entity` 已正确创建
2. 删除操作是物理删除，请谨慎操作
3. PID使用UUID格式自动生成
4. 颜色代码使用16进制格式（如：#FF0000）
5. 建议在生产环境中添加更多的数据验证和错误处理