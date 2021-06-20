import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import Role from "../views/system/manage/Role";
import Menu from "../views/system/manage/Menu";
import User from "../views/system/manage/User";

import axios from "../axios";
//import axios from "axios";
import store from "../store"

Vue.use(VueRouter)
/*
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}*/

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/index',
        name: 'Index',
        component: Index
      },
      {
        path: '/userCenter',
        name: 'UserCenter',
        meta: {
          title: '个人中心'
        },
        component: () => import('../views/UserCenter.vue')
      }/*,
      {
        path: '/sys/user',
        name: 'SysUser',
        component: User
      },
      {
        path: '/sys/menu',
        name: 'SysMenu',
        component: Menu
      },
      {
        path: '/sys/role',
        name: 'SysRole',
        component: Role
      }*/
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {

  let hasRoute = store.state.menus.hasRoute
  let token = localStorage.getItem('token');
  console.log(hasRoute,'hasRoute')
  console.log(token,'token')

  if (to.path === '/login'){
    next()

  }else if (!token){
    next({path: '/login'})

  }else if (token && !hasRoute) {
    // TODO 浏览器端刷新一次此方法会执行两次 需要修改
    axios.get('/menu/nav',{
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res =>{
      // 拿到menu列表
      console.log('访问了菜单列表')
      store.commit('SET_MENUS',res.data.data.nav)
      // 拿到用户权限
      store.commit('SET_PERMISSION',res.data.data.authorizations)

      let newRoutes = router.options.routes
      res.data.data.nav.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e => {
            let route = menuToRoute(e)
            if(route) {
              newRoutes[0].children.push(route)
            }
          })
        }
      })
      router.addRoutes(newRoutes)
      hasRoute = true
      store.commit("CHANGE_ROUTE_STATUS",hasRoute)
      console.log(store.state.menus.hasRoute,'store的hasRoute')
    })
  }

  next()
})

const menuToRoute = (menu) => {
  if (!menu.component) {
    return null
  }
  let route = {
    path: menu.path,
    name: menu.name,
    component: () => import('../views/'+ menu.component +'.vue'),
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
 /* route.component = () => import('../views/'+ menu.component +'.vue')*/
  return route
}

export default router
