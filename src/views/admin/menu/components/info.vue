<template>
  <!--content-->
  <div class="app-container calendar-list-container" >
    <!--菜单详情表单-->
    <el-form  label-position="left" label-width="80px"  :model="menuForm" ref="menuForm"  v-loading="loading.formLoading">
      <el-form-item label="路径编码" prop="code" >
        <el-input v-model="menuForm.code"  :disabled="formStatus"  placeholder="请输入路径编码"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="menuForm.title"  :disabled="formStatus"  placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="父级节点" prop="parentId">
        <el-input v-model="menuForm.parentId"  disabled="disabled"  placeholder="请输入父级节点"></el-input>
      </el-form-item>
      <el-form-item label="父级名称" prop="parentName">
        <el-input v-model="menuForm.parentName"  disabled="disabled"  placeholder="请输入父级名称"></el-input>
      </el-form-item>
      <el-form-item label="图标"  prop="icon">
        <el-input v-model="menuForm.icon"  :disabled="formStatus"  placeholder="请输入图标"></el-input>
      </el-form-item>
      <el-form-item label="资源路径"  prop="href">
        <el-input v-model="menuForm.href"  :disabled="formStatus"  placeholder="请输入资源路径"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select  style="width: 100%" v-model="menuForm.type"  :disabled="formStatus"  placeholder="请输入资源请求类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="菜单排序" prop="orderNum">
        <el-input v-model="menuForm.orderNum"  :disabled="formStatus"  placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="菜单描述" prop="description">
        <el-input v-model="menuForm.description"  :disabled="formStatus"  placeholder="请输入菜单描述"></el-input>
      </el-form-item>
      <!--<el-form-item label="前端组件" >-->
        <!--<el-input v-model="menuForm.code"  :disabled="formStatus"  placeholder="请输入路径编码"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-tooltip effect="light" placement="top" content="重置表单" >
          <el-button @click="resetForm('menuForm')"> 重置</el-button>
        </el-tooltip>
        <el-tooltip effect="light" placement="top" content="提交菜单详情">
          <el-button type="primary">保存</el-button>
        </el-tooltip>
      </el-form-item>

    </el-form>

  </div>

</template>

<script>
  import {ElForm} from 'element-ui';
  import {
     getObj, addObj, delObj, putObj
  } from '../../../../api/admin/menu/index';
    export default {

        name: "info",

      props:{
        formStatus:{
          type:Boolean,
          default:true
        },
        currentMenuId:{
          type:Number,
          default:-1
        },
        parentName:{
          type:String,
          default:"根菜单"
        }
      },
      watch:{
          currentMenuId:function () {
            this.getMenuInfo();
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
              parentName:'',
            },
            // formStatus:true,
            //菜单类型
            typeOptions: ['menu', 'dirt'],
            loading:{
              formLoading:false,
            },
            rules2: {
              pass: [
                { validator: checkAge, trigger: 'blur' }
              ]

            }


          }
      },
      created(){
         // this.getMenuInfo();


      },
      methods:{
        getMenuInfo(){
          this.loading.formLoading = true;
          getObj(this.currentMenuId).then(response =>{
            this.loading.formLoading =false;
            if(!response.rel) return
            this.menuForm = response.data;
            // this.menuForm.parentName = this.parentName;
          }).catch(err=>{
            this.$message.error(err);
            this.menuForm = response.data;
          })
        },
        resetForm(formName) {
          let temp =this.$refs['menuForm']
          console.log(temp )
          console.log(temp.resetFields())
          // this.menuForm.parentId = this.currentMenuId;
          // this.menuForm.parentName = this.parentName;
        }


      }
    }
</script>

<style scoped>

</style>
