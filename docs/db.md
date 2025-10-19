# 项目存储使用sqllite
sqllite中包括如下表：
1. 项目表:project_manager。
2. 管网类型表:pipe_Line_type_entity
3. 特征附属物表: feature_appendant_entity
4. 管点管线属性设置表: properties_sort_entity



## 项目表
1.字段定义如下：
```sql
CREATE TABLE project_manager (
    pid                TEXT    PRIMARY KEY
                               NOT NULL,
    PROJECT_NAME       TEXT,
    PROJECT_TYPE       TEXT,
    PROJECT_TYPE_CODE  TEXT,
    OWN_UNIT           TEXT,
    COLLECT_UNIT       TEXT,
    WORK_GROUP         TEXT,
    PRINCIPAL          TEXT,
    CREATE_TIME        INTEGER,
    MODIFACATION_TIME  INTEGER,
    PNUMBER_INCREAME   TEXT,
    IS_PROPERTIES_COPY INTEGER NOT NULL,
    IS_SHOW_LINELABEL  INTEGER NOT NULL,
    BASEMAP_PATH       TEXT,
    COORDINATE_SYSTEM  TEXT
);
```
2.数据示例如下：
```
pid	PROJECT_NAME	PROJECT_TYPE	PROJECT_TYPE_CODE	OWN_UNIT	COLLECT_UNIT	WORK_GROUP	PRINCIPAL	CREATE_TIME	MODIFACATION_TIME	PNUMBER_INCREAME	IS_PROPERTIES_COPY	IS_SHOW_LINELABEL	BASEMAP_PATH	COORDINATE_SYSTEM
d67ac03f746748d4b6f730b425bc6a22	啊啊啊	综合管线		亲爱	阿伟	1	Jimmy	1756811194000		true	1	1		4326
```

3.当用户创建了一个项目，会生成一个项目表。后续登录时，会查询项目表展示已有项目，用户也可以创建项目


## 管线类型表
1.字段定义如下：
```sql
CREATE TABLE pipe_Line_type_entity (
    PID           TEXT PRIMARY KEY
                       NOT NULL,
    TYPE_NAME     TEXT,
    TYPE_CODE     TEXT,
    PRE_TYPE_CODE TEXT,
    COLOR_CODE_16 TEXT
);
```
2.默认数据如下：
```
PID	TYPE_NAME	TYPE_CODE	PRE_TYPE_CODE	COLOR_CODE_16
b406ec0de2004d0791f68fde80981e81	综合管线			
080b6d73-0e2f-493b-af6a-07ccb3146059	排水	PS		
5e8c41fa8d784172ba890ca1e59e0289	雨水	YS	PS	#7F0000
003857bcc4ec4ffb807fe87ffab33dbf	污水	WS	PS	#FF007F
b2aeeded9a3d4e49a6d4981d170cb3a3	合流	HS	PS	#9900CC
cdbc18cc-bc09-4fba-8957-11b620d0f104	给水	JS		
763cbac54b0f4638889d5470051aa030	工业用水	GS	JS	#00008B
970c8f23c4f142fa958c4c0ba72ee57f	消防用水	XS	JS	#00008B
5794ac5d4af54f75a06b05425e93a347	生活用水	JS	JS	#00008B
59f1dcda75c54cf6bcb56038a1299e4f	燃气	RQ		
670daf6c9b0743d694516249e64bf567	液化气	YQ	RQ	#FF7FE9
b993c698b0594b68a9a8bab8d344bcf2	天然气	RQ	RQ	#FF7FE9
6b23315e1c234a2895c495883fb1c359	煤气	MQ	RQ	#FF7FE9
54e664cfd4e349348d951fa4ce207762	电力	DL		
9c1b297759924de58dbd7efde0f5d16f	路灯	LD	DL	#FF0000
0ee694377842425fbc959f924bc6ff69	交通信号	JD	DL	#FF0000
208cb194f83646bc8008cb1c33b28698	供电	GD	DL	#FF0000
25b45c826ef345f6817f361b63b13fec	通讯	TX		
a6fadb0a12f34c85b5c8b7e7b398563a	中国联通	LX	TX	#006400
91201c26b8dd4912864e24e93bcf457f	中国移动	YX	TX	#006400
826b723916594fba997b50f0bb933a7d	中国电信	DX	TX	#006400
72d8279624ec4e63880abb83a50dd8ba	中国铁通	TX	TX	#006400
75c4d8d194cf43b683c74247a650b331	中国吉通	JX	TX	#006400
fbef7e89402e44f4b95e166a76e392b3	中国网通	WX	TX	#006400
2c0cf9cb29764ebcb807d830ea75cfab	监控信号	KX	TX	#006400
6453f13646844013a3ebc37724f741b0	军用	AX	TX	#006400
0aedd4ba70a74a829c9197e2eeb3a9b5	保密	BX	TX	#006400
5f92059577c148d3aa1ab5e99779eff9	电力通信	EX	TX	#006400
b99b835fd5f542b08d87a21c15c43c2c	宽带	GX	TX	#006400
08b10ccce8884ecd9d7a92df3784d60b	其他电信	QX	TX	#006400
e5155433c69f42868d9ecee60e27840d	电视	TV	TX	#006400
612f284f17aa48599949442c8f974907	广播	GB	TX	#006400
41e98ac4d3f44e64b64677d12c4a1d3f	热力	RL		
98f27621753c4fc8af35dfb688ffa34c	热力	RL	RL	#800080
feff5fd67f54446a862748e97fe526b2	工业	GY		
51fb48cf8aec4932a31e49e86866c8ee	废水	FG	GY	#FF0000
1897cee610304f3fbf2e5e984f9f9c52	石油	SG	GY	#FF0000
c3619d1d8d224a498ca4309bbc51397c	消防泡沫	PG	GY	#FF0000
794549cd5f694f669664cab25eae4a0b	综合管沟	ZH		
ab681ae8e8c34cb58879e641b7f4cc76	综合管沟	ZH	ZH	#FFD700
d050926ba5d14f2fb9415b4ba63db20a	不明管线	BM		
c0a6fc6159f2433f927a83cdf9b7e436	不明管线	BM	BM	#90EE90
```
3. 管线类型表需要分为大类和小类，大类为管线类型，小类为管线子类。
    a. 大类，上表中，TYPE_CODE不为空，PRE_TYPE_CODE为空，表示大类。
    b. 小类，上表中，TYPE_CODE不为空，PRE_TYPE_CODE不为空，表示小类。
    c. 小类归属，PRE_TYPE_CODE表示小类归属的大类的TYPE_CODE。

4. **管线类型表作用**：在采集-管网图层、我的-管类设置中，均是操作的管线类型表。用来让用户选择要创建哪个类型的管点和管线
5. 该表需要支持新增、删除、修改、查询。

