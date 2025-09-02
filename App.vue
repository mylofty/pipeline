<template>
	<view id="app">
		<router-view />
	</view>
</template>

<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./uni.scss");
	
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