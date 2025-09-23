<template>
	<view class="profile-container">
		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="user-avatar">
				<text class="avatar-text">{{ userInitial }}</text>
			</view>
			<view class="user-info">
				<text class="user-name">{{ userInfo.phone || '未登录' }}</text>
				<text class="user-desc">{{ currentProject.name || '未选择项目' }}</text>
			</view>
			<view class="user-actions">
				<text class="action-btn" @click="switchProject">切换项目</text>
			</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="menu-sections">
			<!-- 设置管理 -->
			<view class="menu-section">
				<text class="section-title">设置管理</text>
				<view class="menu-list">
					<view class="menu-item" @click="navigateTo('/pages/settings/pipe-type')">
						<image src="/static/icons/pipe-type.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">管类设置</text>
							<text class="menu-desc">新增/删除管线/管点类别</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="navigateTo('/pages/settings/attribute')">
						<image src="/static/icons/attribute.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">属性设置</text>
							<text class="menu-desc">控制属性在采集中是否显示</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="navigateTo('/pages/settings/feature')">
						<image src="/static/icons/feature.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">特征/附属物设置</text>
							<text class="menu-desc">管理特征与附属物</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
				</view>
			</view>
			
			<!-- 数据管理 -->
			<view class="menu-section">
				<text class="section-title">数据管理</text>
				<view class="menu-list">
					<view class="menu-item" @click="navigateTo('/pages/data/export')">
						<image src="/static/icons/export.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">数据导出</text>
							<text class="menu-desc">导出Excel至指定目录</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="navigateTo('/pages/data/import')">
						<image src="/static/icons/import.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">数据导入</text>
							<text class="menu-desc">支持综合表或管点管线表导入</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
				</view>
			</view>
			
			<!-- 数据库测试工具 -->
			<view class="menu-section">
				<text class="section-title">数据库测试工具</text>
				<view class="menu-list">
					
					<view class="menu-item" @click="navigateTo('/pages/test/database-viewer')">
						<image src="/static/icons/database-viewer.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">数据库内容查看器</text>
							<text class="menu-desc">查看表数据和详细诊断</text>
						</view>
						<text class="menu-arrow">></text>
					</view>

					<view class="menu-item" @click="navigateTo('/pages/test/quick-test')">
						<image src="/static/icons/quick-test.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">快速测试</text>
							<text class="menu-desc">运行数据库功能测试</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="navigateTo('/pages/test/simple-db-test')">
						<image src="/static/icons/simple-test.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">简单数据库测试</text>
							<text class="menu-desc">基础数据库功能测试</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
				</view>
			</view>
			
			<!-- 帮助与支持 -->
			<view class="menu-section">
				<text class="section-title">帮助与支持</text>
				<view class="menu-list">
					<view class="menu-item" @click="checkUpdate">
						<image src="/static/icons/update.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">版本更新</text>
							<text class="menu-desc">当前版本 v1.0.0</text>
						</view>
						<view class="update-badge" v-if="hasUpdate">
							<text class="badge-text">新</text>
						</view>
					</view>
					
					<view class="menu-item" @click="navigateTo('/pages/help/help')">
						<image src="/static/icons/help.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">使用帮助</text>
							<text class="menu-desc">查阅帮助文档</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="showAgreement">
						<image src="/static/icons/agreement.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">用户协议</text>
							<text class="menu-desc">查看用户协议和隐私政策</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="feedback">
						<image src="/static/icons/feedback.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">反馈意见</text>
							<text class="menu-desc">提交问题和建议</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
				</view>
			</view>
			
			<!-- 账号管理 -->
			<view class="menu-section">
				<text class="section-title">账号管理</text>
				<view class="menu-list">
					<view class="menu-item danger" @click="deleteAccount">
						<image src="/static/icons/delete-account.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">注销账号</text>
							<text class="menu-desc">永久删除账号和数据</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
					
					<view class="menu-item" @click="logout">
						<image src="/static/icons/logout.png" class="menu-icon"></image>
						<view class="menu-content">
							<text class="menu-title">退出登录</text>
							<text class="menu-desc">退出当前账号</text>
						</view>
						<text class="menu-arrow">></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 存储信息 -->
		<view class="storage-info">
			<text class="storage-title">存储使用情况</text>
			<view class="storage-details">
				<view class="storage-item">
					<text class="storage-label">项目数据</text>
					<text class="storage-value">{{ formatSize(storageInfo.projectSize) }}</text>
				</view>
				<view class="storage-item">
					<text class="storage-label">图片附件</text>
					<text class="storage-value">{{ formatSize(storageInfo.imageSize) }}</text>
				</view>
				<view class="storage-item">
					<text class="storage-label">总计</text>
					<text class="storage-value">{{ formatSize(storageInfo.totalSize) }}</text>
				</view>
			</view>
			<button class="clear-cache-btn" @click="clearCache">清理缓存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {},
			currentProject: {},
			hasUpdate: false,
			storageInfo: {
				projectSize: 1024 * 1024 * 2.5,
				imageSize: 1024 * 1024 * 8.3,
				totalSize: 1024 * 1024 * 10.8
			}
		}
	},
	computed: {
		userInitial() {
			if (this.userInfo.phone) {
				return this.userInfo.phone.slice(-2)
			}
			return '用户'
		}
	},
	onLoad() {
		this.loadUserInfo()
		this.checkForUpdates()
	},
	onShow() {
		this.loadUserInfo()
	},
	methods: {
		loadUserInfo() {
			this.userInfo = uni.getStorageSync('userInfo') || {}
			this.currentProject = uni.getStorageSync('currentProject') || {}
		},
		
		navigateTo(url) {
			uni.navigateTo({ url })
		},
		
		switchProject() {
			uni.navigateTo({
				url: '/pages/project/project'
			})
		},
		
		checkUpdate() {
			uni.showLoading({
				title: '检查更新中...'
			})
			
			setTimeout(() => {
				uni.hideLoading()
				if (this.hasUpdate) {
					uni.showModal({
						title: '发现新版本',
						content: '是否立即更新到最新版本？',
						success: (res) => {
							if (res.confirm) {
								this.downloadUpdate()
							}
						}
					})
				} else {
					uni.showToast({
						title: '已是最新版本',
						icon: 'success'
					})
				}
			}, 1500)
		},
		
		checkForUpdates() {
			// 模拟检查更新
			setTimeout(() => {
				this.hasUpdate = Math.random() > 0.7
			}, 2000)
		},
		
		downloadUpdate() {
			uni.showToast({
				title: '开始下载更新包',
				icon: 'success'
			})
		},
		
		showAgreement() {
			uni.showModal({
				title: '用户协议',
				content: '这里显示用户协议和隐私政策的内容...',
				showCancel: false
			})
		},
		
		feedback() {
			uni.showModal({
				title: '反馈意见',
				content: '请通过邮箱 support@example.com 联系我们',
				showCancel: false
			})
		},
		
		deleteAccount() {
			uni.showModal({
				title: '注销账号',
				content: '注销后将永久删除所有数据，此操作不可恢复，确定要继续吗？',
				confirmColor: '#ff4444',
				success: (res) => {
					if (res.confirm) {
						this.performDeleteAccount()
					}
				}
			})
		},
		
		performDeleteAccount() {
			uni.showLoading({
				title: '注销中...'
			})
			
			setTimeout(() => {
				uni.clearStorageSync()
				uni.hideLoading()
				uni.showToast({
					title: '账号已注销',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 1500)
			}, 2000)
		},
		
		logout() {
			uni.showModal({
				title: '退出登录',
				content: '确定要退出当前账号吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('token')
						uni.removeStorageSync('userInfo')
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						})
						
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}, 1500)
					}
				}
			})
		},
		
		formatSize(bytes) {
			if (bytes === 0) return '0 B'
			const k = 1024
			const sizes = ['B', 'KB', 'MB', 'GB']
			const i = Math.floor(Math.log(bytes) / Math.log(k))
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
		},
		
		clearCache() {
			uni.showModal({
				title: '清理缓存',
				content: '确定要清理缓存数据吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '清理中...'
						})
						
						setTimeout(() => {
							this.storageInfo = {
								projectSize: this.storageInfo.projectSize,
								imageSize: this.storageInfo.imageSize * 0.3,
								totalSize: this.storageInfo.projectSize + this.storageInfo.imageSize * 0.3
							}
							
							uni.hideLoading()
							uni.showToast({
								title: '缓存清理完成',
								icon: 'success'
							})
						}, 2000)
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import './profile-styles.scss';
</style>