<template>
  <div class="my-tag">
    <el-tag
        style="margin-left: 15px;cursor: pointer"
        v-for="tag in editableTabs"
        :key="tag.name"
        closable
        size="small"
        @click="clickTag(tag)"
        @close="handleClose(tag)"
        :type="tag.type">
      {{tag.title}}
    </el-tag>
  </div>
</template>

<script>
import {Notification} from "element-ui";

export default {
  name: "Tags",
  data() {
    return {
    }
  },
  methods: {
    /** 关闭事件 */
    handleClose(tag) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      console.log(tag)
      if (tag.name === 'Index'){
        Notification.warning({
          title: '提示',
          message: '首页标签不能被关闭'
        })
        return
      }

      if (activeName === tag.name) {
        tabs.forEach((tab, index) => {
          if (tab.name === tag.name) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      console.log(this.editableTabsValue,'active')
      this.editableTabs = tabs.filter(tab => tab.name !== tag.name);
      this.$router.push({name: activeName})
    },
    clickTag(target) {
      console.log(target,'target')
      console.log(this.editableTabsValue,'editableTabsValue')
      console.log(this.editableTabs,'editableTabs')
      this.$router.push({name: target.name})
    }
  },
  computed: {
    editableTabsValue: {
      get() {
        return this.$store.state.menus.editableTabsValue
      },
      set(val) {
        this.$store.state.menus.editableTabsValue = val
      }
    },
    editableTabs: {
      get() {
        return this.$store.state.menus.editableTabs
      },
      set(val) {
        this.$store.state.menus.editableTabs = val
      }
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .my-tag {
    padding: 5px 0;
    margin-bottom: 10px;
    cursor:pointer;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
</style>
