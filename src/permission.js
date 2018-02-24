import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' //  progress 进度条
import 'nprogress/nprogress.css'// progress 进度条样式
import { getToken } from '@/utils/auth' //   cookie中的token

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']//  免登录白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
        /**
         *   下面是根据角色与页面权限进行配对
         */

        // store.dispatch('GetUserInfo').then(res => { // 拉取user_info
        //
        //   const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
        //   store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
        //     router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        //     next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        //   })
        //
        // }).catch(() => {
        //   store.dispatch('FedLogOut').then(() => {
        //     Message.error('Verification failed, please login again')
        //     next({ path: '/login' })
        //   })
        // })
        /**
         * 本系统前端只控制路由和路由权限，不涉及角色。所以采用以下方案
         */
        if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetUserInfo').then(info => { // 拉取user_info
            const menus = {};
            for (let i = 0; i < info.menus.length; i++) {
              menus[info.menus[i].code] = true;
            }
            store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to }); // hack方法 确保addRoutes已完成
            })
          }).catch(() => {
            store.dispatch('FedLogOut').then(() => {
              Message.error('Verification failed, please login again')
              next({ path: '/login' });
            })
          })
        } else {
          //  else {
          //   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
          //   if (hasPermission(store.getters.roles, to.meta.role)) {
          //     next();//
          //   } else {
          next();
          //   }
          //   // 可删 ↑
        }
      }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
