<template>
  <div ref="directrecordwp" class="wrapper ">
    <el-card class="box-card" shadow="never">
      <el-form
        ref="directconffm"
        key="directconf"
        :model="directconf"
        :rules="directconfRules"
        :validate-on-rule-change="false">
        <table class="mtable">
          <tr>
            <td style="width:120px;">输入会议名称</td>
            <td colspan="5">
              <el-form-item prop="confname">
                <el-input
                  v-model="directconf.confname"
                  width="100%"
                  placeholder="请输入会议名称"
                  clearable
                />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>学期</td>
            <td>
              <el-form-item prop="semesters">
                <el-select
                  v-model="directconf.semester"
                  style="width:100%;"
                  allow-create
                  placeholder="请选择学期"
                >
                  <el-option
                    v-for="item in semesters"
                    :key="item.id"
                    :label="item.semestername"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </td>
            <td>会议属性</td>
            <td colspan="3">
              <el-form-item prop="confattr">
                <el-select
                  v-model="directconf.confattr"
                  style="width:100%;"
                  multiple
                  placeholder="请选择会议属性"
                >
                  <el-option
                    v-for="item in confattrs"
                    :key="item.id"
                    :label="item.attrdes"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>会议类别</td>
            <td>
              <el-form-item prop="conftype">
                <el-select v-model="directconf.conftype" placeholder="请选择会议的会议类别">
                  <el-option
                    v-for="item in conflevels"
                    :key="item.id"
                    :label="item.leveldes"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </td>
            <td>会议主持人</td>
            <td>
              <el-form-item prop="hosterid">
                <el-select v-model="directconf.hosterid" placeholder="请选择会议主持人">
                  <el-option
                    v-for="item in depusers"
                    :key="item.accid"
                    :label="item.usrname"
                    :value="item.accid"
                  />
                </el-select>
              </el-form-item>
            </td>
            <td>录入人</td>
            <td>
              <el-form-item prop="recorderid">
                <el-select v-model="directconf.recorderid" style="width:100%;" placeholder="请选择会议录入人">
                  <el-option
                    v-for="item in depusers"
                    :key="item.accid"
                    :label="item.usrname"
                    :value="item.accid"
                  />
                </el-select>
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td>输入会议地点</td>
            <td>
              <el-form-item prop="confaddress">
                <el-input
                  v-model="directconf.confaddress"
                  placeholder="输入会议地点"
                  clearable/>
              </el-form-item>
            </td>
            <td>选择开始时间</td>
            <td>
              <el-form-item prop="starttime">
                <el-time-select
                  v-model="directconf.starttime"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  placeholder="起始时间"
                />
              </el-form-item>
            </td>
            <td>选择结束时间</td>
            <td>
              <el-form-item prop="endtime">
                <el-time-select
                  v-model="directconf.endtime"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                    minTime: directconf.starttime
                  }"
                  placeholder="结束时间"
                />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td>与会人员</td>
            <td colspan="5">
              <el-row>
                <el-col :span="20">
                  <el-form-item prop="attenders">
                    <el-select
                      v-model="directconf.attenders"
                      style="width:100%;"
                      multiple
                      filterable
                      placeholder="请选择与会人员"
                    >
                      <el-option
                        v-for="item in depusers"
                        :key="item.accid"
                        :label="item.usrname"
                        :value="item.accid"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button style="float:right;margin-top:10px;" @click="handleGroupSelect"><i
                    class="el-icon-caret-bottom"/>分组选择</el-button>
                </el-col>
              </el-row>
              <el-row v-if="isgroup" style="width: 500px;">
                <div>
                  <BtnUsrSelect
                    v-for="item in allsecdeps"
                    :key="item.id"
                    :secdepname="item.depname"
                    :secdepid="item.id+''"
                    @callback="handlerSecCall"
                    @cleanselect="handlecleanselect"/>
                </div>
              </el-row>
            </td>
          </tr>

          <tr>
            <td >会议内容记录</td>
            <td colspan="5" style="border: 1px solid #E4E7ED;">
              <RecorderArea :pspechlist.sync="spechlist"/>
              <el-form-item prop="maincontent" style="display:none;">
                <el-input v-model="directconf.maincontent" type="textarea" placeholder="请输入会议内容记录" rows="20" resize="none" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>输入会议结论</td>
            <td colspan="5">
              <el-form-item prop="conclusion">
                <el-input v-model="directconf.conclusion" type="textarea" placeholder="请输入会议结论" rows="10" resize="none" />
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td colspan="7" style="text-align:center;">
              <el-button type="danger" @click="handlesubconf">结束会议</el-button>
            </td>
          </tr>
        </table>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Watermark from '@/external/watermark'
