<template>
  <div ref="dashboard_ref" class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <div slot="header" class="clearfix">
            <span style="color:#F56C6C;"><svg-icon icon-class="shalou" />&nbsp;即将开始的会议</span>
          </div>
          <!-- 加载即将开始的会议 -->
          <el-table
            :data="commingconf"
            :show-header="false"
            border
            style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span><svg-icon icon-class="red_dt" />{{ scope.row.confname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              align="right">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleComingConf(scope.$index, scope.row)">开始</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <div slot="header" class="clearfix">
            <span style="color:#409EFF;"><svg-icon icon-class="rili" />&nbsp;我的预约</span>
          </div>
          <!-- 我的预约 -->
          <el-table
            :data="myorderdata"
            :show-header="false"
            border
            style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span><svg-icon icon-class="blue_dt" />{{ scope.row.confname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.confstatus }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!-- <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <div slot="header" class="clearfix">
            <span style="color:#67C23A;"><svg-icon icon-class="naozhong" />&nbsp;代办事项</span>
          </div>
          <el-table
            :data="tableData"
            :show-header="false"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
            />
            <el-table-column
              width="80"
              align="right">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">操作</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import Watermark from '@/external/watermark'
import { mapGetters } from 'vuex'
import { getallOrder, getallCommingOrder } from '@/api/home'
export default {
  name: 'Dashboard',
  data() {
    return {
      commingconf: [], // 即将开始的会议
      myorderdata: [], // 我预约的会议
      tableData: [{
        date: '2016-05-02',
        name: '王小虎'
      }, {
        date: '2016-05-04',
        name: '王小虎'
      }, {
        date: '2016-05-01',
        name: '王小虎'
      }, {
        date: '2016-05-03',
        name: '王小虎'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    // 获取我的所有的会议预约
    getallOrder(9).then(response => {
      this.myorderdata = response.data
    })
    // 获取即将开始的会议
    getallCommingOrder(9).then(response => {
      this.commingconf = response.data
    })
  },
  mounted() {
    Watermark.set('高校党政云记录管理平台 ' + this.name, this.$refs.dashboard_ref)
  },
  methods: {
    handleComingConf(index, row) {
      this.$router.push({
        path: '/confrecord/recconf',
        query: {
          confid: row.confid
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    height:100%;
    min-height: 900px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style scoped>

</style>

