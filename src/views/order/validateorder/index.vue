<template>
  <div style="width:90%;margin: 0 auto;">
    <div style="margin-top:20px;">
      <el-row :gutter="5">
        <el-col :span="6">
          <el-date-picker v-model="conditions.search.startime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择开始日期" />
        </el-col>
        <el-col :span="6">
          <el-date-picker v-model="conditions.search.entime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择结束日期" />
        </el-col>
        <el-col :span="12">
          <el-form :inline="true" style="float:right;">
            <el-form-item>
              <el-input
                v-model="conditions.search.confname"
                placeholder="请输入会议关键字"
                @keyup.enter.native="conditionsearch"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="conditionsearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      height="700"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handlerSortchange"
    >
      <el-table-column width="90" prop="conferenceid" label="编号" sortable="custom" />
      <el-table-column prop="confname" label="会议名称" sortable="custom" />
      <el-table-column prop="levelname" sortable="custom" label="会议级别" />
      <el-table-column prop="recorder" sortable="custom" label="申请人" />
      <el-table-column label="请求时间" sortable="custom" prop="colltime">
        <template slot-scope="scope">{{ formattime(scope.row.colltime) }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >预约详情</el-button>
          <el-button
            size="mini"
            plain
            type="success"
            @click="handlePass(scope.$index, scope.row)"
          > <i class="el-icon-success" style="color:#67c23a;" />通过</el-button>

          <el-button
            size="mini"
            plain
            type="danger"
            @click="handleUnpass(scope.$index, scope.row)"
          ><i class="el-icon-error" style="color:#F56C6C;"/>不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      background
      layout="prev, pager, next"
      @current-change="handlecurrentchange"
    />

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
            <td>会议级别</td>
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
        <el-button type="warning" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <div style="height:50px;" />
  </div>
</template>

<script>
import { passOrderConf, unpassOrderConf, queryorderDetail, queryValitingConf } from '@/api/orderconf'

export default {
  data() {
    return {
      currentPage: 1, // 当前页面
      total: 1000, // 总记录数
      pageSize: 10, // 每页的大小
      multipleSelection: [], // 多选数组
      // 表格具体内容
      tableData: [],
      // 查询条件
      conditions: {
        order: '',
        sort: '',
        page: 1,
        pagesize: 10,
        search: {
          confname: '',
          endtime: '',
          startime: '',
          workerid: '9'
        }
      },
      // 修改表单是否隐藏
      dialogFormVisible: false,
      // 修改表单
      confattrform: {
        id: '',
        attrname: '',
        attrdes: ''
      },

      // 新增表单是否隐藏
      newFormVisible: false,

      confdetail: ''
    }
  },
  created() {
    // 抓取数据
    this.fetchData()
  },
  methods: {
    // 选择发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击跳转页面变化
    handlecurrentchange(val) {
      this.currentPage = val
      this.conditions.page = val
      this.fetchData()
    },
    // 分页抓取数据
    fetchData() {
      queryValitingConf(this.conditions).then(response => {
        const data = response.data
        this.tableData = data.list
        this.total = data.total
        this.currentPage = data.pageNum
      })
    },
    // 模态框显示会议的具体数据
    handleEdit(index, row) {
      queryorderDetail(row.conferenceid).then(resp => {
        // 显示具体的数据
        this.confdetail = resp.data
      })
      this.dialogFormVisible = true
    },

    // 按照条件查询
    conditionsearch() {
      this.fetchData()
    },

    // 格式化时间
    formattime(value) {
      return value.substr(0, 16)
    },

    // 处理排序
    handlerSortchange(sortobj) {
      this.conditions.sort = sortobj.prop // 待排序的字段
      this.conditions.order =
        sortobj.order === 'descending'
          ? 'desc'
          : sortobj.order === 'ascending'
            ? 'asc'
            : ''
      this.fetchData()
    },

    // 通过会议
    handlePass(index, row) {
      this.$confirm('将通过该会议的预约，通过后不可更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行通过
        passOrderConf(row.conferenceid).then(resp => {
          if (resp.ok) {
            this.$message.success('执行成功!')
            this.fetchData()
          } else {
            this.$message.error(resp.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 不通过会议
    handleUnpass(index, row) {
      this.$confirm('将不通过该会议的预约，操作后将不可更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unpassOrderConf(row.conferenceid).then(resp => {
          if (resp.ok) {
            this.$message.success('执行成功!')
            this.fetchData()
          } else {
            this.$message.error(resp.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

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
