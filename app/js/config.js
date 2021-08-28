import '../less/common.less';
import {GENERAL_CONFIG,TOASTR,commonModel} from "./modules/common";
import {apis} from './modules/api';
import {filePath} from './modules/filePath';

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

//下拉树
var DropDownTreeView = kendo.ui.Widget.extend({
    _uid: null,
    _treeview: null,
    _dropdown: null,
    _v: null,

    init: function (element, options) {
        var that = this;

        kendo.ui.Widget.fn.init.call(that, element, options);

        that._uid = new Date().getTime();

        $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));
        $(element).append(kendo.format("<div id='extTreeView{0}' class='k-ext-treeview' style='z-index:1;'/>", that._uid));

        // Create the dropdown.
        that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
            dataSource: [{ text: "", value: "" }],
            dataTextField: "text",
            dataValueField: "value",
            open: function (e) {
                //to prevent the dropdown from opening or closing. A bug was found when clicking on the dropdown to
                //"close" it. The default dropdown was visible after the treeview had closed.
                e.preventDefault();
                // If the treeview is not visible, then make it visible.
                if (!$treeviewRootElem.hasClass("k-custom-visible")) {
                    // Position the treeview so that it is below the dropdown.
                    $treeviewRootElem.css({
                        "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                        "left": $dropdownRootElem.position().left
                    });
                    // Display the treeview.
                    $treeviewRootElem.slideToggle('fast', function () {
                        that._dropdown.close();
                        $treeviewRootElem.addClass("k-custom-visible");
                    });
                }
            }
        }).data("kendoDropDownList");

        if (options.dropDownWidth) {
            that._dropdown._inputWrapper.width(options.dropDownWidth);
        }

        var $dropdownRootElem = $(that._dropdown.element).closest("span.k-dropdown");

        // Create the treeview.
        that._treeview = $(kendo.format("#extTreeView{0}", that._uid)).kendoTreeView(options.treeview).data("kendoTreeView");
        that._treeview.bind("select", function (e) {
            // When a node is selected, display the text for the node in the dropdown and hide the treeview.
            $dropdownRootElem.find("span.k-input").text($(e.node).children("div").text());
            $treeviewRootElem.slideUp('fast', function () {
                $treeviewRootElem.removeClass("k-custom-visible");
                that.trigger("select", e);
            });
            var treeValue = this.dataItem(e.node);
            that._v = treeValue[options.valueField];
        });

        var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");

        // Hide the treeview.
        $treeviewRootElem
            .css({
                "border"   : "1px solid #dbdbdb",
                "display"  : "none",
                "position" : "absolute",
                "background-color": that._dropdown.list.css("background-color")
            });

        $(document).click(function (e) {
            // Ignore clicks on the treetriew.
            if ($(e.target).closest("div.k-treeview").length === 0) {
                // If visible, then close the treeview.
                if ($treeviewRootElem.hasClass("k-custom-visible")) {
                    $treeviewRootElem.slideToggle('fast', function () {
                        $treeviewRootElem.removeClass("k-custom-visible");
                    });
                }
            }
        });
    },
    value: function(v){
        var that = this;
        if(v !== undefined){
            var n = that._treeview.dataSource.get(v);
            if(!n){
                return false;
            }
            var selectNode = that._treeview.findByUid(n.uid);
            that._treeview.trigger('select',{node: selectNode});
            that._treeview.select(selectNode);
            var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");
            $treeviewRootElem.hide();
        }
        else{
            return that._v;
        }
    },

    dropDownList: function () {
        return this._dropdown;
    },

    treeview: function () {
        return this._treeview;
    },
    refresh: function () {
        return this._treeview.dataSource.read();
    },
    options: {
        name: "DropDownTreeView"
    }
});
kendo.ui.plugin(DropDownTreeView);

