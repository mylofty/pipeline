<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="back-icon">‹</text>
				<text class="back-text">返回</text>
			</view>
			<text class="header-title">管点信息</text>
			<view class="header-right" @click="saveInfo">
				<text class="save-text">保存</text>
			</view>
		</view>

		<!-- 标签页 -->
		<view class="tabs">
			<view class="tab-item" :class="{ active: activeTab === 'basic' }" @click="switchTab('basic')">
				<text class="tab-text">基本信息</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'attachment' }" @click="switchTab('attachment')">
				<text class="tab-text">附件</text>
			</view>
		</view>

		<!-- 基本信息内容 -->
		<scroll-view v-if="activeTab === 'basic'" class="content" scroll-y="true">
			<!-- 类别 -->
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

			<!-- 物探点号 -->
			<view class="form-item">
				<text class="label">物探点号</text>
				<input class="input" v-model="formData.pointNumber" placeholder="请输入物探点号" />
			</view>

			<!-- 管点种类 -->
			<view class="form-item">
				<text class="label">管点种类</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.pointType" 
						:localdata="pointTypeOptionsData"
						placeholder="请选择管点种类"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 特征 -->
			<view class="form-item">
				<text class="label">特征</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.feature" 
						:localdata="featureOptionsData"
						placeholder="请选择特征"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 附属物 -->
			<view class="form-item">
				<text class="label">附属物</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.attachment" 
						:localdata="attachmentOptionsData"
						placeholder="请选择附属物"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 是否挂网 -->
			<view class="form-item">
				<text class="label">是否挂网</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.isNetworked" 
						:localdata="networkOptionsData"
						placeholder="请选择是否挂网"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 检查井盖类型 -->
			<view class="form-item">
				<text class="label">检查井盖类型</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.coverType" 
						:localdata="coverTypeOptionsData"
						placeholder="请选择检查井盖类型"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 井内挂牌编号 -->
			<view class="form-item">
				<text class="label">井内挂牌编号</text>
				<input class="input" v-model="formData.plateNumber" placeholder="请输入" />
			</view>

			<!-- 内部检查 -->
			<view class="form-item">
				<text class="label">内部检查</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.internalCheck" 
						:localdata="internalCheckOptionsData"
						placeholder="请选择内部检查状态"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 外部检查 -->
			<view class="form-item">
				<text class="label">外部检查</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.externalCheck" 
						:localdata="externalCheckOptionsData"
						placeholder="请选择外部检查状态"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 井底深(米) -->
			<view class="form-item">
				<text class="label">井底深(米)</text>
				<input class="input" v-model="formData.depth" placeholder="请输入" type="number" />
			</view>

			<!-- 所属道路 -->
			<view class="form-item">
				<text class="label">所属道路</text>
				<input class="input" v-model="formData.road" placeholder="请输入" />
			</view>

			<!-- 井盖材质 -->
			<view class="form-item">
				<text class="label">井盖材质</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.coverMaterial" 
						:localdata="coverMaterialOptionsData"
						placeholder="请选择井盖材质"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 井盖类型 -->
			<view class="form-item">
				<text class="label">井盖类型</text>
				<input class="input" v-model="formData.coverCategory" placeholder="请输入" />
			</view>

			<!-- 井盖规格 -->
			<view class="form-item">
				<text class="label">井盖规格</text>
				<input class="input" v-model="formData.coverSpec" placeholder="请输入" />
			</view>
		</scroll-view>

		<!-- 附件内容 -->
		<scroll-view v-if="activeTab === 'attachment'" class="content" scroll-y="true">
			<view class="attachment-section">
				<view class="attachment-header">
					<text class="attachment-title">附件</text>
					<view class="attachment-actions">
						<view class="action-btn" @click="selectFromAlbum">
							<text class="action-icon">🖼️</text>
						</view>
						<view class="action-btn" @click="takePhoto">
							<text class="action-icon">📷</text>
						</view>
					</view>
				</view>

				<!-- 附件列表 -->
				<view class="attachment-list" v-if="attachments.length > 0">
					<view class="attachment-item" v-for="(item, index) in attachments" :key="index">
						<image class="attachment-image" :src="item.url" mode="aspectFill"
							@click="previewImage(item.url)"></image>
						<view class="delete-btn" @click="deleteAttachment(index)">
							<text class="delete-icon">×</text>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="attachments.length === 0">
					<text class="empty-text">暂无附件，点击右上角按钮添加</text>
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
				activeTab: 'basic',
				showPicker: false,
				currentPickerType: '',
				pickerData: [],
				longitude: 0,
				latitude: 0,
				attachments: [],
				formData: {
					category: '雨水',
					pointNumber: '',
					pointType: '实点',
					feature: '正常',
					attachment: '无',
					isNetworked: '否',
					coverType: '圆形',
					plateNumber: '',
					internalCheck: '正常',
					externalCheck: '正常',
					depth: '',
					road: '',
					coverMaterial: '铸铁',
					coverCategory: '',
					coverSpec: ''
				},
				// uni-data-select 选择器数据
				categoryOptionsData: [
					{ text: '雨水', value: '雨水' },
					{ text: '污水', value: '污水' },
					{ text: '合流', value: '合流' }
				],
				pointTypeOptionsData: [
					{ text: '实点', value: '实点' },
					{ text: '虚点', value: '虚点' }
				],
				featureOptionsData: [
					{ text: '正常', value: '正常' },
					{ text: '破损', value: '破损' },
					{ text: '缺失', value: '缺失' }
				],
				attachmentOptionsData: [
					{ text: '无', value: '无' },
					{ text: '雨篦子', value: '雨篦子' },
					{ text: '检查井', value: '检查井' }
				],
				networkOptionsData: [
					{ text: '是', value: '是' },
					{ text: '否', value: '否' }
				],
				coverTypeOptionsData: [
					{ text: '圆形', value: '圆形' },
					{ text: '方形', value: '方形' },
					{ text: '矩形', value: '矩形' }
				],
				internalCheckOptionsData: [
					{ text: '正常', value: '正常' },
					{ text: '异常', value: '异常' }
				],
				externalCheckOptionsData: [
					{ text: '正常', value: '正常' },
					{ text: '异常', value: '异常' }
				],
				coverMaterialOptionsData: [
					{ text: '铸铁', value: '铸铁' },
					{ text: '水泥', value: '水泥' },
					{ text: '复合材料', value: '复合材料' }
				]
			}
		},
		onLoad(options) {
			// 接收地图传递的坐标信息
			if (options.longitude && options.latitude) {
				this.longitude = parseFloat(options.longitude);
				this.latitude = parseFloat(options.latitude);
				// 可以根据坐标自动填充一些信息，比如物探点号
				this.formData.pointNumber = `1YS${Date.now().toString().slice(-3)}`;
			}
		},
		methods: {
			// 切换标签页
			switchTab(tab) {
				this.activeTab = tab;
			},

			// 返回
			goBack() {
				uni.navigateBack();
			},

			// 保存信息
			saveInfo() {
				// 验证必填字段
				if (!this.formData.pointNumber) {
					uni.showToast({
						title: '请输入物探点号',
						icon: 'none'
					});
					return;
				}

				// 保存数据逻辑
				const pipeInfo = {
					...this.formData,
					longitude: this.longitude,
					latitude: this.latitude,
					attachments: this.attachments,
					createTime: new Date().toISOString()
				};

				// 这里可以调用API保存数据
				console.log('保存管点信息:', pipeInfo);

				// 通过事件总线或全局状态管理传递数据到地图页面
				// 使用uni.$emit发送事件，让地图页面监听并添加标记点
				// 使用时间戳后6位 + 随机数确保唯一性
				const timePart = Date.now() % 10000; // 后4位时间戳
				const randomPart = Math.floor(Math.random() * 100); // 2位随机数
				const markerId = timePart * 100 + randomPart;

				uni.$emit('addPipePoint', {
					id: markerId,
					markerId: markerId,
					longitude: this.longitude,
					latitude: this.latitude,
					title: this.formData.pointNumber,
					iconPath: '/static/icons/pipe-point-backup.svg',
					width: 32,
					height: 32,
					callout: {
						content: this.formData.pointNumber,
						color: '#000000',
						fontSize: 12,
						borderRadius: 4,
						bgColor: '#ffffff',
						padding: 6,
						display: 'ALWAYS'
					},
					data: pipeInfo
				});

				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});

				// 返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			},



			// 从相册选择图片
			selectFromAlbum() {
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						res.tempFilePaths.forEach(path => {
							this.attachments.push({
								url: path,
								type: 'image',
								name: `图片${this.attachments.length + 1}`
							});
						});
						uni.showToast({
							title: `已添加${res.tempFilePaths.length}张图片`,
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('选择图片失败:', err);
						uni.showToast({
							title: '选择图片失败',
							icon: 'none'
						});
					}
				});
			},

			// 拍照
			takePhoto() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'],
					success: (res) => {
						this.attachments.push({
							url: res.tempFilePaths[0],
							type: 'image',
							name: `拍照${this.attachments.length + 1}`
						});
						uni.showToast({
							title: '拍照成功',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('拍照失败:', err);
						uni.showToast({
							title: '拍照失败',
							icon: 'none'
						});
					}
				});
			},

			// 预览图片
			previewImage(url) {
				const urls = this.attachments.map(item => item.url);
				uni.previewImage({
					urls: urls,
					current: url
				});
			},

			// 删除附件
			deleteAttachment(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个附件吗？',
					success: (res) => {
						if (res.confirm) {
							this.attachments.splice(index, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #1890ff;
	}

	.header {
		height: 88rpx;
		background-color: #1890ff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 32rpx;
		padding-right: 32rpx;
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
		font-size: 40rpx;
		color: #ffffff;
		margin-right: 16rpx;
	}

	.back-text {
		font-size: 32rpx;
		color: #ffffff;
	}

	.header-title {
		font-size: 36rpx;
		color: #ffffff;
		font-weight: 500;
	}

	.save-text {
		font-size: 32rpx;
		color: #ffffff;
	}

	.tabs {
		height: 88rpx;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		border-bottom: 1rpx solid #e8e8e8;
	}

	.tab-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.tab-item.active .tab-text {
		color: #1890ff;
		font-weight: 500;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background-color: #1890ff;
	}

	.tab-text {
		font-size: 32rpx;
		color: #666666;
	}

	.content {
		flex: 1;
		padding: 0 20rpx;
		background-color: #ffffff;
	}

	.form-item {
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		margin-bottom: 2rpx;
		border-bottom: 1rpx solid #f0f0f0;
		position: relative;
	}

	.label {
		font-size: 32rpx;
		color: #333333;
		width: 200rpx;
	}

	.input {
		flex: 1;
		font-size: 32rpx;
		color: #333333;
		text-align: right;
	}

	.select-wrapper {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.select-text {
		font-size: 32rpx;
		color: #333333;
		margin-right: 16rpx;
	}

	.arrow-icon {
		font-size: 32rpx;
		color: #cccccc;
		transform: rotate(90deg);
	}

	.attachment-section {
		padding: 32rpx;
	}

	.attachment-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
	}

	.attachment-title {
		font-size: 32rpx;
		color: #333333;
		font-weight: 500;
	}

	.attachment-actions {
		display: flex;
		flex-direction: row;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 16rpx;
		width: 80rpx;
		height: 80rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
	}

	.action-icon {
		font-size: 32rpx;
	}

	.attachment-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.attachment-item {
		width: 200rpx;
		height: 200rpx;
		margin-right: 16rpx;
		margin-bottom: 16rpx;
		position: relative;
	}

	.attachment-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 8rpx;
	}

	.delete-btn {
		position: absolute;
		top: -8rpx;
		right: -8rpx;
		width: 32rpx;
		height: 32rpx;
		background-color: #ff4d4f;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delete-icon {
		font-size: 20rpx;
		color: #ffffff;
		line-height: 32rpx;
	}

	.empty-state {
		padding: 100rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty-text {
		font-size: 28rpx;
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
		font-size: 32rpx;
	}

	.uni-select-custom ::v-deep .uni-select__input-placeholder {
		text-align: right;
		color: #999999;
		font-size: 32rpx;
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