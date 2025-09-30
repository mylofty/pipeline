<template>
  <view class="pipe-type-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">管类设置</text>
      <button class="add-btn" @click="showAddDialog">新增小类</button>
    </view>

    <!-- 管类列表 -->
    <view class="pipe-type-list">
      <uni-collapse v-if="pipeTypes.length > 0">
        <uni-collapse-item 
          v-for="mainCategory in pipeTypes" 
          :key="mainCategory.pid"
          :title="mainCategory.typeName"
          :name="mainCategory.typeCode"
        >
          <template #title>
            <view class="main-category-title">
              <view class="color-indicator" :style="{ backgroundColor: mainCategory.colorCode || '#999' }"></view>
              <text class="category-name">{{ mainCategory.typeName }}</text>
              <text class="category-code">({{ mainCategory.typeCode }})</text>
            </view>
          </template>
          
          <uni-list v-if="mainCategory.children && mainCategory.children.length > 0">
            <uni-list-item 
              v-for="subCategory in mainCategory.children"
              :key="subCategory.pid"
            >
              <template #header>
                <view class="sub-category-item">
                  <view class="color-indicator small" :style="{ backgroundColor: subCategory.colorCode || '#999' }"></view>
                  <view class="category-info">
                    <text class="category-name">{{ subCategory.typeName }}</text>
                    <text class="category-code">{{ subCategory.typeCode }}</text>
                  </view>
                  <view class="action-buttons">
                    <button class="edit-btn" @click.stop="editSubCategory(subCategory)">编辑</button>
                    <button class="delete-btn" @click.stop="deleteSubCategory(subCategory)">删除</button>
                  </view>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
          
          <view v-else class="empty-sub-category">
            <text>暂无小类</text>
          </view>
        </uni-collapse-item>
      </uni-collapse>
      
      <view v-else class="empty-data">
        <text>暂无管类数据</text>
      </view>
    </view>

    <!-- 新增/编辑小类弹窗 -->
    <uni-popup ref="addDialog" type="center">
      <view class="dialog-content">
        <view class="dialog-header">
          <text class="dialog-title">{{ isEdit ? '编辑小类' : '新增小类' }}</text>
        </view>
        
        <view class="dialog-body">
          <!-- 选择大类 -->
          <view class="form-item">
            <text class="form-label">所属大类</text>
            <picker 
              :value="selectedMainCategoryIndex" 
              :range="mainCategoryOptions" 
              range-key="text"
              @change="onMainCategoryChange"
              :disabled="isEdit"
            >
              <view class="picker-input">
                {{ formData.parentTypeCode ? getMainCategoryName(formData.parentTypeCode) : '请选择大类' }}
              </view>
            </picker>
          </view>
          
          <!-- 小类名称 -->
          <view class="form-item">
            <text class="form-label">小类名称</text>
            <input 
              v-model="formData.typeName" 
              class="form-input" 
              placeholder="请输入小类名称"
              maxlength="50"
            />
          </view>
          
          <!-- 小类代码 -->
          <view class="form-item">
            <text class="form-label">小类代码</text>
            <input 
              v-model="formData.typeCode" 
              class="form-input" 
              placeholder="请输入小类代码"
              maxlength="20"
            />
          </view>
          
          <!-- 颜色选择 -->
          <view class="form-item">
            <text class="form-label">颜色代码</text>
            <view class="color-picker-container">
              <button class="color-picker-btn" @click="openColorPicker">选择颜色</button>
              <view class="color-preview" :style="{ backgroundColor: formData.colorCode || '#FF0000' }"></view>
              <text class="color-code-text">{{ formData.colorCode || '#FF0000' }}</text>
            </view>
          </view>
        </view>
        
        <view class="dialog-footer">
          <button class="cancel-btn" @click="closeDialog">取消</button>
          <button class="confirm-btn" @click="submitForm">{{ isEdit ? '更新' : '添加' }}</button>
        </view>
      </view>
    </uni-popup>

    <!-- 颜色选择器组件 -->
    <t-color-picker 
      ref="colorPicker" 
      :color="colorObject" 
      @confirm="onColorConfirm"
    ></t-color-picker>
  </view>
</template>

