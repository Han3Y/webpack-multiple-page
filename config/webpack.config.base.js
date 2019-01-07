/**
 * Created by hjc on 2017/10/16.
 */
const path = require("path");
// 引入 webpack
const webpack = require("webpack");
// 引入插件
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 清理 dist 文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin")
// 抽取 css
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// 引用资源
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
// 复制目录
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 引入多页面文件列表
const config = require("./config");
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {
    //vendor:['jquery','react']
};

// 生成多页面的集合
config.HTMLDirs.forEach((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: path.resolve(__dirname, `../dist/html/${page.name}.html`),
        template: path.resolve(__dirname, `../app/html/${page.dir}${page.name}.html`),
        chunks: ['commons',page.name],
        chunksSortMode: "manual",
        minify:{  //压缩HTML文件
            removeComments:true,  //移除HTML中的注释
            collapseWhitespace:false  //删除空白符与换行符
        }

    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page.name] = [
        path.resolve(__dirname, '../app/js/config.js'),
        path.resolve(__dirname, `../app/js/${page.dir}${page.name}.js`)];
})

module.exports = {
    entry:Entries,
    devtool:"cheap-module-source-map",
    output:{
        filename:"js/[name].bundle.[hash].js",
        path:path.resolve(__dirname,"../dist"),
    },
    // 加载器
    module:{
        rules:[
            {
                // 对 css 后缀名进行处理
                test:/\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /node_modules/,
                // 抽取 css 文件到单独的文件夹
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    // 设置 css 的 publicPath
                    publicPath: config.cssPublicPath,
                    use: [
                        {
                            loader:"css-loader",
                            options:{
                                // 开启 css 压缩
                                minimize:true,
                            }
                        },
                        {
                            loader:"postcss-loader",
                        }
                    ]
                })
            },
            {
                test: /\.less$/,
                use:ExtractTextPlugin.extract({
                    use:[{
                        loader:'css-loader'
                    },{
                        loader:'less-loader'
                    }],
                    fallback:'style-loader',
                    publicPath: config.cssPublicPath,
                })
            },
            {
                test: /\.js$/,
                exclude:/node_modules|lib/ ,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:{
                    loader:"file-loader",
                    options:{
                        // 打包生成图片的名字
                        name:"[name].[ext]",
                        // 图片的生成路径
                        outputPath:config.imgOutputPath
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,//未测试使用
                use:["file-loader"]
            }
        ],
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
    plugins:[
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(["dist"],{
            root: path.resolve(__dirname, "../"),
            verbose: true,
            dry: false
        }),
        // 将 css 抽取到某个文件夹
        new ExtractTextPlugin(config.cssOutputPath),
        //复制目录
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../app/lib/pdf"),
            to:path.resolve(__dirname, "../dist/pdf"),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../app/lib/css/fonts"),
            to:path.resolve(__dirname, "../dist/css/fonts"),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../app/lib/css/Bootstrap"),
            to:path.resolve(__dirname, "../dist/css/Bootstrap"),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../app/lib/js"),
            to:path.resolve(__dirname, "../dist/lib/js"),
        }]),
        // 自动生成 HTML 插件
        ...HTMLPlugins,
        //自动添加资源
        //new AddAssetHtmlPlugin([
        //    {filepath:path.resolve(__dirname, "../app/lib/js/jquery.min.js")},
        //    {filepath:path.resolve(__dirname, "../app/lib/js/kendo.all.min.js")},
        //    {filepath:path.resolve(__dirname, "../app/lib/js/kendo.messages.zh-CN.min.js")},
        //    {filepath:path.resolve(__dirname, "../app/lib/js/kendo.culture.zh-CN.min.js")},
        //])
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                'lib/js/jquery.min.js',
                'lib/js/kendo.all.min.js',
                'lib/js/kendo.messages.zh-CN.min.js',
                'lib/js/kendo.culture.zh-CN.min.js',
            ],
            append: false
        }),
        new HtmlWebpackIncludeAssetsPlugin({//从数据库获取颜色文件
            assets: [{path:'/nologin/getImageConfig?key=colorConfig',type:'css'}],
            append: true,
            publicPath: ''
        })

    ],
}
