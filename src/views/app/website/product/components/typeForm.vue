<template>
  <div class="app-container calendar-list-container" >
    <el-form label-position="left" label-width="80px"  :model="typeForm" ref="typeForm"  v-loading="loading.formLoading">
      <el-form-item label="父级节点" prop="parentId">
        <el-input v-model="typeForm.parentId"  disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="父级名称" prop="parentName">
        <el-input v-model="typeForm.parentName" disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="目录编码" prop="code">
        <el-input v-model="typeForm.code" placeholder="请输入编码"></el-input>
      </el-form-item>

      <el-form-item label="目录名称" prop="name">
        <el-input v-model="typeForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="目录描述" prop="description">
        <el-input v-model="typeForm.description"></el-input>
      </el-form-item>

      <el-form-item >
        <el-tooltip effect="light" placement="top" content="取消" >
          <el-button @click="closeEven">取消</el-button>
        </el-tooltip>

        <el-tooltip effect="light" placement="top" content="创建新菜单" v-if="form.status == 'created'" >
          <el-button type="primary" @click="create"  v-loading="loading.submitLoading">创建</el-button>
        </el-tooltip>

        <el-tooltip effect="light" placement="top" content="更新菜单详情"  v-if="form.status == 'update'">
          <el-button type="primary" @click="update" v-loading="loading.submitLoading">更新</el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
 import  {getForm , add , update}from '@/api/app/product/index'


 const defaultForm = {
   id:undefined,
   parentId:-1,
   parentName:"Root",
   code:undefined,
   name: undefined,
   description:undefined,
 }

  export default {
    name: "product-type-form",
    props:{
      form:{
        type: Object,
        default:{
          curId:{
            type:Number
          },
          status:{
            type:String,
            default: 'created'
          },
          parentName:{
            type:String,
            default:'Root'
          },
          parentId:{
            type: Number,
            default: -1
          }
        }
      }
    },

    data(){
      return {
        typeForm:Object.assign({}, defaultForm),
        loading:{
          formLoading: false,
          submitLoading: false,
        }
      }
    },
    computed:{
      curId(){
        return this.form.curId;
      },
      status(){
        return this.form.status;
      }
    },
    watch:{
      curId(){
        if(this.form.status == 'update'){
          if(this.form.curId != -1)  this.getForm();
        }else{

        }
      },

    },
    created(){
      if(this.form.curId != -1){
        this.getForm();

      }

    },
    methods:{
      // 初始化表单 给父级用的
      initForm(id,name){
        this.resetForm();
        this.typeForm.parentId = id;
        this.typeForm.parentName = name;
      },
      changeEvent(){
        this.$emit('changeEvent');
      },
      getForm(){
        this.loading.formLoading = true;
        getForm(this.curId).then(res =>{
          if(res.rel){
            this.typeForm = res.data;
            this.typeForm.parentName = this.form.parentName;
          }
          this.loading.formLoading = false;
        })
      },
      create(){
        this.loading.formLoading = true;
        this.loading.submitLoading = true;
        add(this.typeForm).then(res=>{
          if(res.rel){
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1000,
            })
          }
          this.loading.submitLoading = false;
          this.loading.formLoading = false;
          this.changeEvent();
        }).catch(err =>{
          this.loading.submitLoading = false;
          this.loading.formLoading = false;

        })

      },
      update(){
        this.loading.formLoading = true;
        this.loading.submitLoading = true;
        update(this.typeForm.id,this.typeForm).then(res =>{
          if(res.rel){
            this.$notify({
              title: '成功',
              message: '更新成功!',
              type: 'success',
              duration: 1000
            });
            this.changeEvent();
          }
          this.loading.formLoading = false;
          this.loading.submitLoading = false;
        }).catch( err =>{
          this.$notify({
            title: '失败',
            message: err.errorMsg,
            type: 'error',
            duration: 1000
          });
          this.loading.formLoading = false;
          this.loading.submitLoading = false;
        })


      },
      resetForm(){
      this.typeForm = Object.assign({}, defaultForm);
      },
      closeEven(){
        // this.resetForm();
        this.$emit("closeEvent")
      }
    }

  }
</script>

<style scoped>

</style>
