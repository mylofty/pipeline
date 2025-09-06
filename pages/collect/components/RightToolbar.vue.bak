<template>
  <cover-view class="right-toolbar">
    <!-- 影像/矢量切换 -->
    <cover-view class="tool-section">
      <cover-view 
        class="tool-btn map-type-btn" 
        :class="{ active: mapType === 'satellite' }"
        @click="toggleMapType"
      >
        <cover-view class="tool-icon">🛰️</cover-view>
        <cover-view class="tool-text">{{ mapType === 'satellite' ? '影像' : '矢量' }}</cover-view>
      </cover-view>
    </cover-view>

    <!-- 创建工具集 -->
    <cover-view class="tool-section">
      <cover-view class="section-title">创建工具</cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'point' }"
        @click="selectTool('point')"
      >
        <cover-view class="tool-icon">📍</cover-view>
        <cover-view class="tool-text">管点</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'line' }"
        @click="selectTool('line')"
      >
        <cover-view class="tool-icon">📏</cover-view>
        <cover-view class="tool-text">管线</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'virtual' }"
        @click="selectTool('virtual')"
      >
        <cover-view class="tool-icon">⚡</cover-view>
        <cover-view class="tool-text">虚拟线</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'shared' }"
        @click="selectTool('shared')"
      >
        <cover-view class="tool-icon">🔗</cover-view>
        <cover-view class="tool-text">共管</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'insert' }"
        @click="selectTool('insert')"
      >
        <cover-view class="tool-icon">➕</cover-view>
        <cover-view class="tool-text">插入</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'collect' }"
        @click="selectTool('collect')"
      >
        <cover-view class="tool-icon">✅</cover-view>
        <cover-view class="tool-text">收点</cover-view>
      </cover-view>
    </cover-view>

    <!-- 编辑工具集 -->
    <cover-view class="tool-section">
      <cover-view class="section-title">编辑工具</cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'edit' }"
        @click="selectTool('edit')"
      >
        <cover-view class="tool-icon">✏️</cover-view>
        <cover-view class="tool-text">编辑</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'measure' }"
        @click="selectTool('measure')"
      >
        <cover-view class="tool-icon">📐</cover-view>
        <cover-view class="tool-text">测量</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'flow' }"
        @click="selectTool('flow')"
      >
        <cover-view class="tool-icon">🔄</cover-view>
        <cover-view class="tool-text">流向</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'move' }"
        @click="selectTool('move')"
      >
        <cover-view class="tool-icon">🔄</cover-view>
        <cover-view class="tool-text">移动</cover-view>
      </cover-view>
      <cover-view 
        class="tool-btn" 
        :class="{ active: currentTool === 'delete' }"
        @click="selectTool('delete')"
      >
        <cover-view class="tool-icon">🗑️</cover-view>
        <cover-view class="tool-text">删除</cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
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
  z-index: 1000;
  pointer-events: auto;
  
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
      pointer-events: auto;
      
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