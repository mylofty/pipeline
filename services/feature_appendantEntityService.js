/**
 * 特征/附属物 实体管理服务（适配表结构）
 * 表: feature_appendant_entity
 * 字段:
 *  PID TEXT PRIMARY KEY NOT NULL
 *  NAME TEXT
 *  TYPE TEXT           -- '特征' | '附属物'
 *  CATEGORY TEXT       -- 类别代码，如 'PS' | 'TX' | 'JS'
 *  CATEGORY_NAME TEXT  -- 类别名称，如 '排水' | '电信' | '给水'
 *  IS_SHOW TEXT        -- '1' 显示, '0' 不显示
 */
import database from '@/utils/database.js';

const TYPE_DB_TO_APP = (t) => (t === '附属物' ? 'appendant' : 'feature');
const TYPE_APP_TO_DB = (t) => (t === 'appendant' ? '附属物' : '特征');
const SHOW_DB_TO_BOOL = (v) => v === 1 || v === '1';
const SHOW_BOOL_TO_DB = (b) => (b ? '1' : '0');

class FeatureAppendantEntityService {
  // 将数据库行映射为前端对象
  mapRow(row) {
    return {
      pid: row.PID,
      categoryCode: row.CATEGORY,
      categoryName: row.CATEGORY_NAME || '',
      itemType: TYPE_DB_TO_APP(row.TYPE), // 'feature' | 'appendant'
      itemName: row.NAME,
      isVisible: SHOW_DB_TO_BOOL(row.IS_SHOW)
    };
  }

  // 基础: 获取全部数据（不强加排序，交给使用方按 rowid 设计）
  async getAll() {
    try {
      const rows = await database.executeSql(
        `SELECT PID, NAME, TYPE, CATEGORY, CATEGORY_NAME, IS_SHOW
         FROM feature_appendant_entity`,
        []
      );
      return { success: true, data: rows.map(r => this.mapRow(r)) };
    } catch (e) {
      console.error('获取特征/附属物失败:', e);
      return { success: false, message: '获取特征/附属物失败: ' + e.message };
    }
  }

  // 获取类别列表（从表内去重获取已有类别），顺序按插入顺序（最早出现的记录 rowid）
  async getCategories() {
    try {
      const rows = await database.executeSql(
        `SELECT CATEGORY, MAX(CATEGORY_NAME) as CATEGORY_NAME, MIN(rowid) as FIRST_ROWID
         FROM feature_appendant_entity
         GROUP BY CATEGORY
         ORDER BY FIRST_ROWID`,
        []
      );
      const data = rows.map(r => ({
        categoryCode: r.CATEGORY,
        categoryName: r.CATEGORY_NAME || r.CATEGORY
      }));
      return { success: true, data };
    } catch (e) {
      console.error('获取类别失败:', e);
      return { success: false, message: '获取类别失败: ' + e.message };
    }
  }

  // 结构化分组：[{ categoryCode, categoryName, groups: { feature:[], appendant:[] } }]
  async getGroupedStructure() {
    try {
      const [allRes, catsRes] = await Promise.all([this.getAll(), this.getCategories()]);
      if (!allRes.success) return allRes;
      if (!catsRes.success) return catsRes;

      const catIndex = new Map(catsRes.data.map(c => [c.categoryCode, c.categoryName]));
      const byCategory = new Map();

      for (const item of allRes.data) {
        const key = item.categoryCode;
        if (!byCategory.has(key)) {
          byCategory.set(key, {
            categoryCode: key,
            categoryName: catIndex.get(key) || item.categoryCode,
            groups: { feature: [], appendant: [] }
          });
        }
        const bucket = item.itemType === 'appendant' ? 'appendant' : 'feature';
        byCategory.get(key).groups[bucket].push(item);
      }

      // 不做任何代码层面的排序，保持 getAll/getCategories 的顺序
      const result = Array.from(byCategory.values());
      return { success: true, data: result };
    } catch (e) {
      console.error('获取分组结构失败:', e);
      return { success: false, message: '获取分组结构失败: ' + e.message };
    }
  }

