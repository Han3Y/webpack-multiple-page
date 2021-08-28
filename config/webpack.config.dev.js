/**
 * Created by hjc on 2017/10/16.
 */
const webConfig = require('../web-config');
// 引入基础配置文件
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const { merge } = require("webpack-merge");
// 引入 webpack
const webpack = require("webpack");
const config = require("./config");
const path = require("path");

// 合并配置文件
module.exports = merge(webpackBase,{
    // entry:Entries,
    // 配置 webpack-dev-server
    devServer:{
        // 项目根目录
        contentBase:path.resolve(__dirname,"../dist"),
        // 错误、警告展示设置
        overlay:{
            errors:true,
            warnings:true
        },
        open:true,
        openPage:"html/login.html",
        host:webConfig.host,
        port:webConfig.port,
        // 不要显示启动服务器日志信息
        //clientLogLevel: 'none',
        // 除了一些基本启动信息以外，其他内容都不要显示
        //quiet: true,
        proxy:{
            '/nologin':{
                target:config.devProxy,
                timeout:600000
            },
            '/sys': {
                target:config.devProxy,
                timeout:600000
            },
            '/isapi':{
                target:config.devProxy,
                timeout:600000
            } ,
            '/api/v1':{
                target:config.devProxy,
                timeout:600000
            } ,
            '/wsstone':{
                target:config.devProxy,
                ws:true
            }
        }
    },
    plugins:[
        // ...HTMLPlugins,
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false)
        })
    ],
    mode: 'development',
});
