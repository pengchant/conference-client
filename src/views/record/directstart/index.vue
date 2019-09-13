<template>
  <div class="wrapper">
    <el-card class="box-card" shadow="never">
      <table class="mtable">
        <tr>
          <td>输入会议名称</td>
          <td colspan="5">
            <el-input
              v-model="directconf.confname"
              width="100%"
              placeholder="请输入会议名称"
              clearable="true"
            />
          </td>
        </tr>
        <tr>
          <td>学期</td>
          <td>
            <el-select
              v-model="directconf.semesters"
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
          </td>
          <td>会议属性</td>
          <td colspan="3">
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
          </td>
        </tr>
        <tr>
          <td>会议类别</td>
          <td>
            <el-select v-model="directconf.conftype" placeholder="请选择会议的会议类别">
              <el-option
                v-for="item in conflevels"
                :key="item.id"
                :label="item.leveldes"
                :value="item.id"
              />
            </el-select>
          </td>
          <td>会议主持人</td>
          <td>
            <el-select v-model="directconf.hosterid" placeholder="请选择会议主持人">
              <el-option
                v-for="item in depusers"
                :key="item.accid"
                :label="item.usrname"
                :value="item.accid"
              />
            </el-select>
          </td>
          <td>录入人</td>
          <td>
            <el-select v-model="directconf.recorderid" placeholder="请选择会议录入人">
              <el-option
                v-for="item in depusers"
                :key="item.accid"
                :label="item.usrname"
                :value="item.accid"
              />
            </el-select>
          </td>
        </tr>

        <tr>
          <td>输入会议地点</td>
          <td>
            <el-input placeholder="输入会议地点" clearable="true" />
          </td>
          <td>选择开始时间</td>
          <td>
            <el-time-select
              v-model="directconf.starttime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="起始时间"
            />
          </td>
          <td>选择结束时间</td>
          <td>
            <el-time-select
              v-model="directconf.endtime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: directconf.starttime
              }"
              placeholder="起始时间"
            />
          </td>
        </tr>

        <tr>
          <td>与会人员</td>
          <td colspan="5">
            <el-select
              v-model="directconf.attenders"
              style="width:100%;"
              multiple
              filterable
              placeholder="请选择会议录入人">
              <el-option
                v-for="item in depusers"
                :key="item.accid"
                :label="item.usrname"
                :value="item.accid"
              />
            </el-select>
          </td>
        </tr>

        <tr>
          <td>会议内容记录</td>
          <td colspan="5">
            <el-input type="textarea" placeholder="请输入会议内容记录" rows="20" resize="none" />
          </td>
        </tr>
        <tr>
          <td>输入会议结论</td>
          <td colspan="5">
            <el-input type="textarea" placeholder="请输入会议结论" rows="10" resize="none" />
          </td>
        </tr>

        <tr>
          <td colspan="7" style="text-align:center;">
            <el-button type="danger">提交会议内容</el-button>
          </td>
        </tr>
      </table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getallconflevel, getallconfattr, getallsemesters } from '@/api/comm'
import { loadDepUsers } from '@/api/orderconf'
export default {
  name: 'Directstart',
  data() {
    return {
      // 学期
      semesters: [],
      // 会议属性
      confattrs: [],
      // 会议级别
      conflevels: [],
      // 当前用户所在部门的所有用户
      depusers: [],

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
      }
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
    // 获取所有的会议级别
    getallconflevel().then(response => {
      this.conflevels = response.data
    })
    // 加载本部门下的所有的用户
    this.fetchDepUsers()
  },
  methods: {
    fetchDepUsers() {
      loadDepUsers(this.accid).then(response => {
        this.depusers = response.data
        this.directconf.hosterid = String(this.accid) // 审核id
        this.directconf.recorderid = String(this.accid) // 记录人员id
      })
    }
  }
}
</script>

<style lang="css" scope>
.wrapper {
  margin: 20px;
}

.mtable {
  margin: 0 auto;
}

.mtable tr {
  height: 50px;
  line-height: 50px;
  /* padding-top: 1px; */
  padding-bottom: 10px;
  border: solid 1px red;
}

/**重写input样式 */
.el-input__inner,
.el-textarea__inner {
  border: none;
  border-bottom: solid 1px #dcdfe6;
  border-radius: 0;
}
</style>
