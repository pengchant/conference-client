<template>
  <div ref="recconf_ref" style="padding:20px;">
    <el-container>
      <el-main style="padding:0px;">
        <el-card :body-style="{ padding: '20px' }" shadow="never" class="box-card">
          <table class="mytable" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width:120px;">会议名称</td>
              <td
                class="align-center"
                colspan="5"
                style="color:red;font-weight:700;font-size:20px;"
              >{{ basicConfInfoView.confname }}</td>
            </tr>
            <tr>
              <td>学期</td>
              <td colspan="5">{{ basicConfInfoView.semestername }}</td>
            </tr>
            <tr>
              <td>会议属性</td>
              <td colspan="5">
                <el-tag
                  v-for="item in confattrs"
                  :key="item.attrdes"
                  style="margin-left:20px;"
                >{{ item.attrdes }}</el-tag>
              </td>
            </tr>
            <tr>
              <td>会议类别</td>
              <td style="min-width:140px;">校级会议</td>
              <td style="width:100px;">主持人</td>
              <td>
                <el-select
                  v-model="basicConfInfoView.hosterid"
                  style="width:100%;border:none;"
                  placeholder="请选择主持人"
                  @change="modifyholder"
                >
                  <el-option
                    v-for="item in attendersViews"
                    :key="item.workerid"
                    :label="item.usrname"
                    :value="item.workerid"
                  />
                </el-select>
              </td>
              <td style="width:100px;">录入人</td>
              <td>
                <el-select
                  v-model="basicConfInfoView.recorderid"
                  style="width:100%;border:none;"
                  placeholder="请选择录入人"
                >
                  <el-option
                    v-for="item in attendersViews"
                    :key="item.workerid"
                    :label="item.usrname"
                    :value="item.workerid"
                  />
                </el-select>
              </td>
            </tr>
            <tr>
              <td>会议地点</td>
              <td>{{ basicConfInfoView.roomname }}</td>
              <td>开始时间</td>
              <td>{{ basicConfInfoView.starttime.substr(0, 19) }}</td>
              <td>结束时间</td>
              <td>{{ basicConfInfoView.endtime.substr(0, 19) }}</td>
            </tr>
          </table>
        </el-card>
      </el-main>
    </el-container>
    <el-container>
      <el-aside width="290px">
        <el-card :body-style="{ padding: '0px' }" class="box-card" style="min-height:200px;">
          <div slot="header" class="clearfix">
            <span>参会人员</span>
          </div>
          <el-table :data="attendersViews" :show-header="false" border style="width: 100%">
            <el-table-column prop="usrname" />
            <el-table-column width="180" align="center">
              <template slot-scope="scope">
                <!-- workerid, usrname, hasattend -->
                <span v-if="scope.row.hasattend==='1'">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="handleCancelAttend(scope.$index, scope.row)"
                  >
                    <i class="el-icon-error" />&nbsp;取消
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    @click="handleClicked(scope.$index, scope.row)"
                  >
                    <i class="el-icon-edit-outline" />&nbsp;发言
                  </el-button>
                </span>
                <span v-else>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleAttend(scope.$index, scope.row)"
                  >
                    <i class="el-icon-success" />&nbsp;签到
                  </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-aside>
      <el-container>
        <el-main style="padding:0px;">
          <el-card :body-style="{ padding: '20px' }" class="box-card">
            <!--//////////////////////////动态切换tab标签////////////////////////////////////////// -->
            <el-tabs v-model="activeName" type="card">
              <!-- 会议议题采集 -->
              <el-tab-pane label="议题采集表格" name="first">
                <!-- 我的表格1 -->
                <table class="mytable" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td colspan="2" class="align-center">{{ basicConfInfoView.confname }}会议议题采集表</td>
                  </tr>
                  <tr>
                    <td colspan="2">一、会议召集人：{{ confCollectBasicInfoView.collegeleader }}</td>
                  </tr>
                  <tr>
                    <td colspan="2">二、上次会议所提议题/问题的解决情况</td>
                  </tr>

                  <!-- 加载二、上次会议所提议题/问题的解决情况 -->
                  <tr v-for="(item,index) in confLastIssueViewList" :key="'last_'+item.issuelastid">
                    <td style="width:30px;" class="align-center">{{ index+1 }}</td>
                    <td>{{ item.maincontent }}</td>
                  </tr>

                  <tr>
                    <td colspan="2">二、本次会议需决议的议题</td>
                  </tr>

                  <!-- 加载二、本次会议需决议的议题 -->
                  <tr
                    v-for="(item,index) in confCurIssueViewsList"
                    :key="'cur_' + item.issuecurrent"
                  >
                    <td style="width:30px;" class="align-center">{{ index+1 }}</td>
                    <td>{{ item.mainconent }}</td>
                  </tr>

                  <tr>
                    <td colspan="2">三、建议解决方案</td>
                  </tr>

                  <!-- 加载三、建议解决方案 -->
                  <tr
                    v-for="(item,index) in confSuggestionViewList"
                    :key="'sug_' + item.issuecurrent"
                  >
                    <td style="width:30px;" class="align-center">{{ index+1 }}</td>
                    <td>{{ item.maincontent }}</td>
                  </tr>
                </table>
                <div style="margin-top:20px;text-align:center;">
                  <el-button type="primary" @click="exportcollect">
                    <i class="el-icon-download" />导出议题采集表
                  </el-button>
                </div>
              </el-tab-pane>

              <!-- 录入会议内容 -->
              <el-tab-pane label="记录会议内容" name="second">
                <el-row style="margin-top:10px;margin-bottom:10px;">
                  <el-col :span="16" style="text-align:center;">
                    <FlagPager
                      :initindex = "initPagerIndex"
                      :titles="confCurIssueViewsList"
                      titlekey="issuecurrent"
                      titlevalue="mainconent"
                      @triggerafter="handleAfter"
                      @triggerbefore="handleBefore"
                    />
                    <!-- 输入议题 -->
                    <!-- <el-select v-model="curtitle" style="width:100%;" placeholder="请选择会议议题">

                      <el-option
                        v-for="item in confCurIssueViewsList"
                        :key="item.issuecurrent"
                        :label="item.mainconent"
                        :value="item.mainconent"
                      />

                    </el-select>-->
                  </el-col>
                  <el-col :span="4" style="text-align:center;">
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      style="margin-left:10px;"
                      @click="newConfTitle"
                    >新增议题</el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      type="success"
                      icon="el-icon-success"
                      style="margin-left:10px;"
                      @click="endRecordConf"
                    >结束会议</el-button>
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
                              <el-col :span="13">
                                <el-input
                                  :rows="5"
                                  v-model="uspeach.content"
                                  type="textarea"
                                  placeholder="请输入发言内容"
                                />
                              </el-col>
                              <el-col :span="4">
                                <!-- 录音笔 -->
                                <MRecorder @handleStop="handelEndRecord($event,index, uindex)" />
                              </el-col>
                              <el-col :span="4">
                                <!-- 条件判断是否已经修改 -->
                                <section v-if="uspeach.speechid==null">
                                  <el-button
                                    plain
                                    style="float:right;margin-top:20px;margin-right:20px;"
                                    type="primary"
                                    @click="handleSaveRecitem(index, uindex)"
                                  >保存</el-button>
                                </section>
                                <section v-else>
                                  <el-button
                                    plain
                                    style="float:right;margin-top:20px;margin-right:20px;"
                                    type="success"
                                    @click="handleModifyRecitem(index, uindex)"
                                  >修改</el-button>
                                </section>

                                <el-button
                                  plain
                                  style="float:right;margin-top:20px;margin-right:20px;"
                                  type="danger"
                                  @click="handleRemoveRecitem(index, uindex, value.recordid, uspeach.speechid)"
                                >删除</el-button>
                              </el-col>
                            </el-row>
                          </el-form-item>

                          <!-- ////////////////////////////录音区域///////////////////////////// -->
                          <section v-for="(audio, aindex) in uspeach.audiolist" :key="aindex">
                            <!-- 录音播放区域 -->
                            <el-card shadow="never">
                              <el-row>
                                <el-col :span="14">
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
                                <el-col :span="10" style="text-align:right;">
                                  <!-- 判断是否已经上传，如果已经上传就不显示上传按钮了 -->
                                  <section v-if="audio.audioid==null">
                                    <!-- 操作按钮 -->
                                    <el-button
                                      type="success"
                                      style="float:right;margin-right:20px;"
                                      icon="el-icon-upload"
                                      plain
                                      circle
                                      @click="handleUploadVoice(index, uindex, aindex)"
                                    />
                                  </section>
                                  <el-button
                                    type="danger"
                                    style="float:right;margin-right:20px;"
                                    icon="el-icon-delete"
                                    plain
                                    circle
                                    @click="handleRMVoice(index, uindex, aindex)"
                                  />
                                </el-col>
                              </el-row>
                            </el-card>
                          </section>
                        </section>

                        <!-- 输入当前议题的结论 -->
                        <section
                          v-for="(conftitle, conftitleindex) in confTitleConclusions"
                          :key="'curcon_' + conftitleindex"
                        >
                          <section v-if="conftitle.conftitlecnt == curtitle">
                            <el-row>
                              <el-col :span="3" class="text-center">议题结论</el-col>
                              <el-col :span="21">
                                <el-input
                                  v-model="confTitleConclusions[conftitleindex].conclusion"
                                  :rows="6"
                                  type="textarea"
                                  placeholder="请输入当前议题的结论"
                                />
                              </el-col>
                            </el-row>
                            <!-- 会议结论按钮 -->
                            <el-row style="margin-top:30px;">
                              <el-col :span="24" class="text-center">
                                <el-button
                                  type="danger"
                                  @click="sageCurTitleConclusion(conftitleindex)"
                                >保存议题结论</el-button>
                              </el-col>
                            </el-row>
                          </section>
                        </section>
                      </el-form>
                    </section>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 录入会议决议 -->
              <!-- <el-tab-pane label="录入会议结论" name="third">
                <Editor
                  id="tinymce"
                  v-model="tinymceHtml"
                  :init="editorInit"
                  aria-placeholder="请输入会议结论"
                />
                <div style="width:100%;margin:20px;text-align:center;">
                  <el-button type="danger" @click="saveconclusion">保存结论</el-button>
                </div>
              </el-tab-pane> -->
            </el-tabs>
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <!-- //////////////////////用户模态框///////////////////////////// -->
    <el-dialog :visible.sync="dialogVisible" title="新增议题" width="40%">
      <div>
        <el-input v-model="newConftitleTXT" placeholder="请输入议题内容" clearable />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddConfTitle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Watermark from '@/external/watermark'
