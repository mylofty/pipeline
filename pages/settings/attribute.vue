<template>
	<view class="attribute-container">
		<!-- 属性配置区域 -->
		<view class="content-area">
			<!-- 排水管点 -->
			<CollapseItem title="排水管点(PS)" :open="true">
				<AttributeGroup :attributes="drainagePointAttrs" @toggle="handleToggle('drainagePoint', $event)" />
			</CollapseItem>

			<!-- 排水管线 -->
			<CollapseItem title="排水管线(PS)">
				<AttributeGroup :attributes="drainageLineAttrs" @toggle="handleToggle('drainageLine', $event)" />
			</CollapseItem>

			<!-- 电力管点 -->
			<CollapseItem title="电力管点(DL)">
				<AttributeGroup :attributes="powerPointAttrs" @toggle="handleToggle('powerPoint', $event)" />
			</CollapseItem>

			<!-- 电力管线 -->
			<CollapseItem title="电力管线(DL)">
				<AttributeGroup :attributes="powerLineAttrs" @toggle="handleToggle('powerLine', $event)" />
			</CollapseItem>

			<!-- 通信管点 -->
			<CollapseItem title="通信管点(TX)">
				<AttributeGroup :attributes="telecomPointAttrs" @toggle="handleToggle('telecomPoint', $event)" />
			</CollapseItem>

			<!-- 通信管线 -->
			<CollapseItem title="通信管线(TX)">
				<AttributeGroup :attributes="telecomLineAttrs" @toggle="handleToggle('telecomLine', $event)" />
			</CollapseItem>

			<!-- 给水管点 -->
			<CollapseItem title="给水管点(JS)">
				<AttributeGroup :attributes="waterPointAttrs" @toggle="handleToggle('waterPoint', $event)" />
			</CollapseItem>

			<!-- 给水管线 -->
			<CollapseItem title="给水管线(JS)">
				<AttributeGroup :attributes="waterLineAttrs" @toggle="handleToggle('waterLine', $event)" />
			</CollapseItem>

			<!-- 燃气管点 -->
			<CollapseItem title="燃气管点(RQ)">
				<AttributeGroup :attributes="gasPointAttrs" @toggle="handleToggle('gasPoint', $event)" />
			</CollapseItem>

			<!-- 燃气管线 -->
			<CollapseItem title="燃气管线(RQ)">
				<AttributeGroup :attributes="gasLineAttrs" @toggle="handleToggle('gasLine', $event)" />
			</CollapseItem>

			<!-- 工业管点 -->
			<CollapseItem title="工业管点(GY)">
				<AttributeGroup :attributes="industrialPointAttrs" @toggle="handleToggle('industrialPoint', $event)" />
			</CollapseItem>

			<!-- 工业管线 -->
			<CollapseItem title="工业管线(GY)">
				<AttributeGroup :attributes="industrialLineAttrs" @toggle="handleToggle('industrialLine', $event)" />
			</CollapseItem>
		</view>
		<!-- 浮动按钮 -->
		<view class="floating-btn" @click="addFeature">
			<text class="plus-icon">+</text>
		</view>
	</view>
</template>

<script>
import AttributeGroup from './components/AttributeGroup.vue'
import CollapseItem from './components/CollapseItem.vue'

