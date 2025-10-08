在“我的”-“特征/附属物设置”页面，需要读取sqlite中的特征附属物表: "feature_appendant_entity".
该页面作用：
	1. 展示db中的特征和附属物信息。如排水特征(PS)、排水附属物(PS)、电信特征(TX)、电信附属物(TX)等。展示其下有那些特征/附属物、并允许设置其是否展示
	2. 允许对某个类别（如排水、电信等）添加一个新的特征或者附属物。添加只需选择类别、特征或者附属物二选一、然后填入名称即可，然后写入sqllite中

为实现如下功能，必须要按如下操作执行
	1. 在"services/"目录下实现一个feature_appendantEntityService.js的service，用来操作sqllite的db读取和新增。你可以参考"services/pipeTypeEntityService.js"的实现
	2. 你需要修改"pages/settings/feature.vue"页面，使其满足上面的页面的要求。页面可以参考"pages/settings/pipe-type.vue"的实现