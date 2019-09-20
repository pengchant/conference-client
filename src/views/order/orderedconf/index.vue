<template>
  <div style="width:90%;margin: 0 auto;">
    <div style="margin-top:20px;margin-bottom:20px;">
      <el-row >
        <el-col :span="4">
          开始时间
          <el-date-picker
            v-model="conditions.search.startime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择申请开始日期"
          />
        </el-col>
        <el-col :span="4">
          结束时间
          <el-date-picker
            v-model="conditions.search.endtime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择申请结束日期"
          />
        </el-col>
        <el-col :span="4">
          预约状态
          <el-select v-model="conditions.search.confstatus" placeholder="请选择预约状态">
            <el-option value label="所有记录">所有记录</el-option>
            <el-option value="1" label="已申请">已申请</el-option>
            <el-option value="2" label="通过申请">通过申请</el-option>
            <el-option value="101" label="审核不通过">审核不通过</el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="conditions.search.confname"
            placeholder="请输入会议关键字"
            @keyup.enter.native="conditionsearch"
          />
        </el-col>
        <el-col :span="8">
          <el-button style="float:right;" type="primary" @click="conditionsearch">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      height="650"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handlerSortchange"
    >
      <el-table-column width="80" prop="conferenceid" label="编号" sortable="custom" />
      <el-table-column prop="confname" label="会议名称" sortable="custom" />
      <el-table-column prop="levelname" sortable="custom" label="会议级别" />
      <el-table-column prop="recorder" width="90" sortable="custom" label="申请人" />
      <el-table-column label="请求时间" sortable="custom" prop="colltime">
        <template slot-scope="scope">{{ formattime(scope.row.colltime) }}</template>
      </el-table-column>
      <el-table-column label="预约状态" width="150" header-align="center">
        <template slot-scope="scope">
          <!-- 如果是已经申请或者审核通过的情况 -->
          <section v-if="scope.row.statusid == '1' || scope.row.statusid == '2' ">
            <span style="color:#67C23A;">
              <i class="el-icon-success" />
              &nbsp;{{ scope.row.confstatus }}
            </span>
          </section>
          <section v-if="scope.row.statusid == '101'">
            <span style="color:#F56C6C;">
              <i class="el-icon-error" />
              &nbsp;{{ scope.row.confstatus }}
            </span>
          </section>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >查看预约详情</el-button>
          <!-- 删除不通过的会议 -->
          &nbsp;&nbsp;
          <span v-if="scope.row.statusid == '101'">
            <el-button
              size="mini"
              plain
              type="danger"
              @click="delConf(scope.$index, scope.row)"
            >删除会议</el-button>
          </span>
          <span v-else>
            <el-button
              size="mini"
              plain
              type="warning"
              @click="startconf(scope.$index, scope.row)"
            >开始开会</el-button>
          </span>
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
        <el-button type="success" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <div style="height:50px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryOrderedConf, queryorderDetail, removeOrderConf } from '../../../api/orderconf'

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
          confstatus: '', // 会议的状态
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
  computed: {
    ...mapGetters(['name', 'accid'])
  },
  created() {
    // 设置用户id和用户名
    this.conditions.search.workerid = this.accid
    console.log('读取内存中用户名为：', this.conditions.search.workerid)
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
      queryOrderedConf(this.conditions).then(response => {
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

    // 开始开会
    startconf(index, row) {
      this.$confirm('是否确定开始开会?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          this.$router.push('/confrecord/recconf?confid=' + row.conferenceid)
        })
        .catch(() => {})
    },
    // 删除会议
    delConf(index, row) {
      console.log(row)
      this.$confirm('是否确定删除该会议预约?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'primary'
      })
        .then(() => {
          // 请求后台删除
          removeOrderConf(row.conferenceid).then(resp => {
            if (resp.status === '200') {
              this.fetchData()
            }
          })
        })
        .catch(() => {})
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
