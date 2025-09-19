<template>
  <view class="container">
    <view class="header">
      <text class="title">选择项目</text>
      <button @click="showCreateDialog" class="create-btn">新建项目</button>
    </view>
    
    <view class="project-list">
      <view 
        v-for="project in projects" 
        :key="project.id"
        @click="selectProject(project)"
        class="project-item"
        :class="{ active: currentProjectId === project.id }"
      >
        <view class="project-info">
          <text class="project-name">{{ project.project_name }}</text>
          <text class="project-group">作业小组: {{ project.work_group || '未设置' }}</text>
          <text class="project-time">创建时间: {{ formatTime(project.created_time) }}</text>
        </view>
        <view class="project-actions">
          <button @click.stop="editProject(project)" class="edit-btn">编辑</button>
          <button @click.stop="deleteProject(project)" class="delete-btn">删除</button>
        </view>
      </view>
    </view>
    
    <!-- 创建项目对话框 -->
    <view v-if="showDialog" class="dialog-overlay" @click="cancelCreate">
      <view class="dialog" @click.stop>
        <view class="dialog-title">新建项目</view>
        <view class="form-item">
          <text class="label">项目名称</text>
          <input v-model="newProject.project_name" placeholder="请输入项目名称" class="input" />
        </view>
        <view class="form-item">
          <text class="label">作业小组</text>
          <input v-model="newProject.work_group" placeholder="请输入作业小组" class="input" />
        </view>
        <view class="form-item">
          <text class="label">底图类型</text>
          <picker @change="onMapTypeChange" :value="mapTypeIndex" :range="mapTypes">
            <view class="picker">{{ mapTypes[mapTypeIndex] }}</view>
          </picker>
        </view>
        <view class="dialog-actions">
          <button @click="cancelCreate" class="cancel-btn">取消</button>
          <button @click="createProject" class="confirm-btn">创建</button>
        </view>
      </view>
    </view>
    
    <!-- 加载提示 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
import projectService from '@/services/projectService.js';

export default {
  data() {
    return {
      projects: [],
      currentProjectId: null,
      loading: false,
      showDialog: false,
      newProject: {
        project_name: '',
        work_group: '',
        map_type: 'shp'
      },
      mapTypes: ['矢量地图(shp)', '影像地图(tif)'],
      mapTypeIndex: 0
    };
  },
  
  async onLoad() {
    await this.loadProjects();
    this.loadCurrentProject();
  },
  
  methods: {
    async loadProjects() {
      this.loading = true;
      try {
        const result = await projectService.getAllProjects();
        if (result.success) {
          this.projects = result.data;
        } else {
          uni.showToast({
            title: result.message,
            icon: 'error'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '加载项目失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    
    loadCurrentProject() {
      this.currentProjectId = uni.getStorageSync('currentProjectId');
    },
    
    async selectProject(project) {
      try {
        const result = await projectService.setCurrentProject(project.id);
        if (result.success) {
          this.currentProjectId = project.id;
          uni.showToast({
            title: '项目切换成功',
            icon: 'success'
          });
          
          // 跳转到主页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/collect/collect'
            });
          }, 1000);
        }
      } catch (error) {
        uni.showToast({
          title: '项目切换失败',
          icon: 'error'
        });
      }
    },
    
    showCreateDialog() {
      this.showDialog = true;
    },
    
    async createProject() {
      if (!this.newProject.project_name.trim()) {
        uni.showToast({
          title: '请输入项目名称',
          icon: 'error'
        });
        return;
      }
      
      try {
        const mapType = this.mapTypeIndex === 0 ? 'shp' : 'tif';
        const result = await projectService.createProject({
          ...this.newProject,
          map_type: mapType
        });
        
        if (result.success) {
          uni.showToast({
            title: '项目创建成功',
            icon: 'success'
          });
          
          this.cancelCreate();
          await this.loadProjects();
          
          // 自动选择新创建的项目
          await projectService.setCurrentProject(result.projectId);
          this.currentProjectId = result.projectId;
        } else {
          uni.showToast({
            title: result.message,
            icon: 'error'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '创建项目失败',
          icon: 'error'
        });
      }
    },
    
    cancelCreate() {
      this.showDialog = false;
      this.newProject = {
        project_name: '',
        work_group: '',
        map_type: 'shp'
      };
      this.mapTypeIndex = 0;
    },
    
    editProject(project) {
      // TODO: 实现项目编辑功能
      uni.showToast({
        title: '编辑功能待实现',
        icon: 'none'
      });
    },
    
    async deleteProject(project) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除项目"${project.project_name}"吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await projectService.deleteProject(project.id);
              if (result.success) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                await this.loadProjects();
                
                // 如果删除的是当前项目，清除当前项目ID
                if (this.currentProjectId === project.id) {
                  this.currentProjectId = null;
                  uni.removeStorageSync('currentProjectId');
                }
              } else {
                uni.showToast({
                  title: result.message,
                  icon: 'error'
                });
              }
            } catch (error) {
              uni.showToast({
                title: '删除失败',
                icon: 'error'
              });
            }
          }
        }
      });
    },
    
    onMapTypeChange(e) {
      this.mapTypeIndex = e.detail.value;
    },
    
    formatTime(timeString) {
      if (!timeString) return '';
      const date = new Date(timeString);
      return date.toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.create-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
}

.project-list {
  background-color: white;
  border-radius: 8px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.project-item:last-child {
  border-bottom: none;
}

.project-item.active {
  background-color: #e3f2fd;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.project-group,
.project-time {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 3px;
}

.project-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
}

.edit-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.dialog {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  max-width: 90%;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 15px;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.input,
.picker {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.picker {
  background-color: #f9f9f9;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.confirm-btn {
  background-color: #007aff;
  color: white;
}

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 5px;
}
</style>