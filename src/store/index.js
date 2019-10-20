import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'
import user from './modules/user'
import menu from './modules/menu'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { // 这里罗列所有的模块
    app,
    tagsView,
    user,
    menu
  },
  getters
})

export default store