## 特征附属物
1.字段定义如下：
```sql
CREATE TABLE feature_appendant_entity (
    pid           TEXT PRIMARY KEY
                       NOT NULL,
    NAME          TEXT,
    TYPE          TEXT,
    CATEGORY      TEXT,
    CATEGORY_NAME TEXT,
    IS_SHOW       TEXT
);
```
2.默认数据如下：
```
cdbc18cc-bc09-4fba-8957-11b620d0f105	三通	特征	PS	排水	1
7d198d6f6d0541a99f13ea6237e19b8c	四通	特征	PS	排水	1
2dbe5ad6926140789b90ee46e0059f95	五通	特征	PS	排水	1
fcfa9bec686747e78ac58db95ebdbd0a	六通	特征	PS	排水	1
7cc0669dac68427cb90d983f8ab67661	七通	特征	PS	排水	1
96e3bc2ed69f46b293ada96030078a67	八通	特征	PS	排水	1
f04bcc6bad4e46a8bd6924e4902e0543	九通	特征	PS	排水	1
c50dc62bf7634618af7ec61ae884810c	多通	特征	PS	排水	1
33b950ea652243caa765cbf85d8be502	户出	特征	PS	排水	1
1a5ecb0fe41e4903848f03b3d3bf8ed5	入户	特征	PS	排水	1
168550c2f6b7479bb8f79a04e36a5ac4	起始点	特征	PS	排水	1
3729dfef06b245a7b95105fe7dacabe6	终止点	特征	PS	排水	1
3d7d0ab8893a4b19a25aad390d76af10	进水口	特征	PS	排水	1
e7e04e9fc94946f4b6f4d4031db9a683	出水口	特征	PS	排水	1
1c855ad88e4f4daebdf26efaac03dfc2	预留口	特征	PS	排水	1
47fa660276db4f4b91a34f979b5e919c	非普查区	特征	PS	排水	1
09560dafd36f40c8aa05be0ed7ed956d	出地	特征	PS	排水	1
481888cbf8274f7bbc026c1147d7a008	变径	特征	PS	排水	1
49edb4d082ea48d1a6528291e3238e9e	拐点	特征	PS	排水	1
08693e520632433194e3ea2f097b7a6a	井边点	特征	PS	排水	1
eb8019d9e60244fcab638e28c9182161	井内点	特征	PS	排水	1
a7151fbb1c0e498eb53f69f2804e0889	沟边点	特征	PS	排水	1
ba0f7f830a0841a0922a792371b8c045	转折点	特征	PS	排水	1
dfc806434a724418bf7c0c7c67ab5faf	检查井	附属物	PS	排水	1
7d9ae2cc50d049d39e16b5541f9f55db	检修井	附属物	PS	排水	1
391b3ad78ca943d6a36c786f9b9c5393	雨水篦	附属物	PS	排水	1
803576e4da124eb7b11b6e323e50c474	立管	附属物	PS	排水	1
e0d952e0c788470baae7c10f8f940a91	溢流井	附属物	PS	排水	1
626ac52f4be0487cb3fc583aac3aa6d1	泵站	附属物	PS	排水	1
b24d40c4fb3e4aaf8f6d6034acb31b4e	窨井	附属物	PS	排水	1
b91739fef2fe42b88b3cfa93a5e8910b	化粪池	附属物	PS	排水	1
873c4fe9053e482a9e37268e1932b562	变径点	附属物	PS	排水	1
7bb2aab653fd49f3b84ab91bb002110f	进水口	附属物	PS	排水	1
cd9c084ab9dc4bd6a0b515d5a64eb2d1	出水口	附属物	PS	排水	1
ab9f6da17dd54274a2f2b163d2c3b195	预留口	附属物	PS	排水	1
c756c4db94d44b9d9ca083620143b560	沉泥井	附属物	PS	排水	1
235b00dbc9b340f9847b96c66e14d10b	渗水井	附属物	PS	排水	1
d38755f206bd444da0df99860a600a70	冲洗井	附属物	PS	排水	1
e5ca035b8dc046a5bf8bcd8e8ef0324d	跌水井	附属物	PS	排水	1
4df49ea040f541c998508d1dfc7f3a0e	污水井	附属物	PS	排水	1
613261a1a5d24171ab9a8857f3527e9f	雨水井	附属物	PS	排水	1
7cade3dfdbca446687fd2029655769cb	闸门井	附属物	PS	排水	1
7c58a327429042ccbcb17142189592c4	阀门井	附属物	PS	排水	1
1bb1ce8bc4e44646b8c5784d42085929	阀门	附属物	PS	排水	1
b6c5cc65e99045b8a69f304fef5a2686	非普查	附属物	PS	排水	1
e010ec1edea74e93b2eec9b1f5cb7035	出地点	附属物	PS	排水	1
1c9b67dd5fd24c43a0dc2f3de2f835e7	管帽	附属物	PS	排水	1
5e650a6ead9549cebe516e35ea380c5c	连接暗井	附属物	PS	排水	1
e8707e25d74f4d70afc2e08a965a767a	水潮门井	附属物	PS	排水	1
98c7424928564fe8a8ecd463e2f0854e	倒虹管	附属物	PS	排水	1
973720f975074401bbf5f5fa218017f1	方形污水窨井	附属物	PS	排水	1
bbbf7cec4a87452fa84bea55ae70e493	圆形污水窨井	附属物	PS	排水	1
f76382a2221c4b60b03966b6856ae08e	方形污水篦子	附属物	PS	排水	1
ed7602f18eb444a2a2c0c6d0964f56a1	方形雨水窨井	附属物	PS	排水	1
f0675b7df9ee4489a6a2614e8481c381	圆形雨水窨井	附属物	PS	排水	1
376b2b8c36a94173a4bc0be5002fa838	方形雨水篦子	附属物	PS	排水	1
3065fbdf31d34720a6df0bb9a686ec30	井边框	附属物	PS	排水	1
f452f22af6084871afe07615b316c0ee	转折点	特征	TX	电信	1
6530aed7d34e4d6e825496e6aafd015b	分支点	特征	TX	电信	1
9c84845e09a648da970b1f216b37d2a4	三分支	特征	TX	电信	1
adabcd40dc67442dbdc128b922dca4da	四分支	特征	TX	电信	1
a632d11589cd4c14bb7403df55b96ecc	五分支	特征	TX	电信	1
c986045786aa488eaf1d380c76ed9b79	多分支	特征	TX	电信	1
b7d3ae83749d48f8a896c4570e865c84	预留口	特征	TX	电信	1
ef9bddc3c83f474abf5c15d9b9525457	非普查	特征	TX	电信	1
6156ded2467f4f3cad6aceab0fd0e389	入户	特征	TX	电信	1
f32b5c19373b4f389e05829b42c98a61	井边点	特征	TX	电信	1
e6f71b848c5240268ef79f06db84703e	井内点	特征	TX	电信	1
6271d19ae13d49c3bfd091d3a0097702	起始点	特征	TX	电信	1
54c0e18528444bef963be6a1a0834f3d	终止点	特征	TX	电信	1
3a973160956b428d9685725e0652841f	上杆	特征	TX	电信	1
5ea066bd41ad4e3ab7edff2080a1f967	拐点	特征	TX	电信	1
4b740b2b3a3740e78d2553bbc820f963	弯头	特征	TX	电信	1
e950460da55c4af9b7ee1bd3ee6ca15d	出地	特征	TX	电信	1
3f79c32d14034c7db5e55accb451e88f	交换站	附属物	TX	电信	1
fdf49f4a9c8e437c80efa1b9509dc434	预留口	附属物	TX	电信	1
efa7c456ad58453cadebd702fe0f56ba	非普查	附属物	TX	电信	1
55b3b491c7944c04b4a59a149d59e6ee	出地点	附属物	TX	电信	1
f001b87739e64a2f9de04a3fd4a9ed4c	管帽	附属物	TX	电信	1
1b8d1ae062da45c384c2409ee6efe860	阀门	附属物	TX	电信	1
b269912c67e847b881c33809a7dd5d11	变径点	附属物	TX	电信	1
a7f970fe0fcc4cc0b748cd0416afd760	人孔	附属物	TX	电信	1
7b404649dd9d4a07a9119f0d116e0ef9	手孔	附属物	TX	电信	1
b1eb936ab0844270bfae75f994269eaa	交线箱	附属物	TX	电信	1
9597885068cc47a59785c8888c380443	接线箱	附属物	TX	电信	1
5f21cebaf59840f187f536a7d21b0eb1	电话亭	附属物	TX	电信	1
ec5ecea5919741178ca76c63525f84cc	监控器	附属物	TX	电信	1
779686b04b9d462c8aa9ceae6d496a75	无线电杆	附属物	TX	电信	1
609c36d86d084de8af3e9f4c14f98f20	差转台	附属物	TX	电信	1
2cd94f8e030b4751bdba1b5dae8e39ea	发射塔	附属物	TX	电信	1
287b1780950a41ee8da372317ab75bb5	测压点	特征	JS	给水	1
dd728344478f4740b3f10e9ff627771c	测流点	特征	JS	给水	1
1e533939ab004fafa0da72770be5e072	水质监测点	特征	JS	给水	1
aec92da0b8ff4915b397b2af93c5b92c	变径	特征	JS	给水	1
1581863231ca4ae181222f6f0f698996	出地	特征	JS	给水	1
b9efecda2f9f4f6ea5de3451cd243337	盖堵	特征	JS	给水	1
a2e94351f0b94062ad7561f653458931	弯头	特征	JS	给水	1
e364bbeee8e64c7ea03dc32752bd758f	三通	特征	JS	给水	1
b53820db1550419eb30f756a66c77f3d	四通	特征	JS	给水	1
36ff9d78d69b46138965f50fb6322f9d	五通	特征	JS	给水	1
51e04c25d8ed438a97fbc216c75c64bb	多通	特征	JS	给水	1
e75a3454640d4f1795c6a5b06ed1a176	预留口	特征	JS	给水	1
11649634366649a693c7faacdd4c5474	非普查	特征	JS	给水	1
8c06934a5f734dbabe84563a0faed24e	入户	特征	JS	给水	1
4503dbc34fd3498ba3fe3c9b224fd766	井边点	特征	JS	给水	1
60d875c83df249bb936e2a4414fd2ae5	井内点	特征	JS	给水	1
ff73fd949edd4f0fb4261e8274208523	起始点	特征	JS	给水	1
8562fc2a1026406b9143279ee12490c2	终止点	特征	JS	给水	1
4a268b3b815247e3bdd4cfef0f1cb031	排气阀	附属物	JS	给水	1
bc6b22d0866a4a4f88326bbf9fb78846	排污阀	附属物	JS	给水	1
63108c9224ba4eb99495eb126ee705d5	检修井	附属物	JS	给水	1
44f3d17a38ae43a392acfcc09a907382	窨井	附属物	JS	给水	1
358085e0f56841cc8ff973e713395a75	消防井	附属物	JS	给水	1
328a931baea24d3d8996326beb0cbe4c	水表	附属物	JS	给水	1
1028d36f133846d59db458e4353a8077	阀门孔	附属物	JS	给水	1
853e2f5cefb844dcbc4f6a2de19d051e	水质监测点	附属物	JS	给水	1
456d00314ecc4b1bbc89291e3d14a595	沉淀池	附属物	JS	给水	1
868f86ace41c4da3831de83aafe3e6af	水表井	附属物	JS	给水	1
7e4af32e1389495baf7c7c051c768e62	消火栓	附属物	JS	给水	1
49553dbecef24f2d95b6c2c12ffed0e7	阀门井	附属物	JS	给水	1
578009172f574439a326f2677ef83011	阀门	附属物	JS	给水	1
b2d3d3c9d0f34349a3d6efa7d50632f4	水塔	附属物	JS	给水	1
558bd7d7ed634b4cb9dff91d487c356a	水源井	附属物	JS	给水	1
a6c02441729b47a6854e9467678c7245	预留口	附属物	JS	给水	1
fe6099f9fcf1400eae763224698bcd6c	非普查	附属物	JS	给水	1
aa1d7ffae7464267ae0b37ab38ef5bff	出地点	附属物	JS	给水	1
c5393df1c0124beb83f55b8e304237c4	管帽	附属物	JS	给水	1
0d489a8bdfef40a2b484bf70a85fb3bb	立管	附属物	JS	给水	1
1315e01a214e4fd49208713d289094af	变径点	附属物	JS	给水	1
4e7ea1bbbbcf4d0eb4ca18cfc6c4a983	变径	特征	RQ	燃气	1
3ec881016c54422f8deff929c97122a9	出地	特征	RQ	燃气	1
ae6d799734f74af9aa8bc0d78b97de2d	盖堵	特征	RQ	燃气	1
7e4639a128b74d758c6a287f5a6318c0	弯头	特征	RQ	燃气	1
38035d26261944008b95a3fa1cfaed20	三通	特征	RQ	燃气	1
e4c4b3f12946480fa0f0c2c6e0a282d4	四通	特征	RQ	燃气	1
6ff3ca5f9cd848a09720ee8fcb3d3adc	五通	特征	RQ	燃气	1
d12cc2e2e4134955b67bd30d06950812	多通	特征	RQ	燃气	1
dbe41eeb9364499d9f3f87fae6733c4e	预留口	特征	RQ	燃气	1
4891f69b6f5b4da29f170bb4e08eb046	非普查	特征	RQ	燃气	1
57d5a1a42d2e41aa902596f75e582b56	入户	特征	RQ	燃气	1
88ba0443298a48b3aee8c58e7dc28344	一般管线点	特征	RQ	燃气	1
83148ab1fe054cfcaef40c46335b0482	井边点	特征	RQ	燃气	1
76b4eba1410842b9acc501ee19f6b724	井内点	特征	RQ	燃气	1
3ff10edf187f49f2a1907439444f8421	起始点	特征	RQ	燃气	1
495ef41c65294e7c83c72b9428bb477f	终止点	特征	RQ	燃气	1
af7969a5870a4226bcca607418bfba00	转折点	特征	RQ	燃气	1
b552399f26e64359a6de1f27d92d8782	变深	特征	RQ	燃气	1
0896b745ea0a4f1a9ad717d64787c3f4	预留口	附属物	RQ	燃气	1
518368fcac2f4582955b5237d7decf6a	非普查	附属物	RQ	燃气	1
e40dad687b6046f18edb0d2266552747	变径点	附属物	RQ	燃气	1
da81f7f369964a2c9cc82579d6de972b	阀门井	附属物	RQ	燃气	1
bbc4288c6f0d4053944b2aa5fde0cf2d	阀门	附属物	RQ	燃气	1
477f1ed3098a467c842a99f13cbd83c7	检修井	附属物	RQ	燃气	1
5a49e5871c7448c7a683cde5188f0e21	凝水缸	附属物	RQ	燃气	1
143a8b65d73a458aadf061680b244b43	压力表	附属物	RQ	燃气	1
c5fe363aee284c74a5f73b86f0395d39	阴保测试桩	附属物	RQ	燃气	1
fa3f4d93806a4368945e7ae4f8fa76c5	波形管	附属物	RQ	燃气	1
f2bb31b4d3dc44cdb85efc275db6d5f7	调压站	附属物	RQ	燃气	1
3c825baf1c884537a6c11bb1199b2f92	调压箱	附属物	RQ	燃气	1
33f2d85c10e1433e95a8c0fac03c76f2	燃气柜	附属物	RQ	燃气	1
2d9c2313ba9645049d6877098d5e6b0c	燃气站	附属物	RQ	燃气	1
ded97abe5dba483b8d385c5cb299fabb	燃气桩	附属物	RQ	燃气	1
1ec3b47bceae463f8e9f2c2c7f488d72	涨缩站	附属物	RQ	燃气	1
4c5ca4489e144a159aa88e8200ac9031	出地点	附属物	RQ	燃气	1
d1f868990aaa48ab837882991f61d541	管帽	附属物	RQ	燃气	1
bb0423dd720a4f2597db38fb2eefc862	变径	特征	GY	工业	1
f4d2ac29caa04ddd826d8ef4f9726167	出地	特征	GY	工业	1
021a71bd4c9e45ecadb9be74d3368a13	盖堵	特征	GY	工业	1
bbbc1044e8f048bf91cade80ee4884f3	弯头	特征	GY	工业	1
cdd5076b6ad9493095092d4a4294e275	三通	特征	GY	工业	1
33d8be8050ed4cf4a0241345ffa916b9	四通	特征	GY	工业	1
f0e70081e1e4454fbf3ea147a5bd84af	五通	特征	GY	工业	1
628bb95a5ffe4af39781bd08bc0b68b6	多通	特征	GY	工业	1
bec3642c7040438c8c4f310309652903	预留口	特征	GY	工业	1
ec7b93e223874124b21adbde398e3289	非普查	特征	GY	工业	1
b3997ff22c794d8faa2f003ee758c645	入户	特征	GY	工业	1
4356c9da2b434f33bd9d66bf9a855386	一般管线点,1	特征	GY	工业	1
f41960bd41804a3b9aca28d2e9672629	井边点	特征	GY	工业	1
85010b72d49044fb869822e0c545d8ff	井内点	特征	GY	工业	1
1f89ebcc1fe34b0ab818bce0b63a747e	起始点	特征	GY	工业	1
2665d9634fb747539071356d34027247	终止点	特征	GY	工业	1
f632cd3a94c844b083213e53ff07c83c	变坡	特征	GY	工业	1
c431cf7ee7a64b4194e0117382908f9e	变深	特征	GY	工业	1
272d5a5d34a749b69a3e7d9d38eff5b3	拐点	特征	GY	工业	1
98ec9180372d438ba0eade969cfd153d	预留口	附属物	GY	工业	1
faf7dbf48e944fafbef871b877cfb03c	排污装置	附属物	GY	工业	1
83e2d42f53fe4cd1a486f9a9259f0ce9	阀门	附属物	GY	工业	1
80bd270a144b42e285386ee363aa8ecd	阀门井	附属物	GY	工业	1
020ec0fa370f4385b71b70e42db4f087	检修井	附属物	GY	工业	1
3fc1f1defa3f4315be4f137f96098e91	非普查	附属物	GY	工业	1
9800e127a837490cb27e9b765d398775	出地点	附属物	GY	工业	1
4640536f56894e338ba18a0ff69afaa5	管帽	附属物	GY	工业	1
7c9fe156dfb54ad88ac98f4eb00d73c8	变径点	附属物	GY	工业	1
57be75325b6b4c049c1ed118f55aa400	变径	特征	RL	热力	1
551c0c1cd8b3404a844c8367b95a190f	出地	特征	RL	热力	1
c01aa92b8b3c447a9d563b1d5c8ec425	盖堵	特征	RL	热力	1
6050a64a77c349b4887cf059407c2385	弯头	特征	RL	热力	1
7ff32e3a1773408bb94ffed82ae40162	三通	特征	RL	热力	1
24317c7a35714e609000b7de054c6193	四通	特征	RL	热力	1
8a8d7848b45a419dbe7928bb84672cdd	五通	特征	RL	热力	1
b9235d9865f74fd6950ce5a1462d4d90	多通	特征	RL	热力	1
1e3006a49bfe482794201d995d7af19c	预留口	特征	RL	热力	1
4bdd2a4e96154d9aae5ddc6226451b29	非普查	特征	RL	热力	1
20da0b06fa9a4dac94a75a46158c2907	入户	特征	RL	热力	1
123895a47a964029a0783dc91fc19d9f	一般管线点	特征	RL	热力	1
fc30472a4e0e47b1b1faa1127b4f66e8	井边点	特征	RL	热力	1
c5c4c6de61fd40d39a7ea8373a5616fa	井内点	特征	RL	热力	1
6b886b3cdcb2439ea899463d5e409a86	起始点	特征	RL	热力	1
d31fdf8ff54c421183fec4fd6d3a7b56	终止点	特征	RL	热力	1
035ee67a565d4349b4d7f9112112f44b	转折点	特征	RL	热力	1
eeeb71783b3141eb9de026a5103be31d	预留口	附属物	RL	热力	1
1b266c9fdabf46aab7eb94c2ed331be0	阀门	附属物	RL	热力	1
ca935e3150a647aaa8cdf5cc635cae76	阀门井	附属物	RL	热力	1
11b2068692124d25a43b9ee451841e7e	检修井	附属物	RL	热力	1
e26aa162f80340098670e925eec7f70f	非普查	附属物	RL	热力	1
7941fe3e6282497f97247d4b8a2a0afe	变径点	附属物	RL	热力	1
96eb0391f73b4ff68d9f4c8d8a41709c	出地点	附属物	RL	热力	1
2dc7c65f037b4b42859108e952b60726	管帽	附属物	RL	热力	1
8c1c447607ea4104b52a261d04958b5f	吹扫井	附属物	RL	热力	1
94f9e1d93af7402b8f1b0e4e66a4d8e6	疏水	附属物	RL	热力	1
35522577208b4768875bc9a18e958718	真空表	附属物	RL	热力	1
97cf4f9ad4284296ada2a922cd6128f8	固定节	附属物	RL	热力	1
e81691b2217748b883f433902ea231ff	安全阀	附属物	RL	热力	1
b743b670c1794a36bfa2875597e5adb4	排潮孔	附属物	RL	热力	1
d710eef5447e40669458ae6aa44d52a2	变径	特征	ZH	综合	1
e0a011e1845f4c708eb9a19b7899f5e9	出地	特征	ZH	综合	1
7b76f90042dc40aaab1b4798b29aead9	三通	特征	ZH	综合	1
ce71b4e6513f49d99e5547c95e4917cf	四通	特征	ZH	综合	1
fed20622a0474b02b9f290d6f2cecae4	五通	特征	ZH	综合	1
f2fd800a93aa40ceb55fbf317945dfeb	多通	特征	ZH	综合	1
25510c3428034d6a9c4d31277892252f	预留口	特征	ZH	综合	1
0a08b81d292148f097d1f8b96a79f1f6	非普查	特征	ZH	综合	1
b2b31bf9278c48c6b3dffabf9d2f19b2	一般管线点	特征	ZH	综合	1
9acb09546307453e890306a850628205	井边点	特征	ZH	综合	1
96f264c5b0ea46c9a81b4db4ddf0d8b6	井内点	特征	ZH	综合	1
31586b78cad14f9087fb1733f7b64efc	起始点	特征	ZH	综合	1
483a02dd673e4132a92fe4b7902b856e	终止点	特征	ZH	综合	1
36fe06e4be19462d9beae17f9c45c8e6	无	附属物	ZH	综合	1
91582e9cf05146b28fa9ac7df16f16f6	管廊预留口	附属物	ZH	综合	1
a240f5a4a73343e588f102e22fd81cb6	管廊阀门	附属物	ZH	综合	1
6166908d8bfb440d9f624cfa37b1e980	管廊检修井	附属物	ZH	综合	1
adc8e96af93143c5919721ce1b7e48c3	管廊非普查	附属物	ZH	综合	1
f868bcc7711448b2af337d4fcbb91918	管廊出地点	附属物	ZH	综合	1
749cbdd485324b25a31cc3032e609c65	管廊管帽	附属物	ZH	综合	1
4ecff8375880472b918d778614039bdb	管廊变径点	附属物	ZH	综合	1
58d9dced54a049d4b3ba2f0d69f74e80	一般管线点	特征	DL	电力	1
8198f1222d0140cca4ac7dd3e522365a	转折点	特征	DL	电力	1
defc407b20df44beb6b98ecc7b407938	分支点	特征	DL	电力	1
019c8898092244c3ac28eb312d3007e4	预留口	特征	DL	电力	1
095f2f86d9504ded9f2833a596ea2391	非普查	特征	DL	电力	1
ab06c6d18e21411f90e0ec2487aa65fd	入户	特征	DL	电力	1
dc23b4a3ac354f488648063176cdf886	井边点	特征	DL	电力	1
387eb2f85ce7487fac4c51bd3d374034	井内点	特征	DL	电力	1
0ef5ab9a9b3748059b7cabca47890c41	起始点	特征	DL	电力	1
ab5a6c49717d4a7e920778ed56b573ab	终止点	特征	DL	电力	1
962b42c555d24a2cb370f3bff475deb4	检修井	附属物	DL	电力	1
c4f5f1153dbc41fcb0c793a2bb5e8b53	手孔	附属物	DL	电力	1
ca8cefd1a5f44a1d8bba7c6816d42630	路灯	附属物	DL	电力	1
73ba82d0701d4051bb06c485bf8fca92	接线箱	附属物	DL	电力	1
bd160d3fd461431fa127556a370c9d57	上杆	附属物	DL	电力	1
db4ca9c64850496eb85060f0659a1434	配电室	附属物	DL	电力	1
054023819e844c2e8b02697a7e664de1	变压器	附属物	DL	电力	1
c886b83432534775888965ee5dff6142	变电站	附属物	DL	电力	1
81a014d2a0fe4454b94f916a3f1c2b11	人孔	附属物	DL	电力	1
e2f8d2d2a2804d04bc371b6db2b77a31	通风井	附属物	DL	电力	1
8449357c4bcd47e9972042a3bd4d93f1	信号灯	附属物	DL	电力	1
c7ee01cc311240159e3e927a2ff7e0b5	地灯	附属物	DL	电力	1
6db6eea6efb34c27a3435c4ed8eef40a	线杆	附属物	DL	电力	1
faf636a95f8746db89ac8108e6230578	广告牌	附属物	DL	电力	1
67cfe07d77fe435293dd6db777a01d8e	控制柜	附属物	DL	电力	1
```

