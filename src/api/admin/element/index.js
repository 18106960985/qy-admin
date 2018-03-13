import request from '@/utils/request';
import { API_ADMIN , API_AUTH } from '@/utils/lib/CommonConstant';

export function page(query) {
  return request({
    url: API_ADMIN + 'element/list',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: API_ADMIN + 'element',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: API_ADMIN + 'element/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: API_ADMIN + 'element/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: API_ADMIN + 'element/' + id,
    method: 'put',
    data: obj
  })
}
