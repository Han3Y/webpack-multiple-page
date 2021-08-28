    import {commonModel,GENERAL_CONFIG,PAGE_CONFIG,UI_CONFIG,TOASTR} from "./modules/common";
    import {CONFIG} from "./config";
    import {filePath} from './modules/filePath';
    import '../less/index.less';
    import {apis} from './modules/api';
    var uploadFile = '';
    var indexPanel = '';
    var fileStatus = kendo.observable({
        showNormal:false,
        showHigh:true
    });
    kendo.bind($(".files-box")[0], fileStatus);
    setInterval(function(){
        CONFIG.set("date",kendo.toString(new Date(), "yyyy.MM.dd HH:mm:ss"));
    },1000);
    var showTabStatus = kendo.observable({
        showTab:true,
        showEmpty:false,
        showEmpty_action:false,  
        showEmpty_text:false
    });
    kendo.bind($(".index-content"),showTabStatus);
    kendo.bind($("#emptyImg"), CONFIG);
    // kendo.bind($(".back-menu"), CONFIG);
    /**
     * 全局遮罩
     */
    var pageLoader = $('#pageLoader').kendoLoader({
        size: 'medium',
        themeColor: 'info',
        // type:'infinite-spinner'
    }).data("kendoLoader");

    /**
     * 页头信息
     */
    window.currentCompanyId = ''; // 当前项目id
    window.backToTask = false; // 是否需要返回到任务管理界面
    var pageHeaderData = kendo.observable({
        firstLevelName: '', // 第一级菜单名称 ：快速评估、任务管理 等
        projectName: '', // 项目名称
        showProject: false, // 是否展示项目信息
        showRegion: false,
        otherInfo: '', // 其他信息
    });
    kendo.bind($('.basic-info-box'), pageHeaderData);
    kendo.bind($('.basic-info-empty-box'), pageHeaderData);
    window.setPageHeaderData = function(name ,value){
        pageHeaderData.set(name, value);
    };
    window.showInfo = function(){
        $('.basic-info-box').show();
    };
    window.hideInfo = function(){
        $('.basic-info-box').hide();
    };
    window.showEmptyInfo = function(){
        $('.basic-info-box').hide();
        $('.basic-info-empty-box').show();
    };


    /**
     * 面包屑导航
     */
    window.navData = []; // {text:'',url:'',params:jsonstr}
    let initNav = function(){
        $('#breadcrumbBox').html('');
        Array.prototype.map.call(window.navData, function (item, index, array) {
            if(index == array.length - 1){
                $('#breadcrumbBox').append(`
                            <span class="bread-item last-bread" data-index='${index}'>${item.text}</span>
                        `);
            }else{
                $('#breadcrumbBox').append(`
                            <span class="bread-item" data-index='${index}' data-link='${item.url}' data-params='${item.params}'>${item.text}</span> &gt;
                        `);
            }
        });
    };
    window.refreshNav = function(data, type){
        switch (type) {
            case 'create':
                window.navData = [];
                if(pageHeaderData.get('firstLevelName')){
                    window.navData.push({
                        text: pageHeaderData.get('firstLevelName')
                    });
                }
                window.navData.push(data);
                break;
            case 'add':
                window.navData.push(data);
                break;
            case 'remove':
                window.navData.splice(window.navData.length - 1, 1);
                break;
        }
        initNav();
    };
    $('#breadcrumbBox').on('click','.bread-item',function () {
       let url = $(this).data('link');
       let params = $(this).data('params') || {};
       let index = $(this).data('index');
       if(!$(this).hasClass('last-bread')){
           $('.page-loading').show();
           window.navData.splice(index + 1, window.navData.length - (index + 1));
           pageHeaderData.set('otherInfo', '');
           initNav();
           window.openNewTab({
              text:'',
              url: url,
              params: params
           });
       }
    });

    //区域列表
    window.regionSelect = $("#regionSelect").kendoDropDownList({
        autoBind: false,
        dataSource:{
            transport:{
                read :
                    {
                        url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.basicInfoList,
                        cache: false,
                        async: false,
                        data:function () {
                            return {
                                id: window.currentCompanyId
                            }
                        }
                    }
            },
            schema:{
                data:'data'
            }
        },
        change:function () {
            if(!$('#iframe')[0].contentWindow){
                return;
            }
            let myRefresh = $('#iframe')[0].contentWindow.myRefresh;
            if(myRefresh){
                myRefresh(this.value());
            }
        },
        dataBound:function(){
            this.select(0);
            this.trigger('change');
        },
        dataTextField:'value',
        dataValueField:'key',
        noDataTemplate:'无数据'
    }).data("kendoDropDownList");

    /**
     * 切换选择的项目
     * @param id
     */
    window.changeSelect = function(){
        window.regionSelect.dataSource.read();
    };
    /**
     * 页面加载完成隐藏loading
     */
    $('#iframe').on('load',function () {
       $('.page-loading').hide();
    });
    /**
     * 关闭tab页时处理
     */
    var configureCloseTab = function () {
        if(tabStrip.items().length > 0){
            showTabStatus.set("showTab",true);
            showTabStatus.set("showEmpty",false);
        }else{
            showTabStatus.set("showTab",false);
            showTabStatus.set("showEmpty",true);
        }
        var tabsElements = $('#index-tab li[role="tab"]');//.slice(1);
        for(var i = 0;i<tabsElements.length;i++){
            if($(tabsElements[i]).find("[data-type='remove']").length ===0 ){
                $(tabsElements[i]).append('<span data-type="remove" class="k-link"><span class="k-icon k-i-x"></span></span>');
            }
        }
        tabStrip.tabGroup.off("click","[data-type='remove']").on("click", "[data-type='remove']", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var item = $(e.target).closest(".k-item");
            tabStrip.remove(item.index());

            if (tabStrip.items().length > 0 && item.hasClass('k-state-active')) {
                tabStrip.select(tabStrip.items().length - 1);
            }
            if(tabStrip.items().length > 0){
                showTabStatus.set("showTab",true);
                showTabStatus.set("showEmpty",false);
            }else{
                showTabStatus.set("showTab",false);
                showTabStatus.set("showEmpty",true);
            }
        });
        tabStrip.tabGroup.off("dblclick").on("dblclick",function(e){
            e.preventDefault();
            e.stopPropagation();
            var item = $(e.target).closest(".k-item");
            var index = item.index();
            if(item.hasClass('k-state-active')){
                var src = $($("iframe")[index]).attr("src");
                $($("iframe")[index]).attr("src",src.replace(/t=(\d{8,16})/g, "t=" + new Date().getTime()));
            }
        });
    };

    /**
     * 打开新的tab页
     * @param o
     * @returns {boolean}
     */
    window.openNewTab = function(o){
        $('.page-loading').show();
        window.openSinglePage(o);
        return;
        var tabContents = $(".k-content");
        /*先拼接参数url*/
        var paramStr = "";
        for(var key in o.params){
            paramStr = paramStr + key + "=" + o.params[key] + "&";
        }
        //paramStr = paramStr.substring(0,paramStr.length - 1);
        var url = o.url + '?' + paramStr + "t=" + new Date().getTime();
        //判断是否已打开该tab
        for(var i = 0;i < tabContents.length;i++){
            if($(tabContents[i]).find("iframe").attr("data-tabId") == o.tabId){
                tabStrip.select(i);
                if(o.refresh === true){//刷新条件
                    $(tabContents[i]).find("iframe").attr("src",url.replace(/t=(\d{8,16})/g, "t=" + new Date().getTime()));
                }
                return false;
            }
        }
        tabStrip.append({
            text: o.text,
            content: "<iframe src='"+ url + " 'data-tabId='"+ o.tabId +"'></iframe>"
        });
        configureCloseTab();
        tabStrip.select($('#index-tab li[role="tab"]').length - 1);
    };

    /**
     * 打开单个页面
     * @param o
     */
    window.openSinglePage = function(o){
        /*先拼接参数url*/
        var paramStr = "";
        for(var key in o.params){
            paramStr = paramStr + key + "=" + o.params[key] + "&";
        }
        //paramStr = paramStr.substring(0,paramStr.length - 1);
        var url = o.url + '?' + paramStr + "t=" + new Date().getTime();
        $('#iframe').attr('src', url.replace(/t=(\d{8,16})/g, "t=" + new Date().getTime()));
        //如果不是左侧菜单 则取消左侧菜单选中状态
        // var panelData = indexPanel.dataSource.data();
        // for(let i = 0; i < panelData.length; i ++){
        //     if(panelData[i].text == o.text){
        //         return
        //     }
        // }
        // $('#index-panel .k-link').removeClass('k-state-selected');
    };

    /**
     * 动态创建弹窗
     * {
     *     title: string,
     *     url: string,
     *     width: number,
     *     height: number,
     *     class: string,
     *     open:func
     *     close: func
     * }
     */
    let pageWindow = null;
    window.createPageWindow = function(option){
        $('body').append('<div id="pageWindow"></div>');
        /*先拼接参数url*/
        var paramStr = "";
        for(var key in option.params){
            paramStr = paramStr + key + "=" + option.params[key] + "&";
        }
        var url = paramStr?(option.url + '?' + paramStr + "t=" + new Date().getTime()):option.url;
        pageWindow = $("#pageWindow").kendoGDialog({
            modal:true,
            title:option.title,
            resizable: false,
            draggable: false,
            width: option.width || UI_CONFIG.longerWidth,
            height: option.height || 600,
            visible:false,
            content:url,
            defaultButtons:'NULL',
            class: 'page-window' + (option.class?(' ' + option.class): ''),
            iframe:true,
            open:option.open?function(){
                $('.k-overlay').css('z-index','10002');
                $('.userDefine-window').css('z-index','10003');
                option.open();
            }:function(){
                $('.k-overlay').css('z-index','10002');
                $('.userDefine-window').css('z-index','10003');
            },
            close:function () {
                pageWindow.destroy();
                if(option.close){
                    option.close();
                }
            }
        }).data("kendoGDialog");
        pageWindow.open();
    };
    window.showIcon = function(show){
        if(show){
            $('#closePdf').show();
        }else{
            $('.k-overlay').css('z-index','10002');
            $('#closePdf').hide();
        }
    };

    //关闭全部
    $("#closeAll").on("click",function () {
        tabStrip.select(0);
        var tabsElements = $('#index-tab li[role="tab"]');
        var len = tabsElements.length;
        for(var i = 0;i<len;){
            tabStrip.remove(i);
            tabsElements = $('#index-tab li[role="tab"]');
            len = tabsElements.length;
        }
        showTabStatus.set("showTab",false);
        showTabStatus.set("showEmpty",true);
    });
    //关闭其他
    $("#closeOther").on("click",function () {
        var tabsElements = $('#index-tab li[role="tab"]');
        var len = tabsElements.length;
        for(var i = 0;i<len;){
            if($(tabsElements[0]).hasClass('k-state-active')) {
                i = 1;
            }
            tabStrip.remove(i);
            tabsElements = $('#index-tab li[role="tab"]');
            len = tabsElements.length;
        }
    });
    //刷新当前页
    $("#refreshTab").on("click",function () {
        var index = $(".k-tabstrip-items .k-state-active").closest(".k-item").index();
        var src = $($("iframe")[index]).attr("src");
        $($("iframe")[index]).attr("src",src.replace(/t=(\d{8,16})/g, "t=" + new Date().getTime()));
    });

    //根据选中的tab选中左侧菜单栏
    var getSelectedNav = function(){

    };

    var versionWindow = $("#versionWindow").kendoGDialog({
        title: "版本信息",
        modal:true,
        resizable: false,
        draggable: false,
        width:560,
        height:400,
        defaultButtons:'NULL',
        visible:false
    }).data("kendoGDialog");

    /**************用户密码修改*********************/
    var psdForm, psdWindow,wrapper;
    var savePsd = function (form) {
        var params = form.serializeObject();
        params.oldPassword =  hex_md5('@12AQh#909' + hex_md5(params.oldPassword));
        params.newPassword =  hex_md5('@12AQh#909' + hex_md5(params.newPassword));
        params.rePassword = hex_md5('@12AQh#909' + hex_md5(params.rePassword));
        params.userId = commonModel.userInformation.id;
        $.ajax({
            url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.changePassword,
            type:'POST',
            data:params,
            success:function(res){
                if(res.result === true){
                    psdWindow.destroy();
                    TOASTR.show('修改成功','success');
                }else{

                }
            },
            error:function(){

            }
        });
    };
    var creatPsdWindow = function(){
        wrapper = $("<div id='psdContent'></div>");
        wrapper.append($("#psdForm").clone(true).css('display','block'));
        psdForm  =  wrapper.find('#psdForm');
        psdWindow = wrapper.kendoGDialog({
            title:"密码管理",
            visible:false,
            draggable: false,
            modal:true,
           /* height:375,*/
            width:UI_CONFIG.longWidth,
            close:function(){
                this.destroy();
            },
            onOk:function (e) {
                var validator = psdForm.data("kendoValidator");
                if (validator.validate()) {
                    savePsd(psdForm);
                }else{

                }
            }
        }).data("kendoGDialog");
        psdWindow.open();
        psdForm.kendoValidator({});
    };

    var uploadWindow = $("#uploadWindow").kendoGDialog({
        title: '系统升级',
        modal:true,
        resizable: false,
        draggable: false,
        width: 550,
        height:380,
        visible:false,
        onOk:function () {
            if(commonModel.getMachineType() == 'normal'){
                if(!uploadFile.getFiles().length) {
                    TOASTR.show("请上传文件","error");
                }else{
                    $.ajax({
                        type:'POST',
                        url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.upgrade,
                        success:function (res) {
                            if(res.result === true){
                                console.log("开始升级");
                                commonModel.checkRebootStatus();
                            }
                        },
                        error:function(){

                        }
                    });
                }
            }else{
                if(!window.uploadFileHigh){
                    TOASTR.show("请上传文件","error");
                }else{
                    $.ajax({
                        type:'POST',
                        url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.upgrade,
                        success:function (res) {
                            if(res.result === true){
                                console.log("开始升级");
                                commonModel.checkRebootStatus();
                            }
                        },
                        error:function(){

                        }
                    });
                }
            }

        }
    }).data("kendoGDialog");
    var restoreWindow = $("#restoreWindow").kendoGDialog({
        title: '恢复出厂',
        modal:true,
        resizable: false,
        draggable: false,
        width: UI_CONFIG.longWidth,
        height:245,
        visible:false,
        onOk:function () {
            var restoreForm = $("#restoreForm").kendoValidator({}).data("kendoValidator");
            var password = $.trim($("#loginPwd").val());
            if(restoreForm.validate()){
                $.ajax({
                    type:'POST',
                    url:GENERAL_CONFIG.BASE_URL +  apis.passwordCheck,
                    data: {
                        password: hex_md5('@12AQh#909' + hex_md5(password))
                    },
                    success:function (res) {
                        if(res.result === true){
                            commonModel.confirm({
                                content:'<div style="color: red">此操作将恢复出厂设置，清空所有操作数据并重启设备，如需继续请点击确认。</div>'
                            },function () {
                                kendo.ui.progress($("body"), true);
                                $.ajax({
                                    type:'POST',
                                    cache:false,
                                    url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION +  apis.restore,
                                    success:function (res) {
                                        kendo.ui.progress($("body"), false);
                                        window.location.href = filePath.login;
                                    },
                                    error:function (res) {

                                    }
                                });
                            });
                        }
                    }

                });
            }
        }
    }).data("kendoGDialog");
    var eraserWindow = $("#eraserWindow").kendoGDialog({
        title: '痕迹清除',
        modal:true,
        resizable: false,
        draggable: false,
        width: 410,
        height:245,
        visible:false,
        onOk:function () {
            var eraserForm = $("#eraserForm").kendoValidator({}).data("kendoValidator");
            var password = $.trim($("#loginPwd2").val());
            if(eraserForm.validate()){
                $.ajax({
                    type:'POST',
                    url:GENERAL_CONFIG.BASE_URL +  apis.passwordCheck,
                    data: {
                        password: hex_md5('@12AQh#909' + hex_md5(password))
                    },
                    success:function (res) {
                        if(res.result === true){
                            commonModel.confirm({
                                content:'<div style="color: red">此操作将进行痕迹清除，擦除所有操作数据并重启设备，如需继续请点击确认。</div>'
                            },function () {
                                kendo.ui.progress($("body"), true);
                                $.ajax({
                                    type:'POST',
                                    cache:false,
                                    url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION +  '/platform/traceRemoval',
                                    success:function (res) {
                                        kendo.ui.progress($("body"), false);
                                        window.location.href = filePath.login;
                                    },
                                    error:function (res) {

                                    }
                                });
                            });
                        }
                    }

                });
            }
        }
    }).data("kendoGDialog");

    /**
     * 多页tab
     * @type {jQuery}
     */
    // var tabStrip = $("#index-tab").kendoTabStrip({
    //     //     dataTextField: "text",
    //     //     dataContentField: "content",
    //     //     animation:false,
    //     //     dataSource:[],
    //     //     select:function (e) {
    //     //         let eleId = $(e.item).attr('aria-controls');
    //     //         let myRefresh = $(`#${eleId}`).find('iframe')[0].contentWindow.myRefresh;
    //     //         if(myRefresh){
    //     //             myRefresh();
    //     //         }
    //     //
    //     //          // 展开导航并定位
    //     //         if (indexPanel) {
    //     //             var curHastext =  $(e.item).text();
    //     //             var curLinkpanel;
    //     //             $('#index-panel .k-link').removeClass('k-state-selected');
    //     //             $('#index-panel .k-link').each(function(){
    //     //                 let othis = $(this);
    //     //                 if(othis.find('.panel-text').text() === curHastext){
    //     //                     curLinkpanel = othis;
    //     //                     //break;
    //     //                 }
    //     //             })
    //     //             if(curLinkpanel){
    //     //                 var group = curLinkpanel.parents('.k-group');
    //     //                 if(group.length>0){
    //     //                     let hasExpaned = group.parent().hasClass('k-state-active');
    //     //                     if(!hasExpaned){
    //     //                         indexPanel.expand(group.parent());
    //     //                     }
    //     //                     curLinkpanel.addClass('k-state-selected');
    //     //                 }else{
    //     //                     indexPanel.collapse(curLinkpanel);
    //     //                     curLinkpanel.addClass('k-state-selected');
    //     //                 }
    //     //             }
    //     //         }
    //     //     },
    //     //     activate:function(e) {
    //     //         let eleId = $(e.item).attr('aria-controls');
    //     //         let selfWindow = $(`#${eleId}`).find('iframe')[0].contentWindow;
    //     //         let closeScanWindow = selfWindow.closeScanWindow;
    //     //         if(closeScanWindow){
    //     //             closeScanWindow();  //切换到其他tab的时候，流量分析和无线分析自动停止之后弹出框不会自动关闭。所以需要切换到当前tab时，手动去触发。
    //     //         }
    //     //         var notification =$(selfWindow.document).find('.k-notification');
    //     //         if(notification.length){
    //     //             notification.parent().remove();
    //     //         }
    //     //
    //     //     }
    //     // }).data("kendoTabStrip").select(0);

    /*var inlineDefault = new kendo.data.HierarchicalDataSource({
        data:[
            {
                text: "计划管理",
                url:'../html/planManagement.html',
                imageUrl:'../img/panel/plan.svg'
            },
            {
                text: "单位管理",
                url:'../html/unitManagement.html',
                imageUrl:'../img/panel/company.svg'
            },
            {
                text: "合规性检查",
                imageUrl:'../img/panel/compliance.svg',
                items:[
                    {
                        text:'合规性分析',
                        url:'../html/compliance.html'
                    },
                    {
                        text:'指标库管理',
                        url:'../html/repositoryList.html'
                    }
                ]
            },
            {
                text: "资产分析",
                imageUrl:'../img/panel/asset.svg',
                items:[
                    {
                        text:'资产列表',
                        url:'../html/assetsList.html'
                    },
                    {
                        text:'白名单',
                        url:'../html/safeAssets.html'
                    },
                    {
                        text:'设备厂商列表',
                        url:'../html/deviceVendorList.html'
                    },
                    {
                        text:'设备型号列表',
                        url:'../html/deviceTypeList.html'
                    },
                    {
                        text:'资产分析统计',
                        url:'../html/assetsReport.html'
                    }
                ]
            },
            {
                text: "流量分析",
                imageUrl:'../img/panel/trafficFlow.svg',
                items:[
                    {
                        text:'数据包列表',
                        url:'../html/pcapList.html'
                    },
                    {
                        text:'流量分析统计',
                        url:'../html/trafficReport.html'
                    }
                ]
            },
            {
                text: "无线分析",
                url:'../html/wirelessAnalysis.html',
                imageUrl:'../img/panel/wireless.svg'
            },
            {
                text: "基线检查",
                url:'../html/baseLineExamine.html',
                imageUrl:'../img/panel/baseLine.svg'
            },
            {
                text: "代码检查",
                url:'../html/codeExamine.html',
                imageUrl:'../img/panel/codeExamine.svg'
            },
            {
                text: "附件管理",
                url:'../html/fileManagement.html',
                imageUrl:'../img/panel/file.svg'
            },
            {
                text: "文书管理",
                url:'../html/documentManagement.html',
                imageUrl:'../img/panel/document.svg'
            },
            {
                text: "报告管理",
                url:'../html/reportManagement.html',
                imageUrl:'../img/panel/report.svg'
            }
        ]
    });
    indexPanel.select($("#index-panel>.k-item").eq(0));
    openNewTab({
        text: inlineDefault.data()[0].text,
        url:inlineDefault.data()[0].url,
        params:{},
        tabId: inlineDefault.data()[0].text
    });*/
    var getCurrentUser = function () {
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.currentUser,
            cache:false,
            async:false,
            success:function (res) {
                if(res.result === true){
                    CONFIG.set("userName",res.data.userName);
                     window.currentLoginName = res.data.loginName ;
                    showTabStatus.set('userName',res.data.userName);
                    commonModel.userInformation = res.data;
                    let role = commonModel.userInformation.roles.join('');
                    if(role.indexOf('2') > -1){//操作员获取菜单后展示块状菜单
                        getLeftMenu('block');
                    }else{
                        //管理员和操作员直接获取左侧菜单
                        getLeftMenu('left');
                    }
                }
            }
        });
    };
    /**
     * 快速评估弹窗
     */
    let formData;
    let initData = {
        name:'',     //项目名称
        regions:[{id:'omp_0',name:''}],//关联区域信息   todo 之后会是数组
    };
    var formValidator = $("#projectForm").kendoValidator({
        rules:{
            custom: function (input) {
                if((input.is("[name*=areaList]") || input.is("[name*=CityList]")) && input.parents(".input-field").is(":visible")){
                    return $.trim(input.val()) !== "";
                }else{
                    return true;
                }
            }
        },
        messages:{
            custom:'不能为空'
        }
    }).data("kendoValidator");
    var addOreditWindow = $("#addOreditWindow").kendoGDialog({
        title:'快速评估',
        modal:true,
        resizable: false,
        draggable: false,
        width:UI_CONFIG.longWidth,
        height:400,
        okText:'开始',
        visible:false,
        open:function(){
            formValidator.hideMessages();
            commonModel.cancelValidate();
        },
        onOk:function () {
            if(formValidator.validate()){
                kendo.ui.progress($("body"), true);
                formData.set('regions ',resetRegionIdNull());
                $.ajax({
                    type:'POST',
                    url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/basicInfo/project',
                    data:JSON.stringify(formData),
                    dataType:'json',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    success:function (res) {
                        if(res.result === true){
                            window.showToastr('保存成功','success');
                            $('.background-box').css({
                                background:'transparent'
                            });
                            addOreditWindow.close();
                            pageHeaderData.set('projectName', formData.get('name'));
                            pageHeaderData.set('showProject', true);
                            pageHeaderData.set('showRegion', true);
                            window.currentCompanyId = res.data;
                            window.regionSelect.dataSource.read();
                            getLeftSecondMenu(window.blockId);
                        }
                    },
                    complete:function () {
                        kendo.ui.progress($("body"), false);
                    }
                });
            }
        }
    }).data("kendoGDialog");

    /**
     * 区域
     */
    let iconDelete = require('../img/icon_delete.png');
    var initRegions = [{id:'omp_0',name:'',icon:iconDelete}];//关联区域信息
    var initRegionsreset =()=>{
        initRegions =  [{id:'omp_0',name:'',icon:iconDelete}];
    };
    var  regionLists = kendo.template($("#regionLists").html());
    var regionId =0;
    var getNextRegionId = function(){
        if(regionId == null){
            regionId = 0;
        }
        regionId ++;
        return "omp_"+regionId;
    };
    var resetRegionIdNull = ()=>{
        let ary  = new Array(); //数组对象的深拷贝
        for(let i = 0;i<initRegions.length;i++){
            ary.push($.extend({},initRegions[i]));
        }
        Array.from(ary,function(x){
            if(x.id.indexOf('omp_')>=0){
                x.id ='';
            }
        })
        return ary;
    };
    $("#projectForm").on("change",".regionInput",function () {
        let $this = $(this);
        let regionId = $this.attr('name').replace(new RegExp('region_','g'),'')
        let value = $this.val();
        Array.from(initRegions,function(x){
            if(x.id===regionId){
                x.name = value;
            }
        })

    });
    $("#projectForm").on("click","#addRegion",function () {
        let s = {};
        s.id = getNextRegionId();
        s.name="";
        s.icon = iconDelete;
        initRegions.push(s);
        let regionsHtml = regionLists(initRegions);
        $(".regionsArealists").html(regionsHtml);
    });
    var deleRegion =function(regionId){
        initRegions = initRegions.filter(function(o) { return o.id !==regionId; });
        let regionsHtml = regionLists(initRegions);
        $(".regionsArealists").html(regionsHtml);
    }

    $("#projectForm").on("click",".regionDelete",function () {
        let $this = $(this);
        let regionId = $this.attr('id');
        deleRegion(regionId);
    });

    /**
     * 左侧菜单
     * @param type：block  left
     */
    window.blockId = '';
    var getLeftMenu = function (type) {
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.menusLeft,
            cache:false,
            success:function (res) {
                if(res.result === true){
                    var menu = res.data || [];
                    if(!menu || !menu.length){
                        $('.page-loading').hide();
                        return;
                    }
                    if(type == 'block'){ // 操作员
                        for(let i = 0; i < menu.length; i++){
                            $('.menu-item-box').append(`
                                <div class="menu-item" 
                                style='background: url("${menu[i].icon}") no-repeat center center/ 100%'
                                data-menuurl="${menu[i].url}"
                                data-menuid="${menu[i].id}">
                                    <span class="menu-text">${menu[i].text}</span>
                                </div>
                            `);
                        }
                        $('.menu-item-box').addClass(`item-${menu.length}`);
                        $('.operator-block').show();
                        $('.page-loading').hide();
                        return
                    }
                    // 管理员 和  审计员
                    $('.index-content').show();
                    indexPanel = $("#index-panel").kendoPanelBar({
                        dataSource:  new kendo.data.HierarchicalDataSource({
                            data:menu
                        }),
                        loadOnDemand: false,
                        expandMode: "single",
                        template: `
                            <span class="iconfont">#= item.icon #</span>
                            <span class='panel-text'>#= item.text #</span>
                        `,
                        select:function(e){
                            e.preventDefault();
                            var url = $(e.item).children("a").attr("href");
                            var text = $(e.item).find("> .k-link").find(".panel-text").text();
                            if(url){
                                window.refreshNav({
                                    text:text,
                                    url: url,
                                    params:JSON.stringify({title:text})
                                },'create');
                                window.openNewTab({
                                    text: text,
                                    url:url,
                                    params:{title:text},
                                    tabId: text
                                },'create');
                                pageHeaderData.set('otherInfo', '');
                                window.showInfo();
                            }else{
                                if($(e.item).hasClass("k-state-active")){
                                    indexPanel.collapse($("li.k-state-active"));
                                }else{
                                    indexPanel.expand($(e.item));
                                }
                            }
                           
                        }
                    }).data("kendoPanelBar");
                    // addMenuTooltip();
                    window.openNewTab({
                        text: menu[0].text,
                        url:menu[0].url,
                        params:{title:menu[0].text},
                    });
                    window.refreshNav({
                        text:menu[0].text,
                        url: menu[0].url,
                        params:JSON.stringify({title:menu[0].text})
                    },'create');
                    window.showInfo();
                    indexPanel.select($("#index-panel>.k-item").eq(0));
                }
            }
        });
    };
    $('.menu-item-box').on('click','.menu-item',function () {
        let text = $(this).find('.menu-text').text();
        let id = $(this).data('menuid');
        window.blockId = id;
        let url = $(this).data('menuurl');
        if(url == filePath.quickStart){
            initRegionsreset();
            let regionsHtml = regionLists(initRegions);
            formData = kendo.observable(initData);
            kendo.bind($("#addOreditWindow"), formData);
            addOreditWindow.open();
            $(".regionsArealists").html(regionsHtml);
            window.backToTask = true;
        }else{
            $('.background-box').css({
                background:'transparent'
            });
            window.getLeftSecondMenu(id);
        }
    });
    //左侧二级菜单
    window.getLeftSecondMenu = function (id, url) { // 若传入url 则直接根据url获取菜单
        $('.panel-block').show();
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + (url || apis.systemItems),
            data:{
                parentId: id
            },
            cache:false,
            success:function (res) {
                if(res.result === true){
                    var menu = res.data;
                    if(!menu || !menu.length){
                        $('.panel-block').hide();
                        return;
                    }
                    $('.back-menu').show();
                    $('.operator-block').hide();
                    $('.index-content').show();
                    $('.panel-box').css('height','calc(100% - 72px)');
                    indexPanel = $("#index-panel").kendoPanelBar({
                        dataSource:  new kendo.data.HierarchicalDataSource({
                            data:menu
                        }),
                        loadOnDemand: false,
                        expandMode: "single",
                        template: `
                            <span class="iconfont">#= item.icon #</span>
                            <span class='panel-text'>#= item.text #</span>
                        `,
                        select:function(e){
                            e.preventDefault();
                            var url = $(e.item).children("a").attr("href");
                            var text = $(e.item).find("> .k-link").find(".panel-text").text();
                            if(url){
                                window.openNewTab({
                                    text: text,
                                    url:url,
                                    params:{title:text},
                                    tabId: text
                                });
                            }
                            if($(e.item).hasClass("k-state-active")){
                                indexPanel.collapse($("li.k-state-active"));  //去掉了else qa_project-608
                            }
                            window.refreshNav({
                                text: text,
                                url:url,
                                params:JSON.stringify({title:text})
                            },'create');
                            window.showInfo();
                            pageHeaderData.set('otherInfo', '');
                            if(url == filePath.compliance || url == filePath.wireless ){
                                pageHeaderData.set('showRegion', false);
                            }else{
                                pageHeaderData.set('showRegion', true);
                            }

                            //e.stopPropagation();
                           
                        }
                    }).data("kendoPanelBar");
                    // addMenuTooltip();
                    window.openNewTab({
                        text: menu[0].text,
                        url:menu[0].url,
                        params:{title:menu[0].text},
                    });
                    indexPanel.select($("#index-panel>.k-item").eq(0));
                    window.refreshNav({
                        text: menu[0].text,
                        url:menu[0].url,
                        params:JSON.stringify({title:menu[0].text})
                    },'create');
                    window.showInfo();
                }
            }
        });
    };
    //顶部菜单
    var getHeadMenu = function () {
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.menusTop,
            cache:false,
            success:function (res) {
                if(res.result === true){
                    $("#head-menu").kendoMenu({
                        /*dataSource: [
                         {
                         text: "",
                         imageUrl:'../img/panel/setting.svg',
                         items: [
                         {
                         text: "版本信息",
                         attr:{
                         type:'version'
                         }
                         },
                         {
                         text: "日志信息",
                         attr:{
                         url:'../html/logs.html',
                         type:'page'
                         }
                         }
                         ]
                         },
                         {
                         text: "",
                         imageUrl:'../img/panel/user.svg',
                         items: [
                         { text: "用户管理",
                         attr:{
                         url:'../html/users.html',
                         type:'page'
                         }
                         },
                         { text: "角色管理",
                         attr:{
                         url:'../html/roles.html',
                         type:'page'
                         }
                         },
                         { text: "修改密码",
                         attr:{
                         type:'modifyPsd'
                         }
                         },
                         { text: "退出" ,
                         attr:{
                         type:'logout'
                         }
                         }
                         ]
                         },
                         {
                         text: "",
                         imageUrl:'../img/panel/system.svg',
                         items: [
                         { text: "设置",
                         attr:{
                         url:'../html/systemConfig.html',
                         type:'page'
                         }
                         },
                         { text: "导出" ,
                         attr:{
                         type:'export'
                         }
                         },
                         { text: "升级" ,
                         attr:{
                         type:'systemUpload'
                         }
                         },
                         // { text: "指纹库升级" ,
                         //     attr:{
                         //         type:'fingerprintUpload'
                         //     }
                         // },
                         { text: "关机" ,
                         attr:{
                         type:'close'
                         }
                         },
                         { text: "重启" ,
                         attr:{
                         type:'restart'
                         }
                         }
                         ,
                         { text: "恢复出厂" ,
                         attr:{
                         type:'restore'
                         }
                         }
                         ]
                         }
                         ],*/
                        dataSource: res.data,
                        select:function(e){
                            if($(e.item).attr("type") === 'page' && $(e.item).attr("url")){
                                window.createPageWindow({
                                    title: $(e.item).children(".k-link").text(),
                                    url:$(e.item).attr("url"),
                                    width: 1000
                                });
                            }else if($(e.item).attr("type") === 'version'){
                                versionWindow.open();
                            }else if($(e.item).attr("type") === 'modifyPsd'){
                                creatPsdWindow();
                            }else if($(e.item).attr("type") === 'logout'){
                                $.ajax({
                                    type:'POST',
                                    url:GENERAL_CONFIG.BASE_URL +  apis.logout,
                                    success:function (res) {
                                        if (res.result == true)
                                        {
                                            window.location.href = filePath.login;
                                        }
                                    }
                                });
                            }else if($(e.item).attr("type") === 'close'){
                                commonModel.confirm({
                                    content:'此操作将关闭主机系统，所有正在运行中的任务将自动停止并保存当前结果，是否继续？'
                                },function () {
                                    $.ajax({
                                        type:'POST',
                                        cache:false,
                                        url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION +  apis.shutdown,
                                        success:function (res) {

                                        }
                                    });
                                });
                            }else if($(e.item).attr("type") === 'restart'){
                                commonModel.confirm({
                                    content:'此操作将重启主机系统，所有正在运行中的任务将自动停止并保存当前结果，是否继续？'
                                },function () {
                                    $.ajax({
                                        type:'POST',
                                        url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION +  apis.reboot,
                                        success:function (res) {
                                            commonModel.checkRebootStatus();
                                        }
                                    });
                                });
                            }else if($(e.item).attr("type") === 'systemUpload'){
                                if(commonModel.getMachineType() == 'normal'){
                                    fileStatus.set('showNormal',true);
                                    fileStatus.set('showHigh',false);
                                    if(uploadFile){
                                        uploadFile.clearAllFiles();
                                        uploadFile.destroy();
                                    }
                                    uploadFile = $("#uploadFile").kendoUpload({
                                        async: {
                                            saveUrl: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.upgradeFile,
                                            //autoUpload: false
                                        },
                                        localization: {
                                            select:'选择文件'
                                        },
                                        select:function () {
                                            this.clearAllFiles();
                                        },
                                        upload:function (e) {
                                            kendo.ui.progress($("body"), true);
                                        },
                                        success:function (response) {
                                            kendo.ui.progress($("body"), false);
                                              var res = response.response;
                                              if(res.result === true){
                                                TOASTR.show("上传成功","success");
                                              }else{
                                                TOASTR.show(res.msg || "上传失败","error");
                                              }
                                        },
                                        error:function () {
                                            kendo.ui.progress($("body"), false);
                                        }
                                    }).data("kendoUpload");
                                }else{
                                    fileStatus.set('showNormal',false);
                                    fileStatus.set('showHigh',true);
                                }
                                uploadWindow.open();
                            }else if($(e.item).attr("type") === 'fingerprintUpload'){
                                if(uploadFile){
                                    uploadFile.clearAllFiles();
                                    uploadFile.destroy();
                                }
                                uploadFile = $("#uploadFile").kendoUpload({
                                    async: {
                                        saveUrl: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/attachssssss',
                                        autoUpload: false
                                    },
                                    localization: {
                                        select:'选择文件'
                                    },
                                    upload:function (e) {

                                    },
                                    success:function () {

                                    },
                                    error:function () {

                                    }
                                }).data("kendoUpload");
                                uploadWindow.setOptions({title:'指纹库升级'});
                                uploadWindow.open();
                            }else if($(e.item).attr("type") === 'restore'){
                                restoreWindow.open();
                            }else if($(e.item).attr("type") === 'historyEraser'){
                                eraserWindow.open();
                            }else if($(e.item).attr("type") === 'export'){//计划导出
                                commonModel.downloadOpt(function () {
                                    window.open(GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/data/export/checkCommon','_blank');
                                },function () {
                                    commonModel.downLoadWindow('/data/export/high',{

                                    });
                                });
                            }else if($(e.item).attr("type") === 'sysexport'){//系统导出
                                commonModel.downloadOpt(function () {
                                    window.open(GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/data/export/sysCommon','_blank');
                                },function () {
                                    commonModel.downLoadWindow('/data/export/sysHigh',{

                                    });
                                });
                            } else if($(e.item).attr("type") === 'help'){
                                if(CONFIG.get("currentVersion") === 'noLeft'){
                                    window.parent.createTabs([
                                        {
                                            text:'用户手册',
                                            url:filePath.pdf + '?file=' + GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/platform/instruction',
                                        }
                                    ],{
                                        openFirst:true
                                    });
                                    window.changeIframe("calc(100% - 40px)");
                                    window.changeTab(true);
                                    window.changeBackBtn(true,false);
                                }else {
                                    let text = $(e.item).children(".k-link").text() || '用户手册';
                                    window.createPageWindow({
                                        title: text,
                                        url: filePath.pdf + '?file=' + GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/platform/instruction',
                                        width: 1130,
                                        class:'pdf-window',
                                        open:function(){
                                            $('#closePdf').show();
                                        },
                                        close: function () {
                                            $('.k-overlay').css('z-index','10002');
                                            $('#closePdf').hide();
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    };
    //一体机版本点击选择升级文件
    $("#uploadHighBtn").on('click',function () {
        if(commonModel.getStorageList().length){
            commonModel.uploadWindow(apis.upgradeFileHigh,{},{exts:['zip']},function (data) {
                $('.files-item-box').html('');
                window.uploadFileHigh = data[0];
                var str = '<div class="files-item"><i class="k-icon k-i-file"></i><div class="file-path">_filePath</div></div>';
                for(var i = 0;i < data.length;i++){
                    var item = str.replace(/_filePath/g,data[i]);
                    $(".files-item-box").append(item);
                }
            });
        }
    });
    /**
     * 关闭帮助中心页面
     * @returns {boolean}
     */
    $('#closePdf').on('click',function () {
       if(pageWindow){
           pageWindow.close();
       }
    });
    //屏蔽右键菜单
    document.oncontextmenu = function(){
        return false;
    };
    $(".index-tab-box").on("mousedown",function (e) {
        if(e.which == 3){
            $(document).off('click',clickFuc);
            var event = e || window.event;
            $(".pointer-menu").css({top:event.pageY,left:event.pageX}).show();
            $(document).on('click',clickFuc);
        }
    });
    let clickFuc = function () {
        $(".pointer-menu").hide();
        $(document).off('click',clickFuc);
    };

    var getLicenseDate = function () {
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/license/authDate',
            async:false,
            success:function (res) {
                if(res.result === true){
                    var data = res.data;
                    var item = '<div class="authDate"> <span class="name-text">_name：</span> <span>_value</span> </div>'.replace(/_name/g,"授权有效期").replace(/_value/g,data);
                    console.log(item);
                    $("#versionWindow").append(item);
                }
            }
        });
    };

    //获取软件版本，中间件，build信息
    var getSystemVersion = function () {
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.getSystemVersion,
            async:false,
            success:function (res) {
                if(res.result === true){
                    var data = res.data;
                    for(let i of data){
                        if(!!i){
                            var item = '<div class="version-text"><span>_value</span> </div>'.replace(/_value/g,i);
                            console.log(item);
                            $(".version-info-box").append(item);
                        }
                       
                    }  
                }
            }
        });
    };

    var getVersion = function () {
        $.ajax({
            type:'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.version,
            async:false,
            success:function (res) {
                if(res.result === true){
                    var data = res.data;
                   // $(".version-info-box").html("");
                    for(var i = 0;i< data.length;i++){
                        if(data[i].code==="version"){
                            CONFIG.set('version',data[i].value);
                        }
                        // var item = '<div class="version-text"> <span class="name-text">_name：</span> <span>_value</span> </div>'.replace(/_name/g,data[i].name).replace(/_value/g,data[i].value);
                        // console.log(item);
                        // $(".version-info-box").append(item);
                    }
                    getLicenseDate();
                    getSystemVersion();
                }
            }
        });
    };
    //跳转license页面
    $('#versionWindow').on('click','#licenseBtn',function () {
      window.openNewTab({
        text: '授权管理',
        url:filePath.license,
        params:{},
        tabId:'授权管理',
        pageTitle: '授权管理'
      });
      versionWindow.close();
    });

    $("#gotoAction").on("click",function () {
        let role = commonModel.userInformation.roles.join('');
       if(role.indexOf('1') > -1){ //管理员
            window.openNewTab({
                text: '用户管理',
                url:filePath.user,
                params:{},
                tabId: '用户管理'
            });
        }else if(role.indexOf('3') > -1){//审计员
            window.openNewTab({
                text: '日志管理',
                url:filePath.logs,
                params:{},
                tabId: '日志管理'
            });
        }
    });


    //返回计划菜单
    $('.back-menu').on('click',function () {
        if(window.backToTask){
            pageHeaderData = kendo.observable({
                firstLevelName: '', // 第一级菜单名称 ：快速评估、任务管理 等
                projectName: '', // 项目名称
                showProject: false, // 是否展示项目信息
                showRegion: false,
                otherInfo: '', // 其他信息
            });
            kendo.bind($('.basic-info-box'), pageHeaderData);
            window.backToTask = false;
            $(`div[data-menuurl='${filePath.projectsManagement}']`).click();
        }else{
            pageHeaderData = kendo.observable({
                firstLevelName: '', // 第一级菜单名称 ：快速评估、任务管理 等
                projectName: '', // 项目名称
                showProject: false, // 是否展示项目信息
                showRegion: false,
                otherInfo: '', // 其他信息
            });
            kendo.bind($('.basic-info-box'), pageHeaderData);
            $('.background-box').removeAttr('style');
            $('.index-content').hide();
            $('.operator-block').show();
        }
    });

    //菜单标签增加tooltip
    var addMenuTooltip = function(){
        var list = $("#index-panel .k-link");
        for(var i = 0; i < list.length; i ++){
            list.eq(i).attr("title",list.eq(i).text());
        }
    };

    //伸缩菜单
    $('#panelBtn').on('click',function () {
        $('.panel-block').toggleClass('collaps');
        $('.index-tab-box').toggleClass('expanded');
        $('.empty-box').toggleClass('expanded');
    });

    /**
     * toastr
     */
    var toastrDom = $("#notification");
    var toastr = toastrDom.kendoNotification({
        show:function(e){
            let panelWidth = $(window.top.document).find('.panel-block').width();
            let iframePadding = parseInt($(window.top.document).find('.index-tab-box').css('padding-left'));
            if (e.sender.getNotifications().length == 1) {
                var element = e.element.parent(),
                    eWidth = element.width(),
                    eHeight = element.height(),
                    wWidth = $(window).width(),
                    wHeight = $(window).height(),
                    newTop, newLeft;
                if(window == window.top){
                    newLeft = Math.floor(wWidth / 2 - eWidth / 2);
                }else{
                    newLeft = Math.floor(wWidth / 2 - eWidth / 2 - (panelWidth + iframePadding)/2);
                }

                newTop = Math.floor(wHeight / 2 - eHeight / 2 - 40);

                e.element.parent().css({top: newTop, left: newLeft});
            }
        },
        position:{
            top:'65px'
        },
    }).data("kendoNotification");
    window.showToastr = function(msg, type){
        toastr.show(msg, type);
    };





    getCurrentUser();
    //configureCloseTab();
    // getLeftMenu();
    getHeadMenu();
    getVersion();

    commonModel.checkBattery(function (data) {
        if(data){
            CONFIG.set('showBattery',true);
            var socket=new SockJS(`/wsstone`);
            var stompClient = Stomp.over(socket);
            stompClient.connect(
                {},
                function connectCallback (frame) {
                    // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
                    console.log(`已连接【${frame}】`);
                    stompClient.subscribe('/topic/battery', function (response) {
                        var battery = JSON.parse(response.body);
                        CONFIG.set('progress',battery.percent);
                        CONFIG.set('batteryInfo','剩余电量'+battery.percent);
                        if(battery.status == 'Charging'){
                            $(".battery-progress").addClass('charge');
                        }else{
                            $(".battery-progress").removeClass('charge');
                        }
                    });
                },
                function errorCallBack (error) {
                    // 连接失败时（服务器响应 ERROR 帧）的回调方法
                    console.log(`连接失败【${error}】`);
                }
            );
        }
    });
    $(document).ready(function(){
        commonModel.disableTextHistory();
        commonModel.getBasicInfo();
    });


