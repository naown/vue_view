<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    // 监听标签被刷新时的情况，加载则再添加进标签
    watch: {
      $route(to,from) {
        if(to.path !== '/login'){
          let obj = {
            name: to.name,
            title: to.meta.title
          }
          this.$store.commit("ADD_TAB",obj)
        }
      }
    }
  }
</script>

<style>
  html, body, #app{
    font-family: "Helvetica Neue", "Hiragino Sans GB","WenQuanYi Micro Hei", "Microsoft YaHei", sans-serif;
    height: 100%;
    margin: 0;
    padding: 0;
    font-size: 15px;
  }
</style>
