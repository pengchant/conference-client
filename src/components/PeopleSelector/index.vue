<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" round @click="openselector">选择用户</el-button>
    <el-dialog :visible.sync="dialogTableVisible" width="80%" title="选择人员" top="2vh">
      <div style="min-height: 500px; position:reltive">
        <el-row :gutter="10" style="min-height:480px;">
          <el-col :span="6" class="colitem">
            <div class="grid-content">1</div>
          </el-col>
          <el-col :span="12" class="colitem">
            <div class="grid-content">2</div>
          </el-col>
          <el-col :span="6" class="colitem">
            <div class="grid-content">3</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="mfooter">
              <el-button type="success" icon="el-icon-circle-check"> 添加选中</el-button>
              <el-button icon="el-icon-close" @click="handleClick">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PeopleSelector',
  props: {},
  data() {
    return {
      dialogTableVisible: false
    }
  },
  methods: {
    openselector: function() {
      this.dialogTableVisible = true
    },
    handleClick: function() {
      this.dialogTableVisible = false
    }
  }
}
</script>

<style scoped>
.colitem {
  height: 450px;
}
.grid-content {
  width: 100%;
  height: 100%;
  border: solid 1px #F2F6FC;
}
.mfooter {
    text-align:center;
}
</style>
