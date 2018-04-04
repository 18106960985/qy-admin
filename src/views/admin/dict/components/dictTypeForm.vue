<template>
  <div class="app-container calendar-list-container" >
    <el-form label-position="left" label-width="80px"  :model="dictTypeForm" ref="dictTypeForm"  v-loading="loading.formLoading">
      <el-form-item label="父级节点" prop="parentId">
        <el-input v-model="dictTypeForm.parentId"  disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="父级名称" prop="parentName">
        <el-input v-model="dictTypeForm.parentName" disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="目录编码" prop="code">
        <el-input v-model="dictTypeForm.code" placeholder="请输入编码"></el-input>
      </el-form-item>

      <el-form-item label="目录名称" prop="name">
        <el-input v-model="dictTypeForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="目录类型" prop="type">
        <el-input v-model="dictTypeForm.type" ></el-input>
      </el-form-item>

      <el-form-item label="目录描述" prop="description">
        <el-input v-model="dictTypeForm.description"></el-input>
      </el-form-item>


    <el-form-item >
      <el-tooltip effect="light" placement="top" content="取消" >
        <el-button @click="closeEven">取消</el-button>
      </el-tooltip>

      <el-tooltip effect="light" placement="top" content="创建新菜单" v-if="form.stauts == 'created'" >
        <el-button type="primary" @click="create"  v-loading="loading.submitLoading">创建</el-button>
      </el-tooltip>

      <el-tooltip effect="light" placement="top" content="更新菜单详情"  v-if="form.stauts == 'update'">
        <el-button type="primary" @click="update" v-loading="loading.submitLoading">更新</el-button>
      </el-tooltip>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getDictType, add,update} from "../../../../api/admin/dict/dictType";

  export default {
        name: "dict-type-form",
      props:{
          form:{
            type: Object,
            default:{
              currentDictTypeId:{
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
           dictTypeForm:{
             id:undefined,
             parentId:-1,
             parentName:"Root",
             code:undefined,
             name: undefined,
             type: undefined,
             description:undefined,
           },
           loading:{
             formLoading: false,
             submitLoading: false,
           }
         }
      },
      computed:{
        currentDictTypeId(){
          return this.form.currentDictTypeId;
        },
        stauts(){
          return this.form.stauts;
        }
      },
      watch:{
        currentDictTypeId(){
          if(this.form.stauts == 'update'){
            if(this.form.currentDictTypeId != -1)  this.getDictType();
          }else{

          }
        },

      },
      created(){
        this.getDictType()
      },
      methods:{
          // 初始化表单 给父级用的
          initForm(id,name){
            this.resetForm();
            this.dictTypeForm.parentId = id;
            this.dictTypeForm.parentName = name;
          },
          changeEvent(){
            this.$emit('changeEvent');
          },
          getDictType(){
            this.loading.formLoading = true;
            getDictType(this.currentDictTypeId).then(res =>{
                if(res.rel){
                  this.dictTypeForm = res.data;
                  this.dictTypeForm.parentName = this.form.parentName;
                }
              this.loading.formLoading = false;
            })
          },
          create(){
            this.loading.formLoading = true;
            this.loading.submitLoading = true;
            add(this.dictTypeForm).then(res=>{
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
            update(this.dictTypeForm.id,this.dictTypeForm).then(res =>{
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
            this.$refs['dictTypeForm'].resetFields();
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