import { mapGetters } from 'vuex'
import { getallconflevel, getallconfattr, getallsemesters } from '@/api/comm'
import { loadDepUsers, queryAllSecDep } from '@/api/orderconf'
import { directRecord } from '@/api/recordconf'
import RecorderArea from '@/components/RecorderArea'
import BtnUsrSelect from '@/components/BtnUsrSelect'
import { Splitter } from '@fullcalendar/core'
export default {
  name: 'Directrecord',
  components: {
    RecorderArea,
    BtnUsrSelect
  },
  data() {
    const semestervalidator = (rule, value, callback) => {
      if (this.directconf.semester === '') {
        callback(new Error('请选择学期'))
      } else {
        callback()
      }
    }
    const conftypeValidator = (rule, value, callback) => {
      if (this.directconf.conftype === '') {
        callback(new Error('请选择会议类别'))
      } else {
        callback()
      }
    }
    const confattrValidator = (rule, value, callback) => {
      if (this.multiflag === 0) {
        return
      }
      if (this.directconf.confattr.length === 0) {
        callback(new Error('请选择会议属性'))
      } else {
        callback()
      }
    }
    const attendersValidator = (rule, value, callback) => {
      if (this.multiflag === 0) {
        return
      }
      if (this.directconf.attenders.length === 0) {
        callback(new Error('请选择参会人员'))
      } else {
        callback()
      }
    }

    return {
      // 表单校验规则
      directconfRules: {
        confname: [{ required: true, message: '请输入会议名称', trigger: 'blur' }],
        semesters: [{ validator: semestervalidator, trigger: ['blur', 'change'] }],
        confattr: [{ validator: confattrValidator, trigger: ['blur', 'change'] }],
        conftype: [{ validator: conftypeValidator, trigger: ['blur', 'change'] }],
        hosterid: [{ required: true, message: '请选择主持人', trigger: 'blur' }],
        recorderid: [{ required: true, message: '请输入记录人', trigger: 'blur' }],
        confaddress: [{ required: true, message: '请输入会议地址', trigger: 'blur' }],
        starttime: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        endtime: [{ required: true, message: '请输入结束时间', trigger: 'blur' }],
        attenders: [{ validator: attendersValidator, trigger: ['blur', 'change'] }],
        // maincontent: [{ required: true, message: '请输入主要内容', trigger: 'blur' }],
        conclusion: [{ required: true, message: '请输入结论', trigger: 'blur' }]
      },
      // 学期
      semesters: [],
      // 会议属性
      confattrs: [],
      // 会议类别
      conflevels: [],
      // 当前用户所在部门的所有用户
      depusers: [],

      multiflag: 0, // 默认为0

      directconf: {
        confname: '', // 会议名称
        semester: '', // 学年
        confattr: '', // 会议属性
        conftype: '', // 会议类别
        hosterid: '', // 审核人id
        recorderid: '', // 会议记录人id
        confaddress: '', // 会议地点
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        attenders: '', // 参会人员
        maincontent: '', // 会议主要内容
        conclusion: '' // 输入会议结论
      },

      spechlist: [], // 会议记录详情

      allsecdeps: [], // 当前用户所在部门下的所有二级部门

      isgroup: false // 分组选择显示于隐藏
    }
  },
  computed: {
    ...mapGetters(['name', 'accid'])
  },
  created() {
    // 获取所有的学期
    getallsemesters().then(response => {
      this.semesters = response.data
    })
    // 获取所有的会议属性
    getallconfattr().then(response => {
      this.confattrs = response.data
    })
    // 获取所有的会议类别
    getallconflevel().then(response => {
      this.conflevels = response.data
    })
    // 加载当前用户所在部门下的所有二级部门
    queryAllSecDep(this.accid).then(resp => {
      this.allsecdeps = resp.data
    })
    // 加载本部门下的所有的用户
    this.fetchDepUsers()
  },
  mounted() {
    // 设置页面水印
    Watermark.set('高校党政云记录管理平台 ' + this.name, this.$refs.directrecordwp)
  },
  methods: {
    // 处理查询所有用户
    fetchDepUsers() {
      loadDepUsers(this.accid).then(response => {
        this.depusers = response.data
        this.directconf.hosterid = String(this.accid) // 审核id
        this.directconf.recorderid = String(this.accid) // 记录人员id
      })
    },
    // 处理录入会议记录
    handlesubconf() {
      const _that = this
      this.multiflag = 1
      this.$confirm('确定提交该会议记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['directconffm'].validate((valid) => {
          if (valid) {
            // 首先添加会议记录人和会议审核人
            _that.checkUsrCotain(_that.directconf.hosterid)
            _that.checkUsrCotain(_that.directconf.recorderid)
            // 格式化会议记录的内容
            const spechlist = _that.spechlist
            var spechstr = ''
            console.log(spechlist)
            for (let i = 0, len = spechlist.length; i < len; i++) {
              spechstr += '【' + spechlist[i].title + '】\n\r'
              spechstr += '议题内容:' + spechlist[i].record + '\n\r'
              spechstr += '议题结论:' + spechlist[i].concolusion + '\n\r'
            }
            _that.directconf.maincontent = spechstr
            directRecord(_that.directconf).then(resp => {
              if (resp.ok) {
                this.$message.success('提交会议记录成功!')
                this.$router.push('/confrecord/validating') // 查看已经提交的页面
              } else {
                this.$message.error(resp.msg)
              }
            })
          } else {
            this.$message.error('请检查字段是否填写完整')
            return false
          }
        })
      }).catch(() => {
      })
    },
    /**
     * 检查参与会议人员是否选中了uid，如果没有则添加进去
     */
    checkUsrCotain(uid) {
      if (uid === undefined) {
        return
      }
      var flag = false
      // 获取参会人员
      const attenders = this.directconf.attenders
      for (var i = 0; i < attenders.length; i++) {
        if (uid === attenders[i]) {
          flag = true
          break
        }
      }
      // 如果没有找到则放入数组中
      if (!flag) {
        this.directconf.attenders.push(uid)
      }
    },

    /**
     * 分组显示与隐藏的切换
     */
    handleGroupSelect() {
      this.isgroup = !this.isgroup
    },

    /**
     * 当用户选中
     */
    handlerSecCall(data) {
      console.log('设置选中:', data)
      if (data instanceof Array) {
        // 将用户添加进去
        var usrarray = []
        for (let i = 0, len = data.length; i < len; i++) {
          usrarray.push(String(data[i].workerid))
        }
        this.addArray(this.directconf.attenders, usrarray)
      }
    },
    /**
     * 清空选择
     */
    handlecleanselect(data) {
      console.log('取消选中:', data)
      if (data instanceof Array) {
        var usrarray = []
        for (let i = 0, len = data.length; i < len; i++) {
          usrarray.push(String(data[i].workerid))
        }
        this.removeArray(this.directconf.attenders, usrarray)
      }
    },

    // 查看是否包含某个
    hasContains(array, val) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (String(array[i]) === String(val)) {
          return true
        }
      }
      return false
    },

    // 查看某个元素的索引
    getValIndex(array, val) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (String(array[i]) === String(val)) {
          return i
        }
      }
      return -1
    },
    // 添加array，如果已经存在则不需要
    addArray(array, addingarray) {
      if (array instanceof Array && addingarray instanceof Array) {
        for (let i = 0, len = addingarray.length; i < len; i++) {
          if (!this.hasContains(array, addingarray[i])) {
            array.push(addingarray[i])
          }
        }
      }
    },
    // 移除array中所有包括rmingarray中的内容
    removeArray(array, rmingarray) {
      if (array instanceof Array && rmingarray instanceof Array) {
        for (let i = 0, len = rmingarray.length; i < len; i++) {
          const index = this.getValIndex(array, rmingarray[i])
          // 如果找到
          if (index !== -1) {
            array.splice(index, 1)
          }
        }
      }
    }

  }
}
</script>

<style scoped>
.wrapper {
  margin: 20px;
}

.mtable {
  margin: 0 auto;
}

.mtable tr {
  /* height: 50px;
  line-height: 50px; */
  /* padding-top: 1px; */
  padding-bottom: 10px;
  border: solid 1px red;
}

.mtable tr td:nth-child(2n+2) {
  padding-bottom: 10px;
  height:70px;
}

.el-form-item {
    margin-bottom: 0px;
}

</style>
