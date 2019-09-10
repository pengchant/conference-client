<template>
  <div class="flagwrapper">
    <el-row>
      <el-col :span="8">
        <el-button
          round
          type="warning"
          plain
          @click="before"
        >上一个:&nbsp;&nbsp;{{ pre_title?pre_title:"暂无" }}</el-button>
      </el-col>
      <el-col :span="8">
        <el-button round type="success" plain>当前议题:&nbsp;&nbsp;{{ cur_title?cur_title:"暂无" }}</el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          round
          type="warning"
          plain
          @click="next"
        >下一个:&nbsp;&nbsp;{{ next_title?next_title:"暂无" }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'FlagPager',
  props: {
    titles: {
      // 数组内容
      default: null,
      type: Array
    },
    titlekey: {
      // 数组key
      default: '',
      type: String
    },
    titlevalue: {
      // 数组值
      default: '',
      type: String
    }
  },
  data() {
    return {
      curindex: 0, // 当前索引
      pre_title: '', // 上一个议题
      next_title: '', // 下一个议题
      cur_title: '' // 当前议题
    }
  },
  watch: {
    titles(newValue, oldValue) {
      console.log(newValue, oldValue)
      this.init() // 重新渲染数据
    }
  },
  mounted() {
    console.log(this.titles)
  },
  created() {
    console.log(this.titles)
  },
  methods: {
    init() {
      this.curindex = 0
      if (this.titles && this.titles.length > 0) {
        this.cur_title = this.filterValue(this.titles[this.curindex][this.titlevalue])
        if (this.titles.length > 1) {
          this.next_title = this.filterValue(this.titles[this.curindex + 1][this.titlevalue])
        }
      }
    },
    // 前一个议题
    before() {
      if (this.titles && this.titles.length > 0 && this.curindex > 0) {
        this.curindex -= 1
        this.cur_title = this.titles[this.curindex] ? this.titles[this.curindex][this.titlevalue] : null
        this.pre_title = this.filterValue(
          this.titles[this.curindex - 1] ? this.titles[this.curindex - 1][this.titlevalue] : null
        )
        this.next_title = this.filterValue(
          this.titles[this.curindex + 1] ? this.titles[this.curindex + 1][this.titlevalue] : null
        )
        this.$emit('triggerbefore', this.curindex)
      } else {
        this.$message.warning('没有更多了')
      }
    },
    // 下一个议题
    next() {
      if (
        this.titles &&
        this.titles.length > 0 &&
        this.curindex < this.titles.length - 1
      ) {
        this.curindex += 1
        this.cur_title = this.titles[this.curindex] ? this.titles[this.curindex][this.titlevalue] : null
        this.pre_title = this.filterValue(
          this.titles[this.curindex - 1] ? this.titles[this.curindex - 1][this.titlevalue] : null
        )
        this.next_title = this.filterValue(
          this.titles[this.current + 1] ? this.titles[this.current + 1][this.titlevalue] : null
        )
        this.$emit('triggerafter', this.curindex)
      } else {
        this.$message.warning('没有更多了')
      }
    },
    // 格式化输出字符串
    filterValue(val) {
      if (!val) {
        return '暂无'
      }
      if (val.length > 10) {
        val = val.substr(0, 10) + '...'
      }
      return val
    }
  }
}
</script>

<style scoped>
.flagwrapper {
  width: 100%;
  text-align: center;
}
</style>
