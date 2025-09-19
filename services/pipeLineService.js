/**
 * 管线管理服务
 */
import database from '@/utils/database.js';

class PipeLineService {

  /**
   * 创建管线
   */
  async createPipeLine(lineData) {
    try {
      const {
        project_id,
        line_number,
        start_point_id,
        end_point_id,
        pipe_type,
        material,
        diameter,
        length,
        flow_direction,
        description
      } = lineData;

      // 验证起点和终点是否存在
      const startPoint = await database.executeSql(
        'SELECT id FROM pipe_points WHERE id = ? AND status = "active"',
        [start_point_id]
      );
      
      const endPoint = await database.executeSql(
        'SELECT id FROM pipe_points WHERE id = ? AND status = "active"',
        [end_point_id]
      );

      if (startPoint.length === 0 || endPoint.length === 0) {
        return {
          success: false,
          message: '起点或终点不存在'
        };
      }

      // 检查是否已存在相同的管线
      const existingLine = await database.executeSql(
        'SELECT id FROM pipe_lines WHERE project_id = ? AND start_point_id = ? AND end_point_id = ? AND status = "active"',
        [project_id, start_point_id, end_point_id]
      );

      if (existingLine.length > 0) {
        return {
          success: false,
          message: '该管线已存在'
        };
      }

      const result = await database.executeSql(
        `INSERT INTO pipe_lines 
         (project_id, line_number, start_point_id, end_point_id, pipe_type, material, diameter, length, flow_direction, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project_id,
          line_number || '',
          start_point_id,
          end_point_id,
          pipe_type || '',
          material || '',
          diameter || null,
          length || null,
          flow_direction || '',
          description || ''
        ]
      );

      return {
        success: true,
        lineId: result.insertId,
        message: '管线创建成功'
      };
    } catch (error) {
      console.error('创建管线失败:', error);
      return {
        success: false,
        message: '管线创建失败: ' + error.message
      };
    }
  }

  /**
   * 获取项目的所有管线
   */
  async getProjectPipeLines(projectId) {
    try {
      const lines = await database.executeSql(
        `SELECT l.*, 
                sp.point_number as start_point_number, sp.longitude as start_longitude, sp.latitude as start_latitude,
                ep.point_number as end_point_number, ep.longitude as end_longitude, ep.latitude as end_latitude
         FROM pipe_lines l
         LEFT JOIN pipe_points sp ON l.start_point_id = sp.id
         LEFT JOIN pipe_points ep ON l.end_point_id = ep.id
         WHERE l.project_id = ? AND l.status = "active"
         ORDER BY l.created_time DESC`,
        [projectId]
      );

      return {
        success: true,
        data: lines
      };
    } catch (error) {
      console.error('获取管线列表失败:', error);
      return {
        success: false,
        message: '获取管线列表失败: ' + error.message
      };
    }
  }

  /**
   * 更新管线信息
   */
  async updatePipeLine(lineId, updateData) {
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
      values.push(lineId);

      await database.executeSql(
        `UPDATE pipe_lines SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return {
        success: true,
        message: '管线更新成功'
      };
    } catch (error) {
      console.error('更新管线失败:', error);
      return {
        success: false,
        message: '管线更新失败: ' + error.message
      };
    }
  }

  /**
   * 删除管线
   */
  async deletePipeLine(lineId) {
    try {
      await database.executeSql(
        'UPDATE pipe_lines SET status = "deleted", updated_time = ? WHERE id = ?',
        [new Date().toISOString(), lineId]
      );

      return {
        success: true,
        message: '管线删除成功'
      };
    } catch (error) {
      console.error('删除管线失败:', error);
      return {
        success: false,
        message: '管线删除失败: ' + error.message
      };
    }
  }

  /**
   * 更新管线流向
   */
  async updateFlowDirection(lineId, flowDirection) {
    try {
      await database.executeSql(
        'UPDATE pipe_lines SET flow_direction = ?, updated_time = ? WHERE id = ?',
        [flowDirection, new Date().toISOString(), lineId]
      );

      return {
        success: true,
        message: '流向更新成功'
      };
    } catch (error) {
      console.error('更新流向失败:', error);
      return {
        success: false,
        message: '流向更新失败: ' + error.message
      };
    }
  }

  /**
   * 创建虚拟线
   */
  async createVirtualLine(virtualLineData) {
    try {
      const {
        project_id,
        start_point_id,
        direction_angle,
        length,
        pipe_type
      } = virtualLineData;

      const result = await database.executeSql(
        `INSERT INTO virtual_lines 
         (project_id, start_point_id, direction_angle, length, pipe_type)
         VALUES (?, ?, ?, ?, ?)`,
        [project_id, start_point_id, direction_angle, length, pipe_type || '']
      );

      return {
        success: true,
        virtualLineId: result.insertId,
        message: '虚拟线创建成功'
      };
    } catch (error) {
      console.error('创建虚拟线失败:', error);
      return {
        success: false,
        message: '虚拟线创建失败: ' + error.message
      };
    }
  }

  /**
   * 虚拟线转实线
   */
  async convertVirtualToReal(virtualLineId, endPointId) {
    try {
      // 获取虚拟线信息
      const virtualLines = await database.executeSql(
        'SELECT * FROM virtual_lines WHERE id = ?',
        [virtualLineId]
      );

      if (virtualLines.length === 0) {
        return {
          success: false,
          message: '虚拟线不存在'
        };
      }

      const virtualLine = virtualLines[0];

      // 创建实际管线
      const lineResult = await this.createPipeLine({
        project_id: virtualLine.project_id,
        start_point_id: virtualLine.start_point_id,
        end_point_id: endPointId,
        pipe_type: virtualLine.pipe_type,
        length: virtualLine.length
      });

      if (lineResult.success) {
        // 删除虚拟线
        await database.executeSql(
          'UPDATE virtual_lines SET status = "converted" WHERE id = ?',
          [virtualLineId]
        );
      }

      return lineResult;
    } catch (error) {
      console.error('虚拟线转实线失败:', error);
      return {
        success: false,
        message: '虚拟线转实线失败: ' + error.message
      };
    }
  }

  /**
   * 创建共管
   */
  async createSharedPipe(originalLineId, sharedPipeType) {
    try {
      const result = await database.executeSql(
        `INSERT INTO shared_pipes (original_line_id, shared_pipe_type)
         VALUES (?, ?)`,
        [originalLineId, sharedPipeType]
      );

      return {
        success: true,
        sharedPipeId: result.insertId,
        message: '共管创建成功'
      };
    } catch (error) {
      console.error('创建共管失败:', error);
      return {
        success: false,
        message: '共管创建失败: ' + error.message
      };
    }
  }

  /**
   * 在管线中插入管点
   */
  async insertPointInLine(lineId, newPointData, insertPosition) {
    try {
      // 获取原管线信息
      const lines = await database.executeSql(
        'SELECT * FROM pipe_lines WHERE id = ?',
        [lineId]
      );

      if (lines.length === 0) {
        return {
          success: false,
          message: '管线不存在'
        };
      }

      const originalLine = lines[0];

      // 创建新管点
      const pointResult = await database.executeSql(
        `INSERT INTO pipe_points 
         (project_id, point_number, longitude, latitude, pipe_type, material, diameter)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          originalLine.project_id,
          newPointData.point_number,
          newPointData.longitude,
          newPointData.latitude,
          originalLine.pipe_type,
          originalLine.material,
          originalLine.diameter
        ]
      );

      const newPointId = pointResult.insertId;

      // 更新原管线的终点
      await database.executeSql(
        'UPDATE pipe_lines SET end_point_id = ?, updated_time = ? WHERE id = ?',
        [newPointId, new Date().toISOString(), lineId]
      );

      // 创建新管线段
      await database.executeSql(
        `INSERT INTO pipe_lines 
         (project_id, start_point_id, end_point_id, pipe_type, material, diameter, flow_direction)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          originalLine.project_id,
          newPointId,
          originalLine.end_point_id,
          originalLine.pipe_type,
          originalLine.material,
          originalLine.diameter,
          originalLine.flow_direction
        ]
      );

      return {
        success: true,
        newPointId: newPointId,
        message: '管点插入成功'
      };
    } catch (error) {
      console.error('插入管点失败:', error);
      return {
        success: false,
        message: '插入管点失败: ' + error.message
      };
    }
  }

  /**
   * 获取管线详情
   */
  async getPipeLineDetail(lineId) {
    try {
      const lines = await database.executeSql(
        `SELECT l.*, 
                sp.point_number as start_point_number, sp.longitude as start_longitude, sp.latitude as start_latitude,
                ep.point_number as end_point_number, ep.longitude as end_longitude, ep.latitude as end_latitude
         FROM pipe_lines l
         LEFT JOIN pipe_points sp ON l.start_point_id = sp.id
         LEFT JOIN pipe_points ep ON l.end_point_id = ep.id
         WHERE l.id = ?`,
        [lineId]
      );

      if (lines.length === 0) {
        return {
          success: false,
          message: '管线不存在'
        };
      }

      return {
        success: true,
        data: lines[0]
      };
    } catch (error) {
      console.error('获取管线详情失败:', error);
      return {
        success: false,
        message: '获取管线详情失败: ' + error.message
      };
    }
  }
}

export default new PipeLineService();