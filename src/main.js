import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import SlideVerify from 'vue-monoplasty-slide-verify' // 图片拖拽插件

import vueAudioNative from 'vue-audio-native'
Vue.use(vueAudioNative)

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })
Vue.use(SlideVerify)

Vue.config.productionTip = false

new Vue({
  el: '#app', // app的id
  router, // 路由
  store, // vuex
  render: h => h(App)
})
