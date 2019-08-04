<template>
  <div style="width:90%;margin: 0 auto;">
    <div style="margin-top:20px;">
      <el-row :gutter="5">
        <el-col :span="6">
          <el-date-picker
            v-model="conditions.search.startime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期"
          />
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="conditions.search.entime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期"
          />
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
      height="650"
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
      <el-table-column label="操作" width="380" fixed="right" align="center">
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
            type="warning"
            @click="handleRecord(scope.$index, scope.row)"
          >会议记录</el-button>

          <el-button
            size="mini"
            plain
            type="success"
            @click="handlePass(scope.$index, scope.row)"
          ><i class="el-icon-success"/>&nbsp;通过</el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            @click="handleUnpass(scope.$index, scope.row)"
          ><i class="el-icon-error"/>&nbsp;不通过</el-button>

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

    <!-- 会议记录模态框 -->
    <el-dialog :visible.sync="dialogRecordFormVisible" width="70%" title="会议记录详情">
      <!--//////////////////////////动态切换tab标签////////////////////////////////////////// -->
      <el-tabs v-model="activeName" type="card">
        <!-- 会议议题采集 -->
        <el-tab-pane label="与会人员" name="first">
          <el-table :data="attendersViews" :show-header="false" border style="width: 100%">
            <el-table-column prop="usrname" />
            <el-table-column width="180" align="center">
              <template slot-scope="scope">
                <!-- workerid, usrname, hasattend -->
                <span v-if="scope.row.hasattend==='1'" style="color:#67C23A;"><i class="el-icon-success"/>&nbsp;签到</span>
                <span v-else style="color:#F56C6C;"><i class="el-icon-error" />&nbsp;缺席</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 录入会议内容 -->
        <el-tab-pane label="记录内容" name="second">
          <el-row style="margin-top:10px;margin-bottom:10px;">
            <el-col :span="3" style="text-align:center;">
              <span style="line-height:37px;">选择会议议题</span>
            </el-col>
            <el-col :span="10">
              <!-- 输入议题 -->
              <el-select v-model="curtitle" style="width:100%;" placeholder="请选择会议议题">
                <el-option
                  v-for="item in confCurIssueViewsList"
                  :key="item.issuecurrent"
                  :label="item.mainconent"
                  :value="item.mainconent"
                />
              </el-select>
            </el-col>
          </el-row>

          <!-- 会议记录功能区域 -->
          <div class="speechsection">
            <div v-for="(value, index) in recordlist" :key="index">
              <!-- ///////////////////////////如果选中了某个会议议题////////////////////////////// -->
              <section v-if="value.conftitle === curtitle">
                <!-- 会议记录内容部分 -->
                <el-form>
                  <!-- //////////////////////////////加载用户会话列表/////////////////////////// -->
                  <section v-for="(uspeach, uindex) in value.speachlist" :key="uindex">
                    <!-- 录入会议表单区域 -->
                    <el-form-item style="margin-top:20px;">
                      <!-- 用户信息区域 -->
                      <el-row>
                        <el-col :span="3" style="text-align:center;">
                          <div>
                            <svg-icon icon-class="fy_usr" style="font-size:40px;" />
                            <br >
                            <span
                              style="display:block;margin-top:-20px;"
                            >{{ uspeach.speakername ||'请选择发言人' }}</span>
                          </div>
                        </el-col>
                        <el-col :span="21">
                          {{ uspeach.content }}
                        </el-col>

                      </el-row>
                    </el-form-item>

                    <!-- ////////////////////////////录音区域///////////////////////////// -->
                    <section v-for="(audio, aindex) in uspeach.audiolist" :key="aindex">
                      <!-- 录音播放区域 -->
                      <el-card shadow="never">
                        <el-row>
                          <el-col :span="24">
                            <!-- 音频播放器 -->
                            <vue-audio-native
                              :show-current-time="true"
                              :show-controls="false"
                              :show-download="true"
                              :autoplay="false"
                              :wait-buffer="true"
                              :url="audio.audiourl.url"
                            />
                          </el-col>
                        </el-row>
                      </el-card>
                    </section>
                  </section>
                </el-form>
              </section>
            </div>
          </div>
        </el-tab-pane>

        <!-- 录入会议决议 -->
        <el-tab-pane label="会议结论" name="third">
          <div v-html="tinymceHtml"/>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogRecordFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <div style="height:50px;" />
  </div>
</template>

<script>
import MRecorder from '@/components/MRecorder'
import { getvaliRecord, generateVoiceUrl, passRecord, unpassRecord } from '../../../api/recordconf'
import { queryorderDetail, loadConfDetail } from '../../../api/orderconf'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'

/**
 * 会议内容记录实体类
 */
class RecorderItem {
  constructor(recordid, conftitle, speachlist) {
    this.recordid = recordid
    this.conftitle = conftitle
    this.speachlist = speachlist || []
  }
}

/**
 * 发言实体
 */
class Speech {
  constructor(speakerid, speakername, content, audiolist, speechid) {
    this.speakerid = speakerid
    this.speakername = speakername
    this.content = content
    this.audiolist = audiolist || []
    this.speechid = speechid
  }
}

