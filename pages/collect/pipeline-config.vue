<template>
	<view class="container">
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="back-icon">‹</text>
				<text class="back-text">返回</text>
			</view>
			<text class="header-title">管线信息</text>
			<view class="header-right" @click="confirmConfig">
				<text class="confirm-text">确定</text>
			</view>
		</view>

		<scroll-view class="content" scroll-y="true">
			<view class="form-section">
				<text class="section-title">基本信息</text>

				<view class="form-item">
					<text class="label">类别</text>
					<view class="select-wrapper-new">
						<uni-data-select 
							v-model="formData.category" 
							:localdata="categoryOptionsData"
							placeholder="请选择类别"
							mode="none"
							class="uni-select-custom">
						</uni-data-select>
						<text class="arrow-icon">›</text>
					</view>
				</view>

				<view class="form-item">
					<text class="label">起点号</text>
					<input class="input" v-model="formData.startPoint" placeholder="请输入起点号" />
				</view>

				<view class="form-item">
					<text class="label">终点号</text>
					<input class="input" v-model="formData.endPoint" placeholder="请输入终点号" />
				</view>

				<view class="form-item">
					<text class="label">流向</text>
					<view class="select-wrapper-new">
						<uni-data-select 
							v-model="formData.direction" 
							:localdata="directionOptionsData"
							placeholder="请选择流向"
							mode="none"
							class="uni-select-custom">
						</uni-data-select>
						<text class="arrow-icon">›</text>
					</view>
				</view>

				<view class="form-item">
					<text class="label">录像编号</text>
					<input class="input" v-model="formData.videoNumber" placeholder="请输入" />
				</view>
			</view>

			<view class="form-section">
				<text class="section-title">管线参数</text>

				<view class="form-item">
					<text class="label">起点埋深(米)</text>
					<input class="input" v-model="formData.startDepth" placeholder="请输入" type="number" />
				</view>

				<view class="form-item">
					<text class="label">终点埋深(米)</text>
					<input class="input" v-model="formData.endDepth" placeholder="请输入" type="number" />
				</view>

				<view class="form-item">
					<text class="label">埋设类型</text>
					<view class="select-wrapper-new">
						<uni-data-select 
							v-model="formData.buryType" 
							:localdata="buryTypeOptionsData"
							placeholder="请选择埋设类型"
							mode="none"
							class="uni-select-custom">
						</uni-data-select>
						<text class="arrow-icon">›</text>
					</view>
				</view>

				<view class="form-item">
					<text class="label">管线长度(米)</text>
					<input class="input" v-model="formData.length" placeholder="16.00" type="number" />
				</view>

				<view class="form-item">
					<text class="label">管径</text>
					<input class="input" v-model="formData.diameter" placeholder="请输入" />
				</view>

				<view class="form-item">
					<text class="label">材质</text>
					<view class="select-wrapper-new">
						<uni-data-select 
							v-model="formData.material" 
							:localdata="materialOptionsData"
							placeholder="请选择材质"
							mode="none"
							class="uni-select-custom">
						</uni-data-select>
						<text class="arrow-icon">›</text>
					</view>
				</view>

				<view class="form-item">
					<text class="label">权属单位</text>
					<input class="input" v-model="formData.ownerUnit" placeholder="请输入" />
				</view>
			</view>

			<view class="form-section">
				<text class="section-title">时间信息</text>

				<view class="form-item">
					<text class="label">建设日期</text>
					<picker class="picker" mode="date" :value="formData.buildDate" @change="onBuildDateChange">
						<view class="picker-text">
							<text>{{ formData.buildDate || '2010-5-10' }}</text>
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<text class="label">调查日期</text>
					<picker class="picker" mode="date" :value="formData.surveyDate" @change="onSurveyDateChange">
						<view class="picker-text">
							<text>{{ formData.surveyDate || '2022-3-22' }}</text>
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<text class="label">市政办</text>
					<input class="input" v-model="formData.municipalOffice" placeholder="请输入" />
				</view>

				<view class="form-item">
					<text class="label">所在道路</text>
					<input class="input" v-model="formData.roadLocation" placeholder="请输入" />
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import uniDataSelect from '@/uni_modules/uni-data-select/components/uni-data-select/uni-data-select.vue'

