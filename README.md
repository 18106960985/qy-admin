该项目为前后分离项目。
    1、前端使用 vue-element-admin作为基础前端框架进行2次开发 
      主要包含 element-ui vuex axios等等vue组件
    2、后端采用spring cloud  +spring data jpa +spring boot 等技术搭建 的快速开发框架  <a href="https://gitee.com/y747718944/QiYueSpring-Cloud">七月Spring cloud</a>
      目前后端分为   
       cloud conter --分布式指挥中心   
       gateServer    --分布式网关   
       cloud admin  --主要服务 
       【目前是集中式的spring boot 搭建，考虑到并不是所有的项目都有上分布式的情况后续能分为两个版本，集中式和 分布式。并都是前后分离项目】