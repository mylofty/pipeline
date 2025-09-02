<template>
	<view class="import-container">
		<view class="header">
			<text class="title">数据导入</text>
			<text class="subtitle">从Excel文件导入管点管线数据</text>
		</view>
		
		<!-- 导入选项 -->
		<view class="import-options">
			<text class="options-title">导入类型</text>
			<radio-group @change="importTypeChange">
				<label class="option-item">
					<radio value="comprehensive" :checked="importType === 'comprehensive'" />
					<view class="option-content">
						<text class="option-name">综合表导入</text>
						<text class="option-desc">包含管线与管点信息的综合数据表</text>
					</view>
				</label>
				<label class="option-item">
					<radio value="separate" :checked="importType === 'separate'" />
					<view class="option-content">
						<text class="option-name">分表导入</text>
						<text class="option-desc">分别导入管点表和管线表</text>
					</view>
				</label>
			</radio-group>
		</view>
		
		<!-- 文件选择 -->
		<view class="file-selection">
			<text class="selection-title">选择文件</text>
			<view class="file-item" v-if="importType === 'comprehensive'">
				<text class="file-label">综合表文件</text>
				<view class="file-selector" @click="selectFile('comprehensive')">
					<text class="file-name">{{ selectedFiles.comprehensive || '点击选择Excel文件' }}</text>
					<text class="file-icon">📁</text>
				</view>
			</view>
			<view v-else>
				<view class="file-item">
					<text class="file-label">管点表文件</text>
					<view class="file-selector" @click="selectFile('points')">
						<text class="file-name">{{ selectedFiles.points || '点击选择管点Excel文件' }}</text>
						<text class="file-icon">📁</text>
					</view>
				</view>
				<view class="file-item">
					<text class="file-label">管线表文件</text>
					<view class="file-selector" @click="selectFile('lines')">
						<text class="file-name">{{ selectedFiles.lines || '点击选择管线Excel文件' }}</text>
						<text class="file-icon">📁</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 导入设置 -->
		<view class="import-settings">
			<text class="settings-title">导入设置</text>
			
			<view class="setting-item">
				<text class="setting-label">数据处理方式</text>
				<picker @change="processModeChange" :value="processModeIndex" :range="processModes">
					<view class="setting-picker">
						<text>{{ processModes[processModeIndex] }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			
			<view class="setting-item">
				<text class="setting-label">跳过标题行</text>
				<switch :checked="importConfig.skipHeader" @change="skipHeaderChange" />
			</view>
			
			<view class="setting-item">
				<text class="setting-label">验证数据格式</text>
				<switch :checked="importConfig.validateData" @change="validateDataChange" />
			</view>
		</view>
		
		<!-- 预览数据 -->
		<view class="data-preview" v-if="previewData.length > 0">
			<text class="preview-title">数据预览</text>
			<scroll-view scroll-x class="preview-table">
				<view class="table-header">
					<text class="table-cell" v-for="header in previewHeaders" :key="header">{{ header }}</text>
				</view>
				<view class="table-row" v-for="(row, index) in previewData.slice(0, 5)" :key="index">
					<text class="table-cell" v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</text>
				</view>
			</scroll-view>
			<text class="preview-note">仅显示前5行数据</text>
		</view>
		
		<!-- 导入按钮 -->
		<view class="import-actions">
			<button class="btn-preview" @click="previewImport">预览数据</button>
			<button class="btn-import" @click="startImport" :disabled="!canImport">开始导入</button>
		</view>
		
		<!-- 导入进度 -->
		<view class="import-progress" v-if="importing">
			<text class="progress-title">导入进度</text>
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: importProgress + '%' }"></view>
			</view>
			<text class="progress-text">{{ importProgress }}% ({{ currentStep }})</text>
		</view>
		
		<!-- 导入结果 -->
		<view class="import-result" v-if="importResult">
			<text class="result-title">导入结果</text>
			<view class="result-stats">
				<view class="stat-item success">
					<text class="stat-number">{{ importResult.success }}</text>
					<text class="stat-label">成功</text>
				</view>
				<view class="stat-item error" v-if="importResult.error > 0">
					<text class="stat-number">{{ importResult.error }}</text>
					<text class="stat-label">失败</text>
				</view>
				<view class="stat-item total">
					<text class="stat-number">{{ importResult.total }}</text>
					<text class="stat-label">总计</text>
				</view>
			</view>
			<view class="error-list" v-if="importResult.errors.length > 0">
				<text class="error-title">错误详情</text>
				<scroll-view scroll-y class="error-scroll">
					<view class="error-item" v-for="(error, index) in importResult.errors" :key="index">
						<text class="error-text">第{{ error.row }}行: {{ error.message }}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			importType: 'comprehensive',
			selectedFiles: {
				comprehensive: '',
				points: '',
				lines: ''
			},
			processModes: ['覆盖现有数据', '追加到现有数据', '仅导入新数据'],
			processModeIndex: 1,
			importConfig: {
				skipHeader: true,
				validateData: true
			},
			previewData: [],
			previewHeaders: [],
			importing: false,
			importProgress: 0,
			currentStep: '',
			importResult: null
		}
	},
	computed: {
		canImport() {
			if (this.importType === 'comprehensive') {
				return !!this.selectedFiles.comprehensive
			} else {
				return !!(this.selectedFiles.points && this.selectedFiles.lines)
			}
		}
	},
	methods: {
		importTypeChange(e) {
			this.importType = e.detail.value
			this.selectedFiles = {
				comprehensive: '',
				points: '',
				lines: ''
			}
			this.previewData = []
			this.previewHeaders = []
		},
		
		processModeChange(e) {
			this.processModeIndex = e.detail.value
		},
		
		skipHeaderChange(e) {
			this.importConfig.skipHeader = e.detail.value
		},
		
		validateDataChange(e) {
			this.importConfig.validateData = e.detail.value
		},
		
		selectFile(type) {
			// 模拟文件选择
			const mockFiles = [
				'管网数据_综合表.xlsx',
				'管点数据表.xlsx',
				'管线数据表.xlsx',
				'导出数据_20241201.xlsx'
			]
			
			uni.showActionSheet({
				itemList: mockFiles,
				success: (res) => {
					this.selectedFiles[type] = mockFiles[res.tapIndex]
					
					// 模拟文件预览
					if (type === 'comprehensive' || type === 'points') {
						this.generateMockPreview(type)
					}
				}
			})
		},
		
		generateMockPreview(type) {
			if (type === 'comprehensive') {
				this.previewHeaders = ['点号', '类型', '材质', '管径', '埋深', '经度', '纬度', '备注']
				this.previewData = [
					['A001', '检查井', '铸铁', '300', '1.5', '113.324520', '23.099994', '正常'],
					['A002', '阀门井', 'PVC', '200', '1.2', '113.324620', '23.100094', ''],
					['A003', '消火栓', '钢管', '150', '1.0', '113.324720', '23.100194', '需维修'],
					['A004', '水表井', 'PE', '100', '0.8', '113.324820', '23.100294', ''],
					['A005', '检查井', '铸铁', '300', '1.6', '113.324920', '23.100394', '新建']
				]
			} else {
				this.previewHeaders = ['点号', '类型', '材质', '管径', '埋深', '经度', '纬度']
				this.previewData = [
					['A001', '检查井', '铸铁', '300', '1.5', '113.324520', '23.099994'],
					['A002', '阀门井', 'PVC', '200', '1.2', '113.324620', '23.100094'],
					['A003', '消火栓', '钢管', '150', '1.0', '113.324720', '23.100194']
				]
			}
		},
		
		previewImport() {
			if (!this.canImport) {
				uni.showToast({
					title: '请先选择文件',
					icon: 'none'
				})
				return
			}
			
			// 生成预览数据
			this.generateMockPreview(this.importType)
			
			uni.showToast({
				title: '数据预览已更新',
				icon: 'success'
			})
		},
		
		async startImport() {
			if (!this.canImport) {
				uni.showToast({
					title: '请先选择文件',
					icon: 'none'
				})
				return
			}
			
			this.importing = true
			this.importProgress = 0
			this.importResult = null
			
			try {
				await this.simulateImport()
				
				// 模拟导入结果
				this.importResult = {
					success: 45,
					error: 2,
					total: 47,
					errors: [
						{ row: 15, message: '经纬度格式错误' },
						{ row: 32, message: '管径数值无效' }
					]
				}
				
				// 更新项目数据
				this.updateProjectData()
				
				uni.showToast({
					title: '导入完成',
					icon: 'success'
				})
				
			} catch (error) {
				uni.showToast({
					title: '导入失败',
					icon: 'none'
				})
			} finally {
				this.importing = false
				this.importProgress = 0
				this.currentStep = ''
			}
		},
		
		async simulateImport() {
			const steps = [
				'读取文件...',
				'验证数据格式...',
				'处理管点数据...',
				'处理管线数据...',
				'保存到数据库...',
				'更新统计信息...'
			]
			
			for (let i = 0; i < steps.length; i++) {
				this.currentStep = steps[i]
				this.importProgress = Math.round((i + 1) / steps.length * 100)
				await new Promise(resolve => setTimeout(resolve, 1000))
			}
		},
		
		updateProjectData() {
			const project = uni.getStorageSync('currentProject')
			if (project) {
				// 模拟添加导入的数据
				const newPoints = this.generateImportedPoints()
				const newLines = this.generateImportedLines()
				
				if (this.processModeIndex === 0) {
					// 覆盖现有数据
					project.pipePoints = newPoints
					project.pipeLines = newLines
				} else {
					// 追加到现有数据
					project.pipePoints = [...(project.pipePoints || []), ...newPoints]
					project.pipeLines = [...(project.pipeLines || []), ...newLines]
				}
				
				// 更新统计信息
				project.statistics = {
					pointCount: project.pipePoints.length,
					lineLength: project.pipeLines.reduce((total, line) => total + (line.length || 0), 0)
				}
				
				uni.setStorageSync('currentProject', project)
			}
		},
		
		generateImportedPoints() {
			// 模拟生成导入的管点数据
			return [
				{
					id: 'imported_' + Date.now() + '_1',
					pointId: 'B001',
					type: '检查井',
					material: '铸铁',
					diameter: '300',
					depth: '1.5',
					longitude: 113.325520,
					latitude: 23.101994,
					layerId: 'water',
					createTime: Date.now(),
					imported: true
				},
				{
					id: 'imported_' + Date.now() + '_2',
					pointId: 'B002',
					type: '阀门井',
					material: 'PVC',
					diameter: '200',
					longitude: 113.325620,
					latitude: 23.102094,
					layerId: 'water',
					createTime: Date.now(),
					imported: true
				}
			]
		},
		
		generateImportedLines() {
			// 模拟生成导入的管线数据
			return [
				{
					id: 'imported_line_' + Date.now() + '_1',
					lineId: 'L001',
					material: '铸铁',
					diameter: '300',
					length: 125.5,
					points: [
						{ longitude: 113.325520, latitude: 23.101994 },
						{ longitude: 113.325620, latitude: 23.102094 }
					],
					layerId: 'water',
					createTime: Date.now(),
					imported: true
				}
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.import-container {
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

.import-options, .file-selection, .import-settings, .data-preview, .import-result {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.options-title, .selection-title, .settings-title, .preview-title, .result-title {
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
	
	radio {
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

.file-item {
	margin-bottom: 25rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.file-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 15rpx;
	}
	
	.file-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 2rpx dashed #ccc;
		border-radius: 10rpx;
		padding: 25rpx 20rpx;
		background: #fafafa;
		
		.file-name {
			font-size: 28rpx;
			color: #666;
		}
		
		.file-icon {
			font-size: 32rpx;
		}
	}
}

.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 25rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.setting-label {
		font-size: 28rpx;
		color: #333;
	}
	
	.setting-picker {
		display: flex;
		align-items: center;
		background: #f0f0f0;
		padding: 15rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		
		.picker-arrow {
			margin-left: 10rpx;
			font-size: 20rpx;
		}
	}
}

.preview-table {
	border: 1rpx solid #e5e5e5;
	border-radius: 10rpx;
	overflow: hidden;
	margin-bottom: 15rpx;
	
	.table-header, .table-row {
		display: flex;
		min-width: 800rpx;
		
		.table-cell {
			flex: 1;
			min-width: 100rpx;
			padding: 15rpx 10rpx;
			border-right: 1rpx solid #e5e5e5;
			font-size: 24rpx;
			text-align: center;
			
			&:last-child {
				border-right: none;
			}
		}
	}
	
	.table-header {
		background: #f8f8f8;
		
		.table-cell {
			font-weight: bold;
			color: #333;
		}
	}
	
	.table-row {
		border-top: 1rpx solid #e5e5e5;
		
		.table-cell {
			color: #666;
		}
	}
}

.preview-note {
	font-size: 24rpx;
	color: #999;
	text-align: center;
}

.import-actions {
	display: flex;
	gap: 20rpx;
	margin-bottom: 30rpx;
	
	.btn-preview, .btn-import {
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
	
	.btn-import {
		background: #007AFF;
		color: white;
		
		&[disabled] {
			background: #ccc;
		}
	}
}

.import-progress {
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

.result-stats {
	display: flex;
	justify-content: space-around;
	margin-bottom: 30rpx;
	
	.stat-item {
		text-align: center;
		
		.stat-number {
			display: block;
			font-size: 48rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		
		.stat-label {
			font-size: 24rpx;
			color: #666;
		}
		
		&.success .stat-number {
			color: #00CC66;
		}
		
		&.error .stat-number {
			color: #ff4444;
		}
		
		&.total .stat-number {
			color: #007AFF;
		}
	}
}

.error-list {
	.error-title {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 15rpx;
	}
	
	.error-scroll {
		max-height: 200rpx;
		border: 1rpx solid #ffe6e6;
		border-radius: 10rpx;
		background: #fff5f5;
		
		.error-item {
			padding: 15rpx 20rpx;
			border-bottom: 1rpx solid #ffe6e6;
			
			&:last-child {
				border-bottom: none;
			}
			
			.error-text {
				font-size: 24rpx;
				color: #ff4444;
			}
		}
	}
}
</style>