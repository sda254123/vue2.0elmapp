<template>
  <div class="star" :class="starType">
    <!--v-for —— 根据分数 遍历itemClasses  显示星星样式-->
    <!--:class  —— 绑定动态class,  在不同的调用地方， 可以设置不同的样式-->
    <span
      v-for="itemClass in itemClasses"
      :key="itemClass.value"
      :class="itemClass"
      class="star-item"></span>
  </div>
</template>

<script>
  const LENGTH = 5
  const CLS_ON = 'on' // 显示星星
  const CLS_HALF = 'half' // 显示半星
  const CLS_OFF = 'off' // 不显示星星
  export default {
    name: 'star',
    props: { // props —— 从父组件接收两个参数：size尺寸，score分数
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size // 根据size  计算出动态的class
      },
      itemClasses () {
        let result = []
        let score = Math.floor(this.score * 2) / 2 //  返回小于或等于一个给定数字的最大整数。
        let hasDecimal = score % 1 !== 0 // 3.5 % 1 余数为0.5 半分 3.3%1 0.2999不满足半分
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON) // 根据size  计算出动态的class 根据score  push对应个数的全亮星星class .push（）方法向数组中添加新元素：
        }
        if (hasDecimal) {
          result.push(CLS_HALF) // 判断如果有半分或不足5分的，push进半星class和灰色星class
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result // 根据itemClasses中对应的class显示对应的星星图片
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
