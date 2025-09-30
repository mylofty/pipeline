<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <uni-icons type="left" size="20" color="#fff"></uni-icons>
      </view>
      <view class="nav-title">管类设置</view>
      <view class="nav-right" @click="showAddDialog">
        <uni-icons type="plus" size="20" color="#fff"></uni-icons>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 管类列表 -->
      <view class="category-list">
        <view v-for="(category, categoryIndex) in pipeTypes" :key="category.pid" class="category-section">
          <!-- 大类标题 -->
          <view class="main-category" @click="toggleCategory(categoryIndex)">
            <view class="category-left">
              <view class="category-icon">
                <uni-icons type="folder" size="20" color="#666"></uni-icons>
              </view>
              <view class="category-info">
                <text class="category-name">{{ category.typeName }}</text>
                <text class="category-code">{{ category.typeCode }}</text>
              </view>
            </view>
            <view class="category-right">
              <text class="sub-count">{{ category.children ? category.children.length : 0 }}项</text>
              <uni-icons :type="category.expanded ? 'up' : 'down'" size="16" color="#999"></uni-icons>
            </view>
          </view>

          <!-- 小类列表 -->
          <view v-if="category.expanded" class="sub-category-list">
            <view v-if="category.children && category.children.length > 0">
              <view v-for="(subcat, subcatIndex) in category.children" :key="subcat.pid" class="sub-category-item">
                <view class="sub-left">
                  <view class="color-dot" :style="{backgroundColor: subcat.colorCode || '#999'}"></view>
                  <view class="sub-info">
                    <text class="sub-name">{{ subcat.typeName }}</text>
                    <text class="sub-code">{{ subcat.typeCode }}</text>
                  </view>
                </view>
                <view class="sub-actions">
                  <view class="action-btn edit" @click="editSubCategory(subcat)">
                    <uni-icons type="compose" size="16" color="#007AFF"></uni-icons>
                  </view>
                  <view class="action-btn delete" @click="deleteSubCategory(subcat)">
                    <uni-icons type="trash" size="16" color="#FF3B30"></uni-icons>
                  </view>
                </view>
              </view>
            </view>
            <view v-else class="empty-sub">
              <uni-icons type="info" size="16" color="#ccc"></uni-icons>
              <text class="empty-text">暂无小类，点击右上角添加</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="pipeTypes.length === 0" class="empty-state">
        <uni-icons type="folder" size="60" color="#ddd"></uni-icons>
        <text class="empty-title">暂无管类数据</text>
        <text class="empty-desc">请联系管理员添加管类数据</text>
      </view>
    </view>

    <!-- 新增/编辑弹窗 -->
    <uni-popup ref="addDialog" type="center" :mask-click="false">
      <view class="dialog">
        <view class="dialog-header">
          <text class="dialog-title">{{ isEdit ? '编辑小类' : '新增小类' }}</text>
          <view class="close-btn" @click="closeDialog">
            <uni-icons type="close" size="18" color="#999"></uni-icons>
          </view>
        </view>
        
        <view class="dialog-body">
          <!-- 所属大类 -->
          <view class="form-group">
            <text class="label">所属大类</text>
            <picker 
              :value="selectedMainCategoryIndex" 
              :range="mainCategoryOptions" 
              range-key="text"
              @change="onMainCategoryChange"
              :disabled="isEdit"
            >
              <view class="picker-wrapper">
                <text class="picker-text">{{ formData.parentTypeCode ? getMainCategoryName(formData.parentTypeCode) : '请选择大类' }}</text>
                <uni-icons type="down" size="14" color="#999"></uni-icons>
              </view>
            </picker>
          </view>
          
          <!-- 小类名称 -->
          <view class="form-group">
            <text class="label">小类名称</text>
            <input 
              v-model="formData.typeName" 
              class="input" 
              placeholder="请输入小类名称"
              maxlength="50"
            />
          </view>
          
          <!-- 小类代码 -->
          <view class="form-group">
            <text class="label">小类代码</text>
            <input 
              v-model="formData.typeCode" 
              class="input" 
              placeholder="请输入小类代码"
              maxlength="20"
            />
          </view>
          
          <!-- 颜色选择 -->
          <view class="form-group">
            <text class="label">颜色</text>
            <view class="color-selector" @click="openColorPicker">
              <view class="color-preview" :style="{backgroundColor: formData.colorCode || '#FF0000'}"></view>
              <text class="color-value">{{ formData.colorCode || '#FF0000' }}</text>
              <uni-icons type="right" size="14" color="#999"></uni-icons>
            </view>
          </view>
        </view>
        
        <view class="dialog-footer">
          <button class="btn cancel" @click="closeDialog">取消</button>
          <button class="btn confirm" @click="submitForm">{{ isEdit ? '保存' : '新增' }}</button>
        </view>
      </view>
    </uni-popup>

    <!-- 颜色选择器 -->
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
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 切换大类展开状态
    toggleCategory(index) {
      this.$set(this.pipeTypes[index], 'expanded', !this.pipeTypes[index].expanded);
    },

    // 加载数据
    async loadData() {
      uni.showLoading({ title: '加载中...' });
      
      try {
        // 加载带层级结构的管类数据
        const structureResult = await pipeTypeEntityService.getAllPipeTypesWithStructure();
        if (structureResult.success) {
          // 直接使用数据库返回的原始顺序，不进行任何排序
          this.pipeTypes = structureResult.data.map(item => ({
            ...item,
            expanded: false // 默认收起
          }));
        } else {
          uni.showToast({
            title: structureResult.message,
            icon: 'error'
          });
        }
        
        // 加载大类列表
        const mainResult = await pipeTypeEntityService.getMainCategories();
        if (mainResult.success) {
          // 直接使用数据库返回的原始顺序，不进行任何排序
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
.container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  
  .nav-left, .nav-right {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s;
    
    &:active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  
  .nav-title {
    font-size: 36rpx;
    font-weight: 600;
  }
}

/* 内容区域 */
.content {
  padding: 24rpx;
}

/* 分类列表 */
.category-list {
  .category-section {
    margin-bottom: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  }
}

/* 主分类 */
.main-category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: #fff;
  transition: background-color 0.3s;
  
  &:active {
    background-color: #f8f9fa;
  }
  
  .category-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .category-icon {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f2f5;
      border-radius: 12rpx;
      margin-right: 24rpx;
    }
    
    .category-info {
      .category-name {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 8rpx;
      }
      
      .category-code {
        font-size: 24rpx;
        color: #8e8e93;
      }
    }
  }
  
  .category-right {
    display: flex;
    align-items: center;
    
    .sub-count {
      font-size: 24rpx;
      color: #8e8e93;
      margin-right: 16rpx;
    }
  }
}

/* 子分类列表 */
.sub-category-list {
  border-top: 1rpx solid #f0f0f0;
  background: #fafafa;
  
  .sub-category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    transition: background-color 0.3s;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background-color: #f0f0f0;
    }
    
    .sub-left {
      display: flex;
      align-items: center;
      flex: 1;
      
      .color-dot {
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        margin-right: 20rpx;
        border: 2rpx solid #fff;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
      }
      
      .sub-info {
        .sub-name {
          display: block;
          font-size: 28rpx;
          color: #1a1a1a;
          margin-bottom: 6rpx;
        }
        
        .sub-code {
          font-size: 22rpx;
          color: #8e8e93;
        }
      }
    }
    
    .sub-actions {
      display: flex;
      gap: 16rpx;
      
      .action-btn {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12rpx;
        transition: all 0.3s;
        
        &.edit {
          background: rgba(0, 122, 255, 0.1);
          
          &:active {
            background: rgba(0, 122, 255, 0.2);
            transform: scale(0.95);
          }
        }
        
        &.delete {
          background: rgba(255, 59, 48, 0.1);
          
          &:active {
            background: rgba(255, 59, 48, 0.2);
            transform: scale(0.95);
          }
        }
      }
    }
  }
  
  .empty-sub {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60rpx 32rpx;
    
    .empty-text {
      font-size: 26rpx;
      color: #8e8e93;
      margin-left: 12rpx;
    }
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  
  .empty-title {
    font-size: 32rpx;
    color: #8e8e93;
    margin: 24rpx 0 12rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
    color: #c7c7cc;
  }
}

