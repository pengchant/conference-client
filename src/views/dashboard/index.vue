/* eslint-disable quotes */
<template>
  <div ref="dashboard_ref" class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <div slot="header" class="clearfix">
            <span style="color:#F56C6C;">
              <svg-icon icon-class="shalou" />&nbsp;即将开始的会议
            </span>
          </div>
          <!-- 加载即将开始的会议 -->
          <el-table :data="commingconf" :show-header="false" border style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span>
                  <svg-icon icon-class="red_dt" />
                  {{ scope.row.confname }}
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <span
                  style="color:green;"
                >开始时间: {{ scope.row.starttime && scope.row.starttime.substr(0, 16) }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" prop="confstatus"/>
            <el-table-column width="190" align="center">
              <template slot-scope="scope">
                <!-- 如果是记录员才显示开始按钮 -->
                <span v-if="handleShow(scope.row.recorderid)">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="handleComingConf(scope.$index, scope.row)"
                  >开始/继续</el-button>
                </span>

                <el-button
                  type="success"
                  size="mini"
                  @click="handleDetailView(scope.$index, scope.row)"
                >查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <div slot="header" class="clearfix">
            <span style="color:#409EFF;">
              <svg-icon icon-class="rili" />&nbsp;我的预约
            </span>
          </div>
          <!-- 我的预约 -->
          <el-table :data="myorderdata" :show-header="false" border style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span>
                  <svg-icon icon-class="blue_dt" />
                  {{ scope.row.confname }}
                </span>
              </template>
            </el-table-column>
            <el-table-column width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.confstatus }}</span>
              </template>
            </el-table-column>
            <el-table-column width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="goseeorder(scope.$index, scope.row)"
                >查看我的预约</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 会议详情模态框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="60%" title="预约会议详情">
      <section v-if="confdetail!=undefined">
        <table class="mytable" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>会议名称</td>
            <td>{{ confdetail?confdetail.basicConfInfoView.confname:'' }}</td>
            <td>会议地点</td>
            <td>{{ confdetail?confdetail.basicConfInfoView.roomname:'' }}</td>
          </tr>
          <tr>
            <td>开始时间</td>
            <td>{{ formattime(confdetail?confdetail.basicConfInfoView.starttime:'') }}</td>
            <td>结束时间</td>
            <td>{{ formattime(confdetail?confdetail.basicConfInfoView.endtime:'') }}</td>
          </tr>
          <tr>
            <td>会议类别</td>
            <td>{{ confdetail?confdetail.basicConfInfoView.levelname:'' }}</td>
            <td>会议属性</td>
            <td>
              <el-tag
                v-for="item in confdetail.confattrs"
                :key="item.attrdes"
                style="margin-right:5px;"
              >{{ item.attrdes }}&nbsp;&nbsp;</el-tag>
            </td>
          </tr>
          <tr>
            <td>参会人员</td>
            <td colspan="3">
              <span
                v-for="usr in confdetail.attendersViews"
                :key="usr.workerid"
              >{{ usr.usrname }}&nbsp;</span>
            </td>
          </tr>

          <tr>
            <td colspan="4">上次会议所提议题/问题的解决情况</td>
          </tr>

          <tr
            v-for="(item,index) in confdetail.confLastIssueViewList"
            :key="'last_'+item.issuelastid"
          >
            <td class="align-center">{{ index+1 }}</td>
            <td colspan="3">{{ item.maincontent }}</td>
          </tr>
          <tr>
            <td colspan="4">本次会议需决议的议题</td>
          </tr>
          <tr
            v-for="(item,index) in confdetail.confCurIssueViewsList"
            :key="'cur_' + item.issuecurrent"
          >
            <td class="align-center">{{ index+1 }}</td>
            <td colspan="3">{{ item.mainconent }}</td>
          </tr>
          <tr>
            <td colspan="4">建议解决方案</td>
          </tr>
          <tr
            v-for="(item,index) in confdetail.confSuggestionViewList"
            :key="'sug_' + item.issuecurrent"
          >
            <td class="align-center">{{ index+1 }}</td>
            <td colspan="3">{{ item.maincontent }}</td>
          </tr>
        </table>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Watermark from '@/external/watermark'
import { mapGetters } from 'vuex'
import { getallOrder, getallCommingOrder } from '@/api/home'
import { queryorderDetail, updateConfIn } from '@/api/orderconf'
export default {
  name: 'Dashboard',
  data() {
    return {
      commingconf: [], // 即将开始的会议
      myorderdata: [], // 我预约的会议
      tableData: [],
      dialogFormVisible: false,
      confdetail: ''
    }
  },
  computed: {
    ...mapGetters(['name', 'roles', 'accid'])
  },
  created() {
    // 获取我的所有的会议预约
    getallOrder(this.accid).then(response => {
      this.myorderdata = response.data
    })
    // 获取即将开始的会议
    getallCommingOrder(this.accid).then(response => {
      this.commingconf = response.data
    })
  },
  mounted() {
    Watermark.set(
      '高校党政云记录管理平台 ' + this.name,
      this.$refs.dashboard_ref
    )
  },
  methods: {
    handleComingConf(index, row) {
      console.log(row)
      // 判断下会议的状态
      if (String(row.statusid) === '3') {
        // 路由跳转
        this.$router.push('/confrecord/recconf?confid=' + row.confid)
      } else {
        // 开始判断一下是否为开始时间
        const current = new Date()
        const flag = current < new Date(row.starttime)
        if (flag) {
          this.$confirm('距离预约还有一段时间，您是否提前开会?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
            .then(() => {
              updateConfIn(row.confid).then(resp => {
                if (resp.ok) {
                // 路由跳转
                  this.$router.push('/confrecord/recconf?confid=' + row.confid)
                } else {
                  this.$message.error('操作失败，请稍后重试!')
                }
              })
            })
            .catch(() => {})
        } else {
        // 跳转到开始开会页面
          updateConfIn(row.confid).then(resp => {
            if (resp.ok) {
            // 路由跳转
              this.$router.push('/confrecord/recconf?confid=' + row.confid)
            } else {
              this.$message.error('操作失败，请稍后重试!')
            }
          })
        }
      }
    },
    goseeorder() {
      this.$router.push({
        path: '/order/orderedconf'
      })
    },
    handleShow(recorderid) {
      return String(recorderid) === String(this.accid)
    },
    handleDetailView(index, row) {
      queryorderDetail(row.confid).then(resp => {
        // 显示具体的数据
        this.confdetail = resp.data
      })
      this.dialogFormVisible = true
    },
    // 格式化时间
    formattime(value) {
      return value.substr(0, 16)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    height: 100%;
    min-height: 900px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style scoped>
.mytable {
  width: 100%;
  border: dotted 1px rgb(230, 232, 236);
  border-right: none;
  border-bottom: none;
}
.mytable td {
  border: dotted 1px rgb(230, 232, 236);
  border-top: none;
  border-left: none;
  line-height: 40px;
}

.mytable td:nth-child(2n + 1) {
  padding-left: 3px;
}
</style>
