
## 大概设计思路
订单-运单-车辆：
下单可以支持一单多票，即同一发送地址到多个目的地，下单成功后会根据目的地行程多个订单（CustomOrder），多个CustomerOrder关联一条相同的支付信息Payment，即可以进行合并支付，Payment支付成功各个CustomerOrder进入代配送状态。Payment取消则各个CustomerOrder均取消。

订单创建成功同时会生成一条运单信息DeliveryOrder，实际关联了配送车辆、司机等信息，对于运单可以货物重量大小进行进一步拆分，对于干路运输后续可以增加按段进行拆分。

关联关系是 Payment一对多关联CustomerOrder， CustomerOrder一对多关联DeliveryOrder（如果没有发生拆单等情况，实际上一条CustomerOrder只对应了一条DeliverOrder）

## Tips
核心的路由文件以及UI model绑定在router.js文件中实现
注册组件在routes/register中 尚未使用
地图组件在components/Map中 实现对百度地图的封装
页面框架包括面包屑、菜单栏等在componets/Layout中，Menu的数据文件在models/app.js中

运单状态的改变 要结合后端项目的Swagger来一起调整


具体实现

项目部署时，注意前后端分离，可以单独部署前后端项目，也可以将前端项目打包配置到后端的镜像资源（注意模板、路由等配置），注意路径配置于跨域访问，配置api路径访问后端项目--[配置文件](https://github.com/WaylonSong/tms/blob/master/src/utils/config.js)

接口文档：[接口文档](https://github.com/WaylonSong/tms/blob/master/%E6%96%87%E6%A1%A3%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E.txt)

## 参考项目
[![React](https://img.shields.io/badge/react-^15.6.1-brightgreen.svg?style=flat-square)](https://github.com/facebook/react)
[![Ant Design](https://img.shields.io/badge/ant--design-^2.11.2-yellowgreen.svg?style=flat-square)](https://github.com/ant-design/ant-design)
[![dva](https://img.shields.io/badge/dva-^2.0.1-orange.svg?style=flat-square)](https://github.com/dvajs/dva)

[![GitHub issues](https://img.shields.io/github/issues/zuiidea/antd-admin.svg?style=flat-square)](https://github.com/zuiidea/antd-admin)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/zuiidea/antd-admin/pulls)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

## 特性

-   基于[react](https://github.com/facebook/react)，[ant-design](https://github.com/ant-design/ant-design)，[dva](https://github.com/dvajs/dva)，[Mock](https://github.com/nuysoft/Mock) 企业级后台管理系统最佳实践。
-   基于Antd UI 设计语言，提供后台管理系统常见使用场景。
-   基于[dva](https://github.com/dvajs/dva)动态加载 Model 和路由，按需加载。
-   使用[roadhog](https://github.com/sorrycc/roadhog)本地调试和构建，其中Mock功能实现脱离后端独立开发。
-   浅度响应式设计。


## 开发构建

### 目录结构

```bash
├── /dist/           # 项目输出目录
├── /src/            # 项目源码目录
│ ├── /public/       # 公共文件，编译时copy至dist目录
│ ├── /components/   # UI组件及UI相关方法
│ │ ├── skin.less    # 全局样式
│ │ └── vars.less    # 全局样式变量
│ ├── /routes/       # 路由组件
│ │ └── app.js       # 路由入口
│ ├── /models/       # 数据模型
│ ├── /services/     # 数据接口
│ ├── /themes/       # 项目样式
│ ├── /mock/         # 数据mock
│ ├── /utils/        # 工具函数
│ │ ├── config.js    # 项目常规配置
│ │ ├── menu.js      # 菜单及面包屑配置
│ │ ├── config.js    # 项目常规配置
│ │ ├── request.js   # 异步请求函数
│ │ └── theme.js     # 项目需要在js中使用到样式变量
│ ├── route.js       # 路由配置
│ ├── index.js       # 入口文件
│ └── index.html     
├── package.json     # 项目信息
├── .eslintrc        # Eslint配置
└── .roadhogrc.js    # roadhog配置
```

文件夹命名说明:

-   components：组件（方法）为单位以文件夹保存，文件夹名组件首字母大写（如`DataTable`），方法首字母小写（如`layer`）,文件夹内主文件与文件夹同名，多文件以`index.js`导出对象（如`./src/components/Layout`）。
-   routes：页面为单位以文件夹保存，文件夹名首字母小写（特殊除外，如`UIElement`）,文件夹内主文件以`index.js`导出，多文件时可建立`components`文件夹（如`./src/routes/dashboard`），如果有子路由，依次按照路由层次建立文件夹（如`./src/routes/UIElement`）。

### 快速开始

克隆项目文件:

进入目录安装依赖:

```bash
#开始前请确保没有安装roadhog、webpack到NPM全局目录
npm i 或者 yarn install
```

开发：

```bash
npm run build:dll #第一次npm run dev时需运行此命令，使开发时编译更快
npm run dev
打开 http://localhost:8000
```


```bash
npm run build

将会打包至dist/{version}目录 #package.json里version字段

npm run build:new

将会打包至dist/{version增加1}目录 #package.json里version字段
```

代码检测：

```bash
npm run lint
```
