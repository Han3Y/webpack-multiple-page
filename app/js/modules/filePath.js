/**
 * Created by code on 2018/6/19.
 */
var filePath = {};
if(!PRODUCTION){
    filePath = {
        index: '../html/index.html',
        login: '../html/login.html',
    }
}else{
    filePath = {
        index:'/index',
        login:'/login',
    };
}
export {filePath};
