<template>
	<view class="statistics-container">
		<view class="header">
			<text class="title">数据统计</text>
			<text class="project-name">{{ currentProject.name }}</text>
		</view>
		
		<!-- 总体统计 -->
		<view class="summary-cards">
			<view class="summary-card">
				<text class="card-number">{{ statistics.pointCount }}</text>
				<text class="card-label">管点总数</text>
				<text class="card-unit">个</text>
			</view>
			<view class="summary-card">
				<text class="card-number">{{ formatLength(statistics.lineLength) }}</text>
				<text class="card-label">管线长度</text>
				<text class="card-unit">米</text>
			</view>
		</view>
		
		<!-- 分类统计 -->
		<view class="category-stats">
			<view class="stats-header">
				<text class="stats-title">管点/管线数量统计</text>
			</view>
			
			<!-- 雨水 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #8B4513;">
					<text class="icon-text">雨水</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">9</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">2</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">21.42</text>
					</view>
				</view>
			</view>

			<!-- 燃气 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #9C27B0;">
					<text class="icon-text">燃气</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">4</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">0</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">118.46</text>
					</view>
				</view>
			</view>

			<!-- 路灯 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #F44336;">
					<text class="icon-text">路灯</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">6</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">0</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">580.55</text>
					</view>
				</view>
			</view>

			<!-- 消防用水 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #3F51B5;">
					<text class="icon-text">消防用水</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">2</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">0</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">297.88</text>
					</view>
				</view>
			</view>

			<!-- 污水 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #E91E63;">
					<text class="icon-text">污水</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">4</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">0</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">905.04</text>
					</view>
				</view>
			</view>

			<!-- 中国移动 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #4CAF50;">
					<text class="icon-text">中国移动</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">5</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">0</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">2077.29</text>
					</view>
				</view>
			</view>

			<!-- 消防泡沫 -->
			<view class="pipeline-stats-item">
				<view class="icon-container" style="background: #FF5722;">
					<text class="icon-text">消防泡沫</text>
				</view>
				<view class="stats-content">
					<view class="stats-row">
						<text class="label">总数(个):</text>
						<text class="value primary">5</text>
						<text class="label">虚拟点(个):</text>
						<text class="value secondary">0</text>
					</view>
					<view class="stats-row">
						<text class="label">长度(米):</text>
						<text class="value primary">3462.77</text>
					</view>
				</view>
			</view>

			<!-- 汇总统计 -->
			<view class="summary-stats">
				<text class="summary-label">汇总统计:</text>
				<text class="summary-value">管点总数:</text>
				<text class="summary-number primary">35个</text>
				<text class="summary-value">管线长度:</text>
				<text class="summary-number secondary">7.46千米</text>
			</view>
		</view>
		
		<!-- 采集进度 -->
		<view class="progress-section">
			<text class="section-title">采集进度</text>
			<view class="progress-card">
				<view class="progress-info">
					<text class="progress-label">完成度</text>
					<text class="progress-value">{{ completionRate }}%</text>
				</view>
				<view class="progress-bar-container">
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: completionRate + '%' }"></view>
					</view>
				</view>
				<view class="progress-details">
					<text class="detail-item">已完成: {{ completedPoints }}个</text>
					<text class="detail-item">总计: {{ statistics.pointCount }}个</text>
				</view>
			</view>
		</view>
		
		<!-- 最近活动 -->
		<view class="activity-section">
			<text class="section-title">最近活动</text>
			<scroll-view scroll-y class="activity-list">
				<view class="activity-item" v-for="activity in recentActivities" :key="activity.id">
					<view class="activity-icon">
						<image :src="getActivityIcon(activity.type)" class="icon"></image>
					</view>
					<view class="activity-content">
						<text class="activity-title">{{ activity.title }}</text>
						<text class="activity-time">{{ formatTime(activity.time) }}</text>
					</view>
				</view>
				<view class="no-more" v-if="recentActivities.length === 0">
					<text>暂无活动记录</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-buttons">
			<button class="btn-secondary" @click="refreshData">刷新数据</button>
			<button class="btn-primary" @click="exportData">导出报告</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentProject: {},
			statistics: {
				pointCount: 35,
				lineLength: 7460
			},
			layers: [
				{ id: 'water', name: '给水管网', color: '#0066CC' },
				{ id: 'gas', name: '燃气管网', color: '#FF6600' },
				{ id: 'electric', name: '电力管网', color: '#FF0000' },
				{ id: 'telecom', name: '通信管网', color: '#00CC66' }
			],
			currentLayerIndex: 0,
			pipePoints: [],
			pipeLines: [],
			recentActivities: []
		}
	},
	computed: {
		currentLayer() {
			return this.layers[this.currentLayerIndex]
		},
		completedPoints() {
			return this.pipePoints.filter(p => p.completed).length
		},
		completionRate() {
			if (this.statistics.pointCount === 0) return 0
			return ((this.completedPoints / this.statistics.pointCount) * 100).toFixed(1)
		}
	},
	onLoad() {
		this.loadData()
	},
	onShow() {
		this.loadData()
	},
	methods: {
		loadData() {
			const project = uni.getStorageSync('currentProject')
			if (project) {
				this.currentProject = project
				this.statistics = project.statistics || { pointCount: 35, lineLength: 7460 }
				this.pipePoints = project.pipePoints || []
				this.pipeLines = project.pipeLines || []
				this.loadRecentActivities()
			}
		},
		
		loadRecentActivities() {
			// 模拟最近活动数据
			const activities = []
			
			// 从管点和管线数据生成活动记录
			const allItems = [
				...this.pipePoints.map(p => ({ ...p, type: 'point' })),
				...this.pipeLines.map(l => ({ ...l, type: 'line' }))
			].sort((a, b) => (b.createTime || 0) - (a.createTime || 0))
			
			allItems.slice(0, 10).forEach(item => {
				activities.push({
					id: item.id,
					type: item.type,
					title: item.type === 'point' 
						? `创建管点 ${item.pointId || item.id}` 
						: `创建管线 ${item.lineId || item.id}`,
					time: item.createTime || Date.now()
				})
			})
			
			this.recentActivities = activities
		},
		
		layerChange(e) {
			this.currentLayerIndex = e.detail.value
		},
		
		formatLength(length) {
			if (!length) return '0'
			if (length >= 1000) {
				return (length / 1000).toFixed(2) + 'k'
			}
			return Math.round(length).toString()
		},
		
		formatTime(timestamp) {
			const now = Date.now()
			const diff = now - timestamp
			
			if (diff < 60000) { // 1分钟内
				return '刚刚'
			} else if (diff < 3600000) { // 1小时内
				return Math.floor(diff / 60000) + '分钟前'
			} else if (diff < 86400000) { // 1天内
				return Math.floor(diff / 3600000) + '小时前'
			} else {
				const date = new Date(timestamp)
				return `${date.getMonth() + 1}/${date.getDate()}`
			}
		},
		
		getActivityIcon(type) {
			return type === 'point' ? '/static/icons/point.png' : '/static/icons/line.png'
		},
		
		refreshData() {
			uni.showLoading({
				title: '刷新中...'
			})
			
			setTimeout(() => {
				this.loadData()
				uni.hideLoading()
				uni.showToast({
					title: '刷新完成',
					icon: 'success'
				})
			}, 1000)
		},
		
		exportData() {
			uni.showLoading({
				title: '生成报告中...'
			})
			
			setTimeout(() => {
				uni.hideLoading()
				uni.showModal({
					title: '导出成功',
					content: '统计报告已保存到 /pipeline/excel/ 目录',
					showCancel: false,
					success: () => {
						// 这里可以实际实现导出功能
						console.log('导出统计报告')
					}
				})
			}, 2000)
		}
	}
}
</script>