3. **特征附属物作用**：该表主要用来判断当用户选择是否展示某些特征和附属物是否展示。如排水特征中的：三通、四通、五通等是否展示。这些配置可以在"我的-特征附属物"页面进行勾选和取消勾选

4.在"采集-管点"配置的配置项:"特征"、"附属物"下拉栏，首先通过表中的CATEGORY进行比对当前采集的类型。然后下拉栏展示表中这个CATEGORY类比中的特征和附属物

## 管点管线属性设置表
form表，定义了每个大类的管点、管线可以配置那些属性，并且属性展示的类型以及属性是文本输入还是下拉选择框
```
CREATE TABLE form (
    _id        INTEGER PRIMARY KEY AUTOINCREMENT,
    form_name  TEXT,
    form_type  TEXT,
    field      TEXT,
    label      TEXT,
    field_type TEXT,
    domain     TEXT,
    show       INTEGER,
    number     INTEGER
);
```

映射关系如下：
```
_id	form_name	form_type	field	label	field_type	domain	show	number
1	DL	gd	wtbh	物探编号	real		1	1
2	DL	gd	tzd	特征点	list	DL_tzd	1	2
3	DL	gd	fsw	附属物	list	DL_fsw	1	3
4	DL	gd	jdsd	井底深度	real		1	4
5	DL	gd	szdl	所在道路	edit_list	szdl	1	5
6	DL	gd	dcrq	调查日期	text		1	6
7	DL	gd	jsrq	建设日期	text	jsrq	1	7
8	DL	gd	jgxz	井盖形状	edit_list	jgxz	1	8
9	DL	gd	jjgxs	井结构形式	edit_list	jjgxs	1	9
10	DL	gd	jgcz	井盖材质	list	DL_jgcz	1	10
11	DL	gd	jglx	井盖类型	edit_spinner	jglx	1	11
12	DL	gd	jgzw	建构筑物	edit_list	jgzw	1	12
13	DL	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	13
14	DL	gd	x	经度	real		1	14
15	DL	gd	y	纬度	real		1	15
16	DL	gd	h	H高程	real		1	16
17	DL	gd	jbs	井脖深	edit_list	jbs	1	17
18	DL	gd	jbcc	井脖尺寸	edit_list	jbcc	1	18
19	DL	gd	jscc	井室尺寸	edit_list	jscc	1	19
20	DL	gd	pjgg	配件规格	text		0	20
21	DL	gd	yydm	运营单位代码	edit_list	DL_yydm	0	21
22	DL	gd	pp	点位置	list	DL_pp	0	22
23	DL	gd	gxrq	更新日期	text		0	23
24	DL	gd	qsdw	权属单位	edit_list	qsdw	1	24
25	DL	gd	tcdw	探测单位	edit_list	tcdw	1	25
26	DL	gd	xmbh	项目编号	text		0	26
27	DL	gd	xmmc	项目名称	text		0	27
28	DL	gd	pmdwpj	平面定位偏距	edit_list		0	28
29	DL	gd	bz	备注	edit_list		1	29
30	DL	gd	tp	图片路径	edit_list		1	30
31	DL	gx	qsdh	起始点号	text		1	1
32	DL	gx	zzdh	终止点号	text		1	2
33	DL	gx	qsms	起始埋深	real		1	3
34	DL	gx	zzms	终止埋深	real		1	4
35	DL	gx	msfs	埋设方式	list	DL_msfs	1	5
36	DL	gx	gj	管径（宽*高）	edit_list	DL_gj	1	6
37	DL	gx	tgcc	套管尺寸	edit_list	DL_gj	1	7
38	DL	gx	tgcz	套管材质	edit_spinner	tgcz	1	8
39	DL	gx	kj	孔径	edit_list	kj	1	9
40	DL	gx	gs	电缆根数	real	gs	1	10
41	DL	gx	dy	电压	edit_list	dy	1	11
42	DL	gx	cz	材质	list	DL_cz	1	12
43	DL	gx	qsdw	权属单位	edit_list	qsdw	1	13
44	DL	gx	kpl	孔排列	text		0	14
45	DL	gx	zxgkpl	正向管孔排列	edit_list		0	15
46	DL	gx	fxgkpl	反向管孔排列	edit_list		0	16
47	DL	gx	zks	总孔数	real	zks	1	17
48	DL	gx	glks	光缆根数	text		0	18
49	DL	gx	yyks	已用孔数	real	yyks	1	19
50	DL	gx	qsks	权属孔数	real	qsks	1	20
51	DL	gx	gxrq	更新日期	text		0	21
52	DL	gx	sysm	材质使用寿命	text		0	22
53	DL	gx	xxing	线型	edit_list		1	23
54	DL	gx	yydm	运营单位代码	edit_list	DL_yydm	0	24
55	DL	gx	bhcz	保护材质	edit_list	bhcz	1	25
56	DL	gx	szdl	所在道路	edit_list	szdl	1	26
57	DL	gx	tcdw	探测单位	edit_list	tcdw	1	27
58	DL	gx	xmbh	项目编号	text		0	28
59	DL	gx	xmmc	项目名称	text		0	29
60	DL	gx	bz	备注	text		1	30
61	TX	gd	wtbh	物探编号	real		1	1
62	TX	gd	tzd	特征点	list	TX_tzd	1	2
63	TX	gd	fsw	附属物	list	TX_fsw	1	3
64	TX	gd	jdsd	井底深度	real		1	4
65	TX	gd	szdl	所在道路	edit_list	szdl	1	5
66	TX	gd	dcrq	调查日期	text		1	6
67	TX	gd	jsrq	建设日期	text	jsrq	1	7
68	TX	gd	jgxz	井盖形状	edit_list	jgxz	1	8
69	TX	gd	jjgxs	井结构形式	edit_list	jjgxs	1	9
70	TX	gd	jgcz	井盖材质	list	DL_jgcz	1	10
71	TX	gd	jglx	井盖类型	edit_spinner	jglx	1	11
72	TX	gd	jgzw	建构筑物	edit_list	jgzw	1	12
73	TX	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	13
74	TX	gd	x	经度	real		1	14
75	TX	gd	y	纬度	real		1	15
76	TX	gd	h	H高程	real		1	16
77	TX	gd	jbs	井脖深	edit_list	jbs	1	17
78	TX	gd	jbcc	井脖尺寸	edit_list	jbcc	1	18
79	TX	gd	jscc	井室尺寸	edit_list	jscc	1	19
80	TX	gd	pmdwpj	平面定位偏距	edit_list		0	20
81	TX	gd	qsdw	权属单位	edit_list	qsdw	1	21
82	TX	gd	tcdw	探测单位	edit_list	tcdw	1	22
83	TX	gd	bz	备注	edit_list		1	23
84	TX	gd	tp	图片路径	edit_list		1	24
85	TX	gx	qsdh	起始点号	text		1	1
86	TX	gx	zzdh	终止点号	text		1	2
87	TX	gx	qsms	起始埋深	real		1	3
88	TX	gx	zzms	终止埋深	real		1	4
89	TX	gx	msfs	埋设方式	list	TX_msfs	1	5
90	TX	gx	gj	管径	edit_list	TX_gj	1	6
91	TX	gx	tgcc	套管尺寸	edit_list	DL_gj	1	7
92	TX	gx	tgcz	套管材质	edit_spinner	tgcz	1	8
93	TX	gx	gs	根数	real	gs	1	9
94	TX	gx	kj	孔径	edit_list	kj	1	10
95	TX	gx	cz	材质	list	TX_cz	1	11
96	TX	gx	xxing	线型	edit_list		1	12
97	TX	gx	qsdw	权属单位	edit_list	qsdw	1	13
98	TX	gx	kpl	孔排列	text		0	14
99	TX	gx	zxgkpl	正向管孔排列	edit_list		0	15
100	TX	gx	fxgkpl	反向管孔排列	edit_list		0	16
101	TX	gx	zks	总孔数	real	zks	1	17
102	TX	gx	yyks	已用孔数	real	yyks	1	18
103	TX	gx	glks	光缆孔数	text		0	19
104	TX	gx	qsks	权属孔数	real	qsks	1	20
105	TX	gx	bhcz	保护材质	edit_list	bhcz	1	21
106	TX	gx	szdl	所在道路	edit_list	szdl	1	22
107	TX	gx	tcdw	探测单位	edit_list	tcdw	1	23
108	TX	gx	bz	备注	text		1	24
109	JS	gd	wtbh	物探编号	real		1	1
110	JS	gd	tzd	特征点	list	JS_tzd	1	2
111	JS	gd	fsw	附属物	list	JS_fsw	1	3
112	JS	gd	sfgw	是否挂网	list	PS_sfgw	0	4
113	JS	gd	jcjglx	检查井盖类型	list	PS_jcjglx	0	5
114	JS	gd	jngpbh	井内挂牌编号	text		0	6
115	JS	gd	jdsd	井底深度	real		1	7
116	JS	gd	szdl	所在道路	edit_list	szdl	1	8
117	JS	gd	dcrq	调查日期	text		1	9
118	JS	gd	jsrq	建设日期	text	jsrq	1	10
119	JS	gd	jgxz	井盖形状	edit_list	jgxz	1	11
120	JS	gd	jjgxs	井结构形式	edit_list	jjgxs	1	12
121	JS	gd	jgcz	井盖材质	list	DL_jgcz	1	13
122	JS	gd	jglx	井盖类型	edit_spinner	jglx	1	14
123	JS	gd	jgzw	建构筑物	edit_list	JS_jgzw	1	15
124	JS	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	16
125	JS	gd	x	经度	real		1	17
126	JS	gd	y	纬度	real		1	18
127	JS	gd	h	H高程	real		1	19
128	JS	gd	jbs	井脖深	edit_list	jbs	1	20
129	JS	gd	jbcc	井脖尺寸	edit_list	jbcc	1	21
130	JS	gd	jscc	井室尺寸	edit_list	jscc	1	22
131	JS	gd	qsdw	权属单位	edit_list	qsdw	1	23
132	JS	gd	tcdw	探测单位	edit_list	tcdw	1	24
133	JS	gd	pmdwpj	平面定位偏距	edit_list		0	25
134	JS	gd	bz	备注	edit_list		1	26
135	JS	gd	tp	图片路径	edit_list		1	27
136	JS	gx	qsdh	起始点号	text		1	1
137	JS	gx	zzdh	终止点号	text		1	2
138	JS	gx	lxbh	录像编号	text		0	3
139	JS	gx	qsms	起始埋深	real		1	4
140	JS	gx	zzms	终止埋深	real		1	5
141	JS	gx	cd	长度(m)	text		0	6
142	JS	gx	msfs	埋设方式	list	JS_msfs	1	7
143	JS	gx	gj	管径	edit_list	JS_gj	1	8
144	JS	gx	cz	材质	list	JS_cz	1	9
145	JS	gx	xxing	线型	edit_list		1	10
146	JS	gx	qsdw	权属单位	edit_list	qsdw	1	11
147	JS	gx	bhcz	保护材质	edit_list	bhcz	1	12
148	JS	gx	jdb	街道办	edit_list	jdb	0	13
149	JS	gx	qsdl	起始道路	edit_list	qsdl	0	14
150	JS	gx	zzdl	终止道路	edit_list	zzdl	0	15
151	JS	gx	szdl	所在道路	edit_list	szdl	1	16
152	JS	gx	tcdw	探测单位	edit_list	tcdw	1	17
153	JS	gx	bz	备注	text		1	18
154	PS	gd	wtbh	物探编号	real		1	1
155	PS	gd	tzd	特征点	list	PS_tzd	1	2
156	PS	gd	fsw	附属物	list	PS_fsw	1	3
157	PS	gd	sfgw	有无防坠网	list	PS_sfgw	1	4
158	PS	gd	jcjglx	检查井盖类型	list	PS_jcjglx	0	5
159	PS	gd	jcjdj	检查井等级	edit_list	jcjdj	1	6
160	PS	gd	jngpbh	井内挂牌编号	text		0	7
161	PS	gd	wbjc	外部检查	check		0	8
162	PS	gd	nbjc	内部检查	check		0	9
163	PS	gd	jdsd	井底深度	real		1	10
164	PS	gd	jdxs	井底形式	edit_list		1	11
165	PS	gd	ss	井内水深(m)	real		1	12
166	PS	gd	ns	井内泥深(cm)	real		1	13
167	PS	gd	lgcd	立管长度	real		1	14
168	PS	gd	jgcc	井盖尺寸	edit_list		1	15
169	PS	gd	jgcz	井盖材质	list	DL_jgcz	1	16
170	PS	gd	jghd	井盖厚度(m)	edit_list	jghd	1	17
171	PS	gd	jglx	井盖类型	edit_spinner	jglx	1	18
172	PS	gd	jgxz	井盖形状	edit_spinner	jgxz	1	19
173	PS	gd	jjgxs	井结构形式	edit_list	jjgxs	1	20
174	PS	gd	lglx	立管类型	list	lglx	1	21
175	PS	gd	jsfdk	井是否打开	list	jsfdk	1	22
176	PS	gd	wdkyy	未打开原因	edit_list		1	23
177	PS	gd	jscc	井室尺寸	edit_list		1	24
178	PS	gd	jsgd	井室高度(m)	edit_list		1	25
179	PS	gd	jscz	井室材质	edit_list	jscz	1	26
180	PS	gd	jslx	井室类型	edit_list	jslx	1	27
181	PS	gd	jtcc	井筒尺寸	edit_list	jtcc	1	28
182	PS	gd	ysbjj	雨水箅间距(m)	edit_list	ysbjj	1	29
183	PS	gd	yskxs	雨水口形式	edit_list	yskxs	1	30
184	PS	gd	yskxz	雨水口形状	edit_list		0	31
185	PS	gd	yskcz	雨水口材质	edit_list		0	32
186	PS	gd	hjdly	混接点来源	edit_list		0	33
187	PS	gd	ll	流量(m3/h)	edit_list		0	34
188	PS	gd	ljlj	垃圾拦截	edit_list	ljlj	1	35
189	PS	gd	szdl	所在道路	edit_list	szdl	1	36
190	PS	gd	addr	地址	edit_list	addr	1	37
191	PS	gd	dcrq	调查日期	text		1	38
192	PS	gd	jsrq	建设日期	text	jsrq	1	39
193	PS	gd	jgzw	建构筑物	edit_list	PS_jgzw	1	40
194	PS	gd	jdb	街道办	edit_list	jdb	1	41
195	PS	gd	yspsh	排水户	list	yspsh	1	42
196	PS	gd	yswslx	排水类型	list	yswslx	1	43
197	PS	gd	x	经度	real		1	44
198	PS	gd	y	纬度	real		1	45
199	PS	gd	h	H高程	real		1	46
200	PS	gd	jbs	井脖深	edit_list	jbs	1	47
201	PS	gd	jbcc	井脖尺寸	edit_list	jbcc	1	48
202	PS	gd	qsdw	权属单位	edit_list	qsdw	1	49
203	PS	gd	jcry	检查人员	text		0	50
204	PS	gd	tcdw	探测单位	edit_list	tcdw	1	51
205	PS	gd	pmdwpj	平面定位偏距	edit_list		0	52
206	PS	gd	bz	备注	edit_list		1	53
207	PS	gd	tp	图片路径	edit_list		1	54
208	PS	gx	qsdh	起始点号	text		1	1
209	PS	gx	zzdh	终止点号	text		1	2
210	PS	gx	lxbh	录像编号	text		0	3
211	PS	gx	qsms	起始埋深	real		1	4
212	PS	gx	zzms	终止埋深	real		1	5
213	PS	gx	qdgkns	起点管口泥深(cm)	real		1	6
214	PS	gx	zdgkns	终点管口泥深(cm)	real		1	7
215	PS	gx	qdgkss	起点管口水深(cm)	real		0	8
216	PS	gx	zdgkss	终点管口水深(cm)	real		0	9
217	PS	gx	yjbl	淤积比例	text		1	10
218	PS	gx	lx	流向	list	lx	1	11
219	PS	gx	msfs	埋设方式	list	PS_msfs	1	12
220	PS	gx	hjyy	混接原因	edit_spinner	PS_hjyy	1	13
221	PS	gx	qdlx1	渠道类型	edit_list	qdlx	1	14
222	PS	gx	cd	长度(m)	text		0	15
223	PS	gx	gj	管径	edit_list	PS_gj	1	16
224	PS	gx	cz	材质	list	PS_cz	1	17
225	PS	gx	xxing	线型	edit_list		1	18
226	PS	gx	yclcd	预处理长度	edit_list		1	19
227	PS	gx	wjcyy	未检测原因	edit_list		1	20
228	PS	gx	qsdw	权属单位	edit_list	qsdw	1	21
229	PS	gx	jsrq	建设日期	text	jsrq	0	22
230	PS	gx	dcrq	调查日期	text		0	23
231	PS	gx	jdb	街道办	edit_list	jdb	0	24
232	PS	gx	szdl	所在道路	edit_list	szdl	1	25
233	PS	gx	addr	地址	edit_list	addr	1	26
234	PS	gx	qsdl	起始道路	edit_list	qsdl	0	27
235	PS	gx	zzdl	终止道路	edit_list	zzdl	0	28
236	PS	gx	jcry	检查人员	text		0	29
237	PS	gx	tcdw	探测单位	edit_list	tcdw	1	30
238	PS	gx	bz	备注	text		1	31
239	RQ	gd	wtbh	物探编号	real		1	1
240	RQ	gd	tzd	特征点	list	RQ_tzd	1	2
241	RQ	gd	fsw	附属物	list	RQ_fsw	1	3
242	RQ	gd	dyl	点压力	edit_list	dyl	1	4
243	RQ	gd	dgj	点管径	edit_list	dgj	1	5
244	RQ	gd	jdsd	井底深度	real		1	6
245	RQ	gd	szdl	所在道路	edit_list	szdl	1	7
246	RQ	gd	dcrq	调查日期	text		1	8
247	RQ	gd	jsrq	建设日期	text	jsrq	1	9
248	RQ	gd	jgxz	井盖形状	edit_list	jgxz	1	10
249	RQ	gd	jjgxs	井结构形式	edit_list	jjgxs	1	11
250	RQ	gd	jgcz	井盖材质	list	DL_jgcz	1	12
251	RQ	gd	jglx	井盖类型	edit_spinner	jglx	1	13
252	RQ	gd	jgzw	建构筑物	edit_list	RQ_jgzw	1	14
253	RQ	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	15
254	RQ	gd	x	经度	real		1	16
255	RQ	gd	y	纬度	real		1	17
256	RQ	gd	h	H高程	real		1	18
257	RQ	gd	jbs	井脖深	edit_list	jbs	1	19
258	RQ	gd	jbcc	井脖尺寸	edit_list	jbcc	1	20
259	RQ	gd	jscc	井室尺寸	edit_list	jscc	1	21
260	RQ	gd	qsdw	权属单位	edit_list	qsdw	1	22
261	RQ	gd	tcdw	探测单位	edit_list	tcdw	1	23
262	RQ	gd	pmdwpj	平面定位偏距	edit_list		0	24
263	RQ	gd	bz	备注	edit_list		1	25
264	RQ	gd	tp	图片路径	edit_list		1	26
265	RQ	gx	qsdh	起始点号	text		1	1
266	RQ	gx	zzdh	终止点号	text		1	2
267	RQ	gx	qsms	起始埋深	real		1	3
268	RQ	gx	zzms	终止埋深	real		1	4
269	RQ	gx	gj	管径	edit_list	RQ_gj	1	5
270	RQ	gx	msfs	埋设方式	list	RQ_msfs	1	6
271	RQ	gx	cz	材质	list	RQ_cz	1	7
272	RQ	gx	yl	压力	edit_list	yl	1	8
273	RQ	gx	xxing	线型	edit_list		1	9
274	RQ	gx	bhcz	保护材质	edit_list	bhcz	1	10
275	RQ	gx	qsdw	权属单位	edit_list	qsdw	1	11
276	RQ	gx	tcdw	探测单位	edit_list	tcdw	1	12
277	RQ	gx	szdl	所在道路	edit_list	szdl	1	13
278	RQ	gx	bz	备注	text		1	14
279	GY	gd	wtbh	物探编号	real		1	1
280	GY	gd	tzd	特征点	list	GY_tzd	1	2
281	GY	gd	fsw	附属物	list	GY_fsw	1	3
282	GY	gd	jdsd	井底深度	real		1	4
283	GY	gd	szdl	所在道路	edit_list	szdl	1	5
284	GY	gd	dcrq	调查日期	text		1	6
285	GY	gd	jsrq	建设日期	text	jsrq	1	7
286	GY	gd	jgxz	井盖形状	edit_list	jgxz	1	8
287	GY	gd	jjgxs	井结构形式	edit_list	jjgxs	1	9
288	GY	gd	jgcz	井盖材质	list	DL_jgcz	1	10
289	GY	gd	jglx	井盖类型	edit_spinner	jglx	1	11
290	GY	gd	jgzw	建构筑物	edit_list	GY_jgzw	1	12
291	GY	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	13
292	GY	gd	x	经度	real		1	14
293	GY	gd	y	纬度	real		1	15
294	GY	gd	h	H高程	real		1	16
295	GY	gd	jbs	井脖深	edit_list	jbs	1	17
296	GY	gd	jbcc	井脖尺寸	edit_list	jbcc	1	18
297	GY	gd	jscc	井室尺寸	edit_list	jscc	1	19
298	GY	gd	qsdw	权属单位	edit_list	qsdw	1	20
299	GY	gd	tcdw	探测单位	edit_list	tcdw	1	21
300	GY	gd	pmdwpj	平面定位偏距	edit_list		0	22
301	GY	gd	bz	备注	edit_list		1	23
302	GY	gd	tp	图片路径	edit_list		1	24
303	GY	gx	qsdh	起始点号	text		1	1
304	GY	gx	zzdh	终止点号	text		1	2
305	GY	gx	qsms	起始埋深	real		1	3
306	GY	gx	zzms	终止埋深	real		1	4
307	GY	gx	msfs	埋设方式	list	GY_msfs	1	5
308	GY	gx	gj	管径	edit_list	GY_gj	1	6
309	GY	gx	cz	材质	list	GY_cz	1	7
310	GY	gx	yl	压力	edit_list	yl	1	8
311	GY	gx	ztmc	载体名称	edit_list	ztmc	1	9
312	GY	gx	bhcz	保护材质	edit_list	bhcz	1	10
313	GY	gx	qsdw	权属单位	edit_list	qsdw	1	11
314	GY	gx	tcdw	探测单位	edit_list	tcdw	1	12
315	GY	gx	szdl	所在道路	edit_list	szdl	1	13
316	GY	gx	bz	备注	text		1	14
317	RL	gd	wtbh	物探编号	real		1	1
318	RL	gd	tzd	特征点	list	RL_tzd	1	2
319	RL	gd	fsw	附属物	list	RL_fsw	1	3
320	RL	gd	jdsd	井底深度	real		1	4
321	RL	gd	szdl	所在道路	edit_list	szdl	1	5
322	RL	gd	dcrq	调查日期	text		1	6
323	RL	gd	jsrq	建设日期	text	jsrq	1	7
324	RL	gd	jgxz	井盖形状	edit_list	jgxz	1	8
325	RL	gd	jjgxs	井结构形式	edit_list	jjgxs	1	9
326	RL	gd	jgcz	井盖材质	list	DL_jgcz	1	10
327	RL	gd	jglx	井盖类型	edit_spinner	jglx	1	11
328	RL	gd	jgzw	建构筑物	edit_list	RL_jgzw	1	12
329	RL	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	13
330	RL	gd	x	经度	real		1	14
331	RL	gd	y	纬度	real		1	15
332	RL	gd	h	H高程	real		1	16
333	RL	gd	jbs	井脖深	edit_list	jbs	1	17
334	RL	gd	jbcc	井脖尺寸	edit_list	jbcc	1	18
335	RL	gd	jscc	井室尺寸	edit_list	jscc	1	19
336	RL	gd	qsdw	权属单位	edit_list	qsdw	1	20
337	RL	gd	tcdw	探测单位	edit_list	tcdw	1	21
338	RL	gd	pmdwpj	平面定位偏距	edit_list		0	22
339	RL	gd	bz	备注	edit_list		1	23
340	RL	gd	tp	图片路径	edit_list		1	24
341	RL	gx	qsdh	起始点号	text		1	1
342	RL	gx	zzdh	终止点号	text		1	2
343	RL	gx	qsms	起始埋深	real		1	3
344	RL	gx	zzms	终止埋深	real		1	4
345	RL	gx	gj	管径	edit_list	RL_gj	1	5
346	RL	gx	cz	材质	list	RL_cz	1	6
347	RL	gx	yl	压力	edit_list	yl	1	7
348	RL	gx	ztmc	载体名称	edit_list	ztmc	1	8
349	RL	gx	bhcz	保护材质	edit_list	bhcz	1	9
350	RL	gx	qsdw	权属单位	edit_list	qsdw	1	10
351	RL	gx	tcdw	探测单位	edit_list	tcdw	1	11
352	RL	gx	szdl	所在道路	edit_list	szdl	1	12
353	RL	gx	bz	备注	text		1	13
354	ZH	gd	wtbh	物探编号	real		1	1
355	ZH	gd	tzd	特征点	list	ZH_tzd	1	2
356	ZH	gd	fsw	附属物	list	ZH_fsw	1	3
357	ZH	gd	jdsd	井底深度	real		1	4
358	ZH	gd	szdl	所在道路	edit_list	szdl	1	5
359	ZH	gd	dcrq	调查日期	text		1	6
360	ZH	gd	jsrq	建设日期	text	jsrq	1	7
361	ZH	gd	jgxz	井盖形状	edit_list	jgxz	1	8
362	ZH	gd	jjgxs	井结构形式	edit_list	jjgxs	1	9
363	ZH	gd	jgcz	井盖材质	list	DL_jgcz	1	10
364	ZH	gd	jglx	井盖类型	edit_spinner	jglx	1	11
365	ZH	gd	jgzw	建构筑物	edit_list	ZH_jgzw	1	12
366	ZH	gd	jgcc	井盖尺寸	edit_list	PS_jgcc	1	13
367	ZH	gd	x	经度	real		1	14
368	ZH	gd	y	纬度	real		1	15
369	ZH	gd	h	H高程	real		1	16
370	ZH	gd	jbs	井脖深	edit_list	jbs	1	17
371	ZH	gd	jbcc	井脖尺寸	edit_list	jbcc	1	18
372	ZH	gd	jscc	井室尺寸	edit_list	jscc	1	19
373	ZH	gd	qsdw	权属单位	edit_list	qsdw	1	20
374	ZH	gd	tcdw	探测单位	edit_list	tcdw	1	21
375	ZH	gd	pmdwpj	平面定位偏距	edit_list		0	22
376	ZH	gd	bz	备注	edit_list		1	23
377	ZH	gd	tp	图片路径	edit_list		1	24
378	ZH	gx	qsdh	起始点号	text		1	1
379	ZH	gx	zzdh	终止点号	text		1	2
380	ZH	gx	qsms	起始埋深	real		1	3
381	ZH	gx	zzms	终止埋深	real		1	4
382	ZH	gx	msfs	埋设方式	text	ZH_msfs	1	5
383	ZH	gx	gj	管径	edit_list	ZH_gj	1	6
384	ZH	gx	cz	材质	list	ZH_cz	1	7
385	ZH	gx	yl	压力	edit_list	yl	1	8
386	ZH	gx	zks	总孔数	real	zks	1	9
387	ZH	gx	yyks	已用孔数	real	yyks	1	10
388	ZH	gx	ztmc	载体名称	edit_list	ztmc	1	11
389	ZH	gx	bhcz	保护材质	edit_list	bhcz	1	12
390	ZH	gx	qsdw	权属单位	edit_list	qsdw	1	13
391	ZH	gx	tcdw	探测单位	edit_list	tcdw	1	14
392	ZH	gx	szdl	所在道路	edit_list	szdl	1	15
393	ZH	gx	bz	备注	text		1	16
394	ckd	gd	pointName	点号	edit_list		1	1
395	ckd	gd	showNumber	代码	edit_list		1	2
396	ckd	gd	x	图上经度	real		0	3
397	ckd	gd	y	图上纬度	real		0	4
398	ckd	gd	h	图上高程	real		0	5
```

