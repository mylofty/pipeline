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
		<scroll-view 
			v-if="activeTab === 'basic'" 
			class="content" 
			scroll-y="true" 
			:scroll-with-animation="false" 
			:enable-back-to-top="false"
			:scroll-anchoring="false"
			:refresher-enabled="false"
			:enhanced="true"
			:bounces="false"
			:show-scrollbar="false"
			:fast-deceleration="false"
		>
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

			<!-- 经度 -->
			<view class="form-item">
				<text class="label">经度</text>
				<input class="input" :value="longitude.toFixed(6)" placeholder="经度" disabled />
			</view>

			<!-- 纬度 -->
			<view class="form-item">
				<text class="label">纬度</text>
				<input class="input" :value="latitude.toFixed(6)" placeholder="纬度" disabled />
			</view>

			<!-- 特征 -->
			<view class="form-item">
				<text class="label">特征</text>
				<view class="select-wrapper-new" v-if="formData.feature !== '手动输入'">
					<uni-data-select 
						v-model="formData.feature" 
						:localdata="featureOptionsData"
						placeholder="请选择特征"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
				<input v-else class="input" v-model="formData.featureCustom" placeholder="请输入特征" />
			</view>

			<!-- 附属物 -->
			<view class="form-item">
				<text class="label">附属物</text>
				<view class="select-wrapper-new" v-if="formData.attachment !== '手动输入'">
					<uni-data-select 
						v-model="formData.attachment" 
						:localdata="attachmentOptionsData"
						placeholder="请选择附属物"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
				<input v-else class="input" v-model="formData.attachmentCustom" placeholder="请输入附属物" />
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

			<!-- 建构筑物 -->
			<view class="form-item">
				<text class="label">建构筑物</text>
				<input class="input" v-model="formData.building" placeholder="请输入建构筑物" />
			</view>

			<!-- 街道办 -->
			<view class="form-item">
				<text class="label">街道办</text>
				<input class="input" v-model="formData.streetOffice" placeholder="请输入街道办" />
			</view>

			<!-- 排水户 -->
			<view class="form-item">
				<text class="label">排水户</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.drainageUser" 
						:localdata="drainageUserOptionsData"
						placeholder="请选择排水户"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 排水类型 -->
			<view class="form-item">
				<text class="label">排水类型</text>
				<view class="select-wrapper-new">
					<uni-data-select 
						v-model="formData.drainageType" 
						:localdata="drainageTypeOptionsData"
						placeholder="请选择排水类型"
						mode="none"
						class="uni-select-custom">
					</uni-data-select>
					<text class="arrow-icon">›</text>
				</view>
			</view>

			<!-- 地面高程(米) -->
			<view class="form-item">
				<text class="label">地面高程(米)</text>
				<input class="input" v-model="formData.groundElevation" placeholder="请输入地面高程" type="digit" />
			</view>

			<!-- 缺陷类别 -->
			<view class="form-item">
				<text class="label">缺陷类别</text>
				<input class="input" v-model="formData.defectCategory" placeholder="请输入缺陷类别" />
			</view>

			<!-- 缺陷等级 -->
			<view class="form-item">
				<text class="label">缺陷等级</text>
				<input class="input" v-model="formData.defectLevel" placeholder="请输入缺陷等级" />
			</view>

			<!-- 权属单位 -->
			<view class="form-item">
				<text class="label">权属单位</text>
				<input class="input" v-model="formData.ownershipUnit" placeholder="请输入权属单位" />
			</view>

			<!-- 检查人员 -->
			<view class="form-item">
				<text class="label">检查人员</text>
				<input class="input" v-model="formData.inspector" placeholder="请输入检查人员" />
			</view>

			<!-- 探测单位 -->
			<view class="form-item">
				<text class="label">探测单位</text>
				<input class="input" v-model="formData.detectionUnit" placeholder="请输入探测单位" />
			</view>

			<!-- 备注 -->
			<view class="form-item">
				<text class="label">备注</text>
				<textarea class="input" v-model="formData.remarks" placeholder="请输入备注" style="height: 80rpx; line-height: 1.4;"></textarea>
			</view>
		</scroll-view>

		<!-- 附件内容 -->
		<scroll-view 
			v-if="activeTab === 'attachment'" 
			class="content" 
			scroll-y="true"
			:scroll-with-animation="false"
			:enable-back-to-top="false"
			:scroll-anchoring="false"
			:refresher-enabled="false"
			:enhanced="true"
			:bounces="false"
			:show-scrollbar="false"
			:fast-deceleration="false"
		>
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
					feature: '',
					featureCustom: '', // 手动输入的特征值
					attachment: '',
					attachmentCustom: '', // 手动输入的附属物值
					isNetworked: '',
					coverType: '',
					plateNumber: '',
					internalCheck: '',
					externalCheck: '',
					depth: '',
					road: '',
					coverMaterial: '',
					coverCategory: '',
					coverSpec: '',
					// 新增字段
					building: '',
					streetOffice: '',
					drainageUser: '',
					drainageType: '',
					groundElevation: '',
					defectCategory: '',
					defectLevel: '',
					ownershipUnit: '',
					inspector: '',
					detectionUnit: '',
					remarks: ''
				},
				// uni-data-select 选择器数据 - 从collect页面layerOptions的排水分类子项获取
				categoryOptionsData: [
					{ text: '雨水', value: 'rainwater' },
					{ text: '污水', value: 'sewage' },
					{ text: '合流', value: 'combined' },
					{ text: '生活给水', value: 'domestic_water' },
					{ text: '工业给水', value: 'industrial_water' },
					{ text: '消防给水', value: 'fire_water' },
					{ text: '液化气', value: 'lpg' },
					{ text: '天然气', value: 'natural_gas' },
					{ text: '煤气', value: 'coal_gas' },
					{ text: '路灯', value: 'street_light' },
					{ text: '交通信号灯', value: 'traffic_light' },
					{ text: '供电', value: 'power_supply' },
					{ text: '中国电信', value: 'china_telecom' },
					{ text: '中国移动', value: 'china_mobile' },
					{ text: '中国联通', value: 'china_unicom' },
					{ text: '热力', value: 'heating' },
					{ text: '废水', value: 'wastewater' },
					{ text: '石油', value: 'oil' },
					{ text: '综合管沟', value: 'comprehensive_tunnel' },
					{ text: '不明管线', value: 'unknown_pipeline' }
				],
				pointTypeOptionsData: [
					{ text: '实点', value: '实点' },
					{ text: '虚点', value: '虚点' }
				],
				featureOptionsData: [
					{ text: '三通', value: '三通' },
					{ text: '四通', value: '四通' },
					{ text: '五通', value: '五通' },
					{ text: '六通', value: '六通' },
					{ text: '七通', value: '七通' },
					{ text: '八通', value: '八通' },
					{ text: '九通', value: '九通' },
					{ text: '多通', value: '多通' },
					{ text: '户出', value: '户出' },
					{ text: '户入', value: '户入' },
					{ text: '起始点', value: '起始点' },
					{ text: '终止点', value: '终止点' },
					{ text: '进水口', value: '进水口' },
					{ text: '出水口', value: '出水口' },
					{ text: '预留口', value: '预留口' },
					{ text: '非普查区', value: '非普查区' },
					{ text: '出地', value: '出地' },
					{ text: '变径', value: '变径' },
					{ text: '拐点', value: '拐点' },
					{ text: '井边点', value: '井边点' },
					{ text: '井内点', value: '井内点' },
					{ text: '沟边点', value: '沟边点' },
					{ text: '转折点', value: '转折点' },
					{ text: '手动输入', value: '手动输入' }
				],
				attachmentOptionsData: [
					{ text: '检查井', value: '检查井' },
					{ text: '检修井', value: '检修井' },
					{ text: '雨水篦', value: '雨水篦' },
					{ text: '立管', value: '立管' },
					{ text: '溢流井', value: '溢流井' },
					{ text: '泵站', value: '泵站' },
					{ text: '窨井', value: '窨井' },
					{ text: '化粪池', value: '化粪池' },
					{ text: '变径点', value: '变径点' },
					{ text: '进水口', value: '进水口' },
					{ text: '出水口', value: '出水口' },
					{ text: '预留口', value: '预留口' },
					{ text: '沉泥井', value: '沉泥井' },
					{ text: '渗水井', value: '渗水井' },
					{ text: '冲洗井', value: '冲洗井' },
					{ text: '跌水井', value: '跌水井' },
					{ text: '污水井', value: '污水井' },
					{ text: '雨水井', value: '雨水井' },
					{ text: '闸门井', value: '闸门井' },
					{ text: '阀门井阀门', value: '阀门井阀门' },
					{ text: '非普查', value: '非普查' },
					{ text: '出地点', value: '出地点' },
					{ text: '管帽', value: '管帽' },
					{ text: '连接暗井', value: '连接暗井' },
					{ text: '水潮门井', value: '水潮门井' },
					{ text: '倒虹管', value: '倒虹管' },
					{ text: '方形污水窨井', value: '方形污水窨井' },
					{ text: '圆形污水窨井', value: '圆形污水窨井' },
					{ text: '方形污水篦子', value: '方形污水篦子' },
					{ text: '方形雨水窨井', value: '方形雨水窨井' },
					{ text: '圆形雨水窨井', value: '圆形雨水窨井' },
					{ text: '方形雨水篦子', value: '方形雨水篦子' },
					{ text: '井边框', value: '井边框' },
					{ text: '手动输入', value: '手动输入' }
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
					{ text: '链条或锁具', value: '链条或锁具' },
					{ text: '爬梯松动、锈蚀或缺损', value: '爬梯松动、锈蚀或缺损' },
					{ text: '井壁泥垢', value: '井壁泥垢' },
					{ text: '井壁裂缝', value: '井壁裂缝' },
					{ text: '井壁渗漏', value: '井壁渗漏' },
					{ text: '抹面脱落', value: '抹面脱落' },
					{ text: '管口孔洞', value: '管口孔洞' },
					{ text: '流槽破损', value: '流槽破损' },
					{ text: '井底积泥、杂物', value: '井底积泥、杂物' },
					{ text: '水流不畅', value: '水流不畅' },
					{ text: '浮渣', value: '浮渣' }
				],
				externalCheckOptionsData: [
					{ text: '井盖丢失', value: '井盖丢失' },
					{ text: '井盖破损', value: '井盖破损' },
					{ text: '井框破损', value: '井框破损' },
					{ text: '盖框间隙', value: '盖框间隙' },
					{ text: '盖框高差', value: '盖框高差' },
					{ text: '盖框突出或凹陷', value: '盖框突出或凹陷' },
					{ text: '跳动和声响', value: '跳动和声响' },
					{ text: '周边路面破损、沉降', value: '周边路面破损、沉降' },
					{ text: '井盖标示错误', value: '井盖标示错误' },
					{ text: '道路上的井室盖是否为重型井盖', value: '道路上的井室盖是否为重型井盖' },
					{ text: '其他', value: '其他' }
				],
				coverMaterialOptionsData: [
					{ text: '铸铁', value: '铸铁' },
					{ text: '水泥', value: '水泥' },
					{ text: '复合材料', value: '复合材料' }
				],
				drainageUserOptionsData: [
					{ text: '政府机关事业单位', value: '政府机关事业单位' },
					{ text: '生产企业', value: '生产企业' },
					{ text: '工业园', value: '工业园' },
					{ text: '学校', value: '学校' },
					{ text: '疗养院', value: '疗养院' },
					{ text: '社区诊所', value: '社区诊所' },
					{ text: '住宅小区', value: '住宅小区' },
					{ text: '临街商户', value: '临街商户' },
					{ text: '商业体', value: '商业体' },
					{ text: '大型商场', value: '大型商场' },
					{ text: '餐饮酒店', value: '餐饮酒店' },
					{ text: '汽修暨洗车店', value: '汽修暨洗车店' },
					{ text: '施工工地', value: '施工工地' },
					{ text: '养殖场', value: '养殖场' },
					{ text: '其他', value: '其他' }
				],
				drainageTypeOptionsData: [
					{ text: '生活污水', value: '生活污水' },
					{ text: '餐饮污水', value: '餐饮污水' },
					{ text: '工业污水', value: '工业污水' },
					{ text: '医疗废水', value: '医疗废水' },
					{ text: '养殖业', value: '养殖业' },
					{ text: '其他', value: '其他' }
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
					// 如果选择了手动输入，使用自定义特征值
					feature: this.formData.feature === '手动输入' ? this.formData.featureCustom : this.formData.feature,
					// 如果选择了手动输入，使用自定义附属物值
					attachment: this.formData.attachment === '手动输入' ? this.formData.attachmentCustom : this.formData.attachment,
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
		overflow: hidden;
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
		height: 100rpx;
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
		/* Android滚动优化 */
		-webkit-overflow-scrolling: touch;
		overflow-scrolling: touch;
		/* 确保内容区域不会超出容器 */
		overflow: hidden;
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