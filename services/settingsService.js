/**
 * 设置管理服务
 */
import database from '@/utils/database.js';

class SettingsService {

  /**
   * 获取所有管类设置
   */
  async getPipeCategories() {
    try {
      const categories = await database.executeSql(
        'SELECT * FROM pipe_categories WHERE is_active = 1 ORDER BY sort_order, id'
      );

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('获取管类设置失败:', error);
      return {
        success: false,
        message: '获取管类设置失败: ' + error.message
      };
    }
  }

  /**
   * 添加管类
   */
  async addPipeCategory(categoryData) {
    try {
      const { category_name, category_type, color } = categoryData;

      // 检查是否已存在
      const existing = await database.executeSql(
        'SELECT COUNT(*) as count FROM pipe_categories WHERE category_name = ? AND category_type = ?',
        [category_name, category_type]
      );

      if (existing[0].count > 0) {
        return {
          success: false,
          message: '该管类已存在'
        };
      }

      const result = await database.executeSql(
        'INSERT INTO pipe_categories (category_name, category_type, color) VALUES (?, ?, ?)',
        [category_name, category_type, color || '#000000']
      );

      return {
        success: true,
        categoryId: result.insertId,
        message: '管类添加成功'
      };
    } catch (error) {
      console.error('添加管类失败:', error);
      return {
        success: false,
        message: '添加管类失败: ' + error.message
      };
    }
  }

  /**
   * 删除管类
   */
  async deletePipeCategory(categoryId) {
    try {
      await database.executeSql(
        'UPDATE pipe_categories SET is_active = 0 WHERE id = ?',
        [categoryId]
      );

      return {
        success: true,
        message: '管类删除成功'
      };
    } catch (error) {
      console.error('删除管类失败:', error);
      return {
        success: false,
        message: '管类删除失败: ' + error.message
      };
    }
  }

  /**
   * 获取属性设置
   */
  async getAttributeSettings() {
    try {
      const attributes = await database.executeSql(
        'SELECT * FROM attribute_settings ORDER BY sort_order, id'
      );

      return {
        success: true,
        data: attributes
      };
    } catch (error) {
      console.error('获取属性设置失败:', error);
      return {
        success: false,
        message: '获取属性设置失败: ' + error.message
      };
    }
  }

  /**
   * 更新属性显示状态
   */
  async updateAttributeVisibility(attributeId, isVisible) {
    try {
      await database.executeSql(
        'UPDATE attribute_settings SET is_visible = ? WHERE id = ?',
        [isVisible ? 1 : 0, attributeId]
      );

      return {
        success: true,
        message: '属性设置更新成功'
      };
    } catch (error) {
      console.error('更新属性设置失败:', error);
      return {
        success: false,
        message: '属性设置更新失败: ' + error.message
      };
    }
  }

  /**
   * 获取特征附属物
   */
  async getFeatures() {
    try {
      const features = await database.executeSql(
        'SELECT * FROM features WHERE is_active = 1 ORDER BY sort_order, id'
      );

      return {
        success: true,
        data: features
      };
    } catch (error) {
      console.error('获取特征附属物失败:', error);
      return {
        success: false,
        message: '获取特征附属物失败: ' + error.message
      };
    }
  }

  /**
   * 添加特征附属物
   */
  async addFeature(featureData) {
    try {
      const { feature_name, feature_type, description } = featureData;

      const result = await database.executeSql(
        'INSERT INTO features (feature_name, feature_type, description) VALUES (?, ?, ?)',
        [feature_name, feature_type, description || '']
      );

      return {
        success: true,
        featureId: result.insertId,
        message: '特征附属物添加成功'
      };
    } catch (error) {
      console.error('添加特征附属物失败:', error);
      return {
        success: false,
        message: '添加特征附属物失败: ' + error.message
      };
    }
  }

  /**
   * 删除特征附属物
   */
  async deleteFeature(featureId) {
    try {
      await database.executeSql(
        'UPDATE features SET is_active = 0 WHERE id = ?',
        [featureId]
      );

      return {
        success: true,
        message: '特征附属物删除成功'
      };
    } catch (error) {
      console.error('删除特征附属物失败:', error);
      return {
        success: false,
        message: '特征附属物删除失败: ' + error.message
      };
    }
  }

  /**
   * 获取管类选项（用于下拉选择）
   */
  async getPipeCategoryOptions(type = null) {
    try {
      let sql = 'SELECT id, category_name, color FROM pipe_categories WHERE is_active = 1';
      let params = [];

      if (type) {
        sql += ' AND category_type = ?';
        params.push(type);
      }

      sql += ' ORDER BY sort_order, category_name';

      const categories = await database.executeSql(sql, params);

      return {
        success: true,
        data: categories.map(cat => ({
          value: cat.category_name,
          text: cat.category_name,
          color: cat.color
        }))
      };
    } catch (error) {
      console.error('获取管类选项失败:', error);
      return {
        success: false,
        message: '获取管类选项失败: ' + error.message
      };
    }
  }

  /**
   * 获取材质选项
   */
  getMaterialOptions() {
    return {
      success: true,
      data: [
        { value: 'PE', text: 'PE管' },
        { value: 'PVC', text: 'PVC管' },
        { value: 'PPR', text: 'PPR管' },
        { value: 'HDPE', text: 'HDPE管' },
        { value: '钢管', text: '钢管' },
        { value: '铸铁管', text: '铸铁管' },
        { value: '水泥管', text: '水泥管' },
        { value: '陶瓷管', text: '陶瓷管' },
        { value: '其他', text: '其他' }
      ]
    };
  }

  /**
   * 获取流向选项
   */
  getFlowDirectionOptions() {
    return {
      success: true,
      data: [
        { value: 'forward', text: '正向' },
        { value: 'reverse', text: '反向' },
        { value: 'bidirectional', text: '双向' },
        { value: 'unknown', text: '未知' }
      ]
    };
  }
}

export default new SettingsService();