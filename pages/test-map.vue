<template>
  <view class="test-container">
    <view class="header">
      <text class="title">地图测试页面</text>
      <button @click="testLocation" class="test-btn">测试定位</button>
    </view>
    
    <view class="map-container">
      <map 
        id="testMap"
        class="test-map"
        :longitude="longitude"
        :latitude="latitude"
        :scale="scale"
        show-location
        @error="onMapError"
        @regionchange="onRegionChange"
      >
      </map>
    </view>
    
    <view class="info-panel">
      <text class="info-title">地图信息：</text>
      <text class="info-text">经度: {{ longitude }}</text>
      <text class="info-text">纬度: {{ latitude }}</text>
      <text class="info-text">缩放级别: {{ scale }}</text>
      <text class="info-text">状态: {{ mapStatus }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const longitude = ref(116.397428)
const latitude = ref(39.90923)
const scale = ref(16)
const mapStatus = ref('初始化中...')

const onMapError = (e) => {
  console.error('地图错误:', e)
  mapStatus.value = '地图加载失败: ' + JSON.stringify(e.detail)
  uni.showToast({
    title: '地图加载失败',
    icon: 'none'
  })
}

const onRegionChange = (e) => {
  if (e.type === 'end') {
    longitude.value = e.detail.centerLocation.longitude
    latitude.value = e.detail.centerLocation.latitude
    mapStatus.value = '地图正常'
  }
}

const testLocation = () => {
  mapStatus.value = '正在获取位置...'
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      longitude.value = res.longitude
      latitude.value = res.latitude
      scale.value = 18
      mapStatus.value = '定位成功'
      uni.showToast({
        title: '定位成功',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('定位失败:', err)
      mapStatus.value = '定位失败: ' + err.errMsg
      uni.showToast({
        title: '定位失败: ' + err.errMsg,
        icon: 'none'
      })
    }
  })
}

onMounted(() => {
  mapStatus.value = '地图已加载'
  console.log('测试地图页面初始化完成')
})
</script>

<style lang="scss" scoped>
.test-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  padding: 20px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .test-btn {
    padding: 8px 16px;
    background: #007AFF;
    color: white;
    border-radius: 4px;
    font-size: 14px;
  }
}

.map-container {
  flex: 1;
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .test-map {
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
}

.info-panel {
  padding: 15px 20px;
  background: white;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  .info-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    display: block;
  }
  
  .info-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
    display: block;
  }
}
</style>