export default {
	components: {
		uniDataSelect
	},
	data() {
		return {
			formData: {
				category: '雨水',
				startPoint: '',
				endPoint: '',
				direction: '0',
				videoNumber: '',
				startDepth: '',
				endDepth: '',
				buryType: '管块',
				length: '16.00',
				diameter: '',
				material: '塑料',
				ownerUnit: '',
				buildDate: '2010-5-10',
				surveyDate: '2022-3-22',
				municipalOffice: '',
				roadLocation: ''
			},
			// uni-data-select 数据格式
			categoryOptionsData: [
				{ text: '雨水', value: '雨水' },
				{ text: '污水', value: '污水' },
				{ text: '给水', value: '给水' },
				{ text: '燃气', value: '燃气' },
				{ text: '热力', value: '热力' },
				{ text: '电力', value: '电力' },
				{ text: '通信', value: '通信' }
			],
			directionOptionsData: [
				{ text: '0', value: '0' },
				{ text: '1', value: '1' },
				{ text: '2', value: '2' }
			],
			buryTypeOptionsData: [
				{ text: '管块', value: '管块' },
				{ text: '直埋', value: '直埋' }
			],
			materialOptionsData: [
				{ text: '塑料', value: '塑料' },
				{ text: '钢材', value: '钢材' },
				{ text: '混凝土', value: '混凝土' },
				{ text: '铸铁', value: '铸铁' }
			],
			startPointData: null,
			endPointData: null
		}
	},
	onLoad(options) {
		console.log('管线配置页面接收到的参数:', options);
		// 接收传递的点位数据
		if (options.startPoint) {
			try {
				this.startPointData = JSON.parse(decodeURIComponent(options.startPoint));
				this.formData.startPoint = this.startPointData.title || this.startPointData.id || '';
				console.log('起点数据:', this.startPointData);
			} catch (e) {
				console.error('解析起点数据失败:', e);
			}
		}
		if (options.endPoint) {
			try {
				this.endPointData = JSON.parse(decodeURIComponent(options.endPoint));
				this.formData.endPoint = this.endPointData.title || this.endPointData.id || '';
				console.log('终点数据:', this.endPointData);
			} catch (e) {
				console.error('解析终点数据失败:', e);
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		confirmConfig() {
			console.log('确定按钮被点击');
			console.log('当前表单数据:', this.formData);
			console.log('起点数据:', this.startPointData);
			console.log('终点数据:', this.endPointData);

			// 验证必填字段
			if (!this.formData.startPoint || !this.formData.endPoint) {
				uni.showToast({
					title: '请填写起点号和终点号',
					icon: 'none'
				});
				return;
			}

			if (!this.startPointData || !this.endPointData) {
				uni.showToast({
					title: '缺少点位坐标数据',
					icon: 'none'
				});
				return;
			}

			// 构造管线数据
			const pipelineData = {
				...this.formData,
				startPointData: this.startPointData,
				endPointData: this.endPointData
			};

			console.log('构造的管线数据:', pipelineData);

			// 返回上一页并传递数据
			const pages = getCurrentPages();
			const prevPage = pages[pages.length - 2];
			console.log('上一页对象:', prevPage);

			if (prevPage && prevPage.$vm && prevPage.$vm.addPipeline) {
				prevPage.$vm.addPipeline(pipelineData);
				uni.navigateBack();
			} else {
				console.error('无法找到上一页的addPipeline方法');
				uni.showToast({
					title: '页面通信失败',
					icon: 'none'
				});
			}
		},

		onBuildDateChange(e) {
			this.formData.buildDate = e.detail.value;
		},
		onSurveyDateChange(e) {
			this.formData.surveyDate = e.detail.value;
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #007AFF;
}

.header {
	height: 88rpx;
	background-color: #007AFF;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-left: 30rpx;
	padding-right: 30rpx;
	/* 仅在Android平台显示 */
	/* #ifdef APP-PLUS */
	margin-top: 80rpx;
	/* #endif */
}

.header-left {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.back-icon {
	font-size: 36rpx;
	color: #FFFFFF;
	margin-right: 10rpx;
}

.back-text {
	font-size: 32rpx;
	color: #FFFFFF;
}

.header-title {
	font-size: 36rpx;
	color: #FFFFFF;
	font-weight: bold;
}

.confirm-text {
	font-size: 32rpx;
	color: #FFFFFF;
}

.content {
	flex: 1;
	padding: 20rpx;
	background-color: #ffffff;
}

.form-section {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 30rpx;
}

.form-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 30rpx;
	min-height: 80rpx;
}

.label {
	width: 200rpx;
	font-size: 28rpx;
	color: #666666;
}

.input {
	flex: 1;
	height: 80rpx;
	border: 2rpx solid #E5E5E5;
	border-radius: 8rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
}

.picker {
	flex: 1;
}

.picker-text {
	height: 80rpx;
	border: 2rpx solid #E5E5E5;
	border-radius: 8rpx;
	padding: 0 20rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}

.picker-text text:first-child {
	font-size: 28rpx;
	color: #333333;
}

.arrow {
	font-size: 24rpx;
	color: #999999;
}

/* 新的选择器包装样式 */
.select-wrapper-new {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	position: relative;
}

/* uni-data-select 自定义样式 */
.uni-select-custom {
	flex: 1;
	display: flex;
	justify-content: flex-end;
}

.uni-select-custom ::v-deep .uni-stat__select {
	width: 100%;
	justify-content: flex-end;
}

.uni-select-custom ::v-deep .uni-select {
	border: none;
	padding: 0;
	min-height: auto;
	background: transparent;
	justify-content: flex-end;
}

.uni-select-custom ::v-deep .uni-select__input-box {
	justify-content: flex-end;
	align-items: center;
}

.uni-select-custom ::v-deep .uni-select__input-text {
	text-align: right;
	color: #333333;
	font-size: 28rpx;
}

.uni-select-custom ::v-deep .uni-select__input-placeholder {
	text-align: right;
	color: #999999;
	font-size: 28rpx;
}

.uni-select-custom ::v-deep .uni-select__selector {
	right: 0;
	left: auto;
	min-width: 200rpx;
}

/* 隐藏uni-data-select自带的箭头 */
.uni-select-custom ::v-deep .uni-icons {
	display: none !important;
}

/* 自定义箭头样式 */
.select-wrapper-new .arrow-icon {
	font-size: 32rpx;
	color: #cccccc;
	transform: rotate(90deg);
	margin-left: 16rpx;
}
</style>