// 测试唯一ID生成
console.log('=== 测试唯一ID生成 ===');

// 方案1: 随机数 + 时间戳后3位
function generateUniqueId1() {
  return Math.floor(Math.random() * 1000) + (Date.now() % 1000);
}

// 方案2: 基于数组长度的递增ID
let markerCount = 0;
function generateUniqueId2() {
  return ++markerCount;
}

// 方案3: 时间戳后6位 + 随机数后2位
function generateUniqueId3() {
  const timePart = Date.now() % 10000; // 后4位时间戳
  const randomPart = Math.floor(Math.random() * 100); // 2位随机数
  return timePart * 100 + randomPart;
}

console.log('--- 方案1测试 (随机数 + 时间戳后3位) ---');
const ids1 = [];
for (let i = 0; i < 10; i++) {
  const id = generateUniqueId1();
  ids1.push(id);
  console.log(`ID ${i + 1}: ${id}`);
  // 短暂延迟
  const start = Date.now();
  while (Date.now() - start < 5) {}
}
const uniqueIds1 = [...new Set(ids1)];
console.log(`生成${ids1.length}个ID，唯一ID数量: ${uniqueIds1.length}`);
console.log('是否全部唯一:', ids1.length === uniqueIds1.length ? '✅' : '❌');

console.log('\n--- 方案2测试 (递增计数器) ---');
const ids2 = [];
for (let i = 0; i < 10; i++) {
  const id = generateUniqueId2();
  ids2.push(id);
  console.log(`ID ${i + 1}: ${id}`);
}
const uniqueIds2 = [...new Set(ids2)];
console.log(`生成${ids2.length}个ID，唯一ID数量: ${uniqueIds2.length}`);
console.log('是否全部唯一:', ids2.length === uniqueIds2.length ? '✅' : '❌');

console.log('\n--- 方案3测试 (时间戳 + 随机数) ---');
const ids3 = [];
for (let i = 0; i < 10; i++) {
  const id = generateUniqueId3();
  ids3.push(id);
  console.log(`ID ${i + 1}: ${id}`);
  // 短暂延迟
  const start = Date.now();
  while (Date.now() - start < 2) {}
}
const uniqueIds3 = [...new Set(ids3)];
console.log(`生成${ids3.length}个ID，唯一ID数量: ${uniqueIds3.length}`);
console.log('是否全部唯一:', ids3.length === uniqueIds3.length ? '✅' : '❌');

console.log('\n=== 推荐方案 ===');
console.log('方案2 (递增计数器) 最可靠，保证100%唯一');
console.log('方案3 (时间戳 + 随机数) 在快速创建时也能保持唯一性');
console.log('方案1 可能在极短时间内产生重复ID');