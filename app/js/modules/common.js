import {apis} from "./api";
var commonModel = {
    scanParams:{},
    userName:'',
    setUserName :function(name){
        commonModel.userName =  name
    },
    pages : [
        'topography','assetDeepAnalysis'
    ],//不用改变弹窗位置的页面
    parseUrl: function () {
        var url = window.location.href.replace(/t=(\d{8,16})/g, "");
        //var url = 'abc?t=123456789'.replace(/t=(\d{8,16})/g, "");
        var paramsObj = {};
        if (url.indexOf("?") > 0) {
            var params = decodeURIComponent(url).split("?")[1].split("&");
            for (var i = 0; i < params.length; i++) {
                paramsObj[params[i].split("=")[0]] = params[i].split("=")[1];
            }
        }
        return paramsObj;
    },
    /**
     * 确认框
     * @param o {keepModal:true}
     * @param callBack
     * @param errorCallBack
     */
    confirm: function (o, callBack, errorCallBack) {
        if ($("#confirm").length === 0) {
            $("body").append($("<div id='confirm'></div>"));
        }
        $("#confirm").kendoConfirm({
            messages: {
                okText: o.okText || "确认",
                cancel: o.cancel || "取消"
            },
            title: o.title || '提示',
            content: `<span class="confirm-text">${o.content}</span>`,
            width: 400,
            height:240,
        }).data("kendoConfirm").result.done(function () {
            if (callBack) {
                if(window.top !== window.self
                    && !commonModel.pages.includes(window.pageName)
                    && !o.keepModal
                ){
                    commonModel.modalOverlay('hide', $('.k-confirm'));
                }
                callBack(o.data);
            }
        }).fail(function () {
            if (errorCallBack) {
                errorCallBack();
            }
            if(window.top !== window.self
                && !commonModel.pages.includes(window.pageName)
                && !o.keepModal
            ) {
                commonModel.modalOverlay('hide', $('.k-confirm'));
            }
        });
        if(window.top !== window.self
            && !commonModel.pages.includes(window.pageName)
        ) {
            commonModel.modalOverlay('show', $('.k-confirm'));
        }

    },
    alert: function (o, callBack, errorCallBack) {
        var id = ('alert_' + Math.random()).replace('.', '');
        $("body").append($(`<div id='${id}'>${o.content}</div>`));
        $(`#${id}`).kendoAlert({
            messages: {
                okText: o.okText || "确认",
            },
            title: o.title || '提示',
            close: function (){
                if(callBack){
                    callBack();
                }
            },
            width: 480,
            height: 340
        });
        commonModel.modalOverlay('show', 'confirm');
    },
    prettySize: function (bytes) {
        var thresh = 1024;
        if (Math.abs(bytes) < thresh) {
            return [bytes, ' B'];
        }
        var units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return [bytes.toFixed(2), units[u]];
    },
    clocker:{       //时分秒的计时器
        clock:'',
        starttime:function(id){
            var h = 0,
            m = 0,
            s = 0;
            function settime(a){
                if(a<10)
                    a = "0"+a;
                return a;
            }

            function start(){
                var showh = settime(h);
                var showm = settime(m);
                var shows = settime(s);
                $("#"+id).text(showh+":"+showm+":"+shows);

                s++;
                if(s == 60)
                {
                    s = 0;
                    m++;
                }
                if(m == 60){
                    m = 0;
                    h++;
                }
                commonModel.clocker.clock = setTimeout(start,1000);
            }
            start();
        },
        endtime:function(){
            clearTimeout(commonModel.clocker.clock);
        }
    },
    //表格展示tooltip
    showGridTooltip:function () {
        $("tbody").kendoTooltip({
            filter: "td.tooltip-cell",
            content: function (e) {
                 var text = $(e.target).text();
                return '<div style="width: ' + text.length * 16 + 'px; max-width: 200px;text-align:center;word-wrap:break-word;white-space:pre-wrap">' + text + '</div>';
            }
        });
        //主机检查，网络设备检查
      $(".tooltip-item").kendoTooltip({
        filter: ".tooltip-box",
        content: function (e) {
          var text = $(e.target).text();
          return '<div style="width: ' + text.length * 16 + 'px; max-width: 200px;text-align:center;word-wrap:break-word;white-space:pre-wrap">' + text + '</div>';
        }
      });
    },
    //获取硬件类型
    getMachineType: function () {
        var type = '';
        $.ajax({
            type: 'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/platform/machineType',
            cache: false,
            async:false,
            success: function (res) {
                if (res.result === true) {
                    if(res.data == 'FT-P200'){
                        type = 'high';
                    }else if(res.data == 'FT-Z200'){
                        type = 'normal';
                    }
                }
            }
        });
        return type;
    },
    //获取存储介质列表
    getStorageList:function () {
        var list = [];
        $.ajax({
            type: 'GET',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/medium/list',
            cache: false,
            async:false,
            success: function (res) {
                if (res.result === true) {
                    list = res.data;
                }
            }
        });
        if(!list.length){
            TOASTR.show('请先插入存储介质','error');
        }
        return list;
    },
    //一体机下载弹窗
    downLoadWindow:function (url,params) {
        var list = commonModel.getStorageList();
        if(!list.length){
            return false;
        }
        $("body").append("<div id='downLoadWindow'></div>");
        var pic = {
            usb:require('../../img/usb.png'),
            cd:require('../../img/cd.png')
        };
        var str = '<div class="up-box"><label for="_radioId"><input id="_radioId" type="radio" name="storage" value="_id" _checked data-mediumType="_mediumType"><div class="label-box"><img src="_img"><div class="item-progress"><span style="width: _width"></span></div><div class="item-size">_usedSize/_totalSize</div><div class="item-name">_name</div></div></label></div>';
        for(var i = 0;i < list.length;i++){
            var item = str.replace(/_id/g,list[i].mediumKey);
            if(i == 0){
                item = item.replace(/_checked/g,'checked');
            }else{
                item = item.replace(/_checked/g,'');
            }
            //item = item.replace(/_img/g,list[i].mediumType.toLowerCase());
            item = item.replace(/_img/g,pic[list[i].mediumType.toLowerCase()]);
            item = item.replace(/_mediumType/g,list[i].mediumType);
            item = item.replace(/_radioId/g,list[i].mediumKey + i);
            item = item.replace(/_usedSize/g,list[i].usedStr);
            item = item.replace(/_totalSize/g,list[i].capacityStr);
            item = item.replace(/_name/g,list[i].name);
            item = item.replace(/_width/g,list[i].usePercent*100 + '%');
            $("#downLoadWindow").append(item);
        }
        var downLoadWindow = $("#downLoadWindow").kendoGDialog({
            modal:true,
            title:'选择存储介质',
            resizable: false,
            draggable: false,
            width:UI_CONFIG.middleWidth,
            height:300,
            visible:false,
            close:function () {
                downLoadWindow.destroy();
                commonModel.modalOverlay('hide',$('.userDefine-window:visible'));
            },
            onOk:function () {
                var mediumKey = $("#downLoadWindow input[name='storage']:checked").val();
                if(!mediumKey){
                    TOASTR.show("请选择存储介质","error");
                    return false;
                }
                params.mediumKey = mediumKey;
                params.mediumType = $("#downLoadWindow input[name='storage']:checked").data('mediumtype');
                kendo.ui.progress($("body"), true);
                $.ajax({
                    type:'POST',
                    url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + url,
                    data:JSON.stringify(params),
                    dataType:'json',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    success:function (res) {
                        if(res.result === true){
                            var taskInterval = setInterval(function () {
                                $.ajax({
                                    type: 'GET',
                                    url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/medium/task/' + res.data,
                                    cache: false,
                                    success: function (res) {
                                        if (res.result === true) {
                                            if(res.data.progress == 100){
                                                clearInterval(taskInterval);
                                                kendo.ui.progress($("body"), false);
                                                TOASTR.show("操作成功","success");
                                                downLoadWindow.close();
                                            }
                                        }else{
                                            clearInterval(taskInterval);
                                            kendo.ui.progress($("body"), false);
                                        }
                                    },
                                    error:function () {
                                        clearInterval(taskInterval);
                                        kendo.ui.progress($("body"), false);
                                    }
                                });
                            },1000);
                        }
                    },
                    error:function () {
                        kendo.ui.progress($("body"), false);
                    }
                });
            }
        }).data("kendoGDialog");
        downLoadWindow.open();
    },
    //一体机上传窗口
    uploadWindow:function (url,params,options,callBack) {//options包含是否多选multiple，文件格式exts，是否不立即上传straight,是否需要查询进度progress，查询进度urlprogressUrl,keepModal保留遮罩
        var mediumList = commonModel.getStorageList();
        if(!mediumList.length){
            return false;
        }
        //根据设备id获取里面的文件列表
        var getFiles = function (exts,mediumKey,mediumType,multiple) {
            $.ajax({
                type:'GET',
                url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/medium/files',
                data:{
                    exts:exts?exts.join(';'):'',
                    mediumKey:mediumKey,
                    mediumType:mediumType
                },
                //async:false,
                success:function (res) {
                    kendo.ui.progress($("#FileListWindow"), false);
                    if(res.result === true){
                        var str = '';
                        var child = '';
                        var list = res.data;
                        if(!multiple){
                            str = '<div class="file-item" title="_name"><label for="_radioId"><input id="_radioId" type="radio" name="file" value="_id"><div class="label-box"><i class="k-icon k-i-file"></i><div class="item-name">_name</div></div></label></div>';
                        }else{
                            str = '<div class="file-item" title="_name"><label for="_radioId"><input id="_radioId" type="checkbox" name="file" value="_id"><div class="label-box"><i class="k-icon k-i-file"></i><div class="item-name">_name</div></div></label></div>';
                        }
                        $(".file-box").html('');
                        for(var i = 0;i < list.length;i++){
                            var item = str.replace(/_id/g,list[i].filePath);
                            item = item.replace(/_radioId/g,list[i].filePath + i);
                            item = item.replace(/_name/g,list[i].name);
                            child = child + item;
                        }
                        $(".file-box").append(child);
                    }
                },
                error:function () {
                    kendo.ui.progress($("#FileListWindow"), false);
                }
            });
        };
        var pic = {
            usb:require('../../img/usb.png'),
            cd:require('../../img/cd.png')
        };
        $("body").append("<div id='FileListWindow'><ul class='storage-list'></ul><div class='file-box'></div></div>");
        var child = '';
        var str = '<li title="_name"><label for="_radioId"><input id="_radioId" type="radio" name="storage" class="storage" value="_id" _checked data-mediumType="_mediumType"><span class="label-item"><img src="_img"><span class="storage-name">_name</span></span></label></li>';
        for(var i = 0;i < mediumList.length;i++){
            var item = str.replace(/_id/g,mediumList[i].mediumKey);
            if(i == 0){
                item = item.replace(/_checked/g,'checked');
            }else{
                item = item.replace(/_checked/g,'');
            }
            item = item.replace(/_radioId/g,mediumList[i].mediumKey + i);
            item = item.replace(/_img/g,pic[mediumList[i].mediumType.toLowerCase()]);
            item = item.replace(/_mediumType/g,mediumList[i].mediumType);
            item = item.replace(/_name/g,mediumList[i].name);
            child = child + item;
        }
        $(".storage-list").append(child);
        $('.storage').on('click',function () {
            getFiles(options.exts,$(this).val(),$(this).data('mediumType'),options.multiple);
        });
        getFiles(options.exts,mediumList[0].mediumKey,mediumList[0].mediumType,options.multiple);//获取第一个设备里的文件
        var FileListWindow = $("#FileListWindow").kendoGDialog({
            modal:true,
            title:'选择文件',
            resizable: false,
            draggable: false,
            width:UI_CONFIG.longWidth,
            height:400,
            visible:false,
            close:function () {
                FileListWindow.destroy();
                if(!options.keepModal){
                    commonModel.modalOverlay('hide',$('.userDefine-window:visible'));
                }
            },
            onOk:function () {
                var file = [];
                if(options && options.multiple){
                    $.each($('#FileListWindow input:checkbox'),function () {
                        if(this.checked){
                            file.push($(this).val());
                        }
                    });
                }else{
                    if($("#FileListWindow input[name='file']:checked").length){
                      file.push($("#FileListWindow input[name='file']:checked").val());
                    }
                }
                console.log(file);
                if(!file.length){
                    TOASTR.show('请选择文件','error');
                }else if(options && options.straight == 'no'){ //判断是否不立即上传
                    if(callBack){
                        callBack(file);   //返回选中的文件
                        FileListWindow.close();
                    }
                }else{
                    kendo.ui.progress($("body"), true);
                    params.paths = file;
                    $.ajax({
                        type:'POST',
                        url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + url,
                        data:JSON.stringify(params),
                        dataType:'json',
                        headers:{
                            "Content-Type":"application/json"
                        },
                        success:function (res) {
                            if(options.progress){
                                if(res.result === true){
                                    var interval = setInterval(function () {
                                        $.ajax({
                                            type: 'GET',
                                            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + options.progressUrl + res.data,
                                            cache: false,
                                            success: function (res) {
                                                if (res.result === true) {
                                                    if(res.data.progress == 100){
                                                        clearInterval(interval);
                                                        kendo.ui.progress($("body"), false);
                                                        FileListWindow.close();
                                                        if(callBack){
                                                            callBack();
                                                        }
                                                    }
                                                }else{
                                                    clearInterval(interval);
                                                    kendo.ui.progress($("body"), false);
                                                }
                                            }
                                        });
                                    },1000);
                                }else{
                                    kendo.ui.progress($("body"), false);
                                }
                            }else{
                                kendo.ui.progress($("body"), false);
                                if(res.result === true){
                                    FileListWindow.close();
                                    if(callBack){
                                        callBack(file);
                                    }
                                }
                            }
                        },
                        error:function () {
                            kendo.ui.progress($("body"), false);
                        }
                    });
                }
            }
        }).data("kendoGDialog");
        FileListWindow.open();
    },
    //上传操作
    uploadOpt:function (normal,high) {
        if(commonModel.getMachineType() == 'normal'){
            normal();
        }else{
            if(commonModel.getStorageList().length){
                high();
            }else{

            }
        }
    },
    //下载操作
    downloadOpt : function (normal,high) {
        if(commonModel.getMachineType() == 'normal'){
            normal();
        }else{
            if(commonModel.getStorageList().length){
                high();
            }else{

            }
        }
    },


    sleep:function (time) {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve();
            },time)
        });
    },
    //禁止浏览器记录文本框内容
    disableTextHistory:function() {
        try{
            var input1 = document.querySelectorAll('input[type=text]');
            var input = document.querySelectorAll('input.k-textbox');
            input.forEach(function (item) {
                item.setAttribute("autocomplete", "off");
            });
            input1.forEach(function (item) {
                item.setAttribute("autocomplete", "off");
            });
        }catch (e) {

        }
    },
    imgShow:function(src){
        var topWin = window.parent;
        var overlayer = $(topWin.document.body).find('#imgOverLayer');
        if(!overlayer.length){
            overlayer = $("<div class='imgOverLayer' id='imgOverLayer'></div>")
                .css({"z-index":90000,position:"fixed",top:0,left:0,background:"rgba(0,0,0,0.2)",width:"100%",height:"100%"});
            $(topWin.document.body).append(overlayer);
        }



        var imgPromise = addPromise(src);
        imgPromise.then((imageSize)=>{
            var tmpl = `<div class="innerDiv" style="position:absolute"><img id="imgBig" class="imgBig"  style="border:5px solid #fff;" src=${src}/></div>`;
            overlayer.append(tmpl);
            var windowW = $(topWin).width();
            var windowH = $(topWin).height();
            var realWidth = imageSize[0];
            var realHeight = imageSize[1];
            var imgWidth, imgHeight;
            var scale = 0.6;//缩放比例，可调整
            if(realHeight>windowH*scale) {   //根据窗口比例，图片比例来来调整图片显示的高度和宽度
                imgHeight = windowH*scale;
                imgWidth = imgHeight/realHeight*realWidth;
                if(imgWidth>windowW*scale) {
                    imgWidth = windowW*scale;
                }
            } else if(realWidth>windowW*scale) {
                imgWidth = windowW*scale;
                imgHeight = imgWidth/realWidth*realHeight;
            } else {
                imgWidth = realWidth;
                imgHeight = realHeight;
            }
            var innerDiv = overlayer.find(".innerDiv");
            var imgBig = overlayer.find(".imgBig");
            imgBig.css("width",imgWidth);
            var w = (windowW-imgWidth)/2;
            var h = (windowH-imgHeight)/2;
            innerDiv.css({"top":h, "left":w});
            overlayer.fadeIn("fast");

            overlayer.click(function(){
                $(this).fadeOut("fast");
                $(this).empty();
            });
        });


        function addPromise(src){
            return new Promise(function(resolve,reject){
                let img = new Image();
                img.src = src;
                if(img.complete){ //先判断是否有缓存
                    resolve([img.width,img.height]);
                }else{
                    img.onload = ()=>{  //加载完执行
                        resolve([img.width,img.height]);
                    }
                }

            })
        }
    },
    videoPlay:function(src){
        var player = null;
        var topWin = window;
        var overlayer = $(topWin.document.body).find('#imgOverLayer');
        if(!overlayer.length){
            overlayer = $("<div class='imgOverLayer' id='imgOverLayer'></div>")
                .css({"z-index":90000,position:"fixed",top:0,left:0,background:"rgba(0,0,0,0.2)",width:"100%",height:"100%"});
            $(topWin.document.body).append(overlayer);
        }

        var videoContainer = `<video id="livestream" class="video-js vjs-default-skin vjs-big-play-centered"  preload="auto" width="480" height="270" data-setup='{"techorder" : ["flash","html5] }'>"
            <source type="rtmp/flv" src="rtmp://ns8.indexforce.com/home/mystream">
           </video>`;
        overlayer.append(videoContainer);
        player = videojs('livestream');
        videojs('livestream', {
            autoplay: true,
            preload: 'auto'
        }, function () {
            player.src(src);
            player.load(src);
            player.play();

            this.on('ended', function() {
                videojs.log('Awww...over so soon?!');
            });
        });
        videojs.options.flash.swf = "video-js.swf"

    },
    compare:function (propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            if (value2 > value1) {
                return -1;
            } else if (value2 < value1) {
                return 1;
            } else {
                return 0;
            }
        }
    },
  /**
   * 记录日志
   * refId #操作对象id
   * refName #操作对象名称
   * moduleType #对应后端功能模块枚举
   * logLevelType # INFO,WARN
   * titleName # 操作行为
   * resultName # 操作结果
   * @param params
   * @param callback
   */
      addLog:function (params,callback) {
        $.ajax({
          type:'POST',
          url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/operateLog/save',
          data:JSON.stringify(params),
          dataType:'json',
          headers:{
            "Content-Type":"application/json"
          },
          success:function (res) {
            if(res.result === true){
              if(callback){
                callback();
              }
            }
          }
        });
      },
  /**
   * 从后端获取摄像头和麦克风设备硬件名称信息
   */
  getMediaLabel :  function () {
    let info = {
      videoLabel:'',
      audioLabel:''
    };
    $.ajax({
      type:'GET',
      url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + apis.getMediaLabel,
      async:false,
      success:function (res) {
        if(res.result === true){
          info.videoLabel = res.data.videoId;//046d:0825
          info.audioLabel = res.data.audioId;//0x46d:0x825
        }
      }
    });
    return info;
  },
  
  getDevices : async function (labelInfo) {
      await commonModel.sleep(5000);
    let constraints = {
      video:{},
      audio:{}
    };
    let deviceInfos;
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("不支持视频和音频设备.");
        return;
      }
    deviceInfos = await navigator.mediaDevices.enumerateDevices();
    console.log(deviceInfos);
    // 遍历所有的设备，包括视频和音频设备。 找出 RGB相机设备
    function gotDevices(deviceInfos) {
      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'videoinput') {
          if (deviceInfo.label.search(labelInfo.videoLabel) !== -1) {
            constraints.video = {
              deviceId: deviceInfo.deviceId
            };
          }
        }
        if (deviceInfo.kind === 'audioinput') {
          if (deviceInfo.label.search(labelInfo.audioLabel) !== -1) {
            constraints.audio = {
              deviceId: deviceInfo.deviceId
            };
          }
        }
      }
    }
    if(deviceInfos && deviceInfos.length){
      gotDevices(deviceInfos);
    }else{
      TOASTR.show('连接异常，请检查摄像头连接状态。','error');
    }

    return new Promise((resolve, reject) => {
        resolve(constraints);
    
    });
  },
  /**
   * 关闭摄像头输入流
   */
  closeStream : function (mediaStreamTrack) {
    if (typeof mediaStreamTrack.stop === 'function') {
      mediaStreamTrack.stop();
    }
    else {
      let trackList = [mediaStreamTrack.getAudioTracks(), mediaStreamTrack.getVideoTracks()];
      for (let i = 0; i < trackList.length; i++) {
        let tracks = trackList[i];
        if (tracks && tracks.length > 0) {
          for (let j = 0; j < tracks.length; j++) {
            let track = tracks[j];
            if (typeof track.stop === 'function') {
              track.stop();
            }
          }
        }
      }
    }
  },
  //表单校验去掉输入框红边框
  cancelValidate:function () {
    $('input').removeClass('k-invalid');
    $('textarea').removeClass('k-invalid');
  },
  /**
   * 主机设备检查,网络设备检查 获取指定列表的内容
   */
  getOtherInfoItem: function(id,tableName){
    var data;
    $.ajax({
      type:'GET',
      url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/baseline/getList',
      data:{
        id:id,
        tableNameEn:tableName
      },
      async:false,
      dataType:'json',
      headers:{
        "Content-Type":"application/json"
      },
      success:function (res) {
        if(res.result == true){
          data = res.data;
        }
      }
    });
    return data;
  },
  /**
   * 主机设备检查,网络设备检查  批量保存信息
   *
   */
  saveInfo:function(data,callback){
    kendo.ui.progress($("body"), true);
    $.ajax({
      type:'PUT',
      url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/baseline/batchEdit',
      data:JSON.stringify({
        dtos:data
      }),
      dataType:'json',
      headers:{
        "Content-Type":"application/json"
      },
      success:function (res) {
        if(res.result == true){
          TOASTR.show("保存成功","success");
          if(callback){
            callback();
          }
        }
      },
      complete:function () {
        kendo.ui.progress($("body"), false);
      }
    });
  },
  /**
   * 防抖
   */
   debounce:function(fn,wait){
      var timer = null;
      return function(){
        if(timer !== null){
          clearTimeout(timer);
        }
        timer = setTimeout(fn,wait);
      }
   },
    /**
     * 弹窗遮罩
      */
    modalOverlay:function(mode,ele, animate){  //mode:  show hide     ele:$ele,: $('#warnningNotice')  $('.userDefine-window:visible')  $('.k-confirm')
        var dom = $('<div class="k-overlay"></div>');
        var w = window.self;
        var isTop = false;

        var resetCss = function(type){

            let len;
            if(ele === $('#warnningNotice')){

                return;
            }else{
                len = ele.length;
                ele = $(ele[len-1]);
                let top = parseInt(ele.css('top'));
                let left = parseInt(ele.css('left'));
                let w = ele.width();
                let h = ele.height();
                ele.css('top',((top-80) > 0)?(top - 80):0);  //用userDefine-window获取弹出dom,可能会有问题，如果同一个iframe有2个window就不可以了,
                if($(window.top.document).find(".panel-box").is(':visible')){//只在左侧菜单显示时才往左调整
                    let panelWidth = $(window.top.document).find('.panel-block').width();
                    let iframePadding = parseInt($(window.top.document).find('.index-tab-box').css('padding-left'));
                    ele.css('left',left-(panelWidth + iframePadding)/2);
                }
            }

        }

        var hideOverlay = ()=>{
            var $layer= $(w.document.body).find('.k-overlay');
            let len = ele.length;
            if(len>1){
                //$layer.css({'zIndex':ele.css('zIndex')-2,diplay:'block',opacity:.5});
            }else{
                $layer.hide();
            }
        }

        if(w == window.top){
            return;
        }else{
            if(mode === 'show'){
                $(window.top.document.body).find('.k-overlay').remove();
                $(window.top.document.body).append(dom);
                if(animate){
                    $(window.top.document.body).find('.k-overlay').animate({opacity: 0.5}, 350);
                }else{
                    $(window.top.document.body).find('.k-overlay').css({opacity: 0.5});

                }
            }else{
                if(animate){
                    $(window.top.document.body).find('.k-overlay').animate({opacity: 0}, 230,function () {
                        $(this).hide();
                    });
                }else{
                    $(window.top.document.body).find('.k-overlay').hide();
                }

            }

        }
        // while(w!== window.top || (isTop)){
        //     var  $layer= $(w.document.body).find('.k-overlay');
        //     if(mode === 'show' && $layer.length){
        //         $layer.css({'zIndex':2,'opacity':0.5,display:'block'});
        //
        //     }else if(mode === 'show' && !($layer.length)){
        //         $(w.document.body).append(dom.clone());
        //     }else{
        //         hideOverlay();
        //     }
        //     if(isTop){
        //         isTop = false;
        //     }else{
        //         (w = w.parent) && (w=== window.top) && (isTop= true);
        //     }
        // }

        if(mode==='show'){
            resetCss();
        }
    },

};