/* 弹窗样式 */
.dialog {
  width: 640rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .dialog-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .close-btn {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.3s;
      
      &:active {
        background-color: #f0f0f0;
      }
    }
  }
  
  .dialog-body {
    padding: 32rpx;
    
    .form-group {
      margin-bottom: 32rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        display: block;
        font-size: 28rpx;
        color: #1a1a1a;
        margin-bottom: 16rpx;
        font-weight: 500;
      }
      
      .input {
        width: 100%;
        height: 88rpx;
        padding: 0 24rpx;
        border: 2rpx solid #e5e5ea;
        border-radius: 12rpx;
        font-size: 28rpx;
        color: #1a1a1a;
        box-sizing: border-box;
        transition: border-color 0.3s;
        
        &:focus {
          border-color: #007aff;
        }
        
        &::placeholder {
          color: #c7c7cc;
        }
      }
      
      .picker-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88rpx;
        padding: 0 24rpx;
        border: 2rpx solid #e5e5ea;
        border-radius: 12rpx;
        background: #fff;
        
        .picker-text {
          font-size: 28rpx;
          color: #1a1a1a;
        }
      }
      
      .color-selector {
        display: flex;
        align-items: center;
        height: 88rpx;
        padding: 0 24rpx;
        border: 2rpx solid #e5e5ea;
        border-radius: 12rpx;
        background: #fff;
        transition: border-color 0.3s;
        
        &:active {
          border-color: #007aff;
        }
        
        .color-preview {
          width: 48rpx;
          height: 48rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
          border: 2rpx solid #e5e5ea;
        }
        
        .color-value {
          flex: 1;
          font-size: 28rpx;
          color: #1a1a1a;
        }
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    padding: 24rpx 32rpx 32rpx;
    gap: 24rpx;
    
    .btn {
      flex: 1;
      height: 88rpx;
      border: none;
      border-radius: 12rpx;
      font-size: 30rpx;
      font-weight: 500;
      transition: all 0.3s;
      
      &.cancel {
        background: #f2f2f7;
        color: #8e8e93;
        
        &:active {
          background: #e5e5ea;
          transform: scale(0.98);
        }
      }
      
      &.confirm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        
        &:active {
          transform: scale(0.98);
          opacity: 0.9;
        }
      }
    }
  }
}
</style>