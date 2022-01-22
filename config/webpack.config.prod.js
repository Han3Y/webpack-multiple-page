/**
 * Created by hjc on 2017/10/16.
 */
// 引入基础配置
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const { merge } = require("webpack-merge");
// 引入 webpack
const webpack = require("webpack");
//
const config = require("./config");

// 合并配置文件
module.exports = merge (webpackBase,{
    devtool: false,
    output:{
        publicPath:config.buildPublicPath,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common',
            cacheGroups: {
                default:{
                    test: /\.js$/,
                }
            }
        }
    },
    plugins:[
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true)
        })
    ],
    mode: 'production'
});
