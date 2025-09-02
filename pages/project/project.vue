<template>
	<view class="project-container">
		<view class="header">
			<text class="title">创建项目</text>
			<text class="subtitle">请填写项目信息以开始使用</text>
		</view>
		
		<view class="form-container">
			<view class="form-item">
				<text class="label">项目名称 *</text>
				<input 
					class="input" 
					placeholder="请输入项目名称"
					v-model="projectName"
				/>
			</view>
			
			<view class="form-item">
				<text class="label">作业小组</text>
				<input 
					class="input" 
					placeholder="请输入作业小组名称（可选）"
					v-model="workGroup"
				/>
				<text class="hint">作为管点物探点号前缀</text>
			</view>
			
			<view class="form-item">
				<text class="label">离线底图</text>
				<view class="file-upload" @click="selectOfflineMap">
					<text class="upload-text">
						{{ offlineMapName || '点击选择.shp或.tif格式文件' }}
					</text>
					<text class="upload-icon">📁</text>
				</view>
				<text class="hint">支持.shp矢量文件或.tif影像文件</text>
			</view>
			
			<view class="form-item">
				<text class="label">项目描述</text>
				<textarea 
					class="textarea" 
					placeholder="请输入项目描述（可选）"
					v-model="description"
					maxlength="200"
				></textarea>
			</view>
		</view>
		
		<view class="button-group">
			<button class="btn-secondary" @click="goBack">返回</button>
			<button class="btn-primary" @click="createProject" :disabled="!canCreate">创建项目</button>
		</view>
		
		<!-- 已有项目列表 -->
		<view class="project-list" v-if="existingProjects.length > 0">
			<text class="list-title">最近项目</text>
			<view class="project-item" v-for="project in existingProjects" :key="project.id" @click="selectProject(project)">
				<view class="project-info">
					<text class="project-name">{{ project.name }}</text>
					<text class="project-time">{{ formatTime(project.createTime) }}</text>
				</view>
				<text class="arrow">></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			projectName: '',
			workGroup: '',
			offlineMapName: '',
			offlineMapPath: '',
			description: '',
			existingProjects: []
		}
	},
	computed: {
		canCreate() {
			return this.projectName.trim().length > 0
		}
	},
	onLoad() {
		this.loadExistingProjects()
	},
	methods: {
		loadExistingProjects() {
			const projects = uni.getStorageSync('projects') || []
			this.existingProjects = projects.slice(0, 5) // 只显示最近5个项目
		},
		
		selectOfflineMap() {
			// #ifdef APP-PLUS
			plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
				fs.root.createReader().readEntries((entries) => {
					const files = entries.filter(entry => {
						const name = entry.name.toLowerCase()
						return name.endsWith('.shp') || name.endsWith('.tif')
					})
					
					if (files.length === 0) {
						uni.showToast({
							title: '未找到支持的文件格式',
							icon: 'none'
						})
						return
					}
					
					const items = files.map(file => file.name)
					uni.showActionSheet({
						itemList: items,
						success: (res) => {
							const selectedFile = files[res.tapIndex]
							this.offlineMapName = selectedFile.name
							this.offlineMapPath = selectedFile.fullPath
						}
					})
				})
			})
			// #endif
			
			// #ifndef APP-PLUS
			uni.showToast({
				title: '请在真机环境中选择文件',
				icon: 'none'
			})
			// #endif
		},
		
		async createProject() {
			if (!this.canCreate) return
			
			uni.showLoading({
				title: '创建中...'
			})
			
			try {
				const project = {
					id: Date.now().toString(),
					name: this.projectName,
					workGroup: this.workGroup,
					offlineMapName: this.offlineMapName,
					offlineMapPath: this.offlineMapPath,
					description: this.description,
					createTime: Date.now(),
					pipePoints: [],
					pipeLines: [],
					statistics: {
						pointCount: 0,
						lineLength: 0
					}
				}
				
				// 保存项目
				const projects = uni.getStorageSync('projects') || []
				projects.unshift(project)
				uni.setStorageSync('projects', projects)
				uni.setStorageSync('currentProject', project)
				
				// 创建项目目录结构
				this.createProjectDirectories(project.id)
				
				uni.hideLoading()
				uni.showToast({
					title: '项目创建成功',
					icon: 'success'
				})
				
				// 跳转到主页
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/collect/collect'
					})
				}, 1500)
				
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: '创建失败，请重试',
					icon: 'none'
				})
			}
		},
		
		createProjectDirectories(projectId) {
			// #ifdef APP-PLUS
			const basePath = plus.io.convertLocalFileSystemURL('_doc/pipeline/')
			const directories = ['dp', 'excel', 'picture', 'properties', 'shapefile', 'temp']
			
			directories.forEach(dir => {
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
					fs.root.getDirectory(`pipeline/${dir}`, {
						create: true,
						exclusive: false
					}, () => {
						console.log(`目录 ${dir} 创建成功`)
					})
				})
			})
			// #endif
		},
		
		selectProject(project) {
			uni.setStorageSync('currentProject', project)
			uni.switchTab({
				url: '/pages/collect/collect'
			})
		},
		
		formatTime(timestamp) {
			const date = new Date(timestamp)
			return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
		},
		
		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.project-container {
	padding: 40rpx;
	min-height: 100vh;
	background-color: #f8f8f8;
}

.header {
	text-align: center;
	margin-bottom: 60rpx;
	
	.title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #666;
	}
}

.form-container {
	background: white;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 40rpx;
	
	.form-item {
		margin-bottom: 40rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;
			font-weight: 500;
		}
		
		.input, .textarea {
			width: 100%;
			border: 2rpx solid #e5e5e5;
			border-radius: 10rpx;
			padding: 20rpx;
			font-size: 28rpx;
			background: #fafafa;
		}
		
		.textarea {
			height: 120rpx;
			resize: none;
		}
		
		.file-upload {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 2rpx dashed #ccc;
			border-radius: 10rpx;
			padding: 30rpx 20rpx;
			background: #fafafa;
			
			.upload-text {
				font-size: 28rpx;
				color: #666;
			}
			
			.upload-icon {
				font-size: 32rpx;
			}
		}
		
		.hint {
			display: block;
			font-size: 24rpx;
			color: #999;
			margin-top: 10rpx;
		}
	}
}

.button-group {
	display: flex;
	gap: 20rpx;
	
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
		
		&[disabled] {
			background: #ccc;
		}
	}
}

.project-list {
	margin-top: 60rpx;
	
	.list-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	.project-item {
		display: flex;
		align-items: center;
		background: white;
		border-radius: 15rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		
		.project-info {
			flex: 1;
			
			.project-name {
				display: block;
				font-size: 30rpx;
				color: #333;
				margin-bottom: 10rpx;
			}
			
			.project-time {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.arrow {
			color: #ccc;
			font-size: 28rpx;
		}
	}
}
</style>