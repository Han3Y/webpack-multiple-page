/**
 * Created by hjc on 2017/10/16.
 */
var testName =  'HJC11';
import '../less/main.less';
import '../less/indexxxx.less';
import {api} from './my_module/api.js';
const $ = require('jquery');

$('.index-box').text(testName);
$('#dataTest').on('click',function(){
    $.ajax({
        type:'GET',
        url: 'http://127.0.0.1:8033/3be9e7c2af7669730d9b/getList',
        success:function (res) {
            if(res.result === true){
                console.log('success');
            }
        }
    });
});
console.log(api.login);
