<!--数据字典管理页面-->

<template>
  <!--main-->
    <div class="app-container calendar-list-container">
      <el-row>

         <!--左边-->
        <el-col :span="8" >


          <el-card style="margin-right:10px;">
            <div slot="header" class="clearfix">
             <span> 字典目录</span>
            </div>
            <el-input size="medium" placeholder="关键字过滤" class="filter-item" v-model="fiterls"></el-input>
            <el-tree
              :data="treeData"
              node-key="id"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node="false"
              ref="treeData"
              default-expand-all
              :filter-node-method="filterNode"
              v-loading="loading.treeLoading"
              element-loading-text="数据字典初始化中……"
              element-loading-spinner="el-icon-loading"
              @node-click="getNodeData"
              :render-content="renderContent"
            >

            </el-tree>
          </el-card>
        </el-col>
        <!--右边-->
        <el-col :span="16" >

          <!--2个卡片-->
          <transition  name="box-move-x"  mode="out-in">
          <el-card v-if="myCard.typeVisible" style="height: 100%"  >
            <div slot="header" class="clearfix">
              <span> 字典集合</span>
            </div>
            <keep-alive>
              <dicet-value  :curDictTypeId="curDictTypeId"></dicet-value>
            </keep-alive>

          </el-card>
          <el-card  v-else  style="height: 100%" >
            <div slot="header" class="clearfix">
              <span v-if="dictType.stauts == 'created'">新增目录</span>
              <span v-if="dictType.stauts == 'update'">编辑目录</span>
            </div>
            <keep-alive>
            <dict-type   ref="dictTypeForm" :form.sync="dictType" @changeEvent="getDictTree" @closeEvent="closeAnimation"></dict-type>
            </keep-alive>
           </el-card>

          </transition>
        </el-col>
      </el-row>

    </div>
</template>

<script>
  import {getDictTree ,delObj} from '@/api/admin/dict/dictType';
  import dictType from './components/dictTypeForm';
  import dictValue from './components/dictValueIndex'
    export default {
      components: {
        'dict-type': dictType,
        'dicet-value': dictValue
      },
      name: "index",
      data(){
           return {
             view: 'dict-type',
             fiterls:'',
             treeData:[],
             defaultProps:{
               children: 'children',
               label: 'label'
             },
             curDictTypeId:-1,
             myCard:{
               typeVisible:true,//两种状态一 是value form 二是type form
             },
             dictType:{
               currentDictTypeId:-1,
               stauts:'created',
               parentName:'Root',

             },
             loading:{
               treeLoading: false,
             },
             authortiy:{ //权限控制
               dictTypeManager_btn_edit: true,
               dictTypeManager_btn_del: true,
               dictTypeManager_btn_add: true,
             }

           }
      },
      watch:{
        fiterls(val){
          this.$refs.treeData.filter(val)
        }
      },
      created(){
        this.getDictTree();
      },
      methods:{
          // 获取数据字典树
        getDictTree(){
          this.loading.treeLoading = true;
          getDictTree().then(res=>{
            if(res.rel){
              this.treeData = res.data;
            }
            this.loading.treeLoading = false;
          })
        },
        //重构 树样式
        renderContent(h, { node, data, store }) {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>{node.label}</span>
          <span >
          { this.authortiy.dictTypeManager_btn_add ?   <el-button  style="font-size: 15px;" type="text"   icon="el-icon-circle-plus" on-click={()=>this.treeCreated(node,data)} ></el-button> : <span></span>}
          { this.authortiy.dictTypeManager_btn_edit ?  <el-button  style="font-size: 15px;"  type="text"   icon="el-icon-edit" on-click={ ()=>this.treeUpdate(node,data) }></el-button>  : <span></span>}
          { this.authortiy.dictTypeManager_btn_del ?  <el-button  style="font-size: 15px;"  type="text"   icon="el-icon-remove" on-click= { ()=> this.treeDelelte(node,data)}></el-button> :  <span></span> }
          </span>
          </span>);
        },
        getNodeData(data,node){
          this.curDictTypeId=data.id;

        },
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        treeCreated(node, data){
          this.myCard.typeVisible = false;
          this.dictType.stauts = 'created';
          this.dictType.currentDictTypeId = undefined;
          this.$refs.dictTypeForm.initForm(data.id,data.label);
        },
        treeUpdate(node,data){
          this.myCard.typeVisible = false;
          this.dictType.parentName =  node.parent.label != undefined ? node.parent.label :'Root';
          this.dictType.currentDictTypeId = data.id;
          this.dictType.stauts = 'update';
        },
        treeDelelte(node,data){
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading.treeLoading = true;
            delObj(data.id).then(res => {
              if(res.rel){
                this.getDictTree();
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
              }else {

              }
              this.loading.treeLoading = false;
            })
          });
        },
        //这是一个监听切换的动画效果
        closeAnimation(){
          this.myCard.typeVisible = true;
        }


      },
      mounted(){

      }

    }
</script>

<style scoped>


</style>
