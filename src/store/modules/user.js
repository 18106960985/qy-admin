/**
 * 有关登录和获取用户信息
 */

import { loginByUsername, logout, getUserInfo, getMenus} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {
  Message
} from 'element-ui';
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: undefined,
    eleemnts: undefined,
    permissionMenus: undefined,
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          let token = response.token;
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const data = response
          commit('SET_ROLES', data.roles) //当前用户角色
          commit('SET_NAME', data.name)  //角色名
          // commit('SET_AVATAR', data.avatar)//头像信息
          commit('SET_AVATAR','http://himg.bdimg.com/sys/portrait/item/43f7e4b883e69c88e28496e6b581e6989f9d13.jpg');
          commit('SET_INTRODUCTION', data.introduction) //个人介绍
          const menus = {};  //拥有的菜单项
          for (let i = 0; i < data.menus.length; i++) {
            menus[data.menus[i].code] = true;
          }
          commit('SET_MENUS', menus);
          //
          const elements = {}; //页面拥有的组件项
          for (let i = 0; i < data.elements.length; i++) {
            elements[data.elements[i].code] = true;
          }
          commit('SET_ELEMENTS', elements);
          resolve(response)
        }).catch(error => {
          reject(error)
        });
        getMenus(state.token).then(response => {
          commit('SET_PERMISSION_MENUS', response);
        });
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_MENUS', undefined);
          commit('SET_ELEMENTS', undefined);
          commit('SET_PERMISSION_MENUS', undefined);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENUS', undefined);
        commit('SET_ELEMENTS', undefined);
        commit('SET_PERMISSION_MENUS', undefined);
        removeToken();
        resolve();
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        setToken(role)
        resolve()
      })
    }
  }
}

export default user
