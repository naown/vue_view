<template>
  <div>

    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getUserList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:user:save')">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定要批量删除吗？" @confirm="delHandle(null)">
<!--          <el-button type="danger" slot="reference" :disabled="delStatus" v-if="hasAuth('sys:user:del')">批量删除</el-button>-->
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
          prop="avatar"
          label="头像"
          width="120">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="roles"
          label="角色名称"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag size="small" type="info" v-for="item in scope.row.roles" :key="item.name">{{item.name}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="phone"
          label="手机号"
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
      <el-table-column prop="created" label="创建时间" show-overflow-tooltip>
        <template v-slot="scope">{{ scope.row.created | dateFormat }}</template>
      </el-table-column>
      <el-table-column
          prop="operate"
          label="操作"
      width="320px">
        <template slot-scope="scope">
          <el-button size="mini" round type="primary" @click="permHandler(scope.row)">分配角色</el-button>
          <el-button size="mini" round type="info" @click="repassHandler(scope.row.id,scope.row.username)">重置密码</el-button>
          <el-button size="mini" round type="success" style="margin-right: 10px" @click="editHandle(scope.row)">编辑</el-button>
          <template>
            <el-popconfirm title="确定要删除该用户吗？" @confirm="delHandle(scope.row.id)">
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
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
      <el-form :model="roleForm">
        <el-tree
            :data="roleTreeData"
            show-checkbox
            ref="roleTree"
            :check-strictly=checkStrictly
            node-key="id"
            :default-expand-all=true
            :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleHandler()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
name: "User",
  data() {
    return {
      dialogVisible: false,
      permDialogVisible: false,
      delStatus: true,
      currentPage: 1,
      size: 10,
      total: 10,
      roleForm: {},
      roleTreeData: [],
      multipleSelection: [],
      editForm: {},
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchForm: {

      },
      tableData: [],
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    delHandle(id){
      let ids = []
      if (id){
        ids.push(id)
      }else {
        this.multipleSelection.forEach(row =>{
          ids.push(row.id)
        })
      }
      console.log(ids,'ids')
      this.$axios.post('/user/delete', ids).then(res => {
        this.$message({
          message: '角色删除成功',
          type: 'success'
        });
        this.getUserList()
      })
    },
    getUserList(){
      this.$axios.get('/user/list',{
        params: {
          username: this.searchForm.username,
          current: this.currentPage,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    handleSizeChange(val){
      this.size = val
      this.getRoleList()
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getRoleList()
    },
    editHandle(editForm){
      this.editForm = editForm
      this.dialogVisible = true
    },
    getRoleIds(roles) {
      let roleIds = []
      roles.forEach(role => roleIds.push(role.id))
      return roleIds;
    },
    permHandler(val){
      this.permDialogVisible = true
      this.roleForm = val
      let roleIds = this.getRoleIds(val.roles)
      // 一个大坑如果不这样设置第一次访问会报错 因为tree组件未加载出来
      this.$nextTick(() => {
        this.$refs.roleTree.setCheckedKeys(roleIds)
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.delStatus = val.length <= 0
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              message: '用户保存成功',
              type: 'success'
            });
            this.getUserList()
            this.resetForm(formName)
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetForm(formName) {
      //this.$refs[formName].resetFields();
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
      this.dialogVisible = false
    },
    getRoleList() {
      this.$axios.get('/role/list').then(res => {
        this.roleTreeData = res.data.data.records
      })
    },
    repassHandler(id,username){
      this.$confirm('将重置用户【' + username + '】的密码,是否继续','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/user/repass',id).then(res => {
          this.$message({
            showClose: true,
            message: '密码修改成功',
            type: 'success'
          })
        })
      })
    },
    submitRoleHandler() {
      let roleIds = this.$refs.roleTree.getCheckedKeys()
      console.log(roleIds,'peram')
      this.$axios.post('/user/role/'+ this.roleForm.id, roleIds).then(res =>{
        this.$message({
          message: '权限保存成功',
          type: 'success'
        });
        this.getUserList()
        this.permDialogVisible = false
      })
    }
  },
  created() {
  this.getRoleList(); // TODO 此方法为加载角色权限用来分配权限，考虑优化此方法
  this.getUserList()
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
