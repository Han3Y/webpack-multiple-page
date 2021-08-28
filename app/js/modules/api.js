/**
 * Created by code on 2018/6/22.
 */
var apis = {
    'alerts':'/trafficflow/alerts', //alert列表
    'getAsset':'/asset/', //设备详情
    'assetList':'/asset/list', //设备列表
    'servicePorts':'/servicePorts', //网口类型列表
    'assetTaskparam':'/asset/taskparam/', //资产初始化扫描数据
    'assetTypes':'/assetLib/types', //资产类别下拉框
    'assetVendors':'/assetLib/vendors', //厂商下拉框
    'assetModels':'/assetLib/models', //型号下拉框
    'assetAs':'/assetLib/asList', //防护软件下拉框
    'assetOs':'/assetLib/osList', //操作系统下拉框
    'editAsset':'/asset', //编辑设备
    'assetScan':'/asset/autoscan', //设备扫描
    'assetScanInfo':'/asset/autoscan/', //设备实时扫描信息
    'assetRun':'/asset/runningTask', //是否在设备扫描
    'assetReport':'/asset/reports/', //资产报告
    'assetVul':'/assetVul', //隐藏漏洞
    'assetPorts':'/asset/ports/', //端口列表
    'assetVulList':'/assetVul/list', //漏洞列表
    'assetVulLevel':'/assetVul/vulLevel', //漏洞等级列表
    'assetVulType':'/assetVul/vulType', //漏洞类型
    'vulMoreDetail':'/vuldata/sysvuls/detail/',//漏洞详情
    'assetDetail':'/asset/assetDetail/', //设备详情展示
    'assetUpload':'/asset/import',//导入资产列表
    'assetUploadHigh':'/asset/importHigh',//导入资产列表高端版
    'assetExport':'/asset/export',//导出资产列表
    'assetExportHigh':'/asset/exportHigh',//导出资产列表高端版
    'codeExamineAdd':'/codereview/add', //代码检查新增
    'codeExamineDelete':'/codereview/delete', //代码检查删除
    'codeExamineList':'/codereview/list', //代码检查列表
    'codeExamineDetailAdd':'/codereview/addvirus', //代码检查详情增加
    'codeExamineDetailDelete':'/codereview/deletevirus', //代码检查详情删除
    //'malwareDetailInfo':'/malwareDetail/', //代码检查详情单条信息
    'codeExamineDetailList':'/codereview/viruslist', //代码检查详情列表
    'codeExamineImport':'/codereview/upload', //代码检查导入低端版
    'codeExamineImportHigh':'/codereview/uploadHigh', //代码检查导入高端版
    'complianceClear':'/compliance/clear/', //清空问卷
    'compliance':'/compliance', //问卷
    'complianceList':'/compliance/list', //问卷列表
    'complianceCombos':'/compliance/combos', //问卷下拉列表
    'compliancePowerType':'/compliancePowerType/list', //定级对象,系统级别
    'complianceReport':'/compliance/report/', //合规性报告
    'complianceLeft':'/compliance/firstLevelList/', //问卷一级目录
    'complianceLeftChildren':'/compliance/listByParentId', //问卷一级目录下的问题
    'getAllConfig':'/nologin/getAllConfig', //获取配置信息
    'assetModelInfo':'/asset/model/', // 获取设备型号信息
    'assetModelAll':'/asset/model', //资产型号接口（增删改）
    'assetModelList':'/asset/model/list', //资产型号列表
    'attackScripts':'/attackScript/list', //攻击脚本列表

    'testcases':'/testCase/list',
    'assetVendorInfo':'/asset/vendor/', //获取厂商信息
    'assetVendorAll':'/asset/vendor', //资产厂商接口（增删改）
    'assetVendorList':'/asset/vendor/list', //资产厂商列表
    'documentListGrid':'/basicInfo/paperwork/list', //文书列表
    'documentList':'/basicInfo/paperwork/paperworkTypes', //文书下拉列表
    'documentSave':'/basicInfo/paperwork', //保存文书内容,文书列表增删改
    'documentGet':'/basicInfo/paperwork/', //获取文书内容
    'fileDownload':'/attach/download/', //附件列表下载低端版
    'fileDownloadHigh':'/attach/downloadHigh', //附件列表下载高端版
    'files':'/attach', // 附件删除,上传
    'fileList':'/attach/list', //附件列表
    'fileUploadHigh':'/attach/uploadHigh', //上传附件高端版
    'changePassword':'/sys/user/changePassword', //用户密码修改
    'upgrade':'/upgrade', //系统升级
    'passwordCheck':'/sys/curUserPasswordCheck', //恢复出厂校验密码
    'restore':'/platform/restore', //恢复出厂
    'currentUser':'/sys/user/current', //当前用户
    'menusLeft':'/sysmenus/left', //左侧菜单
    'systemItems':'/sysmenus/getMenuByParentId',
    'projectsItems': '/sysmenus/systemItems',//点击评估之后获取的左侧菜单
    'menusTop':'/sys/menus/top', //顶部菜单
    'logout':'/sys/logout', //系统登出
    'shutdown':'/platform/shutdown', //关机
    'reboot':'/platform/reboot', //系统重启
    'upgradeFile':'/upgrade/file', //系统升级上传文件低端版
    'upgradeFileHigh':'/upgrade/fileHigh', //系统升级上传文件高端版
    'version':'/license/version', //版本信息
    'getSystemVersion':'/systemVersion/getSystemVersion',//获取中间件，build等版本信息

    'login':'/sys/login', //登出
    'logList':'/log/list', //日志列表
    'logExport':'/log/export', //日志导出低端版
    'logExportHigh':'/log/exportHigh', //日志导出高端版
    'getMenuInfo':'/menuConfig/', //菜单配置获取单个信息
    'menuConfigUpload':'/menuConfig/upload', //菜单配置上传图标控件
    'menuConfig':'/menuConfig', //菜单配置增删改
    'deleteIcon':'/menuConfig/deleteIcon/', //删除图标
    'menuConfigList':'/menuConfig/list', //菜单配置列表
    'pcapDownload':'/trafficflow/download/', //流量包下载低端版
    'pcapDownloadHigh':'/trafficflow/downloadHigh', //流量包下载高端版
    'pcaps':'/trafficflow/pcaps', //流量包获取 删
    'pcapImportHigh':'/trafficflow/batchImport', //流量导入高端版
    'pcapImport':'/trafficflow/uploadPcap', //流量导入低端版
    'pcapProgress':'/trafficflow/batchImport/', //流量导入进度
    'trafficAnalysis':'/trafficflow/traffic_analysis', //流量截取
    'pcapCheckRun':'/trafficflow/runningTask', //是否在流量截取
    'companyUnmapped':'/basicInfo/company/unmapped', //单位管理下拉框
    'sysUser':'/sys/user', //检查人员列表
    'plan':'/basicInfo/scheme', //计划增删改
    'planInfo':'/basicInfo/scheme/', //计划详情
    'planList':'/basicInfo/scheme/list', //计划列表
    'projectList':'/basicInfo/project/list', //项目管理列表
    'getAreaList':'/getAreaList', //省市区
    'projectInfo':'/basicInfo/project/', //项目详情,删除项目
    'project':'/basicInfo/project', //项目修改
    'complianceInfo':'/compliance/', //问题列表
    'complianceFileList':'/compliance/document/list/', //问题附件列表
    'complianceSave':'/compliance/set', //保存问题信息
    'complianceDetailSave':'/compliance/edit', //保存问题详情信息
    'complianceFileUpload':'/compliance/document', //问题上传附件低端版
    'complianceFileUploadHigh':'/compliance/document/uploadHigh', //问题上传附件高端版
    'complianceFileDownload':'/compliance/document/download/', //问题下载附件低端版
    'complianceFileDownloadHigh':'/compliance/document/downloadHigh', //问题下载附件高端版
    'complianceFileDel':'/compliance/document/', //问题删除附件
    'complianceExport':'/compliance/export/', // 问题页面导出低端版
    'complianceExportHigh':'/compliance/exportHigh', //问题页面导出高端版
    'complianceImport':'/compliance/import', //问题导入低端版
    'complianceImportHigh':'/compliance/importHigh', //问题导入高端版
    'complianceAddImport':'/compliance/addImport', //问题追加导入低端版
    'complianceAddImportHigh':'/compliance/addImportHigh', //问题追加导入高端版
    'complianceConfig':'/complianceConfig', //问卷配置
    'complianceConfigList':'/complianceConfig/list', //问卷配置列表
    'previewReport':'/report/previewReport/', //报告预览
    'reportDownload':'/report/download/', //报告导出低端版
    'reportDownloadHigh':'/report/downloadHigh', //报告导出高端版
    'reportDel':'/report/delReport', //删除报告
    'reportList':'/report/getList', //报告列表
    'reportCompanyList':'/basicInfo/tree/companyList', //报告单位列表
    'reportSystemList':'/basicInfo/tree/systemList', //报告系统列表
    'reportComplianceList':'/compliance/listBySystemId', //报告问卷列表
    'reportExport':'/report/export', //生成报告
    'complianceLib':'/complianceLib', //指标库管理保存
    'complianceLibInfo':'/complianceLib/', //指标库管理信息,删除
    'complianceLibCopy':'/complianceLib/copy/', //指标库管理复制
    'complianceLibExport':'/complianceLib/export/', //指标库管理导出低端版
    'complianceLibExportHigh':'/complianceLib/exportHigh', //指标库管理导出高端版
    'complianceLibList':'/complianceLib/list', //指标库管理列表
    'rolesList':'/sys/roles/list', //角色表格
    'roles':'/sys/roles', //角色修改
    'rolesInfo':'/sys/roles/', //角色信息，删除
    'rolesMenu':'/sys/roles/resources/', //获取角色菜单
    'rolesConfig':'/sys/roles/config', //保存菜单配置
    'whiteListInfo':'/asset/whiteList/', //白名单设备信息
    'whiteListGrid':'/asset/whiteList/list', //白名单表格
    'whiteList':'/asset/whiteList', //增删改
    'appConfigInfo':'/appConfig/', //获取系统配置信息
    'appConfig':'/appConfig', //系统配置增删改
    'appConfigList':'/appConfig/list', //系统配置表格
    'appConfigUpload':'/appConfig/upload', //系统配置上传图标控件
    'appConfigExport':'/appConfig/export', //系统配置导出
    'topoSummary':'/asset/regionSummary/', //设备拓扑信息
    'trafficReportTrends':'/trafficflow/trends', //获取数据包时间分布图表数据
    'trafficReportStatistic':'/trafficflow/trafficStatistic', //获取流量报告数据
    'company':'/basicInfo/company', // 单位增删改
    'companyInfo':'/basicInfo/company/', //单位信息
    'system':'/basicInfo/system', //系统增删改
    'systemInfo':'/basicInfo/system/', //系统信息
    'companyList':'/basicInfo/company/list', //单位管理列表
    'userPwd':'/sys/user/changePasswordByAdmin', //用户管理修改密码
    'userDel':'/sys/user/destory', //删除用户
    'userList':'/sys/user', //用户管理列表
    'userInfo':'/sys/user/', //用户信息
    'userCreate':'/sys/user/create', //用户创建
    'userEdit':'/sys/user/edit', //用户编辑
    'ssidDetail':'/wireless/ssidDetail/', //ssid详情
    'wireless':'/wireless/region', //无线列表
    'wirelessScan':'/wireless/autoscan', //无线扫描
    'weakpass':'/wireless/weakpass', //弱密码检测
    'wirelessCheckRun':'/wireless/runningTask', //检查无线扫描状态


    'testcaseLists':'/testcase/searchCaseList', //获取测试用例列表
    'testcaseOptions':'/testcase/optionList', //测试用例类型下拉框
    'testcaseParam':'/testcase/getParamConfig/', //测试用例类型详情
    'testcaseDeleted':'/testcase/deleteCase/', //删除自建测试用例

    'fuzztaskLists':'/fuzztask/searchTaskList', //漏挖任务列表
    'assetInfoForFuzz':'/asset/assetInfoForFuzz', //资产下拉框
    //'servicePorts':'/servicePorts', //类型下拉列表
    'fuzzPort':'/fuzztask/getFuzzPort/', //漏洞端口
    'fuzztaskAdd':'/fuzztask/addTask', //添加任务
    'fuzztaskDeleted':'/fuzztask/deleteTask', //删除任务

    'getCurrentVersion':'/platform/custom',//获取当前版本类型
    'instructions':'/index2/process',//使用文字说明
    'homeEntries':'/sys/menus/tag',//获取入口菜单
    'menusChildren':'/sys/menus/children/',//获取二级菜单
    'planMenus':'/sys/menus/scheme',//获取计划二级菜单
    'projectMenus':'/sys/menus/project',//获取项目二级菜单

    //漏挖深度扫描
    'checkPortScan':'/portscanaction/getrunningtask',//检查是否在端口扫描
    'defaultPort':'/portscan/defaultPort',//获取端口扫描默认端口
    'portDevice':'/asset/assetInfoForPortScan',//端口扫描设备信息
    'portScanStart':'/portscanaction/scan',//端口扫描开始
    'portScanStop':'/portscanaction/cancel',//端口扫描停止
    'portScanProcess':'/portscanaction/get',//端口扫描进度
    'portScanHistory':'/portscan/get/',//端口扫描历史数据

    //工信部版本深度扫描
    // 'checkPortScan':'/portScan/getrunningtask',//检查是否在端口扫描
    // 'defaultPort':'/portScan/defaultPort',//获取端口扫描默认端口
    // 'portDevice':'/asset/assetInfoForPortScan',//端口扫描设备信息
    // 'portScanStart':'/portScan/scan',//端口扫描开始
    // 'portScanStop':'/portScan/cancel',//端口扫描停止
    // 'portScanProcess':'/portScan/get',//端口扫描进度
    // 'portScanHistory':'/portScan/portScanHistory/',//端口扫描历史数据

    'vulScanInfo':'/fuzztask/taskInitResult/',//漏挖扫描初始数据
    'vulScanTaskInfo':'/fuzztask/testCaseDetail/',//漏挖扫描测试用例详情
    'vulScanStart':'/fuzztask/start/',//漏挖扫描开始
    'vulScanStop':'/fuzztask/stop/',//漏挖扫描停止
    'vulScanResultTop':'/fuzztask/taskStatDesc/',//漏挖结果顶部数据
    'vulScanResultGrid':'/fuzztask/taskStatList/',//漏挖结果列表
    'checkVulScan':'/fuzztask/runningTask',//检查是否有漏挖任务
    'scanPcapExport':'/fuzztask/pcap/',//漏挖pcap下载
    'scanPcapExportHigh':'/fuzztask/pcapHigh',//漏挖pcap下载高端版
    'scanResultLog':'/fuzztask/logDetail/',//漏挖结果日志详情
    'scanResultDetail':'/fuzztask/resultDetail/',//漏挖结果细节
    'threatTypeList':'/vul/types',//危险等级
    'scanDeviceInfo':'/fuzzVul/case/',//新建漏洞时，获取设备信息
    'scanVulList':'/fuzzVul/list/',//漏洞列表
    'scanVul':'/fuzzVul/vul',//创建、编辑漏洞
    'scanVulInfo':'/fuzzVul/vul/',//单个漏洞信息、删除漏洞
    'scanVulFailPoint':'/fuzzVul/relateFault',//漏洞关联失败点
    'scanVulRelationList':'/fuzzVul/relateInfo/',//获取漏洞关联失败点、关联用例
    'scanVulRemoveFailPoint':'/fuzzVul/removeFault',//漏洞删除失败点
    'scanVulRemoveTestCase':'/fuzzVul/removeTestCase',//漏洞删除测试用例关联
    'scanVulReportTaskList':'/fuzztask/searchTaskListWithOutPage',//漏挖报告--任务列表
    'scanVulReport':'/report/exportfuzz',//漏挖生成报告
    'scanVulReportList':'/report/getFuzzList',//漏挖报告list
    'scanVulListAll':'/fuzzVul/vuls',//添加的所有漏洞列表


    'taskManagementList':'/basicInfo/taskInfo/list',//任务管理列表
    'taskManagement':'/basicInfo/taskInfo',//任务管理
    'taskManagementInfo':'/basicInfo/taskInfo/',//任务管理查询单个信息
    'taskSelect':'/basicInfo/taskProcess/selectBoxList/',//获取任务执行勾选的步骤
    'taskExecute':'/basicInfo/taskProcess/execute',//任务确认执行
    'stepList':'/basicInfo/taskProcess/stepList/',//获取分步菜单列表
    'getUrlByStep':'/basicInfo/taskProcess/step/',//获取对应步骤的信息
    'getNextStep':'/basicInfo/taskProcess/nextStep/',//获取下一步的信息

    'saveAssetId':'/miiCompliance/pointDetect',//选择ip时保存设备id
    'getAssetQuestions':'/miiCompliance/view',//获取与设备关联的问卷
    'getAssetId':'/miiCompliance/currentAssetId/',//根据任务id获取设备id,
    'assetQueFileUpload':'/miiCompliance/document',//设备问卷上传文件
    'assetQueFileUploadHigh':'/miiCompliance/document/uploadHigh',//设备问卷上传文件高端版
    'assetQueFileDownload':'/miiCompliance/document/download/',//设备问卷下载文件
    'assetQueFileDownloadHigh':'/miiCompliance/document/downloadHigh',//设备问卷下载文件高端版
    'assetQueFileList':'/miiCompliance/document/list/',//设备问卷根据问题获取文件列表
    'assetQueDelFile':'/miiCompliance/document/',//设备问卷问题删除附件,
    'assetQueSave':'/miiCompliance/assign',//设备问卷保存问题的值
    //'getAssetId':'',//根据任务id获取设备id
    'assetAutoScanVisible':'/asset/btnAutoScanVisible/',//是否展示资产扫描按钮
    'queIpList':'/miiasset/listIps',//获取任务的资产ip列表
    'checkQueExists':'/miiCompliance/exists',//判断资产下面是否有问卷
    'selectCompliance':'/miiCompliance/selectCompliance',//资产和问卷关联
    'queTask':'/miiCompliance/task',//问题运行命令
    'saveDeviceDes':'/miiasset/remark',//保存设备描述
    'changeIp':'/setupIp',//修改设备ip
    'getMediaLabel':'/platform/camera',//获取视频和音频设备描述

    'imageView':'/compliance/document/preview/',//图片预览
    'servicePortConfig':'/servicePortConfig',//获取设备ip和掩码

    'systemExport':'/data/export/sysCommon ',//导出
    'systemExportHigh':'/data/export/sysHigh',//系统导出高端版


    /**************/
   // 'basicInfoList':'/basicInfo/systems',

    'basicInfoList' :'/basicInfo/regions',

    'unitLists':'/basicinfo/unit/list', //获取企业列表
    'getUnit':'/basicinfo/unit/', //根据id获取相应的企业
    'units':'/basicinfo/unit', //编辑,新增，删除企业列表
    'unitDropDownlits':'/basicinfo/unit/dropdownList',   //使用企业下拉框
    'industryTypes':'/industryTypes',//获取行业

};
if(!PRODUCTION){
    apis.menusLeft='/sysmenus/leftDev'; //左侧菜单
    apis.systemItems='/sysmenus/getMenuByParentIdDev',
    apis.projectsItems = '/sysmenus/systemItemsDev',//点击评估之后获取的左侧菜单
    apis.menusTop = '/sys/menus/topDev';//顶部菜单
    apis.menusChildren = '/sys/menus/childrenDev/';//获取二级菜单
    apis.planMenus = '/sys/menus/schemeDev';//获取计划二级菜单
    apis.projectMenus = '/sys/menus/projectDev';//获取项目二级菜单
}
// if(isMiit){
//     apis.checkPortScan='/portScan/getrunningtask';//检查是否在端口扫描
//     apis.defaultPort='/portScan/defaultPort';//获取端口扫描默认端口
//     apis.portDevice='/asset/assetInfoForPortScan';//端口扫描设备信息
//     apis.portScanStart='/portScan/scan';//端口扫描开始
//     apis.portScanStop='/portScan/cancel';//端口扫描停止
//     apis.portScanProcess='/portScan/get';//端口扫描进度
//     apis.portScanHistory='/portScan/portScanHistory/';//端口扫描历史数据
// }

export {apis};
