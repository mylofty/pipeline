/**
 * 管点管理服务
 */
import database from '@/utils/database.js';

class PipePointService {

  /**
   * 创建管点
   */
  async createPipePoint(pointData) {
    try {
      const {
        project_id,
        point_number,
        longitude,
        latitude,
        elevation,
        pipe_type,
        material,
        diameter,
        depth,
        description,
        photo_paths
      } = pointData;

      const result = await database.executeSql(
        `INSERT INTO pipe_points 
         (project_id, point_number, longitude, latitude, elevation, pipe_type, material, diameter, depth, description, photo_paths)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project_id,
          point_number,
          longitude || null,
          latitude || null,
          elevation || null,
          pipe_type || '',
          material || '',
          diameter || null,
          depth || null,
          description || '',
          JSON.stringify(photo_paths || [])
        ]
      );

      return {
        success: true,
        pointId: result.insertId,
        message: '管点创建成功'
      };
    } catch (error) {
      console.error('创建管点失败:', error);
      return {
        success: false,
        message: '管点创建失败: ' + error.message
      };
    }
  }

  /**
   * 获取项目的所有管点
   */
  async getProjectPipePoints(projectId) {
    try {
      const points = await database.executeSql(
        'SELECT * FROM pipe_points WHERE project_id = ? AND status = "active" ORDER BY created_time DESC',
        [projectId]
      );

      // 解析photo_paths JSON字符串
      const processedPoints = points.map(point => ({
        ...point,
        photo_paths: point.photo_paths ? JSON.parse(point.photo_paths) : []
      }));

      return {
        success: true,
        data: processedPoints
      };
    } catch (error) {
      console.error('获取管点列表失败:', error);
      return {
        success: false,
        message: '获取管点列表失败: ' + error.message
      };
    }
  }

  /**
   * 根据点号搜索管点
   */
  async searchPipePointByNumber(projectId, pointNumber) {
    try {
      const points = await database.executeSql(
        'SELECT * FROM pipe_points WHERE project_id = ? AND point_number LIKE ? AND status = "active"',
        [projectId, `%${pointNumber}%`]
      );

      const processedPoints = points.map(point => ({
        ...point,
        photo_paths: point.photo_paths ? JSON.parse(point.photo_paths) : []
      }));

      return {
        success: true,
        data: processedPoints
      };
    } catch (error) {
      console.error('搜索管点失败:', error);
      return {
        success: false,
        message: '搜索管点失败: ' + error.message
      };
    }
  }

  /**
   * 更新管点信息
   */
  async updatePipePoint(pointId, updateData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (key === 'photo_paths') {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(updateData[key]));
          } else {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
          }
        }
      });

      if (fields.length === 0) {
        return { success: false, message: '没有要更新的数据' };
      }

      fields.push('updated_time = ?');
      values.push(new Date().toISOString());
      values.push(pointId);

      await database.executeSql(
        `UPDATE pipe_points SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return {
        success: true,
        message: '管点更新成功'
      };
    } catch (error) {
      console.error('更新管点失败:', error);
      return {
        success: false,
        message: '管点更新失败: ' + error.message
      };
    }
  }

  /**
   * 收点操作
   */
  async collectPipePoint(pointId) {
    try {
      await database.executeSql(
        'UPDATE pipe_points SET is_collected = 1, updated_time = ? WHERE id = ?',
        [new Date().toISOString(), pointId]
      );

      return {
        success: true,
        message: '收点成功'
      };
    } catch (error) {
      console.error('收点失败:', error);
      return {
        success: false,
        message: '收点失败: ' + error.message
      };
    }
  }

  /**
   * 删除管点
   */
  async deletePipePoint(pointId) {
    try {
      // 检查是否有管线连接到此管点
      const connectedLines = await database.executeSql(
        'SELECT COUNT(*) as count FROM pipe_lines WHERE (start_point_id = ? OR end_point_id = ?) AND status = "active"',
        [pointId, pointId]
      );

      if (connectedLines[0].count > 0) {
        return {
          success: false,
          message: '该管点已连接管线，无法删除'
        };
      }

      await database.executeSql(
        'UPDATE pipe_points SET status = "deleted", updated_time = ? WHERE id = ?',
        [new Date().toISOString(), pointId]
      );

      return {
        success: true,
        message: '管点删除成功'
      };
    } catch (error) {
      console.error('删除管点失败:', error);
      return {
        success: false,
        message: '管点删除失败: ' + error.message
      };
    }
  }

  /**
   * 移动管点位置
   */
  async movePipePoint(pointId, longitude, latitude) {
    try {
      await database.executeSql(
        'UPDATE pipe_points SET longitude = ?, latitude = ?, updated_time = ? WHERE id = ?',
        [longitude, latitude, new Date().toISOString(), pointId]
      );

      return {
        success: true,
        message: '管点位置更新成功'
      };
    } catch (error) {
      console.error('移动管点失败:', error);
      return {
        success: false,
        message: '管点移动失败: ' + error.message
      };
    }
  }

  /**
   * 获取管点详情
   */
  async getPipePointDetail(pointId) {
    try {
      const points = await database.executeSql(
        'SELECT * FROM pipe_points WHERE id = ?',
        [pointId]
      );

      if (points.length === 0) {
        return {
          success: false,
          message: '管点不存在'
        };
      }

      const point = points[0];
      point.photo_paths = point.photo_paths ? JSON.parse(point.photo_paths) : [];

      return {
        success: true,
        data: point
      };
    } catch (error) {
      console.error('获取管点详情失败:', error);
      return {
        success: false,
        message: '获取管点详情失败: ' + error.message
      };
    }
  }

  /**
   * 生成下一个管点编号
   */
  async generateNextPointNumber(projectId, workGroup = '') {
    try {
      const result = await database.executeSql(
        'SELECT point_number FROM pipe_points WHERE project_id = ? ORDER BY created_time DESC LIMIT 1',
        [projectId]
      );

      let nextNumber = 1;
      if (result.length > 0) {
        const lastNumber = result[0].point_number;
        // 提取数字部分
        const match = lastNumber.match(/(\d+)$/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const prefix = workGroup ? `${workGroup}-` : '';
      const pointNumber = `${prefix}${nextNumber.toString().padStart(4, '0')}`;

      return {
        success: true,
        pointNumber: pointNumber
      };
    } catch (error) {
      console.error('生成管点编号失败:', error);
      return {
        success: false,
        message: '生成管点编号失败: ' + error.message
      };
    }
  }
}

export default new PipePointService();