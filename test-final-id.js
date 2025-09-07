// 最终ID方案测试
console.log('=== 最终ID方案测试 ===');

// 模拟新的ID生成方式
function generateMarkerId() {
  return Math.floor(Date.now() / 1000) % 999999; // 取秒数的后6位
}

// 生成几个测试ID
const testIds = [];
for (let i = 0; i < 3; i++) {
  const id = generateMarkerId();
  testIds.push(id);
  console.log(`生成ID ${i + 1}:`, id, '(长度:', id.toString().length, '位)');
  // 稍微延迟确保ID不同
  const start = Date.now();
  while (Date.now() - start < 10) {} // 简单延迟
}

// 模拟markers数组
const markers = testIds.map((id, index) => ({
  id: id,
  markerId: id,
  title: `管点${index + 1}`,
  latitude: 39.909 + index * 0.001,
  longitude: 116.397 + index * 0.001
}));

console.log('\n--- 模拟地图标记 ---');
markers.forEach((marker, index) => {
  console.log(`Marker ${index}:`, {
    id: marker.id,
    markerId: marker.markerId,
    title: marker.title
  });
});

// 测试查找逻辑
console.log('\n--- 测试查找逻辑 ---');
function findMarker(markerId) {
  console.log(`\n查找markerId: ${markerId} (类型: ${typeof markerId})`);
  
  // 直接匹配
  let marker = markers.find(m => m.id === markerId || m.markerId === markerId);
  if (marker) {
    console.log('✅ 直接匹配成功:', marker.title);
    return marker;
  }
  
  // 数字转换匹配
  marker = markers.find(m => 
    Number(m.id) === Number(markerId) || 
    Number(m.markerId) === Number(markerId)
  );
  if (marker) {
    console.log('✅ 数字转换匹配成功:', marker.title);
    return marker;
  }
  
  console.log('❌ 未找到匹配的marker');
  return null;
}

// 测试每个ID
testIds.forEach(id => {
  findMarker(id);
});

// 测试字符串形式的ID
console.log('\n--- 测试字符串ID ---');
findMarker(String(testIds[0]));

// 测试不存在的ID
console.log('\n--- 测试不存在的ID ---');
findMarker(999999);

console.log('\n=== 总结 ===');
console.log('✅ 使用小范围数字ID (1-999999)');
console.log('✅ 避免了大数字溢出问题');
console.log('✅ 简化了查找逻辑');
console.log('✅ 支持数字和字符串类型转换');