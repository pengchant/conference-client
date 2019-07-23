<template>

  <!-- 如果item.hidden 为非隐藏属性 -->
  <div v-if="!item.hidden" class="menu-wrapper">

    <!-- 情形1：如果没有字路由：父路由下没有chridren节点 -->
    <template v-if="hasOneShowingChild(item.children,item) 
                    && (!onlyOneChild.children||onlyOneChild.noShowingChildren)
                    && !item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <!-- 插槽内容出 -->
        <el-menu-item :index="resolvePath(onlyOneChild.path)" 
              :class="{'submenu-title-noDropdown':!isNest}">
          <!-- icon,标题 -->
          <item :meta="Object.assign({},item.meta,onlyOneChild.meta)" />
        </el-menu-item>
      </app-link>
    </template>


    <!-- 情形2：如果有子路由，类似于递归调用，继续渲染子列表项的内容 -->
    <el-submenu v-else ref="subMenu" 
          :index="resolvePath(item.path)" 
          popper-append-to-body><!-- 一级子菜单：true / 非一级子菜单：false -->
        <template slot="title">
          <!-- icon,标题 -->
          <item :meta="item.meta" />
        </template>
      <!-- 继续向下查找是否还有自由列表项 -->
      <sidebar-item
          v-for="child in item.children"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu" />
    </el-submenu>

  </div>

</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: { // 接收到的属性
    // :item 路由的每一项配置
    item: {
      type: Object,
      required: true
    },
    // 判断是否为嵌套的
    isNest: {
      type: Boolean,
      default: false
    },
    // :base-path 绑定的基础路由路径
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    /**
     * 参数：children 子地址对象列表，父对象配置
     */
    hasOneShowingChild(children = [], parent) {

      // 创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // 只有一个子路由
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有子路由，直接默认父路由
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    // 判断是否为外部路由，如果是外部地址直接返回，否则基地址+路由地址
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