## 前端渲染规范（form驱动）

1. 页面渲染来源
- 属性设置与采集页面字段均从 form 表驱动，按当前类别映射 form_name（PS/DL/TX/JS/RQ/ZH 等），按页面类型选择 form_type（gd 管点；gx 管线）。
- 仅显示 show=1 的字段，按 number 升序排列。

2. 字段类型与控件映射
- field_type=text：渲染为 input，type='text'
- field_type=real：渲染为 input，type='number' 或 'digit'
- field_type=list：渲染为下拉选择（uni-data-select），选项来源为 domain
- field_type=edit_list：渲染为下拉选择（uni-data-select），附带“手动输入”分支，允许自由文本
- field_type=edit_spinner：渲染为下拉选择（uni-data-select 或类似），附带“手动输入”分支，允许自由文本
- 其他类型（check 等）：按项目需要扩展，建议在前端建立统一映射表

3. domain 选项加载
- 若字段的 domain 非空，尝试从同名表读取选项：SELECT text, value FROM ${domain}
- 同名表至少包含 text 与 value 两列；如果该表不存在，前端回退为“空列表”，对于 edit_* 类型允许“手动输入”
- 示例：电力井盖材质（DL_jgcz），排水井盖尺寸（PS_jgcc）等

4. 类别到 form_name 的映射（采集页面）
- 页面类别值到 form_name 的建议映射：
  - PS：rainwater、sewage、combined、wastewater、unknown_pipeline、comprehensive_tunnel
  - DL：power_supply、street_light、traffic_light
  - TX：china_telecom、china_mobile、china_unicom
  - JS：domestic_water、industrial_water、fire_water
  - RQ：lpg、natural_gas、coal_gas、heating
  - ZH：comprehensive_tunnel
