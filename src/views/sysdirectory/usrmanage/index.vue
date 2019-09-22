<template>
  <div style="width:90%;margin: 0 auto;">
    <div style="margin-top:20px;">
      <el-row :gutter="5">
        <el-col :span="18">
          <el-form :inline="true" style="float:left;">
            <el-form-item label="部门">
              <el-select v-model="conditions.search.depname" placeholder="请选择所属部门" style="width:200px;">
                <el-option label="所有部门" value="" />
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.departname"
                  :value="item.departname"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input
                v-model="conditions.search.usrname"
                placeholder="请输入姓名关键字"
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
      <el-table-column prop="workerid" label="工号" sortable="custom" />
      <el-table-column prop="usrname" sortable="custom" label="用户名" />
      <el-table-column label="部门" >
        <template slot-scope="scope">
          <span>{{ filterVal(scope.row.departments) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" sortable="custom"/>
      <el-table-column prop="phonenum" sortable="custom" label="手机号" />
      <el-table-column label="职位" >
        <template slot-scope="scope">
          <span>{{ filterVal(scope.row.positions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" >
        <template slot-scope="scope">
          <span>{{ filterVal(scope.row.dutys) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统角色">
        <template slot-scope="scope">
          <span>{{ filterVal(scope.row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

    <!-- 修改模态框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="50%" title="修改用户信息">
      <el-form :model="usrinfoform" style="width:90%;margin:0 auto;">
        <el-form-item label-width="100px" label="工号">
          <el-input v-model="usrinfoform.workerid" disabled placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label-width="100px" label="用户名">
          <el-input v-model="usrinfoform.usrname" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label-width="100px" label="部门">
          <el-select v-model="usrinfoform.departments" style="width:100%;" multiple placeholder="请选择所属部门" >
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.departname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="邮箱">
          <el-input v-model="usrinfoform.email" clearable placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label-width="100px" label="手机号">
          <el-input v-model="usrinfoform.phonenum" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label-width="100px" label="职位">
          <el-select v-model="usrinfoform.positions" style="width:100%;" multiple placeholder="请选择职位" >
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.position"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="职务">
          <el-select v-model="usrinfoform.dutys" style="width:100%;" multiple placeholder="请选择职务" >
            <el-option
              v-for="item in dutys"
              :key="item.id"
              :label="item.duty"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="系统角色">
          <el-select v-model="usrinfoform.roles" style="width:100%;" multiple placeholder="请选择系统角色" >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="suremodify">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getalldep, queryUsrinfoView, getallposition, getalldutys, getallRoles, modifyUsrInfoView } from '@/api/comm'
export default {
  data() {
    return {
      currentPage: 1, // 当前页面
      total: 1000, // 总记录数
      pageSize: 10, // 每页的大小

      // 表格具体内容
      tableData: [],
      // 查询条件
      conditions: {
        order: '',
        sort: '',
        page: 1,
        pagesize: 10,
        search: {
          depname: '', // 部门编号
          usrname: '' // 用户名称
        }
      },
      // 修改表单是否隐藏
      dialogFormVisible: false,

      // 修改表单
      usrinfoform: {},

      departments: [], // 所有部门
      positions: [], // 所有职务
      dutys: [], // 所有职位
      roles: [] // 所有角色
    }
  },
  created() {
    // 获取所有部门
    getalldep().then(response => {
      this.departments = response.data
    })
    // 获取职业
    getallposition().then(response => {
      this.positions = response.data
    })
    // 获取职位
    getalldutys().then(resp => {
      this.dutys = resp.data
    })
    // 获取所有角色
    getallRoles().then(resp => {
      this.roles = resp.data
    })
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
      queryUsrinfoView(this.conditions).then(resp => {
        console.log(resp)
        const data = resp.data
        if (resp.ok) {
          this.tableData = data.list
          this.total = data.total
          this.currentPage = data.pageNum
        }
      })
    },
    // 编辑
    handleEdit(index, row) {
      // 加载数据
      this.usrinfoform = JSON.parse(JSON.stringify(row))
      // 解析部门
      var deps = this.usrinfoform.departments
      this.usrinfoform.departments = this.handleArray(deps)

      // 解析职位
      var pos = this.usrinfoform.positions
      this.usrinfoform.positions = this.handleArray(pos)

      // 解析职务
      var dutys = this.usrinfoform.dutys
      this.usrinfoform.dutys = this.handleArray(dutys)

      // 解析系统角色
      var roles = this.usrinfoform.roles
      this.usrinfoform.roles = this.handleArray(roles)

      this.dialogFormVisible = true
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
      // TODO:重新抓取数据
      this.fetchData()
    },
    // 确定修改
    suremodify() {
      console.log('确定修改', this.usrinfoform)
      modifyUsrInfoView(this.usrinfoform).then(resp => {
        console.log(resp)
        if (resp.ok) {
          this.$message.success('修改成功')
          this.fetchData()
        } else {
          this.$message.error(resp.msg)
        }
        this.dialogFormVisible = false
      })
    },
    // 按照条件查询
    conditionsearch() {
      this.fetchData()
    },

    // 过滤1#
    filterVal(val) {
      if (val) {
        const rege = new RegExp(/(\d+)#/g)
        try {
          val = val.replace(rege, '') // 将#num 去掉
        } catch (error) {}
        return val
      }
      return ''
    },
    // 处理多选框
    handleArray(mstr) {
      if (mstr) {
        var idstemp = []
        var objids = []
        idstemp = mstr.split(',')
        for (var i = 0; i < idstemp.length; i++) {
          var id = idstemp[i].split('#')[0]
          objids.push(Number(id)) // 注意这边需要转化为数字类型
        }
        return objids
      }
      return []
    }
  }
}
</script>

