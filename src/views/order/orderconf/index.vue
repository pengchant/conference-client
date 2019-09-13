<template>
  <div ref="orderconf_ref" class="container">
    <div class="header">
      <!-- 步骤条 -->
      <el-steps :active="stepnum">
        <el-step title="录入会议议题" icon="el-icon-edit"/>
        <el-step title="选择会议室" icon="el-icon-message"/>
        <el-step title="选择参会人员" icon="el-icon-edit-outline"/>
        <el-step title="等待审核" icon="el-icon-success"/>
      </el-steps>
    </div>

    <!-- 1.录入议题 -->
    <div v-if="stepnum===1" class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          录入会议议题
        </div>
        <div style="padding:30px;">
          <el-form ref="conforderform" :model="conforderform" label-width="120px">
            <el-row>
              <!-- <el-col :span="8">
                <el-form-item label="学年">
                  <el-input v-model="conforderform.years" placeholder="学年" clearable/>
                </el-form-item>
              </el-col> -->
              <el-col :span="9">
                <el-form-item label="学年">
                  <el-select
                    v-model="conforderform.semesterid"
                    style="width:100%;"
                    allow-create
                    placeholder="请选择学期">
                    <el-option
                      v-for="item in semesters"
                      :key="item.id"
                      :label="item.semestername"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="会议日期">
                  <el-date-picker
                    v-model="conforderform.weeksno"
                    style="width:100%"
                    type="date"
                    placeholder="选择会议日期"
                    value-format="yyyy-MM-dd"/>
                </el-form-item>
                <!-- <el-form-item label="会议日期">
                  <el-input v-model="conforderform.weeksno" placeholder="请输入周数" clearable/>
                </el-form-item> -->
              </el-col>
            </el-row>

            <el-form-item label="会议名称">
              <el-input v-model="conforderform.confname" style="width:70%;" placeholder="请输入会议名称" clearable/>
            </el-form-item>

            <el-form-item label="会议类别">
              <el-select v-model="conforderform.conflevel" style="width:70%;" placeholder="请选择会议的会议类别">
                <el-option
                  v-for="item in conflevels"
                  :key="item.id"
                  :label="item.leveldes"
                  :value="item.id"/>
              </el-select>
            </el-form-item>

            <el-form-item label="会议属性">
              <el-select
                v-model="conforderform.confattrs"
                style="width:70%;"
                multiple
                placeholder="请选择会议属性">
                <el-option
                  v-for="item in confattrs"
                  :key="item.id"
                  :label="item.attrdes"
                  :value="item.id"/>
              </el-select>
            </el-form-item>

            <!-- 开始和结束时间-->
            <el-form-item label="起止时间">
              <el-row>
                <el-col :span="20">
                  <el-time-select
                    v-model="conforderform.starttime"
                    :picker-options="{
                      start: '08:30',
                      step: '00:15',
                      end: '18:30'
                    }"
                    placeholder="起始时间"/>
                  <span>至</span>
                  <el-time-select
                    v-model="conforderform.endtime"
                    :picker-options="{
                      start: '08:30',
                      step: '00:15',
                      end: '18:30',
                      minTime: conforderform.starttime
                    }"
                    placeholder="结束时间"/>
                </el-col>
              </el-row>
            </el-form-item>

            <!-- 会议召集人，默认为当前登录用户，下拉选择 -->
            <el-form-item label="会议召集人">
              <el-select v-model="conforderform.leadername" style="width:40%;" placeholder="请选择会议召集人">
                <el-option
                  v-for="item in depusers"
                  :key="item.accid"
                  :label="item.usrname"
                  :value="item.accid"/>
              </el-select>
              <!-- <el-input v-model="conforderform.leadername" style="width:40%;" placeholder="请输入会议召集人" clearable/> -->
            </el-form-item>

            <el-form-item label="上次议题" >
              <!-- 渲染问题列表 -->
              <section v-for="(value, index) in conforderform.lastquestions" :key="index">
                <section v-if="index === 0">
                  <el-row>
                    <el-col :span="15">
                      <el-input v-model="conforderform.lastquestions[index]" placeholder="请输入议题" clearable @keyup.enter.native="addlastitems(index, '1')"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" icon="el-icon-plus" plain style="margin-left:10px;" circle @click="addlastitems(index, '1')"/>
                    </el-col>
                  </el-row>
                </section>
                <section v-if="index > 0">
                  <!-- 添加的子项目 -->
                  <el-row style="margin-top:10px;">
                    <el-col :span="15">
                      <el-input v-model="conforderform.lastquestions[index]" placeholder="请输入上次所提议题" clearable @keyup.enter.native="addlastitems(index, '1')"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="danger" icon="el-icon-delete" plain style="margin-left:10px;" circle @click="rmlastitems(index, '1')"/>
                    </el-col>
                  </el-row>
                </section>
              </section>
            </el-form-item>

            <el-form-item label="待解决的问题" >
              <!-- 渲染问题列表 -->
              <section v-for="(value, index) in conforderform.curquesttions" :key="index">
                <section v-if="index === 0">
                  <el-row>
                    <el-col :span="15">
                      <el-input v-model="conforderform.curquesttions[index]" placeholder="请输入本次会议待解决的问题" clearable @keyup.enter.native="addlastitems(index, '2')"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" icon="el-icon-plus" plain style="margin-left:10px;" circle @click="addlastitems(index, '2')"/>
                    </el-col>
                  </el-row>
                </section>
                <section v-if="index > 0">
                  <!-- 添加的子项目 -->
                  <el-row style="margin-top:10px;">
                    <el-col :span="15">
                      <el-input v-model="conforderform.curquesttions[index]" placeholder="请输入本次会议待解决的问题" clearable @keyup.enter.native="addlastitems(index, '2')"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="danger" icon="el-icon-delete" plain style="margin-left:10px;" circle @click="rmlastitems(index, '2')"/>
                    </el-col>
                  </el-row>
                </section>
              </section>
            </el-form-item>

            <el-form-item label="建议解决方案" >
              <!-- 渲染问题列表 -->
              <section v-for="(value, index) in conforderform.suggestions" :key="index">
                <section v-if="index === 0">
                  <el-row>
                    <el-col :span="15">
                      <el-input v-model="conforderform.suggestions[index]" placeholder="请输入建议解决方案" clearable @keyup.enter.native="addlastitems(index, '3')"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" icon="el-icon-plus" plain style="margin-left:10px;" circle @click="addlastitems(index, '3')"/>
                    </el-col>
                  </el-row>
                </section>
                <section v-if="index > 0">
                  <!-- 添加的子项目 -->
                  <el-row style="margin-top:10px;">
                    <el-col :span="15">
                      <el-input v-model="conforderform.suggestions[index]" placeholder="请输入建议解决方案" clearable @keyup.enter.native="addlastitems(index, '3')"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="danger" icon="el-icon-delete" plain style="margin-left:10px;" circle @click="rmlastitems(index, '3')"/>
                    </el-col>
                  </el-row>
                </section>
              </section>
            </el-form-item>

            <el-form-item style="text-align:center;">
              <el-button type="primary" @click="nextstep">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 2.选择会议室-->
    <div v-if="stepnum===2" class="content">

      <!-- 选择时间模态框 -->
      <el-dialog :visible.sync="dialogTableVisible" top="3vh" width="80%" title="查看会议室预约详情">
        <!-- 自己封装的小组件选择时间 -->
        <PickTimer
          :event-list="curRoomEvents"
          @selectTimeRange="handlerselectTimeRange"
          @cancelselect="handlecancelselect"/>
          <!-- 底部按钮，确定选择时间 -->
          <!-- <div style="text-align:center; margin-top:20px; ">
          <el-button type="primary" @click="handleSureSelect">确定</el-button>
          <el-button type="warning" @click="cancelSelectClose">取消</el-button>
        </div> -->
      </el-dialog>

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

      <!-- 选择会议室 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>选择会议室</span>
          <!-- 新增会议室按钮 -->
          <el-button style="float:right;" type="primary" @click="newMeetRoom"><i class="el-icon-circle-plus"/>&nbsp;新增会议室</el-button>
          <div
            style="text-align: center;
                padding: 10px;
                color: rgb(245, 108, 108);
                font-weight: 500;
                font-size: 17px; ">
            <i class="el-icon-bell" />您当前选择
            <el-tag type="primary" style="font-size:17px;">{{ (conforderform.selectedroom ==='') ? '--' : conforderform.selectedroom }}</el-tag>
          </div>

        </div>
        <div>
          <el-form label-width="80px">
            <!-- 会议条件搜索区域 -->
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="所属部门">
                <el-select v-model="confroomcondition.search.departmentid" placeholder="请选择所属部门" style="width:500px;">
                  <el-option label="所有部门" value="" />
                  <el-option
                    v-for="item in departments"
                    :key="item.id"
                    :label="item.departname"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <br>

              <!-- 筛选的条件 -->
              <el-form-item label="硬件条件">
                <button :class="'mybtn '+ (confroomcondition.search.kt?'mybtn_active':'')" type="button" @click="confroomcondition.search.kt = !(confroomcondition.search.kt)"><svg-icon icon-class="kt" />&nbsp;空调</button>
                <button :class="'mybtn '+ (confroomcondition.search.tyy?'mybtn_active':'')" type="button" @click="confroomcondition.search.tyy = !(confroomcondition.search.tyy)"><svg-icon icon-class="tyy" />&nbsp;投影仪</button>
                <button :class="'mybtn '+ (confroomcondition.search.mkf?'mybtn_active':'')" type="button" round @click="confroomcondition.search.mkf = !(confroomcondition.search.mkf)"><svg-icon icon-class="mkf" />&nbsp;麦克风</button>
                <button :class="'mybtn '+ (confroomcondition.search.yjt?'mybtn_active':'')" type="button" @click="confroomcondition.search.yjt = !(confroomcondition.search.yjt)"><svg-icon icon-class="yj" />&nbsp;演讲台</button>
                <button :class="'mybtn '+ (confroomcondition.search.yx?'mybtn_active':'')" type="button" @click="confroomcondition.search.yx = !(confroomcondition.search.yx)"><svg-icon icon-class="yx" />&nbsp;音响</button>
                <button :class="'mybtn '+ (confroomcondition.search.zmsb?'mybtn_active':'')" type="button" @click="confroomcondition.search.zmsb = !(confroomcondition.search.zmsb)"><svg-icon icon-class="zmsb" />&nbsp;照明设备</button>
                <el-button type="default" style="margin-left:30px;" @click="handlerSelectAllOr">全选/全不选</el-button>
              </el-form-item>
              <br>
              <el-form-item label="容纳人数">
                <el-slider
                  v-model="confroomcondition.search.contains"
                  :max="500"
                  style="width:500px;"
                  show-input/>
              </el-form-item>
              <br>
              <el-form-item style="float:left;">
                <el-button type="warning" @click="handleSearch"><i class="el-icon-search" />&nbsp;筛选查询</el-button>
              </el-form-item>
            </el-form>

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
                width="50"
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
                width="50"
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
                width="50"
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
                width="50"
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
                width="50"
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
                width="50"
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
                  <!-- 选择会议室按钮 -->
                  <el-button
                    size="mini"
                    type="primary"
                    @click="sbhandleSelectRoom(scope.$index, scope.row)"><i class="el-icon-success" />&nbsp;选择会议室</el-button>
                  <!-- 查看已经预约 -->
                  <el-button
                    size="mini"
                    type="success"
                    @click="handleSelectRoom(scope.$index, scope.row)"><i class="el-icon-success" />&nbsp;已预约</el-button>
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
            <!-- 操作区域 -->
            <el-form-item style="text-align:center;">
              <el-button type="success" @click="laststep">上一步</el-button>
              <el-button type="primary" @click="nextstep">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 3.选择参会人员-->
    <div v-if="stepnum===3" class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          选择参会人员
        </div>
        <div>
          <!-- 条件选择 -->
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="所属部门">
              <el-select
                v-model="selectcondtion.search.depid"
                placeholder="请选择所属部门"
                style="width:200px;">
                <el-option label="所有部门" value="" />
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.departname"
                  :value="item.id"
                  filterable
                  allow-create/>
              </el-select>
            </el-form-item>
            <el-form-item label="人员职务">
              <el-select
                v-model="selectcondtion.search.positionid"
                multiple
                placeholder="请选择人员职务"
                style="width:260px;">
                <el-option
                  v-for="item in mpositions"
                  :key="item.id"
                  :label="item.position"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="人员职位">
              <el-select
                v-model="selectcondtion.search.dutyid"
                multiple
                placeholder="请选择人员职位"
                style="width:260px;">
                <el-option
                  v-for="item in mdutys"
                  :key="item.id"
                  :label="item.duty"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="onSelectUsrSubmit"><i class="el-icon-search" />&nbsp;查询</el-button>
            </el-form-item>
          </el-form>
          <el-form label-width="80px">
            <div >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card :body-style="{ padding: '0px' }" class="box-card">
                    <div slot="header" class="clearfix">
                      <span style="color:#F56C6C;"><svg-icon icon-class="shalou" />&nbsp;选择人员</span>
                      <!-- 确定选中 -->
                      <el-button style="float:right;" type="warning" @click="handleChoosingMulti">批量选择人员<i class="el-icon-d-arrow-right"/></el-button>
                    </div>
                    <!-- 加载人员 -->
                    <el-table
                      ref="mloadusrtb"
                      :data="selectingdata"
                      :show-header="true"
                      border
                      style="width: 100%"
                      @selection-change="handleJZRYSelect">
                      <!-- 多选 -->
                      <el-table-column
                        type="selection"
                        width="40"
                        style="text-align:center;"/>
                      <el-table-column width="180" label="工号" prop="workerid"/>
                      <el-table-column label="姓名" prop="usrname"/>
                      <el-table-column
                        width="80"
                        label="操作"
                        align="center">
                        <template slot-scope="scope">
                          <section v-if="scope.row.selected === true">
                            <span>已选择</span>
                          </section>
                          <section v-else >
                            <el-button
                              type="success"
                              size="mini"
                              @click="selectUsr(scope.row)"
                            >选择</el-button>
                          </section>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div style="padding:10px;text-align:center;">
                      <el-pagination
                        :total="stotal"
                        :page-size="spageSize"
                        :current-page="scurrentPage"
                        background
                        layout="prev, pager, next"
                        @current-change="handleUsrChange"/>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12"/>

                <el-col :span="12">
                  <el-card :body-style="{ padding: '0px' }" class="box-card">
                    <div slot="header" class="clearfix">
                      <span style="color:#F56C6C;"><svg-icon icon-class="shalou" />&nbsp;已选择人员</span>
                    </div>
                    <!-- 已选择的人员 -->
                    <el-table
                      :data="selectedMembers"
                      border
                      style="width: 100%">
                      <el-table-column width="180" label="工号" prop="workerid"/>
                      <el-table-column label="姓名" prop="usrname"/>
                      <el-table-column
                        width="80"
                        label="操作"
                        align="center">
                        <template slot-scope="scope">
                          <el-button
                            type="danger"
                            size="mini"
                            @click="rmUsrSelected(scope.row)"
                          >删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
                <el-col :span="12"/>
              </el-row>
            </div>

            <el-form-item style="text-align:center;margin-top:20px;">
              <el-button type="success" @click="laststep">上一步</el-button>
              <el-button type="primary" @click="sureSubmit">确认提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 4.等待审核-->
    <div v-if="stepnum===4" class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          等待审核
        </div>
        <div style="width:100%; min-height:400px;">
          <div style="min-width:130px;min-height:100px; margin:0 auto;text-align:center;margin-top:40px;">
            <el-row>
              <el-col>
                <svg-icon icon-class="success" style="width:130px;height:130px;" />
              </el-col>
            </el-row>
            <el-row style="margin-top:30px;">
              <el-col>
                您的会议{{ conforderform.confname }}预约成功
              </el-col>
            </el-row>
            <el-row style="margin-top:30px;">
              <el-col>
                <el-button type="success" @click="returnhome">返回首页{{ ' ' + lastseconds + 's' }}</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import Watermark from '@/external/watermark'
