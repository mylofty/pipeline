<template>
	<view class="feature-container">
		<view class="header">
			<text class="title">特征/附属物设置</text>
			<button class="add-btn" @click="showAddDialog">+ 新增</button>
		</view>
		
		<!-- 特征设置 -->
		<view class="feature-section">
			<text class="section-title">管点特征</text>
			<view class="feature-list">
				<view class="feature-item" v-for="(feature, index) in pointFeatures" :key="index">
					<view class="feature-info">
						<text class="feature-name">{{ feature.name }}</text>
						<text class="feature-desc">{{ feature.description }}</text>
					</view>
					<view class="feature-actions">
						<text class="edit-btn" @click="editFeature('point', index)">编辑</text>
						<text class="delete-btn" @click="deleteFeature('point', index)">删除</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 附属物设置 -->
		<view class="feature-section">
			<text class="section-title">附属物</text>
			<view class="feature-list">
				<view class="feature-item" v-for="(attachment, index) in attachments" :key="index">
					<view class="feature-info">
						<text class="feature-name">{{ attachment.name }}</text>
						<text class="feature-desc">{{ attachment.description }}</text>
					</view>
					<view class="feature-actions">
						<text class="edit-btn" @click="editFeature('attachment', index)">编辑</text>
						<text class="delete-btn" @click="deleteFeature('attachment', index)">删除</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 添加/编辑弹窗 -->
		<uni-popup ref="featurePopup" type="center">
			<view class="popup-content">
				<text class="popup-title">{{ editingFeature ? '编辑' : '新增' }}{{ currentCategory === 'point' ? '特征' : '附属物' }}</text>
				
				<view class="form-item">
					<text class="form-label">名称</text>
					<input class="form-input" v-model="formData.name" placeholder="请输入名称" />
				</view>
				
				<view class="form-item">
					<text class="form-label">描述</text>
					<textarea class="form-textarea" v-model="formData.description" placeholder="请输入描述信息" />
				</view>
				
				<view class="form-item">
					<text class="form-label">图标</text>
					<view class="icon-selector" @click="selectIcon">
						<text class="icon-preview">{{ formData.icon || '📍' }}</text>
						<text class="icon-text">点击选择图标</text>
					</view>
				</view>
				
				<view class="popup-actions">
					<button class="btn-cancel" @click="closePopup">取消</button>
					<button class="btn-confirm" @click="saveFeature">保存</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pointFeatures: [
				{ name: '井盖破损', description: '井盖出现裂缝或破损', icon: '⚠️' },
				{ name: '积水严重', description: '井内积水过多', icon: '💧' },
				{ name: '异味明显', description: '有明显异味散发', icon: '💨' },
				{ name: '位置偏移', description: '实际位置与图纸不符', icon: '📍' }
			],
			attachments: [
				{ name: '井盖照片', description: '井盖整体照片', icon: '📷' },
				{ name: '内部照片', description: '井内部结构照片', icon: '🔍' },
				{ name: '周边环境', description: '周边环境照片', icon: '🌍' },
				{ name: '标识牌', description: '相关标识牌照片', icon: '🏷️' }
			],
			currentCategory: 'point',
			editingFeature: null,
			editingIndex: -1,
			formData: {
				name: '',
				description: '',
				icon: ''
			},
			availableIcons: ['📍', '⚠️', '💧', '💨', '📷', '🔍', '🌍', '🏷️', '🔧', '⚡', '🚰', '🔥', '📊', '✅', '❌', '❓']
		}
	},
	onLoad() {
		this.loadFeatures()
	},
	methods: {
		loadFeatures() {
			const savedPointFeatures = uni.getStorageSync('pointFeatures')
			const savedAttachments = uni.getStorageSync('attachments')
			
			if (savedPointFeatures) {
				this.pointFeatures = savedPointFeatures
			}
			if (savedAttachments) {
				this.attachments = savedAttachments
			}
		},
		
		saveFeatures() {
			uni.setStorageSync('pointFeatures', this.pointFeatures)
			uni.setStorageSync('attachments', this.attachments)
		},
		
		showAddDialog() {
			uni.showActionSheet({
				itemList: ['管点特征', '附属物'],
				success: (res) => {
					this.currentCategory = res.tapIndex === 0 ? 'point' : 'attachment'
					this.editingFeature = null
					this.editingIndex = -1
					this.formData = { name: '', description: '', icon: '' }
					this.$refs.featurePopup.open()
				}
			})
		},
		
		editFeature(category, index) {
			this.currentCategory = category
			this.editingIndex = index
			
			const features = category === 'point' ? this.pointFeatures : this.attachments
			this.editingFeature = features[index]
			this.formData = { ...this.editingFeature }
			
			this.$refs.featurePopup.open()
		},
		
		deleteFeature(category, index) {
			const features = category === 'point' ? this.pointFeatures : this.attachments
			const featureName = features[index].name
			
			uni.showModal({
				title: '确认删除',
				content: `确定要删除"${featureName}"吗？`,
				success: (res) => {
					if (res.confirm) {
						if (category === 'point') {
							this.pointFeatures.splice(index, 1)
						} else {
							this.attachments.splice(index, 1)
						}
						
						this.saveFeatures()
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
					}
				}
			})
		},
		
		selectIcon() {
			uni.showActionSheet({
				itemList: this.availableIcons,
				success: (res) => {
					this.formData.icon = this.availableIcons[res.tapIndex]
				}
			})
		},
		
		saveFeature() {
			if (!this.formData.name.trim()) {
				uni.showToast({
					title: '请输入名称',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.icon) {
				this.formData.icon = '📍'
			}
			
			const features = this.currentCategory === 'point' ? this.pointFeatures : this.attachments
			
			if (this.editingFeature) {
				// 编辑模式
				features[this.editingIndex] = { ...this.formData }
			} else {
				// 新增模式
				features.push({ ...this.formData })
			}
			
			this.saveFeatures()
			this.closePopup()
			
			uni.showToast({
				title: this.editingFeature ? '修改成功' : '添加成功',
				icon: 'success'
			})
		},
		
		closePopup() {
			this.$refs.featurePopup.close()
			this.formData = { name: '', description: '', icon: '' }
			this.editingFeature = null
			this.editingIndex = -1
		}
	}
}
</script>

<style lang="scss" scoped>
.feature-container {
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
		// padding: 15rpx 30rpx;
		font-size: 28rpx;
	}
}

.feature-section {
	margin-bottom: 40rpx;
	
	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.feature-list {
		background: white;
		border-radius: 15rpx;
		overflow: hidden;
		
		.feature-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.feature-info {
				flex: 1;
				
				.feature-name {
					display: block;
					font-size: 30rpx;
					color: #333;
					margin-bottom: 8rpx;
				}
				
				.feature-desc {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.feature-actions {
				display: flex;
				gap: 20rpx;
				
				.edit-btn, .delete-btn {
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
		
		.form-input, .form-textarea {
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
		
		.icon-selector {
			display: flex;
			align-items: center;
			border: 2rpx solid #e5e5e5;
			border-radius: 10rpx;
			padding: 20rpx;
			
			.icon-preview {
				font-size: 40rpx;
				margin-right: 20rpx;
			}
			
			.icon-text {
				font-size: 28rpx;
				color: #666;
			}
		}
	}
	
	.popup-actions {
		display: flex;
		gap: 20rpx;
		margin-top: 40rpx;
		
		.btn-cancel, .btn-confirm {
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