<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <uni-icons type="left" size="20" color="#fff"></uni-icons>
      </view>
      <view class="nav-title">特征/附属物设置</view>
      <view class="nav-right" @click="openAddDialog">
        <uni-icons type="plus" size="20" color="#fff"></uni-icons>
      </view>
    </view>

    <!-- 内容区域：每个一级项 = 类别+类型 -->
    <view class="content">
      <view class="category-list">
        <view v-for="(sec, idx) in sections" :key="sec.sectionKey" class="category-section">
          <!-- 一级标题：排水特征(PS) -->
          <view class="main-category" @click="toggleSection(idx)">
            <view class="category-left">
              <view class="category-icon">
                <uni-icons type="folder" size="20" color="#666"></uni-icons>
              </view>
              <view class="category-info">
                <text class="category-name">{{ sec.categoryName }}{{ sec.typeLabel }}({{ sec.categoryCode }})</text>
                <text class="category-code">{{ sec.items.length }}项</text>
              </view>
            </view>
            <view class="category-right">
              <uni-icons :type="sec.expanded ? 'up' : 'down'" size="16" color="#999"></uni-icons>
            </view>
          </view>

          <!-- 明细 -->
          <view v-if="sec.expanded" class="sub-category-list">
            <view v-if="sec.items.length">
              <view v-for="item in sec.items" :key="item.pid" class="sub-row">
                <label class="row-left" @click.stop="onToggleVisible(item)">
                  <checkbox :checked="item.isVisible" @click.stop="()=>onToggleVisible(item)" />
                  <text class="row-text">{{ item.itemName }}</text>
                </label>
                <view class="row-actions">
                  <view class="action-btn delete" @click="onDelete(item)">
                    <uni-icons type="trash" size="16" color="#FF3B30"></uni-icons>
                  </view>
                </view>
              </view>
            </view>
            <view v-else class="empty-sub">
              <uni-icons type="info" size="16" color="#ccc"></uni-icons>
              <text class="empty-text">暂无数据</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="!sections.length" class="empty-state">
        <uni-icons type="folder" size="60" color="#ddd"></uni-icons>
        <text class="empty-title">暂无数据</text>
        <text class="empty-desc">点击右上角新增</text>
      </view>
    </view>

    <!-- 新增弹窗 -->
    <uni-popup ref="addDialog" type="center" :mask-click="false">
      <view class="dialog">
        <view class="dialog-header">
          <text class="dialog-title">新增</text>
          <view class="close-btn" @click="closeDialog">
            <uni-icons type="close" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <view class="dialog-body">
          <!-- 类别 -->
          <view class="form-group">
            <text class="label">类别</text>
            <picker 
              :value="selectedCategoryIndex" 
              :range="categoryOptions" 
              range-key="text"
              @change="onCategoryChange"
            >
              <view class="picker-wrapper">
                <text class="picker-text">{{ form.categoryCode ? getCategoryName(form.categoryCode) : '请选择类别' }}</text>
                <uni-icons type="down" size="14" color="#999"></uni-icons>
              </view>
            </picker>
          </view>

          <!-- 类型：特征/附属物 -->
          <view class="form-group">
            <text class="label">类型</text>
            <view class="type-selector">
              <view :class="['type-chip', form.itemType==='feature' ? 'active' : '']" @click="form.itemType='feature'">特征</view>
              <view :class="['type-chip', form.itemType==='appendant' ? 'active' : '']" @click="form.itemType='appendant'">附属物</view>
            </view>
          </view>

          <!-- 名称 -->
          <view class="form-group">
            <text class="label">名称</text>
            <input v-model="form.itemName" class="input" placeholder="请输入名称" maxlength="50" />
          </view>

          <!-- 是否展示 -->
          <view class="form-group">
            <text class="label">是否展示</text>
            <switch :checked="form.isVisible" @change="e=>form.isVisible=e.detail.value" />
          </view>
        </view>

        <view class="dialog-footer">
          <button class="btn cancel" @click="closeDialog">取消</button>
          <button class="btn confirm" @click="onSubmit">新增</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import featureService from '@/services/feature_appendantEntityService.js';

