<template>
  <el-dialog :title="textMap[dialog.dialogStatus]"   :visible.sync="dialog.dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="资源编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
        <el-select class="filter-item" v-model="form.type" placeholder="请输入资源类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源地址" prop="uri">
        <el-input v-model="form.uri" placeholder="请输入资源地址"></el-input>
      </el-form-item>
      <el-form-item label="资源请求类型" prop="method">
        <el-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">
          <el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button v-if="dialog.dialogStatus=='create'" type="primary" @click="create('form')">创 建</el-button>
      <el-button v-else type="primary" @click="update('form')">更 新</el-button>
    </div>
  </el-dialog>

</template>

<script>

  import {
    addObj,
    putObj
  } from '../../../../api/admin/element/index';
  // 该组件为菜单组件form表单
    export default {
        name: "element-form",
      props:{
        dialog:{
          type: Object,
          dialogStatus:{
            type: String,
            default: 'create'
          },
          dialogFormVisible:{
            type: Boolean,
            default: false
          },
        },
        currentMenuId:Number
      },
      computed:{
        dialogFormVisible(){
          return this.dialog.dialogFormVisible;
        }
      },
      watch:{

          dialogFormVisible(val){
            if(this.$refs['form']){
              this.$refs['form'].resetFields();
            }
        }
      },
      data(){
        return {
            dialogLoading: false,
            form: {
              code: undefined,
              type: undefined,
              name: undefined,
              uri: undefined,
              menuId: this.currentMenuId,
              method: undefined,
              description: undefined
            },
            textMap: {
              update: '编辑',
              create: '创建'
            },
            methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
            typeOptions: ['uri', 'button'],
            rules: {
              code: [{
                required: true,
                message: '请输入资源编码',
                trigger: 'blur'
              }
              ],
              type: [{
                required: true,
                message: '请输入资源类型',
                trigger: 'blur'
              },
                {
                  min: 2,
                  max: 20,
                  message: '长度在 2 到 20 个字符',
                  trigger: 'blur'
                }
              ],
              name: [{
                required: true,
                message: '请输入资源名称',
                trigger: 'blur'
              },
                {
                  min: 2,
                  max: 20,
                  message: '长度在 2 到 20 个字符',
                  trigger: 'blur'
                }
              ],
              uri: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
                {
                  min: 3,
                  max: 20,
                  message: '长度在 3 到 20 个字符',
                  trigger: 'blur'
                }
              ],
              method: [{
                required: true,
                message: '请输入资源请求类型',
                trigger: 'blur'
              },
                {
                  min: 3,
                  max: 20,
                  message: '长度在 3 到 20 个字符',
                  trigger: 'blur'
                }
              ],
              description: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
                {
                  min: 3,
                  max: 20,
                  message: '长度在 3 到 20 个字符',
                  trigger: 'blur'
                }
              ]
            },
          }
      },
      created(){

      },
      methods:{
        changeForm(){
          this.$emit('change');
        },
        create(formName){
          this.$set(this.form,"menuId", this.currentMenuId)
          this.$refs[formName].validate(valid => {
            if (valid) {
              addObj(this.form).then(res => {
                this.resultMsg(res);
              })
            } else {
              return false;
            }
          });
        },
        update(formName){
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.$set(this.form,"menuId", this.currentMenuId)
              putObj(this.form.id, this.form).then(res=> {
                this.resultMsg(res);
              });
            } else {
              return false;
            }
          });
        },
        cancel(){
          this.$set(this.dialog,'dialogFormVisible', false);
          this.changeForm();
        },
        resultMsg(res){
          if (res.rel){
            this.cancel();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            });
          }
        }



      }

    }
</script>

<style scoped>

</style>
