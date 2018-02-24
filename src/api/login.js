import request from '@/utils/request';
import { API_ADMIN , API_AUTH } from '@/utils/lib/CommonConstant';




const  JWT_TOKEN = API_AUTH + 'jwt/token';
const  JWT_INVALID = API_AUTH + 'jwt/invalid';
const  user_front_info = API_ADMIN + 'user/front/info';
const user_front_menus = API_ADMIN + 'user/front/menus';

export function loginByUsername(account, password) {
  let data = {
    'account':account,
    'password':password
  };
//   return  fetch.post(JWT_TOKEN, {params:data});
  return request({
    url: JWT_TOKEN,
    method: 'post',
    data
  });

}

export function logout() {
  return  request.post(JWT_INVALID) ;
}

export function getUserInfo(token) {

  return request({
    url: user_front_info,
    method: 'get',
    params: {token}
  });
}

export function getMenus(token) {
  return request({
    url: user_front_menus,
    method: 'get',
    params: {token}
  });
}




