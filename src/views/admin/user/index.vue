<template>
  <div class="app-container calendar-list-container">
    <!--搜索工具栏-->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="searchForNameOrAccount" />
      <!--<el-select clearable class="filter-item" style="width: 130px" v-model="searchForSex" placeholder="性别">-->
        <!--<el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showDesciption">备注</el-checkbox>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+2' v-model="showUpdTime">更新时间</el-checkbox>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+3' v-model="showUpdName">更新人</el-checkbox>
    </div>
    <!--表格开始-->

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="账户">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDesciption" width="300" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showUpdTime" width="180"  align="center" label="最后时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showUpdName" width="200" align="center" label="最后更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updName}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!--表单对话框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-if="dialogStatus == 'create'" v-model="userForm.account" placeholder="请输入账户"></el-input>
          <el-input v-else v-model="userForm.account" placeholder="请输入账户" readonly></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select class="filter-item" v-model="userForm.sex" placeholder="请选择">
            <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="userForm.description"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('userForm')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('userForm')">确 定</el-button>
        <el-button v-else type="primary" @click="update('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getRulesList} from '../../../utils/lib/RegexUtil';//表单验证工具
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj,
    all
  } from '../../../api/admin/user/index';
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex';

  export default {
    name: 'user',
    directives: {
      waves
    },
    data() {
      /*
      *定义引入的规则
      * param为要限制的规则名称是，flag 是否必输
      *
      */
      let rulesList = [];
      rulesList.push({element: 'account', param: 'account', flag: true});
      rulesList.push({element: 'password', param: 'password', flag: true});

      return {
        //搜索
        searchForNameOrAccount:undefined,
        searchForSex:undefined,
        //下载遮盖层
        downloadLoading: false,
        //表格操作属性
        tableKey: 0,
        listLoading: true,//表格加载层
        //分页属性
        list: null,
        total: null,
        listQuery:{
          page: 1,
          limit: 20,
          filters:undefined,
        },
        userManager_btn_edit: false,
        userManager_btn_del: false,
        userManager_btn_add: false,
        //表格显示/隐藏选项
        showDesciption:false,
        showUpdTime:false,
        showUpdName:false,
        //form表单
        userForm:{
          account:undefined,
          name:undefined,
          sex:'未知',
          password:undefined,
          description:undefined
        },
        //验证
        userRules: getRulesList(rulesList),
        //对话框显示否
        dialogFormVisible: false,
        dialogStatus: '',
        //常量
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sexOptions: ['男', '女', '未知'],


      }
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    created() {
      this.gettable();
      this.userManager_btn_edit = this.elements['userManager:btn_edit'];
      this.userManager_btn_del = this.elements['userManager:btn_del'];
      this.userManager_btn_add = this.elements['userManager:btn_add'];
    },
    methods: {
      //获得
      searchForParams(){
        let filters='';
        //搜索判断
        if (this.searchForSex){
          filters += "EQ_sex="+this.searchForSex+";";
        }
        if(this.searchForNameOrAccount){
          filters += "LIKE_name="+this.searchForNameOrAccount+";LIKE_account="+this.searchForNameOrAccount;
        }
        this.listQuery.filters=filters;
      },
      //获取表格
      gettable() {
        this.listLoading = true;
        this.searchForParams();
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleSizeChange(val){
        this.listQuery.limit = val;
        this.gettable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.gettable();
      },
      handleFilter(){
        this.gettable();
      },
      //新增
      handleCreate(){
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.userForm)
              .then(() => {
                this.dialogFormVisible = false;
                this.gettable();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
      },
      //编辑
      handleUpdate(row){
        getObj(row.id)
          .then(response => {
            this.userForm = response.data;
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          });
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            // this.userForm.password = undefined;
            putObj(this.userForm.id, this.userForm).then(() => {
              this.dialogFormVisible = false;
              this.gettable();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      //删除
      handleDelete(){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                //删除数据行
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      },
      //撤销
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      resetTemp() {
        this.userForm = {
          account: undefined,
          name: undefined,
          sex: '未知',
          password: undefined,
          description: undefined
        };
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'name', 'account', 'sex', 'description', 'updTime', 'updName'];
          const filterVal = ['id', 'name', 'account', 'sex', 'description', 'updTime', 'updName'];
         this.searchForParams();
          all(this.listQuery.filters)
            .then(res=>{
            const data = this.formatJson(filterVal,res.data);
            excel.export_json_to_excel(tHeader, data, 'user-list');
            this.downloadLoading = false
          }).catch(err=>{
            this.downloadLoading = false
          })

        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
    },

  }
</script>