- 可根据 pipe_Line_type_entity 的 TYPE_CODE / PRE_TYPE_CODE 进一步细化映射

5. 特征/附属物下拉选项
- 来源于 feature_appendant_entity 表，按 CATEGORY 与当前 form_name 匹配
- 前端使用 services/feature_appendantEntityService.js 的 getGroupedStructure 获取数据构建 feature / appendant 两组
- 建议在前端加入“手动输入”选项以支持不在库中的自定义值

6. 兼容与回退策略
- 当 SQLite 不可用时，utils/database.js 将回退到 Storage 执行，FormService 保持兼容
- 对于 domain 表缺失，edit_*类型允许“手动输入”，list 类型显示空列表或提示，无阻断采集
- 模板层允许保留一套静态表单作为回退（useDbForm=false 或 dynamicReady=false 时显示）

7. 存储约束与安全
- 不在前端日志中打印敏感数据或 SQL
- 统一通过服务（FormService、FeatureAppendantEntityService）访问 DB，避免页面内直接拼接 SQL


## 属性domain表
```
CREATE TABLE domain(_id integer primary key autoincrement,name text,value text,count integer)
```

```
_id	name	value	count
1	zt	 	0
2	zt	拟建	0
3	zt	在建	0
4	zt	已建	0
5	zt	维修	0
6	zt	待废	0
7	zt	已废	0
8	zt	其他	0
9	yskxs	 	0
10	yskxs	平箅式	0
11	yskxs	立箅式	0
12	yskxs	联合式	0
13	yskxs	偏沟式	0
14	yskfsw	 	0
15	yskfsw	垃圾拦截装置	0
16	yskfsw	防臭装置	0
17	yskfsw	初期雨水截流装置	0
18	yskcl	 	0
19	yskcl	自由出流	0
20	yskcl	常水位淹没	0
21	yskwz	 	0
22	yskwz	人行道	0
23	yskwz	车行道	0
24	yskwz	辅道	0
25	yskwz	其他	0
26	qdlx1	 	0
27	qdlx1	明渠	0
28	qdlx1	暗渠	0
29	qdlx1	盖板渠	0
30	qdlx2	 	0
31	qdlx2	植草沟	0
32	qdlx2	渗渠	0
33	qdlx2	其他	0
34	yllx	 	0
35	yllx	重力	0
36	yllx	压力	0
37	yclff	 	0
38	yclff	物理法	0
39	yclff	化学法	0
40	yclff	物理化学法	0
41	yclff	生物处理法	0
42	gqjg	 	0
43	gqjg	现浇	0
44	gqjg	预制	0
45	gqjg	砌砖	0
46	gqjg	砌石	0
47	DL_gj	20*20	0
48	DL_gj	20	0
49	DL_gj	200	0
50	DL_gj	200*200	0
51	DL_gj	40	0
52	DL_gj	400*400	0
53	DL_gj	50	0
54	DL_gj	500	0
55	DL_gj	50*50	0
56	DL_gj	500*500	0
57	DL_gj	600*1000	0
58	DL_gj	60	0
59	DL_gj	600	0
60	DL_gj	10	0
61	DL_gj	100	0
62	DL_gj	100*100	0
63	DL_gj	1000*1000	0
64	DL_gj	900*1000	0
65	DL_gj	900	0
66	DL_gj	900*1200	0
67	DL_gj	1200*1200	0
68	DL_gj	1200	0
69	DL_tzd	一般管线点	0
70	DL_tzd	转折点	0
71	DL_tzd	分支点	0
72	DL_tzd	三分支	0
73	DL_tzd	四分支	0
74	DL_tzd	五分支	0
75	DL_tzd	多分支	0
76	DL_tzd	预留口	0
77	DL_tzd	非普查	0
78	DL_tzd	入户	0
79	DL_tzd	井边点	0
80	DL_tzd	井内点	0
81	DL_tzd	上杆	0
82	DL_tzd	拐点	0
83	DL_tzd	弯头	0
84	DL_tzd	出地	0
85	DL_tzd	终止点	0
86	DL_fsw	无	0
87	DL_fsw	电力路灯	0
88	DL_fsw	电力变径点	0
89	DL_fsw	电力预留口	0
90	DL_fsw	电力非普查	0
91	DL_fsw	电力出地	0
92	DL_fsw	电力出地点	0
93	DL_fsw	电力管帽	0
94	DL_fsw	电力阀门	0
95	DL_fsw	电力检修井	0
96	DL_fsw	电力手孔井	0
97	DL_fsw	电力人孔井	0
98	DL_fsw	电力窨井	0
99	DL_fsw	电力交接箱	0
100	DL_fsw	电力变压器	0
101	DL_fsw	电力信号灯	0
102	DL_fsw	电力配电箱	0
103	DL_fsw	电力接线箱	0
104	DL_fsw	电力线杆	0
105	DL_fsw	电力手孔	0
106	DL_fsw	电力地灯	0
107	DL_fsw	电力通风井	0
108	DL_fsw	电力配电室	0
109	DL_fsw	电力变电站	0
110	DL_fsw	电力控制柜	0
111	DL_fsw	电力环网柜	0
112	DL_fsw	电力监视器	0
113	DL_fsw	电力广告牌	0
114	DL_fsw	电力电话亭	0
115	DL_fsw	电力发射塔	0
116	DL_fsw	电力摄像头	0
117	DL_fsw	电力输电电塔	0
118	DL_jgcz	无	0
119	DL_jgcz	金属	0
120	DL_jgcz	铸铁	0
121	DL_jgcz	砼	0
122	DL_jgcz	塑料	0
123	DL_jgcz	钢	0
124	DL_jgcz	玻璃钢	0
125	DL_jgcz	大理石	0
126	DL_pp	人行道	0
127	DL_pp	车行道	0
128	DL_pp	辅道	0
129	DL_pp	绿化	0
130	DL_pp	其他	0
131	DL_yydm	福田区人民政府	0
257	DL_yydm	深圳市标力测绘技术有限公司	0
258	TX_tzd	一般管线点	0
259	TX_tzd	转折点	0
260	TX_tzd	分支点	0
261	TX_tzd	三分支	0
262	TX_tzd	四分支	0
263	TX_tzd	五分支	0
264	TX_tzd	多分支	0
265	TX_tzd	预留口	0
266	TX_tzd	非普查	0
267	TX_tzd	入户	0
268	TX_tzd	井边点	0
269	TX_tzd	井内点	0
270	TX_tzd	起始点	0
271	TX_tzd	终止点	0
272	TX_tzd	上杆	0
273	TX_tzd	拐点	0
274	TX_tzd	弯头	0
275	TX_tzd	出地	0
276	TX_fsw	无	0
277	TX_fsw	电信人孔井	0
278	TX_fsw	电信手孔井	0
279	TX_fsw	电信交线箱	0
280	TX_fsw	电信配电箱	0
281	TX_fsw	电信接线箱	0
282	TX_fsw	电信电话亭	0
283	TX_fsw	电信摄像头	0
284	TX_fsw	电信监控器	0
285	TX_fsw	电信无线电杆	0
286	TX_fsw	电信差转台	0
287	TX_fsw	电信发射塔	0
288	TX_fsw	电信交换站	0
289	TX_fsw	电信预留口	0
290	TX_fsw	电信非普查	0
291	TX_fsw	电信出地	0
292	TX_fsw	电信出地点	0
293	TX_fsw	电信管帽	0
294	TX_fsw	电信阀门	0
295	TX_fsw	电信变径点	0
296	TX_fsw	电信人孔	0
297	TX_fsw	电信手孔	0
298	TX_gj	20*20	0
299	TX_gj	20	0
300	TX_gj	200	0
301	TX_gj	200*200	0
302	TX_gj	40	0
303	TX_gj	400*400	0
304	TX_gj	50	0
305	TX_gj	500	0
306	TX_gj	50*50	0
307	TX_gj	500*500	0
308	TX_gj	600*1000	0
309	TX_gj	60	0
310	TX_gj	600	0
311	TX_gj	10	0
312	TX_gj	100	0
313	TX_gj	100*100	0
314	TX_gj	1000*1000	0
315	TX_gj	900*1000	0
316	TX_gj	900	0
317	TX_gj	900*1200	0
318	TX_gj	1200*1200	0
319	TX_gj	1200	0
320	JS_tzd	一般管线点	0
321	JS_tzd	测压点	0
322	JS_tzd	测流点	0
323	JS_tzd	水质监测点	0
324	JS_tzd	拐点	0
325	JS_tzd	变径	0
326	JS_tzd	出地	0
327	JS_tzd	盖堵	0
328	JS_tzd	弯头	0
329	JS_tzd	三通	0
330	JS_tzd	四通	0
331	JS_tzd	五通	0
332	JS_tzd	多通	0
333	JS_tzd	预留口	0
334	JS_tzd	非普查	0
335	JS_tzd	入户	0
336	JS_tzd	井边点	0
337	JS_tzd	井内点	0
338	JS_tzd	起始点	0
339	JS_tzd	终止点	0
340	JS_fsw	无	0
341	JS_fsw	给水排气阀	0
342	JS_fsw	给水排污阀	0
343	JS_fsw	给水检修井	0
344	JS_fsw	给水窨井	0
345	JS_fsw	给水消防井	0
346	JS_fsw	给水水表	0
347	JS_fsw	给水阀门孔	0
348	JS_fsw	给水水质监测点	0
349	JS_fsw	给水沉淀池	0
350	JS_fsw	给水水表井	0
351	JS_fsw	给水消火栓	0
352	JS_fsw	给水阀门井	0
353	JS_fsw	给水阀门	0
354	JS_fsw	给水水塔	0
355	JS_fsw	给水水源井	0
356	JS_fsw	给水预留口	0
357	JS_fsw	给水非普查	0
358	JS_fsw	给水出地	0
359	JS_fsw	给水出地点	0
360	JS_fsw	给水泵站	0
361	JS_fsw	给水管帽	0
362	JS_fsw	给水立管	0
363	JS_fsw	给水变径点	0
364	JS_jgzw	无	0
365	JS_jgzw	水源井	0
366	JS_jgzw	给水泵站	0
367	JS_jgzw	水塔	0
368	JS_jgzw	清水池	0
369	JS_jgzw	净水池	0
370	JS_gj	100	0
371	JS_gj	1000	0
372	JS_gj	200	0
373	JS_gj	2000	0
374	JS_gj	20	0
375	JS_gj	300	0
376	JS_gj	30	0
377	JS_gj	3000	0
378	JS_gj	400	0
379	JS_gj	40	0
380	JS_gj	4000	0
381	JS_gj	500	0
382	JS_gj	50	0
383	JS_gj	600	0
384	JS_gj	60	0
385	PS_tzd	一般管线点	1
386	PS_tzd	三通	0
387	PS_tzd	四通	0
388	PS_tzd	五通	0
389	PS_tzd	六通	0
390	PS_tzd	七通	0
391	PS_tzd	八通	0
392	PS_tzd	九通	0
393	PS_tzd	多通	0
394	PS_tzd	户出	0
395	PS_tzd	入户	0
396	PS_tzd	起始点	0
397	PS_tzd	终止点	0
398	PS_tzd	进水口	0
399	PS_tzd	出水口	0
400	PS_tzd	预留口	0
401	PS_tzd	非普查	0
402	PS_tzd	出地	0
403	PS_tzd	变径	0
404	PS_tzd	拐点	0
405	PS_tzd	井边点	0
406	PS_tzd	井内点	0
407	PS_tzd	沟边点	0
408	PS_tzd	连接暗井	0
409	PS_tzd	转折点	0
410	PS_fsw	无	0
411	PS_fsw	排水检查井	0
412	PS_fsw	排水检修井	0
413	PS_fsw	排水雨篦	0
414	PS_fsw	排水污篦	0
415	PS_fsw	排水立管	0
416	PS_fsw	排水化粪池	0
417	PS_fsw	排水出气井	0
418	PS_fsw	排水通风井	0
419	PS_fsw	排水进水口	0
420	PS_fsw	排水出水口	0
421	PS_fsw	排水预留口	0
422	PS_fsw	排水沉泥井	0
423	PS_fsw	排水拍门	0
424	PS_fsw	排水拍门井	0
425	PS_fsw	排水隔油池	0
426	PS_fsw	排水小型沉淀池	0
427	PS_fsw	排水排水泵站	0
428	PS_fsw	排水排污装置	0
429	PS_fsw	排水沉淀池	0
430	PS_fsw	排水降温池	0
431	PS_fsw	排水中和池	0
432	PS_fsw	排水毛发集污井	0
433	PS_fsw	排水消毒设施	0
434	PS_fsw	排水渗水井	0
435	PS_fsw	排水冲洗井	0
436	PS_fsw	排水跌水井	0
437	PS_fsw	排水污水井	0
438	PS_fsw	排水雨水口	0
439	PS_fsw	排水雨水井	0
440	PS_fsw	排水闸门井	0
441	PS_fsw	排水溢流井	0
442	PS_fsw	排水阀门井	0
443	PS_fsw	排水阀门	0
444	PS_fsw	排水洗手台	0
445	PS_fsw	排水非普查	0
446	PS_fsw	排水出地	0
447	PS_fsw	排水出地点	0
448	PS_fsw	排水管帽	0
449	PS_fsw	排水连接暗井	0
450	PS_fsw	排水潮门井	0
451	PS_fsw	排水倒虹管	0
452	PS_fsw	排水化粪池井	0
453	PS_fsw	排水方形污水窨井	0
454	PS_fsw	排水圆形污水窨井	0
455	PS_fsw	排水方形污水篦子	0
456	PS_fsw	排水方形雨水窨井	0
457	PS_fsw	排水圆形雨水窨井	0
458	PS_fsw	排水方形雨水篦子	0
459	PS_fsw	排水井边框	0
460	PS_fsw	排水窨井	0
461	PS_fsw	排水变径点	0
462	PS_fsw	排水预留井	0
463	PS_jgzw	无	0
464	PS_jgzw	排水泵站	0
465	PS_jgzw	沉淀池	0
466	PS_jgzw	化粪池	0
467	PS_jgzw	净化构筑物	0
468	PS_jgzw	暗沟地面出口	0
469	yspsh	无	0
470	yspsh	政府机关事业单位	0
471	yspsh	生产企业	0
472	yspsh	工业园	0
473	yspsh	学校	0
474	yspsh	医院	0
475	yspsh	疗养院	0
476	yspsh	社区诊所	0
477	yspsh	住宅小区	0
478	yspsh	临街商户	0
479	yspsh	商业体	0
480	yspsh	大型商场	0
481	yspsh	餐饮酒店	0
482	yspsh	汽修及洗车店	0
483	yspsh	施工工地	0
484	yspsh	养殖场	0
485	yspsh	其他	0
486	yswslx	无	0
487	yswslx	生活污水	0
488	yswslx	餐饮污水	0
489	yswslx	工业污水	0
490	yswslx	医疗废水	0
491	yswslx	养殖业	0
492	yswslx	其他	0
493	PS_sfgw	是	0
494	PS_sfgw	否	0
495	PS_jgsfwh	是	0
496	PS_jgsfwh	否	0
497	gdlx	重力管	0
498	gdlx	压力管	0
499	PS_jcjlx	无	0
500	PS_jcjlx	雨水口	0
501	PS_jcjlx	检查井	0
502	PS_jcjlx	化粪池	0
503	PS_jcjlx	连接暗井	0
504	pslb	 	0
505	pslb	CS	0
506	pslb	SH	0
507	pslb	HFC	0
508	pslb	YS	0
509	pslb	QT	0
510	PS_jcjglx	无	0
511	PS_jcjglx	一代井盖	0
512	PS_jcjglx	二代井盖	0
513	PS_jcjglx	水泥井盖	0
514	PS_gj	100	0
515	PS_gj	1000	0
516	PS_gj	1000*1000	0
517	PS_gj	200	0
518	PS_gj	2000	0
519	PS_gj	2000*2000	0
520	PS_gj	300	0
521	PS_gj	3000	0
522	PS_gj	300*300	0
523	PS_gj	400	0
524	PS_gj	4000	0
525	PS_gj	400*400	0
526	PS_gj	500	0
527	PS_gj	500*500	0
528	PS_gj	600	0
529	PS_gj	600*600	0
530	PS_gj	800	0
531	PS_gj	800*800	0
532	RQ_tzd	变径	0
533	RQ_tzd	出地	0
534	RQ_tzd	盖堵	0
535	RQ_tzd	弯头	0
536	RQ_tzd	拐点	0
537	RQ_tzd	三通	0
538	RQ_tzd	四通	0
539	RQ_tzd	五通	0
540	RQ_tzd	多通	0
541	RQ_tzd	预留口	0
542	RQ_tzd	非普查	0
543	RQ_tzd	入户	0
544	RQ_tzd	一般管线点	1
545	RQ_tzd	井边点	0
546	RQ_tzd	井内点	0
547	RQ_tzd	起始点	0
548	RQ_tzd	终止点	0
549	RQ_tzd	转折点	0
550	RQ_tzd	变深	0
551	RQ_fsw	无	0
552	RQ_fsw	燃气阀门井	0
553	RQ_fsw	燃气阀门	0
554	RQ_fsw	燃气检修井	0
555	RQ_fsw	燃气凝水缸	0
556	RQ_fsw	燃气压力表	0
557	RQ_fsw	燃气阴保测试桩	0
558	RQ_fsw	燃气波形管	0
559	RQ_fsw	燃气调压站	0
560	RQ_fsw	燃气调压箱	0
561	RQ_fsw	燃气调压器	0
562	RQ_fsw	燃气调压阀	0
563	RQ_fsw	燃气调压柜	0
564	RQ_fsw	燃气储备站	0
565	RQ_fsw	燃气门站	0
566	RQ_fsw	燃气燃气柜	0
567	RQ_fsw	燃气燃气站	0
568	RQ_fsw	燃气燃气桩	0
569	RQ_fsw	燃气凝水井	0
570	RQ_fsw	燃气补偿器	0
571	RQ_fsw	燃气涨缩站	0
572	RQ_fsw	燃气预留口	0
573	RQ_fsw	燃气非普查	0
574	RQ_fsw	燃气出地	0
575	RQ_fsw	燃气出地点	0
576	RQ_fsw	燃气管帽	0
577	RQ_fsw	燃气变径点	0
578	RQ_jgzw	无	0
579	RQ_jgzw	调压房	0
580	RQ_jgzw	煤气站	0
581	RQ_jgzw	锅炉房	0
582	RQ_jgzw	动力站	0
583	RQ_jgzw	储气柜	0
584	RQ_jgzw	冷却塔	0
585	RQ_gj	100	0
586	RQ_gj	1000	0
587	RQ_gj	1000*1000	0
588	RQ_gj	200	0
589	RQ_gj	2000	0
590	RQ_gj	2000*2000	0
591	RQ_gj	300	0
592	RQ_gj	3000	0
593	RQ_gj	300*300	0
594	RQ_gj	400	0
595	RQ_gj	4000	0
596	RQ_gj	400*400	0
597	RQ_gj	500	0
598	RQ_gj	500*500	0
599	RQ_gj	600	0
600	RQ_gj	600*600	0
601	RQ_gj	800	0
602	RQ_gj	800*800	0
603	GY_tzd	变径	0
604	GY_tzd	出地	0
605	GY_tzd	盖堵	0
606	GY_tzd	弯头	0
607	GY_tzd	三通	0
608	GY_tzd	四通	0
609	GY_tzd	五通	0
610	GY_tzd	多通	0
611	GY_tzd	预留口	0
612	GY_tzd	非普查	0
613	GY_tzd	入户	0
614	GY_tzd	一般管线点	1
615	GY_tzd	井边点	0
616	GY_tzd	井内点	0
617	GY_tzd	起始点	0
618	GY_tzd	终止点	0
619	GY_tzd	变坡	0
620	GY_tzd	变深	0
621	GY_tzd	拐点	0
622	GY_fsw	无	0
623	GY_fsw	工业预留口	0
624	GY_fsw	工业排污装置	0
625	GY_fsw	工业阀门	0
626	GY_fsw	工业阀门井	0
627	GY_fsw	工业检修井	0
628	GY_fsw	工业补偿器	0
629	GY_fsw	工业涨缩器	0
630	GY_fsw	工业泵站	0
631	GY_fsw	工业冷却塔	0
632	GY_fsw	工业动力站	0
633	GY_fsw	工业锅炉房	0
634	GY_fsw	工业非普查	0
635	GY_fsw	工业出地	0
636	GY_fsw	工业出地点	0
637	GY_fsw	工业管帽	0
638	GY_fsw	工业变径点	0
639	GY_jgzw	无	0
640	GY_jgzw	调压房	0
641	GY_jgzw	锅炉房	0
642	GY_jgzw	动力站	0
643	GY_jgzw	储气柜	0
644	GY_jgzw	冷却塔	0
645	GY_gj	100	0
646	GY_gj	1000	0
647	GY_gj	1000*1000	0
648	GY_gj	200	0
649	GY_gj	2000	0
650	GY_gj	2000*2000	0
651	GY_gj	300	0
652	GY_gj	3000	0
653	GY_gj	300*300	0
654	GY_gj	400	0
655	GY_gj	4000	0
656	GY_gj	400*400	0
657	GY_gj	500	0
658	GY_gj	500*500	0
659	GY_gj	600	0
660	GY_gj	600*600	0
661	GY_gj	800	0
662	GY_gj	800*800	0
663	RL_tzd	变径	0
664	RL_tzd	出地	0
665	RL_tzd	盖堵	0
666	RL_tzd	弯头	0
667	RL_tzd	三通	0
668	RL_tzd	四通	0
669	RL_tzd	五通	0
670	RL_tzd	多通	0
671	RL_tzd	预留口	0
672	RL_tzd	非普查	0
673	RL_tzd	入户	0
674	RL_tzd	一般管线点	1
675	RL_tzd	井边点	0
676	RL_tzd	井内点	0
677	RL_tzd	起始点	0
678	RL_tzd	终止点	0
679	RL_tzd	转折点	0
680	RL_fsw	无	0
681	RL_fsw	热力预留口	0
682	RL_fsw	热力阀门	0
683	RL_fsw	热力阀门井	0
684	RL_fsw	热力检修井	0
685	RL_fsw	热力非普查	0
686	RL_fsw	热力变径点	0
687	RL_fsw	热力出地	0
688	RL_fsw	热力出地点	0
689	RL_fsw	热力冷却塔	0
690	RL_fsw	热力动力站	0
691	RL_fsw	热力涨缩器	0
692	RL_fsw	热力管帽	0
693	RL_fsw	热力吹扫井	0
694	RL_fsw	热力疏水	0
695	RL_fsw	热力真空表	0
696	RL_fsw	热力固定节	0
697	RL_fsw	热力安全阀	0
698	RL_fsw	热力排潮孔	0
699	RL_fsw	热力供热泵站	0
700	RL_fsw	热力调压装置	0
701	RL_fsw	热力换热站	0
702	RL_fsw	热力锅炉房	0
703	RL_gj	100	0
704	RL_gj	1000	0
705	RL_gj	1000*1000	0
706	RL_gj	200	0
707	RL_gj	2000	0
708	RL_gj	2000*2000	0
709	RL_gj	300	0
710	RL_gj	3000	0
711	RL_gj	300*300	0
712	RL_gj	400	0
713	RL_gj	4000	0
714	RL_gj	400*400	0
715	RL_gj	500	0
716	RL_gj	500*500	0
717	RL_gj	600	0
718	RL_gj	600*600	0
719	RL_gj	800	0
720	RL_gj	800*800	0
721	ZH_tzd	变径	0
722	ZH_tzd	出地	0
723	ZH_tzd	三通	0
724	ZH_tzd	四通	0
725	ZH_tzd	五通	0
726	ZH_tzd	拐点	0
727	ZH_tzd	多通	0
728	ZH_tzd	预留口	0
729	ZH_tzd	非普查	0
730	ZH_tzd	一般管线点	1
731	ZH_tzd	井边点	0
732	ZH_tzd	井内点	0
733	ZH_tzd	起始点	0
734	ZH_tzd	终止点	0
735	ZH_fsw	无	0
736	ZH_fsw	综合管廊预留口	0
737	ZH_fsw	综合管廊阀门	0
738	ZH_fsw	综合管廊检修井	0
739	ZH_fsw	综合管廊通风井	0
740	ZH_fsw	综合管廊投料口	0
741	ZH_fsw	综合管廊排气装置	0
742	ZH_fsw	综合管廊非普查	0
743	ZH_fsw	综合管廊出地	0
744	ZH_fsw	综合管廊出地点	0
745	ZH_fsw	综合管廊管帽	0
746	ZH_fsw	综合管廊变径点	0
747	ZH_gj	100	0
748	ZH_gj	1000	0
749	ZH_gj	1000*1000	0
750	ZH_gj	200	0
751	ZH_gj	2000	0
752	ZH_gj	2000*2000	0
753	ZH_gj	300	0
754	ZH_gj	3000	0
755	ZH_gj	300*300	0
756	ZH_gj	400	0
757	ZH_gj	4000	0
758	ZH_gj	400*400	0
759	ZH_gj	500	0
760	ZH_gj	500*500	0
761	ZH_gj	600	0
762	ZH_gj	600*600	0
763	ZH_gj	800	0
764	ZH_gj	800*800	0
765	DL_msfs	管块	0
766	DL_msfs	沟道	0
767	DL_msfs	直埋	0
768	DL_msfs	管道	0
769	DL_msfs	方沟	0
770	DL_msfs	自流	0
771	DL_msfs	压力	0
772	DL_msfs	套管	0
773	DL_msfs	顶管	0
774	DL_msfs	井边点	0
775	DL_msfs	有沟道	0
776	DL_msfs	无沟道	0
777	DL_msfs	管埋	0
778	DL_msfs	明渠	0
779	DL_msfs	明管	0
780	DL_msfs	架空	0
781	DL_msfs	水渠	0
782	DL_msfs	井内连线	0
783	TX_msfs	管块	0
784	TX_msfs	沟道	0
785	TX_msfs	直埋	0
786	TX_msfs	管道	0
787	TX_msfs	方沟	0
788	TX_msfs	自流	0
789	TX_msfs	压力	0
790	TX_msfs	套管	0
791	TX_msfs	顶管	0
792	TX_msfs	井边点	0
793	TX_msfs	有沟道	0
794	TX_msfs	无沟道	0
795	TX_msfs	管埋	0
796	TX_msfs	明渠	0
797	TX_msfs	明管	0
798	TX_msfs	架空	0
799	TX_msfs	水渠	0
800	TX_msfs	井内连线	0
801	JS_msfs		0
802	JS_msfs	管块	0
803	JS_msfs	沟道	0
804	JS_msfs	直埋	0
805	JS_msfs	管道	0
806	JS_msfs	方沟	0
807	JS_msfs	自流	0
808	JS_msfs	压力	0
809	JS_msfs	套管	0
810	JS_msfs	顶管	0
811	JS_msfs	井边点	0
812	JS_msfs	有沟道	0
813	JS_msfs	无沟道	0
814	JS_msfs	管埋	0
815	JS_msfs	明渠	0
816	JS_msfs	明管	0
817	JS_msfs	架空	0
818	JS_msfs	水渠	0
819	JS_msfs	井内连线	0
820	PS_msfs		0
821	PS_msfs	管块	0
822	PS_msfs	沟道	0
823	PS_msfs	直埋	0
824	PS_msfs	管道	0
825	PS_msfs	管沟	0
826	PS_msfs	方沟	0
827	PS_msfs	自流	0
828	PS_msfs	压力	0
829	PS_msfs	套管	0
830	PS_msfs	顶管	0
831	PS_msfs	井边点	0
832	PS_msfs	有沟道	0
833	PS_msfs	无沟道	0
834	PS_msfs	管埋	0
835	PS_msfs	明渠	0
836	PS_msfs	明管	0
837	PS_msfs	架空	0
838	PS_msfs	水渠	0
839	PS_msfs	井内连线	0
840	PS_hjyy	建筑内污废水私接进入雨水管道处	0
841	PS_hjyy	阳台废水混接处，即洗衣机废水或洗涤盆废水接入雨水立管处	0
842	PS_hjyy	小区公共卫生设施污水进入雨水管道处	0
843	PS_hjyy	沿街商户等单位的污水进入雨水口处	0
844	PS_hjyy	工业区企业内废水接入雨水管道处	0
845	PS_hjyy	排水单元户内部雨水立管或雨水支管接入污水管道处	0
846	RQ_msfs		0
847	RQ_msfs	管块	0
848	RQ_msfs	沟道	0
849	RQ_msfs	直埋	0
850	RQ_msfs	管道	0
851	RQ_msfs	方沟	0
852	RQ_msfs	自流	0
853	RQ_msfs	压力	0
854	RQ_msfs	套管	0
855	RQ_msfs	顶管	0
856	RQ_msfs	井边点	0
857	RQ_msfs	有沟道	0
858	RQ_msfs	无沟道	0
859	RQ_msfs	管埋	0
860	RQ_msfs	明渠	0
861	RQ_msfs	明管	0
862	RQ_msfs	架空	0
863	RQ_msfs	水渠	0
864	RQ_msfs	井内连线	0
865	RL_msfs	管块	0
866	RL_msfs	沟道	0
867	RL_msfs	直埋	0
868	RL_msfs	管道	0
869	RL_msfs	方沟	0
870	RL_msfs	自流	0
871	RL_msfs	压力	0
872	RL_msfs	套管	0
873	RL_msfs	顶管	0
874	RL_msfs	井边点	0
875	RL_msfs	有沟道	0
876	RL_msfs	无沟道	0
877	RL_msfs	管埋	0
878	RL_msfs	明渠	0
879	RL_msfs	明管	0
880	RL_msfs	架空	0
881	RL_msfs	水渠	0
882	RL_msfs	井内连线	0
883	GY_msfs	管块	0
884	GY_msfs	沟道	0
885	GY_msfs	直埋	0
886	GY_msfs	管道	0
887	GY_msfs	方沟	0
888	GY_msfs	自流	0
889	GY_msfs	压力	0
890	GY_msfs	套管	0
891	GY_msfs	顶管	0
892	GY_msfs	井边点	0
893	GY_msfs	有沟道	0
894	GY_msfs	无沟道	0
895	GY_msfs	管埋	0
896	GY_msfs	明渠	0
897	GY_msfs	明管	0
898	GY_msfs	架空	0
899	GY_msfs	水渠	0
900	GY_msfs	井内连线	0
901	ZH_msfs	管块	0
902	ZH_msfs	沟道	0
903	ZH_msfs	直埋	0
904	ZH_msfs	管道	0
905	ZH_msfs	方沟	0
906	ZH_msfs	自流	0
907	ZH_msfs	压力	0
908	ZH_msfs	套管	0
909	ZH_msfs	顶管	0
910	ZH_msfs	井边点	0
911	ZH_msfs	有沟道	0
912	ZH_msfs	无沟道	0
913	ZH_msfs	管埋	0
914	ZH_msfs	明渠	0
915	ZH_msfs	明管	0
916	ZH_msfs	架空	0
917	ZH_msfs	水渠	0
918	ZH_msfs	井内连线	0
919	tgcz	 	0
920	tgcz	塑料	0
921	tgcz	铸铁	0
922	tgcz	PE	0
923	tgcz	玻璃钢	0
924	tgcz	砼	0
925	jglx	 	0
926	jglx	非防盗	0
927	jglx	防盗	0
928	jgxz	 	0
929	jgxz	圆形	0
930	jgxz	矩形	0
931	dy	10KV	0
932	dy	380V	0
933	dy	220V	0
934	dy	110KV	0
935	dy	220KV	0
936	dy	0.38KV	0
937	DL_cz	 	0
938	DL_cz	铜	0
939	DL_cz	铸铁	0
940	DL_cz	玻璃钢	0
941	DL_cz	砼	0
942	DL_cz	钢芯铝绞线	0
943	DL_cz	塑料	0
944	DL_cz	砖	0
945	DL_cz	砖石	0
946	DL_cz	空管	0
947	DL_cz	PVC	0
948	DL_cz	钢	0
949	DL_cz	塑胶	0
950	DL_cz	HDPE	0
951	DL_cz	MPP	0
952	DL_cz	PE	0
953	DL_cz	热镀锌钢	0
954	DL_cz	橡胶	0
955	DL_cz	其它	0
956	TX_cz	 	0
957	TX_cz	砼	0
958	TX_cz	塑料	0
959	TX_cz	光纤	0
960	TX_cz	铜	0
961	TX_cz	砖	0
962	TX_cz	砖石	0
963	TX_cz	铜/光	0
964	TX_cz	铸铁	0
965	TX_cz	空管	0
966	TX_cz	塑胶	0
967	TX_cz	灰管	0
968	TX_cz	PVC	0
969	TX_cz	钢套塑	0
970	TX_cz	其它	0
971	JS_cz	 	0
972	JS_cz	铸铁	0
973	JS_cz	玻璃钢	0
974	JS_cz	钢	0
975	JS_cz	砼	0
976	JS_cz	球墨铸铁	0
977	JS_cz	塑料	0
978	JS_cz	钢塑复合	0
979	JS_cz	铝塑复合	0
980	JS_cz	玻璃钢夹沙	0
981	JS_cz	灰口铸铁	0
982	JS_cz	自应力混泥土	0
983	JS_cz	预应力混泥土	0
984	JS_cz	热镀锌钢	0
985	JS_cz	不锈钢	0
986	JS_cz	PVC	0
987	JS_cz	PPR	0
988	JS_cz	PE	0
989	JS_cz	铁	0
990	JS_cz	其它	0
991	lx	顺流	2
992	lx	逆流	0
993	PS_cz	 	0
994	PS_cz	塑料	0
995	PS_cz	钢筋混泥土	0
996	PS_cz	砖	0
997	PS_cz	砖石	0
998	PS_cz	砼	0
999	PS_cz	石棉	0
1000	PS_cz	陶瓷	0
1001	PS_cz	球墨铸铁	0
1002	PS_cz	铸铁	0
1003	PS_cz	陶土	0
1004	PS_cz	HDPE	0
1005	PS_cz	钢	0
1006	PS_cz	玻璃钢	0
1007	PS_cz	石	0
1008	PS_cz	PVC	0
1009	PS_cz	PE	0
1010	PS_cz	塑胶	0
1011	PS_cz	铁	0
1012	PS_cz	单壁波纹管	0
1013	PS_cz	双壁波纹管	0
1014	PS_cz	其它	0
1015	GY_cz	 	0
1016	GY_cz	钢	0
1017	GY_cz	塑料	0
1018	GY_cz	PE	0
1019	GY_cz	PVC	0
1020	GY_cz	铸铁	0
1021	GY_cz	塑胶	0
1022	GY_cz	铁	0
1023	GY_cz	其它	0
1024	RQ_cz	 	0
1025	RQ_cz	铸铁	0
1026	RQ_cz	钢	0
1027	RQ_cz	塑料	0
1028	RQ_cz	钢骨架	0
1029	RQ_cz	灰口铸铁	0
1030	RQ_cz	PE	0
1031	RQ_cz	塑胶	0
1032	RQ_cz	其它	0
1033	RL_cz	 	0
1034	RL_cz	钢	0
1035	RL_cz	铸铁	0
1036	ZH_cz	 	0
1037	ZH_cz	铸铁	0
1038	ZH_cz	塑料	0
1039	ZH_cz	砼	0
1040	lglx	 	0
1041	lglx	污水	0
1042	lglx	雨水	0
1043	lglx	雨污合流	0
1044	jsfdk	是	1
1045	jsfdk	否	0

```


