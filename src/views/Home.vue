<template>
  <el-container>
    <el-aside width="auto">
      <side-menu :sidebar="sidebar"></side-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-button class="sidebar" size="mini" plany @click="changeSidebar">
          <span v-show="!sidebar" class="el-icon-s-fold font"></span>
          <span v-show="sidebar" class="el-icon-s-unfold font"></span>
        </el-button>
        <Breadcrumb class="breadcrumb"></Breadcrumb>
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
          <el-link href="https://www.baidu.com/" target="_blank">网站</el-link>
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
import Breadcrumb from "../components/Breadcrumb";
export default {
  name: "Home",
  data() {
    return {
      userInfo: {
        id: '',
        username: '',
        avatar: '',
      },
      sidebar: false
    }
  },
  components:{
    SideMenu,Tabs,Breadcrumb
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
    },
    changeSidebar(){
      this.sidebar = !this.sidebar
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
  background-color: white;
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
.breadcrumb{
  float: left;
  height: 57px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.sidebar{
  float: left;
  position: relative;
  top: 15px;
  right: 10px;
  background-color: white;
  border: 0 solid white;
}
.font{
  font-size: 20px;
}
</style>
