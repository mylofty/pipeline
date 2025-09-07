// 测试管线功能的逻辑
console.log('测试管线功能');

// 模拟数据
const currentTool = { value: 'line' };
const pipelineMode = { value: true };
const selectedPoints = { value: [] };
const markers = { 
  value: [
    { id: 'point1', title: '16YS1', latitude: 39.909, longitude: 116.397 },
    { id: 'point2', title: '16YS2', latitude: 39.910, longitude: 116.398 }
  ]
};

// 模拟事件
const mockEvent = {
  detail: {
    markerId: 'point1'
  }
};

// 模拟onMarkerTap逻辑
function testOnMarkerTap(e) {
  console.log('onMarkerTap测试', e);

  if (!e.detail || !e.detail.markerId) {
    return
  }

  const markerId = e.detail.markerId
  const marker = markers.value.find(m => m.id === markerId)

  // 如果当前工具是"管线"，处理管线模式下的管点选择
  if (currentTool.value === 'line' && pipelineMode.value) {
    if (!marker) {
      console.log('请点击已有的管点');
      return
    }

    // 检查是否已经选择过这个点
    if (selectedPoints.value.find(p => p.id === marker.id)) {
      console.log('该管点已被选择');
      return
    }

    selectedPoints.value.push(marker)

    if (selectedPoints.value.length === 1) {
      console.log(`已选择起点：${marker.title || marker.id}，请选择终点`);
    } else if (selectedPoints.value.length === 2) {
      console.log('两个点都选择完成，显示管线信息表单');
    }
    return; // 阻止后续的标记点处理逻辑
  }
}

// 执行测试
testOnMarkerTap(mockEvent);
console.log('选中的点:', selectedPoints.value);