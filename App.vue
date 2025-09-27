<template>
	<view id="app">
		<router-view />
	</view>
</template>

<script>
	import database from '@/utils/database.js';
	import databaseTest from '@/utils/databaseTest.js';
	import { pipeTypeEntityServiceTest } from '@/services/pipeTypeEntityService.test.js';
	
	export default {
		async onLaunch() {
			console.log('App Launch - 绘管通启动');
			
			// 初始化数据库
			try {
				console.log('开始初始化数据库...');
				const success = await database.initDatabase();
				
				if (success) {
					console.log('✓ 数据库初始化成功');
					
					// 在开发环境下运行测试
					// #ifdef APP-PLUS || H5
					if (process.env.NODE_ENV === 'development') {
						console.log('运行数据库功能测试...');
						setTimeout(async () => {
							try {
								await databaseTest.runAllTests();
								await pipeTypeEntityServiceTest.runFullTest();
							} catch (testError) {
								console.error('数据库测试失败:', testError);
							}
						}, 1000);
					}
					// #endif
					
					uni.showToast({
						title: '数据库就绪',
						icon: 'success',
						duration: 2000
					});
				} else {
					console.error('✗ 数据库初始化失败');
					uni.showModal({
						title: '数据库错误',
						content: '数据库初始化失败，部分功能可能无法正常使用',
						showCancel: false
					});
				}
			} catch (error) {
				console.error('✗ 数据库初始化异常:', error);
				uni.showModal({
					title: '系统错误',
					content: '数据库系统异常: ' + error.message,
					showCancel: false
				});
			}
		},
		
		onShow: function() {
			console.log('App Show')
		},
		
		onHide: function() {
			console.log('App Hide')
		},
		
		onUnload() {
			// 应用退出时关闭数据库连接
			try {
				database.closeDatabase();
				console.log('数据库连接已关闭');
			} catch (error) {
				console.error('关闭数据库连接失败:', error);
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./uni.scss";
	
	/* 自定义tabBar样式 */
	.uni-tabbar {
		height: 60px !important;
	}
	
	.uni-tabbar-item {
		height: 60px !important;
		font-size: 16px !important;
	}
	
	.uni-tabbar__text {
		font-size: 14px !important;
		margin-top: 2px !important;
	}
	
	/* 针对微信小程序的tabBar样式调整 */
	/* #ifdef MP-WEIXIN */
	.uni-tabbar {
		height: 65px !important;
	}
	
	.uni-tabbar-item {
		height: 65px !important;
	}
	
	.uni-tabbar__text {
		font-size: 15px !important;
	}
	/* #endif */
</style>