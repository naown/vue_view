<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="请输入名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRoleList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定要批量删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delStatus">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="code"
          label="唯一编码"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="operate"
          label="操作">
        <template slot-scope="scope">
          <el-button size="mini" round type="primary" @click="permHandler(scope.row.id)">分配权限</el-button>
          <el-button size="mini" round type="success" style="margin-right: 10px" @click="editHandle(scope.row)">编辑</el-button>
          <template>
            <el-popconfirm title="确定要删除该角色吗？" @confirm="delHandle(scope.row.id)">
              <el-button size="mini" round type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="size"
        :total="total">
    </el-pagination>

    <!-- 新增弹窗 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 权限弹窗 -->
    <el-dialog
        title="分配权限"
        :close-on-click-modal="false"
        :visible.sync="permDialogVisible"
        width="600px">
      <el-form :model="permForm">
        <el-tree
            :data="permTreeData"
            show-checkbox
            :check-strictly="true"
            ref="permTree"
            :default-expand-all="true"
            node-key="id"
            :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermFormHandler()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
name: "Role",
  data() {
    return {
      currentPage: 1,
      total: 10,
      size: 10,
      dialogVisible: false,
      permDialogVisible: false,
      editForm: {},
      permForm: {},
      permTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchForm: {

      },
      delStatus: true,
      tableData: [],
      editFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入唯一编码', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'blur' }
        ]
      },
      /* 多选框选中的数据 */
      multipleSelection: []
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.delStatus = val.length <= 0
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getRoleList()
    },
    resetForm(formName) {
      //this.$refs[formName].resetFields();
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
      this.dialogVisible = false
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              message: '角色保存成功',
              type: 'success'
            });
            this.getRoleList()
            this.resetForm(formName)
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    getRoleList() {
      this.$axios.get('/role/list',{
        params: {
          name: this.searchForm.name,
          current: this.currentPage,
          size: this.size
        }
      }).then(res =>{
        console.log(res,'role/list')
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    editHandle(editForm) {
      this.editForm = editForm
      this.dialogVisible = true
    },
    delHandle(id) {
      let ids = []
      if (id){
        ids.push(id)
      }else {
        this.multipleSelection.forEach(row =>{
          ids.push(row.id)
        })
      }
      console.log(ids,'ids')
      this.$axios.post('/role/delete', ids).then(res => {
        this.$message({
          message: '角色删除成功',
          type: 'success'
        });
        this.getRoleList()
      })
    },
    permHandler(id) {
      this.permDialogVisible = true
      this.$axios.get('/role/info/'+ id).then(res => {
        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
        this.permForm = res.data.data
      })
    },
    getPermTreeData() {
      this.$axios.get('/menu/list').then(res => {
        this.permTreeData = res.data.data
      })
    },
    submitPermFormHandler() {
      let menuIds = this.$refs.permTree.getCheckedKeys()
      this.$axios.post('/role/perm/'+ this.permForm.id, menuIds).then(res =>{
        this.$message({
          message: '权限保存成功',
          type: 'success'
        });
        this.getRoleList()
        this.permDialogVisible = false
      })
    }
  },
  created() {
    this.getRoleList()
    this.getPermTreeData() // TODO 需要改善方法 此请求是获取角色权限信息 是否能否进行一个请求方法解决
  }
}
</script>

<style scoped>
  .el-pagination{
    float: right;
    margin-top: 16px;
  }
  .el-button--mini, .el-button--mini.is-round{
    padding: 7px 10px;
  }
</style>
