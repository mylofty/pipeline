<template>
  <div class="test-container">
    <div class="header">
      <text class="title">管线功能测试</text>
    </div>
    
    <div class="test-info">
      <text class="info-text">当前工具: {{ currentTool || '未选择' }}</text>
      <text class="info-text">管线模式: {{ pipelineMode ? '已启动' : '未启动' }}</text>
      <text class="info-text">已选择点数: {{ selectedPoints.length }}</text>
    </div>
    
    <div class="buttons">
      <button @click="selectTool('line')" class="test-btn">
        {{ currentTool === 'line' ? '取消管线工具' : '选择管线工具' }}
      </button>
      <button @click="addTestPoints" class="test-btn">添加测试管点</button>
      <button @click="clearAll" class="test-btn">清除所有</button>
    </div>
    
    <div class="map-container">
      <map
        id="testMap"
        class="test-map"
        :longitude="longitude"
        :latitude="latitude"
        :scale="scale"
        :markers="markers"
        :polyline="polylines"
        @tap="onMapTap"
        @markertap="onMarkerTap"
      >
      </map>
    </div>
    
    <!-- 管线信息弹窗 -->
    <div class="pipeline-modal" v-if="showPipelineForm" @click="closePipelineForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <text class="modal-title">管线信息</text>
          <div class="close-btn" @click="closePipelineForm">
            <text>×</text>
          </div>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <text class="label">起点号：</text>
            <text class="form-value">{{ pipelineFormData.startPointId }}</text>
          </div>
          <div class="form-item">
            <text class="label">终点号：</text>
            <text class="form-value">{{ pipelineFormData.endPointId }}</text>
          </div>
          <div class="form-item">
            <text class="label">长度：</text>
            <text class="form-value">{{ pipelineFormData.length }}米</text>
          </div>
        </div>
        <div class="modal-footer">
          <div class="cancel-btn" @click="closePipelineForm">
            <text>取消</text>
          </div>
          <div class="confirm-btn" @click="savePipeline">
            <text>确定</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  setup() {
    const currentTool = ref('')
    const pipelineMode = ref(false)
    const selectedPoints = ref([])
    const showPipelineForm = ref(false)
    const longitude = ref(116.397428)
    const latitude = ref(39.90923)
    const scale = ref(16)
    const markers = ref([])
    const polylines = ref([])
    
    const pipelineFormData = reactive({
      startPointId: '',
      endPointId: '',
      length: '0'
    })
    
    const selectTool = (tool) => {
      if (currentTool.value === tool) {
        currentTool.value = ''
        pipelineMode.value = false
        selectedPoints.value = []
      } else {
        currentTool.value = tool
        if (tool === 'line') {
          pipelineMode.value = true
          selectedPoints.value = []
          uni.showToast({
            title: '管线模式已启动，请点击两个管点',
            icon: 'none'
          })
        }
      }
    }
    
    const addTestPoints = () => {
      markers.value = [
        {
          id: 'point1',
          latitude: 39.90923,
          longitude: 116.397428,
          iconPath: '/static/icons/point.svg',
          width: 30,
          height: 30,
          title: '16YS1'
        },
        {
          id: 'point2',
          latitude: 39.91023,
          longitude: 116.398428,
          iconPath: '/static/icons/point.svg',
          width: 30,
          height: 30,
          title: '16YS2'
        }
      ]
      uni.showToast({
        title: '已添加测试管点',
        icon: 'success'
      })
    }
    
    const onMapTap = (e) => {
      if (!pipelineMode.value) return
      
      console.log('地图点击:', e)
    }
    
    const onMarkerTap = (e) => {
      if (!pipelineMode.value) return
      
      const markerId = e.detail.markerId
      const marker = markers.value.find(m => m.id === markerId)
      
      if (!marker) return
      
      if (selectedPoints.value.find(p => p.id === marker.id)) {
        uni.showToast({
          title: '该管点已被选择',
          icon: 'none'
        })
        return
      }
      
      selectedPoints.value.push(marker)
      
      if (selectedPoints.value.length === 1) {
        uni.showToast({
          title: `已选择起点：${marker.title}`,
          icon: 'none'
        })
      } else if (selectedPoints.value.length === 2) {
        pipelineFormData.startPointId = selectedPoints.value[0].title
        pipelineFormData.endPointId = selectedPoints.value[1].title
        pipelineFormData.length = '16.00'
        showPipelineForm.value = true
      }
    }
    
    const closePipelineForm = () => {
      showPipelineForm.value = false
      selectedPoints.value = []
    }
    
    const savePipeline = () => {
      const newPipeline = {
        points: [
          {
            longitude: selectedPoints.value[0].longitude,
            latitude: selectedPoints.value[0].latitude
          },
          {
            longitude: selectedPoints.value[1].longitude,
            latitude: selectedPoints.value[1].latitude
          }
        ],
        color: '#FF0000',
        width: 4
      }
      
      polylines.value.push(newPipeline)
      closePipelineForm()
      
      uni.showToast({
        title: '管线创建成功',
        icon: 'success'
      })
    }
    
    const clearAll = () => {
      markers.value = []
      polylines.value = []
      selectedPoints.value = []
      currentTool.value = ''
      pipelineMode.value = false
    }
    
    return {
      currentTool,
      pipelineMode,
      selectedPoints,
      showPipelineForm,
      longitude,
      latitude,
      scale,
      markers,
      polylines,
      pipelineFormData,
      selectTool,
      addTestPoints,
      onMapTap,
      onMarkerTap,
      closePipelineForm,
      savePipeline,
      clearAll
    }
  }
}
</script>

<style scoped>
.test-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.test-info {
  padding: 10px;
  background-color: #f5f5f5;
}

.info-text {
  font-size: 14px;
  margin-bottom: 5px;
}

.buttons {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.test-btn {
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.map-container {
  flex: 1;
}

.test-map {
  width: 100%;
  height: 100%;
}

/* 管线信息弹窗样式 */
.pipeline-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  background-color: #2196F3;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 16px;
  font-weight: bold;
}

.close-btn {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.modal-body {
  padding: 20px;
}

.form-item {
  display: flex;
  margin-bottom: 15px;
}

.label {
  width: 80px;
  font-size: 14px;
  color: #666;
}

.form-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.modal-footer {
  padding: 15px 20px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 10px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #2196F3;
  color: white;
}
</style>