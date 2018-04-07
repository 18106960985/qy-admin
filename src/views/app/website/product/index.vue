<!--产品管理界面-->

<template>
  <!--main-->
  <div class="app-container calendar-list-container">
    <el-row>

      <!--左边-->
      <el-col :span="8" >


        <el-card style="margin-right:10px;">
          <div slot="header" class="clearfix">
            <span> 产品类型目录</span>
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
            element-loading-text="树初始化中……"
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
          <!--<el-card v-if="myCard.typeVisible" style="height: 100%"  >-->
            <!--<div slot="header" class="clearfix">-->
              <!--<span> 字典集合</span>-->
            <!--</div>-->
            <!--<keep-alive>-->
              <!--<dicet-value  :curproductTypeId="curId"></dicet-value>-->
            <!--</keep-alive>-->

          <!--</el-card>-->
          <el-card    style="height: 100%" >
            <div slot="header" class="clearfix">
              <span >{{textMap[productType.stauts]}}</span>
            </div>
            <keep-alive>
              <product-type   ref="productTypeForm" :form.sync="productType" @changeEvent="getTree" @closeEvent="closeAnimation"></product-type>
            </keep-alive>
          </el-card>
        </transition>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {getTree ,delObj} from '@/api/app/product/index'
  import typeForm from './components/typeForm';
  export default {
    components: {
      'product-type': typeForm,
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
        curId:-1,
        myCard:{
          typeVisible:true,//两种状态一 是value form 二是type form
        },
        productType:{
          curId:-1,
          stauts:'created',
          parentName:'Root',

        },
        loading:{
          treeLoading: false,
        },
        textMap:{
          created:'新增类型',
          update:'编辑类型'
        },
        authortiy:{ //权限控制ß
          productTypeManager_btn_edit: true,
          productTypeManager_btn_del: true,
          productTypeManager_btn_add: true,
        }

      }
    },
    watch:{
      fiterls(val){
        this.$refs.treeData.filter(val)
      }
    },
    created(){
      this.getTree();
    },
    methods:{
      // 获取数据字典树
      getTree(){
        this.loading.treeLoading = true;
        getTree().then(res=>{
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
        { this.authortiy.productTypeManager_btn_add ?   <el-button  style="font-size: 15px;" type="text"   icon="el-icon-circle-plus" on-click={()=>this.treeCreated(node,data)} ></el-button> : <span></span>}
        { this.authortiy.productTypeManager_btn_edit ?  <el-button  style="font-size: 15px;"  type="text"   icon="el-icon-edit" on-click={ ()=>this.treeUpdate(node,data) }></el-button>  : <span></span>}
        { this.authortiy.productTypeManager_btn_del ?  <el-button  style="font-size: 15px;"  type="text"   icon="el-icon-remove" on-click= { ()=> this.treeDelelte(node,data)}></el-button> :  <span></span> }
      </span>
        </span>);
      },
      getNodeData(data,node){
        this.curId=data.id;

      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      treeCreated(node, data){
        this.myCard.typeVisible = false;
        this.productType.stauts = 'created';
        this.productType.curId = undefined;
        this.$refs.productTypeForm.initForm(data.id,data.label);
      },
      treeUpdate(node,data){
        this.myCard.typeVisible = false;
        this.productType.parentName =  node.parent.label != undefined ? node.parent.label :'Root';
        this.productType.curId = data.id;
        this.productType.stauts = 'update';
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
              this.getTree();
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
