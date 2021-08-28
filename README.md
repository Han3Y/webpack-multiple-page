##使用
npm install
开发环境在app目录下运行npm run dev命令 后端服务也需启动
生成环境在app目录下使用npm run build命令，将生成的dist目录复制到后端项目webui目录下

#配置
编译不同版本的文件 修改web-config.js文件
目前几种项目：{
   common:""
}

#调试说明
1.启动前端服务器   -->app 目录下运行npm run dev
2.启动中间件服务器
3.http://127.0.0.1:8083/dist/html/login.html    -->登录平台
4.http://127.0.0.1:8083/dist/html/home.html     -->切换至平台首页