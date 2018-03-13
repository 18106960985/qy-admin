<template>
  <div class="app-container calendar-list-container">
    <!--搜索工具栏-->
    <div class="filter-container">
      <el-input :model="filters" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" />
      <!--<el-select clearable class="filter-item" style="width: 130px" v-model="searchForSex" placeholder="性别">-->
      <!--<el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>-->
      <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>-->
      <!--<el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showDesciption">备注</el-checkbox>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+2' v-model="showUpdTime">更新时间</el-checkbox>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+3' v-model="showUpdName">更新人</el-checkbox>-->
    </div>
    <!--表格开始-->

    <el-table :data="table" v-loading="tableLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
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
      <el-table-column width="200px" align="center" label="资源地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="200px" align="center" label="资源请求类型">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="200px"  align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <!--<el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑-->
          <!--</el-button>-->
          <!--<el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <!--<div v-show="!listLoading" class="pagination-container">-->
      <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>-->
    <!--</div>-->
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

    export default {
        name: "index",
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
            tableQuery:{
              page: 1,
              limit: 20,
              name: undefined,
              menuId: this.menuId
            },
            tableLoading:false,
          }
      },
      watch:{
          currentMenuId :function () {
            this.getTable();
          }

      },
      created(){
        this.getTable();

      },
      methods: {
          getTable(){
            this.tableLoading = true ;
            this.tableQuery.menuId = this.currentMenuId;
            page(this.tableQuery).then(res =>{
              this.table =res.data.rows;
              this.tableLoading = false;
            })

          }
      }
    }
</script>

<style scoped>

</style>
