<template>
  <el-container>
    <el-aside width="200px">
      <side-menu></side-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 首页标题 -->
        <strong>Vue管理系统</strong>
        <!-- 首页头像 -->
        <div class="header-avatar">
          <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{path: '/userCenter'}">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-link href="www.baidu.com" target="_blank">网站</el-link>
          <el-link href="https://www.bilibili.com/" target="_blank">B站</el-link>
        </div>
      </el-header>
      <el-main>
        <tabs></tabs>
        <div style="margin: 0 15px">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./index/SideMenu";
import Tabs from "./index/Tabs";
export default {
  name: "Home",
  data() {
    return {
      userInfo: {
        id: '',
        username: '',
        avatar: ''
      }
    }
  },
  components:{
    SideMenu,Tabs
  },
  methods: {
    getUserInfo() {
      this.$axios.get('/userInfo').then(res => {
        this.userInfo = res.data.data
      })
    },
    logout() {
      this.$axios.post('/logout').then(res => {
        localStorage.clear()
        sessionStorage.clear()
        this.$store.commit("RESET_STATE")
        this.$router.push('/login')
      })
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
}
.header-avatar{
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}
a {
  text-decoration: none;
}
</style>
