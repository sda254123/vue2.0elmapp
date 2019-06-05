<template>
    <div class="header">
      <!--
        头部主要内容
      -->
      <div class="content-wrapper">
        <div class="avatar">
          <img width="64" height="64" :src="seller.avatar" > <!--异步请求获取头像 使用seller数据图片地址，v-bind绑定src属性-->
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span> <!-- 双向数据绑定显示seller数据-->
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="support"><!--如果要获取的是 seller数据对象的  子对象数组的  某一项：因为异步获取数据，子对象可能为undefined，需要先 v-if 判断是否存在-->
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <!-- seller数据对象的  子对象数组的  某一项：因为异步获取数据，子对象可能为undefined，需要先 v-if 判断是否存在-->
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <!--
        遮罩层
      -->
      <!--@click —— 触发点击事件，执行显示函数-->
      <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <!--<img>标签: 使用seller数据图片地址，v-bind绑定src属性-->
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <!--过渡动画组件 transition 遮罩层-->
      <transition name="fade">
        <!--v-show指令 ——  控制弹出层的显示/隐藏-->
        <div v-show="detailShow" class="detail">
          <div class="detail-wrapper clearfiex">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper">
                <v-star :size="48" :score="seller.score"></v-star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li class="supports-item" v-for="(item, index) in seller.supports" :key="item.description">
                  <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                  <span class="text">{{item.description}}</span>
                </li>
              </ul>
              <!--flex布局：-->
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideDetail">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import Star from '@/components/star/star'
  export default {
    components: {
      'v-star': Star
    },
    props: { // 通过props向子组件传递数据 接收父组件传来的 seller数据
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false // 通过改变数据detailShow 的true/false，控制元素的显示/隐藏
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true //  触发点击事件，执行显示函数
      },
      hideDetail () {
        this.detailShow = false
      }
    },
    created () { // 请求数据 传入一个数组，对应json数据里的下表数组  定义 classMap数组，通过获取seller数据中的索引值，应用对应索引的class
      this.classMap = ['decrease', 'descount', 'guarantee', 'invoice', 'special']
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .header
    position relative
    overflow hidden
    color #fff
    background rgba(7, 17, 27, 0.5)
    .content-wrapper
      padding 24px 12px 18px 24px
      font-size 0
      position relative
      .avatar
        display inline-block
        vertical-align top
        img
          border-radius 2px
      .content
        display inline-block
        margin-left 16px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom 10px
          line-height 12px
          font-size 12px
        .support
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 4px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_1')
            &.descount
              bg-image('discount_1')
            &.
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            line-height 12px
            font-size 10px
      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0, 0, 0, 0.2)
        text-align center
        .count
          vertical-align top
          font-size 10px
        .icon-keyboard_arrow_right
          margin-left 2px
          line-height 24px
          font-size 10px
    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background rgba(7, 17, 27, 0.2)
      .bulletin-title
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height 12px
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin-text
        vertical-align top
        margin 0 4px
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        font-size 10px
        right 12px
        top 8px
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      z-index 100
      top 0
      left 0
      right 0
      max-width 540px
      margin 0 auto
      width 100%
      height 100%
      overflow auto
      backdrop-filter: blur(10px) // PC端和其它手机看不出效果 iPhone手机背景模糊效果
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s ease
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .detail-wrapper
        width 100%
        min-height 100%
        .detail-main
          padding-top 64px
          padding-bottom 64px
          .name
            line-height 16px
            text-align center
            font-size 16px
            font-weight 700
          .star-wrapper
            margin-top 18px
            padding 2px 0
            text-align center
          .title
            display flex
            width 80%
            margin 28px auto 24px
            .line
              flex 1
              position relative
              top -6px
              border-bottom 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding 0 12px
              font-weight 700
              font-size 14px
          .supports
            width 80%
            margin 0 auto
            .supports-item
              padding 0 12px
              margin-bottom 12px
              font-size 0
              &.last-child
                margin-bottom 0
              .icon
                display inline-block
                width 16px
                height 16px
                vertical-align top
                margin-right 6px
                background-size 16px 16px
                background-repeat no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.descount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height 16px
                font-size 12px
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              line-height 24px
              font-size 12px
      .detail-close
         position relative
         width 32px
         height 32px
         margin -64px auto 0 auto
         clear both
         font-size 32px
</style>
