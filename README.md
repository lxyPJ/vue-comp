# 基于vue.js搭建的web前端应用架构

gulp webpack babel vue.js MVVM 组件化 模块化

### 背景

本文结合了我的实际项目经验，整理和总结了目前在公司项目中使用的web前端应用架构。

### 项目工程需求

- js模块化
- css模块化
- 组件化
- 性能优化：文件缓存的控制与复用、请求合并、按需加载资源
- 图片压缩
- js/css代码丑化压缩
- 编译ES6的语法或API
- 编译*.vue单文件组件
- 编译*.scss文件
- 开发过程中，监听文件变化，自动编译，自动刷新浏览器
- 手机端真机远程调试
- 反向代理解决开发过程中ajax的跨域问题

### 系统功能分层(MVVM)

> MVVM编程思路相比于传统的jquery+template面向DOM元素编程的好处在于：面向数据编程，能够简化代码，减少重复，以便投入更多的精力去写业务逻辑，同时有强制规范化的作用

- Model : 数据模型
    * services : 与服务端进行交互的数据
    * store : 应用状态数据
- View : 用户界面(响应用户操作)
- ViewModel : Model与View之间的桥梁,为Model与View提供适配，把服务端提供的数据转换为可用于展示在View的数据，并且梳理与提取相应的数据用于跟服务端进行交互

### 模块化开发体系

> * 分工产生效能，模块化开发为大型web应用项目的多人协作提供了可能。
> * 分而治之 : 不管你将来是否要复用某段代码，你都有充分的理由将其分治为一个模块。
> * 代码复用，降低维护成本。

#### 1. JS的模块化(ES6模块系统)

在ES6之前，JavaScript一直没有模块系统，这对开发大型复杂的前端工程造成了巨大的障碍。
为此，社区制定了一些模块加载方案，如CommonJS、AMD、CMD等，这些方案中要么实现得不够优雅，要嘛使用起来不是很方便。既然现在ES6已经在语言层面上规定了模块系统，使用起来也很方便，所以JS的模块管理我们选择了ES6的模块系统。

#### 2. CSS的模块化(SASS)

通过SASS预处理器来实现CSS的文件拆分及模块化

### 3. 组件化开发规范

> 组件化 != 模块化，模块化只是在语言层面上，对代码的拆分。
> 组件化是在html/css/js模块化的基础上，在设计层面上，对UI(用户界面)的拆分。

从UI拆分下来的每个包含模板HTML(View) + 样式CSS + JS(ViewModel & Model)功能完备的结构单元，我们称之为组件。

组件化除了要处理组件这种本身的封装，还要处理组件之间JS的继承与复用，CSS的继承与扩展以及HTML嵌套等关系。

因此，**组件化实际上是一种按照模板HTML(View) + 样式CSS + JS(ViewModel & Model)三位一体的形式对面向对象的进一步抽象**，也是一种分治思想。

按照组件化开发的思想，我们制定了组件化的开发规范：

1. 页面上的每个 **独立的** 可视/可交互区域视为一个组件；
2. 每个组件对应 **一个工程目录**，组件所需的html/css/js都在这个目录下就近维护；
3. 组件之间可以 **继承、扩展、嵌套和包含**
4. **页面是组件的容器**，负责组合组件形成功能完整的界面；
5. 当不需要某个组件，或者想要替换组件时，可以整个目录删除/替换。

- **单个组件的目录结构如下：**

- componentName/
   - index.vue #组件 View 的HTML模板
   - style.scss #组件 View 的css样式
   - vm.js #组件 ViewModel 的js逻辑

*其中，单个组件的Model数据一般来源于父级组件传递下来的属性*
*按照组件代码的组成，组件可以分为：HTML、HTML+CSS、JS、HTML+JS、HTML+CSS+JS*

- **界面是应用中最大的组件，类似与一个页面，但其实也是一个组件，我们规定由界面这种类型的组件来与服务端做数据交互，因此界面组件的目录结构略有不同：**

- viewName/
   - index.vue #HTML模板
   - style.scss #css样式
   - vm.js #ViewModel
   - services.js #主要用于与服务端做数据交互

### 项目目录结构规范
在模块化开发体系和组件化开发规范的基础上，项目目录规范也成型了，如下：

*src为源码文件，dist为打包生成的文件，assets为静态资源文件*

- dist
    * assets
    * html
    * css
    * js
- src
    * css
    * js
    * store_modules
    * components
    * views
    * pages
        * app
            * store
            * dev.html
            * index.html
            * index.js
            * index.scss
            * router.js
- assets

### 静态资源管理(性能优化)

1. Webpack
    - 把不同的模块及其依赖打包成符合生产环境部署的文件。
    - 提取模块之间的公共模块，解决重复引入增加代码冗余的问题。
    - 把不需要立即下载的模块分割出来，在需要的时候再单独下载，实现资源的按需加载。
**用户进入应用时，只需要加载被提取出来的公共模块资源和首页的js文件**，其他模块或者其他js文件，只有在用户去点击（调用）时，才会异步加载进来，大大减少了应用的首屏渲染时间.

2. localStorage
    - 通过ajax异步获取文件
    - 利用localStorage来实现文件缓存的控制与复用

3. 图片压缩(尽量使用字体图标)

4. 代码丑化压缩，服务端开启gzip传输 

### gulp自动化工作流程管理

*两种模式：开发模式 & 产品模式*

1. js/css代码丑化压缩
2. 编译ES6的语法或API(Babel)
3. webpack增量编译
4. 编译*.scss文件(gulp-sass & node-sass)
5. 图片压缩(gulp-imagemin)
6. 开发过程中，监听文件变化，自动编译，自动刷新浏览器(browser-sync)


    







