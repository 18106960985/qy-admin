<template>
  <product-detail :is-edit='stauts'></product-detail>
</template>

<script>
  import productDetail from './components/productDetail'
    export default {
        name: "IndexForm",
      components:{
        'product-detail' : productDetail,
      },
      props:{
          stauts:{
            type:Boolean,
            default: false,
          }
      }
    }
</script>

<style scoped>

</style>
