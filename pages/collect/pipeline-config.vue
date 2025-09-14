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
					<view class="select-wrapper-new" v-if="formData.buryType !== '手动输入'">
						<uni-data-select 
							v-model="formData.buryType" 
							:localdata="buryTypeOptionsData"
							placeholder="请选择埋设类型"
							mode="none"
							class="uni-select-custom"
							@change="onBuryTypeChange">
						</uni-data-select>
					</view>
					<input v-else class="input" v-model="formData.buryTypeCustom" placeholder="请输入埋设类型" />
				</view>

				<view class="form-item">
					<text class="label">管线长度(米)</text>
					<input class="input" v-model="formData.length" placeholder="16.00" type="number" />
				</view>

				<view class="form-item">
					<text class="label">管径</text>
					<view class="select-wrapper-new" v-if="formData.diameter !== '手动输入'">
						<uni-data-select 
							v-model="formData.diameter" 
							:localdata="diameterOptionsData"
							placeholder="请选择管径"
							mode="none"
							class="uni-select-custom"
							@change="onDiameterChange">
						</uni-data-select>
					</view>
					<input v-else class="input" v-model="formData.diameterCustom" placeholder="请输入管径" />
				</view>

				<view class="form-item">
					<text class="label">材质</text>
					<view class="select-wrapper-new" v-if="formData.material !== '手动输入'">
						<uni-data-select 
							v-model="formData.material" 
							:localdata="materialOptionsData"
							placeholder="请选择材质"
							mode="none"
							class="uni-select-custom"
							@change="onMaterialChange">
						</uni-data-select>
					</view>
					<input v-else class="input" v-model="formData.materialCustom" placeholder="请输入材质" />
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
					<picker class="picker" mode="date" :value="formData.buildDate || getCurrentDate()" @change="onBuildDateChange">
						<view class="picker-text">
							<text>{{ formData.buildDate || '请选择建设日期' }}</text>
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<text class="label">调查日期</text>
					<picker class="picker" mode="date" :value="formData.surveyDate || getCurrentDate()" @change="onSurveyDateChange">
						<view class="picker-text">
							<text>{{ formData.surveyDate || '请选择调查日期' }}</text>
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

				<view class="form-item">
					<text class="label">起始道路</text>
					<input class="input" v-model="formData.startRoad" placeholder="请输入" />
				</view>

				<view class="form-item">
					<text class="label">终止道路</text>
					<input class="input" v-model="formData.endRoad" placeholder="请输入" />
				</view>

				<view class="form-item">
					<text class="label">检查人员</text>
					<input class="input" v-model="formData.inspector" placeholder="请输入" />
				</view>

				<view class="form-item">
					<text class="label">探测人员</text>
					<input class="input" v-model="formData.detector" placeholder="请输入" />
				</view>

				<view class="form-item">
					<text class="label">备注</text>
					<input class="input" v-model="formData.remark" placeholder="请输入" />
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
				buryType: '',
				buryTypeCustom: '',
				length: '16.00',
				diameter: '',
				diameterCustom: '',
				material: '',
				materialCustom: '',
				ownerUnit: '',
				buildDate: '',
				surveyDate: '',
				municipalOffice: '',
				roadLocation: '',
				startRoad: '',
				endRoad: '',
				inspector: '',
				detector: '',
				remark: ''
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
				{ text: '直埋', value: '直埋' },
				{ text: '管埋', value: '管埋' },
				{ text: '架空', value: '架空' },
				{ text: '方沟', value: '方沟' },
				{ text: '拱形管沟', value: '拱形管沟' },
				{ text: '矩形管沟', value: '矩形管沟' },
				{ text: '管块', value: '管块' },
				{ text: '手动输入', value: '手动输入' }
			],
			materialOptionsData: [
				{ text: '砼', value: '砼' },
				{ text: '钢筋混泥土', value: '钢筋混泥土' },
				{ text: '铸铁', value: '铸铁' },
				{ text: '砖石', value: '砖石' },
				{ text: '钢', value: '钢' },
				{ text: '石棉', value: '石棉' },
				{ text: 'PE', value: 'PE' },
				{ text: 'PVC', value: 'PVC' },
				{ text: 'PE波纹管', value: 'PE波纹管' },
				{ text: '塑料', value: '塑料' },
				{ text: '管线材质', value: '管线材质' },
				{ text: '手动输入', value: '手动输入' }
			],
			diameterOptionsData: [
				{ text: '100x100', value: '100x100' },
				{ text: '200x200', value: '200x200' },
				{ text: '300x300', value: '300x300' },
				{ text: '手动输入', value: '手动输入' }
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
		},
		onBuryTypeChange(e) {
			console.log('埋设类型变更:', e);
			if (e === '手动输入') {
				this.formData.buryTypeCustom = '';
			}
		},
		onMaterialChange(e) {
			console.log('材质变更:', e);
			if (e === '手动输入') {
				this.formData.materialCustom = '';
			}
		},
		onDiameterChange(e) {
			console.log('管径变更:', e);
			if (e === '手动输入') {
				this.formData.diameterCustom = '';
			}
		},
		
		getCurrentDate() {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
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
	overflow: hidden;
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
	background-color: #F5F5F5;
	box-sizing: border-box;
}

