<template>
  <view class="container">
    <view class="header">
      <text class="title">数据库测试页面</text>
    </view>
    
    <view class="section">
      <text class="section-title">项目管理测试</text>
      <button @click="testCreateProject" class="btn">创建测试项目</button>
      <button @click="testGetProjects" class="btn">获取项目列表</button>
    </view>
    
    <view class="section">
      <text class="section-title">管点管理测试</text>
      <button @click="testCreatePoint" class="btn">创建测试管点</button>
      <button @click="testGetPoints" class="btn">获取管点列表</button>
    </view>
    
    <view class="section">
      <text class="section-title">管线管理测试</text>
      <button @click="testCreateLine" class="btn">创建测试管线</button>
      <button @click="testGetLines" class="btn">获取管线列表</button>
    </view>
    
    <view class="section">
      <text class="section-title">设置管理测试</text>
      <button @click="testGetCategories" class="btn">获取管类设置</button>
      <button @click="testGetAttributes" class="btn">获取属性设置</button>
    </view>
    
    <view class="result">
      <text class="result-title">测试结果：</text>
      <text class="result-text">{{ testResult }}</text>
    </view>
  </view>
</template>

<script>
import projectService from '@/services/projectService.js';
import pipePointService from '@/services/pipePointService.js';
import pipeLineService from '@/services/pipeLineService.js';
import settingsService from '@/services/settingsService.js';

export default {
  data() {
    return {
      testResult: '等待测试...',
      currentProjectId: null,
      testPointIds: []
    };
  },
  
  methods: {
    async testCreateProject() {
      try {
        const result = await projectService.createProject({
          project_name: '测试项目_' + Date.now(),
          work_group: 'TEST',
          offline_map_path: '',
          map_type: 'shp'
        });
        
        if (result.success) {
          this.currentProjectId = result.projectId;
          await projectService.setCurrentProject(result.projectId);
        }
        
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testGetProjects() {
      try {
        const result = await projectService.getAllProjects();
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testCreatePoint() {
      try {
        if (!this.currentProjectId) {
          this.testResult = '请先创建项目';
          return;
        }
        
        const pointNumber = await pipePointService.generateNextPointNumber(this.currentProjectId, 'TEST');
        
        const result = await pipePointService.createPipePoint({
          project_id: this.currentProjectId,
          point_number: pointNumber.pointNumber,
          longitude: 113.264385 + Math.random() * 0.01,
          latitude: 23.129163 + Math.random() * 0.01,
          elevation: 10.5,
          pipe_type: '给水管',
          material: 'PE',
          diameter: 200,
          depth: 1.5,
          description: '测试管点'
        });
        
        if (result.success) {
          this.testPointIds.push(result.pointId);
        }
        
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testGetPoints() {
      try {
        if (!this.currentProjectId) {
          this.testResult = '请先创建项目';
          return;
        }
        
        const result = await pipePointService.getProjectPipePoints(this.currentProjectId);
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testCreateLine() {
      try {
        if (!this.currentProjectId || this.testPointIds.length < 2) {
          this.testResult = '请先创建至少2个管点';
          return;
        }
        
        const result = await pipeLineService.createPipeLine({
          project_id: this.currentProjectId,
          line_number: 'L001',
          start_point_id: this.testPointIds[0],
          end_point_id: this.testPointIds[1],
          pipe_type: '给水管',
          material: 'PE',
          diameter: 200,
          length: 50.5,
          flow_direction: 'forward',
          description: '测试管线'
        });
        
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testGetLines() {
      try {
        if (!this.currentProjectId) {
          this.testResult = '请先创建项目';
          return;
        }
        
        const result = await pipeLineService.getProjectPipeLines(this.currentProjectId);
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testGetCategories() {
      try {
        const result = await settingsService.getPipeCategories();
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    },
    
    async testGetAttributes() {
      try {
        const result = await settingsService.getAttributeSettings();
        this.testResult = JSON.stringify(result, null, 2);
      } catch (error) {
        this.testResult = '错误: ' + error.message;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
  display: block;
}

.btn {
  margin: 5px;
  padding: 10px 15px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
}

.btn:active {
  background-color: #0056cc;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.result-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.result-text {
  font-size: 12px;
  color: #666;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>