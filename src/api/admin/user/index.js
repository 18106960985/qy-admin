import request from '@/utils/request';
import { API_ADMIN , API_AUTH } from '@/utils/lib/CommonConstant';


export const all =filters=> {
  return request.get(API_ADMIN+'user/all',filters);
}

export function page(query) {
  return request({
    url: API_ADMIN+'user/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: API_ADMIN+'user',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: API_ADMIN+'user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: 'user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: API_ADMIN+'user/' + id,
    method: 'put',
    data: obj
  })
}
