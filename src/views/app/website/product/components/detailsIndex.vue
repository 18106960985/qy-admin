<!--产品详情-->
<template>
  <div class="app-container calendar-list-container">
    <!--搜索工具栏-->
    <div class="filter-container">
      <el-input v-model="filters" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品名称" />
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
        <el-button v-if="authority.dictManager_btn_element_add &&  curId != -1" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>

    </div>


    <el-row>
      <el-col :span="5" v-for="(value, index) in table" :key="index"  style="margin: 5px">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img :src="DOWNLOAD_PATH + value.smallImgPath" class="image">
          <div style="padding: 14px;">
            <span>{{value.name}}</span>
            <div class="bottom clearfix">
              <time class="time">{{value.crtTime  | parseTime('{y}-{m}-{d}')}} </time>
              <el-button type="text" class="button" @click="handleDelete(value.id)">删除</el-button>
              <el-button type="text" class="button" @click="handleUpdate(value.id)">编辑</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


    <!--分页-->
    <div v-show="!loading.tableLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="tableQuery.page" :page-sizes="[10,20,30,50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>




  </div>
</template>

<script>
  import {DOWNLOAD_PATH} from '@/utils/lib/CommonConstant';

  import {page,delObj} from '@/api/app/product/detailsIndex'
  import { mapGetters } from 'vuex';
  import eventhub from '@/eventHub/eventHub'
  import {formatTime} from '@/filters/index';
  export default {
    name: "product-details",
    components:{
      // 'dict-value-form':dictValueForm,
    },
    props:{
      curId:{
        type: Number,
      }

    },
    data(){
      return {
        DOWNLOAD_PATH:DOWNLOAD_PATH,
        filters:'',
        table:null,
        total:null,
        tableKey:0,
        tableQuery:{
          page:1,
          limit:10,
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
      curId(){
        this.getTable();
      }
    },
    created(){
      this.getTable();
      eventhub.$on('getTable',()=>{
        this.getTable();
      })
    },
    filters:{
      formatDate(){
        if (!value) return '';

        return formatTime(value ,true);
      }
    },

    methods:{
      getTable(){
        if( this.curId == -1) return;
        let fitters ='';
        if(this.curId) fitters +="EQ_productType.id="+this.curId+';';
        if(this.fiterls) fitters+= 'RLICK_name='+this.fiterls+';';
        this.tableQuery.filters = fitters;

        page(this.tableQuery).then(res=>{

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

        eventhub.$emit('switchCard',{curTypeId:this.curId,curId:undefined, isEdit: false});

      },

      handleUpdate(id){
        eventhub.$emit('switchCard',{curTypeId:this.curId,curId:id , isEdit: true});
      },
      handleDelete(id){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          delObj(id).then(res => {
            if (res.rel){
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getTable();
            }else{
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              });
            }

          });
        });
      }

    },

  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 200px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
