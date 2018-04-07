import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
//在development-env中不使用延迟加载，因为延迟加载太多页面会导致webpack热更新太慢。 所以只有在生产中使用延迟加载;
//详细信息

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
/**
 * //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面(默认 false)
 hidden: true

 //当设置 noredirect 的时候该路由不会在面包屑导航中出现
 redirect: noredirect

 //当设置 true 的时候永远会显示根菜单，不设置的情况下只有当子路由个数大于一个时才会显示根菜单
 //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式。只有一个时会将那个子路由当做根路由
 alwaysShow: true
    下面这些写了也没用，数据都是从后端获取并改写的
   name:'router-name'            //设定路由的名字，一定要填写不然 使用 <keep-alive> 时会出现各种问题
   meta : {
    roles: ['admin','editor']   //设置该路由进入的权限，支持多个权限叠加 没有用到前端角色控制权限
    title: 'title'              //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'            //设置该路由的图标
    noCache: true               //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
  }
 */


/**
 * 白名单通用路由
 * @type {*[]}
 */
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta:{ title:'dashboard', icon: 'dashboard', onChange:true}
    }]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [{
      path: 'index',
      component: _import('documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


/**
 * 权限路由，由后台传输进行匹配
 * @type {*[]}
 */
export const asyncRouterMap = [
  {
    path: '/baseManager',
    component: Layout,
    authority: 'baseManager',
    redirect: 'noredirect',//不重定向
    alwaysShow: true,//根菜单是否显示
    name: 'form',
    meta: {
      title: 'form',
      icon: 'form'
    },
    children: [
      { path: 'userManager',
        component: _import('admin/user/index'),
        authority: 'userManager',
        name: '用户管理',
        meta: { title: 'createForm', icon: 'table'
      }},
      { path: 'menuManager',
        component: _import('admin/menu/index'),
        authority: 'menuManager',
        name: '菜单管理',
        meta: { title: 'createForm', icon: 'table'
        }},
      { path: 'dictManager',
        component: _import('admin/dict/index'),
        authority: 'dictManager',
        name: '数据字典',
        meta: { title: 'createForm', icon: 'table'
        }}
    ]
  },
  {
    path: '/websiteManagement',
    authority: 'websiteManagement',
    component: Layout,
    redirect: 'noredirect',//不重定向
    alwaysShow: true,//根菜单是否显示
    meta: {
      title: 'form',
      icon: 'form'
    },
    children: [
      { path: 'websiteIndex',
        component: _import('app/website/product/index'),
        authority: 'websiteIndex',
        name: '首页管理',
        meta: { title: 'createForm', icon: 'table'
        }},
      { path: 'productMangement',
        component: _import('form/edit'),
        authority: 'productMangement',
        name: '产品管理',
        meta: { title: 'createForm', icon: 'table'
        }},
      { path: 'InformationMangement',
        component: _import('form/create'),
        authority: 'InformationMangement',
        name: '资讯管理',
        meta: { title: 'createForm', icon: 'table'
        }}
    ]
  },


  { path: '*', redirect: '/404', hidden: true }
]