//弹窗
var dialog = kendo.ui.Window.extend({
    // set options
    options: {
        name              : 'GDialog',    // widget name
        onOk              : $.noop,
        okText            : '确定',
        cancelText        : '取消',
        defaultButtons    : 'OK_CANCEL',  //'OK' || 'OK_CANCEL' || 'CANCEL' || 'NULL'
        extraButtons      : [],           //[ { text:'ok', className: '', click:function(){} }]
        appendTo  : 'body',
        minWidth  : 400,
        minHeight : 100,
        resizable : false,
        actions   : ['Close'],            // ['Minimize', 'Maximize', 'Close']
        autohide  : false,
        time      : 1000,
        class: '',
        close:function(){
            if(window.top !== window.self){
                commonModel.modalOverlay('hide',$('.userDefine-window:visible'), true);  //弹出框右上close按钮回调事件
            }
        },
    },
    // Init method
    init: function(element, options){
        var me = this;
        // Call super.init
        kendo.ui.Window.fn.init.call(this, element, options);

        // Add buttons
        var $buttonsArea = this._addButtons(element, options);

        // Set styles
        this.wrapper.addClass(options.class);
        this.wrapper.addClass('k-dialog userDefine-window');
        $buttonsArea.addClass('k-button-area window-footer');

        // Set the dialog's position by default
        if (!options || !options.position){ this.center(); }

        // if the autohide is setted true that aftering a time auto hide the dialog. default is 1s.
        if(this.options.autohide) {
            setTimeout(function() {
                kendo.ui.Window.fn.close.call(me);
            },this.options.time);
        }
    },
    open: function(){
        // Call super.open
        this.center();
        kendo.ui.Window.fn.open.call(this);
        if(window.top !== window.self && !commonModel.pages.includes(window.pageName)){
            if(!this.options.animation){
                commonModel.modalOverlay('show',$('.userDefine-window:visible'));
            }else{
                commonModel.modalOverlay('show',$('.userDefine-window:visible'), true);
            }

        }
    },
    minimize: function(){
        // Call super.minimize
        kendo.ui.Window.fn.minimize.call(this);

        $(this.buttonsArea).hide();
        this.wrapper.css('padding-bottom', '0');
    },
    restore: function(){
        // Call super.restore
        kendo.ui.Window.fn.restore.call(this);

        $(this.buttonsArea).show();
        this.wrapper.css('padding-bottom', '51px');
    },
    center: function(){

        if (this.options.isMaximized){ return this; }

        // Call super.center
        kendo.ui.Window.fn.center.call(this);

        var that           = this,
            position       = that.options.position,
            wrapper        = that.wrapper,
            documentWindow = $(window),
            scrollTop      = 0,
            newTop;

        if (!that.options.pinned){ scrollTop = documentWindow.scrollTop(); }

        /*newTop = scrollTop + Math.max(0,
                (documentWindow.height() - wrapper.height() - 50 - parseInt(wrapper.css("paddingTop"), 10)) / 2);*/
        newTop = scrollTop + Math.max(0,
            (documentWindow.height() - wrapper.height() - parseInt(wrapper.css("paddingTop"), 10)) / 2);

        wrapper.css({ top: newTop });

        position.top = newTop;

        return that;
    },
    _onDocumentResize: function(){
        if (!this.options.isMaximized){ return; }

        // Call super._onDocumentResize
        kendo.ui.Window.fn._onDocumentResize.call(this);

        this._fixWrapperHeight();
    },
    _fixWrapperHeight: function(){
        var height = (this.wrapper.height() - 51).toString() + 'px';
        this.wrapper.css('height', height);
    },
    // Add buttons to the dialog
    _addButtons: function(element, options){

        var that    = this,
            buttons = this.options.extraButtons.slice(0);

        var nullPattern    = /NULL/gi, okPattern = /OK/gi, cancelPattern = /CANCEL/gi,
            defaultButtons = {
                buttonOk     : {text: that.options.okText,     className:'ok-btn k-primary k-button-icontext'   , click:function(e){
                        that.options.onOk.call(that, e);
                        return false;
                    },iconEle:'<span class="k-icon k-i-check"></span>'},
                buttonCancel : {text: that.options.cancelText, className:'close-btn k-button-icontext', click:function(e){
                        e.preventDefault(); that.close();
                    },iconEle:'<span class="k-icon k-i-cancel"></span>'}
            };

        // Append default buttons
        if (!nullPattern.test(this.options.defaultButtons)){
            if(cancelPattern.test(this.options.defaultButtons)){
                buttons.unshift(defaultButtons.buttonCancel);
            }
            if(okPattern.test(this.options.defaultButtons)){
                buttons.unshift(defaultButtons.buttonOk);
            }
        }

        // Make button area
        var buttonsArea  = document.createElement('div'),
            $buttonsArea = $(buttonsArea);
        this.buttonsArea = buttonsArea;

        // Make buttons and set buttons' attributes
        for (var i = buttons.length - 1; i >= 0; --i){
            var $aEl = $(document.createElement('a'));
            /*eslint no-script-url: 0*/
            $aEl.html(buttons[i].text)
                .addClass('k-dialog-button')
                .addClass(buttons[i].className)
                .attr({href:'javascript:###;'})
                .on('click', buttons[i].click)
                .prepend($(buttons[i].iconEle))
                .kendoButton();
            $buttonsArea.append($aEl);
        }
        this.wrapper.append($buttonsArea);
        return $buttonsArea;
    }
});
kendo.ui.plugin(dialog);

