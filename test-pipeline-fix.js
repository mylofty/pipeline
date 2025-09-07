// 测试修复后的管线功能逻辑
console.log('=== 测试修复后的管线功能 ===');

// 模拟状态
let currentTool = { value: 'line' };
let pipelineMode = { value: true };
let selectedPoints = { value: [] };
let showPipelineForm = { value: false };

const markers = { 
  value: [
    { id: 'point1', title: '16YS1', latitude: 39.909, longitude: 116.397 },
    { id: 'point2', title: '16YS2', latitude: 39.910, longitude: 116.398 }
  ]
};

// 模拟工具函数
function highlightMarker(id, highlight) {
  console.log(`${highlight ? '高亮' : '取消高亮'}管点: ${id}`);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  return 16.5; // 模拟距离
}

// 模拟onMarkerTap逻辑（修复后）
function testOnMarkerTap(markerId) {
  console.log(`\n--- 测试点击管点: ${markerId} ---`);
  
  const marker = markers.value.find(m => m.id === markerId);
  
  // 如果当前工具是"管线"，处理管线模式下的管点选择
  if (currentTool.value === 'line') {
    console.log('管线模式下点击管点:', marker?.title, 'pipelineMode:', pipelineMode.value);
    
    if (!marker) {
      console.log('❌ 未找到管点信息');
      return
    }

    // 检查是否已经选择过这个点
    if (selectedPoints.value.find(p => p.id === marker.id)) {
      console.log('❌ 该管点已被选择');
      return
    }

    selectedPoints.value.push(marker)
    console.log('✅ 已选择的点数量:', selectedPoints.value.length);

    if (selectedPoints.value.length === 1) {
      highlightMarker(marker.id, true)
      console.log(`✅ 已选择起点：${marker.title}，请选择终点`);
    } else if (selectedPoints.value.length === 2) {
      highlightMarker(marker.id, true)
      
      const distance = calculateDistance(
        selectedPoints.value[0].latitude,
        selectedPoints.value[0].longitude,
        selectedPoints.value[1].latitude,
        selectedPoints.value[1].longitude
      )

      console.log('✅ 两个点都选择完成，计算距离:', distance);
      console.log('✅ 准备显示管线表单');
      showPipelineForm.value = true;
    }
    return;
  }
}

// 模拟地图空白区域点击
function testMapTap() {
  console.log('\n--- 测试点击地图空白区域 ---');
  if (currentTool.value === 'line') {
    console.log('❌ 请点击已有的管点，不要点击空白区域');
  }
}

// 执行测试
console.log('当前工具:', currentTool.value);
console.log('管线模式:', pipelineMode.value);

// 测试1: 点击第一个管点
testOnMarkerTap('point1');

// 测试2: 点击第二个管点
testOnMarkerTap('point2');

// 测试3: 点击空白区域
testMapTap();

console.log('\n=== 最终状态 ===');
console.log('选中的点:', selectedPoints.value.map(p => p.title));
console.log('显示管线表单:', showPipelineForm.value);