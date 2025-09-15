<template>
  <div class="layer-selector">
    <div class="picker-display" @click.stop="handleToggleDropdown">
      <text class="picker-text">{{ displayText }}</text>
      <text class="arrow" :class="{ 'arrow-up': showDropdown }">▼</text>
    </div>
    <div class="dropdown" v-if="showDropdown" @click.stop>
      <div class="dropdown-item select-all-item" @click="handleToggleSelectAll">
        <text>{{ isAllSelected ? '全不选' : '全选' }}</text>
      </div>
      <div class="dropdown-item select-all-item" @click="handleToggleExpandAll">
        <text>{{ isAllExpanded ? '全部收起' : '全部展开' }}</text>
      </div>
      <div class="dropdown-divider"></div>
      <div v-for="(category, categoryIndex) in layerOptions" :key="categoryIndex" class="category-group">
        <div class="dropdown-item category-item">
          <div class="checkbox-wrapper">
            <text class="checkbox" :class="{
              checked: isCategorySelected(categoryIndex),
              'partially-checked': isCategorySelected(categoryIndex) && !isCategoryFullySelected(categoryIndex)
            }" @click="handleToggleCategory(categoryIndex)">{{
              isCategoryFullySelected(categoryIndex) ? '✓' : (isCategorySelected(categoryIndex) ? '◐' : '') }}</text>
            <text class="layer-name category-name" @click="handleToggleExpand(categoryIndex)">{{ category.name }}</text>
            <text class="expand-arrow" :class="{ expanded: category.expanded }"
              @click="handleToggleExpand(categoryIndex)">▼</text>
          </div>
        </div>
        <div v-if="category.expanded" class="subcategory-list">
          <div v-for="(child, childIndex) in category.children" :key="childIndex" class="dropdown-item subcategory-item"
            @click="handleSelectSubLayer(categoryIndex, childIndex)">
            <div class="checkbox-wrapper">
              <text class="checkbox" :class="{ checked: child.selected }">{{
                child.selected ? '✓' : '' }}</text>
              <text class="layer-name sublayer-name">{{ child.name }}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayerSelector',
  props: {
    layerOptions: {
      type: Array,
      default: () => []
    },
    showDropdown: {
      type: Boolean,
      default: false
    },
    isAllSelected: {
      type: Boolean,
      default: false
    },
    isAllExpanded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayText() {
      const selectedItems = []
      this.layerOptions.forEach(category => {
        category.children.forEach(child => {
          if (child.selected) {
            selectedItems.push(child.name)
          }
        })
      })

      if (selectedItems.length === 0) {
        return '请选择图层'
      } else if (selectedItems.length === 1) {
        return selectedItems[0]
      } else {
        return `已选择${selectedItems.length}个图层`
      }
    }
  },
  methods: {
    handleToggleDropdown() {
      this.$emit('toggle-dropdown')
    },
    handleToggleSelectAll() {
      this.$emit('toggle-select-all')
    },
    handleToggleExpandAll() {
      this.$emit('toggle-expand-all')
    },
    handleToggleCategory(categoryIndex) {
      this.$emit('toggle-category', categoryIndex)
    },
    handleSelectSubLayer(categoryIndex, childIndex) {
      this.$emit('select-sub-layer', categoryIndex, childIndex)
    },
    handleToggleExpand(categoryIndex) {
      this.$emit('toggle-expand', categoryIndex)
    },
    isCategorySelected(categoryIndex) {
      const category = this.layerOptions[categoryIndex]
      return category.children.some(child => child.selected)
    },
    isCategoryFullySelected(categoryIndex) {
      const category = this.layerOptions[categoryIndex]
      return category.children.every(child => child.selected)
    }
  }
}
</script>

<style scoped>
.layer-selector {
  position: relative;
  display: flex;
  flex-direction: column;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  min-width: 120px;
}

.picker-text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.arrow {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.arrow-up {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 415px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.select-all-item {
  font-weight: 500;
  color: #007AFF;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}

.category-group {
  border-bottom: 1px solid #f0f0f0;
}

.category-item {
  background-color: #f8f9fa;
  font-weight: 500;
}

.subcategory-item {
  padding-left: 24px;
  background-color: white;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background-color: white;
}

.checkbox.checked {
  background-color: #007AFF;
  border-color: #007AFF;
  color: white;
}

.checkbox.partially-checked {
  background-color: #007AFF;
  border-color: #007AFF;
  color: white;
}

.layer-name {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.category-name {
  font-weight: 500;
}

.sublayer-name {
  font-weight: normal;
}

.expand-arrow {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.expand-arrow.expanded {
  transform: rotate(180deg);
}
</style>