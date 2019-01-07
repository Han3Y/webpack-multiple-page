/**
 * Created by hjc on 2018/3/6.
 */
import '../less/common.less';
import '../lib/css/all.css';
//使用中文汉化
kendo.culture("zh-CN");
//全局错误信息
kendo.ui.validator.messages.required = function(input){
    return "不能为空";
};
kendo.ui.validator.messages.pattern = function(input){
    return "输入不合法";
};
kendo.ui.validator.messages.email = function(input){
    return "邮箱格式错误";
};
//防止重复提交同一个请求
var pendingRequests = {};
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    var key = options.url;
    //console.log(key);
    if (!pendingRequests[key]) {
        pendingRequests[key] = jqXHR;
    }else{
        //jqXHR.abort();    //放弃后触发的提交
        pendingRequests[key].abort();   // 放弃先触发的提交
    }
    var complete = options.complete;
    options.complete = function(jqXHR, textStatus) {
        pendingRequests[key] = null;
        if ($.isFunction(complete)) {
            complete.apply(this, arguments);
        }
    };
});
console.log(require('../img/logo-n.png'));
var src = require('../img/logo-n.png');
$("body").append('<img src="' + src +'">');