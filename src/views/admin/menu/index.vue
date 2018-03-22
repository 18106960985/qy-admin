<template>
  <!--main-->
  <div class="app-container calendar-list-container">
    <!--布局开始-->
    <el-row>
      <!--左边菜单树-->

      <el-col :span="8" >
            <!--工具栏-->
        <div class="use-flex">
          <div>
            <el-input size="medium" placeholder="关键字过滤"></el-input>
          </div>
          <div>
            <el-button-group  >
              <!--<el-tooltip effect="light" placement="top" content="添加根菜单项">-->
                <!--<el-button  type="primary">根</el-button>-->
              <!--</el-tooltip>-->
              <el-tooltip effect="light" placement="top" content="添加菜单项">
                <el-button  type="primary" @click="info.edit = false , info.status='create'">添加</el-button>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="编辑菜单项">
                <el-button  type="success" @click="info.edit = false , info.status='update' , activeTab=='info' ">编辑</el-button>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="删除菜单项">
                <el-button  type="danger"  @click="handleDelete">删除</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </div>
            <!--菜单树-->
            <el-tree
              :data="treeData"
              node-key="id"
              highlight-current
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="menuTree"
              @node-click="getNodeData"
              default-expand-all
              v-loading="loading.treeLoading"
              element-loading-text="菜单树生成中……"
              element-loading-spinner="el-icon-loading"
            >
            </el-tree>

      </el-col>
      <!--右边内容区域-->
      <el-col :span="16">
        <!--标签页 进行标签页缓存，同样的内容不再次请求-->
        <el-tabs v-model="activeTab"  @tab-click="handleClick" type="border-card" >
          <el-tab-pane label="菜单详情" name="info">
            <keep-alive>
            <menu-info   v-if="activeTab=='info'"  :form="info"   @changEvent="infoChange" ref="menuInfo"></menu-info>
           </keep-alive>

          </el-tab-pane>
          <el-tab-pane label="组件详情" name="elements">
            <keep-alive>
              <menu-element  v-if="activeTab=='elements'"  :currentMenuId="info.currentMenuId" ref="menuElement"></menu-element>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import {
      fetchTree
    } from '../../../api/admin/menu/index';
    import {
      delObj
    } from '../../../api/admin/menu/index';
    import { mapGetters } from 'vuex';

    export default {
      components: {
        'menu-element':() =>import('./components/element'),
        'menu-info':() =>import('./components/info')
      },
      name: "index",
      data() {
        return {
          test:{
            pass:'',
          },
          //tree属性
          filterText: '',//过滤字段
          treeData:[],
          defaultProps:{
            children: 'children',
            label: 'title'
          },
          listQuery: {
            name: undefined
          },
          //子组件相关属性
          info:{
            currentMenuId:-1,//当前菜单
            parentName:"根菜单",
            edit:true,
            status:'',//表单状态
          },
          loading:{
            treeLoading:false,
          },

          //标签页
          activeTab: 'info',
          //子form表单编辑状态控制属性


        };
      },
      watch:{

      },
      created(){
        this.getTree();

      },
      methods: {
        //以下是树的操作
        //获得菜单树
        getTree() {
          this.loading.treeLoading = true;
          fetchTree(this.listQuery).then(data => {
            this.loading.treeLoading = false;
            this.treeData = data;
          });
        },
        // elemenu-ui自带过滤
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        getNodeData(data,node) {
          this.info.edit = true;//锁住编辑
          this.info.status = '';
          // this.showElement = true;
          //子组件初始化
          this.info.currentMenuId = data.id;
          this.info.parentName =  node.parent.label != undefined ? node.parent.label :'Root';

        },
        infoChange(){
          this.getTree();
        },
        handleClick(tab, event) {
          // console.log(tab, event);
        },
        handleDelete() {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delObj(this.info.currentMenuId).then(res => {
              if(res.rel){
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
              }else {

              }
              this.onCancel();
              this.getTree();

            });
          });
        },
        onCancel() {
          this.info.edit = true;
          this.info.status = '';
          this.$refs.menuInfo.$refs['menuForm'].resetFields();
        },
      }
    }
</script>

<style scoped>
  /*左边自适应*/
  .use-flex{
    display:flex;
  }
  .use-flex>div:first-child{
    flex:1;
  }
  .use-flex>div:last-child{
    flex:none;
    margin:0px 5px ;
  }

</style>
