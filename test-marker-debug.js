// 测试管点点击的调试信息
console.log('=== 测试管点点击调试 ===');

// 模拟markers数据
const markers = {
  value: [
    { id: 'marker_1', title: '16YS1', latitude: 39.909, longitude: 116.397 },
    { id: 'marker_2', title: '16YS2', latitude: 39.910, longitude: 116.398 }
  ]
};

// 模拟onMarkerTap事件
const mockEvent1 = {
  detail: {
    markerId: 'marker_1'
  }
};

const mockEvent2 = {
  detail: {
    markerId: 'nonexistent_marker'
  }
};

// 测试函数
function testMarkerTap(e, testName) {
  console.log(`\n--- ${testName} ---`);
  console.log('事件:', e);
  
  if (!e.detail || !e.detail.markerId) {
    console.log('❌ 事件详情或markerId为空');
    return
  }

  const markerId = e.detail.markerId
  console.log('点击的markerId:', markerId);
  console.log('当前所有markers:', markers.value.map(m => ({ id: m.id, title: m.title })));
  
  const marker = markers.value.find(m => m.id === markerId)
  console.log('找到的marker:', marker);

  if (!marker) {
    console.log('❌ 未找到对应的marker');
    return
  }
  
  console.log('✅ 成功找到管点:', marker.title);
}

// 执行测试
testMarkerTap(mockEvent1, '测试存在的管点');
testMarkerTap(mockEvent2, '测试不存在的管点');