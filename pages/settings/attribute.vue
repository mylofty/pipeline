<template>
	<view class="attribute-container">
		<view class="header">
			<text class="title">属性设置</text>
			<text class="subtitle">控制属性在采集中是否显示</text>
		</view>
		
		<!-- 管点属性 -->
		<view class="attribute-section">
			<text class="section-title">管点属性</text>
			<view class="attribute-list">
				<view class="attribute-item" v-for="(attr, index) in pointAttributes" :key="index">
					<view class="attribute-info">
						<text class="attribute-name">{{ attr.label }}</text>
						<text class="attribute-desc">{{ attr.description }}</text>
					</view>
					<switch :checked="attr.enabled" @change="toggleAttribute('point', index, $event)" />
				</view>
			</view>
		</view>
		
		<!-- 管线属性 -->
		<view class="attribute-section">
			<text class="section-title">管线属性</text>
			<view class="attribute-list">
				<view class="attribute-item" v-for="(attr, index) in lineAttributes" :key="index">
					<view class="attribute-info">
						<text class="attribute-name">{{ attr.label }}</text>
						<text class="attribute-desc">{{ attr.description }}</text>
					</view>
					<switch :checked="attr.enabled" @change="toggleAttribute('line', index, $event)" />
				</view>
			</view>
		</view>
		
		<!-- 保存按钮 -->
		<view class="save-actions">
			<button class="btn-reset" @click="resetSettings">重置默认</button>
			<button class="btn-save" @click="saveSettings">保存设置</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pointAttributes: [
				{ key: 'pointId', label: '点号', description: '管点编号', enabled: true, required: true },
				{ key: 'type', label: '管点类型', description: '检查井、阀门井等', enabled: true, required: true },
				{ key: 'material', label: '材质', description: '管道材质', enabled: true, required: false },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '埋设深度(m)', enabled: true, required: false },
				{ key: 'pressure', label: '压力等级', description: '管道压力等级', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管点安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],
			lineAttributes: [
				{ key: 'lineId', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'material', label: '材质', description: '管道材质', enabled: true, required: true },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: true },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'pressure', label: '压力等级', description: '管道压力等级', enabled: true, required: false },
				{ key: 'flowDirection', label: '流向', description: '管道流向', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管线安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			]
		}
	},
	onLoad() {
		this.loadSettings()
	},
	methods: {
		loadSettings() {
			const savedPointAttrs = uni.getStorageSync('pointAttributeSettings')
			const savedLineAttrs = uni.getStorageSync('lineAttributeSettings')
			
			if (savedPointAttrs) {
				this.pointAttributes = savedPointAttrs
			}
			if (savedLineAttrs) {
				this.lineAttributes = savedLineAttrs
			}
		},
		
		toggleAttribute(type, index, event) {
			const attributes = type === 'point' ? this.pointAttributes : this.lineAttributes
			const attr = attributes[index]
			
			if (attr.required && !event.detail.value) {
				uni.showToast({
					title: '必填属性不能禁用',
					icon: 'none'
				})
				return
			}
			
			attr.enabled = event.detail.value
		},
		
		saveSettings() {
			uni.setStorageSync('pointAttributeSettings', this.pointAttributes)
			uni.setStorageSync('lineAttributeSettings', this.lineAttributes)
			
			uni.showToast({
				title: '设置已保存',
				icon: 'success'
			})
		},
		
		resetSettings() {
			uni.showModal({
				title: '重置设置',
				content: '确定要重置为默认设置吗？',
				success: (res) => {
					if (res.confirm) {
						// 重置为默认状态
						this.pointAttributes.forEach(attr => {
							attr.enabled = attr.required || ['type', 'material', 'diameter', 'depth', 'remark'].includes(attr.key)
						})
						
						this.lineAttributes.forEach(attr => {
							attr.enabled = attr.required || ['material', 'diameter', 'length', 'pressure', 'remark'].includes(attr.key)
						})
						
						uni.showToast({
							title: '已重置为默认设置',
							icon: 'success'
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.attribute-container {
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

.attribute-section {
	margin-bottom: 40rpx;
	
	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.attribute-list {
		background: white;
		border-radius: 15rpx;
		overflow: hidden;
		
		.attribute-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.attribute-info {
				flex: 1;
				
				.attribute-name {
					display: block;
					font-size: 30rpx;
					color: #333;
					margin-bottom: 8rpx;
				}
				
				.attribute-desc {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
}

.save-actions {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
	
	.btn-reset, .btn-save {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		border: none;
	}
	
	.btn-reset {
		background: #f0f0f0;
		color: #666;
	}
	
	.btn-save {
		background: #007AFF;
		color: white;
	}
}
</style>