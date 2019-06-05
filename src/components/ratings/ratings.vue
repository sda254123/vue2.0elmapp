<template>
    <div class="ratings" ref="ratings"> <!-- ratings-content大于ratings的时候出现滚动 -->
      <div>
        <div class="ratings-content">
          <div class="overview">
            <div class="overview-left">
              <h1 class="score">{{seller.score}}</h1>
              <div class="title">综合评分</div>
              <div class="rank">高于周边商家{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
              <div class="score-wrapper">
                <span class="title">服务态度</span>
                <v-star :size="36" :score="seller.serviceScore" class="star"></v-star>
                <span class="score">{{seller.serviceScore}}</span>
              </div>
              <div class="score-wrapper">
                <span class="title">商品评分</span>
                <v-star :size="36" :score="seller.foodScore" class="star"></v-star>
                <span class="score">{{seller.foodScore}}</span>
              </div>
              <div class="delivery-wrapper">
                <span class="title">送达时间</span>
                <span class="delivery">{{seller.deliveryTime}}分钟</span>
              </div>
            </div>
          </div>
          <!--使用引用并注册好的split组件和ratingselect组件-->
          <v-split></v-split>
          <v-ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings" @increment="incrementTotal">
          </v-ratingselect>
          <div class="rating-wrapper">
            <ul>
              <li class="rating-item border-1px" v-for="(rating, index) in ratings" :key="index" v-show="needShow(rating.rateType,rating.text)">
                <div class="avatar">
                  <img :src="rating.avatar" width="28" height="28">
                </div>
                <div class="content">
                  <h1 class="name">{{rating.username}}</h1>
                  <div class="star-wrapper">
                    <v-star :size="24" :score="rating.score"></v-star>
                    <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                  </div>
                  <p class="text">{{rating.text}}</p>
                  <!-- 赞或踩和相关推荐 -->
                  <div class="recommend"  v-show="rating.recommend && rating.recommend.length">
                    <span class="icon-thumb_up"></span>
                    <span v-for="(item, index) in rating.recommend" :key="index" class="item">{{item}}</span>
                  </div>
                  <div class="time">
                    {{rating.rateTime | formatDate}}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import star from '@/components/star/star'
  import split from '@/components/split/split'
  import ratingselect from '@/components/ratingselect/ratingselect' // 评论组件
  import {formatDate} from '@/common/js/date'
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  const ERR_OK = 0
  export default {
    name: 'ratings',
    components: {
      'v-star': star,
      'v-split': split,
      'v-ratingselect': ratingselect
    },
    props: {
      seller: {
        type: Object // App.vue中的routerview进行传递，在rating组件中使用props进行接收，这样才可以在模板中直接使用seller.XXX数据
      }
    },
    data () { //  data中添加ratingselect组件中需要维护的值
      return {
        ratings: [], // ratings是所有商品的ratings（针对一个商家），不是food.vue中对某一种食品的评价——food.ratings
        selectType: ALL,
        onlyContent: true
      }
    },
    created () { // 同商品组件，在created()函数中拿到ratings的API数据,将得到的ratings传到ratings的组件中
      this.$http.get('/api/ratings')
      .then((res) => {
        res = res.body
        if (res.errno === ERR_OK) {
          this.ratings = res.data
          this.$nextTick(() => { // 启动滚动插件
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
              })
            })
          }
        }
      )
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      needShow (type, text) { // 筛选
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      },
      incrementTotal (type, data) {
        this[type] = data
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .ratings /*要实现滚动 像good组件一样，需要固定视口的高度，将其定位绝对定位，top为header组件的高度*/
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
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        width 137px // 防止出现兼容性问题
        padding: 12px 0
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width 320px)
          flex: 0 0 110px
          width: 110px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding:  6px 0 6px 24px
        @media only screen and (max-width 320px)
          padding-left: 6px
        .score-wrapper
          margin-top: 8px
          line-height: 18px
          font-size: 0
          .title
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          line-height: 18px
          margin-top: 8px
          font-size: 0
          .title  /* span文字和文字之间默认是垂直居中的，可以不用加display vertical-align */
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            display: inline-block
            vertical-align: top
            line-height: 18px
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              margin:0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color:rgb(0, 160, 220)
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #ffffff
        .time
          position: absolute
          top: 0
          right: 0
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)

</style>
