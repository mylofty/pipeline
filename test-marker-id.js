// 测试地图标记ID的问题
console.log('=== 测试地图标记ID问题 ===');

// 模拟当前的情况
const eventMarkerId = 2147483647; // 从地图事件中获取的ID
console.log('地图事件markerId:', eventMarkerId, '(类型:', typeof eventMarkerId, ')');
console.log('是否为最大32位整数:', eventMarkerId === Math.pow(2, 31) - 1);

// 模拟markers数组
const markers = [
  { 
    id: "1757233272546", 
    markerId: "1757233272546",
    title: "1YS749" 
  },
  { 
    id: "1757233279571", 
    markerId: "1757233279571",
    title: "1YS698" 
  },
  { 
    id: "1757233337056", 
    markerId: "1757233337056",
    title: "1YS743" 
  }
];

console.log('\nmarkers数组:');
markers.forEach((m, index) => {
  console.log(`  ${index}: id="${m.id}" markerId="${m.markerId}" title="${m.title}"`);
});

// 测试各种查找方式
console.log('\n--- 测试查找逻辑 ---');

function findMarker(markerId) {
  console.log(`查找markerId: ${markerId} (类型: ${typeof markerId})`);
  
  // ID精确匹配
  let marker = markers.find(m => m.id === markerId);
  if (marker) return { method: 'ID精确匹配', marker };
  
  // markerId精确匹配
  marker = markers.find(m => m.markerId === markerId);
  if (marker) return { method: 'markerId精确匹配', marker };
  
  // ID字符串匹配
  marker = markers.find(m => m.id === String(markerId));
  if (marker) return { method: 'ID字符串匹配', marker };
  
  // markerId字符串匹配
  marker = markers.find(m => m.markerId === String(markerId));
  if (marker) return { method: 'markerId字符串匹配', marker };
  
  // 数字匹配
  marker = markers.find(m => m.id === Number(markerId) || m.markerId === Number(markerId));
  if (marker) return { method: '数字匹配', marker };
  
  // 索引匹配
  if (typeof markerId === 'number' && markerId < markers.length) {
    marker = markers[markerId];
    if (marker) return { method: '索引匹配', marker };
  }
  
  return { method: '未找到', marker: null };
}

// 测试问题中的markerId
const result = findMarker(eventMarkerId);
console.log('查找结果:', result.method);
if (result.marker) {
  console.log('找到的marker:', result.marker.title);
} else {
  console.log('❌ 未找到任何匹配的marker');
}

// 测试索引匹配（可能地图组件使用数组索引）
console.log('\n--- 测试索引匹配可能性 ---');
if (eventMarkerId === 2147483647) {
  console.log('这个数字可能表示无效的索引或默认值');
  console.log('建议检查地图组件的标记ID设置');
}

// 测试正常的索引
for (let i = 0; i < markers.length; i++) {
  const indexResult = findMarker(i);
  console.log(`索引 ${i}:`, indexResult.method, indexResult.marker ? indexResult.marker.title : '无');
}