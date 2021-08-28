//
// 引用资源
const fs = require('fs');
var HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const getFileNameList = (path,type,dir) => {
  let fileList = {};
  let dirList = fs.readdirSync(path);
  dirList.forEach(item => {
    if (item.indexOf(type) > -1) {
      //fileList.push(item.split('.')[0]);
      // fileList.push({
      //     name:item.split('.')[0],
      //     dir:dir
      // })
      fileList[item.split('.')[0]] = {
        name:item.split('.')[0],
        dir:dir
      }
    }
  });
  return fileList;
};
const entrance = getFileNameList('./app/html/common','html','common/');
const assets = [

];
module.exports = {
  path:'./app/html/common',
  dir:'common/',
  assets:assets,
  entrance:entrance
};