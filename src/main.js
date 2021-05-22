import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入elementUi组件库
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
// 引入axios组件库
//import axios from 'axios'
// 引入自定义的axios
import axios from './axios'
import global from './globalFun'
// 全局注册axios
Vue.config.productionTip = false
Vue.prototype.$axios = axios
// 引入vue
Vue.use(Element)

// require('./mock')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
