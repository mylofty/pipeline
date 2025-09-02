<template>
	<view class="export-container">
		<view class="header">
			<text class="title">数据导出</text>
			<text class="subtitle">将采集数据导出为Excel文件</text>
		</view>
		
		<!-- 导出选项 -->
		<view class="export-options">
			<text class="options-title">导出内容</text>
			<checkbox-group @change="exportTypeChange">
				<label class="option-item">
					<checkbox value="comprehensive" :checked="exportTypes.includes('comprehensive')" />
					<view class="option-content">
						<text class="option-name">综合表</text>
						<text class="option-desc">包含管线与管点信息的综合数据表</text>
					</view>
				</label>
				<label class="option-item">
					<checkbox value="points" :checked="exportTypes.includes('points')" />
					<view class="option-content">
						<text class="option-name">管点表</text>
						<text class="option-desc">仅包含管点数据的单独表格</text>
					</view>
				</label>
				<label class="option-item">
					<checkbox value="lines" :checked="exportTypes.includes('lines')" />
					<view class="option-content">
						<text class="option-name">管线表</text>
						<text class="option-desc">仅包含管线数据的单独表格</text>
					</view>
				</label>
			</checkbox-group>
		</view>
		
		<!-- 导出设置 -->
		<view class="export-settings">
			<text class="settings-title">导出设置</text>
			
			<view class="setting-item">
				<text class="setting-label">文件名前缀</text>
				<input class="setting-input" v-model="exportConfig.filePrefix" placeholder="默认使用项目名称" />
			</view>
			
			<view class="setting-item">
				<text class="setting-label">导出路径</text>
				<view class="path-selector" @click="selectPath">
					<text class="path-text">{{ exportConfig.exportPath || '/pipeline/excel/' }}</text>
					<text class="path-icon">📁</text>
				</view>
			</view>
			
			<view class="setting-item">
				<text class="setting-label">包含附件</text>
				<switch :checked="exportConfig.includeAttachments" @change="attachmentChange" />
			</view>
		</view>
		
		<!-- 数据预览 -->
		<view class="data-preview">
			<text class="preview-title">数据预览</text>
			<view class="preview-stats">
				<view class="stat-item">
					<text class="stat-number">{{ statistics.pointCount }}</text>
					<text class="stat-label">管点数量</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{ statistics.lineCount }}</text>
					<text class="stat-label">管线数量</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{ statistics.attachmentCount }}</text>
					<text class="stat-label">附件数量</text>
				</view>
			</view>
		</view>
		
		<!-- 导出按钮 -->
		<view class="export-actions">
			<button class="btn-preview" @click="previewData">预览数据</button>
			<button class="btn-export" @click="exportData" :disabled="exportTypes.length === 0">开始导出</button>
		</view>
		
		<!-- 导出进度 -->
		<view class="export-progress" v-if="exporting">
			<text class="progress-title">导出进度</text>
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: exportProgress + '%' }"></view>
			</view>
			<text class="progress-text">{{ exportProgress }}% ({{ currentStep }})</text>
		</view>
		
		<!-- 导出历史 -->
		<view class="export-history" v-if="exportHistory.length > 0">
			<text class="history-title">导出历史</text>
			<scroll-view scroll-y class="history-list">
				<view class="history-item" v-for="item in exportHistory" :key="item.id">
					<view class="history-info">
						<text class="history-name">{{ item.fileName }}</text>
						<text class="history-time">{{ formatTime(item.exportTime) }}</text>
					</view>
					<view class="history-actions">
						<text class="action-btn" @click="openFile(item)">打开</text>
						<text class="action-btn delete" @click="deleteExport(item)">删除</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			exportTypes: ['comprehensive'],
			exportConfig: {
				filePrefix: '',
				exportPath: '/pipeline/excel/',
				includeAttachments: true
			},
			statistics: {
				pointCount: 0,
				lineCount: 0,
				attachmentCount: 0
			},
			exporting: false,
			exportProgress: 0,
			currentStep: '',
			exportHistory: []
		}
	},
	onLoad() {
		this.loadData()
		this.loadExportHistory()
	},
	methods: {
		loadData() {
			const project = uni.getStorageSync('currentProject')
			if (project) {
				this.exportConfig.filePrefix = project.name
				this.statistics = {
					pointCount: (project.pipePoints || []).length,
					lineCount: (project.pipeLines || []).length,
					attachmentCount: this.calculateAttachmentCount(project.pipePoints || [])
				}
			}
		},
		
		calculateAttachmentCount(points) {
			return points.reduce((count, point) => {
				return count + (point.attachments ? point.attachments.length : 0)
			}, 0)
		},
		
		loadExportHistory() {
			this.exportHistory = uni.getStorageSync('exportHistory') || []
		},
		
		saveExportHistory() {
			uni.setStorageSync('exportHistory', this.exportHistory)
		},
		
		exportTypeChange(e) {
			this.exportTypes = e.detail.value
		},
		
		attachmentChange(e) {
			this.exportConfig.includeAttachments = e.detail.value
		},
		
		selectPath() {
			// 模拟路径选择
			uni.showActionSheet({
				itemList: ['/pipeline/excel/', '/Documents/', '/Downloads/'],
				success: (res) => {
					const paths = ['/pipeline/excel/', '/Documents/', '/Downloads/']
					this.exportConfig.exportPath = paths[res.tapIndex]
				}
			})
		},
		
		previewData() {
			uni.navigateTo({
				url: '/pages/data/preview?types=' + this.exportTypes.join(',')
			})
		},
		
		async exportData() {
			if (this.exportTypes.length === 0) {
				uni.showToast({
					title: '请选择导出内容',
					icon: 'none'
				})
				return
			}
			
			this.exporting = true
			this.exportProgress = 0
			
			try {
				// 模拟导出过程
				await this.simulateExport()
				
				// 生成导出记录
				const exportRecord = {
					id: Date.now().toString(),
					fileName: this.generateFileName(),
					exportTime: Date.now(),
					types: [...this.exportTypes],
					path: this.exportConfig.exportPath,
					size: this.calculateExportSize()
				}
				
				this.exportHistory.unshift(exportRecord)
				this.saveExportHistory()
				
				uni.showModal({
					title: '导出成功',
					content: `文件已保存到 ${this.exportConfig.exportPath}${exportRecord.fileName}`,
					showCancel: false
				})
				
			} catch (error) {
				uni.showToast({
					title: '导出失败',
					icon: 'none'
				})
			} finally {
				this.exporting = false
				this.exportProgress = 0
				this.currentStep = ''
			}
		},
		
		async simulateExport() {
			const steps = [
				'准备数据...',
				'生成管点表...',
				'生成管线表...',
				'生成综合表...',
				'处理附件...',
				'保存文件...'
			]
			
			for (let i = 0; i < steps.length; i++) {
				this.currentStep = steps[i]
				this.exportProgress = Math.round((i + 1) / steps.length * 100)
				await new Promise(resolve => setTimeout(resolve, 800))
			}
		},
		
		generateFileName() {
			const prefix = this.exportConfig.filePrefix || 'export'
			const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
			return `${prefix}_${timestamp}.xlsx`
		},
		
		calculateExportSize() {
			// 模拟计算文件大小
			const baseSize = 1024 * 50 // 50KB基础大小
			const pointSize = this.statistics.pointCount * 200 // 每个点200字节
			const lineSize = this.statistics.lineCount * 150 // 每条线150字节
			return baseSize + pointSize + lineSize
		},
		
		formatTime(timestamp) {
			const date = new Date(timestamp)
			return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
		},
		
		openFile(item) {
			// #ifdef APP-PLUS
			plus.runtime.openFile(item.path + item.fileName)
			// #endif
			
			// #ifndef APP-PLUS
			uni.showToast({
				title: '请在真机环境中打开文件',
				icon: 'none'
			})
			// #endif
		},
		
		deleteExport(item) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除导出文件"${item.fileName}"吗？`,
				success: (res) => {
					if (res.confirm) {
						const index = this.exportHistory.findIndex(h => h.id === item.id)
						if (index >= 0) {
							this.exportHistory.splice(index, 1)
							this.saveExportHistory()
							
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						}
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.export-container {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.header {
	text-align: center;
	margin-bottom: 40rpx;
	
	.title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #666;
	}
}

.export-options, .export-settings, .data-preview, .export-history {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.options-title, .settings-title, .preview-title, .history-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 25rpx;
	}
}

.option-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 25rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	checkbox {
		margin-right: 20rpx;
		margin-top: 5rpx;
	}
	
	.option-content {
		flex: 1;
		
		.option-name {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 8rpx;
		}
		
		.option-desc {
			font-size: 24rpx;
			color: #999;
			line-height: 1.4;
		}
	}
}

.setting-item {
	display: flex;
	align-items: center;
	margin-bottom: 25rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.setting-label {
		width: 200rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.setting-input {
		flex: 1;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
		padding: 15rpx 20rpx;
		font-size: 28rpx;
	}
	
	.path-selector {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
		padding: 15rpx 20rpx;
		
		.path-text {
			font-size: 28rpx;
			color: #333;
		}
		
		.path-icon {
			font-size: 32rpx;
		}
	}
}

.preview-stats {
	display: flex;
	justify-content: space-around;
	
	.stat-item {
		text-align: center;
		
		.stat-number {
			display: block;
			font-size: 48rpx;
			font-weight: bold;
			color: #007AFF;
			margin-bottom: 10rpx;
		}
		
		.stat-label {
			font-size: 24rpx;
			color: #666;
		}
	}
}

.export-actions {
	display: flex;
	gap: 20rpx;
	margin-bottom: 30rpx;
	
	.btn-preview, .btn-export {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		border: none;
	}
	
	.btn-preview {
		background: #f0f0f0;
		color: #666;
	}
	
	.btn-export {
		background: #007AFF;
		color: white;
		
		&[disabled] {
			background: #ccc;
		}
	}
}

.export-progress {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.progress-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.progress-bar {
		height: 12rpx;
		background: #f0f0f0;
		border-radius: 6rpx;
		overflow: hidden;
		margin-bottom: 15rpx;
		
		.progress-fill {
			height: 100%;
			background: linear-gradient(90deg, #007AFF, #00BFFF);
			border-radius: 6rpx;
			transition: width 0.3s ease;
		}
	}
	
	.progress-text {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}
}

.history-list {
	max-height: 400rpx;
	
	.history-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.history-info {
			flex: 1;
			
			.history-name {
				display: block;
				font-size: 28rpx;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.history-time {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.history-actions {
			display: flex;
			gap: 15rpx;
			
			.action-btn {
				padding: 8rpx 15rpx;
				border-radius: 12rpx;
				font-size: 24rpx;
				background: #f0f0f0;
				color: #666;
				
				&.delete {
					background: #ffe6e6;
					color: #ff4444;
				}
			}
		}
	}
}
</style>