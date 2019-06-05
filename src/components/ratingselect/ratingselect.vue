<template>
  <div class="ratingselect">
    <div class="rating-type" border-1px>
      <!--:class被选中状态为2 统计不同评价的数量（过滤评价类型），添加计算属性 -- positives和negitives数组，长度即为评价数量-->
      <span class="block positive" @click.stop.prevent="select(2,$event)" :class="{'active':sType === 2}">{{desc.all}} <span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click.stop.prevent="select(0,$event)" :class="{'active':sType === 0}">{{desc.positive}} <span class="count">{{positives.length}}</span></span>
      <span class="block negative" @click.stop.prevent="select(1,$event)" :class="{'active':sType === 1}">{{desc.negative}} <span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click.stop.prevent="toggleContent($event)" class="switch" :class="{'on':oContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0 // 好评
  const NEGATIVE = 1 // 吐槽
  const ALL = 2 // 所有评价
  export default {
    name: 'ratingselect',
    // 需要一些评价数据才能完成评价组件
    props: {
      ratings: { // 所有评价的数据，因为这里有一个评价数量
        type: Array,
        default () {
          return [] // 返回这个函数 评价函数
        }
      },
      selectType: { // 选择评价类型 三种类型 //全部，满意，不满意
        type: Number,
        default: ALL // 默认选中所有 值等于2
      },
      onlyContent: { // 是否显示只看内容 只看有内容的评价还是所有的评价
        type: Boolean, // 评价内容
        default: false // 设置为可以看到所有的评价
      },
      desc: { // 描述
        type: Object,
        default () { // 这个函数返回值 默认desc是这三种，在商品详情页的时候传入推荐或者吐槽
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data () { // 在data中重新定义变量接收selectType和onlyContent的值 便观测值的变化
      return {
        sType : this.selectType, // 选中状态
        oContent : this.onlyContent
      }
    },
    computed: { // 对应所有正向评价的数组 计算属性定义两个变量
      positives () {
        return this.ratings.filter((rating) => { // filter方法，过滤数组
          return rating.rateType === POSITIVE
        })
      },
      negatives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      // 编写rating-type和swicth切换有内容评价部分的绑定函数：select(type, event) —— 在点击的时候就把类型123传进去，传入event是因为外层是一个betterScroll，要进行点击事件的判断，将sType的值更新之后通过emit将函数派发出去；
      select (type, event) { // 点击的时候外层是有一个BScroll的，所以要传递event阻止默认点击
        if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
          return
        }
        this.sType = type // 将this.selectType设置成传入的参数,而不是food传过来的初始化的值，之后样式就可以随着点击改变了
        // console.log('ratingselect.vue ' + type);
        this.$emit('increment', 'selectType', this.sType) // 子组件通过 $emit触发父组件的方法 increment   还可以传参
      },
      toggleContent (event) {
        if (!event._constructed) { // //浏览器直接return掉,去掉自带click事件的点击
          return
        }
        this.oContent = !this.oContent
        // console.log('ratingselect.vue ' + this.oContent);
        this.$emit('increment', 'onlyContent', this.oContent)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 2px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #ffffff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        font-size: 12px
</style>
