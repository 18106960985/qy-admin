<!--公司资讯-->


<template>
  <div class="app-container calendar-list-container">
    <!--搜索工具栏-->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="文章标题" v-model="search.title" />

      <el-select clearable style="width: 90px" class="filter-item" v-model="search.recommendLV" :placeholder="$t('table.importance')">
        <el-option v-for="item in recommendLV" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="search.status">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="loading.downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="show.introduce">简介</el-checkbox>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+2' v-model="show.updTime">更新时间</el-checkbox>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+3' v-model="show.updName">更新人</el-checkbox>
    </div>
    <!--表格开始-->

    <el-table :key='tableKey' :data="list" v-loading="loading.listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" :label="$t('table.id')" width="65"   type="index">
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.author')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.source')">
        <template slot-scope="scope">
          <span>{{scope.row.sourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{scope.row.displayTime | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" :label="$t('table.title')">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('table.importance')">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.recommendLV" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="scope">
          <!--<span v-if="scope.row.pageviews" class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.pageviews}}</span>-->
          <!--<span v-else>0</span>-->
          <span>0</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="show.introduce" width="300px" align="center" label="简介">
        <template slot-scope="scope">
          <span>{{scope.row.introduce}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="show.updTime" width="150px"  align="center" label="最后时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show.updName" width="150px" align="center" label="最后更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updName}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="350">
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="" size="small" type="success" @click="handleUpdate(scope.row)">编辑-->
          <!--</el-button>-->
          <!--<el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除-->
          <!--</el-button>-->
        <!--</template>-->

        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='published' && authority.informationManager_btn_edit" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft' && authority.informationManager_btn_edit" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
          </el-button>
          <el-button v-if="scope.row.status!='deleted' && authority.informationManager_btn_del" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div v-show="!loading.listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
  import {page,delObj,ModifyStatus} from '@/api/app/information/index'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex';
  import eventhub from '@/eventHub/eventHub'




  export default {
    name: 'information-index',
    directives: {
      waves
    },
    data() {
      return {
        search:{
          title: undefined,
          status:undefined,
          recommendLV:undefined,
        },
        //下载遮盖层
        //表格操作属性
        tableKey: 0,
        //分页属性
        list: null,
        total: null,
        listQuery:{
          page: 1,
          limit: 20,
          filters:undefined,
        },

        loading:{
          listLoading: true,//表格加载层
          btnLoading: true,
          downloadLoading:false,
        },
        //表格显示/隐藏选项
        show:{
          updTime:false,
          updName: false,
          introduce:false,
        },
        authority:{
          informationManager_btn_add:true,
          informationManager_btn_edit:true,
          informationManager_btn_del:true
        },
        //常量
        textMap: {
          update: '编辑',
          create: '创建'
        },
        statusOptions: ['published', 'draft', 'deleted'],
        recommendLV: [1, 2, 3,4],//推荐级别
        temp:{
          status: undefined,
        },

      }
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    created() {
      this.getTable();
      eventhub.$on('getTable',()=>{
        this.getTable();
      })

    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
    },
    methods: {
      //获得
      searchForParams(){
        let filters='';
        //搜索判断
        if (this.search.title){
          filters += "RLIKE_title="+this.search.title+";";
        }
        if(this.search.recommendLV){
          filters += "EQ_recommendLV="+this.search.recommendLV+";";
        }
        if(this.search.status){
          filters += "EQ_status="+this.search.status+";";
        }
        this.listQuery.filters=filters;
      },
      //获取表格
      getTable() {
        this.loading.istLoading = true;
        this.searchForParams();
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.loading.listLoading = false;
          })
      },
      handleSizeChange(val){
        this.listQuery.limit = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getTable();
      },
      handleFilter(){
        this.getTable();
      },
      //新增
      handleCreate(){
        eventhub.$emit('switchCard',{curId:undefined, isEdit:false})
      },
      //编辑
      handleUpdate(row){
        eventhub.$emit('switchCard',{curId:row.id, isEdit:true})

      },
      //删除
      handleDelete(){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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

      handleModifyStatus(row, status) {
        this.$notify({
          title:'警告',
          type:'warning',
          message:'功能改功能存在问题待修改',
          duration:2000,
        })
      // this.temp.status = status;
      //   ModifyStatus(row.id, this.temp).then(res=>{
      //     if(res.rel){
      //       this.$message.success("操作成功");
      //       this.getTable();
      //     }
      //   })
      },
      handleDownload() {

        this.$notify({
          title:'警告',
          type:'warning',
          message:'功能暂未完成！！敬请期待',
          duration:2000,
        })
        // this.loading.downloadLoading = true
        // import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = ['id', 'name', 'account', 'sex', 'description', 'updTime', 'updName'];
        //   const filterVal = ['id', 'name', 'account', 'sex', 'description', 'updTime', 'updName'];
        //   this.searchForParams();
        //   all(this.listQuery.filters)
        //     .then(res=>{
        //       const data = this.formatJson(filterVal,res.data);
        //       excel.export_json_to_excel(tHeader, data, 'user-list');
        //       this.loading.downloadLoading = false
        //     }).catch(err=>{
        //     this.loading.downloadLoading = false
        //   })
        // })
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
