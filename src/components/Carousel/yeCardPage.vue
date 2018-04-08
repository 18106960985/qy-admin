<template>

  <section class="page" v-if="option"
           :style="{background: option.background,color: option.color}"
           :class=" [{'page-before ': option.index< currentPage,
                'page-after ':  option.index > currentPage,
                'page-current ': option.index === currentPage,
                },  option.direction == 'x' ? 'x' : 'y']" >
    <div  class="window-cut"  :class="[{'all-center ': option.isCenter  },option.direction == 'x' ? 'banner-bin' : 'window-bin']"    :style="option.style">
         <slot ></slot>
    </div>
  </section>
  <section class="page " v-else-if="index"
           :class=" [{'page-before ': index< currentPage,
                'page-after ':  index> currentPage,
                'page-current ': index=== currentPage,
                },  direction == 'x' ? 'x' : 'y']" >
    <div  class="window-cut"  :class="[{'all-center ':isCenter  },direction == 'x' ? 'banner-bin' : 'window-bin']"  >
      <slot ></slot>
    </div>
  </section>

  <section class="page" v-else>页面正在渲染中。。。</section>
</template>

<script>
  // 卡片布局
    export default {
        name: "ye-card-page",
      props:{
        currentPage: {
          type:Number,
        },
        index:{
          type: Number
        },
        direction:{
          type:String,
          default:'x'
        },
        isCenter:{
          type: Boolean,
          default: false,
        }

      },
      watch:{

      },
      computed:{
      },
      methods:{
          //页面变化
      },
      mounted(){
      },
      data(){
        return {
          option: null,
        }
      },
    }
</script>

<style scoped>
  .banner-bin {
    width: 100%;
    height: 100%;
    float: left;
    display: block;
    overflow: hidden;
    background: center no-repeat;
    background-size: cover;
    position: relative;
  }

  .page {
    overflow: hidden;
    position: absolute;

    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: all 0.5s ease 0s;
    z-index: 1;
    width: 100%;



  }
  .page-before {
    z-index: 0;
  }
  .page-before.x{
    transform: translate3d(-100%, 0, 0);

  }
  .page-before.y{
    transform: translate3d(0, -100%, 0);
  }
  .page-after {
    z-index: 0;
  }
  .page-after.x{
    transform: translate3d(100%, 0, 0);
  }
  .page-after.y{
    transform: translate3d(0, 100%, 0);
  }
  /* 水平、垂直居中 */
  .all-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