  // section 结构：每个 section = (CATEGORY, TYPE) 组合，标题 "${CATEGORY_NAME}${TYPE}(${CATEGORY})"
  // 顺序：先按类别的最早出现顺序，再按 TYPE 在库中出现顺序（基于 rowid）
  async getSectionsStructure() {
    try {
      // 取出原始行，按 rowid 排序，借此保持插入顺序
      const rows = await database.executeSql(
        `SELECT rowid as RID, PID, NAME, TYPE, CATEGORY, CATEGORY_NAME, IS_SHOW
         FROM feature_appendant_entity
         ORDER BY RID`,
        []
      );

      // 构建 类别顺序 与 (类别,类型) 顺序
      const catFirstIndex = new Map();         // CATEGORY -> first RID
      const sectionMap = new Map();            // key = CATEGORY + '|' + TYPE
      const sectionFirstIndex = new Map();     // key -> first RID

      for (const r of rows) {
        if (!catFirstIndex.has(r.CATEGORY)) {
          catFirstIndex.set(r.CATEGORY, r.RID);
        }
        const key = `${r.CATEGORY}|${r.TYPE}`;
        if (!sectionMap.has(key)) {
          sectionMap.set(key, {
            sectionKey: key,
            categoryCode: r.CATEGORY,
            categoryName: r.CATEGORY_NAME || r.CATEGORY,
            typeLabel: r.TYPE, // '特征' | '附属物'
            items: []
          });
          sectionFirstIndex.set(key, r.RID);
        }
        // 追加条目（rows 已按 RID 升序）
        sectionMap.get(key).items.push({
          pid: r.pid,
          categoryCode: r.CATEGORY,
          categoryName: r.CATEGORY_NAME || r.CATEGORY,
          itemType: TYPE_DB_TO_APP(r.TYPE),
          itemName: r.NAME,
          isVisible: SHOW_DB_TO_BOOL(r.IS_SHOW)
        });
      }

      // 对 section 列表排序：先按类别 first RID，再按 section first RID
      const sections = Array.from(sectionMap.values());
      sections.sort((a, b) => {
        const ca = catFirstIndex.get(a.categoryCode) || 0;
        const cb = catFirstIndex.get(b.categoryCode) || 0;
        if (ca !== cb) return ca - cb;
        const sa = sectionFirstIndex.get(a.sectionKey) || 0;
        const sb = sectionFirstIndex.get(b.sectionKey) || 0;
        return sa - sb;
      });

      return { success: true, data: sections };
    } catch (e) {
      console.error('获取 section 结构失败:', e);
      return { success: false, message: '获取 section 结构失败: ' + e.message };
    }
  }

  // 切换显示
  async setVisibility(pid, visible) {
    try {
      await database.executeSql(
        `UPDATE feature_appendant_entity SET IS_SHOW = ? WHERE pid = ?`,
        [SHOW_BOOL_TO_DB(visible), pid]
      );
      return { success: true, message: '更新成功' };
    } catch (e) {
      console.error('更新可见性失败:', e);
      return { success: false, message: '更新可见性失败: ' + e.message };
    }
  }

  // 新增一条记录
  async addItem({ categoryCode, categoryName, itemType, itemName, isVisible = true }) {
    try {
      if (!categoryCode || !itemType || !itemName) {
        return { success: false, message: '参数不完整' };
      }
      if (itemType !== 'feature' && itemType !== 'appendant') {
        return { success: false, message: '类型无效' };
      }

      // 去重：同类别、同类型、同名称不重复
      const exists = await database.executeSql(
        `SELECT pid FROM feature_appendant_entity
         WHERE CATEGORY = ? AND TYPE = ? AND NAME = ?`,
        [categoryCode, TYPE_APP_TO_DB(itemType), itemName]
      );
      if (exists.length > 0) {
        return { success: false, message: '该项已存在' };
      }

      const pid = this.generatePID();
      await database.executeSql(
        `INSERT INTO feature_appendant_entity
         (pid, NAME, TYPE, CATEGORY, CATEGORY_NAME, IS_SHOW)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pid, itemName, TYPE_APP_TO_DB(itemType), categoryCode, categoryName || null, SHOW_BOOL_TO_DB(isVisible)]
      );
      return { success: true, pid, message: '新增成功' };
    } catch (e) {
      console.error('新增失败:', e);
      return { success: false, message: '新增失败: ' + e.message };
    }
  }

  // 删除
  async deleteItem(pid) {
    try {
      await database.executeSql(
        `DELETE FROM feature_appendant_entity WHERE pid = ?`,
        [pid]
      );
      return { success: true, message: '删除成功' };
    } catch (e) {
      console.error('删除失败:', e);
      return { success: false, message: '删除失败: ' + e.message };
    }
  }

  // 更新
  async updateItem(pid, { categoryCode, categoryName, itemType, itemName, isVisible }) {
    try {
      const fields = [];
      const values = [];

      if (categoryCode !== undefined) { fields.push('CATEGORY = ?'); values.push(categoryCode); }
      if (categoryName !== undefined) { fields.push('CATEGORY_NAME = ?'); values.push(categoryName); }
      if (itemType !== undefined) { fields.push('TYPE = ?'); values.push(TYPE_APP_TO_DB(itemType)); }
      if (itemName !== undefined) { fields.push('NAME = ?'); values.push(itemName); }
      if (isVisible !== undefined) { fields.push('IS_SHOW = ?'); values.push(SHOW_BOOL_TO_DB(isVisible)); }

      if (fields.length === 0) return { success: false, message: '无可更新字段' };

      values.push(pid);
      await database.executeSql(
        `UPDATE feature_appendant_entity SET ${fields.join(', ')} WHERE pid = ?`,
        values
      );
      return { success: true, message: '更新成功' };
    } catch (e) {
      console.error('更新失败:', e);
      return { success: false, message: '更新失败: ' + e.message };
    }
  }

  generatePID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export default new FeatureAppendantEntityService();