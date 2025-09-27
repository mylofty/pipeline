/**
 * 管线类型实体服务测试文件
 * 使用示例和测试用例
 */
import pipeTypeEntityService from './pipeTypeEntityService.js';

// 测试用例和使用示例
class PipeTypeEntityServiceTest {

  /**
   * 测试获取全量带层级结构的数据
   */
  async testGetAllPipeTypesWithStructure() {
    console.log('=== 测试获取全量带层级结构的数据 ===');
    
    const result = await pipeTypeEntityService.getAllPipeTypesWithStructure();
    
    if (result.success) {
      console.log('获取成功，数据结构：');
      console.log(JSON.stringify(result.data, null, 2));
      
      // 显示统计信息
      const mainCount = result.data.length;
      const subCount = result.data.reduce((total, main) => total + main.children.length, 0);
      console.log(`共有 ${mainCount} 个大类，${subCount} 个二级类别`);
    } else {
      console.error('获取失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试获取所有大类
   */
  async testGetMainCategories() {
    console.log('\n=== 测试获取所有大类 ===');
    
    const result = await pipeTypeEntityService.getMainCategories();
    
    if (result.success) {
      console.log('大类列表：');
      result.data.forEach(category => {
        console.log(`- ${category.typeName} (${category.typeCode})`);
      });
    } else {
      console.error('获取大类失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试获取指定大类下的二级分类
   */
  async testGetSubCategoriesByParent() {
    console.log('\n=== 测试获取排水(PS)下的二级分类 ===');
    
    const result = await pipeTypeEntityService.getSubCategoriesByParent('PS');
    
    if (result.success) {
      console.log('排水下的二级分类：');
      result.data.forEach(category => {
        console.log(`- ${category.typeName} (${category.typeCode}) - ${category.colorCode || '无颜色'}`);
      });
    } else {
      console.error('获取子分类失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试添加二级类别
   */
  async testAddSubCategory() {
    console.log('\n=== 测试添加二级类别 ===');
    
    const subCategoryData = {
      typeName: '测试排水',
      typeCode: 'TEST_PS',
      colorCode: '#FF5733'
    };
    
    const result = await pipeTypeEntityService.addSubCategory('PS', subCategoryData);
    
    if (result.success) {
      console.log(`添加成功，PID: ${result.pid}`);
      
      // 验证添加结果
      const verifyResult = await pipeTypeEntityService.getPipeTypeEntityById(result.pid);
      if (verifyResult.success) {
        console.log('验证添加结果：', verifyResult.data);
      }
    } else {
      console.error('添加失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试更新类别信息
   */
  async testUpdatePipeTypeEntity(pid) {
    console.log('\n=== 测试更新类别信息 ===');
    
    const updateData = {
      typeName: '测试排水(已更新)',
      colorCode: '#33FF57'
    };
    
    const result = await pipeTypeEntityService.updatePipeTypeEntity(pid, updateData);
    
    if (result.success) {
      console.log('更新成功');
      
      // 验证更新结果
      const verifyResult = await pipeTypeEntityService.getPipeTypeEntityById(pid);
      if (verifyResult.success) {
        console.log('验证更新结果：', verifyResult.data);
      }
    } else {
      console.error('更新失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试删除二级类别
   */
  async testDeleteSubCategory(pid) {
    console.log('\n=== 测试删除二级类别 ===');
    
    const result = await pipeTypeEntityService.deleteSubCategory(pid);
    
    if (result.success) {
      console.log('删除成功');
      
      // 验证删除结果
      const verifyResult = await pipeTypeEntityService.getPipeTypeEntityById(pid);
      if (!verifyResult.success) {
        console.log('验证删除结果：记录已不存在');
      }
    } else {
      console.error('删除失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试根据TYPE_CODE获取类别信息
   */
  async testGetPipeTypeEntityByCode() {
    console.log('\n=== 测试根据TYPE_CODE获取类别信息 ===');
    
    const result = await pipeTypeEntityService.getPipeTypeEntityByCode('PS');
    
    if (result.success) {
      console.log('排水(PS)信息：', result.data);
    } else {
      console.error('获取失败：', result.message);
    }
    
    return result;
  }

  /**
   * 测试检查TYPE_CODE是否存在
   */
  async testCheckTypeCodeExists() {
    console.log('\n=== 测试检查TYPE_CODE是否存在 ===');
    
    // 测试存在的CODE
    const existsResult = await pipeTypeEntityService.checkTypeCodeExists('PS');
    console.log('PS是否存在：', existsResult.exists);
    
    // 测试不存在的CODE
    const notExistsResult = await pipeTypeEntityService.checkTypeCodeExists('NOT_EXISTS');
    console.log('NOT_EXISTS是否存在：', notExistsResult.exists);
    
    return { existsResult, notExistsResult };
  }

  /**
   * 运行完整测试套件
   */
  async runFullTest() {
    console.log('开始运行管线类型实体服务完整测试...\n');
    
    try {
      // 1. 获取全量数据
      await this.testGetAllPipeTypesWithStructure();
      
      // 2. 获取大类
      await this.testGetMainCategories();
      
      // 3. 获取子分类
      await this.testGetSubCategoriesByParent();
      
      // 4. 检查CODE存在性
      await this.testCheckTypeCodeExists();
      
      // 5. 根据CODE获取信息
      await this.testGetPipeTypeEntityByCode();
      
      // 6. 添加二级类别
      const addResult = await this.testAddSubCategory();
      
      if (addResult.success) {
        // 7. 更新类别信息
        await this.testUpdatePipeTypeEntity(addResult.pid);
        
        // 8. 删除二级类别
        await this.testDeleteSubCategory(addResult.pid);
      }
      
      console.log('\n=== 测试完成 ===');
      
    } catch (error) {
      console.error('测试过程中发生错误：', error);
    }
  }
}

// 使用示例
export const pipeTypeEntityServiceTest = new PipeTypeEntityServiceTest();

// UniApp环境使用示例
// 在页面中导入并使用：
// import { pipeTypeEntityServiceTest } from '@/services/pipeTypeEntityService.test.js';
// await pipeTypeEntityServiceTest.runFullTest();

export default pipeTypeEntityServiceTest;