export default {
	components: {
		AttributeGroup,
		CollapseItem
	},

	data() {
		return {
			// 排水管点属性
			drainagePointAttrs: [
				{ key: 'pNumber', label: '物探点号', description: 'pNumber', enabled: true, required: false },
				{ key: 'x', label: '经度', description: 'x', enabled: false, required: false },
				{ key: 'y', label: '纬度', description: 'y', enabled: false, required: false },
				{ key: 'pipeType', label: '类型', description: 'pipeType', enabled: false, required: false },
				{ key: 'isVirtual', label: '管点种类', description: 'isVirtual', enabled: true, required: false },
				{ key: 'pointFeature', label: '特征', description: 'pointFeature', enabled: true, required: false },
				{ key: 'pointAppentant', label: '附属物', description: 'pointAppentant', enabled: true, required: false },
				{ key: 'isHandingNet', label: '是否挂网', description: 'isHandingNet', enabled: true, required: false },
				{ key: 'checkWellType', label: '检查井盖类型', description: 'checkWellType', enabled: true, required: false },
				{ key: 'wellSignNumber', label: '井内挂牌编号', description: 'wellSignNumber', enabled: true, required: false },
				{ key: 'internalCheck', label: '内部检查', description: 'internalCheck', enabled: true, required: false },
				{ key: 'visualCheck', label: '外部检查', description: 'visualCheck', enabled: true, required: false },
				{ key: 'pointDepth', label: '井底深', description: 'pointDepth', enabled: true, required: false },
				{ key: 'ownerRoad', label: '所属道路', description: 'ownerRoad', enabled: true, required: false },
				{ key: 'pointMaterial', label: '井盖材质', description: 'pointMaterial', enabled: true, required: false },
				{ key: 'pointType', label: '井盖类型', description: 'pointType', enabled: true, required: false },
				{ key: 'pointSpecification', label: '井盖规格', description: 'pointSpecification', enabled: true, required: false },
				{ key: 'buildingStructure', label: '建构筑物', description: 'buildingStructure', enabled: true, required: false },
				{ key: 'streetOffice', label: '街道办', description: 'streetOffice', enabled: true, required: false },
				{ key: 'psUser', label: '排水户', description: 'psUser', enabled: true, required: false },
				{ key: 'psType', label: '排水类型', description: 'psType', enabled: true, required: false },
				{ key: 'groundElevation', label: '地面高程', description: 'groundElevation', enabled: true, required: false },
				{ key: 'defectType', label: '缺陷类别', description: 'defectType', enabled: true, required: false },
				{ key: 'defectLevels', label: '缺陷等级', description: 'defectLevels', enabled: true, required: false },
				{ key: 'ownerUnit', label: '权属单位', description: 'ownerUnit', enabled: true, required: false },
				{ key: 'checkUser', label: '检查人员', description: 'checkUser', enabled: true, required: false },
				{ key: 'detectUnit', label: '探测单位', description: 'detectUnit', enabled: true, required: false },
				{ key: 'remark', label: '备注', description: 'remark', enabled: true, required: false }
			],

			// 排水管线属性
			drainageLineAttrs: [
				{ key: 'lineNumber', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'material', label: '材质', description: '管道材质', enabled: true, required: true },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: true },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'slope', label: '坡度', description: '管道坡度(‰)', enabled: true, required: false },
				{ key: 'flowDirection', label: '流向', description: '污水流向', enabled: true, required: false },
				{ key: 'pipeType', label: '管道类型', description: '污水管、雨水管等', enabled: true, required: false },
				{ key: 'installDate', label: '安装日期', description: '管线安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 电力管点属性
			powerPointAttrs: [
				{ key: 'pointNumber', label: '点号', description: '管点编号', enabled: true, required: true },
				{ key: 'pointType', label: '管点类型', description: '手孔井、电缆井等', enabled: true, required: true },
				{ key: 'voltage', label: '电压等级', description: '电压等级(kV)', enabled: true, required: false },
				{ key: 'cableCount', label: '电缆数量', description: '井内电缆根数', enabled: true, required: false },
				{ key: 'depth', label: '井深', description: '电缆井深度(m)', enabled: true, required: false },
				{ key: 'coverType', label: '井盖类型', description: '井盖材质和规格', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管点安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 电力管线属性
			powerLineAttrs: [
				{ key: 'lineNumber', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'voltage', label: '电压等级', description: '电压等级(kV)', enabled: true, required: true },
				{ key: 'cableType', label: '电缆类型', description: '电缆规格型号', enabled: true, required: true },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '电缆埋设深度(m)', enabled: true, required: false },
				{ key: 'protectionType', label: '保护方式', description: '电缆保护管类型', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管线安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 通信管点属性
			telecomPointAttrs: [
				{ key: 'pointNumber', label: '点号', description: '管点编号', enabled: true, required: true },
				{ key: 'pointType', label: '管点类型', description: '手孔井、光缆井等', enabled: true, required: true },
				{ key: 'cableCount', label: '光缆数量', description: '井内光缆根数', enabled: true, required: false },
				{ key: 'depth', label: '井深', description: '通信井深度(m)', enabled: true, required: false },
				{ key: 'equipmentType', label: '设备类型', description: '井内通信设备', enabled: false, required: false },
				{ key: 'coverType', label: '井盖类型', description: '井盖材质和规格', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管点安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 通信管线属性
			telecomLineAttrs: [
				{ key: 'lineNumber', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'cableType', label: '光缆类型', description: '光缆规格型号', enabled: true, required: true },
				{ key: 'fiberCount', label: '纤芯数', description: '光缆纤芯数量', enabled: true, required: false },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '光缆埋设深度(m)', enabled: true, required: false },
				{ key: 'protectionType', label: '保护方式', description: '光缆保护管类型', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管线安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 给水管点属性
			waterPointAttrs: [
				{ key: 'pointNumber', label: '点号', description: '管点编号', enabled: true, required: true },
				{ key: 'pointType', label: '管点类型', description: '阀门井、消火栓等', enabled: true, required: true },
				{ key: 'valveType', label: '阀门类型', description: '闸阀、蝶阀等', enabled: true, required: false },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: false },
				{ key: 'pressure', label: '压力', description: '管道压力(MPa)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '管道埋设深度(m)', enabled: true, required: false },
				{ key: 'installDate', label: '安装日期', description: '管点安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 给水管线属性
			waterLineAttrs: [
				{ key: 'lineNumber', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'material', label: '材质', description: '管道材质', enabled: true, required: true },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: true },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'pressure', label: '压力等级', description: '管道压力等级(MPa)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '管道埋设深度(m)', enabled: true, required: false },
				{ key: 'installDate', label: '安装日期', description: '管线安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 燃气管点属性
			gasPointAttrs: [
				{ key: 'pointNumber', label: '点号', description: '管点编号', enabled: true, required: true },
				{ key: 'pointType', label: '管点类型', description: '阀门井、调压箱等', enabled: true, required: true },
				{ key: 'gasType', label: '燃气类型', description: '天然气、液化气等', enabled: true, required: false },
				{ key: 'pressure', label: '压力等级', description: '燃气压力等级', enabled: true, required: false },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '管道埋设深度(m)', enabled: true, required: false },
				{ key: 'safetyLevel', label: '安全等级', description: '燃气安全等级', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管点安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 燃气管线属性
			gasLineAttrs: [
				{ key: 'lineNumber', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'material', label: '材质', description: '管道材质', enabled: true, required: true },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: true },
				{ key: 'gasType', label: '燃气类型', description: '天然气、液化气等', enabled: true, required: false },
				{ key: 'pressure', label: '压力等级', description: '燃气压力等级', enabled: true, required: false },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '管道埋设深度(m)', enabled: true, required: false },
				{ key: 'safetyLevel', label: '安全等级', description: '燃气安全等级', enabled: false, required: false },
				{ key: 'installDate', label: '安装日期', description: '管线安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 工业管点属性
			industrialPointAttrs: [
				{ key: 'pointNumber', label: '点号', description: '管点编号', enabled: true, required: true },
				{ key: 'pointType', label: '管点类型', description: '阀门井、检查井等', enabled: true, required: true },
				{ key: 'mediumType', label: '介质类型', description: '输送介质类型', enabled: true, required: false },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: false },
				{ key: 'pressure', label: '压力', description: '管道压力', enabled: true, required: false },
				{ key: 'temperature', label: '温度', description: '介质温度', enabled: false, required: false },
				{ key: 'depth', label: '埋深', description: '管道埋设深度(m)', enabled: true, required: false },
				{ key: 'installDate', label: '安装日期', description: '管点安装时间', enabled: false, required: false },
				{ key: 'remark', label: '备注', description: '其他说明信息', enabled: true, required: false }
			],

			// 工业管线属性
			industrialLineAttrs: [
				{ key: 'lineNumber', label: '线号', description: '管线编号', enabled: true, required: true },
				{ key: 'material', label: '材质', description: '管道材质', enabled: true, required: true },
				{ key: 'diameter', label: '管径', description: '管道直径(mm)', enabled: true, required: true },
				{ key: 'mediumType', label: '介质类型', description: '输送介质类型', enabled: true, required: false },
				{ key: 'pressure', label: '压力等级', description: '管道压力等级', enabled: true, required: false },
				{ key: 'temperature', label: '温度等级', description: '介质温度等级', enabled: false, required: false },
				{ key: 'length', label: '长度', description: '管线长度(m)', enabled: true, required: false },
				{ key: 'depth', label: '埋深', description: '管道埋设深度(m)', enabled: true, required: false },
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
			// 加载各类属性设置
			const attributeTypes = [
				'drainagePoint', 'drainageLine', 'powerPoint', 'powerLine',
				'telecomPoint', 'telecomLine', 'waterPoint', 'waterLine',
				'gasPoint', 'gasLine', 'industrialPoint', 'industrialLine'
			]

			attributeTypes.forEach(type => {
				const saved = uni.getStorageSync(`${type}AttributeSettings`)
				if (saved) {
					this[`${type}Attrs`] = saved
				}
			})
		},

		handleToggle(type, event) {
			const attributes = this[`${type}Attrs`]
			const attr = attributes[event.index]
			attr.enabled = event.value
		},

		saveSettings() {
			// 保存所有属性设置
			const attributeTypes = [
				'drainagePoint', 'drainageLine', 'powerPoint', 'powerLine',
				'telecomPoint', 'telecomLine', 'waterPoint', 'waterLine',
				'gasPoint', 'gasLine', 'industrialPoint', 'industrialLine'
			]

			attributeTypes.forEach(type => {
				uni.setStorageSync(`${type}AttributeSettings`, this[`${type}Attrs`])
			})

			uni.showToast({
				title: '设置已保存',
				icon: 'success'
			})
		},

		resetSettings() {
			// 重置所有属性为默认状态
			const attributeTypes = [
				'drainagePoint', 'drainageLine', 'powerPoint', 'powerLine',
				'telecomPoint', 'telecomLine', 'waterPoint', 'waterLine',
				'gasPoint', 'gasLine', 'industrialPoint', 'industrialLine'
			]

			attributeTypes.forEach(type => {
				this[`${type}Attrs`].forEach(attr => {
					// 必填属性和常用属性默认启用
					attr.enabled = attr.required ||
						['pointNumber', 'lineNumber', 'pointType', 'material', 'diameter', 'remark'].includes(attr.key)
				})
			})

			uni.showToast({
				title: '已重置为默认设置',
				icon: 'success'
			})
		},
		// 添加特征
		addFeature() {
			uni.showToast({
				title: '添加特征功能',
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.attribute-container {
	min-height: 100vh;
	background: #f5f5f5;
}

.content-area {
	padding: 0 24rpx 24rpx;
	margin-top: 20rpx;
	position: relative;
	z-index: 2;
}

/* 浮动按钮 */
.floating-btn {
	position: fixed;
	right: 60rpx;
	bottom: 120rpx;
	width: 120rpx;
	height: 120rpx;
	background: #FF6B6B;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.4);
	z-index: 999;

	.plus-icon {
		color: white;
		font-size: 48rpx;
		font-weight: bold;
		line-height: 1;
	}
}


// 自定义折叠组件样式已在CollapseItem组件中定义</style>