<template>
  <view class="collapse-item">
    <view class="collapse-header" @click="toggleCollapse">
      <text class="collapse-title">{{ title }}</text>
      <text class="collapse-arrow" :class="{ 'arrow-expanded': isOpen }">▼</text>
    </view>
    <view class="collapse-content" :class="{ 'content-expanded': isOpen }" v-if="isOpen">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CollapseItem',
  props: {
    title: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.open
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal
    }
  },
  methods: {
    toggleCollapse() {
      this.isOpen = !this.isOpen
      this.$emit('toggle', this.isOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse-item {
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.collapse-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.collapse-title {
  color: #ffffff;
  font-weight: bold;
  font-size: 32rpx;
}

.collapse-arrow {
  color: #ffffff;
  font-size: 24rpx;
  transition: transform 0.3s ease;
  
  &.arrow-expanded {
    transform: rotate(180deg);
  }
}

.collapse-content {
  background: #ffffff;
  overflow: hidden;
}
</style>