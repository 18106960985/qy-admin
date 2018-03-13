<template>
  <!--content-->
  <div class="app-container calendar-list-container" >
    <!--菜单详情表单-->
    <el-form  label-position="left" label-width="80px"  :model="menuForm" ref="menuForm"  v-loading="loading.formLoading">
      <el-form-item label="路径编码" prop="code" >
        <el-input v-model="menuForm.code"  :disabled="form.edit"  placeholder="请输入路径编码"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="menuForm.title"  :disabled="form.edit"  placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="父级节点" prop="parentId">
        <el-input v-model="menuForm.parentId"  disabled="disabled"  placeholder="请输入父级节点"></el-input>
      </el-form-item>
      <el-form-item label="父级名称" prop="parentName">
        <el-input v-model="menuForm.parentName"  disabled="disabled"  placeholder="请输入父级名称"></el-input>
      </el-form-item>
      <el-form-item label="图标"  prop="icon">
        <el-input v-model="menuForm.icon"  :disabled="form.edit"  placeholder="请输入图标"></el-input>
      </el-form-item>
      <el-form-item label="资源路径"  prop="href">
        <el-input v-model="menuForm.href"  :disabled="form.edit"  placeholder="请输入资源路径"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select  style="width: 100%" v-model="menuForm.type"  :disabled="form.edit"  placeholder="请输入资源请求类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="菜单排序" prop="orderNum">
        <el-input v-model="menuForm.orderNum"  :disabled="form.edit"  placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="菜单描述" prop="description">
        <el-input v-model="menuForm.description"  :disabled="form.edit"  placeholder="请输入菜单描述"></el-input>
      </el-form-item>
      <!--<el-form-item label="前端组件" >-->
        <!--<el-input v-model="menuForm.code"  :disabled="formStatus"  placeholder="请输入路径编码"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item v-if="form.status == 'create'">
        <el-tooltip effect="light" placement="top" content="重置表单" >
          <el-button @click="resetForm()"> 重置</el-button>
        </el-tooltip>
        <el-tooltip effect="light" placement="top" content="创建新菜单">
          <el-button type="primary" @click="create">创建</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="form.status == 'update'">
        <el-tooltip effect="light" placement="top" content="重置表单" >
          <el-button @click="resetForm()"> 重置</el-button>
        </el-tooltip>

        <el-tooltip effect="light" placement="top" content="更新菜单详情">
          <el-button type="primary" @click="update" >更新</el-button>
        </el-tooltip>
      </el-form-item>

    </el-form>

  </div>

</template>

<script>
  import {ElForm} from 'element-ui';
  import {
     getObj, addObj, putObj
  } from '../../../../api/admin/menu/index';
    export default {

        name: "info",

      props:{
        form:{
          type:Object,
          default:{
            edit:{
              type:Boolean,
              default:true
            },
            status:{
              type:String,
              default:''
            },
            currentMenuId:{
              type:Number,
              default:-1
            },
            parentName:{
              type:String,
              default:"根菜单"
            }

          }
        },


      },
      computed:{
        currentMenuId(){
          return this.form.currentMenuId;
        },
        status(){
          return this.form.status;
        }
      },
      watch:{
        currentMenuId(){
          this.getMenuInfo()
        },
        status(){
          if(this.form.status == "create"){
            let parentId =this.menuForm.id,
                parentName =  this.menuForm.title;
            this.resetForm();
            this.menuForm.parentId =parentId;
            this.menuForm.parentName = parentName;

          }
        }

      },
      data(){
        var checkAge = (rule, value, callback) => {
          callback();
        };
          return {
            menuForm:{
              code:'',
              title:'',
              parentId: -1,
              href: '',
              icon: '',
              orderNum: '',
              description: '',
              path: '',
              enabled: '',
              type: '',
              parentName:'根菜单',
            },
            // formStatus:true,
            //菜单类型
            typeOptions: ['menu', 'dirt'],
            loading:{
              formLoading:false,
            },
          }
      },
      methods:{
        changEvent(){
          this.$emit("changEvent");
        },
        getMenuInfo(){
          this.loading.formLoading = true;
          getObj(this.form.currentMenuId).then(response =>{
            this.loading.formLoading =false;
            if(!response.rel) return
            this.menuForm = response.data;
             this.menuForm.parentName = this.form.parentName;
          }).catch(err=>{
            this.$message.error(err);
            this.menuForm = response.data;
          })
        },
        resetForm(){
          this.$refs['menuForm'].resetFields();
          this.menuForm.id ="";
          this.form.status = "create";
        },
        create(){
          addObj(this.menuForm).then(res =>{
            this.changEvent();
            if(res.rel){
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            }else{
            console.log(res)
            }
          })
        },
        update(){
          putObj(this.menuForm.id, this.menuForm).then(() => {
            this.changEvent();
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        }


      }
    }
</script>

<style scoped>

</style>
