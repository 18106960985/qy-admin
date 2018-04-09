<!--整体的布局-->

<template>
  <div>


     <!--第一页功能页-->
    <transition appear name="box-move-x">
      <product-index v-if="current"></product-index>

      <product-detail v-else  :is-edit='stauts' :curId="curId" :curTypeId="curTypeId"></product-detail>

    </transition>

  </div>

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
            stauts:false,
          }
      },
      created(){
        eventhub.$on('switchCard',(val)=>{
            this.current = this.current ? false:true;
            if(!this.current){
            this.curId = val.curId;
            this.curTypeId = val.curTypeId;
            this.stauts = val.isEdit;
          }
        });

        eventhub.$on("operatingForm",(obj)=>{

        })
      }
    }
</script>

<style scoped>

  .box-clear{clear:both;height:0;overflow:hidden;}
</style>
