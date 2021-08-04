<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- default-expand-all属性设置默认展开全部 -->
    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        lazy
        stripe
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="name"
          label="名称"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="perms"
          label="权限编码"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="icon"
          label="图标">
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag size="small" v-if="scope.row.type === 1" type="success">菜单</el-tag>
          <el-tag size="small" v-if="scope.row.type === 2" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="path"
          label="菜单URL">
      </el-table-column>
      <el-table-column
          prop="component"
          label="菜单组件">
      </el-table-column>
      <el-table-column
          prop="orderNum"
          label="排序号">
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
          <el-button size="mini" round type="success" style="margin-right: 10px" @click="editHandle(scope.row)">编辑</el-button>
          <template>
            <el-popconfirm title="确定要删除该菜单吗？" @confirm="delHandle(scope.row.id)">
              <el-button size="mini" round type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增弹窗 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="editForm.parentId === 0 ? '无' : editForm.parentId" placeholder="请选择上级菜单">
            <template v-for="item in tableData">
              <el-option :label="item.name" :value="item.id"></el-option>
              <template v-for="itemChildren in item.children">
                <el-option :label="itemChildren.name" :value="itemChildren.id">
                  <span>{{'- ' + itemChildren.name}}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="perms">
          <el-input v-model="editForm.perms"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" prop="path">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="editForm.component"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNumber">
          <el-input-number v-model="editForm.orderNum" :min="1" label="排序号"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
name: "Menu",
  data() {
    return {
      dialogVisible: false,
      editForm: {
        perms: '',
        orderNum: '',
        status: '',
        type: ''
      },
      editFormRules: {
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        perms: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择菜单状态', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请输入排序号码', trigger: 'blur' }
        ]
      },
      tableData: []
    }
  },
  created() {
    this.getMenuTree()
  },
  methods: {
    getMenuTree() {
      this.$axios.get('/menu/list').then(res =>{
        console.log(res,'res')
        this.tableData = res.data
      })
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/menu/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              message: '菜单保存成功',
              type: 'success'
            });
            this.getMenuTree()
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetForm(formName) {
      this.editForm = {}
      //this.$refs[formName].resetFields(); 加上会出现查看菜单时直接修改了显示的值
    },
    editHandle(editForm) {
      this.editForm = editForm
      this.dialogVisible = true
    },
    handleClose() {
      this.resetForm('editForm')
      this.dialogVisible = false
    },
    delHandle(id) {
      this.$axios.post('/menu/delete/'+id).then(res => {
        this.$message({
          message: '菜单删除成功',
          type: 'success'
        });
        this.getMenuTree()
      })
    }
  }
}
</script>

<style scoped>
  .el-button--mini, .el-button--mini.is-round{
    padding: 7px 10px;
  }
</style>