<script>
import pipeTypeEntityService from '@/services/pipeTypeEntityService.js';
import tColorPicker from '@/components/t-color-picker/t-color-picker.vue';

export default {
  name: 'PipeType',
  components: {
    tColorPicker
  },
  data() {
    return {
      pipeTypes: [], // 管类数据（带层级结构）
      mainCategories: [], // 大类列表
      isEdit: false, // 是否为编辑模式
      currentEditItem: null, // 当前编辑的项目
      selectedMainCategoryIndex: 0, // 选中的大类索引
      formData: {
        parentTypeCode: '',
        typeName: '',
        typeCode: '',
        colorCode: '#FF0000'
      }
    };
  },
  
  computed: {
    // 大类选项（用于下拉选择）
    mainCategoryOptions() {
      return this.mainCategories.map(item => ({
        value: item.typeCode,
        text: item.typeName
      }));
    },
    
    // 颜色对象（用于颜色选择器）
    colorObject() {
      // 将十六进制颜色转换为RGB对象
      const hex = this.formData.colorCode || '#FF0000';
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b, a: 1 };
    }
  },
  
  async onLoad() {
    await this.loadData();
  },
  
  methods: {
    // 加载数据
    async loadData() {
      uni.showLoading({ title: '加载中...' });
      
      try {
        // 加载带层级结构的管类数据
        const structureResult = await pipeTypeEntityService.getAllPipeTypesWithStructure();
        if (structureResult.success) {
          this.pipeTypes = structureResult.data;
        } else {
          uni.showToast({
            title: structureResult.message,
            icon: 'error'
          });
        }
        
        // 加载大类列表
        const mainResult = await pipeTypeEntityService.getMainCategories();
        if (mainResult.success) {
          this.mainCategories = mainResult.data;
        } else {
          uni.showToast({
            title: mainResult.message,
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        uni.showToast({
          title: '加载数据失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 显示新增对话框
    showAddDialog() {
      this.isEdit = false;
      this.currentEditItem = null;
      this.resetForm();
      this.$refs.addDialog.open();
    },
    
    // 编辑小类
    editSubCategory(subCategory) {
      this.isEdit = true;
      this.currentEditItem = subCategory;
      this.formData = {
        parentTypeCode: subCategory.preTypeCode,
        typeName: subCategory.typeName,
        typeCode: subCategory.typeCode,
        colorCode: subCategory.colorCode || '#FF0000'
      };
      // 设置选中的大类索引
      this.selectedMainCategoryIndex = this.mainCategoryOptions.findIndex(item => item.value === subCategory.preTypeCode);
      if (this.selectedMainCategoryIndex === -1) {
        this.selectedMainCategoryIndex = 0;
      }
      this.$refs.addDialog.open();
    },
    
    // 删除小类
    async deleteSubCategory(subCategory) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除小类"${subCategory.typeName}"吗？`,
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '删除中...' });
            
            try {
              const result = await pipeTypeEntityService.deleteSubCategory(subCategory.pid);
              if (result.success) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                await this.loadData(); // 重新加载数据
              } else {
                uni.showToast({
                  title: result.message,
                  icon: 'error'
                });
              }
            } catch (error) {
              console.error('删除失败:', error);
              uni.showToast({
                title: '删除失败',
                icon: 'error'
              });
            } finally {
              uni.hideLoading();
            }
          }
        }
      });
    },
    
    // 打开颜色选择器
    openColorPicker() {
      this.$refs.colorPicker.open();
    },
    
    // 颜色选择器确认事件
    onColorConfirm(colorData) {
      console.log('颜色选择器返回值：', colorData);
      
      // 提取十六进制颜色值
      let hexColor = '#FF0000'; // 默认颜色
      
      if (typeof colorData === 'string') {
        // 如果直接返回字符串
        hexColor = colorData;
      } else if (colorData && colorData.hex) {
        // 如果返回对象且包含hex属性
        hexColor = colorData.hex;
      } else if (colorData && colorData.rgba) {
        // 如果返回对象且包含rgba属性，转换为hex
        const { r, g, b } = colorData.rgba;
        hexColor = '#' + [r, g, b].map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
      } else if (colorData && typeof colorData === 'object' && colorData.r !== undefined) {
        // 如果直接是RGB对象
        const { r, g, b } = colorData;
        hexColor = '#' + [r, g, b].map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
      }
      
      this.formData.colorCode = hexColor;
      console.log('最终颜色代码：', hexColor);
    },
    
    // 关闭对话框
    closeDialog() {
      this.$refs.addDialog.close();
      this.resetForm();
    },
    
    // 大类选择改变
    onMainCategoryChange(e) {
      this.selectedMainCategoryIndex = e.detail.value;
      this.formData.parentTypeCode = this.mainCategoryOptions[e.detail.value].value;
    },
    
    // 获取大类名称
    getMainCategoryName(typeCode) {
      const category = this.mainCategories.find(item => item.typeCode === typeCode);
      return category ? category.typeName : '';
    },
    
    // 重置表单
    resetForm() {
      this.formData = {
        parentTypeCode: '',
        typeName: '',
        typeCode: '',
        colorCode: '#FF0000'
      };
      this.selectedMainCategoryIndex = 0;
    },
    
    // 提交表单
    async submitForm() {
      // 表单验证
      if (!this.formData.parentTypeCode) {
        uni.showToast({
          title: '请选择所属大类',
          icon: 'error'
        });
        return;
      }
      
      if (!this.formData.typeName.trim()) {
        uni.showToast({
          title: '请输入小类名称',
          icon: 'error'
        });
        return;
      }
      
      if (!this.formData.typeCode.trim()) {
        uni.showToast({
          title: '请输入小类代码',
          icon: 'error'
        });
        return;
      }
      
      uni.showLoading({ title: this.isEdit ? '更新中...' : '添加中...' });
      
      try {
        let result;
        
        if (this.isEdit) {
          // 更新小类
          const updateData = {
            typeName: this.formData.typeName.trim(),
            typeCode: this.formData.typeCode.trim(),
            colorCode: this.formData.colorCode
          };
          result = await pipeTypeEntityService.updatePipeTypeEntity(this.currentEditItem.pid, updateData);
        } else {
          // 添加小类
          const subCategoryData = {
            typeName: this.formData.typeName.trim(),
            typeCode: this.formData.typeCode.trim(),
            colorCode: this.formData.colorCode
          };
          result = await pipeTypeEntityService.addSubCategory(this.formData.parentTypeCode, subCategoryData);
        }
        
        if (result.success) {
          uni.showToast({
            title: this.isEdit ? '更新成功' : '添加成功',
            icon: 'success'
          });
          this.closeDialog();
          await this.loadData(); // 重新加载数据
        } else {
          uni.showToast({
            title: result.message,
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('操作失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pipe-type-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
}

.pipe-type-list {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.main-category-title {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.color-indicator {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  border: 2rpx solid #ddd;
  
  &.small {
    width: 24rpx;
    height: 24rpx;
    margin-right: 16rpx;
  }
}

.category-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.category-code {
  font-size: 24rpx;
  color: #999;
}

.sub-category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.category-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .category-name {
    font-size: 28rpx;
    font-weight: normal;
    margin-bottom: 8rpx;
  }
  
  .category-code {
    font-size: 22rpx;
  }
}

.action-buttons {
  display: flex;
  gap: 16rpx;
}

.edit-btn, .delete-btn {
  padding: 12rpx 24rpx;
  border: none;
  border-radius: 6rpx;
  font-size: 24rpx;
  min-width: 80rpx;
}

.edit-btn {
  background-color: #007aff;
  color: #fff;
}

.delete-btn {
  background-color: #ff3b30;
  color: #fff;
}

.empty-sub-category, .empty-data {
  text-align: center;
  padding: 60rpx 20rpx;
  color: #999;
  font-size: 28rpx;
}

.dialog-content {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.dialog-header {
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.dialog-body {
  padding: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.picker-input {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.color-picker-btn {
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 6rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
}

.color-preview {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  border: 2rpx solid #ddd;
}

.color-code-text {
  font-size: 24rpx;
  color: #666;
}

.dialog-footer {
  display: flex;
  padding: 20rpx 40rpx 40rpx;
  gap: 20rpx;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  height: 80rpx;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #007aff;
  color: #fff;
}
</style>