kendo.ui.validator.rules.equalTo = function (input) {
    if (input.is('[equalTo]')) {
        var compare = input.parents(".k-window").find("#"+input.attr('equalTo'));
        return input.val() === compare.val();
    }
    return true;
};
kendo.ui.validator.rules.password = function (input) {
    if (input.is('[password]')) {
        var re = /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*_+\(\)]{8,}$/;
        if(!re.test(input.val())){
            return false;
        }
    }
    return true;
};
kendo.ui.validator.messages.equalTo = function (input) {
    return "两次密码不相同";
};
kendo.ui.validator.messages.password = function (input) {
    return "长度不少于8位，必须包含1个大写英文字母和数字";
};

kendo.ui.validator.rules.namecheck = function (input) {
    var reg=/^[\u4e00-\u9fa5_a-zA-Z0-9-_+]+$/;
    if(!input.is('[nameCheck]') || !input.is(":visible")){
        return true;
    }
    var value = input.val();
    if (value === '') {
        return true;
    }else{
        return reg.test(value);
    }
};
kendo.ui.validator.messages.namecheck = function (input) {
    return "输入不合法";
};

kendo.ui.validator.rules.ipScopeCheck = function (input) {
    var regIps = /^(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9]))$/; //判断IP地址是否合法
    var regNum = /^([\d-_+]*)$/;

    function checkNetSegmentType(val) {
        var type;
        if (val.indexOf('/') > -1) {
            type = 'mask';
        } else if (val.indexOf('-') > -1) {
            type = 'range';
        } else if (val.indexOf(';') > -1) {
            type = 'multi';
        } else {
            type = 'single';
        }
        return type;
    }
    function judegNumber(num) {
        if (regNum.test(num) && 0 < num && num < 33 && num != 31) {
            return true;
        }
        return false;

    }
    function judgeIP(val) {

        function checkIpA(value) {
            var a = value.split('.');
            if (a[1] == 255 && a[2] == 255 && (a[3] == 255 || a[3] == 0)) {
                return false;
            }
            return true;
        }

        function checkIpB(value) {
            var a = value.split('.');
            if (a[2] == 255 && (a[3] == 255 || a[3] == 0)) {
                return false;
            }
            return true;
        }

        function checkIpC(value) {
            var a = value.split('.');
            if ((a[3] == 255 || a[3] == 0)) {
                return false;
            }
            return true;
        }

        if (!regIps.test(val)) {
            return false;
        }
        var ary = val.split('.');
        var returnValue;
        if (0 < ary[0] && ary[0] < 127) {
            returnValue = checkIpA(val);
        } else if (127 < ary[0] && ary[0] < 192) {
            returnValue = checkIpB(val);
        } else if (191 < ary[0] && ary[0] < 224) {
            returnValue = checkIpC(val);
        } else {
            returnValue = false;
        }
        return returnValue;


        /*  if(ary[0] =='192' && ary[1] == '168' && ary[2] == '1' && 0<ary[3]<256){
         return true;
         }
         return false;*/
    }
    function compareNumber(a, b) {
        var aa = a.split('.');
        var bb = b.split('.');
        return parseInt(aa[3]) < parseInt(bb[3]) || aa[3] == bb[3];
    }

    if(!input.is('[ipScopeCheck]')){
        return true;
    }
    var val = input.val();
    if (val === '') {
        return true;
    }
    var netSegmentType = checkNetSegmentType(val);
    var netSegmentFormat = false;

    switch (netSegmentType) {
        case 'mask':
            var ary = val.split('/');
            if (ary.length == 2) {
                netSegmentFormat = judgeIP(ary[0]) && judegNumber(ary[1]);
            }
            break;
        case 'range':
            var ary = val.split('-');
            if (ary.length == 2) {
                netSegmentFormat = judgeIP(ary[0]) && judgeIP(ary[1]) && compareNumber(ary[0], ary[1]);
            }
            break;
        case 'multi':
            var ary = val.split(';');
            var status = true;
            for (var i = 0; i < ary.length; i++) {
                if (status) {
                    status = status && judgeIP(ary[i]);
                }
            }
            netSegmentFormat = status;
            break;
        default:
            netSegmentFormat = judgeIP(val);
            break;
    }

    return netSegmentFormat;

};
kendo.ui.validator.messages.ipScopeCheck = function (input) {
    return "扫描范围填写格式不对,请参考帮助";
};

