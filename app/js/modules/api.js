/**
 * Created by code on 2018/6/22.
 */
var apis = {
    'login':'/sys/login', //

};
if(!PRODUCTION){

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
