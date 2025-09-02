<template>
  <view class="collect-container">
    <!-- 顶部工具栏 -->
    <view class="top-toolbar">
      <!-- 图层管理下拉框 -->
      <view class="layer-selector">
        <picker @change="onLayerChange" :value="currentLayerIndex" :range="layerOptions">
          <view class="picker-display">
            <text>{{ layerOptions[currentLayerIndex] }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      
      <!-- 探点号搜索框 -->
      <view class="search-container">
        <input 
          type="text" 
          placeholder="搜索管点物探点号..." 
          v-model="searchPointNo"
          @confirm="searchPoint"
          class="search-input"
        />
        <view class="search-btn" @click="searchPoint">🔍</view>
      </view>
    </view>

    <!-- 地图容器 -->
    <view class="map-wrapper">
      <map 
        id="amap"
        class="amap"
        :longitude="mapCenter.longitude"
        :latitude="mapCenter.latitude"
        :scale="mapScale"
        :markers="markers"
        :polyline="polylines"
        :polygons="polygons"
        @tap="onMapTap"
        @markertap="onMarkerTap"
        @regionchange="onRegionChange"
        show-location
        enable-3D
        enable-overlooking
        enable-zoom
        enable-scroll
        enable-rotate
        :enable-satellite="mapType === 'satellite'"
      >
        <!-- 定位按钮 -->
        <cover-view class="location-btn" @tap="getCurrentLocation">
          <cover-image src="/static/icons/location.png" class="location-icon"></cover-image>
        </cover-view>
      </map>

      <!-- 右侧工具栏 -->
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
    </view>

    <!-- 管点属性弹窗 -->
    <view class="point-modal" v-if="showPointModal" @click="closePointModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">管点属性</text>
          <view class="close-btn" @click="closePointModal">×</view>
        </view>
        <view class="modal-body">
          <view class="form-item">
            <text class="label">点号：</text>
            <input type="text" v-model="pointForm.pointNo" placeholder="请输入点号" />
          </view>
          <view class="form-item">
            <text class="label">管径：</text>
            <input type="number" v-model="pointForm.diameter" placeholder="请输入管径(mm)" />
          </view>
          <view class="form-item">
            <text class="label">材质：</text>
            <picker @change="onMaterialChange" :value="materialIndex" :range="materialOptions">
              <view class="picker-display">{{ materialOptions[materialIndex] }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">埋深：</text>
            <input type="number" v-model="pointForm.depth" placeholder="请输入埋深(m)" />
          </view>
          <view class="form-item">
            <text class="label">备注：</text>
            <textarea v-model="pointForm.remark" placeholder="请输入备注信息"></textarea>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closePointModal">取消</button>
          <button class="confirm-btn" @click="savePoint">确定</button>
        </view>
      </view>
    </view>

    <!-- 管线属性弹窗 -->
    <view class="line-modal" v-if="showLineModal" @click="closeLineModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">管线属性</text>
          <view class="close-btn" @click="closeLineModal">×</view>
        </view>
        <view class="modal-body">
          <view class="form-item">
            <text class="label">管线类型：</text>
            <picker @change="onLineTypeChange" :value="lineTypeIndex" :range="lineTypeOptions">
              <view class="picker-display">{{ lineTypeOptions[lineTypeIndex] }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">管径：</text>
            <input type="number" v-model="lineForm.diameter" placeholder="请输入管径(mm)" />
          </view>
          <view class="form-item">
            <text class="label">材质：</text>
            <picker @change="onLineMaterialChange" :value="lineMaterialIndex" :range="materialOptions">
              <view class="picker-display">{{ materialOptions[lineMaterialIndex] }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">长度：</text>
            <input type="number" v-model="lineForm.length" placeholder="自动计算" disabled />
          </view>
          <view class="form-item">
            <text class="label">备注：</text>
            <textarea v-model="lineForm.remark" placeholder="请输入备注信息"></textarea>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeLineModal">取消</button>
          <button class="confirm-btn" @click="saveLine">确定</button>
        </view>
      </view>
    </view>

    <!-- 测量结果显示 -->
    <view class="measure-result" v-if="measureResult.show">
      <view class="result-content">
        <text class="result-title">测量结果</text>
        <text class="result-value">{{ measureResult.text }}</text>
        <view class="result-actions">
          <button class="clear-btn" @click="clearMeasure">清除</button>
          <button class="close-btn" @click="closeMeasureResult">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// 响应式数据
const searchPointNo = ref('')
const currentTool = ref('')
const mapType = ref('vector') // vector 或 satellite
const mapScale = ref(16)
const currentLayerIndex = ref(0)
const materialIndex = ref(0)
const lineTypeIndex = ref(0)
const lineMaterialIndex = ref(0)

// 图层选项
const layerOptions = ref([
  '给水管网',
  '排水管网', 
  '燃气管网',
  '热力管网',
  '电力管网',
  '通信管网'
])

// 材质选项
const materialOptions = ref([
  'PE',
  'PVC',
  '铸铁',
  '钢管',
  '水泥管',
  '其他'
])

// 管线类型选项
const lineTypeOptions = ref([
  '主管',
  '支管',
  '接户管',
  '阀门',
  '其他'
])

// 地图中心点
const mapCenter = reactive({
  longitude: 116.397428,
  latitude: 39.90923
})

// 弹窗显示状态
const showPointModal = ref(false)
const showLineModal = ref(false)

// 管点表单数据
const pointForm = reactive({
  pointNo: '',
  diameter: '',
  material: '',
  depth: '',
  remark: '',
  longitude: 0,
  latitude: 0
})

// 管线表单数据
const lineForm = reactive({
  type: '',
  diameter: '',
  material: '',
  length: '',
  remark: '',
  startPoint: null,
  endPoint: null
})

// 测量结果
const measureResult = reactive({
  show: false,
  text: '',
  type: '' // distance 或 area
})

// 地图数据
const markers = ref([])
const polylines = ref([])
const polygons = ref([])

// 临时数据
const tempPoints = ref([]) // 用于连线时的临时点
const measurePoints = ref([]) // 测量时的点

// 方法实现
const onLayerChange = (e) => {
  currentLayerIndex.value = e.detail.value
  uni.showToast({
    title: `切换到${layerOptions.value[e.detail.value]}`,
    icon: 'none'
  })
}

const searchPoint = () => {
  if (!searchPointNo.value.trim()) {
    uni.showToast({
      title: '请输入探点号',
      icon: 'none'
    })
    return
  }
  
  // 搜索逻辑
  const foundMarker = markers.value.find(marker => 
    marker.title && marker.title.includes(searchPointNo.value)
  )
  
  if (foundMarker) {
    mapCenter.longitude = foundMarker.longitude
    mapCenter.latitude = foundMarker.latitude
    mapScale.value = 18
    uni.showToast({
      title: '已定位到目标点',
      icon: 'success'
    })
  } else {
    uni.showToast({
      title: '未找到该探点号',
      icon: 'none'
    })
  }
}

const toggleMapType = () => {
  mapType.value = mapType.value === 'vector' ? 'satellite' : 'vector'
  uni.showToast({
    title: `已切换到${mapType.value === 'satellite' ? '影像' : '矢量'}地图`,
    icon: 'none'
  })
}

const selectTool = (tool) => {
  currentTool.value = currentTool.value === tool ? '' : tool
  
  // 清除临时数据
  tempPoints.value = []
  measurePoints.value = []
  
  const toolNames = {
    point: '管点工具',
    line: '管线工具', 
    virtual: '虚拟线工具',
    shared: '共管工具',
    insert: '插入工具',
    collect: '收点工具',
    edit: '编辑工具',
    measure: '测量工具',
    flow: '流向工具',
    move: '移动工具',
    delete: '删除工具'
  }
  
  if (currentTool.value) {
    uni.showToast({
      title: `已选择${toolNames[tool]}`,
      icon: 'none'
    })
  }
}

const onMapTap = (e) => {
  const { longitude, latitude } = e.detail
  
  switch (currentTool.value) {
    case 'point':
      createPoint(longitude, latitude)
      break
    case 'line':
      handleLineCreation(longitude, latitude)
      break
    case 'virtual':
      createVirtualLine(longitude, latitude)
      break
    case 'measure':
      handleMeasure(longitude, latitude)
      break
    case 'insert':
      insertPoint(longitude, latitude)
      break
    default:
      break
  }
}

const createPoint = (longitude, latitude) => {
  pointForm.longitude = longitude
  pointForm.latitude = latitude
  pointForm.pointNo = `P${markers.value.length + 1}`
  showPointModal.value = true
}

const handleLineCreation = (longitude, latitude) => {
  tempPoints.value.push({ longitude, latitude })
  
  if (tempPoints.value.length === 1) {
    uni.showToast({
      title: '请点击第二个点完成管线绘制',
      icon: 'none'
    })
  } else if (tempPoints.value.length === 2) {
    lineForm.startPoint = tempPoints.value[0]
    lineForm.endPoint = tempPoints.value[1]
    
    // 计算长度
    const distance = calculateDistance(
      tempPoints.value[0].latitude,
      tempPoints.value[0].longitude,
      tempPoints.value[1].latitude,
      tempPoints.value[1].longitude
    )
    lineForm.length = distance.toFixed(2)
    
    showLineModal.value = true
    tempPoints.value = []
  }
}

const createVirtualLine = (longitude, latitude) => {
  // 创建虚拟线逻辑
  const virtualLine = {
    points: [
      { longitude, latitude },
      { longitude: longitude + 0.001, latitude: latitude + 0.001 }
    ],
    color: '#FF9800',
    width: 2,
    dottedLine: true
  }
  polylines.value.push(virtualLine)
  
  uni.showToast({
    title: '虚拟线创建成功',
    icon: 'success'
  })
}

const handleMeasure = (longitude, latitude) => {
  measurePoints.value.push({ longitude, latitude })
  
  if (measurePoints.value.length >= 2) {
    let totalDistance = 0
    for (let i = 1; i < measurePoints.value.length; i++) {
      const distance = calculateDistance(
        measurePoints.value[i-1].latitude,
        measurePoints.value[i-1].longitude,
        measurePoints.value[i].latitude,
        measurePoints.value[i].longitude
      )
      totalDistance += distance
    }
    
    measureResult.text = `总长度: ${totalDistance.toFixed(2)}米`
    measureResult.type = 'distance'
    measureResult.show = true
  }
}

const insertPoint = (longitude, latitude) => {
  // 在最近的管线上插入点
  uni.showToast({
    title: '插入点功能开发中',
    icon: 'none'
  })
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000 // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const getCurrentLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      mapCenter.longitude = res.longitude
      mapCenter.latitude = res.latitude
      mapScale.value = 18
      uni.showToast({
        title: '定位成功',
        icon: 'success'
      })
    },
    fail: () => {
      uni.showToast({
        title: '定位失败，请检查定位权限',
        icon: 'none'
      })
    }
  })
}

const onMarkerTap = (e) => {
  const markerId = e.detail.markerId
  const marker = markers.value.find(m => m.id === markerId)
  
  if (currentTool.value === 'edit' && marker) {
    // 编辑管点
    Object.assign(pointForm, marker.data || {})
    showPointModal.value = true
  } else if (currentTool.value === 'delete' && marker) {
    // 删除管点
    uni.showModal({
      title: '确认删除',
      content: '确定要删除这个管点吗？',
      success: (res) => {
        if (res.confirm) {
          const index = markers.value.findIndex(m => m.id === markerId)
          if (index > -1) {
            markers.value.splice(index, 1)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      }
    })
  }
}

const onRegionChange = (e) => {
  if (e.type === 'end') {
    mapCenter.longitude = e.detail.centerLocation.longitude
    mapCenter.latitude = e.detail.centerLocation.latitude
  }
}

// 弹窗相关方法
const closePointModal = () => {
  showPointModal.value = false
  Object.assign(pointForm, {
    pointNo: '',
    diameter: '',
    material: '',
    depth: '',
    remark: '',
    longitude: 0,
    latitude: 0
  })
}

const closeLineModal = () => {
  showLineModal.value = false
  Object.assign(lineForm, {
    type: '',
    diameter: '',
    material: '',
    length: '',
    remark: '',
    startPoint: null,
    endPoint: null
  })
}

const savePoint = () => {
  if (!pointForm.pointNo.trim()) {
    uni.showToast({
      title: '请输入点号',
      icon: 'none'
    })
    return
  }
  
  const newMarker = {
    id: Date.now(),
    longitude: pointForm.longitude,
    latitude: pointForm.latitude,
    title: pointForm.pointNo,
    iconPath: '/static/icons/point.png',
    width: 30,
    height: 30,
    data: { ...pointForm }
  }
  
  markers.value.push(newMarker)
  closePointModal()
  
  uni.showToast({
    title: '管点创建成功',
    icon: 'success'
  })
}

const saveLine = () => {
  if (!lineForm.type) {
    uni.showToast({
      title: '请选择管线类型',
      icon: 'none'
    })
    return
  }
  
  const newLine = {
    points: [lineForm.startPoint, lineForm.endPoint],
    color: getLineColor(lineForm.type),
    width: 4,
    data: { ...lineForm }
  }
  
  polylines.value.push(newLine)
  closeLineModal()
  
  uni.showToast({
    title: '管线创建成功',
    icon: 'success'
  })
}

const getLineColor = (type) => {
  const colors = {
    '主管': '#2196F3',
    '支管': '#4CAF50', 
    '接户管': '#FF9800',
    '阀门': '#F44336',
    '其他': '#9E9E9E'
  }
  return colors[type] || '#2196F3'
}

const onMaterialChange = (e) => {
  materialIndex.value = e.detail.value
  pointForm.material = materialOptions.value[e.detail.value]
}

const onLineTypeChange = (e) => {
  lineTypeIndex.value = e.detail.value
  lineForm.type = lineTypeOptions.value[e.detail.value]
}

const onLineMaterialChange = (e) => {
  lineMaterialIndex.value = e.detail.value
  lineForm.material = materialOptions.value[e.detail.value]
}

const clearMeasure = () => {
  measurePoints.value = []
  measureResult.show = false
}

const closeMeasureResult = () => {
  measureResult.show = false
}

// 生命周期
onMounted(() => {
  // 初始化数据
  console.log('采集页面初始化完成')
})
</script>

<style lang="scss" scoped>
.collect-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.top-toolbar {
  height: 50px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
  
  .layer-selector {
    margin-right: 15px;
    
    .picker-display {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: #f0f0f0;
      border-radius: 4px;
      font-size: 14px;
      
      .arrow {
        margin-left: 8px;
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .search-container {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    border-radius: 20px;
    padding: 0 15px;
    
    .search-input {
      flex: 1;
      height: 36px;
      font-size: 14px;
      background: transparent;
      border: none;
    }
    
    .search-btn {
      padding: 5px;
      font-size: 16px;
      color: #666;
    }
  }
}

.map-wrapper {
  flex: 1;
  position: relative;
  
  .amap {
    width: 100%;
    height: 100%;
  }
  
  .location-btn {
    position: absolute;
    left: 15px;
    bottom: 80px;
    width: 44px;
    height: 44px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    
    .location-icon {
      width: 24px;
      height: 24px;
    }
  }
  
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
}

// 弹窗样式
.point-modal, .line-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .modal-content {
    width: 90%;
    max-width: 400px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    
    .modal-header {
      padding: 15px 20px;
      background: #2196F3;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .modal-title {
        font-size: 16px;
        font-weight: bold;
      }
      
      .close-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
    }
    
    .modal-body {
      padding: 20px;
      
      .form-item {
        margin-bottom: 15px;
        
        .label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          color: #333;
          font-weight: bold;
        }
        
        input, textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          
          &:focus {
            border-color: #2196F3;
            outline: none;
          }
        }
        
        textarea {
          height: 60px;
          resize: vertical;
        }
        
        .picker-display {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 14px;
        }
      }
    }
    
    .modal-footer {
      padding: 15px 20px;
      background: #f8f8f8;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      
      button {
        padding: 8px 20px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        
        &.cancel-btn {
          background: #f5f5f5;
          color: #666;
        }
        
        &.confirm-btn {
          background: #2196F3;
          color: white;
        }
      }
    }
  }
}

.measure-result {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  
  .result-content {
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    text-align: center;
    
    .result-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
      display: block;
    }
    
    .result-value {
      font-size: 18px;
      font-weight: bold;
      color: #2196F3;
      margin-bottom: 15px;
      display: block;
    }
    
    .result-actions {
      display: flex;
      gap: 10px;
      
      button {
        flex: 1;
        padding: 6px 12px;
        border-radius: 4px;
        border: none;
        font-size: 12px;
        
        &.clear-btn {
          background: #f44336;
          color: white;
        }
        
        &.close-btn {
          background: #666;
          color: white;
        }
      }
    }
  }
}

/* 响应式适配 */
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