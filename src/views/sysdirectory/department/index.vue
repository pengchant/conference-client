<template>
  <div style="width:90%;margin: 0 auto;">
    <!-- 修改模态框 -->
    <el-dialog :visible.sync="sdialogFormVisible" width="50%" title="修改二级部门">
      <el-form :model="sdepartmentform">
        <el-form-item label-width="120px" label="二级部门名称">
          <el-input v-model="sdepartmentform.depname" clearable placeholder="请输入二级部门名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="ssuremodify">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增模态框 -->
    <el-dialog :visible.sync="snewFormVisible" width="50%" title="新增二级部门">
      <el-form :model="sdepartmentform">
        <el-form-item label-width="120px" label="二级部门名称">
          <el-input v-model="sdepartmentform.depname" clearable placeholder="请输入二级部门名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="snewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="ssureAddSecondDep">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改模态框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="50%" title="修改部门">
      <el-form :model="departmentform">
        <el-form-item label-width="120px" label="部门名称">
          <el-input v-model="departmentform.departname" clearable placeholder="请输入部门名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="suremodify">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增模态框 -->
    <el-dialog :visible.sync="newFormVisible" width="50%" title="新增部门">
      <el-form :model="departmentform">
        <el-form-item label-width="120px" label="部门名称">
          <el-input v-model="departmentform.departname" clearable placeholder="请输入部门名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddSemester">确 定</el-button>
      </div>
    </el-dialog>

    <div style="margin-top:20px;">
      <el-row :gutter="5">
        <el-col :span="6">
          <el-button type="danger" @click="batchremote"><i class="el-icon-delete"/>批量删除</el-button>
          <el-button type="success" @click="addsemester"><i class="el-icon-circle-plus-outline" />新增</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :inline="true" style="float:right;">
            <el-form-item>
              <el-input v-model="conditions.search.departmentname" placeholder="请输入关键字" @keyup.enter.native="conditionsearch"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="conditionsearch"><i class="el-icon-search"/>查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      height="500"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handlerSortchange">
      <!-- 多选 -->
      <el-table-column
        type="selection"
        width="40"
        style="text-align:center;"/>
      <el-table-column
        prop="departname"
        sortable = "custom"
        label="部门名称"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete "/>删除</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleNew(scope.$index, scope.row)"><i class="el-icon-star-off" />管理子部门</el-button>
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
      @current-change="handlecurrentchange"/>

    <!-- 二级部门管理模态框 -->
    <el-dialog
      :visible.sync="secondDepvisiable"
      :title="secondHandlerDep"
      top="2vh"
      width="60%"
      height="500">
      <el-row style="margin-bottom:10px;">
        <el-col>
          <el-button
            type="success"
            @click="addSecondDep"><i class="el-icon-circle-plus-outline" />新增</el-button>
        </el-col>
      </el-row>
      <!-- el-table -->
      <el-table
        :data="s_tableData"
        height="400"
        border
        style="width: 100%"
        @sort-change="shandlerSortchange">
        <el-table-column
          prop="depname"
          sortable = "custom"
          label="二级部门名称"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="shandleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="shandleDelete(scope.$index, scope.row)"><i class="el-icon-delete "/>删除</el-button>
            <DepSelector
              :pdepname="secondHandlerDep"
              :pdepid="s_conditions.search.depid + ''"
              :secdepid="scope.row.id+''"
              :secdepname="scope.row.depname"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <el-pagination
        :total="s_total"
        :page-size="s_pageSize"
        :current-page="s_currentPage"
        background
        layout="prev, pager, next"
        @current-change="shandlecurrentchange"/>
    </el-dialog>

  </div>

</template>

<script>
import DepSelector from '@/components/DepSelector'
import { getDepartmentList, modifyDepartment,
  removeDepartment, batchrmDepartments,
  newDepartments, queryPagedSecondDep,
  modifyDepSec, removeSecDep, addDepSec } from '../../../api/sysdirectory'
