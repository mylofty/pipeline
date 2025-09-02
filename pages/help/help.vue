<template>
	<view class="help-container">
		<view class="help-header">
			<text class="title">使用帮助</text>
			<text class="subtitle">绘管通操作指南</text>
		</view>
		
		<!-- 快速开始 -->
		<view class="help-section">
			<text class="section-title">快速开始</text>
			<view class="help-content">
				<view class="step-item">
					<text class="step-number">1</text>
					<view class="step-content">
						<text class="step-title">创建项目</text>
						<text class="step-desc">首次使用需要创建项目信息，建议加载本地.shp矢量或.tif影像文件作为底图</text>
					</view>
				</view>
				<view class="step-item">
					<text class="step-number">2</text>
					<view class="step-content">
						<text class="step-title">启用定位</text>
						<text class="step-desc">开启GPS定位功能，确保位置信息准确</text>
					</view>
				</view>
				<view class="step-item">
					<text class="step-number">3</text>
					<view class="step-content">
						<text class="step-title">开始采集</text>
						<text class="step-desc">进入采集模块，点击定位图标，采集管点，连接管点生成管线</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 功能说明 -->
		<view class="help-section">
			<text class="section-title">功能说明</text>
			<view class="function-list">
				<view class="function-item" v-for="func in functions" :key="func.id" @click="showFunctionDetail(func)">
					<image :src="func.icon" class="function-icon"></image>
					<view class="function-content">
						<text class="function-name">{{ func.name }}</text>
						<text class="function-desc">{{ func.description }}</text>
					</view>
					<text class="function-arrow">></text>
				</view>
			</view>
		</view>
		
		<!-- 常见问题 -->
		<view class="help-section">
			<text class="section-title">常见问题</text>
			<view class="faq-list">
				<view class="faq-item" v-for="(faq, index) in faqs" :key="index" @click="toggleFaq(index)">
					<view class="faq-question">
						<text class="question-text">{{ faq.question }}</text>
						<text class="question-arrow" :class="{ active: faq.expanded }">▼</text>
					</view>
					<view class="faq-answer" v-if="faq.expanded">
						<text class="answer-text">{{ faq.answer }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 联系我们 -->
		<view class="help-section">
			<text class="section-title">联系我们</text>
			<view class="contact-info">
				<view class="contact-item">
					<text class="contact-label">技术支持</text>
					<text class="contact-value">support@huiyutech.com</text>
				</view>
				<view class="contact-item">
					<text class="contact-label">客服电话</text>
					<text class="contact-value">400-123-4567</text>
				</view>
				<view class="contact-item">
					<text class="contact-label">工作时间</text>
					<text class="contact-value">周一至周五 9:00-18:00</text>
				</view>
			</view>
		</view>
		
		<!-- 版本信息 -->
		<view class="version-info">
			<text class="version-text">绘管通 v1.0.0</text>
			<text class="company-text">广东绘宇智能勘测科技有限公司</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			functions: [
				{
					id: 1,
					name: '管点采集',
					description: '录入管点位置、属性及关联附件',
					icon: '/static/icons/point.png'
				},
				{
					id: 2,
					name: '管线绘制',
					description: '连接管点生成管线并录入属性',
					icon: '/static/icons/line.png'
				},
				{
					id: 3,
					name: '数据编辑',
					description: '修改管点/管线属性及附件',
					icon: '/static/icons/edit.png'
				},
				{
					id: 4,
					name: '数据导出',
					description: '导出Excel至指定目录',
					icon: '/static/icons/export.png'
				}
			],
			faqs: [
				{
					question: '如何开启GPS定位？',
					answer: '在采集页面点击右下角的定位图标，系统会自动请求定位权限。请确保设备GPS功能已开启，并允许应用访问位置信息。',
					expanded: false
				},
				{
					question: '支持哪些底图格式？',
					answer: '系统支持.shp矢量文件和.tif影像文件作为离线底图。建议将底图文件放置在/pipeline/shapefile/目录下。',
					expanded: false
				},
				{
					question: '如何备份项目数据？',
					answer: '可以通过"数据导出"功能将项目数据导出为Excel文件进行备份。导出的文件保存在/pipeline/excel/目录下。',
					expanded: false
				},
				{
					question: '管点编号规则是什么？',
					answer: '管点编号由作业小组前缀+三位数字组成，如"A001"。可在项目设置中自定义作业小组名称作为前缀。',
					expanded: false
				},
				{
					question: '如何处理采集错误？',
					answer: '可以使用编辑工具修改错误的管点或管线信息，也可以使用删除工具移除错误数据。建议在采集过程中及时检查数据准确性。',
					expanded: false
				}
			]
		}
	},
	methods: {
		showFunctionDetail(func) {
			uni.showModal({
				title: func.name,
				content: func.description,
				showCancel: false
			})
		},
		
		toggleFaq(index) {
			this.faqs[index].expanded = !this.faqs[index].expanded
		}
	}
}
</script>

<style lang="scss" scoped>
.help-container {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.help-header {
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

.help-section {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	
	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 25rpx;
	}
}

.help-content {
	.step-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 30rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.step-number {
			width: 60rpx;
			height: 60rpx;
			background: #007AFF;
			color: white;
			border-radius: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: bold;
			margin-right: 25rpx;
			flex-shrink: 0;
		}
		
		.step-content {
			flex: 1;
			
			.step-title {
				display: block;
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}
			
			.step-desc {
				font-size: 26rpx;
				color: #666;
				line-height: 1.5;
			}
		}
	}
}

.function-list {
	.function-item {
		display: flex;
		align-items: center;
		padding: 25rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.function-icon {
			width: 50rpx;
			height: 50rpx;
			margin-right: 25rpx;
		}
		
		.function-content {
			flex: 1;
			
			.function-name {
				display: block;
				font-size: 28rpx;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.function-desc {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.function-arrow {
			color: #ccc;
			font-size: 28rpx;
		}
	}
}

.faq-list {
	.faq-item {
		border-bottom: 1rpx solid #f0f0f0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.faq-question {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx 0;
			
			.question-text {
				font-size: 28rpx;
				color: #333;
			}
			
			.question-arrow {
				font-size: 20rpx;
				color: #999;
				transition: transform 0.3s ease;
				
				&.active {
					transform: rotate(180deg);
				}
			}
		}
		
		.faq-answer {
			padding-bottom: 25rpx;
			
			.answer-text {
				font-size: 26rpx;
				color: #666;
				line-height: 1.6;
			}
		}
	}
}

.contact-info {
	.contact-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.contact-label {
			font-size: 28rpx;
			color: #333;
		}
		
		.contact-value {
			font-size: 28rpx;
			color: #007AFF;
		}
	}
}

.version-info {
	text-align: center;
	padding: 40rpx 20rpx;
	
	.version-text {
		display: block;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
	
	.company-text {
		font-size: 22rpx;
		color: #ccc;
	}
}
</style>