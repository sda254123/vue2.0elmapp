/**
 * 解析url参数
 * 解析url中商家id数据为Object对象：每一个商家都有一个唯一的id，这个id存在url中，所以创建util.js，封装一个函数，将url解析成对象的模式
 * Created by yi on 2016-12-28.
 * @return Object {id:12334}
 */
export function urlParse () {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]]+/g
  let arr = url.match(reg)
  // ['?id=123454','&a=b']

  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=') // 先分割取到id=123454，之后用=号分开
      let key = tempArr[0]
      let val = tempArr[1]
      obj[key] = val
    })
  }
  // return obj;
  return {id: 123123}
}
