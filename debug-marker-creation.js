// 调试管点创建过程
console.log('=== 调试管点创建过程 ===');

// 模拟管点创建
function createTestMarker() {
  const markerId = String(Date.now());
  console.log('生成的markerId:', markerId, '(类型:', typeof markerId, ')');
  
  const markerData = {
    id: markerId,
    markerId: markerId,
    longitude: 116.397,
    latitude: 39.909,
    title: 'TEST001',
    iconPath: '/static/icons/pipe-point-backup.svg',
    width: 32,
    height: 32,
    callout: {
      content: 'TEST001',
      color: '#000000',
      fontSize: 12,
      borderRadius: 4,
      bgColor: '#FFFFFF',
      padding: 4,
      display: 'ALWAYS'
    }
  };
  
  console.log('创建的marker数据:');
  console.log('- id:', markerData.id, '(类型:', typeof markerData.id, ')');
  console.log('- markerId:', markerData.markerId, '(类型:', typeof markerData.markerId, ')');
  console.log('- title:', markerData.title);
  
  return markerData;
}

// 模拟地图事件处理
function simulateMarkerTap(markers, eventMarkerId) {
  console.log('\n--- 模拟地图点击事件 ---');
  console.log('事件markerId:', eventMarkerId, '(类型:', typeof eventMarkerId, ')');
  console.log('markers数组长度:', markers.length);
  
  // 详细的查找过程
  console.log('\n查找过程:');
  
  // 1. ID精确匹配
  let marker = markers.find(m => m.id === eventMarkerId);
  console.log('1. ID精确匹配:', marker ? '✅ 找到' : '❌ 未找到');
  
  // 2. markerId精确匹配
  if (!marker) {
    marker = markers.find(m => m.markerId === eventMarkerId);
    console.log('2. markerId精确匹配:', marker ? '✅ 找到' : '❌ 未找到');
  }
  
  // 3. 字符串转换匹配
  if (!marker) {
    marker = markers.find(m => m.id === String(eventMarkerId) || m.markerId === String(eventMarkerId));
    console.log('3. 字符串转换匹配:', marker ? '✅ 找到' : '❌ 未找到');
  }
  
  // 4. 数字转换匹配
  if (!marker) {
    marker = markers.find(m => m.id === Number(eventMarkerId) || m.markerId === Number(eventMarkerId));
    console.log('4. 数字转换匹配:', marker ? '✅ 找到' : '❌ 未找到');
  }
  
  return marker;
}

// 执行测试
const testMarker = createTestMarker();
const markers = [testMarker];

// 测试正常情况（使用相同的ID）
console.log('\n=== 测试正常情况 ===');
const normalResult = simulateMarkerTap(markers, testMarker.id);
console.log('结果:', normalResult ? `找到: ${normalResult.title}` : '未找到');

// 测试问题情况（使用2147483647）
console.log('\n=== 测试问题情况 ===');
const problemResult = simulateMarkerTap(markers, 2147483647);
console.log('结果:', problemResult ? `找到: ${problemResult.title}` : '未找到');

console.log('\n=== 建议 ===');
console.log('1. 确保地图组件正确使用我们设置的ID');
console.log('2. 检查地图组件的文档，确认ID字段名称');
console.log('3. 可能需要在地图组件上显式设置marker-id属性');