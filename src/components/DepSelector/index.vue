<template>
  <div style="display:inline-block;margin-left:12px;">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="openDepSec">选择用户</el-button>
    <el-dialog
      :visible.sync="depDialogvisable"
      :title="secdepname"
      :modal="false"
      width="80%"
      top="2vh">
      <div style="min-height: 500px; position:reltive">
        <el-row :gutter="30" style="min-height:480px;">
          <el-col :span="14">
            <el-row :gutter="20">
              <el-col :span="10">
                <!-- 搜索框 -->
                <el-input v-model="selectcondtion.search.usrname" placeholder="请输入用户名" />
              </el-col>
              <el-col :span="7">
                <el-button type="primary" @click="research"><i class="el-icon-search" />查询</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="margin-top:10px;">
                <!-- 加载人员 -->
                <el-table
                  ref="mloadusrtb"
                  :data="selectingdata"
                  :show-header="true"
                  border
                  style="width: 100%" >
                  <el-table-column label="工号" prop="workerid"/>
                  <el-table-column label="姓名" prop="usrname"/>
                  <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                      <section v-if="scope.row.selected === true">
                        <span>已选择</span>
                      </section>
                      <section v-else >
                        <el-button
                          type="success"
                          size="mini"
                          @click="handlerSelect(scope.row)"
                        >选择</el-button>
                      </section>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div style="padding:10px;text-align:center;">
                  <el-pagination
                    :total="stotal"
                    :page-size="spageSize"
                    :current-page="scurrentPage"
                    background
                    layout="prev, pager, next"
                    @current-change="handleUsrChange"/>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10">
            <div class="selectedDiv">已选择的人员</div>
            <!-- 加载人员 -->
            <el-table
              :data="selectedUsr"
              :show-header="true"
              border
              style="width: 100%" >
              <el-table-column label="工号" prop="workerid"/>
              <el-table-column label="姓名" prop="usrname"/>
              <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="removeUsr(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="mfooter">
              <el-button icon="el-icon-close" @click="depClick">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPeopleSelect } from '@/api/orderconf'
import { queryUsecDep, addUsrsecDep, removeUsrSecDep } from '@/api/sysdirectory'

export default {
  name: 'DepSelector',
  props: {
    // 一级部门编号
    pdepid: {
      default: '',
      type: String
    },
    // 一级部门名称
    pdepname: {
      default: '',
      type: String
    },
    // 二级部门编号
    secdepid: {
      default: '',
      type: String
    },
    // 二级部门名称
    secdepname: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      depDialogvisable: false,

      stotal: 0, // 记录总数
      spageSize: 10, // 每页数据大小
      scurrentPage: 1, // 当前页

      selectingdata: null,

      // 用户条件查询条件
      selectcondtion: {
        page: 1,
        pagesize: 10,
        search: {
          depid: this.pdepid, // 部门编号
          positionid: [], // 用户职务
          dutyid: [], // 用户职位
          usrname: '' // 用户名
        }
      },

      selectedUsr: [] // 已经选择的用户
    }
  },
  created() {

  },
  methods: {
    // 打开二级部门人员管理对话框
    openDepSec: function() {
      console.log(this.pdepid, this.secdepid)
      this.depDialogvisable = true
      this.fetchUsrSelecting()
    },

    depClick: function() {
      this.depDialogvisable = false
    },

    // 获取所有待选择的人员
    fetchUsrSelecting() {
      this.selectcondtion.search.depid = this.pdepid
      getPeopleSelect(this.selectcondtion).then(response => {
        const data = response.data
        // 总的页数
        this.stotal = data.total
        // 当前页数
        this.scurrentPage = data.pageNum
        // 绑定选择的数据
        this.selectingdata = data.list
        const selectedUsrs = this.selectedUsr
        var _that = this
        this.selectingdata.map((val, index, arr) => {
          for (var i = 0; i < selectedUsrs.length; i++) {
            if (val.workerid === selectedUsrs[i].workerid) {
              _that.$set(_that.selectingdata[index], 'selected', true)
            }
          }
        })
      })
    },
    handleUsrChange(val) {
      this.scurrentPage = val
      this.selectcondtion.page = val
      this.fetchUsrSelecting()
    },
    research() {
      this.fetchUsrSelecting()
    },

    // 加载已经选择的用户
    fetchSelectedUsr() {
      queryUsecDep(this.secdepid).then(resp => {
        this.selectedUsr = resp.data
      })
    },

    // 删除用户
    removeUsr(row) {
      removeUsrSecDep(row.id).then(resp => {
        if (resp.ok) {
          this.fetchSelectedUsr() // 重新加载数据
          this.fetchUsrSelecting()
        } else {
          this.$message.error('对不起删除失败!')
        }
      })
    },

    // 选择用户
    handlerSelect(row) {
      console.log(this.secdepid, row.workerid)
      addUsrsecDep({
        secdepid: this.secdepid,
        usrid: row.workerid
      }).then(resp => {
        if (resp.ok === true) {
          this.$message.success('选择成功')
          this.fetchSelectedUsr()// 加载已经选择过的
          this.fetchUsrSelecting() // 加载部门其他信息
        } else {
          this.$message.error('操作失败')
        }
      })
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

.selectedDiv {
  width:100%;
  height:50px;
  line-height: 50px;
  text-align: center;
  background: #EBEEF5;
  color:#409EFF;
}

.v-modal {
  display:none !important;
}
</style>
