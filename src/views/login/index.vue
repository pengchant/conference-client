<template>
  <div class="mloginwrapper">
    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="beforeCloseregist"
      title="用户注册"
      width="50%"
      style="margin-top:-7vh;padding-bottom:7vh;">
      <!-- 注册开始 -->
      <el-form
        ref="registform"
        key="registinfo"
        :model="registinfo"
        :rules="registRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="您的姓名" prop="workername">
          <el-input v-model="registinfo.workername" clearable placeholder="输入您的姓名"/>
        </el-form-item>
        <el-form-item label="您的工号" prop="workerid">
          <el-input v-model="registinfo.workerid" clearable placeholder="输入您的工号"/>
        </el-form-item>
        <el-form-item label="所在部门" prop="departments">
          <el-select v-model="registinfo.depselected" style="width:100%" multiple placeholder="请选择部门">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.departname"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="您的职位" prop="positions">
          <el-select v-model="registinfo.posselected" style="width:100%" multiple placeholder="请选择职位">
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.position"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input v-model="registinfo.password" placeholder="请您设置密码" clearable type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpass">
          <el-input v-model="registinfo.confirmpass" placeholder="重新输入密码" clearable type="password" />
        </el-form-item>
        <el-form-item label="验证码" prop="validatecode">
          <slide-verify
            :l="42"
            :r="10"
            :w="310"
            :h="155"
            slider-text=">>向右滑动"
            @success="onSuccess"
            @fail="onFail"
            @refresh="onRefresh"
          />
        </el-form-item>
        <el-form-item style="text-align:center;">
          <el-button type="success" @click="doregistinfo"><i class="el-icon-circle-check-outline" />创建账号</el-button>
          <el-button type="warning" @click="backtologin"><i class="el-icon-circle-close-outline" />返回登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 注册结束 -->
    </el-dialog>

    <!-- 登录框 -->
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="off"
        label-position="left">

        <h3 class="title">高校党政会议云记录管理平台</h3>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <!-- 绑定登录的用户名 -->
          <el-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <!-- 用户密码 -->
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="请输入用户密码"
            @keyup.enter.native="handleLogin" /> <!-- 监听是否按下enter，则执行登录逻辑 -->
          <!-- 点击控制密码是可见还是不可见 -->
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <span style="display:inline-block;margin-bottom:20px;color:#409EFF;cursor:pointer;font-size:13px;" @click="startregist">
          还没账号，注册一个?
        </span>
        <el-form-item>
          <el-button :loading="loading" style="width:100%;" type="primary" @click.native.prevent="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getallposition, getalldep, registinfo } from '@/api/comm'
export default {
  name: 'Login',
  components: {
  },
  data() {
    // 验证用户名
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePass = (rule, value, callback) => {
      if (value === undefined || value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }

    // 验证再次输入的密码
    const validatePass2 = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.registinfo.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    // 验证选择内容
    const validatedep = (rule, value, callback) => {
      if (this.registinfo.depselected.length === 0) {
        callback(new Error('请选择部门内容'))
      } else {
        callback()
      }
    }

    const validatepos = (rule, value, callback) => {
      if (this.registinfo.posselected.length === 0) {
        callback(new Error('请选择职位内容'))
      } else {
        callback()
      }
    }

    return {
      // 登录表单
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      // 注册提交验证规则
      registRules: {
        workername: [{ required: true, message: '请输入您的姓名', trigger: 'blur' }],
        workerid: [{ required: true, message: '请输入您的工号', trigger: 'blur' }],
        departments: [{ required: true, validator: validatedep, trigger: 'change' }],
        positions: [{ required: true, validator: validatepos, trigger: 'change' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        confirmpass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      },
      // 标记是否加载
      loading: false,
      pwdType: 'password',
      redirect: undefined, // 重定向的地址
      dialogVisible: false, // 标记对话框是否隐藏

      registinfo: {
        workername: '', // 姓名
        workerid: '', // 工号
        depselected: [], // 选择的部门
        posselected: [], // 选择的职位
        password: '', // 密码
        confirmpass: '' // 确认密码
      }, // 注册的信息

      departments: [], // 加载的部门信息
      positions: [], // 加载的职位信息
      validateimg: false // 验证图片是否通过
    }
  },
  watch: {
    // 如果用户访问了没有权限的目标页面，就先暂时保存到this.redirect中，待登录成功后继续跳转
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    // 是否显示密码
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 处理登录逻辑
    handleLogin() {
      this.$refs.loginForm.validate(valid => { // 验证表单是否为空
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            // 如果有就跳转到原先的页面，如果没有就直接跳转到首页
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('无效的登录')
          return false
        }
      })
    },
    // 拖拽图片验证码
    onSuccess() {
      this.validateimg = true
      this.$message.success('验证成功!')
    },
    onFail() {
      this.validateimg = false
      this.$message.error('验证失败，请重试!')
    },
    onRefresh() {
      this.validateimg = false
    },
    // 返回登录页面
    backtologin() {
      this.dialogVisible = false
      this.$refs['registform'].resetFields()
    },
    // 提交用户注册
    doregistinfo() {
      this.$refs['registform'].validate((valid) => {
        if (valid) {
          if (this.validateimg) {
            registinfo(this.registinfo).then(response => {
              if (response.status === 200) {
                this.$message.success(response.data)
                // 清空表单
                this.$refs['registform'].resetFields()
                // 关闭模态框
                this.dialogVisible = false
              } else {
                this.registinfo.password = ''
                this.registinfo.confirmpass = ''
              }
              console.log(response)
            })
          } else {
            this.$message.error('图片验证失败!')
            return false
          }
        } else {
          return false
        }
      })
    },
    beforeCloseregist() {
      // 清空表单
      this.$refs['registform'].resetFields()
      // 关闭模态框
      this.dialogVisible = false
    },
    startregist() {
      this.dialogVisible = true
      // 获取职业
      getallposition().then(response => {
        this.positions = response.data
      })
      // 获取所有部门
      getalldep().then(response => {
        this.departments = response.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style scoped>
.v-select {
    margin-top:5px;
    height:39px;
}

.vs--searchable .vs__dropdown-toggle {
    cursor: text;
    height: 100%;
}

.mloginwrapper {
  width:100%;
  height:100%;
}

</style>
