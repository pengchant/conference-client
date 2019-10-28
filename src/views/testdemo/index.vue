<template>
  <div>
    <el-header class="header">这是头部标题</el-header>
    <el-container style="min-height:700px;">
      <el-aside class="aside">
        左侧导航栏
      </el-aside>
      <el-main class="main">
        <PeopleSelector @afterSelect="handlerAfter"/>
        <br>
        <br>
        <DepSelector pdepname="计算机科学与工程学院-大数据小组" pdepid="1" @afterSelect="handlerAfter"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import PeopleSelector from '@/components/PeopleSelector'
import DepSelector from '@/components/DepSelector'
export default {
  name: 'TestDemo',
  components: {
    PeopleSelector,
    DepSelector
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
