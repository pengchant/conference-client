<template>
  <div style="margin-right: 10px;float:left;margin-top:10px;">
    <el-button :class="'mybtn'+ ' ' + (active?'mybtn_active':'')" @click="handlerSelect">{{ secdepname }}</el-button>
  </div>
</template>

<script>
import { queryUsecDep } from '../../api/sysdirectory'
export default {
  name: 'BtnUsrSelect',
  props: {
    // 二级部门名称
    secdepname: {
      type: String,
      default: ''
    },
    // 二级部门编号
    secdepid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: false,
      selecusrlist: [] // 当前选中的用户
    }
  },
  created() {
    this.fetchUsrData()
  },
  methods: {
    handlerSelect: function() {
      // 改变样式
      this.active = !this.active
      // 请求二级部门下的所有的用户
      if (this.active) {
        this.$emit('callback', this.selecusrlist)
      } else {
        this.$emit('cleanselect', this.selecusrlist)
      }
    },
    fetchUsrData() {
      queryUsecDep(this.secdepid).then(resp => {
        this.selecusrlist = resp.data
      })
    }
  }
}
</script>

<style scoped>
.mybtn {
    /* display: inline-block; */
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    border-radius: 20px;
    float:left;
}

.mybtn_active{
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
</style>
