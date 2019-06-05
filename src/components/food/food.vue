<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <!--头图显示是异步加载的，不能写死宽高，因为视口是自适应的，但不设置高度，页面内容会有图片撑开高度的抖动过程。-->
          <img :src="food.image">
          <div class="back" @click="hide()">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <!---购物车组件-->
          <div class="cartcontrol-wrapper">
            <v-cartcontrol :food="food"></v-cartcontrol>
          </div>
          <transition name="buy">
            <!---点击添加商品按钮 prevent冒泡事件-->
            <div class="buy" @click.stop.prevent="addFirst($event)" v-show="!food.count || food.count === 0">
              加入购物车
            </div>
          </transition>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <v-split></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!--设置ratingselect组件中需要的props接收的数据，数据应从food.vue组件传入<ratingselect></ratingselect>,并由ratingselect.vue的props接收-->
          <v-ratingselect :select-type="selectType"
                          :only-content="onlyContent"
                          :desc="desc"
                          :ratings="food.ratings"
                          @increment="incrementTotal"></v-ratingselect>
          <div class="rating-wrapper">
           <ul v-show="food.ratings && food.ratings.length">
             <!--v-show特殊用法：绑定函数返回值-->
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in food.ratings" :key="index" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
  import split from '@/components/split/split'
  import ratingselect from '@/components/ratingselect/ratingselect' // 评论组件
  import {formatDate} from '@/common/js/date'
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    components: {
      'v-cartcontrol': cartcontrol,
      'v-split': split,
      'v-ratingselect': ratingselect
    },
    name: 'food',
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true, // //先设置组件一开始显示有内容的评价
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    // 在切换不同商品的时候能有相同的初始化状态 —— 定义show()作为goods组件中调用food组件的函数，即点开商品详情的显示函数，将初始化设置传入到show()中
    methods: {
      show () { // 点击显示商品详情页 //可以被父组件调用到，方法前加下划线一般是私有方法
        this.showFlag = true
        // 初始化部分，ratingselect组件是被被不同的商品使用的，所以我们希望在点开不同的商品时，能有一样的初始化状态
        this.selectType = ALL // 初始化状态
        this.onlyContent = true
        // 展示界面时用到BScroll
        this.$nextTick(() => { // 异步加载商品详情页内容
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true // 可以被点击
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () { // 返回 关闭详情页
        this.showFlag = false
      },
      addFirst (event) {
        if (!event._constructed) { // 浏览器原生的点击事件
          return
        }
        // console.log(target.event)
        // 加入购物车”一点击就会display:none,这样执行better-scroll动画的时候，找ball.el.getBoundingClientRect()会找不到，小球就不能找到正确的初始位置。
        Vue.set(this.food, 'count', 1)
        this.$emit('increment', event.target) // 子组件通过 $emit触发父组件的方法 increment 抛物线小球动画
      },
      needShow (type, text) {
        if (this.onlyContent && !text) { // 判断只有内容没有文本
          return false
        }
        if (this.selectType === ALL) { // 判断如果是显示所有的
          return true
        } else {
          return type === this.selectType // 判断当前type是否与所有的相等
        }
      },
      incrementTotal (type, data) {
        this[type] = data
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
   .food
     position fixed
     top 0
     left 0
     bottom 48px
     z-index 30
     width 100%
     background #fff
     &.move-enter-active, &.move-leave-active
       transition: all 0.2s linear
       transform: translate3d(0, 0, 0)
     &.move-enter, &.move-leave-active
       opacity: 0
       transform: translate3d(100%, 0, 0) // 便宜100%
     .image-header
       position: relative
       width: 100%
       height: 0
       padding-top: 100%  // 百分比是相对于盒子的宽度来计算的，看起来就像是一个正方形 宽高相等的元素
       img
         position: absolute
         top: 0
         left: 0
         width: 100%
         height: 100%  // 嵌入这个容器
       .back
         position: absolute
         top: 10px
         left: 0
         .icon-arrow_lift
           display: block
           padding: 10px
           font-size: 20px
           color: #ffffff
     .content
       position: relative
       padding: 18px
       .title
         line-height: 14px
         margin-bottom: 8px
         font-size: 14px
         font-weight: 700
         color: rgb(7, 17, 27)
       .detail
         margin-bottom: 18px
         line-height: 10px
         height: 10px
         font-size: 0
         .sell-count, .rating
           font-size: 10px
           display: inline-block
           color: rgb(147, 153, 159)
         .sell-count
           margin-right: 12px
       .price
         font-weight: 700
         line-height: 24px
         .now
           margin-right: 8px
           font-size: 14px
           color: rgb(240, 20, 20)
         .old
           text-decoration: line-through
           font-size: 10px
           color: rgb(147, 153, 159)
       .cartcontrol-wrapper
         position: absolute
         right: 12px
         bottom: 12px
       .buy
         position: absolute
         right: 18px
         bottom: 18px
         z-index: 10
         height: 24px
         line-height: 24px
         padding: 0 12px
         box-sizing: border-box
         border-radius: 12px
         font-size: 10px
         color: #ffffff
         background: rgb(0, 160, 220)
         opacity: 1
         &.buy-enter-active, &.buy-leave-active
           transition: all 0.2s // 给消失的过程加一个opcity的transition动画，时长0.2s，这样就不会立刻消失
           opacity: 1
         &.buy-enter, &.buy-leave-active
           opacity: 0
     .info
       padding: 18px
       .title
         line-height: 14px
         margin-bottom: 6px
         font-size: 14px
         color: rgb(7, 17, 27)
       .text
         line-height: 24px
         padding: 0 8px
         font-size: 12px
         color: rgb(77, 85, 93)
     .rating
       padding-top: 18px
       .title //因为要在rating title下方画一条横线，所以不能用padding-left，改用title的margin代替
         line-height: 14px
         margin-left: 18px
         font-size: 14px
         color: rgb(7, 17, 27)
     .rating-wrapper
       padding: 0 18px
       .rating-item
         position: relative
         padding: 16px 0
         border-1px(rgba(7, 17, 27, 0.1))
         .user
           position: absolute
           right: 0
           top: 16px
           line-height: 12px
           font-size: 0
           .name
             display: inline-block
             margin-right: 6px
             vertical-align: top
             font-size: 10px
             color: rgb(147, 153, 159)
           .avatar
             border-radius: 50%
         .time
           margin-bottom: 6px
           line-height: 12px
           font-size: 10px
           color: rgb(147, 153, 159)
         .text
           line-height: 16px
           font-size: 12px
           color: rgb(7, 17, 27)
           .icon-thumb_up, .icon-thumb_down
             margin-right: 4px
             line-height: 16px
             font-size: 12px
           .icon-thumb_up
             color:rgb(0, 160, 220)
           .icon-thumb_down
             color:rgb(147, 153, 159)
       .no-rating
         padding: 16px 0
         font-size: 12px
         color: rgb(147, 153, 159)
</style>
