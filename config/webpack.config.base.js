/**
 * Created by hjc on 2017/10/16.
 */
const webConfig = require('../web-config');
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 引入 webpack
const webpack = require("webpack");
// 引入插件
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 清理 dist 文件夹
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
// 引用资源
var HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
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

for(let page in config.HTMLDirs){
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: path.resolve(__dirname, `../dist/html/${config.HTMLDirs[page].name}.html`),
        template: path.resolve(__dirname, `../app/html/${config.HTMLDirs[page].dir}${config.HTMLDirs[page].name}.html`),
        chunks: ['commons',config.HTMLDirs[page].name],
        chunksSortMode: "manual",
        minify:{  //压缩HTML文件
            removeComments:true,  //移除HTML中的注释
            collapseWhitespace:false  //删除空白符与换行符
        }

    });
    HTMLPlugins.push(htmlPlugin);
    Entries[config.HTMLDirs[page].name] = [
        path.resolve(__dirname, '../app/js/config.js'),
        path.resolve(__dirname, `../app/js/${config.HTMLDirs[page].dir}${config.HTMLDirs[page].name}.js`)];
}


module.exports = {
    entry:Entries,
    devtool:"cheap-module-source-map",
    output:{
        filename:"js/[name].bundle.[contenthash].js",
        path:path.resolve(__dirname,"../dist"),
    },
    // 加载器
    module:{
        rules:[
            /*
                js兼容性处理：babel-loader @babel/core
                  1. 基本js兼容性处理 --> @babel/preset-env
                    问题：只能转换基本语法，如promise高级语法不能转换
                  2. 全部js兼容性处理 --> @babel/polyfill
                    问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
                  3. 需要做兼容性处理的就做：按需加载  --> core-js
              */
            {
                test: /\.js$/,
                exclude: /node_modules|lib/,
                use:[
                    /*
                      开启多进程打包。
                      进程启动大概为600ms，进程通信也有开销。
                      只有工作消耗时间比较长，才需要多进程打包
                    */
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 2 // 进程2个
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            // 预设：指示babel做怎么样的兼容性处理
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        // 按需加载
                                        useBuiltIns: 'usage',
                                        // 指定core-js版本
                                        corejs: {
                                            version: 3
                                        },
                                        // 指定兼容性做到哪个版本浏览器
                                        targets: {
                                            chrome: '60',
                                            firefox: '60',
                                            ie: '9',
                                            safari: '10',
                                            edge: '17'
                                        }
                                    }
                                ]
                            ],
                            // 开启babel缓存
                            // 第二次构建时，会读取之前的缓存
                            cacheDirectory: true
                        }
                    }
                ],
            },
            {
                // 匹配哪些文件
                test: /\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /node_modules|lib/,
                // 使用哪些loader进行处理
                use: [
                    // use数组中loader执行顺序：从右到左，从下到上 依次执行
                    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
                    //'style-loader',
                    // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    MiniCssExtractPlugin.loader,
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter: (url, resourcePath) => {
                                    // resourcePath - path to css file
                                    // Don't handle `img.png` urls
                                    if (url.includes('getImageConfig')) {
                                        return false;
                                    }
                                    return true;
                                }
                            },
                        }
                    },
                    /*
                        css兼容性处理：postcss --> postcss-loader postcss-preset-env

                        帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

                        "browserslist": {
                          // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
                          "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                          ],
                          // 生产环境：默认是看生产环境
                          "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                          ]
                        }
                      */
                    // 修改loader的配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: () => [
                                    // postcss的插件
                                    require('postcss-preset-env')()
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    //'style-loader',
                    // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter: (url, resourcePath) => {
                                    // resourcePath - path to css file
                                    // Don't handle `img.png` urls
                                    if (url.includes('getImageConfig')) {
                                        return false;
                                    }
                                    return true;
                                }
                            },
                        }
                    },
                    // 修改loader的配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: () => [
                                    // postcss的插件
                                    require('postcss-preset-env')()
                                ]
                            }
                        }
                    },
                    // 将less文件编译成css文件
                    // 需要下载 less-loader和less
                    'less-loader'
                ]
            },
            // {   // 使用webpack5 自带的asset 模块代替此loader
            //     // 问题：默认处理不了html中img图片
            //     // 处理图片资源
            //     test: /\.(jpg|png|gif|svg)$/,
            //     //  不使用webpack5 的 asset 模块的处理
            //     type: 'javascript/auto',
            //     use: [
            //         {
            //             // 使用一个loader
            //             // 下载 url-loader file-loader
            //             loader: 'url-loader',
            //             options: {
            //                 // 图片大小小于8kb，就会被base64处理
            //                 // 优点: 减少请求数量（减轻服务器压力）
            //                 // 缺点：图片体积会更大（文件请求速度更慢）
            //                 limit: 8 * 1024,
            //                 // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
            //                 // 解析时会出问题：[object Module]
            //                 // 解决：关闭url-loader的es6模块化，使用commonjs解析
            //                 esModule: false,
            //                 // 给图片进行重命名
            //                 // [hash:10]取图片的hash的前10位
            //                 // [ext]取文件原来扩展名
            //                 name: '[name][contenthash:10].[ext]',
            //                 // 图片的生成路径
            //                 outputPath:config.imgOutputPath,
            //                 // publicPath:'../img',
            //             }
            //         }
            //     ]
            // },
            {
                // 使用webpack5 自带的asset处理方式，替代上面的url-loader
                // 处理图片资源
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[hash][ext][query]'
                }
            },
            {
                test: /\.html$/,
                // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                loader: 'html-loader',
                options: {
                    sources: {
                        urlFilter: (attribute, value, resourcePath) => {
                            // The `attribute` argument contains a name of the HTML attribute.
                            // The `value` argument contains a value of the HTML attribute.
                            // The `resourcePath` argument contains a path to the loaded HTML file.
                            if(/nologin/.test(value)){ // 过滤不想处理的属性值
                                return false;
                            }
                            return true;
                        },
                    }
                }
            },
            {
                // 使用webpack5 自带的asset处理方式，替代 file-loader
                // 打包其他资源(除了html/js/css资源以外的资源)
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'css/[contenthash:10][ext][query]'
                }
            },
            // {
            //     test: /\.js$/,
            //     exclude:/node_modules|lib/ ,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['env'],
            //             plugins: ['transform-runtime']
            //         }
            //     }
            // },

            /*
             语法检查： eslint-loader  eslint
               注意：只检查自己写的源代码，第三方的库是不用检查的
               设置检查规则：
                 package.json中eslintConfig中设置~
                   "eslintConfig": {
                     "extends": "airbnb-base"
                   }
                 airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
            */
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules|lib/,
            //     loader: 'eslint-loader',
            //     options: {
            //         // 自动修复eslint的错误
            //         fix: true
            //     }
            // }
        ],
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
    plugins:[
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "../"),
            verbose: true,
            dry: false
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名
            filename: config.cssOutputPath
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),
        //复制目录
        new CopyWebpackPlugin({
            patterns:[{
                from: path.resolve(__dirname, "../app/lib/pdf"),
                to:path.resolve(__dirname, "../dist/lib/pdf"),
            }]
        }),
        new CopyWebpackPlugin({
            patterns:[{
                from: path.resolve(__dirname, "../app/lib/css"),
                to:path.resolve(__dirname, "../dist/lib/css"),
            }]
        }),
        new CopyWebpackPlugin({
            patterns:[{
                from: path.resolve(__dirname, "../app/lib/js"),
                to:path.resolve(__dirname, "../dist/lib/js"),
            }]
        }),
        // 自动生成 HTML 插件
        ...HTMLPlugins,
        new HtmlWebpackTagsPlugin({
            files:['html/login.html','html/index.html'],
            tags: [
                'lib/js/md5-min.js'
            ],
            append: false
        }),
        new HtmlWebpackTagsPlugin({
            files:['html/index.html'],
            tags: [
                'lib/js/sockjs.min.js',
                'lib/js/stomp.min.js'
            ],
            append: false
        }),

        new HtmlWebpackTagsPlugin({
            tags: [
                'lib/js/jquery.min.js',
                'lib/js/kendo.all.min.js',
                'lib/js/kendo.messages.zh-CN.min.js',
                'lib/js/kendo.culture.zh-CN.min.js',
                'lib/css/kendo.common.min.css',
                'lib/css/kendo.use.min.css'
            ],
            append: false
        }),
    ],
};