kendo.ui.validator.rules.ipCheck = function (input) {
    function CheckIP(value) {
        return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value));
    }
    function finalIsZero(value) {
        var ary = value.split(".")
        if (ary[0] == 127) {
            return false;
        }
        if (ary[0] < 127 && ary[0] > 0) {
            if ((ary[3] == 0) || (ary[1] == 255 && ary[2] == 255 && ary[3] == 255)) {
                return false;
            }
            return true;
        } else if (ary[0] < 192) {
            if ((ary[3] == 0) || (ary[2] == 255 && ary[3] == 255)) {
                return false;
            }
            return true;
        } else if (ary[0] < 224) {
            if (ary[3] == 0 || ary[3] == 255) {
                return false;
            }
            return true;
        } else {
            return false;
        }

    }
    if(!input.is('[ipCheck]') || !input.is(":visible")){
        return true;
    }
    var value = input.val();

    if (value === '') {
        return true;
    }else{
        return (CheckIP(value) && finalIsZero(value));
    }

};

kendo.ui.validator.messages.ipCheck = function (input) {
    return "请正确输入IP"; //请正确输入扫描口网关
};

kendo.ui.validator.rules.macCheck = function (input) {
    var reg=/(([a-f0-9]{2}:)|([a-f0-9]{2}-)){5}[a-f0-9]{2}/gi;
    if(!input.is('[macCheck]') || !input.is(":visible")){
        return true;
    }
    var value = input.val();
    if (value === '') {
        return true;
    }else{
        return reg.test(value);
    }

};
kendo.ui.validator.messages.macCheck = function (input) {
    return "请正确输入mac地址";
};

kendo.ui.validator.rules.netmaskCheck = function (input) {
    /**
     * @return {boolean}
     */
    function CheckNetmask(value) {
        return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value));
    }
    if(!input.is('[netmaskCheck]') || !input.is(":visible")){
        return true;
    }
    var value = input.val();
    if (value === '') {
        return true;
    }else{
        return CheckNetmask(value);
    }
};

kendo.ui.validator.messages.netmaskCheck = function (input) {
    return "请正确输入子网掩码";
};
kendo.ui.validator.rules.int = function (input) {
    /**
     * @return {boolean}
     */
    function Check(value) {
        return (/^\d+$/.test(value));
    }
    if(!input.is('[int]') || !input.is(":visible")){
        return true;
    }
    var value = input.val();
    if (value === '') {
        return true;
    }else{
        return Check(value);
    }
};

kendo.ui.validator.messages.int = function (input) {
    return "请输入整数";
};

kendo.ui.validator.rules.length = function (input) {
    /**
     * @return {boolean}
     */
    if(!input.is('[length]') || !input.is(":visible")){
        return true;
    }
    var value = input.val();
    if (value.length == 0 || value.length == input.attr('length')) {
        return true;
    }else{
        return false;
    }
};

kendo.ui.validator.messages.length = function (input) {
    return `长度须为${input.attr('length')}位`;
};


