<template>
	<view class="pipe-type-container">
		<view class="header">
			<text class="title">管类设置</text>
			<button class="add-btn" @click="showAddDialog">+ 新增</button>
		</view>

		<!-- 管点类型 -->
		<view class="type-section">
			<text class="section-title">管点类型</text>
			<view class="type-list">
				<view class="type-item" v-for="(type, index) in pointTypes" :key="index">
					<view class="type-info">
						<text class="type-name">{{ type.name }}</text>
						<text class="type-desc">{{ type.description }}</text>
					</view>
					<view class="type-actions">
						<text class="edit-btn" @click="editType('point', index)">编辑</text>
						<text class="delete-btn" @click="deleteType('point', index)">删除</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 管线类型 -->
		<view class="type-section">
			<text class="section-title">管线类型</text>
			<view class="type-list">
				<view class="type-item" v-for="(type, index) in lineTypes" :key="index">
					<view class="type-info">
						<text class="type-name">{{ type.name }}</text>
						<text class="type-desc">{{ type.description }}</text>
					</view>
					<view class="type-actions">
						<text class="edit-btn" @click="editType('line', index)">编辑</text>
						<text class="delete-btn" @click="deleteType('line', index)">删除</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加/编辑弹窗 -->
		<uni-popup ref="typePopup" type="center">
			<view class="popup-content">
				<text class="popup-title">{{ editingType ? '编辑' : '新增' }}{{ currentCategory === 'point' ? '管点' : '管线'
				}}类型</text>

				<view class="form-item">
					<text class="form-label">类型名称</text>
					<input class="form-input" v-model="formData.name" placeholder="请输入类型名称" />
				</view>

				<view class="form-item">
					<text class="form-label">描述</text>
					<textarea class="form-textarea" v-model="formData.description" placeholder="请输入描述信息" />
				</view>

				<view class="popup-actions">
					<button class="btn-cancel" @click="closePopup">取消</button>
					<button class="btn-confirm" @click="saveType">保存</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pointTypes: [
				{ name: '检查井', description: '用于检查和维护的井盖' },
				{ name: '阀门井', description: '控制管道流量的阀门井' },
				{ name: '消火栓', description: '消防用水取水点' },
				{ name: '水表井', description: '计量用水的水表井' }
			],
			lineTypes: [
				{ name: '主管', description: '主要输送管道' },
				{ name: '支管', description: '分支输送管道' },
				{ name: '接户管', description: '连接用户的管道' }
			],
			currentCategory: 'point',
			editingType: null,
			editingIndex: -1,
			formData: {
				name: '',
				description: ''
			}
		}
	},
	onLoad() {
		this.loadTypes()
	},
	methods: {
		loadTypes() {
			const savedPointTypes = uni.getStorageSync('pointTypes')
			const savedLineTypes = uni.getStorageSync('lineTypes')

			if (savedPointTypes) {
				this.pointTypes = savedPointTypes
			}
			if (savedLineTypes) {
				this.lineTypes = savedLineTypes
			}
		},

		saveTypes() {
			uni.setStorageSync('pointTypes', this.pointTypes)
			uni.setStorageSync('lineTypes', this.lineTypes)
		},

		showAddDialog() {
			uni.showActionSheet({
				itemList: ['管点类型', '管线类型'],
				success: (res) => {
					this.currentCategory = res.tapIndex === 0 ? 'point' : 'line'
					this.editingType = null
					this.editingIndex = -1
					this.formData = { name: '', description: '' }
					this.$refs.typePopup.open()
				}
			})
		},
		// 编辑指定分类（点或线）中的类型数据
		editType(category, index) {
			this.currentCategory = category
			this.editingIndex = index

			const types = category === 'point' ? this.pointTypes : this.lineTypes
			this.editingType = types[index]
			this.formData = { ...this.editingType }

			this.$nextTick(() => {
				if (this.$refs.typePopup && this.$refs.typePopup.open) {
					this.$refs.typePopup.open()
				} else {
					console.error('Popup reference not found or open method not available')
				}
			})
		},

		deleteType(category, index) {
			const typeName = category === 'point' ? this.pointTypes[index].name : this.lineTypes[index].name

			uni.showModal({
				title: '确认删除',
				content: `确定要删除类型"${typeName}"吗？`,
				success: (res) => {
					if (res.confirm) {
						if (category === 'point') {
							this.pointTypes.splice(index, 1)
						} else {
							this.lineTypes.splice(index, 1)
						}

						this.saveTypes()
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
					}
				}
			})
		},

		saveType() {
			if (!this.formData.name.trim()) {
				uni.showToast({
					title: '请输入类型名称',
					icon: 'none'
				})
				return
			}

			const types = this.currentCategory === 'point' ? this.pointTypes : this.lineTypes

			if (this.editingType) {
				// 编辑模式
				types[this.editingIndex] = { ...this.formData }
			} else {
				// 新增模式
				types.push({ ...this.formData })
			}

			this.saveTypes()
			this.closePopup()

			uni.showToast({
				title: this.editingType ? '修改成功' : '添加成功',
				icon: 'success'
			})
		},
		// 关闭弹窗并重置表单数据
		closePopup() {
			this.$refs.typePopup.close()
			this.formData = { name: '', description: '' }
			this.editingType = null
			this.editingIndex = -1
		}
	}
}
</script>

<style lang="scss" scoped>
.pipe-type-container {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.add-btn {
		background: #007AFF;
		color: white;
		border: none;
		border-radius: 25rpx;
		// padding: 10rpx 20rpx;
		font-size: 28rpx;
	}
}

.type-section {
	margin-bottom: 40rpx;

	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.type-list {
		background: white;
		border-radius: 15rpx;
		overflow: hidden;

		.type-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.type-info {
				flex: 1;

				.type-name {
					display: block;
					font-size: 30rpx;
					color: #333;
					margin-bottom: 8rpx;
				}

				.type-desc {
					font-size: 24rpx;
					color: #999;
				}
			}

			.type-actions {
				display: flex;
				gap: 20rpx;

				.edit-btn,
				.delete-btn {
					padding: 10rpx 20rpx;
					border-radius: 15rpx;
					font-size: 24rpx;
				}

				.edit-btn {
					background: #f0f0f0;
					color: #666;
				}

				.delete-btn {
					background: #ffe6e6;
					color: #ff4444;
				}
			}
		}
	}
}

.popup-content {
	background: white;
	border-radius: 20rpx;
	padding: 40rpx;
	width: 600rpx;

	.popup-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.form-item {
		margin-bottom: 30rpx;

		.form-label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 15rpx;
		}

		.form-input,
		.form-textarea {
			width: 100%;
			border: 2rpx solid #e5e5e5;
			border-radius: 10rpx;
			padding: 20rpx;
			font-size: 28rpx;
		}

		.form-textarea {
			height: 120rpx;
			resize: none;
		}
	}

	.popup-actions {
		display: flex;
		gap: 20rpx;
		margin-top: 40rpx;

		.btn-cancel,
		.btn-confirm {
			flex: 1;
			height: 70rpx;
			border-radius: 35rpx;
			font-size: 28rpx;
			border: none;
		}

		.btn-cancel {
			background: #f0f0f0;
			color: #666;
		}

		.btn-confirm {
			background: #007AFF;
			color: white;
		}
	}
}
</style>