<template>
	<view class="login-container">
		<view class="login-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">绘管通</text>
			<text class="app-desc">管网数据采集系统</text>
		</view>
		
		<view class="login-form">
			<view class="form-item">
				<input 
					class="phone-input" 
					type="number" 
					placeholder="请输入手机号码"
					v-model="phone"
					maxlength="11"
				/>
			</view>
			
			<view class="form-item">
				<view class="code-input-wrapper">
					<input 
						class="code-input" 
						type="number" 
						placeholder="请输入验证码"
						v-model="code"
						maxlength="6"
					/>
					<button 
						class="get-code-btn" 
						:disabled="codeDisabled"
						@click="getCode"
					>
						{{ codeText }}
					</button>
				</view>
			</view>
			
			<button class="login-btn" @click="login" :disabled="!canLogin">登录</button>
		</view>
		
		<view class="agreement">
			<checkbox-group @change="agreementChange">
				<label class="agreement-item">
					<checkbox value="agree" :checked="agreed" />
					<text class="agreement-text">
						我已阅读并同意
						<text class="link" @click="showAgreement('user')">《用户协议》</text>
						和
						<text class="link" @click="showAgreement('privacy')">《隐私政策》</text>
					</text>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: '',
			code: '',
			agreed: false,
			codeDisabled: false,
			codeText: '获取验证码',
			countdown: 60
		}
	},
	computed: {
		canLogin() {
			return this.phone.length === 11 && this.code.length === 6 && this.agreed
		}
	},
	methods: {
		async getCode() {
			if (!this.phone || this.phone.length !== 11) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return
			}
			
			// 模拟发送验证码
			uni.showLoading({
				title: '发送中...'
			})
			
			try {
				// 这里应该调用实际的API
				await new Promise(resolve => setTimeout(resolve, 1000))
				
				uni.hideLoading()
				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				})
				
				// 开始倒计时
				this.startCountdown()
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: '发送失败，请重试',
					icon: 'none'
				})
			}
		},
		
		startCountdown() {
			this.codeDisabled = true
			this.countdown = 60
			
			const timer = setInterval(() => {
				this.countdown--
				this.codeText = `${this.countdown}s后重新获取`
				
				if (this.countdown <= 0) {
					clearInterval(timer)
					this.codeDisabled = false
					this.codeText = '获取验证码'
				}
			}, 1000)
		},
		
		async login() {
			if (!this.canLogin) return
			
			uni.showLoading({
				title: '登录中...'
			})
			
			try {
				// 模拟登录API调用
				await new Promise(resolve => setTimeout(resolve, 1500))
				
				// 保存登录状态
				uni.setStorageSync('token', 'mock_token_' + Date.now())
				uni.setStorageSync('userInfo', {
					phone: this.phone,
					loginTime: Date.now()
				})
				
				uni.hideLoading()
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				
				// 检查是否有项目，没有则跳转到项目创建页
				const hasProject = uni.getStorageSync('currentProject')
				if (hasProject) {
					uni.switchTab({
						url: '/pages/collect/collect'
					})
				} else {
					uni.redirectTo({
						url: '/pages/project/project'
					})
				}
				
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				})
			}
		},
		
		agreementChange(e) {
			this.agreed = e.detail.value.includes('agree')
		},
		
		showAgreement(type) {
			const title = type === 'user' ? '用户协议' : '隐私政策'
			uni.showModal({
				title: title,
				content: `这里是${title}的内容...`,
				showCancel: false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
	padding: 100rpx 60rpx;
	display: flex;
	flex-direction: column;
}

.login-header {
	text-align: center;
	margin-bottom: 100rpx;
	
	.logo {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 30rpx;
	}
	
	.app-name {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		margin-bottom: 20rpx;
	}
	
	.app-desc {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}
}

.login-form {
	.form-item {
		margin-bottom: 40rpx;
	}
	
	.phone-input, .code-input {
		width: 100%;
		height: 88rpx;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 44rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		border: none;
	}
	
	.code-input-wrapper {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 44rpx;
		padding-right: 20rpx;
		
		.code-input {
			flex: 1;
			background: transparent;
			padding-right: 20rpx;
		}
		
		.get-code-btn {
			background: #007AFF;
			color: white;
			border: none;
			border-radius: 30rpx;
			padding: 15rpx 25rpx;
			font-size: 24rpx;
			
			&[disabled] {
				background: #ccc;
			}
		}
	}
	
	.login-btn {
		width: 100%;
		height: 88rpx;
		background: white;
		color: #007AFF;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: bold;
		border: none;
		margin-top: 60rpx;
		
		&[disabled] {
			background: rgba(255, 255, 255, 0.5);
			color: rgba(0, 122, 255, 0.5);
		}
	}
}

.agreement {
	margin-top: 60rpx;
	
	.agreement-item {
		display: flex;
		align-items: flex-start;
		
		checkbox {
			margin-right: 15rpx;
			margin-top: 5rpx;
		}
		
		.agreement-text {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			line-height: 1.5;
			
			.link {
				color: white;
				text-decoration: underline;
			}
		}
	}
}
</style>