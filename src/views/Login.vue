<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :xl="6" :lg="7">
        <h2>管理系统</h2>
        <!-- @表示src目录下面-->
        <el-image :src="require('@/assets/user-default.png')" style="height: 180px; width: 180px"></el-image>
        <p>内容说明</p>
        <p>登录密码为：******</p>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :xl="6" :lg="7">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
        <el-form-item label="用户名" prop="username" style="width: 380px">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password" style="width: 380px">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" style="width: 380px">
          <el-input v-model="loginForm.code" style="width: 156px;float: left"></el-input>
          <el-image :src="captchaImg" class="captchaImg" @click="getCaptchaImg()"></el-image>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">立即创建</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import qs from "qs";

export default {
name: "Login",
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        code: '11111',
        key: 'aaaaa'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur' }
        ]
      },
      captchaImg: ''
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/login?'+ qs.stringify(this.loginForm)).then(res => {
            const jwt = res.headers['authorization']
            this.$store.commit('SET_TOKEN',jwt)
            this.$router.push('/index')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptchaImg(){
      this.$axios.get('/captcha').then(res => {
        console.log(res)
        this.loginForm.key = res.data.data.key
        this.captchaImg = res.data.data.captchaImg
        this.loginForm.code = ''
      })
    }
  },
  created() {
    this.getCaptchaImg()
  }
}
</script>

<style scoped>
  .el-row{
    background-color: #fafafa;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
  }
  .el-divider{
    height: 200px;
  }
  .captchaImg{
    float: left;
    margin-left: 4px;
    border-radius: 8px;
  }
</style>
