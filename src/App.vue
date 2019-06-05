<keep-alive>
  <router-view :seller="seller"></router-view>
</keep-alive>
<template>
  <div id="wrapper">
   <!-- 用v-bind绑定seller属性，传给子组件seller数据 指令的职责是当表达式的值改变时，响应式地作用于 DOM上。  v-bind 指令被用来响应地更新 HTML 属性-->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!--使用router-link标签来导航，默认被渲染成一个a标签，通过传入to属性指定链接；-->
        <!--<router-link> 是一个组件，该组件用于设置一个导航链接，切换不同 HTML 内容。 to 属性为目标地址， 即要显示的内容。-->
        <!--当 <router-link> 对应的路由匹配成功，将自动设置 class 属性值 .router-link-active-->
         <router-link to="/goods">商品</router-link>
        </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 将组件 (components) 映射到路由 (routes)-->
    <!--路由外链 单页面切换的内容页 路由匹配到的组件将渲染在这里-->
    <!--App.vue主组件传seller对象给每个路由：
    问题：切换界面时会闪现
    原因：界面被重新渲染了，生命周期函数被重新执行了一遍
    优化：切换组件的时候，组件之前的状态也能被保留
    解决：vue中提供 vue-router切换组件保留的功能内置组件<keepalive>，在App.vue中更改为
    将组件内存缓存到本地
    -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  // 一个vue实例被生成后还要绑定到某个html元素上，之后还要进行编译，然后再插入到document中。每一个阶段都会有一个钩子函数，方便开发者在不同阶段处理不同逻辑。
  // 每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如，实例需要配置数据观测(data observer)、编译模版、挂载实例到 DOM ，然后在数据变化时更新 DOM 。
  // 在这个过程中，实例也会调用一些 生命周期钩子 ，这就给我们提供了执行自定义逻辑的机会。例如，created 这个钩子在实例被创建之后被调用：钩子的 this 指向调用它的 Vue 实例
  import header from './components/header/header.vue' // import（导入）用于在一个模块中加载另一个含有export接口的模块。
  import {urlParse} from './common/js/util.js'
  const ERR_OK = 0 // 定义常量，增强程序可读性 const声明一个只读的常量。一旦声明，常量的值就不能改变。 const一旦声明变量，就必须立即初始化，不能留到以后赋值。 const的作用域与let命令相同：只在声明所在的块级作用域内有效。
  export default { // export（导出）用于对外输出本模块（一个文件可以理解为一个模块）变量的接口
    // export default { } 一个对象——可以定义一个组件 export与export default均可用于导出常量、函数、文件、模块等 export default仅有一个
    components: { // 注册一个组件
      'v-header': header
    },
    data () { // 组件的定义只接受 function 一个组件的 data 选项必须是一个函数 因此每个实例可以维护一份被返回对象的独立的拷贝：
      return {
        seller: {
          seller: {
            id: (() => { // 本地缓存 收藏
              let queryParam = urlParse()
              //  console.log(queryParam)
              return queryParam.id
            })()
          }
        } // 维护数据 seller
      }
    },
    created: function () { // 生命周期钩子函数 在实例创建完成后被立即调用这个函数  异步请求数据，返回的是Promise对象 在created函数中调用ajax获取页面初始化所需的数据。
      // created在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
      this.$http.get('/api/seller?id=' + this.seller.id) // 使用 this.$http 命令 发送get请求， 必须安装vue-resource路由才能使用 实习数据异步加载
        .then((res) => { // 箭头函数前后必须有空格  //.then方法 请求完成后调用
          // 这里请求的是seller路由，接收的是dev-server.js下面配置好的seller的data，可以在浏览器network中查看是否请求到了seller文件资源
          res = res.body // 拿到response返回的promise对象的body(Data Object)
        if (res.errno === ERR_OK) { // errno是路由配置的请求成功参数，成功后则把数据数据返给vue实例中的seller
            this.seller = res.data // 使用 response.data 读取 JSON 数据：
            // console.log(this.seller)
            this.seller = Object.assign({}, this.seller, res.data) // 扩展对象 添加其它属性--id
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  #wrapper
    max-width: 540px;
    margin: 0 auto;
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      //border-bottom 1px solid rgba(7,17,27,0.1)
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display:block
          color: rgb(77, 85, 93)
          font-size: 14px
          &.active
            color: rgb(240, 20, 20)
</style>
