<template>
  <div class="app-container calendar-list-container">
    <!--搜索工具栏-->
    <div class="filter-container">
      <el-input v-model="filters" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称" />
      <el-tooltip placement="top" content="资源查询">
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      </el-tooltip>
      <el-tooltip placement="top" content="创建新组件资源">
        <el-button v-if="authority.menuManager_btn_element_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      </el-tooltip>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="show.description">备注</el-checkbox>
    </div>
    <!--表格开始-->
    <el-table :data="table" v-loading="loading.tableLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%" :key='tableKey' >
      <el-table-column align="center" label="资源编码" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="200px" align="center" label="请求类型">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="请求地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show.description"  width="200px"  align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="authority.menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="authority.menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!loading.tableLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="tableQuery.page" :page-sizes="[10,20,30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <element-form :dialog.sync="dialog" :currentMenuId="currentMenuId" ref="Form" @change="getTable"></element-form>
    </div>
  <!--</div>-->

</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '../../../../api/admin/element/index';
  import { mapGetters } from 'vuex';
  import elementForm from './elementForm'

    export default {
        name: "index",
      components:{
        elementForm
      },
      props:{
            currentMenuId:{
              type: Number,
              default: -1
            }
      },
      data(){
          return {
            filters:undefined,
            menuId:-1,
            table:null,
            total: null,
            tableKey:0,
            tableQuery:{
              page: 1,
              limit: 20,
              name: undefined,
              menuId: this.menuId
            },
            show:{
              description:false,

            },
            loading:{
              tableLoading:false,
              // pageLoading: false,
            },
            dialog:{
              dialogStatus:'create',
              dialogFormVisible: false,
            },
            authority:{//权限
              menuManager_btn_element_add: false,
              menuManager_btn_element_edit: false,
              menuManager_btn_element_del: false,
            }
          }
      },
      watch:{
          currentMenuId :function () {
            this.getTable();
          }
      },
      created(){
        this.getTable();
        if(this.elements){
          this.authority.menuManager_btn_element_add = this.elements['menuManager:btn_element_add'];
          this.authority.menuManager_btn_element_del = this.elements['menuManager:btn_element_del'];
          this.authority.menuManager_btn_element_edit = this.elements['menuManager:btn_element_edit'];
        }
      },
      computed:{
        ...mapGetters([
          'elements'
        ])
      },
      methods: {
        getTable(){
          this.loading.tableLoading = true ;
          this.tableQuery.menuId = this.currentMenuId;
          page(this.tableQuery).then(res =>{
            this.table =res.data.rows;
            this.loading.tableLoading = false ;
          })
        },
        handleFilter(){//查询过滤
          this.tableQuery.name = this.filters;
          this.getTable();
        },
        handleSizeChange(val){
          this.tableQuery.limit = val;
          this.getTable();
        },
        handleCurrentChange(val){
          this.tableQuery.page = val;
          this.getTable();
        },
        handleCreate(){//创建
          this.dialog.dialogStatus = 'create';
          this.dialog.dialogFormVisible = true;

        },
        handleUpdate(row){
          this.$refs.Form.form = row;
          this.dialog.dialogStatus = 'update';
          this.dialog.dialogFormVisible = true;
        },
        handleDelete(row){
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading.tableLoading = true ;
            delObj(row.id).then(res => {
              if (res.rel){
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                let index = this.table.indexOf(row);
                this.table.splice(index, 1);
              }else{
                this.$notify({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                });
              }
              this.loading.tableLoading = false ;
            });
          });
        },


      },
      mounted(){
      }
    }
</script>

<style scoped>

</style>
