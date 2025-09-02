<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
		// 检查登录状态
		this.checkLoginStatus()
		// 请求权限
		this.requestPermissions()
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	methods: {
		checkLoginStatus() {
			const token = uni.getStorageSync('token')
			const hasProject = uni.getStorageSync('currentProject')
			
			if (!token) {
				// 未登录，跳转到登录页
				uni.reLaunch({
					url: '/pages/login/login'
				})
			} else if (!hasProject) {
				// 已登录但未创建项目，跳转到项目管理页
				uni.reLaunch({
					url: '/pages/project/project'
				})
			}
		},
		
		requestPermissions() {
			// 请求存储权限
			// #ifdef APP-PLUS
			const main = plus.android.runtimeMainActivity()
			const pkName = main.getPackageName()
			const uid = main.getApplicationInfo().uid
			
			// 请求权限
			plus.android.requestPermissions([
				'android.permission.WRITE_EXTERNAL_STORAGE',
				'android.permission.READ_EXTERNAL_STORAGE',
				'android.permission.ACCESS_FINE_LOCATION',
				'android.permission.ACCESS_COARSE_LOCATION',
				'android.permission.CAMERA'
			], (result) => {
				console.log('权限请求结果:', result)
			})
			// #endif
		}
	}
}
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uni.scss';

page {
	background-color: #f8f8f8;
}

.container {
	padding: 20rpx;
}

.btn-primary {
	background-color: #007AFF;
	color: white;
	border-radius: 10rpx;
	padding: 20rpx;
	text-align: center;
	margin: 20rpx 0;
}

.btn-secondary {
	background-color: #f8f8f8;
	color: #333;
	border: 2rpx solid #ddd;
	border-radius: 10rpx;
	padding: 20rpx;
	text-align: center;
	margin: 20rpx 0;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.form-input {
	border: 2rpx solid #ddd;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.card {
	background-color: white;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.list-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #eee;
}

.list-item:last-child {
	border-bottom: none;
}

.list-item-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}

.list-item-content {
	flex: 1;
}

.list-item-title {
	font-size: 30rpx;
	color: #333;
}

.list-item-desc {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.list-item-arrow {
	color: #ccc;
	font-size: 24rpx;
}
</style>