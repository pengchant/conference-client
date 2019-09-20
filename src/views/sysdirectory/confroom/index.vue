<template>
  <div style="width:90%;margin: 0 auto;">
    <div style="margin-top:20px;">
      <el-row >
        <el-col :span="4">
          <el-button style="float:left;" type="primary" @click="newMeetRoom"><i class="el-icon-circle-plus"/>&nbsp;新增会议室</el-button>
        </el-col>
        <el-col :span="20">
          <el-form :inline="true" style="float:right;">
            <el-form-item label="部门">
              <el-select v-model="confroomcondition.search.departmentid" placeholder="请选择所属部门" style="width:200px;">
                <el-option label="所有部门" value="" />
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.departname"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="conditionsearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 会议室表格 -->
    <el-table
      :data="roomdata"
      height="650"
      border
      style="width: 100%">
      <el-table-column
        prop="roomname"
        label="会议室名称" />
      <el-table-column
        sortable
        prop="departname"
        label="隶属部门" />
      <el-table-column
        width="100"
        prop="maxcontain"
        sortable
        label="座位数"
      />
      <el-table-column
        prop="aircondition"
        width="80"
        align="center"
        header-align="center"
        label="空调">
        <template slot-scope="scope">
          <section v-if="scope.row.aircondition === 1">
            <i class="el-icon-success" style="color:#67c23a;" />
          </section>
          <section v-else>
            <i class="el-icon-error" style="color:#F56C6C;"/>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="projector"
        width="80"
        align="center"
        header-align="center"
        label="投影仪">
        <template slot-scope="scope">
          <section v-if="scope.row.projector === 1">
            <i class="el-icon-success" style="color:#67c23a;" />
          </section>
          <section v-else>
            <i class="el-icon-error" style="color:#F56C6C;"/>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="microphone"
        width="80"
        align="center"
        header-align="center"
        label="麦克风">
        <template slot-scope="scope">
          <section v-if="scope.row.microphone === 1">
            <i class="el-icon-success" style="color:#67c23a;" />
          </section>
          <section v-else>
            <i class="el-icon-error" style="color:#F56C6C;"/>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="stereo"
        width="80"
        align="center"
        header-align="center"
        label="音响">
        <template slot-scope="scope">
          <section v-if="scope.row.stereo === 1">
            <i class="el-icon-success" style="color:#67c23a;" />
          </section>
          <section v-else>
            <i class="el-icon-error" style="color:#F56C6C;"/>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="podium"
        width="80"
        align="center"
        header-align="center"
        label="演讲台">
        <template slot-scope="scope">
          <section v-if="scope.row.podium === 1">
            <i class="el-icon-success" style="color:#67c23a;" />
          </section>
          <section v-else>
            <i class="el-icon-error" style="color:#F56C6C;"/>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="lightequ"
        width="80"
        align="center"
        header-align="center"
        label="照明设备">
        <template slot-scope="scope">
          <section v-if="scope.row.lightequ === 1">
            <i class="el-icon-success" style="color:#67c23a;" />
          </section>
          <section v-else>
            <i class="el-icon-error" style="color:#F56C6C;"/>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="270"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <!-- 新增会议室模态框 -->
    <el-dialog
      :visible.sync="neewRoomDialog"
      title="新增会议室"
      width="60%">
      <!-- 表单具体内容 -->
      <el-form ref="newRoomForm" :model="newRoomForm" label-width="90px">
        <el-form-item label="会议室名称">
          <el-input v-model="newRoomForm.name" placeholder="请输入会议名称"/>
        </el-form-item>
        <el-form-item label="座位数">
          <el-input v-model="newRoomForm.seats" placeholder="请输入座位数"/>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="newRoomForm.department" placeholder="请选择会议室所属部门">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.departname"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件条件">
          <!-- 全选 -->
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="newRoomForm.hardcondition" @change="handleCheckedConditions">
            <el-checkbox v-for="hdc in hds" :label="hdc" :key="hdc">{{ hdc }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="neewRoomDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleNewRoom">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改会议会议室模态框 -->
    <el-dialog
      :visible.sync="modifyRoomDialog"
      title="修改会议室"
      width="60%">
      <!-- 表单具体内容 -->
      <el-form ref="modifyRoomForm" :model="modifyRoomForm" label-width="90px">
        <el-form-item label="会议室名称">
          <el-input v-model="modifyRoomForm.name" placeholder="请输入会议名称"/>
        </el-form-item>
        <el-form-item label="座位数">
          <el-input v-model="modifyRoomForm.seats" placeholder="请输入座位数"/>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="modifyRoomForm.department" placeholder="请选择会议室所属部门">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.departname"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件条件">
          <!-- 全选 -->
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange1">全选</el-checkbox>
          <el-checkbox-group v-model="modifyRoomForm.hardcondition" @change="handleCheckedConditions1">
            <el-checkbox v-for="hdc in hds" :label="hdc" :key="hdc">{{ hdc }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyRoomDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleModifyRoom">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
// 硬件条件
const hdcondtions = ['空调', '投影仪', '麦克风', '音响', '演讲台', '照明设备']
import { getalldep } from '@/api/comm'
import { getRoomList, addNewRoom, modifyRoom, removeRoom } from '@/api/orderconf'
export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      currentPage: 1, // 当前页面
      total: 1000, // 总记录数
      pageSize: 10, // 每页的大小
      // 查询条件
      confroomcondition: {
        order: '',
        sort: '',
        page: 1,
        pagesize: 10,
        search: {
          departmentid: '' // 部门编号
        }
      },

      roomdata: [], // 会议室数据

      departments: [], // 所有部门

      // 新增表单是否隐藏
      neewRoomDialog: false,

      // 新建会议室表单
      newRoomForm: {
        name: '', // 会议室名称
        seats: '',
        department: '', // 会议室所属部门编号
        hardcondition: [] // 会议室硬件条件
      },

      // 修改会议室表单是否隐藏
      modifyRoomDialog: false,

      modifyRoomForm: {
        roomid: '', // 会议室编号
        name: '', // 会议室名称
        department: '', // 会议室所属部门编号
        seats: '', // 座位数
        hardcondition: [] // 会议室硬件条件
      },

      hds: hdcondtions
    }
  },
  created() {
    // 抓取数据
    this.fetchData()
    // 获取所有部门
    getalldep().then(response => {
      this.departments = response.data
    })
  },
  methods: {
    // 选择发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击跳转页面变化
    handlecurrentchange(val) {
      this.currentPage = val
      this.confroomcondition.page = val
      this.fetchData()
    },
    // 分页抓取数据
    fetchData() {
      getRoomList(this.confroomcondition).then(response => {
        const data = response.data
        this.roomdata = data.list // 获取数据
        this.total = data.total // 总的数据
        this.currentPage = data.pageNum // 当前页面
      })
    },
    // 处理排序
    handlerSortchange(sortobj) {
      this.confroomcondition.sort = sortobj.prop // 待排序的字段
      this.confroomcondition.order = (sortobj.order === 'descending') ? 'desc' : (sortobj.order === 'ascending' ? 'asc' : '')
      this.fetchData()
    },

    // 按照条件查询
    conditionsearch() {
      this.fetchData()
    },

    // 新增会议室
    newMeetRoom() {
      this.neewRoomDialog = true
    },

    // 新增房间
    handleNewRoom() {
      addNewRoom(this.newRoomForm).then(resp => {
        if (resp.ok) {
          this.$message.success('恭喜你录入新会议室成功!')
          // 重置表单
          this.newRoomForm = {}
          // 隐藏模态框
          this.neewRoomDialog = false
          // 重新加载数据
          this.fetchData()
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    // 全选
    handleCheckAllChange(val) {
      this.newRoomForm.hardcondition = val ? hdcondtions : []
      this.isIndeterminate = false // 标记板悬
    },
    handleCheckAllChange1(val) {
      this.modifyRoomForm.hardcondition = val ? hdcondtions : []
      this.isIndeterminate = false // 标记板悬
    },
    // 处理选中某个单元的事件
    handleCheckedConditions(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.hds.length // 如果全选，则认为全部选中
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.hds.length // 标记是否半选状态
    },
    handleCheckedConditions1(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.hds.length // 如果全选，则认为全部选中
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.hds.length // 标记是否半选状态
    },

    // 编辑，弹出修改模态框
    handleEdit(index, row) {
      console.log(row)
      this.modifyRoomDialog = true
      this.modifyRoomForm.roomid = row.id
      this.modifyRoomForm.name = row.roomname
      this.modifyRoomForm.department = row.department
      this.modifyRoomForm.seats = row.maxcontain
      this.modifyRoomForm.hardcondition = []
      // 设置选中 const hdcondtions = ['空调', '投影仪', '麦克风', '音响', '演讲台', '照明设备']
      if (row.aircondition === 1) {
        this.modifyRoomForm.hardcondition.push('空调')
      }
      if (row.projector === 1) {
        this.modifyRoomForm.hardcondition.push('投影仪')
      }
      if (row.microphone === 1) {
        this.modifyRoomForm.hardcondition.push('麦克风')
      }
      if (row.stereo === 1) {
        this.modifyRoomForm.hardcondition.push('音响')
      }
      if (row.podium === 1) {
        this.modifyRoomForm.hardcondition.push('演讲台')
      }
      if (row.lightequ === 1) {
        this.modifyRoomForm.hardcondition.push('照明设备')
      }
      console.log(this.modifyRoomForm)
      // this.modifyRoomForm.hardcondition =
    },
    handleModifyRoom() {
      console.log(this.modifyRoomForm)
      modifyRoom(this.modifyRoomForm).then(resp => {
        if (resp.ok) {
          this.$message.success('修改成功')
          this.fetchData()
          this.modifyRoomDialog = false
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否确定删除?该操作具有一定的风险请谨慎操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeRoom(row.id).then(resp => {
            if (resp.ok) {
              this.$message.success('删除成功')
              this.fetchData()
            } else {
              this.$message.error(resp.msg)
            }
          })
        })
        .catch(() => {})
    }

  }
}
</script>
