/**
 * Created by hjc on 2017/10/16.
 */
const webConfig = require('../web-config');
const fs = require('fs');
const getFileNameList = (path,type,dir) => {
    let fileList = {};
    let dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        if (item.indexOf(type) > -1) {
            fileList[item.split('.')[0]] = {
                name:item.split('.')[0],
                dir:dir
            }
        }
    });
    return fileList;
};
let HTMLDirs = getFileNameList('./app/html','html','');


module.exports = {
    HTMLDirs:HTMLDirs,
    imgOutputPath:"./img/",
    cssOutputPath:"./css/[name].bundle.[hash:8].css",//name 是js文件的name
    devProxy:webConfig.devProxy,
    buildPublicPath:'../'
};