export default {
  name: 'FeatureAppendantSettings',
  data() {
    return {
      sections: [],          // [{sectionKey, categoryCode, categoryName, typeLabel, items:[], expanded:false}]
      categories: [],        // [{categoryCode, categoryName}]
      selectedCategoryIndex: 0,
      form: {
        categoryCode: '',
        itemType: 'feature',
        itemName: '',
        isVisible: true
      }
    }
  },
  computed: {
    categoryOptions() {
      return this.categories.map(c => ({ value: c.categoryCode, text: c.categoryName || c.categoryCode }));
    }
  },
  async onLoad() {
    await this.loadData();
  },
  methods: {
    goBack() { uni.navigateBack(); },
    async loadData() {
      uni.showLoading({ title: '加载中...' });
      try {
        const [s, c] = await Promise.all([
          featureService.getSectionsStructure(),
          featureService.getCategories()
        ]);
        if (s.success) {
          this.sections = (s.data || []).map(x => ({ ...x, expanded: false }));
        } else {
          uni.showToast({ title: s.message || '加载失败', icon: 'error' });
        }
        if (c.success) {
          this.categories = c.data || [];
        }
      } catch (e) {
        console.error(e);
        uni.showToast({ title: '加载失败', icon: 'error' });
      } finally {
        uni.hideLoading();
      }
    },
    toggleSection(index) {
      this.$set(this.sections[index], 'expanded', !this.sections[index].expanded);
    },
    getCategoryName(code) {
      const found = this.categories.find(c => c.categoryCode === code);
      return found ? (found.categoryName || found.categoryCode) : '';
    },
    openAddDialog() {
      this.resetForm();
      this.$refs.addDialog.open();
    },
    closeDialog() {
      this.$refs.addDialog.close();
      this.resetForm();
    },
    resetForm() {
      this.form = {
        categoryCode: this.categories[0]?.categoryCode || '',
        itemType: 'feature',
        itemName: '',
        isVisible: true
      };
      this.selectedCategoryIndex = 0;
    },
    onCategoryChange(e) {
      this.selectedCategoryIndex = e.detail.value;
      this.form.categoryCode = this.categoryOptions[this.selectedCategoryIndex].value;
    },
    async onToggleVisible(item) {
      if (!item || !item.pid) { 
        console.warn('[FeatureVisibility] 缺少PID，无法更新', item);
        uni.showToast({ title: '数据异常: 缺少PID', icon: 'error' }); 
        return; 
      }
      const prev = item.isVisible;
      const next = !prev;
      console.log('[FeatureVisibility] 准备更新:', { pid: item.pid, name: item.itemName, prev, next });
      item.isVisible = next;
      const res = await featureService.setVisibility(item.pid, item.isVisible);
      if (!res.success) {
        console.error('[FeatureVisibility] DB更新失败，回滚:', res);
        item.isVisible = prev;
        uni.showToast({ title: res.message || '更新失败', icon: 'error' });
      } else {
        console.log('[FeatureVisibility] DB更新成功:', { pid: item.pid, isVisible: item.isVisible });
      }
    },
    async onDelete(item) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除"${item.itemName}"吗？`,
        success: async (r) => {
          if (!r.confirm) return;
          uni.showLoading({ title: '删除中...' });
          try {
            const res = await featureService.deleteItem(item.pid);
            if (res.success) {
              uni.showToast({ title: '删除成功', icon: 'success' });
              await this.loadData();
            } else {
              uni.showToast({ title: res.message || '删除失败', icon: 'error' });
            }
          } finally {
            uni.hideLoading();
          }
        }
      });
    },
    async onSubmit() {
      if (!this.form.categoryCode) {
        uni.showToast({ title: '请选择类别', icon: 'error' }); return;
      }
      if (!this.form.itemName.trim()) {
        uni.showToast({ title: '请输入名称', icon: 'error' }); return;
      }
      uni.showLoading({ title: '添加中...' });
      try {
        const categoryName = this.getCategoryName(this.form.categoryCode);
        const res = await featureService.addItem({
          categoryCode: this.form.categoryCode,
          categoryName,
          itemType: this.form.itemType,
          itemName: this.form.itemName.trim(),
          isVisible: this.form.isVisible
        });
        if (res.success) {
          uni.showToast({ title: '添加成功', icon: 'success' });
          this.closeDialog();
          await this.loadData();
        } else {
          uni.showToast({ title: res.message || '添加失败', icon: 'error' });
        }
      } finally {
        uni.hideLoading();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f9fa;
  min-height: 100vh;
}
/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  .nav-left, .nav-right {
    width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; border-radius: 50%;
    &:active { background-color: rgba(255,255,255,0.1); }
  }
  .nav-title { font-size: 36rpx; font-weight: 600; }
}
.content { padding: 24rpx; }

/* 分类卡片 */
.category-list {
  .category-section {
    margin-bottom: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
  }
}
.main-category {
  display: flex; align-items: center; justify-content: space-between;
  padding: 32rpx; background: #fff; transition: background-color .3s;
  &:active { background-color: #f8f9fa; }
  .category-left {
    display: flex; align-items: center; flex: 1;
    .category-icon { width: 48rpx; height: 48rpx; display:flex; align-items:center; justify-content:center; background:#f0f2f5; border-radius:12rpx; margin-right:24rpx;}
    .category-info {
      .category-name { display:block; font-size: 32rpx; font-weight:600; color:#1a1a1a; margin-bottom: 8rpx; }
      .category-code { font-size: 24rpx; color:#8e8e93; }
    }
  }
  .category-right { display:flex; align-items:center; }
}

.sub-category-list {
  border-top: 1rpx solid #f0f0f0; background:#fafafa; padding-bottom: 8rpx;
  .sub-row {
    display:flex; align-items:center; justify-content:space-between;
    padding: 20rpx 32rpx; border-top:1rpx solid #f0f0f0; background:#fff;
    .row-left { display:flex; align-items:center;
      checkbox { margin-right: 16rpx; }
      .row-text { font-size: 28rpx; color:#1a1a1a; }
    }
    .row-actions {
      display:flex; gap: 16rpx;
      .action-btn { width: 56rpx; height:56rpx; display:flex; align-items:center; justify-content:center; border-radius:12rpx;
        &.delete { background: rgba(255,59,48,.1); }
      }
    }
  }
  .empty-sub { display:flex; align-items:center; justify-content:center; padding: 40rpx 32rpx;
    .empty-text { font-size: 26rpx; color: #8e8e93; margin-left: 12rpx; }
  }
}

/* 空状态 */
.empty-state {
  display:flex; flex-direction:column; align-items:center; justify-content:center; padding:120rpx 32rpx;
  .empty-title { font-size:32rpx; color:#8e8e93; margin:24rpx 0 12rpx; }
  .empty-desc { font-size:26rpx; color:#c7c7cc; }
}

/* 弹窗 */
.dialog {
  width: 640rpx; background:#fff; border-radius:24rpx; overflow:hidden;
  .dialog-header { display:flex; align-items:center; justify-content:space-between; padding:32rpx; border-bottom:1rpx solid #f0f0f0;
    .dialog-title { font-size:34rpx; font-weight:600; color:#1a1a1a; }
    .close-btn { width:48rpx; height:48rpx; display:flex; align-items:center; justify-content:center; border-radius:50%;
      &:active { background:#f0f0f0; }
    }
  }
  .dialog-body { padding: 32rpx;
    .form-group { margin-bottom: 28rpx;
      .label { display:block; font-size:28rpx; color:#1a1a1a; margin-bottom: 12rpx; font-weight:500; }
      .picker-wrapper { display:flex; align-items:center; justify-content:space-between; height:88rpx; padding:0 24rpx; border:2rpx solid #e5e5ea; border-radius:12rpx; background:#fff;
        .picker-text { font-size:28rpx; color:#1a1a1a; }
      }
      .type-selector { display:flex; gap: 16rpx;
        .type-chip { padding: 14rpx 24rpx; border-radius: 999rpx; background:#f2f2f7; color:#666; font-size:26rpx;
          &.active { background:#e6e9ff; color:#4b5bff; }
        }
      }
      .input { width:100%; height:88rpx; padding:0 24rpx; border:2rpx solid #e5e5ea; border-radius:12rpx; font-size:28rpx; color:#1a1a1a; box-sizing:border-box; }
    }
  }
  .dialog-footer { display:flex; padding: 24rpx 32rpx 32rpx; gap:24rpx;
    .btn { flex:1; height:88rpx; border:none; border-radius:12rpx; font-size:30rpx; font-weight:500;
      &.cancel { background:#f2f2f7; color:#8e8e93; }
      &.confirm { background: linear-gradient(135deg,#667eea 0%, #764ba2 100%); color:#fff; }
    }
  }
}
</style>