$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
} ;
//产品信息配置
var CONFIG = kendo.observable({
    company:'',
    headIcon:'',
    logo:'/nologin/getImageConfig?key=logo',
    loginLogo:'/nologin/getImageConfig?key=login_logo',
    headLogo:'/nologin/getImageConfig?key=head_logo',
    versionLogo:'/nologin/getImageConfig?key=version_logo',
    headIco:'/nologin/getImageConfig?key=head_ico',
    managePort:'/nologin/getImageConfig?key=managePort_bg',
    servicePort:'/nologin/getImageConfig?key=servicePort_bg',
    iconBack:'/nologin/getImageConfig?key=icon_fanhui',
    productName:'',
    version:'',
    copyRight:'',
    currentVersion:'',//'noLeft'
    showBattery:false,
    batteryInfo:'',
    progress:'',
    isDeepAnalysis:'no',//是否有深度分析
    userName:''
});
kendo.bind($("html"), CONFIG);
//防止重复提交同一个请求
// var pendingRequests = {};
// $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
//     var key = options.url;
//     //console.log(key);
//     if (!pendingRequests[key]) {
//         pendingRequests[key] = jqXHR;
//     }else{
//         //jqXHR.abort();    //放弃后触发的提交
//         pendingRequests[key].abort();   // 放弃先触发的提交
//     }
//     var complete = options.complete;
//     options.complete = function(jqXHR, textStatus) {
//         pendingRequests[key] = null;
//         if ($.isFunction(complete)) {
//             complete.apply(this, arguments);
//         }
//     };
// });


//全局设置请求成功或失败
$(document).ajaxSuccess(function( event, res, settings ) {
    var data = JSON.parse(res.responseText);
    if(data.result !== true && settings.url !== '/sys/login'){
        window.top.showToastr(data.msg,'error');
    }
    //console.log(res.status);
});
$( document ).ajaxError(function( event, res, settings ) {
  if(res.status == 401){
    if (window != top){
      top.location.href = filePath.login;
    }else{
      window.location.href = filePath.login;
    }
    return;
  }
});
//隐藏右键菜单
$(document).on("click",function () {
    var menu = '';
    if($(".pointer-menu").length){
        menu = $(".pointer-menu");
    }else{
        menu = $(".pointer-menu", window.parent.document);
    }
    menu.hide();
});

//获取配置信息
$.ajax({
    type:'GET',
    url: GENERAL_CONFIG.BASE_URL + apis.getAllConfig,
    async:false,
    success:function (res) {
        if(res.result === true){
            var data = res.data;
            CONFIG.set('company',data.sys_company);
            CONFIG.set('productName',data.sys_product_name);
            CONFIG.set('copyRight',data.sys_copy_right);
            CONFIG.set('isDeepAnalysis',data.isDeepAnalysis);
        }
    }
});
//获取当前版本
$.ajax({
    type:'GET',
    url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.getCurrentVersion,
    async:false,
    success:function (res) {
        if(res.result === true){
            var data = res.data;
            if(data === 'ruiandz'){
                CONFIG.set('currentVersion','noLeft');
            }
        }
    }
});
//窗口大小改变时表格高度自适应
//此处目前对body下面的表格做了高度响应，如果有其他表格需要，需要额外添加选择器获取，直接对所有表格处理会有问题
var timeoutId;
$(window).on('resize',function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        $('body>.k-grid').each(function () {
            if($(this).find('.k-grid-toolbar').length && $(this).find('.k-grid-pager').length){
                $(this).find('.k-grid-content').height(parseInt($(this).css('height')) - 147);
            }else if($(this).find('.k-grid-toolbar').length && !$(this).find('.k-grid-pager').length){
                $(this).find('.k-grid-content').height(parseInt($(this).css('height')) - 96);
            }else if(!$(this).find('.k-grid-toolbar').length && $(this).find('.k-grid-pager').length){
                $(this).find('.k-grid-content').height(parseInt($(this).css('height')) - 95);
            }else if(!$(this).find('.k-grid-toolbar').length && !$(this).find('.k-grid-pager').length){
                $(this).find('.k-grid-content').height(parseInt($(this).css('height')) - 44);
            }
        });
    },100);
});
//屏蔽右键菜单
document.oncontextmenu = function(){
    return false;
};
/**
 * 禁用后退
 */
window.history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});
export {CONFIG};