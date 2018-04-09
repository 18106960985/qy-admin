<template>

  <transition-group appear name="box-move-x" mode="out-in">
    <information-detail v-if="!current" :curId="curId" :key="1" :isEdit="status"></information-detail>
    <information-index  v-show="current" :key="0"></information-index>
  </transition-group>
</template>

<script>
  import eventhub from '@/eventHub/eventHub'
  import informationIndex from './components/informationIndex'
  import informationDetail from './components/informationDetail'
  export default {
        name: "index",
    components:{
      informationIndex,
      informationDetail
    },
      data(){
        return {
          current: true,
          curId:undefined, //当前表单的ID
          status:false,
        }
      },
      created(){
        eventhub.$on('switchCard',(val)=>{
          this.current = this.current ? false:true;
          if(val){
            this.curId = val.curId;
            this.status = val.isEdit;
          }
        });

        eventhub.$on("operatingForm",(obj)=>{

        })
      }
    }
</script>

<style scoped>

</style>
