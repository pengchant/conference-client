<template>
  <div class="container" style="width:100%;height:100%; margin: 0 auto;">
    <FullCalendar
      :plugins="calendarPlugins"
      :all-day-slot="false"
      :header="{
        left:'prev',
        center:'title',
        right: 'today ,next'
      }"
      :slot-event-overlap="false"
      :events="eventList"
      :button-text="{
        today: '今天'
      }"
      :unselect-auto="false"
      :select-overlap="false"
      :business-hours="{
        startTime: '07:00',
        endTime:'18:00',
        daysOfWeek: [ 1, 2, 3, 4, 5, 6, 0 ]
      }"
      :select-allow="handlerSeelctAllow"
      height="auto"
      now-indicator="true"
      select-mirror="true"
      min-time="07:00:00"
      max-time="23:00:00"
      selectable="true"
      slot-duration="00:30"
      slot-label-format="HH:mm"
      title-format="YYYY年MM月D日"
      default-view="timeGridWeek"
      locale="zh-cn"
      @dateClick="handleDateClick"
      @select="handleSelect"/>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlulgin from '@fullcalendar/timegrid'
import '@fullcalendar/core/locales/zh-cn' // 支持中文
import momentPlugin from '@fullcalendar/moment'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'PickTimer',
  components: {
    FullCalendar
  },
  props: {
    // 传递过来的历史的数据
    eventList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin, timeGridPlulgin, momentPlugin, interactionPlugin],
      // 随时判断时间是否合法，通过返回true/false来判断是否能够选择
      handlerSeelctAllow: info => {
        const currentDate = new Date()
        const start = info.start
        const end = info.end
        if (start <= end && start >= currentDate && end >= currentDate) {
          return true
        } else {
          this.$emit('cancelselect')
          return false
        }
      }
    }
  },
  watch: {
    eventData(oldvalue, newvalue) {
      console.log(oldvalue, newvalue)
    }
  },
  methods: {
    // 当点击时候
    handleDateClick(arg) {
      this.$emit('clickDate', arg)
    },
    // 当选择结束的时候获取开始和结束时间
    handleSelect(info) {
      this.$emit('selectTimeRange', info)
    }
  }
}
</script>

<style lang="scss" scope>
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';
@import '@fullcalendar/timegrid/main.css';
</style>

