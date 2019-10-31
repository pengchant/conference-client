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
        <br>
        <br>
        <br>
        <RecorderArea :pspechlist.sync="spechlist"/>
        <br>
        <br>
        <!-- <el-button @click="getCurvalue"/> -->
        <br>
        <br>
        <BtnUsrSelect
          secdepname="大数据团队"
          secdepid="1"
          @callback="handlerEvent"
          @cleanselect="cleanEvent" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import PeopleSelector from '@/components/PeopleSelector'
import DepSelector from '@/components/DepSelector'
import RecorderArea from '@/components/RecorderArea'
import BtnUsrSelect from '@/components/BtnUsrSelect'
export default {
  name: 'TestDemo',
  components: {
    PeopleSelector,
    DepSelector,
    RecorderArea,
    BtnUsrSelect
  },
  data() {
    return {
      spechlist: [] // 会议记录的列表
    }
  },
  created() {
    // 创建
  },
  methods: {
    // 当选择之后
    handlerAfter: function(data) {

    },
    getCurvalue() {
      console.log('当前的值', this.spechlist)
    },
    // 当选中
    handlerEvent(data) {
      console.log(data)
    },
    // 清空选择
    cleanEvent(data) {
      console.log(data)
    }
  }
}
</script>

<style scoped>
.header, .aside, .main {
    border:solid 1px rgb(236, 235, 235);
}
</style>
