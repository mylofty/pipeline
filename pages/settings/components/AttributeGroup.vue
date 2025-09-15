<template>
  <view class="attribute-list">
    <view 
      class="attribute-item" 
      v-for="(attr, index) in attributes" 
      :key="attr.key"
    >
      <view class="attribute-info">
        <view class="attribute-name">
          <text>{{ attr.label }}</text>
          <text v-if="attr.required" class="required-mark">*</text>
        </view>
        <text class="attribute-desc">{{ attr.description }}</text>
      </view>
      <view 
        class="checkbox" 
        :class="{ 
          'checkbox-checked': attr.enabled, 
          'checkbox-disabled': attr.required && !attr.enabled 
        }"
        @click="handleToggle(index, { detail: { value: !attr.enabled } })"
      >
        <text v-if="attr.enabled" class="checkbox-icon">✓</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AttributeGroup',
  props: {
    attributes: {
      type: Array,
      required: true
    }
  },

  methods: {
    handleToggle(index, event) {
      const attr = this.attributes[index]
      
      if (attr.required && !event.detail.value) {
        uni.showToast({
          title: '必填属性不能禁用',
          icon: 'none'
        })
        return
      }
      
      this.$emit('toggle', {
        index,
        value: event.detail.value,
        attr
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute-list {
  background: #ffffff;
}

.attribute-item {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  border-bottom: 1rpx solid #e8e8e8;
  min-height: 80rpx;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
}

.attribute-info {
  flex: 1;
  display: flex;
  align-items: center;
  
  .attribute-name {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #333333;
    min-width: 200rpx;
    
    .required-mark {
      color: #ff4757;
      margin-left: 4rpx;
      font-weight: bold;
    }
  }
  
  .attribute-desc {
    font-size: 22rpx;
    color: #888888;
    margin-left: 16rpx;
    opacity: 0.8;
  }
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ccc;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.2s ease;
  margin-left: 16rpx;
  flex-shrink: 0;
  
  &.checkbox-checked {
    background-color: #4285f4;
    border-color: #4285f4;
    
    .checkbox-icon {
      color: #ffffff;
      font-size: 20rpx;
      font-weight: bold;
    }
  }
  
  &.checkbox-disabled {
    background-color: #f5f5f5;
    border-color: #e0e0e0;
    opacity: 0.6;
  }
  
  &:active:not(.checkbox-disabled) {
    transform: scale(0.9);
  }
}

.checkbox-icon {
  line-height: 1;
}
</style>