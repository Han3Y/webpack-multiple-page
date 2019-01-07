/**
 * Created by hjc on 2017/10/16.
 */
// 引入基础配置文件
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");
// 引入配置文件
const config = require("./config");
// 合并配置文件
module.exports = webpackMerge(webpackBase,{
    output:{
        publicPath:config.devPublicPath,
    },
    // 配置 webpack-dev-server
    devServer:{
        // 项目根目录
        contentBase:config.devServerOutputPath,
        // 错误、警告展示设置
        overlay:{
            errors:true,
            warnings:true
        },
        openPage:config.devOpenPage,
        host:'127.0.0.1',
        port:'8083',
        proxy:{
            '/nologin':'http://127.0.0.1:8081',
            '/sys': 'http://127.0.0.1:8081',
            '/api/v1': 'http://127.0.0.1:8081',
        }
    }
});