## 用户创建的管点数据

表名为：pipe_point_entity
```
CREATE TABLE pipe_point_entity (
    PID                 TEXT    PRIMARY KEY
                                NOT NULL,
    PIPE_NUMBER         TEXT,
    X                   REAL    NOT NULL,
    Y                   REAL    NOT NULL,
    X2000               REAL    NOT NULL,
    Y2000               REAL    NOT NULL,
    PIPE_TYPE           TEXT,
    POINT_FEATURE       TEXT,
    POINT_APPENTANT     TEXT,
    POINT_MATERIAL      TEXT,
    POINT_TYPE          TEXT,
    POINT_SPECIFICATION TEXT,
    DEFECT_TYPE         TEXT,
    DEFECT_LEVELS       TEXT,
    POINT_DEPTH         TEXT,
    GROUND_ELEVATION    TEXT,
    OWNER_UNIT          TEXT,
    OWNER_ROAD          TEXT,
    REMARK              TEXT,
    SIGN                TEXT,
    VIRTUAL             TEXT,
    UPDATE_TIME         INTEGER,
    DELETE_SIGN         INTEGER NOT NULL,
    CHECK_USER          TEXT,
    DETECT_UNIT         TEXT,
    STREET_OFFICE       TEXT,
    HANDING_NET         TEXT,
    CHECK_WELL_TYPE     TEXT,
    WELL_SIGN_NUMBER    TEXT,
    INTERNAL_CHECK      TEXT,
    VISUAL_Check        TEXT,
    BUILDING_STRUCTURE  TEXT,
    PS_USER             TEXT,
    PS_TYPE             TEXT,
    PARTS_SPECIFICATION TEXT,
    OPERATION_UNIT      TEXT,
    POINT_LOCATION      TEXT,
    PROJECT_NUMVER      TEXT,
    PROJECT_NAME        TEXT,
    BUILDING_DATE       INTEGER,
    SURVEY_DATE         INTEGER,
    UPDATE_DATE         INTEGER
);
```

