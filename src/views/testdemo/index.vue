<template>
  <div>
    <el-header class="header">这是头部标题</el-header>
    <el-container style="min-height:700px;">
      <el-aside class="aside">
        左侧导航栏
      </el-aside>
      <el-main class="main">
        <PeopleSelector @afterSelect="handlerAfter"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import PeopleSelector from '@/components/PeopleSelector'
export default {
  name: 'TestDemo',
  components: {
    PeopleSelector
  },
  data() {
    return {

    }
  },
  methods: {
    // 当选择之后
    handlerAfter: function(data) {

    }
  }
}
</script>

<style scoped>
.header, .aside, .main {
    border:solid 1px rgb(236, 235, 235);
}
</style>