import { mapGetters } from 'vuex'
import { getallconflevel, getallconfattr, getalldep, getallDuty, getallposition, getallsemesters } from '@/api/comm'
import { getRoomList, getRoomArange, getPeopleSelect, sureSubmitOrder, addNewRoom, loadDepUsers } from '@/api/orderconf'
import PickTimer from '@/components/PickTimer'
// 硬件条件
const hdcondtions = ['空调', '投影仪', '麦克风', '音响', '演讲台', '照明设备']

export default {
  name: 'Orderconf',
  components: {
    PickTimer
  },
  data() {
    return {
      checkAll: false,
      hds: hdcondtions,
      isIndeterminate: true,
      neewRoomDialog: false, // 是否显示新增会议室的模态框
      lastseconds: 10, // 剩余的秒数
      stepnum: 1, // 步骤的编号
      // 会议预约提交表单
      conforderform: {
        years: new Date().getFullYear(), // 年份
        semesterid: '', // 学期
        weeksno: '', // 第几周
        confname: '', // 会议名称
        conflevel: '', // 会议级别
        confattrs: [], // 会议属性
        starttime: '', // 会议开始时间
        endtime: '', // 会议结束时间
        lastquestions: [''], // 上次所提议题
        curquesttions: [''], // 待解决的问题
        suggestions: [''], // 建议解决的方案
        selectedroomid: '', // 选中会议室的编号
        selectedroom: '', // 选中的会议室
        selectAttenders: '', // 选中参会人员
        leadername: '' // 院领导姓名==>会议审核人员，记录审核人员
      },

      // 学期
      semesters: [],
      // 会议属性
      confattrs: [],
      // 会议级别
      conflevels: [],
      // 所属部门
      departments: [],
      // 所有职位
      mpositions: [],
      // 职务
      mdutys: [],
      // 当前用户所在部门的所有用户
      depusers: [],

      currentPage: 1, // 当前页面
      total: 1000, // 总记录数
      pageSize: 10, // 每页的大小

      // 会议室条件查询实体
      confroomcondition: {
        order: '',
        sort: '',
        page: 1,
        pagesize: 10,
        search: {
          departmentid: '', // 部门编号
          kt: false,
          tyy: false,
          mkf: false,
          yjt: false,
          yx: false,
          zmsb: false,
          contains: 10 // 容纳人数
        }
      },
      falg: 1, // 1:全选 2:全不选
      roomdata: [], // 会议室
      dialogTableVisible: false, // 选择时间模态框
      curRoomEvents: [], // 当前选择room下的时间安排

      selectedMembers: [], // 选择的人员
      selectingdata: [], // 人员的data

      // /////////////////////////////////////////////////////////
      // 用户条件查询条件
      selectcondtion: {
        page: 1,
        pagesize: 10,
        search: {
          depid: '', // 部门编号
          positionid: [], // 用户职务
          dutyid: [] // 用户职位
        }
      },

      // 新建会议室表单
      newRoomForm: {
        name: '', // 会议室名称
        department: '', // 会议室所属部门编号
        hardcondition: [] // 会议室硬件条件
      },

      stotal: 0, // 记录总数
      spageSize: 10, // 每页数据大小
      scurrentPage: 1, // 当前页

      // 标记多选的内容
      multipleUSRSelection: [],

      cleartimerid: null
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'accid'
    ])
  },
  created() {
    // 获取所有的会议属性
    getallconfattr().then(response => {
      this.confattrs = response.data
    })
    // 获取所有的会议级别
    getallconflevel().then(response => {
      this.conflevels = response.data
    })
    // 获取所有部门
    getalldep().then(response => {
      this.departments = response.data
    })
    // 获取所有职位
    getallposition().then(response => {
      this.mpositions = response.data
    })
    // 获取所有的学期
    getallsemesters().then(response => {
      this.semesters = response.data
    })
    // 获取所有职务
    getallDuty().then(response => {
      this.mdutys = response.data
    })
    // 获取数据
    this.fetchdata()
    // 获取待选择的用户信息
    this.fetchUsrSelecting()

    // 获取当前用户所在部门下的所有用户
    this.fetchDepUsers()

    // 默认需要选择当前用户作为会议记录人
    this.selectedMembers.push({
      'selected': true,
      'usrname': this.name,
      'workerid': String(this.accid)
    })
    // 设置选中
    this.setUsrSelected(this.accid, 1)
    console.log('默认选择=>', this.selectedMembers)
  },
  mounted() {
    Watermark.set('高校党政云记录管理平台 ' + this.name, this.$refs.orderconf_ref)
  },
  destroyed: function() {
    // 清除计时器
    clearInterval(this.cleartimerid)
  },
  methods: {
    // 条件查询
    handleSearch() {
      this.fetchdata()
    },
    // 获取当前用户所在部门的所有的用户
    fetchDepUsers() {
      loadDepUsers(this.accid).then(response => {
        this.depusers = response.data
        // 设置用户名
        this.conforderform.leadername = String(this.accid)
        console.log('当前==>', this.conforderform.leadername)
      })
    },

    fetchdata() {
      // 获取所有的会议
      getRoomList(this.confroomcondition).then(response => {
        const data = response.data
        this.roomdata = data.list
        this.total = data.total
        this.currentPage = data.pageNum
      })
    },
    laststep() {
      this.stepnum--
    },
    nextstep() {
      if (this.stepnum === 2 && this.conforderform.selectedroomid === '') {
        this.$message.error('对不起，请先选择会议室')
      } else {
        this.stepnum++
      }
    },

    // 添加上次所提议题
    addlastitems(index, type) {
      if (type === '1') {
        const lastitem = this.conforderform.lastquestions[this.conforderform.lastquestions.length - 1]
        if (lastitem.trim() === '') {
          this.$message.error('请您填写完一项后继续追加')
        } else {
          this.conforderform.lastquestions.push('')
        }
      } else if (type === '2') {
        const lastitem = this.conforderform.curquesttions[this.conforderform.curquesttions.length - 1]
        if (lastitem.trim() === '') {
          this.$message.error('请您填写完一项后继续追加')
        } else {
          this.conforderform.curquesttions.push('')
        }
      } else if (type === '3') {
        const lastitem = this.conforderform.suggestions[this.conforderform.suggestions.length - 1]
        if (lastitem.trim() === '') {
          this.$message.error('请您填写完一项后继续追加')
        } else {
          this.conforderform.suggestions.push('')
        }
      }
    },
    rmlastitems(index, type) {
      switch (type) {
        case '1':
          this.conforderform.lastquestions.splice(index, 1)
          break
        case '2':
          this.conforderform.curquesttions.splice(index, 1)
          break
        case '3':
          this.conforderform.suggestions.splice(index, 1)
          break
        default:
          break
      }
      this.$message.success('移除成功')
    },
    // 全选/全不选
    handlerSelectAllOr() {
      if (this.falg === 1) {
        this.confroomcondition.search.kt = true
        this.confroomcondition.search.tyy = true
        this.confroomcondition.search.mkf = true
        this.confroomcondition.search.yjt = true
        this.confroomcondition.search.yx = true
        this.confroomcondition.search.zmsb = true
        this.falg = 2
      } else if (this.falg === 2) {
        this.confroomcondition.search.kt = false
        this.confroomcondition.search.tyy = false
        this.confroomcondition.search.mkf = false
        this.confroomcondition.search.yjt = false
        this.confroomcondition.search.yx = false
        this.confroomcondition.search.zmsb = false
        this.falg = 1
      }
    },
    // 会议内容表单点击
    handlecurrentchange(val) {
      this.currentPage = val
      this.confroomcondition.page = val
      this.fetchdata()
    },
    // 处理编辑
    handleSelectRoom(index, row) {
      // 加载本room的所有安排
      getRoomArange(row.id).then(response => {
        console.log(response.data)
        this.dialogTableVisible = true
        this.curRoomEvents = response.data.map(function(value, index, arr) {
          console.log(value)
          return {
            title: value.confname,
            start: value.starttime.substr(0, 19),
            end: value.endtime.substr(0, 19),
            color: 'red'
          }
        })
      })
    },
    // 选择会议室
    sbhandleSelectRoom(index, row) {
      this.$confirm('确定选择会议室【' + row.roomname + '】?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 选择会议室
        this.conforderform.selectedroomid = row.id
        this.conforderform.selectedroom = row.roomname
      }).catch(() => {
        this.conforderform.selectedroomid = ''
        this.conforderform.selectedroom = ''
        this.$message.info('已取消选择')
      })
    },

    formatDate(date) {
      if (date instanceof Date) {
        return date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
         date.getDate() + ' ' +
         date.getHours() + ':' +
          date.getMinutes() + ':' +
          date.getSeconds()
      }
      return date
    },
    // 当选择完时间后
    handlerselectTimeRange(info) {
      // this.conforderform.starttime = info.startStr.replace('T', ' ').substr(0, 19)
      // this.conforderform.endtime = info.endStr.replace('T', ' ').substr(0, 19)
    },
    // 取消选择
    handlecancelselect() {
      this.conforderform.starttime = ''
      this.conforderform.endtime = ''
    },
    // 取消
    cancelSelectClose() {
      this.conforderform.starttime = ''
      this.conforderform.endtime = ''
      this.dialogTableVisible = false
      // 取消选择的房间
      this.conforderform.starttime = ''
      this.conforderform.endtime = ''
      this.conforderform.selectedroomid = ''
      this.conforderform.selectedroom = ''
    },
    // 确定选择时间
    handleSureSelect() {
      this.$confirm('确定选择【' + this.conforderform.starttime + '】到【' + this.conforderform.endtime + '】时间?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogTableVisible = false
        this.stepnum = 3
        // this.$message.success('选择成功')
      }).catch(() => {
        // 取消选择的房间
        this.conforderform.starttime = ''
        this.conforderform.endtime = ''
        this.conforderform.selectedroomid = ''
        this.conforderform.selectedroom = ''
        this.dialogTableVisible = false
        this.$message.info('已取消时间选择')
      })
    },

    // 获取所有待选择的人员
    fetchUsrSelecting() {
      getPeopleSelect(this.selectcondtion).then(response => {
        const data = response.data
        // 总的页数
        this.stotal = data.total
        // 当前页数
        this.scurrentPage = data.pageNum
        // 绑定选择的数据
        this.selectingdata = data.list
        // TODO:设置已经选中的任务无法重新选择
        const selectedUsrs = this.selectedMembers
        var _that = this
        this.selectingdata.map((val, index, arr) => {
          for (var i = 0; i < selectedUsrs.length; i++) {
            if (val.workerid === selectedUsrs[i].workerid) {
              _that.$set(_that.selectingdata[index], 'selected', true)
            }
          }
        })
      })
    },

    // 条件查询
    onSelectUsrSubmit() {
      this.fetchUsrSelecting()
    },

    // 右侧选项变化
    handleTransferChange(value, dir, keys) {
      this.conforderform.selectAttenders = value
    },

    // 最终的提交
    sureSubmit() {
      // 这里需要添加下选择的人员
      const selectedm = this.selectedMembers
      this.conforderform.selectAttenders = []
      selectedm.forEach((val, index, arr) => {
        this.conforderform.selectAttenders.push(val.workerid)
      })

      // 默认需要添加召集人(审核人)和记录人员(申请人)
      var lflag = false
      this.conforderform.selectAttenders.map((val, index, arr) => {
        if (val === String(this.conforderform.leadername)) {
          lflag = true
          return
        }
      })
      if (!lflag) {
        this.conforderform.selectAttenders.push(this.conforderform.leadername)
      }

      console.log('待提交的表单内容为：', this.conforderform)

      // TODO:这里需要 账户的编号 和用户的姓名
      const usr = {
        recorderid: this.accid,
        recorder: this.name
      }

      this.conforderform = Object.assign(this.conforderform, usr)
      this.$confirm('是否确定预约会议内容，提交后将不可更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        sureSubmitOrder(this.conforderform).then(response => {
          if (response.ok) {
            this.$notify({
              title: '操作提示',
              message: '预约会议:【' + this.conforderform.confname + '】成功'
            })
            this.stepnum = 4
            // 设置定时器，10s后返回首页
            const cleartimer = id => {
              clearInterval(id)
            }
            const timer = setInterval(() => {
              this.lastseconds--
              if (this.lastseconds <= 0) {
                cleartimer(timer)
                this.$router.push('/')
              }
            }, 1000)
            // 设置全局变量
            this.cleartimerid = timer
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    // 返回首页
    returnhome() {
      clearInterval(this.cleartimerid)
      this.$router.push('/')
    },

    // 新增会议室
    newMeetRoom() {
      this.neewRoomDialog = true
    },
    // 全选
    handleCheckAllChange(val) {
      this.newRoomForm.hardcondition = val ? hdcondtions : []
      this.isIndeterminate = false
    },
    // 处理选中某个单元的事件
    handleCheckedConditions(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.hds.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.hds.length
    },

    // 新增房间
    handleNewRoom() {
      console.log(this.newRoomForm)
      addNewRoom(this.newRoomForm).then(resp => {
        if (resp.ok) {
          console.log(resp.data)
          const inserteddata = resp.data
          this.$message.success('恭喜你录入新会议室成功!')
          // 重置表单
          this.newRoomForm = {}
          // 隐藏模态框
          this.neewRoomDialog = false
          // 重新加载数据
          this.fetchdata()
          // 设置当前选择的会议室
          this.conforderform.selectedroomid = inserteddata.id
          this.conforderform.selectedroom = inserteddata.roomname
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    // 点击选择用户参会会议
    handleUsrChange(val) {
      this.scurrentPage = val
      this.selectcondtion.page = val
      this.fetchUsrSelecting()
    },

    // 选择用户
    selectUsr(row) {
      // 检查一下是否已经有人
      var flag = false
      this.selectedMembers.map((val, index, arry) => {
        if (String(val.workerid) === row.workerid) {
          flag = true
          return
        }
      })
      if (flag) {
        this.$message.error('已选中!')
      } else {
        console.log(row)
        this.selectedMembers.push(row)
        // 设置选中
        this.setUsrSelected(row.workerid, 1)
      }
    },

    // 删除选中的人员
    rmUsrSelected(row) {
      if (row.workerid === String(this.accid)) {
        this.$message.error('对不起，您不能删除自己')
        return
      }
      this.selectedMembers.map((val, index, arr) => {
        // 删除元素
        if (row.workerid === val.workerid) {
          this.selectedMembers.splice(index, 1)
          this.$message.success('删除成功!')
          // 设置不选中
          this.setUsrSelected(row.workerid, 0)
        }
      })
    },

    // 设置某个选中
    setUsrSelected(wkid, type) {
      var _that = this
      this.selectingdata.map((val, index, arr) => {
        if (val.workerid === wkid) {
          if (type === 1) {
            _that.$set(_that.selectingdata[index], 'selected', true) // 设置属性选中
          } else if (type === 0) {
            _that.$set(_that.selectingdata[index], 'selected', false) // 设置属性选中
          }
        }
      })
    },

    // 加载人员
    handleJZRYSelect(val) {
      this.multipleUSRSelection = val
    },

    // 处理多选
    handleChoosingMulti() {
      const len = this.multipleUSRSelection.length

      if (len !== 0) {
        // todo:添加人员
        this.multipleUSRSelection.map((val, index, arr) => {
          this.selectUsr(val)
        })
        // 清空多选
        this.multipleUSRSelection = []
        this.$refs.mloadusrtb.clearSelection()
      } else {
        this.$message.error('对不起，请先选择人员!')
      }
    }

  }
}
</script>

<style scoped>
/**重写input样式 */
.el-input__inner, .el-textarea__inner {
    border: none;
    border-bottom: solid 1px #dcdfe6;
    border-radius: 0;
}

.container{
  width:95%;
  margin: 0 auto;
  height:auto;
}

.header {
  margin-top:20px;
}

.content {
  margin-top: 20px;
}

.mybtn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    border-radius: 20px;
    padding: 12px 23px;
    margin-left: 10px;
}

.mybtn_active {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}

.el-transfer-panel {
  width: 400px;
  height: 100%;
}

.el-transfer-panel__list.is-filterable {
    height: 460px;
    padding-top: 0;
}
</style>

<style>
body .el-table th.gutter{
    display: table-cell!important;
}
</style>

