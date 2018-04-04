<template>
  <div class="app-container calendar-list-container">
    <!--搜索工具栏-->
    <div class="filter-container">
      <el-input v-model="filters" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="字段编码" />
      <el-tooltip placement="top" content="编码查询">
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      </el-tooltip>
      <el-tooltip placement="top" content="新增字段">
        <el-button v-if="authority.dictManager_btn_element_add &&  curDictTypeId != -1" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      </el-tooltip>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="show.description">备注</el-checkbox>
    </div>
    <!--表格开始-->
    <el-table :data="table" v-loading="loading.tableLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%" :key='tableKey' >
      <el-table-column align="center" label="字段编码" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="属性值">
        <template slot-scope="scope">
          <span>{{scope.row.value}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="默认值">
        <template slot-scope="scope">
          <span>{{scope.row.labelDefault}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="200px" align="center" label="中文值">
        <template slot-scope="scope">
          <span>{{scope.row.labelZhCH}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="英文值">
        <template slot-scope="scope">
          <span>{{scope.row.labelEn}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="顺序号">
        <template slot-scope="scope">
          <span>{{scope.row.orderNum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show.description"  width="200px"  align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="authority.dictManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="authority.dictManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!loading.tableLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="tableQuery.page" :page-sizes="[10,20,30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <dict-value-form :dialog.sync="dialog" :curDictTypeId="curDictTypeId" ref="Form" @change="getTable"></dict-value-form>


  </div>
</template>

<script>
  import {page,delObj} from '@/api/admin/dict/dictValue'
  import { mapGetters } from 'vuex';
  import dictValueForm from './dictValueForm';
  export default {
    name: "dict-value",
    components:{
      'dict-value-form':dictValueForm,
    },
    props:{
      curDictTypeId:{
        type: Number,
      }

    },
    data(){
      return {
        filters:'',
        show:{
          description: false,
        },
        table:null,
        total:null,
        tableKey:0,
        tableQuery:{
          page:1,
          limit:20,
          filters:'',
        },
        loading:{
          tableLoading: false,
        },
        dialog:{
          dialogStatus:'create',
          dialogFormVisible: false,
        },
        authority:{
          dictManager_btn_element_add: true,
          dictManager_btn_element_edit: true,
          dictManager_btn_element_del: true,
        },
      }
    },
    computed:{
      ...mapGetters([
        'elements'
      ])
    },
    watch:{
      curDictTypeId(){
       this.getTable();
      }
    },
    created(){
   this.getTable();
    },

    methods:{
      getTable(){
        if( this.curDictTypeId == -1) return;
        let fitters ='';
        if(this.curDictTypeId) fitters +="EQ_dictType.id="+this.curDictTypeId+';';
        if(this.fiterls) fitters+= 'RLICK_code='+this.fiterls+';';
        this.tableQuery.filters = fitters;
        this.loading.tableLoading = true;
        page(this.tableQuery).then(res=>{
          this.loading.tableLoading = false;
              this.table = res.data.rows;
              this.total = res.data.total;
        });
      },
      handleFilter(){//查询过滤
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
      }

    },

  }
</script>

<style scoped>

</style>
