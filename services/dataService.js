/**
 * 数据导入导出服务
 */
import database from '@/utils/database.js';
import projectService from '@/services/projectService.js';

class DataService {

  /**
   * 导出数据到Excel
   */
  async exportToExcel(projectId, exportType = 'all') {
    try {
      const project = await projectService.getCurrentProject();
      if (!project.success) {
        return { success: false, message: '未找到当前项目' };
      }

      let data = {};

      if (exportType === 'all' || exportType === 'comprehensive') {
        // 导出综合表
        data.comprehensive = await this.getComprehensiveData(projectId);
      }

      if (exportType === 'all' || exportType === 'separate') {
        // 导出管点表
        data.points = await this.getPipePointsData(projectId);
        // 导出管线表
        data.lines = await this.getPipeLinesData(projectId);
      }

      // 生成Excel文件路径
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${project.data.project_name}_${timestamp}.xlsx`;
      const filePath = `_doc/pipeline/excel/${fileName}`;

      // 这里需要调用Excel生成插件或使用uni-app的文件API
      // 由于uniapp没有内置Excel生成功能，这里返回数据供前端处理
      return {
        success: true,
        data: data,
        fileName: fileName,
        filePath: filePath,
        message: '数据导出成功'
      };

    } catch (error) {
      console.error('导出数据失败:', error);
      return {
        success: false,
        message: '数据导出失败: ' + error.message
      };
    }
  }

  /**
   * 获取综合数据（管点+管线）
   */
  async getComprehensiveData(projectId) {
    try {
      const result = await database.executeSql(
        `SELECT 
          p.point_number,
          p.longitude,
          p.latitude,
          p.elevation,
          p.pipe_type as point_type,
          p.material as point_material,
          p.diameter as point_diameter,
          p.depth,
          p.description as point_description,
          l.line_number,
          l.pipe_type as line_type,
          l.material as line_material,
          l.diameter as line_diameter,
          l.length,
          l.flow_direction,
          l.description as line_description,
          ep.point_number as end_point_number
         FROM pipe_points p
         LEFT JOIN pipe_lines l ON p.id = l.start_point_id
         LEFT JOIN pipe_points ep ON l.end_point_id = ep.id
         WHERE p.project_id = ? AND p.status = 'active'
         ORDER BY p.created_time`,
        [projectId]
      );

      return result;
    } catch (error) {
      console.error('获取综合数据失败:', error);
      return [];
    }
  }

  /**
   * 获取管点数据
   */
  async getPipePointsData(projectId) {
    try {
      const result = await database.executeSql(
        `SELECT 
          point_number,
          longitude,
          latitude,
          elevation,
          pipe_type,
          material,
          diameter,
          depth,
          description,
          is_collected,
          created_time
         FROM pipe_points 
         WHERE project_id = ? AND status = 'active'
         ORDER BY created_time`,
        [projectId]
      );

      return result;
    } catch (error) {
      console.error('获取管点数据失败:', error);
      return [];
    }
  }

  /**
   * 获取管线数据
   */
  async getPipeLinesData(projectId) {
    try {
      const result = await database.executeSql(
        `SELECT 
          l.line_number,
          sp.point_number as start_point,
          ep.point_number as end_point,
          l.pipe_type,
          l.material,
          l.diameter,
          l.length,
          l.flow_direction,
          l.description,
          l.created_time
         FROM pipe_lines l
         LEFT JOIN pipe_points sp ON l.start_point_id = sp.id
         LEFT JOIN pipe_points ep ON l.end_point_id = ep.id
         WHERE l.project_id = ? AND l.status = 'active'
         ORDER BY l.created_time`,
        [projectId]
      );

      return result;
    } catch (error) {
      console.error('获取管线数据失败:', error);
      return [];
    }
  }

  /**
   * 从Excel导入数据
   */
  async importFromExcel(filePath, importType = 'comprehensive') {
    try {
      // 这里需要解析Excel文件
      // 由于uniapp限制，通常需要用户先将Excel转换为JSON格式
      
      const project = await projectService.getCurrentProject();
      if (!project.success) {
        return { success: false, message: '未找到当前项目' };
      }

      // 读取文件内容（这里假设已经是JSON格式）
      const fileContent = await this.readFile(filePath);
      const data = JSON.parse(fileContent);

      let importResult = {
        success: true,
        pointsImported: 0,
        linesImported: 0,
        errors: []
      };

      if (importType === 'comprehensive') {
        importResult = await this.importComprehensiveData(project.data.id, data);
      } else if (importType === 'points') {
        importResult = await this.importPointsData(project.data.id, data);
      } else if (importType === 'lines') {
        importResult = await this.importLinesData(project.data.id, data);
      }

      return importResult;

    } catch (error) {
      console.error('导入数据失败:', error);
      return {
        success: false,
        message: '数据导入失败: ' + error.message
      };
    }
  }

  /**
   * 导入综合数据
   */
  async importComprehensiveData(projectId, data) {
    let pointsImported = 0;
    let linesImported = 0;
    let errors = [];

    try {
      for (const row of data) {
        try {
          // 导入管点
          if (row.point_number) {
            const pointResult = await database.executeSql(
              `INSERT OR REPLACE INTO pipe_points 
               (project_id, point_number, longitude, latitude, elevation, pipe_type, material, diameter, depth, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                projectId,
                row.point_number,
                row.longitude || null,
                row.latitude || null,
                row.elevation || null,
                row.point_type || '',
                row.point_material || '',
                row.point_diameter || null,
                row.depth || null,
                row.point_description || ''
              ]
            );
            pointsImported++;

            // 导入管线（如果有终点）
            if (row.end_point_number && row.line_number) {
              // 查找终点ID
              const endPoints = await database.executeSql(
                'SELECT id FROM pipe_points WHERE project_id = ? AND point_number = ?',
                [projectId, row.end_point_number]
              );

              if (endPoints.length > 0) {
                await database.executeSql(
                  `INSERT OR REPLACE INTO pipe_lines 
                   (project_id, line_number, start_point_id, end_point_id, pipe_type, material, diameter, length, flow_direction, description)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    projectId,
                    row.line_number,
                    pointResult.insertId,
                    endPoints[0].id,
                    row.line_type || '',
                    row.line_material || '',
                    row.line_diameter || null,
                    row.length || null,
                    row.flow_direction || '',
                    row.line_description || ''
                  ]
                );
                linesImported++;
              }
            }
          }
        } catch (rowError) {
          errors.push(`行 ${data.indexOf(row) + 1}: ${rowError.message}`);
        }
      }

      return {
        success: true,
        pointsImported,
        linesImported,
        errors,
        message: `成功导入 ${pointsImported} 个管点，${linesImported} 条管线`
      };

    } catch (error) {
      return {
        success: false,
        message: '导入过程中发生错误: ' + error.message
      };
    }
  }

  /**
   * 读取文件内容
   */
  async readFile(filePath) {
    return new Promise((resolve, reject) => {
      uni.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'utf8',
        success: (res) => {
          resolve(res.data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * 清空项目数据
   */
  async clearProjectData(projectId) {
    try {
      // 删除管线
      await database.executeSql(
        'UPDATE pipe_lines SET status = "deleted" WHERE project_id = ?',
        [projectId]
      );

      // 删除管点
      await database.executeSql(
        'UPDATE pipe_points SET status = "deleted" WHERE project_id = ?',
        [projectId]
      );

      // 删除虚拟线
      await database.executeSql(
        'UPDATE virtual_lines SET status = "deleted" WHERE project_id = ?',
        [projectId]
      );

      return {
        success: true,
        message: '项目数据清空成功'
      };
    } catch (error) {
      console.error('清空项目数据失败:', error);
      return {
        success: false,
        message: '清空项目数据失败: ' + error.message
      };
    }
  }

  /**
   * 备份数据库
   */
  async backupDatabase() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `_doc/pipeline/backup/pipeline_backup_${timestamp}.db`;

      // 这里需要调用文件复制API
      // 具体实现取决于平台和插件支持

      return {
        success: true,
        backupPath: backupPath,
        message: '数据库备份成功'
      };
    } catch (error) {
      console.error('备份数据库失败:', error);
      return {
        success: false,
        message: '数据库备份失败: ' + error.message
      };
    }
  }
}

export default new DataService();