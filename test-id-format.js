// 测试ID格式匹配
console.log('=== 测试ID格式匹配 ===');

// 模拟pipe-info.nvue中生成的ID
const generatedId = String(Date.now());
console.log('生成的ID:', generatedId, '(类型:', typeof generatedId, ')');

// 模拟地图事件中的markerId
const eventMarkerId = generatedId; // 通常地图事件会保持原格式

// 模拟markers数组
const markers = [
  { id: generatedId, title: '16YS1' },
  { id: String(Date.now() + 1000), title: '16YS2' }
];

console.log('markers数组:');
markers.forEach((m, index) => {
  console.log(`  ${index}: id="${m.id}" (类型:${typeof m.id}), title="${m.title}"`);
});

// 测试查找逻辑
console.log('\n--- 测试查找逻辑 ---');
console.log('要查找的markerId:', eventMarkerId, '(类型:', typeof eventMarkerId, ')');

// 精确匹配
let marker = markers.find(m => m.id === eventMarkerId);
console.log('精确匹配结果:', marker ? '找到' : '未找到');

// 字符串匹配
if (!marker) {
  marker = markers.find(m => m.id === String(eventMarkerId));
  console.log('字符串匹配结果:', marker ? '找到' : '未找到');
}

// 数字匹配
if (!marker) {
  marker = markers.find(m => m.id === Number(eventMarkerId));
  console.log('数字匹配结果:', marker ? '找到' : '未找到');
}

console.log('最终结果:', marker ? `找到管点: ${marker.title}` : '未找到管点');

// 测试不同ID格式的情况
console.log('\n--- 测试混合ID格式 ---');
const mixedMarkers = [
  { id: '123456789', title: '字符串ID' },
  { id: 987654321, title: '数字ID' },
  { id: String(Date.now()), title: '时间戳字符串ID' }
];

const testIds = ['123456789', 987654321, String(Date.now())];

testIds.forEach(testId => {
  console.log(`\n测试ID: ${testId} (类型: ${typeof testId})`);
  
  let found = mixedMarkers.find(m => m.id === testId);
  if (!found) found = mixedMarkers.find(m => m.id === String(testId));
  if (!found) found = mixedMarkers.find(m => m.id === Number(testId));
  
  console.log('结果:', found ? `找到: ${found.title}` : '未找到');
});