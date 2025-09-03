<template>
  <view class="right-toolbar">
    <!-- 影像/矢量切换 -->
    <view class="tool-section">
      <view 
        class="tool-btn map-type-btn" 
        :class="{ active: mapType === 'satellite' }"
        @click="toggleMapType"
      >
        <text class="tool-icon">🛰️</text>
        <text class="tool-text">{{ mapType === 'satellite' ? '影像' : '矢量' }}</text>
      </view>
    </view>

    <!-- 创建工具集 -->
    <view class="tool-section">
      <view class="section-title">创建工具</view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'point' }"
        @click="selectTool('point')"
      >
        <text class="tool-icon">📍</text>
        <text class="tool-text">管点</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'line' }"
        @click="selectTool('line')"
      >
        <text class="tool-icon">📏</text>
        <text class="tool-text">管线</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'virtual' }"
        @click="selectTool('virtual')"
      >
        <text class="tool-icon">⚡</text>
        <text class="tool-text">虚拟线</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'shared' }"
        @click="selectTool('shared')"
      >
        <text class="tool-icon">🔗</text>
        <text class="tool-text">共管</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'insert' }"
        @click="selectTool('insert')"
      >
        <text class="tool-icon">➕</text>
        <text class="tool-text">插入</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'collect' }"
        @click="selectTool('collect')"
      >
        <text class="tool-icon">✅</text>
        <text class="tool-text">收点</text>
      </view>
    </view>

    <!-- 编辑工具集 -->
    <view class="tool-section">
      <view class="section-title">编辑工具</view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'edit' }"
        @click="selectTool('edit')"
      >
        <text class="tool-icon">✏️</text>
        <text class="tool-text">编辑</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'measure' }"
        @click="selectTool('measure')"
      >
        <text class="tool-icon">📐</text>
        <text class="tool-text">测量</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'flow' }"
        @click="selectTool('flow')"
      >
        <text class="tool-icon">🔄</text>
        <text class="tool-text">流向</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'move' }"
        @click="selectTool('move')"
      >
        <text class="tool-icon">🔄</text>
        <text class="tool-text">移动</text>
      </view>
      <view 
        class="tool-btn" 
        :class="{ active: currentTool === 'delete' }"
        @click="selectTool('delete')"
      >
        <text class="tool-icon">🗑️</text>
        <text class="tool-text">删除</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  mapType: {
    type: String,
    default: 'vector'
  },
  currentTool: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['toggleMapType', 'selectTool'])

const toggleMapType = () => {
  emit('toggleMapType')
}

const selectTool = (tool) => {
  emit('selectTool', tool)
}
</script>

<style lang="scss" scoped>
.right-toolbar {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 70px;
  max-height: 80vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  overflow-y: auto;
  overflow-x: hidden;
  
  .tool-section {
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .section-title {
      padding: 6px 8px;
      font-size: 10px;
      color: #666;
      background: #f8f8f8;
      text-align: center;
      font-weight: bold;
    }
    
    .tool-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 3px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.active {
        background: #e3f2fd;
        color: #2196F3;
      }
      
      &.map-type-btn.active {
        background: #e8f5e8;
        color: #4CAF50;
      }
      
      .tool-icon {
        font-size: 14px;
        margin-bottom: 2px;
      }
      
      .tool-text {
        font-size: 9px;
        text-align: center;
        line-height: 1.1;
      }
    }
  }
}

@media (max-width: 768px) {
  .right-toolbar {
    width: 60px;
    max-height: 75vh;
    
    .section-title {
      padding: 4px 6px;
      font-size: 9px;
    }
    
    .tool-btn {
      padding: 5px 2px;
      
      .tool-icon {
        font-size: 12px;
      }
      
      .tool-text {
        font-size: 8px;
      }
    }
  }
}
</style>