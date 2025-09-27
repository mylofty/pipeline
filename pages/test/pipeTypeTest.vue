<template>
  <view class="container">
    <view class="header">
      <text class="title">管线类型实体服务测试</text>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 测试按钮区域 -->
      <view class="test-buttons">
        <button @click="runAllTests" type="primary" class="test-btn">运行全部测试</button>
        <button @click="testGetAllStructure" class="test-btn">获取层级结构</button>
        <button @click="testGetMainCategories" class="test-btn">获取大类</button>
        <button @click="testGetSubCategories" class="test-btn">获取子分类</button>
        <button @click="testAddSubCategory" class="test-btn">添加子分类</button>
        <button @click="clearLogs" class="test-btn clear-btn">清空日志</button>
      </view>
      
      <!-- 测试结果显示区域 -->
      <view class="logs-container">
        <text class="logs-title">测试日志：</text>
        <view class="logs">
          <text v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
            {{ log.message }}
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import pipeTypeEntityService from '@/services/pipeTypeEntityService.js';

export default {
  data() {
    return {
      logs: []
    };
  },
  
  methods: {
    // 添加日志
    addLog(message, type = 'info') {
      this.logs.push({
        message: `[${new Date().toLocaleTimeString()}] ${message}`,
        type: type
      });
      
      // 自动滚动到底部
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.logs').boundingClientRect();
        query.exec();
      });
    },
    
    // 清空日志
    clearLogs() {
      this.logs = [];
    },
    
    // 运行全部测试
    async runAllTests() {
      this.clearLogs();
      this.addLog('开始运行完整测试套件...', 'info');
      
      try {
        await this.testGetAllStructure();
        await this.testGetMainCategories();
        await this.testGetSubCategories();
        await this.testCheckTypeCodeExists();
        await this.testGetByCode();
        
        // 测试添加和删除
        const addResult = await this.testAddSubCategory();
        if (addResult && addResult.success) {
          await this.testUpdateCategory(addResult.pid);
          await this.testDeleteSubCategory(addResult.pid);
        }
        
        this.addLog('=== 全部测试完成 ===', 'success');
        
      } catch (error) {
        this.addLog(`测试过程中发生错误: ${error.message}`, 'error');
      }
    },
    
    // 测试获取层级结构
    async testGetAllStructure() {
      this.addLog('=== 测试获取全量带层级结构的数据 ===', 'info');
      
      try {
        const result = await pipeTypeEntityService.getAllPipeTypesWithStructure();
        
        if (result.success) {
          const mainCount = result.data.length;
          const subCount = result.data.reduce((total, main) => total + main.children.length, 0);
          
          this.addLog(`获取成功！共有 ${mainCount} 个大类，${subCount} 个二级类别`, 'success');
          
          // 显示前3个大类的信息
          result.data.slice(0, 3).forEach(category => {
            this.addLog(`大类: ${category.typeName} (${category.typeCode}) - 子类数量: ${category.children.length}`, 'info');
          });
          
        } else {
          this.addLog(`获取失败: ${result.message}`, 'error');
        }
        
        return result;
      } catch (error) {
        this.addLog(`获取层级结构失败: ${error.message}`, 'error');
      }
    },
    
    // 测试获取所有大类
    async testGetMainCategories() {
      this.addLog('=== 测试获取所有大类 ===', 'info');
      
      try {
        const result = await pipeTypeEntityService.getMainCategories();
        
        if (result.success) {
          this.addLog(`获取成功！共有 ${result.data.length} 个大类`, 'success');
          
          result.data.forEach(category => {
            this.addLog(`- ${category.typeName} (${category.typeCode})`, 'info');
          });
        } else {
          this.addLog(`获取大类失败: ${result.message}`, 'error');
        }
        
        return result;
      } catch (error) {
        this.addLog(`获取大类失败: ${error.message}`, 'error');
      }
    },
    
    // 测试获取子分类
    async testGetSubCategories() {
      this.addLog('=== 测试获取排水(PS)下的二级分类 ===', 'info');
      
      try {
        const result = await pipeTypeEntityService.getSubCategoriesByParent('PS');
        
        if (result.success) {
          this.addLog(`获取成功！排水下有 ${result.data.length} 个子分类`, 'success');
          
          result.data.forEach(category => {
            this.addLog(`- ${category.typeName} (${category.typeCode}) - ${category.colorCode || '无颜色'}`, 'info');
          });
        } else {
          this.addLog(`获取子分类失败: ${result.message}`, 'error');
        }
        
        return result;
      } catch (error) {
        this.addLog(`获取子分类失败: ${error.message}`, 'error');
      }
    },
    
    // 测试添加子分类
    async testAddSubCategory() {
      this.addLog('=== 测试添加二级类别 ===', 'info');
      
      try {
        const subCategoryData = {
          typeName: '测试排水类型',
          typeCode: `TEST_PS_${Date.now()}`, // 使用时间戳确保唯一性
          colorCode: '#FF5733'
        };
        
        const result = await pipeTypeEntityService.addSubCategory('PS', subCategoryData);
        
        if (result.success) {
          this.addLog(`添加成功！PID: ${result.pid}`, 'success');
          
          // 验证添加结果
          const verifyResult = await pipeTypeEntityService.getPipeTypeEntityById(result.pid);
          if (verifyResult.success) {
            this.addLog(`验证成功: ${verifyResult.data.typeName}`, 'success');
          }
          
          return result;
        } else {
          this.addLog(`添加失败: ${result.message}`, 'error');
        }
      } catch (error) {
        this.addLog(`添加子分类失败: ${error.message}`, 'error');
      }
    },
    
    // 测试更新分类
    async testUpdateCategory(pid) {
      this.addLog('=== 测试更新类别信息 ===', 'info');
      
      try {
        const updateData = {
          typeName: '测试排水类型(已更新)',
          colorCode: '#33FF57'
        };
        
        const result = await pipeTypeEntityService.updatePipeTypeEntity(pid, updateData);
        
        if (result.success) {
          this.addLog('更新成功', 'success');
          
          // 验证更新结果
          const verifyResult = await pipeTypeEntityService.getPipeTypeEntityById(pid);
          if (verifyResult.success) {
            this.addLog(`验证更新: ${verifyResult.data.typeName}`, 'success');
          }
        } else {
          this.addLog(`更新失败: ${result.message}`, 'error');
        }
        
        return result;
      } catch (error) {
        this.addLog(`更新失败: ${error.message}`, 'error');
      }
    },
    
    // 测试删除子分类
    async testDeleteSubCategory(pid) {
      this.addLog('=== 测试删除二级类别 ===', 'info');
      
      try {
        const result = await pipeTypeEntityService.deleteSubCategory(pid);
        
        if (result.success) {
          this.addLog('删除成功', 'success');
          
          // 验证删除结果
          const verifyResult = await pipeTypeEntityService.getPipeTypeEntityById(pid);
          if (!verifyResult.success) {
            this.addLog('验证删除: 记录已不存在', 'success');
          }
        } else {
          this.addLog(`删除失败: ${result.message}`, 'error');
        }
        
        return result;
      } catch (error) {
        this.addLog(`删除失败: ${error.message}`, 'error');
      }
    },
    
    // 测试检查TYPE_CODE存在性
    async testCheckTypeCodeExists() {
      this.addLog('=== 测试检查TYPE_CODE是否存在 ===', 'info');
      
      try {
        // 测试存在的CODE
        const existsResult = await pipeTypeEntityService.checkTypeCodeExists('PS');
        this.addLog(`PS是否存在: ${existsResult.exists}`, 'info');
        
        // 测试不存在的CODE
        const notExistsResult = await pipeTypeEntityService.checkTypeCodeExists('NOT_EXISTS');
        this.addLog(`NOT_EXISTS是否存在: ${notExistsResult.exists}`, 'info');
        
        return { existsResult, notExistsResult };
      } catch (error) {
        this.addLog(`检查TYPE_CODE失败: ${error.message}`, 'error');
      }
    },
    
    // 测试根据CODE获取信息
    async testGetByCode() {
      this.addLog('=== 测试根据TYPE_CODE获取类别信息 ===', 'info');
      
      try {
        const result = await pipeTypeEntityService.getPipeTypeEntityByCode('PS');
        
        if (result.success) {
          this.addLog(`排水(PS)信息: ${result.data.typeName}`, 'success');
        } else {
          this.addLog(`获取失败: ${result.message}`, 'error');
        }
        
        return result;
      } catch (error) {
        this.addLog(`根据CODE获取信息失败: ${error.message}`, 'error');
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
}

.test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.test-btn {
  flex: 1;
  min-width: 200rpx;
  margin: 0;
  font-size: 28rpx;
}

.clear-btn {
  background-color: #f56c6c;
  color: white;
}

.logs-container {
  background-color: #f8f9fa;
  border-radius: 10rpx;
  padding: 20rpx;
}

.logs-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.logs {
  max-height: 800rpx;
  overflow-y: auto;
}

.log-item {
  display: block;
  padding: 10rpx 0;
  font-size: 26rpx;
  line-height: 1.4;
  border-bottom: 1rpx solid #eee;
}

.log-item.info {
  color: #333;
}

.log-item.success {
  color: #67c23a;
}

.log-item.error {
  color: #f56c6c;
}

.log-item.warning {
  color: #e6a23c;
}
</style>