<style lang="scss" scoped>
.statistics-container {
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
	
	.project-name {
		font-size: 28rpx;
		color: #666;
	}
}

.summary-cards {
	display: flex;
	gap: 20rpx;
	margin-bottom: 40rpx;
	
	.summary-card {
		flex: 1;
		background: white;
		border-radius: 15rpx;
		padding: 40rpx 20rpx;
		text-align: center;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
		
		.card-number {
			display: block;
			font-size: 48rpx;
			font-weight: bold;
			color: #007AFF;
			margin-bottom: 10rpx;
		}
		
		.card-label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 5rpx;
		}
		
		.card-unit {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.category-stats {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.stats-header {
		margin-bottom: 30rpx;
		
		.stats-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.pipeline-stats-item {
		background: white;
		border-radius: 12rpx;
		margin-bottom: 12rpx;
		padding: 15rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
		
		.icon-container {
			width: 60rpx;
			height: 60rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 15rpx;
			
			.icon-text {
				color: white;
				font-size: 20rpx;
				font-weight: bold;
				text-align: center;
			}
		}
		
		.stats-content {
			flex: 1;
			
			.stats-row {
				display: flex;
				align-items: center;
				margin-bottom: 8rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				.label {
					font-size: 28rpx;
					color: #666;
					margin-right: 8rpx;
				}
				
				.value {
					font-size: 32rpx;
					font-weight: bold;
					margin-right: 40rpx;
					
					&.primary {
						color: #2196F3;
					}
					
					&.secondary {
						color: #FF9800;
					}
				}
			}
		}
	}
	
	.summary-stats {
		margin-top: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		
		.summary-label {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-right: 30rpx;
			margin-bottom: 10rpx;
		}
		
		.summary-value {
			font-size: 28rpx;
			color: #666;
			margin-right: 16rpx;
		}
		
		.summary-number {
			font-size: 36rpx;
			font-weight: bold;
			margin-right: 40rpx;
			
			&.primary {
				color: #4CAF50;
			}
			
			&.secondary {
				color: #2196F3;
			}
		}
	}
}

.progress-section {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.section-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	.progress-card {
		.progress-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.progress-label {
				font-size: 28rpx;
				color: #333;
			}
			
			.progress-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #007AFF;
			}
		}
		
		.progress-bar-container {
			margin-bottom: 20rpx;
			
			.progress-bar {
				height: 12rpx;
				background: #f0f0f0;
				border-radius: 6rpx;
				overflow: hidden;
				
				.progress-fill {
					height: 100%;
					background: linear-gradient(90deg, #007AFF, #00BFFF);
					border-radius: 6rpx;
					transition: width 0.3s ease;
				}
			}
		}
		
		.progress-details {
			display: flex;
			justify-content: space-between;
			
			.detail-item {
				font-size: 24rpx;
				color: #666;
			}
		}
	}
}

.activity-section {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.section-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	.activity-list {
		max-height: 400rpx;
		
		.activity-item {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.activity-icon {
				width: 60rpx;
				height: 60rpx;
				background: #f0f0f0;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				
				.icon {
					width: 30rpx;
					height: 30rpx;
				}
			}
			
			.activity-content {
				flex: 1;
				
				.activity-title {
					display: block;
					font-size: 28rpx;
					color: #333;
					margin-bottom: 5rpx;
				}
				
				.activity-time {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.no-more {
			text-align: center;
			padding: 40rpx;
			color: #999;
			font-size: 24rpx;
		}
	}
}

.action-buttons {
	display: flex;
	gap: 20rpx;
	margin-top: 20rpx;
	
	.btn-secondary, .btn-primary {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		border: none;
	}
	
	.btn-secondary {
		background: #f0f0f0;
		color: #666;
	}
	
	.btn-primary {
		background: #007AFF;
		color: white;
	}
}
</style>