/* #ifdef APP-PLUS */
.content {
	height: calc(100vh - 168rpx);
}
/* #endif */

/* #ifndef APP-PLUS */
.content {
	height: calc(100vh - 88rpx);
}
/* #endif */

.form-section {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
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

.form-item:last-child {
	margin-bottom: 0;
}

.label {
	width: 200rpx;
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.input {
	flex: 1;
	height: 80rpx;
	border: 2rpx solid #E5E5E5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
	background-color: #FAFAFA;
}

.input:focus {
	border-color: #007AFF;
	background-color: #FFFFFF;
}

.picker {
	flex: 1;
}

.picker-text {
	height: 80rpx;
	border: 2rpx solid #E5E5E5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	background-color: #FAFAFA;
}

.picker-text text:first-child {
	font-size: 28rpx;
	color: #333333;
}

.arrow {
	font-size: 24rpx;
	color: #999999;
}

/* 选择器包装样式 */
.select-wrapper-new {
	flex: 1;
	position: relative;
	height: 80rpx;
	border: 2rpx solid #E5E5E5;
	border-radius: 12rpx;
	background-color: #FAFAFA;
	display: flex;
	align-items: center;
}

.select-wrapper-new:focus-within {
	border-color: #007AFF;
	background-color: #FFFFFF;
}

/* uni-data-select 自定义样式 */
.uni-select-custom {
	flex: 1;
	height: 100%;
}

.uni-select-custom ::v-deep .uni-stat__select {
	width: 100%;
	height: 100%;
}

.uni-select-custom ::v-deep .uni-select {
	border: none;
	padding: 0 24rpx;
	min-height: 76rpx;
	height: 76rpx;
	background: transparent;
	border-radius: 0;
}

.uni-select-custom ::v-deep .uni-select__input-box {
	height: 100%;
	align-items: center;
	justify-content: space-between;
}

.uni-select-custom ::v-deep .uni-select__input-text {
	color: #333333;
	font-size: 28rpx;
	text-align: left;
}

.uni-select-custom ::v-deep .uni-select__input-placeholder {
	color: #999999;
	font-size: 28rpx;
	text-align: left;
}

.uni-select-custom ::v-deep .uni-select__selector {
	right: 0;
	left: auto;
	min-width: 300rpx;
	max-height: 400rpx;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.uni-select-custom ::v-deep .uni-select__selector-item {
	padding: 20rpx 24rpx;
	font-size: 28rpx;
}

.uni-select-custom ::v-deep .uni-select__selector-item:hover {
	background-color: #F0F8FF;
}

/* 自定义箭头样式 */
.select-wrapper-new .arrow-icon {
	font-size: 28rpx;
	color: #999999;
	transform: rotate(90deg);
	margin-right: 24rpx;
	transition: transform 0.3s ease;
}

.select-wrapper-new.active .arrow-icon {
	transform: rotate(270deg);
}

/* uni-data-select 箭头图标样式调整 */
.uni-select-custom ::v-deep .uni-icons {
	font-size: 24rpx !important;
	color: #999999 !important;
}

.uni-select-custom ::v-deep .uni-select__input-box .uni-icons {
	margin-left: 16rpx;
}

/* 确保箭头图标正确显示 */
.uni-select-custom ::v-deep .uni-select__input-box .uni-icons:before {
	content: "▼" !important;
	font-family: inherit !important;
}
</style>