//app
var GENERAL_CONFIG = {
    'BASE_URL': '',
    'API_VERSION': '/api/v1'
};

//前端分页配置
var PAGE_CONFIG = {
    page: 1,
    pageSize: 20,
    refresh: true,
    buttonCount: 3,
    pageSizes: [10, 20, 60, 80]
};
//窗口大小
var UI_CONFIG = {
    smallWidth: 520,
    longWidth:720,
    longerWidth:900,
    middleWidth:560
};
var toastrEle = '';
try{
    if($("#notification").length){
        toastrEle = $("#notification");
    }else{
        toastrEle = $("#notification", window.top.document);
        if(!toastrEle.length){
            $( window.top.document).append('<div id="notification"></div>');
            toastrEle = $("#notification", window.top.document);
        }
    }
}catch (e) {
    
}
var TOASTR = {
  show:window.top.showToastr
};
// var TOASTR = toastrEle.kendoNotification({
//     show:function(e){
//         let panelWidth = $(window.top.document).find('.panel-block').width();
//         let iframePadding = parseInt($(window.top.document).find('.index-tab-box').css('padding-left'));
//         if (e.sender.getNotifications().length == 1) {
//             var element = e.element.parent(),
//                 eWidth = element.width(),
//                 eHeight = element.height(),
//                 wWidth = $(window).width(),
//                 wHeight = $(window).height(),
//                 newTop, newLeft;
//             if(window == window.top){
//                 newLeft = Math.floor(wWidth / 2 - eWidth / 2);
//             }else{
//                 newLeft = Math.floor(wWidth / 2 - eWidth / 2 - (panelWidth + iframePadding)/2);
//             }
//
//             newTop = Math.floor(wHeight / 2 - eHeight / 2 - 40);
//
//             e.element.parent().css({top: newTop, left: newLeft});
//         }
//     },
//     position:{
//         top:'65px'
//     },
// }).data("kendoNotification");

setTimeout(() => {
    console.log("index:");
    console.log(commonModel.userName);
  }, 2000);

export {commonModel,GENERAL_CONFIG,PAGE_CONFIG,UI_CONFIG,TOASTR};
