// 完整的管线功能测试
console.log('=== 完整管线功能测试 ===');

// 模拟完整的状态
let currentTool = { value: '' };
let pipelineMode = { value: false };
let selectedPoints = { value: [] };
let showPipelineForm = { value: false };

const markers = {
  value: [
    { id: 'point1', title: '16YS1', latitude: 39.909, longitude: 116.397 },
    { id: 'point2', title: '16YS2', latitude: 39.910, longitude: 116.398 }
  ]
};

// 模拟selectTool函数
function selectTool(tool) {
  console.log(`\n=== 选择工具: ${tool} ===`);
  
  if (currentTool.value === tool) {
    currentTool.value = '';
    pipelineMode.value = false;
    selectedPoints.value = [];
    console.log('取消工具选择');
  } else {
    currentTool.value = tool;
    
    if (tool === 'line') {
      pipelineMode.value = true;
      selectedPoints.value = [];
      console.log('✅ 管线模式已启动，请依次点击两个已有的管点');
    } else {
      pipelineMode.value = false;
    }
  }
}

// 模拟onMapTap函数
function onMapTap() {
  console.log('\n--- 点击地图空白区域 ---');
  
  if (!currentTool.value) {
    console.log('❌ 请先选择创建工具');
    return;
  }

  if (currentTool.value === 'line') {
    console.log('❌ 请点击已有的管点，不要点击空白区域');
    return;
  }
  
  console.log('处理其他工具的地图点击');
}

// 模拟onMarkerTap函数
function onMarkerTap(markerId) {
  console.log(`\n--- 点击管点: ${markerId} ---`);
  
  console.log('当前工具:', currentTool.value);
  console.log('管线模式:', pipelineMode.value);
  
  // 查找marker
  let marker = markers.value.find(m => m.id === markerId);
  
  if (!marker) {
    marker = markers.value.find(m => m.id === String(markerId));
  }
  
  if (!marker) {
    console.log('❌ 未找到管点信息');
    return;
  }

  // 如果当前工具是"管线"
  if (currentTool.value === 'line') {
    console.log('✅ 管线模式下点击管点:', marker.title);
    
    // 检查是否已经选择过这个点
    if (selectedPoints.value.find(p => p.id === marker.id)) {
      console.log('❌ 该管点已被选择');
      return;
    }

    selectedPoints.value.push(marker);
    console.log('✅ 已选择的点数量:', selectedPoints.value.length);

    if (selectedPoints.value.length === 1) {
      console.log(`✅ 已选择起点：${marker.title}，请选择终点`);
    } else if (selectedPoints.value.length === 2) {
      console.log('✅ 两个点都选择完成，显示管线信息表单');
      showPipelineForm.value = true;
    }
    return;
  }
  
  console.log('处理其他工具的管点点击');
}

// 执行完整测试流程
console.log('初始状态:');
console.log('- 当前工具:', currentTool.value || '无');
console.log('- 管线模式:', pipelineMode.value);

// 1. 选择管线工具
selectTool('line');

// 2. 点击空白区域（应该提示错误）
onMapTap();

// 3. 点击第一个管点
onMarkerTap('point1');

// 4. 点击第二个管点
onMarkerTap('point2');

// 5. 尝试重复点击已选择的管点
onMarkerTap('point1');

console.log('\n=== 最终状态 ===');
console.log('当前工具:', currentTool.value);
console.log('管线模式:', pipelineMode.value);
console.log('选中的点:', selectedPoints.value.map(p => p.title));
console.log('显示管线表单:', showPipelineForm.value);