import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  state: {
    // 菜单列表
    menuList: [],
    // 权限列表
    permissions: [],
    // 是否加载菜单
    hasRoute: false,

    editableTabsValue: 'Index',
    editableTabs: [{
      title: '首页',
      name: 'Index',
    }]
  },
  mutations: {
    // 设置菜单
    SET_MENUS: (state, menus) =>{
      state.menuList = menus
    },
    // 设置权限
    SET_PERMISSION: (state, permission) =>{
      state.permissions = permission
    },
    // 变更路由状态 判断是否需要发送请求获取菜单
    CHANGE_ROUTE_STATUS: (state, hasRoute) =>{
      state.hasRoute = hasRoute
    },
    // 添加标签
    ADD_TAB: (state,tab) => {
      let index = state.editableTabs.findIndex(tabItem => tabItem.name === tab.name)
      if (index === -1){
        state.editableTabs.push({
          title: tab.title,
          name: tab.name
        })
      }
      state.editableTabsValue = tab.name;
    },
    // 清空状态
    RESET_STATE: (state) => {
      //state.token = ''
      state.menuList = []
      state.permissions = []
      state.hasRoute = false
      state.editableTabsValue= 'Index'
      state.editableTabs= [{
        title: '首页',
        name: 'Index',
      }]
    }
  },
  actions: {
  }
}
