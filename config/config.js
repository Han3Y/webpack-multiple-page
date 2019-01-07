/**
 * Created by hjc on 2017/10/16.
 */
const fs = require('fs');
const getFileNameList = (path,type,dir) => {
    let fileList = [];
    let dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        if (item.indexOf(type) > -1) {
            //fileList.push(item.split('.')[0]);
            fileList.push({
                name:item.split('.')[0],
                dir:dir
            })
        }
    });
    return fileList;
};
let HTMLDirs = getFileNameList('./app/html','html','');
module.exports = {
    HTMLDirs:HTMLDirs,
    cssPublicPath:"../",
    imgOutputPath:"./img/",
    cssOutputPath:"./css/[name].bundle.[hash].css",//name 是js文件的name
    devServerOutputPath:"../dist",
    devOpenPage:'dist/html/index.html',
    devPublicPath:'/dist/',
    buildPublicPath:'../'
};
