<template>
    <div class="cartcontrol">
      <!--按钮平移+渐隐渐现+滚动动画：-->
      <transition name="move">
        <div class="cart-decrease"
             v-show="food.count>0"
             @click.stop.prevent="decreaseCart($event)">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'cartcontrol',
    props: { // 通过props向子组件传递数据 接收父组件传来的 food数据
      food: { // 传入food
        type: Object
      }
    },
    created () {}, // 生命周期钩子 异步请求数据，返回的是Promise对象
    methods: {
      addCart (event) {
        if (!event._constructed) { // 浏览器原生的点击事件
          return
        }
        // console.log('click')
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1) // Vue.set 接口检测数据的变化 添加属性
        } else {
          this.food.count++
        }
        this.$emit('increment', event.target) // 子组件通过 $emit触发父组件的方法 increment
      },
      decreaseCart () {
        if (!event._constructed) { // 浏览器原生的点击事件
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  cartcontrol
    font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    transform: translate3d(0, 0, 0)
    transform: rotate(0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s linear
      transform: translate3d(0, 0, 0) /*开启硬件加速，让动画更流畅*/
      transform: rotate(0)
    &.move-enter, &.move-leave-active
      opacity: 0
      transform: translate3d(24px, 0, 0)
      transform: rotate(180deg)
    .inner
      display: inline-block
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 6px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)
  .cart-add
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)
</style>
