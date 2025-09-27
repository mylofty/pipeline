/**
 * 管线类型实体管理服务
 */
import database from '@/utils/database.js';

class PipeTypeEntityService {

  /**
   * 获取全量带层级结构的数据
   */
  async getAllPipeTypesWithStructure() {
    try {
      // 获取所有大类 (PRE_TYPE_CODE为空或null)
      const mainCategories = await database.executeSql(
        `SELECT PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16 
         FROM pipe_Line_type_entity 
         WHERE PRE_TYPE_CODE IS NULL OR PRE_TYPE_CODE = ''
         ORDER BY TYPE_NAME`,
        []
      );

      // 获取所有子类
      const subCategories = await database.executeSql(
        `SELECT PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16 
         FROM pipe_Line_type_entity 
         WHERE PRE_TYPE_CODE IS NOT NULL AND PRE_TYPE_CODE != ''
         ORDER BY TYPE_NAME`,
        []
      );

      // 组装树形结构
      const result = mainCategories.map(mainCategory => {
        const children = subCategories.filter(sub => 
          sub.PRE_TYPE_CODE === mainCategory.TYPE_CODE
        );
        
        return {
          pid: mainCategory.PID,
          typeName: mainCategory.TYPE_NAME,
          typeCode: mainCategory.TYPE_CODE,
          preTypeCode: mainCategory.PRE_TYPE_CODE,
          colorCode: mainCategory.COLOR_CODE_16,
          children: children.map(child => ({
            pid: child.PID,
            typeName: child.TYPE_NAME,
            typeCode: child.TYPE_CODE,
            preTypeCode: child.PRE_TYPE_CODE,
            colorCode: child.COLOR_CODE_16
          }))
        };
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('获取管线类型结构失败:', error);
      return {
        success: false,
        message: '获取管线类型结构失败: ' + error.message
      };
    }
  }

  /**
   * 获取所有大类
   */
  async getMainCategories() {
    try {
      const categories = await database.executeSql(
        `SELECT PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16 
         FROM pipe_Line_type_entity 
         WHERE PRE_TYPE_CODE IS NULL OR PRE_TYPE_CODE = ''
         ORDER BY TYPE_NAME`,
        []
      );

      return {
        success: true,
        data: categories.map(item => ({
          pid: item.PID,
          typeName: item.TYPE_NAME,
          typeCode: item.TYPE_CODE,
          preTypeCode: item.PRE_TYPE_CODE,
          colorCode: item.COLOR_CODE_16
        }))
      };
    } catch (error) {
      console.error('获取大类失败:', error);
      return {
        success: false,
        message: '获取大类失败: ' + error.message
      };
    }
  }

  /**
   * 获取指定大类下的二级分类
   */
  async getSubCategoriesByParent(parentTypeCode) {
    try {
      const subCategories = await database.executeSql(
        `SELECT PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16 
         FROM pipe_Line_type_entity 
         WHERE PRE_TYPE_CODE = ?
         ORDER BY TYPE_NAME`,
        [parentTypeCode]
      );

      return {
        success: true,
        data: subCategories.map(item => ({
          pid: item.PID,
          typeName: item.TYPE_NAME,
          typeCode: item.TYPE_CODE,
          preTypeCode: item.PRE_TYPE_CODE,
          colorCode: item.COLOR_CODE_16
        }))
      };
    } catch (error) {
      console.error('获取子分类失败:', error);
      return {
        success: false,
        message: '获取子分类失败: ' + error.message
      };
    }
  }

  /**
   * 在大类下添加二级类别
   */
  async addSubCategory(parentTypeCode, subCategoryData) {
    try {
      const { typeName, typeCode, colorCode } = subCategoryData;

      // 验证父类是否存在
      const parentExists = await database.executeSql(
        `SELECT PID FROM pipe_Line_type_entity 
         WHERE TYPE_CODE = ? AND (PRE_TYPE_CODE IS NULL OR PRE_TYPE_CODE = '')`,
        [parentTypeCode]
      );

      if (parentExists.length === 0) {
        return {
          success: false,
          message: '父类不存在'
        };
      }

      // 检查TYPE_CODE是否已存在
      const codeExists = await this.checkTypeCodeExists(typeCode);
      if (!codeExists.success) {
        return codeExists;
      }

      if (codeExists.exists) {
        return {
          success: false,
          message: 'TYPE_CODE已存在'
        };
      }

      // 生成新的PID
      const pid = this.generatePID();

      // 插入新的二级类别
      await database.executeSql(
        `INSERT INTO pipe_Line_type_entity (PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16)
         VALUES (?, ?, ?, ?, ?)`,
        [pid, typeName, typeCode, parentTypeCode, colorCode || null]
      );

      return {
        success: true,
        pid: pid,
        message: '二级类别添加成功'
      };
    } catch (error) {
      console.error('添加二级类别失败:', error);
      return {
        success: false,
        message: '添加二级类别失败: ' + error.message
      };
    }
  }

  /**
   * 删除二级类别
   */
  async deleteSubCategory(pid) {
    try {
      // 验证是否为二级类别（PRE_TYPE_CODE不为空）
      const category = await database.executeSql(
        `SELECT PID, PRE_TYPE_CODE FROM pipe_Line_type_entity WHERE PID = ?`,
        [pid]
      );

      if (category.length === 0) {
        return {
          success: false,
          message: '类别不存在'
        };
      }

      if (!category[0].PRE_TYPE_CODE || category[0].PRE_TYPE_CODE === '') {
        return {
          success: false,
          message: '不能删除大类，只能删除二级类别'
        };
      }

      // 删除二级类别
      await database.executeSql(
        `DELETE FROM pipe_Line_type_entity WHERE PID = ?`,
        [pid]
      );

      return {
        success: true,
        message: '二级类别删除成功'
      };
    } catch (error) {
      console.error('删除二级类别失败:', error);
      return {
        success: false,
        message: '删除二级类别失败: ' + error.message
      };
    }
  }

  /**
   * 更新类别信息
   */
  async updatePipeTypeEntity(pid, updateData) {
    try {
      const fields = [];
      const values = [];

      // 构建更新字段
      if (updateData.typeName !== undefined) {
        fields.push('TYPE_NAME = ?');
        values.push(updateData.typeName);
      }
      
      if (updateData.typeCode !== undefined) {
        // 检查新的TYPE_CODE是否已存在（排除当前记录）
        const codeExists = await this.checkTypeCodeExists(updateData.typeCode, pid);
        if (!codeExists.success) {
          return codeExists;
        }
        if (codeExists.exists) {
          return {
            success: false,
            message: 'TYPE_CODE已存在'
          };
        }
        fields.push('TYPE_CODE = ?');
        values.push(updateData.typeCode);
      }
      
      if (updateData.colorCode !== undefined) {
        fields.push('COLOR_CODE_16 = ?');
        values.push(updateData.colorCode);
      }

      if (fields.length === 0) {
        return {
          success: false,
          message: '没有要更新的数据'
        };
      }

      values.push(pid);

      await database.executeSql(
        `UPDATE pipe_Line_type_entity SET ${fields.join(', ')} WHERE PID = ?`,
        values
      );

      return {
        success: true,
        message: '类别信息更新成功'
      };
    } catch (error) {
      console.error('更新类别信息失败:', error);
      return {
        success: false,
        message: '更新类别信息失败: ' + error.message
      };
    }
  }

  /**
   * 根据PID获取单个类别信息
   */
  async getPipeTypeEntityById(pid) {
    try {
      const categories = await database.executeSql(
        `SELECT PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16 
         FROM pipe_Line_type_entity WHERE PID = ?`,
        [pid]
      );

      if (categories.length === 0) {
        return {
          success: false,
          message: '类别不存在'
        };
      }

      const category = categories[0];
      return {
        success: true,
        data: {
          pid: category.PID,
          typeName: category.TYPE_NAME,
          typeCode: category.TYPE_CODE,
          preTypeCode: category.PRE_TYPE_CODE,
          colorCode: category.COLOR_CODE_16
        }
      };
    } catch (error) {
      console.error('获取类别信息失败:', error);
      return {
        success: false,
        message: '获取类别信息失败: ' + error.message
      };
    }
  }

  /**
   * 检查TYPE_CODE是否已存在
   */
  async checkTypeCodeExists(typeCode, excludePid = null) {
    try {
      let sql = `SELECT PID FROM pipe_Line_type_entity WHERE TYPE_CODE = ?`;
      let params = [typeCode];

      if (excludePid) {
        sql += ` AND PID != ?`;
        params.push(excludePid);
      }

      const existing = await database.executeSql(sql, params);

      return {
        success: true,
        exists: existing.length > 0
      };
    } catch (error) {
      console.error('检查TYPE_CODE失败:', error);
      return {
        success: false,
        message: '检查TYPE_CODE失败: ' + error.message
      };
    }
  }

  /**
   * 根据TYPE_CODE获取类别信息
   */
  async getPipeTypeEntityByCode(typeCode) {
    try {
      const categories = await database.executeSql(
        `SELECT PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16 
         FROM pipe_Line_type_entity WHERE TYPE_CODE = ?`,
        [typeCode]
      );

      if (categories.length === 0) {
        return {
          success: false,
          message: '类别不存在'
        };
      }

      const category = categories[0];
      return {
        success: true,
        data: {
          pid: category.PID,
          typeName: category.TYPE_NAME,
          typeCode: category.TYPE_CODE,
          preTypeCode: category.PRE_TYPE_CODE,
          colorCode: category.COLOR_CODE_16
        }
      };
    } catch (error) {
      console.error('获取类别信息失败:', error);
      return {
        success: false,
        message: '获取类别信息失败: ' + error.message
      };
    }
  }

  /**
   * 添加大类
   */
  async addMainCategory(categoryData) {
    try {
      const { typeName, typeCode, colorCode } = categoryData;

      // 检查TYPE_CODE是否已存在
      const codeExists = await this.checkTypeCodeExists(typeCode);
      if (!codeExists.success) {
        return codeExists;
      }

      if (codeExists.exists) {
        return {
          success: false,
          message: 'TYPE_CODE已存在'
        };
      }

      // 生成新的PID
      const pid = this.generatePID();

      // 插入新的大类
      await database.executeSql(
        `INSERT INTO pipe_Line_type_entity (PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16)
         VALUES (?, ?, ?, NULL, ?)`,
        [pid, typeName, typeCode, colorCode || null]
      );

      return {
        success: true,
        pid: pid,
        message: '大类添加成功'
      };
    } catch (error) {
      console.error('添加大类失败:', error);
      return {
        success: false,
        message: '添加大类失败: ' + error.message
      };
    }
  }

  /**
   * 生成PID
   */
  generatePID() {
    // 生成类似于现有数据的UUID格式
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 批量导入管线类型数据
   */
  async batchImportPipeTypes(pipeTypesData) {
    try {
      const results = [];
      
      for (const typeData of pipeTypesData) {
        const { pid, typeName, typeCode, preTypeCode, colorCode } = typeData;
        
        try {
          await database.executeSql(
            `INSERT OR REPLACE INTO pipe_Line_type_entity (PID, TYPE_NAME, TYPE_CODE, PRE_TYPE_CODE, COLOR_CODE_16)
             VALUES (?, ?, ?, ?, ?)`,
            [pid, typeName, typeCode, preTypeCode || null, colorCode || null]
          );
          
          results.push({
            success: true,
            pid: pid,
            typeName: typeName
          });
        } catch (error) {
          results.push({
            success: false,
            pid: pid,
            typeName: typeName,
            error: error.message
          });
        }
      }

      return {
        success: true,
        results: results,
        message: '批量导入完成'
      };
    } catch (error) {
      console.error('批量导入失败:', error);
      return {
        success: false,
        message: '批量导入失败: ' + error.message
      };
    }
  }
}

export default new PipeTypeEntityService();