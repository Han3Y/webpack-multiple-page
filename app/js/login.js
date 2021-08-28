
import {commonModel,GENERAL_CONFIG,TOASTR} from "./modules/common";
import {filePath} from './modules/filePath';
import {apis} from './modules/api';
import '../less/login.less';
$(document).ready(function(){
    var validator = $(".login-content").kendoValidator().data("kendoValidator");
    var login = function () {
        if(validator.validate()){
            $.ajax({
                type:'POST',
                cache:false,
                url:GENERAL_CONFIG.BASE_URL +  apis.login,
                data:{
                    userName:loginDate.userName,
                    password:hex_md5('@12AQh#909' + hex_md5(loginDate.passWord)),
                    csrfHash:'csrfHash'
                },
                success:function (res) {
                    if (res.result == true) {
                        window.location.href = filePath.index;
                    } else {
                        loginDate.set('errMsg',res.msg);
                        $('.login-err').show();
                    }

                }

            });
        }
    };
    $("form").on("submit",function (e) {
        e.preventDefault();
      checkLicense(login);
    });

    var loginDate = kendo.observable({
        errMsg:'',
        userName:'',
        passWord:''
    });
    kendo.bind($('#loginForm'), loginDate);

    function getShowTip(){
        $.ajax({
            method:'get',
            url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/authconfig/startTip',
            cache:false,
            success:function (res) {
                if(res.result === true){
                    if(res.data === true){
                        tipWindow.open();
                    }
                }
            },
            error:function () {

            }
        })
    }
    //开机提示
    var tipWindow = $("#tipWindow").kendoGDialog({
        title: "注意",
        modal:false,
        resizable: false,
        draggable: false,
        width: 670,
        height:130,
        okText:'确认',
        defaultButtons:'OK',
        autohide:false,
        time:5000,
        actions:[],
        visible:false,
        onOk:function () {
            if($("#tipCheck").is(':checked')){
                $.ajax({
                    type:'POST',
                    url:GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/authconfig',
                    contentType: "application/json",
                    data: JSON.stringify({
                        cfgType:'startingTip',
                        cfgValue:{
                            key:'disable',
                            value:'否'
                        }
                    }),
                    success:function (res) {
                        if(res.result === true){
                            tipWindow.close();
                        }
                    }

                });
            }else{
                tipWindow.close();
            }

        }
    }).data("kendoGDialog");
    //getShowTip();
    $('#tipConfirm').on('click',function () {
        tipWindow.close();
    });
    commonModel.disableTextHistory();


    //重启和关机
    $('.reboot').on('click',function () {
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
    });
    $('.close-system').on('click',function () {
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
    });

  //判断授权是否到期
  var checkLicense = function (callback) {
    $.ajax({
      type: 'GET',
      url: GENERAL_CONFIG.BASE_URL + GENERAL_CONFIG.API_VERSION + '/license/isOverdue',
      cache: false,
      success: function (res) {
        if (res.result === true) {
          if(res.data != true){
            TOASTR.show("授权到期，请更新授权文件",'warning');
            setTimeout(function () {
              window.location.href = filePath.license;
            },3000);
          }else{
            if(callback){
              callback();
            }
          }
        }
      }
    });
  };

    /**
     * 切换密码显示隐藏
     */
    $('#pwdView').on('change',function () {
        if($(this).is(':checked')){
            $('#pwdInput').attr('type','text');
        } else{
            $('#pwdInput').attr('type','password');
        }
    });
    /**
     * 切换name 防止记住密码
     */
    $('#pwdInput').attr('name', 'text' + Math.random());
    // $('#pwdInput').on('focus', function (){
    //    $('.psd-field .k-invalid-msg').remove();
    //    $(this).attr('name', 'text' + Math.random());
    // });

    commonModel.disableTextHistory();
});