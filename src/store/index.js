import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token : ''
  },
  mutations: {
    /* 赋值token并且往localStorage存储jwt */
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    }
  },
  actions: {
  },
  modules: {
    menus
  }
})
