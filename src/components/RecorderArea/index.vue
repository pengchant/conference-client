<template>
  <div class="wrapper">
    <div>
      <el-row>
        <el-col :span="10">
          <el-button type="success" @click="newDialog">
          <i class="el-icon-circle-plus-outline"/>新增议题</el-button>
          <el-button type="danger" @click="delDialog">
          <i class="el-icon-remove-outline"/>删除议题</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;border-top:solid 1px #F2F6FC;padding-top:20px;">
        <el-col :span="24">
          <el-row>
            <el-col :span="5" style="text-align:left;">
              <el-button
                :title="(spechList.length > 1 && curindex > 0 )?spechList[curindex - 1].title:'没有了'"
                @click="handleBefore"><i class="el-icon-caret-left"/>上一个</el-button>
            </el-col>
            <el-col :span="14">
              <p :title="spechList[curindex]?spechList[curindex].title:''" class="yitititle">
                议题{{ curindex + 1 }} 【<span v-html="handlerStr(spechList[curindex]?spechList[curindex].title:'') "/>】
              </p>
            </el-col>
            <el-col :span="5" style="text-align:right;">
              <el-button
                :title="(spechList.length - 1 > curindex)?spechList[curindex + 1].title:'没有了'"
                @click="handleAfter">下一个<i class="el-icon-caret-right" /></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="3" class="input_tip">
          议题内容
        </el-col>
        <el-col :span="21">
          <el-input
            v-model="spechList[curindex].record"
            :rows="10"
            class="minput"
            type="textarea"
            placeholder="请输入会议内容"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="input_tip">
          议题结论
        </el-col>
        <el-col :span="21">
          <el-input
            v-model="spechList[curindex].concolusion"
            :rows="10"
            class="minput"
            type="textarea"
            placeholder="请输入会议结论"/>
        </el-col>
      </el-row>
    </div>

    <!-- 输入议题对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="新增议题">
      <el-input v-model="addNewTitle" placeholder="请输入会议议题" autocomplete="off"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerNewSpech">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 自定义会议记录的实体
 */
export class SpechItem {
  constructor(title, record, concolusion) {
    this.title = title
    this.record = record
    this.concolusion = concolusion
  }
}

export default {
  name: 'RecorderArea',
  props: {
    pspechlist: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      spechList: [new SpechItem('', '', '')], // 记录会议发言的实体
      curindex: 0, // 当前所在记录的索引
      addNewTitle: '', // 输入新议题

      dialogFormVisible: false // 对话框的显示于隐藏
    }
  },
  watch: {
    // 监听本地数据，实现数据的绑定
    spechList: function(newval, oldval) {
      this.$emit('update:pspechlist', newval)
    }
  },
  methods: {
    handlerStr(value) {
      if (value && value.length > 24) {
        value = value.substring(0, 19) + '...'
      } else if (this.isinit()) {
        value = '<span style="color:red;"><i>请点击新增按钮新增议题</i><span>'
      }
      return value
    },
    // 上一个
    handleBefore() {
      if (this.curindex === 0) {
        this.$message.success('没有了')
      } else {
        this.curindex = this.curindex - 1
      }
    },
    // 下一个
    handleAfter() {
      if (this.curindex === (this.spechList.length - 1)) {
        this.$message.success('没有了')
      } else {
        this.curindex = this.curindex + 1
      }
    },
    // 新增议题
    handlerNewSpech() {
      console.log(this.curindex, this.spechList)
      if (this.isinit()) {
        // 如果是初始情况
        this.spechList[0].title = this.addNewTitle
      } else {
        // 新增议题
        var newItem = new SpechItem(this.addNewTitle, '', '')
        this.spechList.push(newItem)
        this.curindex = this.spechList.length - 1
      }
      this.dialogFormVisible = false
    },
    // 打开新增议题对话框
    newDialog() {
      this.addNewTitle = ''
      this.dialogFormVisible = true
    },
    // 判断是否为初始情况
    isinit() {
      return (this.curindex === 0 && this.spechList.length === 1 &&
        this.spechList[0].title === '')
    },
    // 删除当前议题
    delDialog() {
      const _current = this
      this.$confirm('此操作将删除当前议题下的所有内容，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const viewindex = _current.curindex
        // 如果当前只有一个议题
        if (_current.curindex === 0 && _current.spechList.length === 1) {
          _current.spechList[0].record = ''
          _current.spechList[0].title = ''
          _current.spechList[0].concolusion = ''
        } else {
          this.curindex = this.curindex - 1 // 显示前一个
          _current.spechList.splice(viewindex, 1)
        }
        _current.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    }

  }
}
</script>

<style scoped>
.wrapper {
    width:100%;
    margin:0px!important;
    padding: 13px;
}

.minput {
    border:solid 1px #EBEEF5;
    border-bottom:none;
    margin-top:20px;
}

.yitititle {
  text-align: center;
  margin-top: 10px;
}

.input_tip {
  text-align: center;
  padding-top: 30px;
}
</style>
