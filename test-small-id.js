// 测试小ID是否能解决问题
console.log('=== 测试小ID方案 ===');

// 测试时间戳ID的问题
const timestampId = Date.now();
console.log('时间戳ID:', timestampId);
console.log('时间戳ID长度:', timestampId.toString().length, '位');
console.log('是否超过32位整数最大值:', timestampId > Math.pow(2, 31) - 1);
console.log('32位整数最大值:', Math.pow(2, 31) - 1);

// 测试小ID方案
console.log('\n--- 小ID方案 ---');

// 方案1: 随机数ID (1-999999)
const randomId = Math.floor(Math.random() * 999999) + 1;
console.log('随机ID:', randomId);
console.log('随机ID长度:', randomId.toString().length, '位');
console.log('是否在安全范围:', randomId <= 999999);

// 方案2: 递增ID
let counter = 1;
const incrementalIds = [];
for (let i = 0; i < 5; i++) {
  incrementalIds.push(counter++);
}
console.log('递增ID序列:', incrementalIds);

// 模拟地图标记数据
const markers = [
  { id: 1, markerId: 1, title: '管点1' },
  { id: 2, markerId: 2, title: '管点2' },
  { id: 3, markerId: 3, title: '管点3' }
];

console.log('\n--- 测试查找 ---');
// 测试查找小ID
function testFind(markerId) {
  const marker = markers.find(m => m.id === markerId || m.markerId === markerId);
  console.log(`查找ID ${markerId}:`, marker ? `找到 ${marker.title}` : '未找到');
  return marker;
}

testFind(1);
testFind(2);
testFind(3);
testFind(999); // 不存在的ID

console.log('\n--- 建议 ---');
console.log('1. 使用1-999999范围的ID，避免大数字溢出');
console.log('2. 或者使用简单的递增计数器');
console.log('3. 确保ID在32位整数范围内');
console.log('4. 避免使用时间戳作为地图标记ID');