export default {
  name: 'Department',
  components: {
    DepSelector
  },
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
          departmentname: ''
        }
      },
      // 修改表单是否隐藏
      dialogFormVisible: false,
      // 修改表单
      departmentform: {
        id: '',
        departnum: '',
        departname: ''
      },

      // 新增表单是否隐藏
      newFormVisible: false,

      secondDepvisiable: false,
      secondHandlerDep: '',
      secondDepData: null,

      s_currentPage: 1, // 当前页面
      s_total: 1000, // 总记录数
      s_pageSize: 10, // 每页的大小
      // 表格具体内容
      s_tableData: [],
      // 查询条件
      s_conditions: {
        order: '',
        sort: '',
        page: 1,
        pagesize: 10,
        search: {
          depid: ''
        }
      },
      // 模态框的关闭
      sdialogFormVisible: false,
      snewFormVisible: false,
      // 二级部门表单
      sdepartmentform: {
        id: '',
        depname: '',
        departid: '',
        parentid: ''
      }

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
      getDepartmentList(this.conditions).then(response => {
        const data = response.data
        this.tableData = data.list
        this.total = data.total
        this.currentPage = data.pageNum
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.departmentform = row
      this.dialogFormVisible = true
    },
    // 删除
    handleDelete(index, row) {
      const rowid = row.id
      this.$confirm('你确定要删除' + row.departname + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeDepartment(rowid).then(response => {
          this.$message.success('删除成功!')
          // 重新fetchdata
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    // 批量删除
    batchremote() {
      const delids = this.multipleSelection.map((e, i, arr) => {
        return e.id
      })
      if (delids.length > 0) {
        this.$confirm('你确定要删除这' + delids.length + '条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchrmDepartments(delids).then(response => {
            if (response.ok) {
              this.$message.success('删除成功')
              // 重新fetchdata
              this.fetchData()
            } else {
              this.$message.error(response.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除!')
        })
      } else {
        this.$message.warning('请先选择记录!')
      }
    },
    // 处理排序
    handlerSortchange(sortobj) {
      this.conditions.sort = sortobj.prop // 待排序的字段
      this.conditions.order = (sortobj.order === 'descending') ? 'desc' : (sortobj.order === 'ascending' ? 'asc' : '')
      this.fetchData()
    },
    // 确定修改
    suremodify() {
      modifyDepartment(this.departmentform).then(response => {
        console.log(response)
        if (response.ok) {
          this.$message.success('修改成功')
          this.dialogFormVisible = false
          // 重新featchdada
          this.fetchData()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 按照条件查询
    conditionsearch() {
      this.fetchData()
    },
    // 新增
    addsemester() {
      this.newFormVisible = true
      this.departmentform = {}
    },
    // 确定新增
    sureAddSemester() {
      this.departmentform.id = ''
      newDepartments(this.departmentform).then(response => {
        if (response.ok) {
          this.$message.success('添加成功!')
          this.newFormVisible = false
          this.fetchData()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 点击管理二级部门
    handleNew(index, row) {
      const depname = row.departname
      const depid = row.id
      // todo:管理该部门下的子部门
      this.secondDepvisiable = true
      this.secondHandlerDep = depname + ' 二级部门'
      this.s_conditions.search.depid = depid
      this.fetchSecDepData()
      // 设置表单当前的父部门编号
      this.sdepartmentform.departid = depid
    },

    // 抓取数据
    fetchSecDepData() {
      // 分页查询二级部门
      queryPagedSecondDep(this.s_conditions).then(resp => {
        const data = resp.data
        this.s_tableData = data.list
        this.s_total = data.total
        this.s_currentPage = data.pageNum
      })
    },
    // 点击排序
    shandlerSortchange(sortobj) {
      this.s_conditions.sort = sortobj.prop
      this.s_conditions.order = (sortobj.order === 'descending') ? 'desc' : (sortobj.order === 'ascending' ? 'asc' : '')
      this.fetchSecDepData()
    },
    // 编辑
    shandleEdit(index, row) {
      this.sdialogFormVisible = true
      this.sdepartmentform = row
    },
    // 删除
    shandleDelete(index, row) {
      const rowid = row.id
      this.$confirm('你确定要删除' + row.depname + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeSecDep(rowid).then(response => {
          this.$message.success('删除成功!')
          // 重新fetchdata
          this.fetchSecDepData()
        })
      }).catch(() => {
      })
    },
    // 点击页面跳转
    shandlecurrentchange(val) {
      this.s_currentPage = val
      this.s_conditions.page = val
      this.fetchSecDepData()
    },
    // 新增二级部门,弹出模态框
    addSecondDep() {
      this.snewFormVisible = true
      const depid = this.sdepartmentform.departid
      this.sdepartmentform = {}
      this.sdepartmentform.departid = depid
    },
    // 修改二级部门信息
    ssuremodify() {
      modifyDepSec(this.sdepartmentform).then(resp => {
        if (resp.ok) {
          this.$message.success('修改成功')
          this.sdialogFormVisible = false
          // 重新featchdada
          this.fetchSecDepData()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 新增二级部门信息
    ssureAddSecondDep() {
      addDepSec(this.sdepartmentform).then(resp => {
        if (resp.ok) {
          this.$message.success('添加成功!')
          this.snewFormVisible = false
          this.fetchSecDepData()
        } else {
          this.$message.error(resp.msg)
        }
      })
    },

    // 开始分配人员
    allocatePeople(index, row) {

    }

  }
}
</script>

