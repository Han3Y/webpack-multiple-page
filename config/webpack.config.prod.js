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
    output:{
        publicPath:config.buildPublicPath,
    },
    plugins:[
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true)
        })
    ],
    /*
        1. 可以将node_modules中代码单独打包一个chunk最终输出
        2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk

        todo//直接使用会将css共用部分打包并引入到每个文件中，导致样式错误
      */
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         name: 'common'
    //     }
    // },
    // 生产环境下会自动压缩js代码
    mode: 'production'
});
