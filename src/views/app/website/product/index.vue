<!--整体的布局-->

<template>
  <div class="app-container calendar-list-container " style="width:100%;overflow:hidden">


     <!--第一页功能页-->
    <ye-card-page :currentPage="currentPage" :index="1" >
      <product-index></product-index>
    </ye-card-page>
    <!--第二页一个大表单-->
    <ye-card-page :currentPage="currentPage" :index="2" >
       <index-form></index-form>
    </ye-card-page>
  </div>

</template>

<script>
  import yeCardPage from '@/components/Carousel/yeCardPage';
  import productIndex from './components/productIndex'
  import eventhub from '@/eventHub/eventHub'
  import IndexForm from './components/form/index'
    export default {
        name: "product-layout-index",
      components:{
        'ye-card-page':yeCardPage,// 一个幻灯片切换组件
        'product-index': productIndex,
        'index-form':IndexForm

      },
      data(){
          return {
            currentPage: 1,
            curId: undefined, //当前表单的ID
          }
      },
      created(){
        eventhub.$on('switchCard',()=>{
            this.currentPage = this.currentPage == 1? 2:1;
        });

        eventhub.$on("operatingForm",(obj)=>{

        })
      }
    }
</script>

<style scoped>

  .box-clear{clear:both;height:0;overflow:hidden;}
</style>