import '@/external/css/bubble.css'
import { Timeline, TimelineItem, TimelineTitie } from 'vue-cute-timeline'
import MRecorder from '@/components/MRecorder'
import FlagPager from '@/components/FlagPager'
import { usrAttend, usrcancelattend } from '@/api/comm'
import {
  loadConfDetail,
  downloadCollect,
  loadAttenders
} from '@/api/orderconf'
import {
  newSpeachItem,
  uploadSpeachItem,
  removeVoiceRecord,
  removeSpeachItem,
  modifySpeachContent,
  newcurcitlte,
  queryCurISSUE,
  saveConclusion,
  generateVoiceUrl,
  modifyHolder,
  endRecordConf,
  saveConfTitleConclusion,
  queryConftitles
} from '@/api/recordconf.js'

// import tinymce from 'tinymce/tinymce'
// import 'tinymce/themes/silver/theme'
// import Editor from '@tinymce/tinymce-vue'

// import 'tinymce/plugins/image'
// import 'tinymce/plugins/link'
// import 'tinymce/plugins/code'
// import 'tinymce/plugins/table'
// import 'tinymce/plugins/lists'
// import 'tinymce/plugins/contextmenu'
// import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'

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
  name: 'Recconf',
  components: {
    MRecorder,
    Timeline,
    TimelineItem,
    TimelineTitie,
    // Editor,
    FlagPager
  },

  data() {
    return {
      confid: 24, // 会议的编号
      activeName: 'second', // 标签激活的name【议题采集表格】【记录会议内容】【录入会议内容】
      attendersViews: [], // 列席人员表

      // 会议的基本信息
      basicConfInfoView: {
        confid: '', //  会议的编号
        confname: '', // 会议的名称
        endtime: '', // 结束时间
        hoster: '', // 主持人
        hosterid: '', // 主持人工号
        levelname: '', // 等级名称
        recorder: '', // 记录员
        recorderid: '', // 记录员编号
        roomid: '', // 房间的编号
        roomname: '', // 房间的名称
        semestername: '', // 学期的名称
        starttime: '' // 开始时间
      },

      confCollectBasicInfoView: {}, // 会议采集基本信息
      confCurIssueViewsList: [], // 当前待解决问题
      confLastIssueViewList: [], // 上次所提议题
      confSuggestionViewList: [], // 建议解决方案
      confTitleConclusions: [], // 议题的内容+结论
      initPagerIndex: 0, // 初始化FlagPager展示的index
      confattrs: [], // 会议属性

      // 会议记录内容列表(数据结构)
      recordlist: [],

      // ////
      curspeaker: {}, // 当前发言人
      curtitle: null, // 当前会议议题

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

      // ///////
      dialogVisible: false, // 是否显示模态框
      newConftitleTXT: ''
    }
  },
  computed: {
    ...mapGetters(['name', 'accid'])
  },
  mounted() {
    // tinymce.init({})
    // 设置页面水印
    Watermark.set('高校党政云记录管理平台 ' + this.name, this.$refs.recconf_ref)
  },
  created() {
    var _that = this
    // 首先获取到会议的编号
    this.confid = this.$route.query.confid
    // 加载详细内容
    loadConfDetail(this.confid).then(response => {
      if (response.ok) {
        const data = response.data
        // 基本信息
        this.basicConfInfoView = data.basicConfInfoView
        this.basicConfInfoView.hosterid = String(
          this.basicConfInfoView.hosterid
        )
        // 设置结论
        this.tinymceHtml = this.basicConfInfoView.conclusion
        // 参会人员列表
        this.attendersViews = data.attendersViews
        // 会议属性
        this.confattrs = data.confattrs
        // 会议议题采集基本信息
        this.confCollectBasicInfoView = data.confCollectBasicInfoView
        // 上次议题
        this.confLastIssueViewList = data.confLastIssueViewList
        // 本次议题
        this.confCurIssueViewsList = data.confCurIssueViewsList
        // 建议议题
        this.confSuggestionViewList = data.confSuggestionViewList
        // 议题的结论
        this.confTitleConclusions = data.confTitleViewList

        // 解析会话列表
        const recorderList = data.confRecVoicDetailViewList
        const len = recorderList.length // 待解析的列表的长度

        var _recordS = this.recordlist // 原始的列表数据

        // 设置默认的会议议题
        if (
          this.confCurIssueViewsList &&
          this.confCurIssueViewsList.length > 0
        ) {
          this.curtitle = this.confCurIssueViewsList[0].mainconent
        }

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
      } else {
        this.$message.error(response.msg)
      }
    })
  },
  methods: {
    // 点击保存用户结论
    sageCurTitleConclusion(id) {
      const confcon = this.confTitleConclusions[id]
      saveConfTitleConclusion({
        conclusion: confcon.conclusion,
        conftitleid: confcon.id
      }).then(resp => {
        if (resp.ok) {
          this.$message.success('保存结论成功')
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    // 点击上一个议题
    handleBefore(index) {
      this.curtitle = this.confCurIssueViewsList[index].mainconent
    },
    // 点击下一个议题
    handleAfter(index) {
      this.curtitle = this.confCurIssueViewsList[index].mainconent
    },
    // 签到
    handleAttend(index, row) {
      usrAttend({
        confid: this.confid,
        workerid: row.workerid
      }).then(response => {
        if (response.ok) {
          // 重新加载数据
          loadAttenders(this.confid).then(res => {
            this.attendersViews = res.data
          })
        }
      })
    },

    // 导出议题采集表
    exportcollect() {
      downloadCollect(this.confid).then(data => {
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          this.basicConfInfoView.confname + '会议采集表.docx'
        )
        document.body.appendChild(link)
        link.click()
      })
    },

    // 取消签到
    handleCancelAttend(index, row) {
      usrcancelattend({
        confid: this.confid,
        workerid: row.workerid
      }).then(response => {
        if (response.ok) {
          // 重新加载数据
          loadAttenders(this.confid).then(res => {
            this.attendersViews = res.data
          })
        }
      })
    },

    // 点击结束录音
    handelEndRecord(argus, windex, uindex) {
      console.log(windex, uindex, argus)
      // 设置url
      var newaudio = new Audio(null, argus, '')
      this.recordlist[windex].speachlist[uindex].audiolist.push(newaudio)
    },

    // 新增议题
    newConfTitle() {
      this.dialogVisible = true
    },

    // 点击发言
    handleClicked(index, row) {
      const that = this

      // 首先获取当前议题的title
      const curtitle = this.curtitle
      // 获取当前选择的用户
      this.curspeaker = row

      // 标记是否存在本conftitle
      var confflag = false

      // 判断当前是否选中
      if (curtitle !== '' && curtitle !== null) {
        // 获取该title最后一个发言人是否为选中的人员
        for (var i = 0; i < this.recordlist.length; i++) {
          // 判断是否包含本conftitle
          if (curtitle === this.recordlist[i].conftitle) {
            // 标记conftitle已经存在
            confflag = true
            var speachlist = this.recordlist[i].speachlist
            const len = speachlist.length
            var newspeaker = {}
            if (len > 0) {
              const lastspeaker = speachlist[0]
              if (lastspeaker.speakerid === that.curspeaker.workerid) {
                that.$message.error('请继续输入发言内容')
              } else {
                newspeaker = new Speech(
                  row.workerid,
                  row.usrname,
                  '',
                  [],
                  null
                )
                speachlist.unshift(newspeaker)
              }
            } else {
              newspeaker = new Speech(row.workerid, row.usrname, '', [], null)
              speachlist.push(newspeaker)
            }
            break
          }
        }

        if (confflag === false) {
          // 新增一个议题
          var newConftitle = new RecorderItem(null, curtitle, [])
          this.recordlist.push(newConftitle)
          // 直接新增一个用户
          var newSpeacher = new Speech(row.workerid, row.usrname, '', [], null)
          this.recordlist[this.recordlist.length - 1].speachlist.push(
            newSpeacher
          )
        }
      } else {
        this.$message.error('请先选择当前会议的议题')
      }
    },

    // 点击删除按钮
    handleRemoveRecitem(index, uindex, recordid, speechid) {
      var that = this
      try {
        this.$confirm('你确定要删除该条记录吗，包括录音将一起删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const confrecorid =
              that.recordlist[index].speachlist[uindex].speechid
            // 如果还未曾保存用户发言记录，就直接移除页面上的元素
            if (
              confrecorid == null ||
              confrecorid === '' ||
              confrecorid === undefined
            ) {
              that.recordlist[index].speachlist.splice(uindex, 1)
              return
            } else {
              // 执行删除记录的操作(请求后台)
              removeSpeachItem({
                recorid: confrecorid
              }).then(response => {
                if (response.ok === true) {
                  that.recordlist[index].speachlist.splice(uindex, 1)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  that.$message.error(response.msg)
                }
              })
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } catch (e) {
        console.log(e)
      }
    },

    // 保存会议议题
    handleSaveRecitem(index, uindex) {
      var that = this
      const param = {
        confid: this.confid,
        conftitle: this.curtitle,
        content: this.recordlist[index].speachlist[uindex].content,
        speakerid: this.curspeaker.workerid,
        speakername: this.curspeaker.usrname
      }
      newSpeachItem(param).then(response => {
        if (response.ok === true) {
          that.$message.success('保存成功!')
          const dt = response.data
          // 设置记录编号
          that.recordlist[index].speachlist[uindex].speechid = dt.id
          // 设置议题编号
          that.recordlist[index].recordid = dt.conftitleid

          // 重新加载confttile
          queryConftitles(this.confid).then(resp => {
            this.confTitleConclusions = resp.data
            console.log('重新加载议题后:', this.confTitleConclusions)
          })
        } else {
          that.$message.error(response.msg)
        }
      })
    },

    // 上传voice到后台
    handleUploadVoice(index, sindex, aindex) {
      var that = this
      this.$confirm('确定要上传该录音?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 录音blob文件
          const blobvoice =
            that.recordlist[index].speachlist[sindex].audiolist[aindex]
              .audiourl
          // 会议议题的编号
          const conftitleid = that.curtitle
          // 会议发言记录的编号
          const confrecid = that.recordlist[index].speachlist[sindex].speechid

          // 判断当前议题
          if (
            conftitleid === null ||
            conftitleid === '' ||
            conftitleid === undefined
          ) {
            that.$message.error('对不起请先选择议题!')
            return
          }
          // 判断当前的发言记录是否已经保存
          if (
            confrecid != null &&
            confrecid !== '' &&
            confrecid !== undefined
          ) {
            uploadSpeachItem(
              {
                confrecid: confrecid, // 发言编号
                voice: blobvoice.mblob // 发言的语音文件
              },
              function(result) {
                console.log(result)
                if (result.ok === true) {
                  that.$message.success('上传录音成功!')
                  // 设置id
                  that.recordlist[index].speachlist[sindex].audiolist[
                    aindex
                  ].audioid = result.data.id
                } else {
                  that.$message.error('上传录音失败!')
                }
              }
            )
          } else {
            that.$message.error('请先上传该条记录')
          }
        })
        .catch(() => {
          this.$message.info('录音已经取消上传')
        })
    },

    // 修改会议记录内容
    handleModifyRecitem(index, uindex) {
      const subdata = this.recordlist[index].speachlist[uindex]
      // 获取会议记录编号
      const confrecorid = subdata.speechid
      // 获取记录内容
      const content = subdata.content
      // 上传至后台
      modifySpeachContent({
        recorid: confrecorid,
        content: content
      }).then(response => {
        if (response.ok === true) {
          this.$message.success('修改成功!')
        } else {
          this.$message.error(response.msg)
        }
      })
    },

    // 删除录音
    handleRMVoice(index, uindex, aindex) {
      var audiolist = this.recordlist[index].speachlist[uindex].audiolist
      const audioid = audiolist[aindex].audioid
      this.$confirm('确定要删除该录音，删除后将无法撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除页面数据
          audiolist.splice(aindex, 1)
          // 删除后台
          if (audioid !== null) {
            console.log('准备请求后台删除,', audioid)
            removeVoiceRecord({
              voiceid: audioid
            }).then(response => {
              if (response.ok === true) {
                this.$message.success('删除录音成功!')
              } else {
                this.$message.error(response.msg)
              }
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 新增议题
    handleAddConfTitle() {
      // 获取议题内容
      const content = this.newConftitleTXT
      // 获取当前会议的议题采集表的编号
      const collectid = this.confCollectBasicInfoView.collectid
      console.log('add：', content, collectid)

      newcurcitlte({
        content: content,
        conftitleid: collectid
      }).then(response => {
        if (response.ok === true) {
          this.$message.success('录入会议议题成功!')
          // 修改会议议题下拉框
          queryCurISSUE({
            workerid: this.confid
          }).then(response => {
            console.log('增加议题之后==========>', response)
            if (response.ok === true) {
              this.confCurIssueViewsList = response.data
              // 设置最后一个显示c
              this.initPagerIndex = this.confTitleConclusions.length - 1
            } else {
              this.$message.error('加载失败')
            }
          })

          this.newConftitleTXT = ''
          // 关闭模态框
          this.dialogVisible = false
        } else {
          this.$message.error('录入会议议题失败!')
        }
      })
    },

    // 保存会议结论
    saveconclusion() {
      const savedata = this.tinymceHtml
      const curconfid = this.confid
      saveConclusion({
        confid: curconfid,
        consolusion: savedata
      }).then(response => {
        if (response.ok === true) {
          this.$message.success('保存会议成功!')
        } else {
          this.$message.error(response.msg)
        }
      })
    },

    // 修改会议主持人
    modifyholder() {
      const confid = this.confid
      const holderid = this.basicConfInfoView.hosterid
      console.log('准备修改holderid：', confid, holderid)
      modifyHolder({
        confid: confid,
        holderid: holderid
      }).then(response => {
        if (response.ok !== true) {
          this.$message.error(response.msg)
        }
      })
    },

    // 结束会议
    endRecordConf() {
      this.$confirm('您确定要结束会议录入吗，结束后您将无法修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          endRecordConf(this.basicConfInfoView.confid).then(resp => {
            if (resp.ok) {
              this.$message.success('操作成功!')
              this.$router.push({ path: '/dashboard' })
            } else {
              this.$message.error(resp.msg)
            }
          })
        })
        .catch(() => {
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
.align-center {
  text-align: center;
}
.align-left {
  text-align: left;
}
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

.primarytable {
  color: #e6a23c;
  font-weight: 600;
}

.mywrapper_ttile {
  border: 1px solid #e4e7ed;
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
  position: relative;
}

.speechsection {
  /* border:1px solid #e4e7ed; */
  padding: 20px;
  width: 100%;
  background: rgb(252, 252, 252);
}

.text-center {
  text-align: center;
}
</style>
