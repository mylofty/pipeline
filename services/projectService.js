/**
 * 项目管理服务
 */
import database from '@/utils/database.js';

class ProjectService {
  
  /**
   * 创建新项目
   */
  async createProject(projectData) {
    try {
      const { project_name, work_group, offline_map_path, map_type } = projectData;
      
      const result = await database.executeSql(
        `INSERT INTO projects (project_name, work_group, offline_map_path, map_type) 
         VALUES (?, ?, ?, ?)`,
        [project_name, work_group || '', offline_map_path || '', map_type || 'shp']
      );
      
      return {
        success: true,
        projectId: result.insertId,
        message: '项目创建成功'
      };
    } catch (error) {
      console.error('创建项目失败:', error);
      return {
        success: false,
        message: '项目创建失败: ' + error.message
      };
    }
  }

  /**
   * 获取所有项目
   */
  async getAllProjects() {
    try {
      const projects = await database.executeSql(
        'SELECT * FROM projects WHERE is_active = 1 ORDER BY created_time DESC'
      );
      
      return {
        success: true,
        data: projects
      };
    } catch (error) {
      console.error('获取项目列表失败:', error);
      return {
        success: false,
        message: '获取项目列表失败: ' + error.message
      };
    }
  }

  /**
   * 获取当前活跃项目
   */
  async getCurrentProject() {
    try {
      // 从本地存储获取当前项目ID
      const currentProjectId = uni.getStorageSync('currentProjectId');
      if (!currentProjectId) {
        return { success: false, message: '未选择项目' };
      }

      const projects = await database.executeSql(
        'SELECT * FROM projects WHERE id = ? AND is_active = 1',
        [currentProjectId]
      );

      if (projects.length > 0) {
        return {
          success: true,
          data: projects[0]
        };
      } else {
        return {
          success: false,
          message: '项目不存在或已删除'
        };
      }
    } catch (error) {
      console.error('获取当前项目失败:', error);
      return {
        success: false,
        message: '获取当前项目失败: ' + error.message
      };
    }
  }

  /**
   * 设置当前项目
   */
  async setCurrentProject(projectId) {
    try {
      uni.setStorageSync('currentProjectId', projectId);
      return {
        success: true,
        message: '项目切换成功'
      };
    } catch (error) {
      console.error('设置当前项目失败:', error);
      return {
        success: false,
        message: '项目切换失败: ' + error.message
      };
    }
  }

  /**
   * 更新项目信息
   */
  async updateProject(projectId, updateData) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      if (fields.length === 0) {
        return { success: false, message: '没有要更新的数据' };
      }
      
      fields.push('updated_time = ?');
      values.push(new Date().toISOString());
      values.push(projectId);
      
      await database.executeSql(
        `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return {
        success: true,
        message: '项目更新成功'
      };
    } catch (error) {
      console.error('更新项目失败:', error);
      return {
        success: false,
        message: '项目更新失败: ' + error.message
      };
    }
  }

  /**
   * 删除项目（软删除）
   */
  async deleteProject(projectId) {
    try {
      await database.executeSql(
        'UPDATE projects SET is_active = 0, updated_time = ? WHERE id = ?',
        [new Date().toISOString(), projectId]
      );
      
      return {
        success: true,
        message: '项目删除成功'
      };
    } catch (error) {
      console.error('删除项目失败:', error);
      return {
        success: false,
        message: '项目删除失败: ' + error.message
      };
    }
  }

  /**
   * 获取项目统计信息
   */
  async getProjectStatistics(projectId) {
    try {
      // 获取管点总数
      const pointCount = await database.executeSql(
        'SELECT COUNT(*) as count FROM pipe_points WHERE project_id = ? AND status = "active"',
        [projectId]
      );

      // 获取管线总数和总长度
      const lineStats = await database.executeSql(
        'SELECT COUNT(*) as count, COALESCE(SUM(length), 0) as total_length FROM pipe_lines WHERE project_id = ? AND status = "active"',
        [projectId]
      );

      // 获取已收点数量
      const collectedCount = await database.executeSql(
        'SELECT COUNT(*) as count FROM pipe_points WHERE project_id = ? AND is_collected = 1',
        [projectId]
      );

      return {
        success: true,
        data: {
          pointCount: pointCount[0].count,
          lineCount: lineStats[0].count,
          totalLength: lineStats[0].total_length,
          collectedCount: collectedCount[0].count
        }
      };
    } catch (error) {
      console.error('获取项目统计失败:', error);
      return {
        success: false,
        message: '获取项目统计失败: ' + error.message
      };
    }
  }
}

export default new ProjectService();