/**
 * 录音实体
 */
class Audio {
  constructor(audioid, audiourl, description) {
    this.audioid = audioid
    this.audiourl = audiourl
    this.description = description
  }
}

export default {
  components: {
    Editor,
    MRecorder
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
          confname: '',
          endtime: '',
          startime: '',
          workerid: '9'
        }
      },
      // 修改表单是否隐藏
      dialogFormVisible: false,
      dialogRecordFormVisible: false,

      // 修改表单
      confattrform: {
        id: '',
        attrname: '',
        attrdes: ''
      },

      // 新增表单是否隐藏
      newFormVisible: false,

      // 激活tab标签标记
      activeName: 'first',
      // 参会人员显示
      attendersViews: [],
      // 会议结论
      tinymceHtml: '', // 会议的结论
      editorInit: {
        language_url: './static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: './static/tinymce/skins/ui/oxide',
        height: 500,
        plugins:
          'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false
      },
      curtitle: '', // 选中的会议议题
      recordlist: [], //  会议记录内容列表(数据结构)
      confCurIssueViewsList: [], // 会议所有议题
      confdetail: ''
    }
  },
  mounted() {
    tinymce.init({})
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
      getvaliRecord(this.conditions).then(response => {
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

    handleRecord(index, row) {
      // 查询会议记录
      this.queryConfDetail(row.conferenceid)
      this.dialogRecordFormVisible = true
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

    // 处理通过
    handlePass(index, row) {
      this.$confirm('是否确认通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        passRecord(row.conferenceid).then(resp => {
          if (resp.ok) {
            this.$message({
              type: 'success',
              message: '通过成功!'
            })
            // 重新加载数据
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: resp.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 处理不通过
    handleUnpass(index, row) {
      this.$confirm('是否确认不通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        unpassRecord(row.conferenceid).then(resp => {
          if (resp.ok) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            // 重新加载数据
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: resp.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 查询会议详情
    queryConfDetail(confid) {
      var _that = this
      // 加载详细内容
      loadConfDetail(confid).then(response => {
        if (response.ok) {
          const data = response.data
          // 基本信息
          this.basicConfInfoView = data.basicConfInfoView
          // 设置结论
          this.tinymceHtml = this.basicConfInfoView.conclusion
          // 参会人员列表
          this.attendersViews = data.attendersViews
          // 会议属性
          this.confattrs = data.confattrs
          // 本次议题
          this.confCurIssueViewsList = data.confCurIssueViewsList
          console.log(this.confCurIssueViewsList)
          this.curtitle = this.confCurIssueViewsList[0].mainconent
          // 解析会话列表
          const recorderList = data.confRecVoicDetailViewList
          const len = recorderList.length // 待解析的列表的长度

          var _recordS = this.recordlist // 原始的列表数据

          console.log('待解析：', recorderList)

          for (var i = 0; i < len; i++) {
            // ///////////////////////////////////// 如果为null直接跳过
            if (recorderList[i].recordid == null) {
              continue
            }

            // 会议议题
            var flag1 = 0 // 标记是否已经被添加
            var j = 0 // 标记是第几个
            for (j = 0; j < _recordS.length; j++) {
              if (recorderList[i].titlename === _recordS[j].conftitle) {
                flag1 = 1
                break
              }
            }
            // 如果未曾添加
            if (flag1 === 0 && recorderList[i].recordid != null) {
              var newRecorder = new RecorderItem(
                recorderList[i].titleid,
                recorderList[i].titlename,
                []
              )
              this.recordlist.push(newRecorder)
              j = this.recordlist.length - 1 // 修改j
            }

            // /////////////////////////////////// 如果没有人员发言就直接跳过
            if (recorderList[i].speakerid == null) {
              continue
            }
            // 发言实体
            var flag2 = 0
            const _speechList = _recordS[j].speachlist
            var k = 0
            for (k = 0; k < _speechList.length; k++) {
              if (recorderList[i].recordid === _speechList[k].speechid) {
                flag2 = 1
                break
              }
            }
            // 如果未曾添加
            if (flag2 === 0 && recorderList[i].speakerid != null) {
              var speechItem = new Speech(
                recorderList[i].speakerid,
                recorderList[i].speakername,
                recorderList[i].speaking,
                [],
                recorderList[i].recordid
              )
              // 添加到人员会话列表中
              this.recordlist[j].speachlist.push(speechItem)
              k = this.recordlist[j].speachlist.length - 1 // 修改k
            }

            // 录音实体(直接添加)
            if (recorderList[i].voiceid != null) {
              const voiceid = recorderList[i].voiceid // 编号
              const openid = recorderList[i].voiceurl // 录音的id
              if (voiceid != null) {
                var newVoice = new Audio(voiceid, generateVoiceUrl(openid), '')
                _that.recordlist[j].speachlist[k].audiolist.push(newVoice)
              }
            }
          }

          console.log('解析完毕后：', this.recordlist)
        } else {
          this.$message.error(response.msg)
        }
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