数据实例：
```
PID	PIPE_NUMBER	X	Y	X2000	Y2000	PIPE_TYPE	POINT_FEATURE	POINT_APPENTANT	POINT_MATERIAL	POINT_TYPE	POINT_SPECIFICATION	DEFECT_TYPE	DEFECT_LEVELS	POINT_DEPTH	GROUND_ELEVATION	OWNER_UNIT	OWNER_ROAD	REMARK	SIGN	VIRTUAL	UPDATE_TIME	DELETE_SIGN	CHECK_USER	DETECT_UNIT	STREET_OFFICE	HANDING_NET	CHECK_WELL_TYPE	WELL_SIGN_NUMBER	INTERNAL_CHECK	VISUAL_Check	BUILDING_STRUCTURE	PS_USER	PS_TYPE	PARTS_SPECIFICATION	OPERATION_UNIT	POINT_LOCATION	PROJECT_NUMVER	PROJECT_NAME	BUILDING_DATE	SURVEY_DATE	UPDATE_DATE
7b53ffef49ba4fa69c6be6ce34d9f8dc	1YS1	113.49449971377697	23.15708582459594	0	0	YS														0	1757211301612	0																			
4b4a6c62e8a640ba93296a7f5b4a6bb8	1YS2	113.49418906918652	23.15510183734007	0	0	YS														0	1757211310848	0																			
e5e468416e904adfa749523246e1447d	1YS3	113.49546155568386	23.15560028372445	0	0	YS														0	1757211333522	0																			
d6e0ca5bcf104571b39fa76a300c76b4	XN1YS2_1	113.49598418735972	23.15452216890658	1372257.378490422	2587207.1157203675	YS													0	1	1757214657469	0																			
f4ef05d903e94d179aeb16d08beb5f8e	1YS4	113.49479311255092	23.15392009163551	0	0	YS														0	1757231810703	0																			
451d9366c3574b1c9ad6a42716752026	1YS5	113.49671286594504	23.15384349859865	0	0	YS														0	1757231813172	0																			
4361b798378d491c8a831f21a01bbe31	1YS6	113.49333575923484	23.18010179599928	0	0	YS														0	1757814586195	0																			
5a6ef05885f94706bb73732b3c21403f	1YS7	113.4953614065835	23.17840524193595	0	0	YS														0	1757814592319	0																			
00a740981dab41559b38a71aedb4ee33	1YS8	113.49629892315947	23.17756089488368	0	0	YS														0	1757814595047	0																			
5bbcf3d3d5854f55bb425822a7f3e97b	1YS9	113.49546944180331	23.18000465225817	0	0	YS														0	1757817519311	0																			
4d4ac6e0896f4defa0d6e2a23e9bbd34	1YS10	113.49653843519351	23.17823099314871	0	0	YS														0	1757817522391	0																			
d8a676e6447044f281d91076e9bd0ad9	1XS111	113.49543545880232	23.17972867449354	0	0	XS	五通													0	1757818272603	0																			
c67e77ebca2c43c88af26d2765d25660	1YS1112	113.49634032650198	23.17928526453975	0	0	YS														0	1757818276072	0																			
dd7d29c2d9e44af68118ecef99673f98	1YS1113	113.4953756328387	23.1796839898361	0	0	YS														0	1757818986679	0																			
19d0811559414574b13720abb7d997cc	1YS1114	113.49675163000184	23.17818876384883	0	0	YS														0	1757818989052	0																			
b27cf5b8f7b34ca48220ff8ac7d3f906	1YS1115	113.4953756328387	23.1796839898361	0	0	YS														0	1757818986679	0																			
84783871efbc4a64aee384c098da7d63	1YS1116	113.49675163000184	23.17818876384883	0	0	YS														0	1757818989052	0																			
3cb449d506df401288523e0a4f3924c8	1YS1117	113.4953756328387	23.1796839898361	0	0	YS														0	1757818986679	0																			
d103a561d6884c7eadd5d827d3eada0f	1YS1118	113.49675163000184	23.17818876384883	0	0	YS														0	1757818989052	0																			
b02db776f2244a0eb4b854354f8c73b2	1YS1119	113.4963291091338	23.17909621333749	0	0	YS														0	1757819018356	0																			
a92b35ce2a544b39a49e15be26791205	XN1YS1114_1	113.49715919437898	23.17941588157803	1372215.329938071	2589992.274664129	YS													0	1	1757819026649	0																			
252b6a6d47ad4ecc8d69fe71eda059d9	1YS1120	113.4956934582704	23.17847749844452	0	0	YS								0.0					0	0	1757819063295	0																			
75c7200f85594df19f9252663958a5b3	1YS1121	113.49578319721581	23.17732943100888	0	0	YS								0.0					0	0	1757819139109	0																			
```

