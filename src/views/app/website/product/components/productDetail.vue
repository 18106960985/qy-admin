
<!--产品详情表单-->
<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" v-loading="loading">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">

          <el-button  v-if="isEdit"  v-loading="loading" style="margin-left: 10px;" type="success" @click="update()">更新
          </el-button>
          <el-button  v-else  v-loading="loading" style="margin-left: 10px;" type="primary" @click="create()">创建
          </el-button>
          <el-button v-loading="loading" type="warning" @click="cancel">取消</el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.name" required :maxlength="100">
                产品名称
              </MDinput>
              <span v-show="postForm.name.length>=26" class='title-prompt'>app可能会显示不全</span>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item style="margin-bottom: 40px;" label-width="90px" label="产品缩略图:">
            <div style="margin-bottom: 20px;">
              <Upload v-model="postForm.smallImgPath"></Upload>
            </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="90px" label="产品图片:">
              <div style="margin-bottom: 20px;">
                <Upload v-model="postForm.imgPath" type="xxx"></Upload>
              </div>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="90px" label="产品介绍:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.introduce">
          </el-input>
          <span class="word-counter" v-show="introduceLength">{{introduceLength}}字</span>
        </el-form-item>

        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.details"></tinymce>
        </div>


      </div>
    </el-form>

  </div>
</template>

<script>
  import eventhub from '@/eventHub/eventHub'
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import Sticky from '@/components/Sticky'

  import {getObj,addObj , putObj} from '@/api/app/product/detailsIndex'



  const defaultForm = {
    id: undefined,
    name: '', //  产品名称
    label: '', // 产品标签
    smallImgPath: '', // 产品缩略图
    imgPath: '', // 产品图片
    introduce:'',//产品介绍
    details:'', //产品详情
    typeId:''
  }



  export default {
    name: "product-detail",
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky  },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      curId: Number,
      curTypeId: Number,
    },
    data() {
      return {
        postForm: Object.assign({}, defaultForm),
        fetchSuccess: true,
        loading: false,
        rules: {

        }
      }
    },
    computed: {
      introduceLength() {
        return this.postForm.introduce.length
      }
    },
    created() {
      if (this.isEdit) {
        this.fetchData()
      } else {
        this.postForm = Object.assign({}, defaultForm)
        this.postForm.typeId = this.curTypeId;
        this.postForm.id = this.curId;
      }
    },
    methods: {
      fetchData() {
        this.loading = true ;
        getObj(this.curId).then(res =>{
          this.loading = false ;
          this.postForm = res.data;
        })

      },
      create(){
        this.loading = true;
        console.log(this.postForm)
        addObj(this.postForm).then(res=>{
          this.resultMsg(res);
        }).catch(err=>{
          this.$notify({
            title:'error',
            message: err.message,
            type: 'error',
            duration: 2000
          })
          this.loading = false;
          this.fetchSuccess = false;
        })
      },
      update(){
        this.loading = true;
        this.$set(this.postForm,'typeId',this.curTypeId)
        putObj(this.postForm.id,this.postForm).then( res=>{
          this.resultMsg(res);
        }).catch(err=>{
          this.$notify({
            title:'error',
            message: err.message,
            type: 'error',
            duration: 2000
          })
          this.loading = false;
          this.fetchSuccess = false;
        })
      },
      resultMsg(res){
        this.loading = false;
        if (res.rel){
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
      },
      cancel() {
        eventhub.$emit('switchCard')
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

