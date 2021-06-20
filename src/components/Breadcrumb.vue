<template>
  <div class="navbar clearfix">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index" :to="item.path" v-if="item.meta.title">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>

  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created(){
    this.getBreadcrumb()
  },
  methods:{
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0];
      if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style scoped>
/* /deep/ 样式穿透 */
/deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner{
  color: #909399;
}
/deep/ .el-breadcrumb__item .el-breadcrumb__inner{
  color: #303133;
  font-weight: normal;
}
</style>
