<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">

    <!-- element ui的左侧导航栏 -->
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <!-- 遍历item -->
      <sidebar-item
        v-for="route1 in routes"
        :key="route1.path"
        :item="route1"
        :base-path="route1.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入全局的css背景颜色样式
import variables from '@/styles/variables.scss'
// 引入menuitem对象
import SidebarItem from './SidebarItem'

export default {
  // sidebar的每一项
  components: { SidebarItem },
  computed: { // 计算属性
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // 所有的路由
      return this.$router.options.routes
    },
    variables() { // 是否可见
      return variables
    },
    isCollapse() { // 是否折叠
      return !this.sidebar.opened
    }
  },
  created: function() {

  }
}
</script>
