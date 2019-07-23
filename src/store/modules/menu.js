import { getmenu } from '@/api/mypri'

const menu = {

  // menue的全局状态
  state: {
    currentmenues: []
  },

  mutations: {
    SET_MENU: (state, menueobj) => {
      state.currentmenues = menueobj
      console.log('设置菜单状态成功!')
    }
  },

  actions: {
    // 抓取菜单
    LoadMenu({ commit }) {
      return new Promise((resolve, reject) => {
        getmenu().then(response => {
          const data = response.data
          console.log('获取到的菜单信息->', data)
          commit('SET_MENU', formatRoutes(data.list))
          resolve()
        })
      })
    }
  }
}

/**
 * 将路由格式化
 * @param {待格式化的路由对象实体} routes
 */
export const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    let {
      path,
      component,
      name,
      meta,
      children
    } = router
    meta.icon = 'excel'
    if (children && children instanceof Array) {
      children = formatRoutes(children) // 递归调用
    }
    // const fmRouter = {
    //   path: path,
    //   component: () => import('@/views/table/index'),
    //   name: name,
    //   meta: meta,
    //   children: children
    // }
    // fmRoutes.push(fmRouter)
  })
  return fmRoutes
}

export default menu
