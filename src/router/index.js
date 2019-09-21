import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  // 主页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: false,
    meta: {
      title: '首页',
      icon: 'home'
    },
    children: [{
      path: 'dashboard', // 嵌套路由dashboard会被渲染在Layout 的<route-view/>中
      component: () => import('@/views/dashboard/index')
    }]
  },

  // 会议预约
  {
    path: '/order/',
    component: Layout,
    name: 'conforder',
    redirect: 'noredirect', // 点击该路由不跳转
    meta: {
      title: '会议预约',
      icon: 'order'
    },
    children: [
      { path: '/order/orderconf', meta: { title: '预约会议' }, name: 'orderconf', component: () => import('@/views/order/orderconf/index') },
      { path: '/order/orderedconf', meta: { title: '已预约会议' }, name: 'orderedconf', component: () => import('@/views/order/orderedconf/index') },
      { path: '/order/validateorder', meta: { title: '审核预约会议' }, name: 'validateorder', component: () => import('@/views/order/validateorder/index') }
    ]
  },

  // 直接开会
  {
    path: '/directstart/',
    component: Layout,
    name: 'directopen',
    redirect: 'noredirect',
    meta: {
      title: '会议记录',
      icon: 'zjkh'
    },
    children: [
      { path: '/directstart/record', meta: { title: '直接开会' }, name: 'directrecord', component: () => import('@/views/record/directstart/index') }
    ]
  },

  // 会议记录
  {
    path: '/confrecord/',
    component: Layout,
    name: 'confrecord',
    redirect: 'noredirect', // 点击该路由不跳转
    meta: {
      title: '会议记录',
      icon: 'confrecord'
    },
    children: [
      { path: '/confrecord/directstart', hidden: true, meta: { title: '直接开会' }, name: 'directst', component: () => import('@/views/record/directstart') },
      { path: '/confrecord/recconf', hidden: true, meta: { title: '进行中会议' }, name: 'record', component: () => import('@/views/record/recconf') },
      { path: '/confrecord/validating', meta: { title: '已提交待审核' }, name: 'validating', component: () => import('@/views/record/validating') },
      { path: '/confrecord/validated', meta: { title: '审核会议记录' }, name: 'validated', component: () => import('@/views/record/validated') }
    ]
  },

  // 会议调阅
  {
    path: '/confquery/',
    component: Layout,
    name: 'confquery',
    redirect: 'noredirect', // 点击该路由不跳转
    meta: {
      title: '归档记录查询',
      icon: 'confquery'
    },
    children: [
      { path: '/confquery/material', meta: { title: '归档记录查询' }, name: 'material', component: () => import('@/views/query/confquery/index') }
    ]
  },

  // 系统功能配置
  {
    path: '/sys/',
    component: Layout,
    name: 'system',
    redirect: 'noredirect', // 点击该路由不跳转
    meta: {
      title: '系统配置管理',
      icon: 'confconfig'
    },
    children: [
      { path: '/sys/semester', meta: { title: '学期管理' }, name: 'semester', component: () => import('@/views/sysdirectory/semester/index') },
      { path: '/sys/confattr', meta: { title: '会议属性管理' }, name: 'confattr', component: () => import('@/views/sysdirectory/confattr/index') },
      { path: '/sys/conflevel', meta: { title: '会议类别管理' }, name: 'conflevel', component: () => import('@/views/sysdirectory/conflevel/index') },
      { path: '/sys/confstatus', meta: { title: '会议状态管理' }, name: 'confstatus', component: () => import('@/views/sysdirectory/confstatus/index') },
      { path: '/sys/department', meta: { title: '部门管理' }, name: 'department', component: () => import('@/views/sysdirectory/department/index') },
      { path: '/sys/position', meta: { title: '用户职务管理' }, name: 'position', component: () => import('@/views/sysdirectory/position/index') },
      { path: '/sys/duty', meta: { title: '用户职位管理' }, name: 'duty', component: () => import('@/views/sysdirectory/duty/index') },
      { path: '/sys/confroom', meta: { title: '会议室管理' }, name: 'confroom', component: () => import('@/views/sysdirectory/confroom/index') },
      { path: '/sys/usrmanage', meta: { title: '用户管理' }, name: 'confroom', component: () => import('@/views/sysdirectory/usrmanage/index') }
    ]
  },

  // 最终如果都找不到，返回404
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
