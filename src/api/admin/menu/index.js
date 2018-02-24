import request from '@/utils/request';
import { API_ADMIN , API_AUTH } from '@/utils/lib/CommonConstant';

const  Menu_tree = API_ADMIN + 'menu/tree';
const  Menu_all = API_ADMIN + 'menu/all';
const  Menu = API_ADMIN + 'menu';
const  Menu_= API_ADMIN + 'menu/';


export function fetchTree(query) {
  return request({
    url: Menu_tree,
    method: 'get',
    params: query
  });
}

export function fetchAll() {
  return request({
    url: Menu_all,
    method: 'get'
  });
}
export function addObj(obj) {
  return request({
    url: Menu,
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: Menu_ + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: Menu_ + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: Menu_ + id,
    method: 'put',
    data: obj
  })
}
