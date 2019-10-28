<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" round @click="openDepSec">选择用户</el-button>
    <el-dialog :visible.sync="depDialogvisable" :title="pdepname" width="80%" top="2vh">
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
                          @click="selectUsr(scope.row)"
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
            查看已经选中的人员
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

export default {
  name: 'DepSelector',
  props: {
    pdepid: {
      default: '',
      type: String
    },
    pdepname: {
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
      }
    }
  },
  created() {
    // this.fetchUsrSelecting()
  },
  methods: {
    openDepSec: function() {
      this.depDialogvisable = true
      this.fetchUsrSelecting()
    },

    depClick: function() {
      this.depDialogvisable = false
    },

    // 获取所有待选择的人员
    fetchUsrSelecting() {
      getPeopleSelect(this.selectcondtion).then(response => {
        const data = response.data
        // 总的页数
        this.stotal = data.total
        // 当前页数
        this.scurrentPage = data.pageNum
        // 绑定选择的数据
        this.selectingdata = data.list
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
    selectUsr() {
      console.log('选择人员')
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
