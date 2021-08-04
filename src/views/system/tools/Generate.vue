<template>
  <div>
    <el-alert
        title="目前暂时只支持mysql数据库"
        center
        type="success"
        style="margin-bottom: 20px;"
    ></el-alert>
    <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        inline
        size="mini"
        label-width="70px"
        class="demo-ruleForm"
    >
      <el-form-item label="URL" prop="url">
        <el-input
            placeholder="host:prot/db_name"
            v-model="ruleForm.url"
            class="input-with-select"
            clearable
        >
          <el-select
              v-model="ruleForm.prepend"
              slot="prepend"
              placeholder="请选择"
              clearable
          >
            <el-option label="jdbc:mysql://" value="jdbc:mysql://"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
            v-model="ruleForm.username"
            placeholder="请输入数据库用户名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            type="password"
            v-model="ruleForm.password"
            placeholder="请输入数据库密码"
            clearable
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="表名" prop="tableName">
        <el-input
            v-model="ruleForm.tableName"
            placeholder="请输入数据库表名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            icon="el-icon-search"
            @click="submitForm('ruleForm')"
        >查询</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="tableData"
        size="small"
        style="width: 90%;margin-left: 5%;"
        :header-cell-style="getRowClass"
        :cell-style="getRowClass"
    >
      <el-table-column label="序号" type="index"> </el-table-column>
      <el-table-column prop="tableName" label="表名" width="180"> </el-table-column>
      <el-table-column prop="tableComment" label="注释" width="180"> </el-table-column>
      <el-table-column prop="tableCollation" label="字符编码集" width="180"> </el-table-column>
      <el-table-column prop="engine" label="存储引擎" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="download(scope.$index, scope.row)" type="primary"
          >生成代码</el-button
          >
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      /** 当前页 */
      currentPage: 1,
      /** 总条数 */
      total: 10,
      /** 当前最多显示多少条 */
      size: 10,
      ruleForm: {
        prepend: '',
        url: '',
        username: '',
        password: '',
        tableName: '',
      },
      rules: {
        url: [
          { required: true, message: 'JDBC字符串不能为空', trigger: 'blur' },
        ],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      tableData: [
      ],
      tableRequest: {
        currentPage: '',
        pageSize: '',
        prepend: '',
        url: '',
        username: '',
        password: '',
        tableName: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.ruleForm.prepend === '') {
          this.$message.error('请选择jdbc-url前缀')
          return
        }
        if (valid) {
          this.tableRequest = this.ruleForm
          this.tableRequest.currentPage = this.currentPage
          this.tableRequest.pageSize = this.size
          this.$axios.get('/generator/table',{
            params: this.tableRequest
          }).then(res =>{
            this.tableData = res.data.data.list
            this.currentPage = res.data.data.pageNumber
            this.size = res.data.data.pageSize
            this.total = res.data.data.total
            this.$notify({
              title: '查询成功',
              message: '请耐心等待数据加载',
              type: 'success'
            });
            console.log(res,'res')
          })
          console.log('success submit!!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.submitForm('ruleForm')
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.submitForm('ruleForm')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 表格表头样式 可自定义
    getRowClass ({row, column, rowIndex, columnIndex}) {
      return 'text-align:center'
    },
    // 生成代码
    download(index, row) {
      this.tableRequest = this.ruleForm
      this.tableRequest.tableName = row.tableName
      //this.$axios.post('/generator/code', this.tableRequest).then(res => {
      this.$axios({
        url: '/generator/code',
        method: 'post',
        data: this.tableRequest,
        responseType: 'blob'
      }).then(res => {
        this.$notify({
          title: '代码生成成功',
          message: '请耐心等待代码生成',
          type: 'success'
        });
        let blob = new Blob([res.data], {type: 'application/zip'});
        let filename = this.tableRequest.tableName + '.zip';
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.setTimeout(function () {
          URL.revokeObjectURL(blob);
          document.body.removeChild(link);
        }, 0)
        console.log(res,'resCode')
      })
      console.log(this.tableRequest,'config')
    }
  },
}
</script>

<style>
.el-pagination{
  float: right;
  margin-top: 16px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
