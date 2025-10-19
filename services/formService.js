/**
 * Form 表服务：驱动属性配置与采集页面字段展示
 * 表结构参考 docs/db.md:
 * CREATE TABLE form (
 *   _id        INTEGER PRIMARY KEY AUTOINCREMENT,
 *   form_name  TEXT,        -- 大类编码：PS/DL/TX/JS/RQ 等
 *   form_type  TEXT,        -- 'gd' 管点, 'gx' 管线
 *   field      TEXT,        -- 字段键
 *   label      TEXT,        -- 展示名称
 *   field_type TEXT,        -- 控件类型：text/real/list/edit_list/edit_spinner 等
 *   domain     TEXT,        -- 选项域名（字典/代码表名）
 *   show       INTEGER,     -- 1 显示, 0 不显示
 *   number     INTEGER      -- 排序号
 * );
 */
import database from '@/utils/database.js';

const SHOW_BOOL_TO_DB = (b) => (b ? 1 : 0);
const SHOW_DB_TO_BOOL = (v) => v === 1 || v === '1';

class FormService {
  // 将数据库行映射为前端对象
  mapRow(row) {
    return {
      id: row._id ?? row.id ?? row.ID ?? row._ID, // 兼容Storage回退下的可能命名
      formName: row.form_name || row.FORM_NAME,
      formType: row.form_type || row.FORM_TYPE, // 'gd' | 'gx'
      field: row.field || row.FIELD,
      label: row.label || row.LABEL,
      fieldType: row.field_type || row.FIELD_TYPE,
      domain: row.domain || row.DOMAIN || '',
      show: SHOW_DB_TO_BOOL(row.show ?? row.SHOW),
      number: Number(row.number ?? row.NUMBER ?? 0)
    };
  }

  // 确保表存在（Storage回退路径有用；SQLite路径通常已有）
  async ensureTable() {
    try {
      await database.executeSql(
        `CREATE TABLE IF NOT EXISTS form (
          _id INTEGER PRIMARY KEY AUTOINCREMENT,
          form_name TEXT,
          form_type TEXT,
          field TEXT,
          label TEXT,
          field_type TEXT,
          domain TEXT,
          show INTEGER,
          number INTEGER
        )`,
        []
      );
      return true;
    } catch (e) {
      console.error('确保 form 表存在失败:', e);
      return false;
    }
  }

  // 读取字段（按 number 排序）
  async getFields(formName, formType) {
    try {
      const rows = await database.executeSql(
        `SELECT _id, form_name, form_type, field, label, field_type, domain, show, number
         FROM form
         WHERE form_name = ? AND form_type = ?
         ORDER BY number ASC`,
        [formName, formType]
      );
      return { success: true, data: rows.map(r => this.mapRow(r)) };
    } catch (e) {
      console.error('读取 form 字段失败:', e);
      return { success: false, message: '读取字段失败: ' + e.message };
    }
  }

  // 更新显示开关（按 _id）
  async setShowById(id, show) {
    try {
      await database.executeSql(
        `UPDATE form SET show = ? WHERE _id = ?`,
        [SHOW_BOOL_TO_DB(show), id]
      );
      return { success: true, message: '更新成功' };
    } catch (e) {
      console.error('更新 show 失败:', e);
      return { success: false, message: '更新失败: ' + e.message };
    }
  }

  // 更新显示开关（按字段 + formName + formType）
  async setShowByField(formName, formType, field, show) {
    try {
      await database.executeSql(
        `UPDATE form SET show = ?
         WHERE form_name = ? AND form_type = ? AND field = ?`,
        [SHOW_BOOL_TO_DB(show), formName, formType, field]
      );
      return { success: true, message: '更新成功' };
    } catch (e) {
      console.error('按字段更新 show 失败:', e);
      return { success: false, message: '更新失败: ' + e.message };
    }
  }

  // 批量更新显示（输入: [{ id, show }...] 或 [{ formName, formType, field, show }...]）
  async batchUpdateShow(items = []) {
    try {
      for (const it of items) {
        if (it.id !== undefined && it.id !== null) {
          await this.setShowById(it.id, it.show);
        } else {
          await this.setShowByField(it.formName, it.formType, it.field, it.show);
        }
      }
      return { success: true, message: '批量更新成功' };
    } catch (e) {
      console.error('批量更新 show 失败:', e);
      return { success: false, message: '批量更新失败: ' + e.message };
    }
  }

  // 更新字段元数据（label, field_type, domain, number）
  async updateFieldMeta(id, { label, fieldType, domain, number }) {
    try {
      const fields = [];
      const values = [];

      if (label !== undefined) { fields.push('label = ?'); values.push(label); }
      if (fieldType !== undefined) { fields.push('field_type = ?'); values.push(fieldType); }
      if (domain !== undefined) { fields.push('domain = ?'); values.push(domain); }
      if (number !== undefined) { fields.push('number = ?'); values.push(number); }

      if (fields.length === 0) {
        return { success: false, message: '无可更新字段' };
      }

      values.push(id);
      await database.executeSql(
        `UPDATE form SET ${fields.join(', ')} WHERE _id = ?`,
        values
      );
      return { success: true, message: '更新成功' };
    } catch (e) {
      console.error('更新字段元数据失败:', e);
      return { success: false, message: '更新失败: ' + e.message };
    }
  }

  // 新增字段记录
  async addField({ formName, formType, field, label, fieldType, domain = '', show = 1, number = 0 }) {
    try {
      if (!formName || !formType || !field) {
        return { success: false, message: '参数不完整' };
      }
      // 去重：同 formName + formType + field 不重复
      const exists = await database.executeSql(
        `SELECT _id FROM form WHERE form_name = ? AND form_type = ? AND field = ?`,
        [formName, formType, field]
      );
      if (exists && exists.length > 0) {
        return { success: false, message: '该字段已存在' };
      }

      await database.executeSql(
        `INSERT INTO form
         (form_name, form_type, field, label, field_type, domain, show, number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [formName, formType, field, label || field, fieldType || 'text', domain || '', SHOW_BOOL_TO_DB(SHOW_DB_TO_BOOL(show)), number || 0]
      );
      return { success: true, message: '新增成功' };
    } catch (e) {
      console.error('新增字段失败:', e);
      return { success: false, message: '新增失败: ' + e.message };
    }
  }

  // 删除字段记录
  async deleteField(id) {
    try {
      await database.executeSql(
        `DELETE FROM form WHERE _id = ?`,
        [id]
      );
      return { success: true, message: '删除成功' };
    } catch (e) {
      console.error('删除字段失败:', e);
      return { success: false, message: '删除失败: ' + e.message };
    }
  }

}

export default new FormService();