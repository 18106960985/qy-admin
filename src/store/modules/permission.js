import { asyncRouterMap, constantRouterMap } from '@/router'
import {fetchAll} from "../../api/admin/menu";

/**
 * 通过authority判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.authority) {
    if (menus[route.authority] !== undefined) {
      return menus[route.authority];
    } else {
      return false;
    }
  } else {
    return true
  }
}


/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus, menuDatas) {
  const accessedRouters = asyncRouterMap.filter(route => {

    if (hasPermission(menus, route)) {
      //判断因为 404为*
      if (route.authority != undefined && route.meta != undefined){

        route.meta.title = menuDatas[route.authority].title;
        // route.meta.icon = menuDatas[route.authority].icon;
        route.meta.icon = 'documentation';
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus, menuDatas);
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
                     commit
                   }, menus) {
      return new Promise(resolve => {
        fetchAll().then(res => {
          const menuDatas = {};
          let data=res.data;
          for (let i = 0; i < data.length; i++) {
            menuDatas[data[i].code] = data[i];
          }
          const accessedRouters = filterAsyncRouter(asyncRouterMap, menus, menuDatas);

          commit('SET_ROUTERS', accessedRouters);
          resolve();
        });
      })
    }
  }
};

export default permission;
