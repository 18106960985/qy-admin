<template>
  <el-dialog :title="textMap[dialog.dialogStatus]"   :visible.sync="dialog.dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="字段编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入字段编码"> </el-input>
      </el-form-item>
      <el-form-item label="属性值" prop="value">
        <el-input v-model="form.value" placeholder="请输入属性值"></el-input>
      </el-form-item>

      <el-form-item label="默认值" prop="labelDefault">
        <el-input v-model="form.labelDefault" placeholder="请输入默认值"></el-input>
      </el-form-item>
      <el-form-item label="中文值" prop="labelZhCH">
        <el-input v-model="form.labelZhCH" placeholder="请输入中文值"></el-input>
      </el-form-item>
      <el-form-item label="英文值" prop="labelEn">
        <el-input v-model="form.labelEn" placeholder="请输入英文值"></el-input>
      </el-form-item>
      <el-form-item label="顺序号" prop="orderNum">
        <el-input v-model="form.orderNum" placeholder="请输入顺序号"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入描述"></el-input>
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

 import {addObj,putObj} from '@/api/admin/dict/dictValue';
  // 该组件为菜单组件form表单
  export default {
    name: "dict-value-form",
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
      curDictTypeId:Number
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
          id: undefined,
          code: undefined,
          value: undefined,
          labelDefault: undefined,
          labelZhCH:undefined,
          labelEn: undefined,
          orderNum: undefined,
          description: undefined,
          // dictTypeId : undefined
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        // methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        // typeOptions: ['uri', 'button'],
        rules: {
          code: [{
            required: true,
            message: '请输入字典编码',
            trigger: 'blur'
          }
          ],


          description: [{
            required: false,
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
        this.$set(this.form,"dictTypeId", this.curDictTypeId)
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
            this.$set(this.form,"dictTypeId", this.curDictTypeId)
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
