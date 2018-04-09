<!--整体的布局-->

<template>


     <!--第一页功能页-->
    <transition-group appear name="box-move-x" mode="out-in">
      <product-detail v-if="!current" :is-edit='status' :curId="curId" :curTypeId="curTypeId" :key="1"></product-detail>
      <product-index v-show="current" :key="0"></product-index>
    </transition-group>

</template>

<script>
  import yeCardPage from '@/components/Carousel/yeCardPage';
  import productIndex from './components/productIndex'
  import eventhub from '@/eventHub/eventHub'
  import productDetail from './components/productDetail'
    export default {
        name: "product-layout-index",
      components:{
        'ye-card-page':yeCardPage,// 一个幻灯片切换组件
        'product-index': productIndex,
        'product-detail' : productDetail,

      },
      data(){
          return {
            current: true,
            curId: '', //当前表单的ID
            curTypeId: undefined,
            status:false,
          }
      },
      created(){
        eventhub.$on('switchCard',(val)=>{
            this.current = this.current ? false:true;
            if(val){
              this.curId = val.curId;
              this.curTypeId = val.curTypeId;
              this.status = val.isEdit;
            }
        });

      }
    }
</script>

<style scoped>

  .box-clear{clear:both;height:0;overflow:hidden;}
</style>
