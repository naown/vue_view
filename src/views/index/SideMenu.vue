<template>
  <!-- 设置只能打开一个菜单列表 -->
  <el-menu
      :default-active=this.$store.state.menus.editableTabsValue
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="sidebar"
  >
    <el-menu-item index="Index" @click="selectMenu({name: 'Index',title: '首页'})">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
<!--    <el-menu-item index="Index" @click="selectMenu({name: 'Index',title: '首页'})">
      <template slot="title">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </template>
    </el-menu-item>-->
    <el-submenu :index="menu.name" v-for="menu in menuList" :key="menu.name">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{menu.title}}</span>
      </template>
      <router-link :to="{path : menuChildren.path}" v-for="menuChildren in menu.children" :key="menuChildren.name">
        <el-menu-item :index="menuChildren.name" @click="selectMenu(menuChildren)">
          <template slot="title">
            <i :class="menuChildren.icon"></i>
            <span slot="title">{{menuChildren.title}}</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "SideMenu",
  props:['sidebar'],
  data() {
    return {
    }
  },
  methods: {
    selectMenu(menuChildren) {
      this.$store.commit("ADD_TAB",menuChildren)
      this.$router.push('/index').catch((err)=>{})
    }
  },
  computed: {
    menuList: {
      get() {
        return this.$store.state.menus.menuList
      }
    }
  },
  watch: {
  }
}
</script>

<style>
.el-menu-vertical-demo{
  height: 100%;
}
.router-link-active {
  text-decoration: none;
}
a {
  text-decoration: none;
}
.el-menu{
  border-right-width: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
