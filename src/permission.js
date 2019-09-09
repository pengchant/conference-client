import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

/**
 * 权限管理模块，过滤掉登录部分
 */
const whiteList = ['/login']

/**
 * 全局前置守卫(加载路由)
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.state.menu.currentmenues.length === 0) {
        // TODO抓取用户的路由
        // store.dispatch('LoadMenu').then(() => {
        //   const routerlist = store.getters.currentmenues
        //   router.options.routes = router.options.routes.concat(routerlist)
        //   next({ ... to, replace: true })
        // }).catch((err) => { // 如果发生了错误
        //   console.log(err)
        // })
        next()
      } else {
        next()
      }
    }
  } else { // 如果没有tokken
    if (whiteList.indexOf(to.path) !== -1) { // 判断是否包含在白名单中
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

/**
 * 注册全局后置钩子
 */
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
