<template>
    <div class="seller" ref="seller">
      <div class="seller-content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <v-star :size="36" :score="seller.score"></v-star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span class="stress">{{seller.minPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryTime}}</span>元
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite($event)">
            <i class="icon-favorite" :class="{'active': favorite}"></i><!-- 对应是否收藏两种样式-->
            <span class="text">{{favoriteText}}</span><!-- 有没有选中对应不同的文本，所以这里要绑定一个变量，放到data中 -->
          </div>
        </div>
        <v-split></v-split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper border-1px">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="(item.id,index.id)">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
        </div>
        <v-split></v-split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list" ref="picList">
              <li class="pic-item" v-for="pic in seller.pics" :key="pic.id">
                <img :src="pic" width="120" height="90">
              </li>
            </ul>
          </div>
        </div>
        <v-split></v-split>
        <div class="info">
          <div class="title  border-1px">商家信息</div>
          <ul>
            <li class="info-item" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import star from '@/components/star/star'
  import split from '@/components/split/split'
  import BScroll from 'better-scroll'
  import {saveToLocal, loadFromlLocal} from '@/common/js/store.js'
  // 创建store.js实现数据的存取，专门存取不同商家的id，通过唯一id，将收藏的信息添加到localStorge中
  export default {
    name: 'seller',
    components: {
      'v-star': star,
      'v-split': split
    },
    props: { // APP.vue的routerview中已经将seller传进来了，这里只需要接收就好
      seller: {
        type: Object
      }
    },
    data () {
      return {
        //  favorite: false  //默认没有被收藏,从localStorge中取读取，不是一个默认值了
        favorite: (() => {
          return loadFromlLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    computed: {
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    methods: {
      // seller是异步获取的，但是我们的内容都是靠seller里的数据撑开的，所以一开始内容肯定是小于我我们定义的wrapper的，所以没有被撑开
      // 将其放入watch：{} 中可以监测到seller的变化，将初始化语句写成一个方法，在watch中进行调用
      _initScroll () {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.seller, {click: true})
          } else {
            this.scroll.refresh()
          }
        })
      },
      // 使用BScroll实现滚动，添加_initPic()方法，并把它添加到watch和create()中
      _initPics () {
        //  pic-wrapper是固定宽度的视口的大小，当里面的ul超过视口宽度的时候就会出现滚动
        // ul是外层的宽度，并不是真实的li撑开的宽度
        if (this.seller.pics) { // 判断有图片的时候
          let picWidth = 120 // 定义每张图片的宽度
          let margin = 6
          let width = (picWidth + margin) * this.seller.pics.length - margin // 计算ul的宽度 图片的宽度+margin*图片的数组长度减去最后一个的margin
          this.$nextTick(() => {
            this.$refs.picList.style.width = width + 'px' // 设置ul宽度，不要忘记单位
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true, // 表示横向滚动
                eventPassthrough:'vertical' // 横向滚动图片的时候忽略纵向的滚动
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
      },
      toggleFavorite (event) { // 点击收藏取消事件
        if (!event._constructed) { // 浏览器原生的点击事件
          return
        }
        this.favorite = !this.favorite
        // 这样写取法区分商家id，不同商家的状态一样
        saveToLocal(this.seller.id, 'favorite', this.favorite) // 缓存 收藏状态
      }
    },
    watcher: { // 要写成watcher 才不报错 观察更新状态
      'seller' () { // 观测seller数据的更新，并且执行更新后的操作
        this._initScroll()
        this._initPics()
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'] // 图标icon  动态绑定class时，使用classMap，在created()中定义，通过获取索引值一一对应，同header.vue组件中一样
      this._initScroll()
      this._initPics()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/base.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    right 0
    width: 100%
    max-width 540px
    margin 0 auto
    overflow: hidden
    .overview
      padding: 18px
      position: relative
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:before
          display: none
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .text
          display: inline-block
          vertical-align: top
          margin-right: 12px
          line-height: 18px // 不能为父元素设置line-heigth，否则组件会被撑高
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 8px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 149)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        right: 11px
        top: 18px
        width: 50px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          width: 50px
          color: #d4d6d9
          &.active
            color: rgb(240,20,20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77,85,93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 1px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 0
          &:last-child // 没有底部边框
            border-none()
          .icon
            display inline-block
            width 16px
            height 16px
            vertical-align top
            margin-right 6px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            display inline-block
            font-size 12px
            line-height 16px
            color rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap /*不产生折行*/
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info // 商家信息
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 14px
        &:before
          display: none
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
