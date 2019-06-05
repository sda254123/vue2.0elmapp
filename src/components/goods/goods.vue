<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- 如果index等于currentIndex,就为这个li添加一个current类，改变左侧导航栏的背景颜色-->
        <li v-for="(item, index) in goods"
            :key="item.name"
            class="menu-item"
            :class="{'current': currentIndex===index}"
            @click="selectMenu(index, $event)"><!--点击左侧右侧滚动 在左侧菜单栏添加点击事件selectMenu 将index传进去，就可以知道点选的是哪个区域，然后利用原生DOM操作将高度滚动到相应的位置-->
          <span class="text" border-1px>
               <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--右侧布局-食品列表 ref 属性获取dom元素：驼峰命名法 -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!--第一层遍历商品项item in goods-->
        <li v-for="item in goods" :key="item.name" class="food-list food-list-hook"><!--为了获取高度，给food-list定义一个class--food-list-hook，不用来编写css，专门用来获取DOM元素，没有实际的效果，只是用来被js选择的-->
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <!-- 第二层遍历单个商品的信息项food in item.foods-->
            <li v-for="food in item.foods"
                :key="food.name"
                class="food-item border-1px"
                @click="selectFood(food, $event)">
              <div class="icon">
                <img :src="food.icon" width="57">
              </div>
              <div class="content">
                <span class="name">{{food.name}}</span>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food" @increment="_drop"></v-cartcontrol><!--increment抛物线动画 -->
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart ref="shopcart"
                :select-foods="selectFoods"
                :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"></v-shopcart>
    <v-food :food="selectedFood" ref="food" @increment="_drop"></v-food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll' // 引入滚动插件
  import shopcart from '@/components/shopcart/shopcart' // 引入购物车组件
  import cartcontrol from '@/components/cartcontrol/cartcontrol' // 引入商品添加组件
  import food from '@/components/food/food' // 引入商品详情页

  const ERR_OK = 0
  export default {
    name: 'goods',
    components: {
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    },
    props: { // 通过props向子组件传递数据 接收父组件传来的 seller数据
      // prop 是父组件用来传递数据的一个自定义属性。 父组件的数据需要通过 props 把数据传给子组件，子组件需要显式地用 props 选项声明 "prop"：
      seller: {
        type: Object
      }
    },
    data () { // 数据对象goods
      return {
        goods: [],
        listHeight: [], // 在data中定义数组用来存储不同区间的高度
        scrollY: 0, // 在data中定义一个scrollY对象，用来跟踪滚动的高度 scrollY：0；在初始化betterScroll时，为右侧添加probeType--可以检测到右侧实时滚动的位置，监听scroll，将其实时滚动的位置暴露出来
        selectedFood: {}
      }
    },
    computed: { // 计算属性computed
      currentIndex () { // currentIndex对应菜单栏的下标
        // let声明的变量只在它所在的代码块有效。 for循环的计数器，就很合适使用let命令。 计数器i只在for循环体内有效，在循环体外引用就会报错。
        // 拿到滚动的高度和内容区的固定高度之后， 查看scrollY落在哪个区间，并返回那个区间的索引
        for (let i = 0; i < this.listHeight.length; i++) { // 不要忘了加this引用
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          // 获得了一个区间的上下范围，判断scrollY落到这个区间，!height2是判断最后一个区间
          // 避免i溢出，>= 向下的是一个闭区间，这样第一个就会高亮了
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i // 映射到第5行menu的变化
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created () { // 在实例创建完成后被立即调用
      this.classMap = ['decrease', 'descount', 'guarantee', 'invoice', 'special'] // 请求数据 传入一个数组，对应json数据里的下表数组  定义 classMap数组，通过获取seller数据中的索引值，应用对应索引的class
      this.$http.get('/api/goods') // 发送get请求
        .then((response) => { // .then方法请求完成后调用
          response = response.body // 拿到response返回的promise对象的body(Data Object)
          if (response.errno === ERR_OK) {
            this.goods = response.data
            this.$nextTick(() => { // 数据的DOM映射 安全 计算属性
              this._initScroll() // 初始化高度 成功回调函数中调用_initScroll方法：
              this._calculateHeight() // 在data中定义一个scrollY对象，用来跟踪滚动的高度 scrollY：0；在初始化betterScroll时，为右侧添加probeType--可以检测到右侧实时滚动的位置，监听scroll，将其实时滚动的位置
            })
          }
        })
    },
    methods: { // 使用methods属性向Vue实例引入新属性 方法中的 this 自动绑定为 Vue 实例。
      selectMenu (index, event) { // 传递event事件 点击左侧右侧滚动 将index传进去，就可以知道点选的是哪个区域，然后利用原生DOM操作将高度滚动到相应的位置
        if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
          return // 在pc浏览器上不执行
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook') // 获取dom节点
        let ref = foodList[index] // 取到index对应的DOM
        this.foodsScroll.scrollToElement(ref, 300) // 滚动到DOM所在位置
        // console.log(index);
      },
      _initScroll () { // better-scroll初始化：
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true // 使better-scroll可点击，默认派发一个点击事件  不加的话无法点击滚动 两个回调事件 移动端端正常
        }) // 击左侧菜单栏的时候没有反应，因为BScroll默认阻止点击事件，所以在 _initScroll()中获取DOM对象时添加click: true,并解决PC端双点击问题，event是点击时的event
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3 // BScroll滚动时，能实时告诉我们滚动的位置，类似探针的效果 检测到右侧实时滚动的位置，监听scroll，将其实时滚动的位置暴露出来
        })
        // foodsScroll监听事件,在scroll滚动时能见位置实时暴露出来
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)) // 本身是个负值，取正值
        })
      },
      _calculateHeight () { // 定义foodList拿到每个li，每个li是包括标题在内的每一类food的高度，不是单独的一种good，将_calculateHeight放在nextTick中初始化_initScroll的后面，保证其能正确计算到高度
        // food-list-hook类的添加知识为了能拿到food列表,例如，拿到的是多个类似整个粥品的区块
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height) // listHeight是一个递增的区间数组，是每个专区高度的累加
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectFood (food, event) { // 单个商品信息
        if (!event._constructed) { // 浏览器原生的点击事件
          return
        }
        this.selectedFood = food // 被选中的商品
        this.$refs.food.show()
      },
      _drop (target) {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.dropMove(target)
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    max-width: 540px
    overflow hidden
    .menu-wrapper
      felx 0 0 80px
      width 80px
      background #f3f5f7
     .menu-item
       display table
       height 54px
       width 56px
       line-height 14px
       padding 0 12px
       &.current
         position: relative
         z-index: 10
         margin-top: -1px
         background: #ffffff
         font-weight: 700
         .text
           border-none()
       .icon
         display inline-block
         vertical-align top
         width 12px
         height 12px
         margin-right 2px
         background-size 12px 12px
         background-repeat no-repeat
         &.decrease
           bg-image('decrease_3')
         &.descount
           bg-image('discount_3')
         &.guarantee
           bg-image('guarantee_3')
         &.invoice
           bg-image('invoice_3')
         &.special
           bg-image('special_3')
       .text
         display: table-cell
         width: 56px
         vertical-align: middle
         border-1px(rgba(7, 17, 27, 0.1))
         font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            display block
            margin: 2px 0 8px 0
            height: 17px
            line-height: 17px
            font-size: 17px
            color: rgb(7, 17, 27)
          .desc, .extra
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            font-size: 10px
            line-height: 10px
            color: rgb(147,153,159)
            margin-bottom: 8px
            .count
              margin-right: 12px
              line-height: 10px
            .rating
              line-height: 10px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 16px
              color: rgb(240, 20, 20)
              font-weight 700
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
            font-size 12px
</style>