## 用户创建的管线数据

表名：pipe_line_entity
表结构如下：
```
CREATE TABLE pipe_line_entity (
    PID                      TEXT    PRIMARY KEY
                                     NOT NULL,
    START_NUMBER             TEXT,
    END_NUMBER               TEXT,
    LINE_SORT                TEXT,
    START_DEPTH              TEXT,
    END_DEPTH                TEXT,
    LINE_TEXTURE             TEXT,
    DEFECT_TYPE              TEXT,
    DEFECT_LEVELS            TEXT,
    INBUILT_TYPE             TEXT,
    LINE_DIAMETER            TEXT,
    BUILD_YEAR               TEXT,
    UNIT_CODE                TEXT,
    LINE_TYPE                TEXT,
    PRESURE                  TEXT,
    CABLE_COUNT              TEXT,
    VOLTAGE                  TEXT,
    CABLE_LINE_NAME          TEXT,
    HOLE_COUNT               TEXT,
    USE_HOLE_COUNT           TEXT,
    USE_BELONG_HOLE_COUNT    TEXT,
    DRIVEPIPE_SIZE           TEXT,
    ROAD_NAME_CODE           TEXT,
    FLOW_DIRECTION           TEXT,
    REMARK                   TEXT,
    VIRTUAL                  TEXT,
    IS_COMMON                INTEGER,
    UPDATE_TIME              INTEGER,
    LINE_LENGTH              TEXT,
    BUILDING_DATE            INTEGER,
    SURVEY_DATE              INTEGER,
    STREET_OFFICE            TEXT,
    START_STREET             TEXT,
    END_STREET               TEXT,
    CHECK_USER               TEXT,
    DETECT_UNIT              TEXT,
    PROTECT_TEXTURE          TEXT,
    HOLE_ARRANGE             TEXT,
    OPTICAL_CABLE_LOCATION   TEXT,
    CABLE_LOCATION           TEXT,
    OPTICAL_CABLE_HOLE_COUNT TEXT,
    CARRIER_NAME             TEXT,
    VIDEO_NUMBER             TEXT,
    APERTRUE_SIZE            TEXT,
    UPDATE_DATE              INTEGER,
    TEXTURE_USE_TIME         TEXT,
    OPERATION_UNIT           TEXT,
    PROJECT_NUMVER           TEXT,
    PROJECT_NAME             TEXT
);
```
实例数据如下：
```
PID	START_NUMBER	END_NUMBER	LINE_SORT	START_DEPTH	END_DEPTH	LINE_TEXTURE	DEFECT_TYPE	DEFECT_LEVELS	INBUILT_TYPE	LINE_DIAMETER	BUILD_YEAR	UNIT_CODE	LINE_TYPE	PRESURE	CABLE_COUNT	VOLTAGE	CABLE_LINE_NAME	HOLE_COUNT	USE_HOLE_COUNT	USE_BELONG_HOLE_COUNT	DRIVEPIPE_SIZE	ROAD_NAME_CODE	FLOW_DIRECTION	REMARK	VIRTUAL	IS_COMMON	UPDATE_TIME	LINE_LENGTH	BUILDING_DATE	SURVEY_DATE	STREET_OFFICE	START_STREET	END_STREET	CHECK_USER	DETECT_UNIT	PROTECT_TEXTURE	HOLE_ARRANGE	OPTICAL_CABLE_LOCATION	CABLE_LOCATION	OPTICAL_CABLE_HOLE_COUNT	CARRIER_NAME	VIDEO_NUMBER	APERTRUE_SIZE	UPDATE_DATE	TEXTURE_USE_TIME	OPERATION_UNIT	PROJECT_NUMVER	PROJECT_NAME
2d2bd459a3aa4d3eab9c97d88445ccbd	1YS2	1YS3	YS																				0		0	0	1757211341926	141.52																				
5466f2320a56487bbe4813c82fd9e236	1YS1	1YS2	YS																				0		0	0	1757211351244	222.01																				
70155639520d43409e97cc2e0abdb1c1	1YS3	1YS1	YS																				0		0	0	1757211362094	191.75																				
5a6c772c828f4181822dad399923e272	1YS2	XN1YS2_1	YS																				0		1	0	1757214660772	194.72																				
76154113b494451d84a09db4268349a5	1XS111	1YS1112	XS																				0		0	0	1757818318712	104.86																				
02c86d560a4a44aba98be70527105bd9	1YS1115	1YS1116	YS																				0		0	1	1757819000156	217.41																				
2fe134cb2ba545eca10b61ceaa2a715f	1YS1117	1YS1118	YS																				0		0	1	1757819000156	217.41																				
38a152a2bb8444509df2a9a31a497702	1YS1114	XN1YS1114_1	YS																				0		1	0	1757819033283	142.16																				
ac7fae6006a64b0b9cab4fcc052146c9	1YS1113	1YS1120	YS																				0		0	0	1757819063329																					
336f81328c6e4ff198d98a2740d048ae	1YS1120	1YS1121	YS																				0		0	0	1757819139140																					
555d69b1cea2416895edcd7d812a75c0	1YS1121	1YS1114	YS																				0		0	0	1757819139140																					
```