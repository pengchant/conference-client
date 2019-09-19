<template>
  <div ref="confdetailview_ref" class="wrapper">
    <section v-if="directconf!==null">
      <table border="0" cellspacing="0" cellpadding="0" class="mtable">
        <tr>
          <td>会议名称</td>
          <td colspan="5">
            {{ directconf.confname }}
          </td>
        </tr>
        <tr>
          <td>学期</td>
          <td>
            {{ directconf.semester }}
          </td>
          <td>会议属性</td>
          <td colspan="3">
            {{ handleArray(directconf.confattrsArray) }}
          </td>
        </tr>
        <tr>
          <td>会议类别</td>
          <td>
            {{ directconf.conftype }}
          </td>
          <td>会议主持人</td>
          <td>
            {{ directconf.hoster }}
          </td>
          <td>录入人</td>
          <td>
            {{ directconf.recorder }}
          </td>
        </tr>

        <tr>
          <td>会议地点</td>
          <td>
            {{ directconf.confaddress }}
          </td>
          <td>开始时间</td>
          <td>
            {{ directconf.starttime && directconf.starttime.substr(0, 16) }}
          </td>
          <td>结束时间</td>
          <td>
            {{ directconf.endtime && directconf.endtime.substr(0, 16) }}
          </td>
        </tr>

        <tr>
          <td>与会人员</td>
          <td colspan="5">
            {{ handleArray(directconf.attendersArray) }}
          </td>
        </tr>

        <tr>
          <td>会议内容</td>
          <td colspan="5">
            {{ directconf.conftext }}
          </td>
        </tr>
        <tr>
          <td>会议结论</td>
          <td colspan="5">
            {{ directconf.conclusion }}
          </td>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Watermark from '@/external/watermark'
export default {
  name: 'ConfDetailView',
  props: {
    directconf: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    Watermark.set('高校党政云记录管理平台 ' + this.name, this.$refs.confdetailview_ref)
  },
  methods: {
    handleArray(marray) {
      var result = ''
      if (marray instanceof Array) {
        for (var i = 0; i < marray.length; i++) {
          result += marray[i]
          if (i < marray.length - 1) {
            result += ','
          }
        }
      }
      return result
    }
  }
}
</script>

<style scoped>
.wrapper {
  width:100%;
}
.mtable {
  width:100%;
}
/**重写表格样式 */
  .mtable tr td:nth-child(2n+1) {
    width:100px;
    text-align:center;
    line-height: 40px;
  }
  .mtable tr td {
    border:none;
    border-top:solid 1px lightblue;
    border-right: solid 1px lightblue;
    line-height:30px;
  }
  .mtable tr td:first-child {
    border-left: solid 1px lightblue;
  }
  .mtable tr:last-child td {
    border-bottom: solid 1px lightblue;
  }

  .mtable tr td:nth-child(2n) {
     padding:10px;
  }
</style>
