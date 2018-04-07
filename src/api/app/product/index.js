import request from '@/utils/request';
import { API_ADMIN , API_AUTH } from '@/utils/lib/CommonConstant';



const  API =API_ADMIN +"productType/";


export function getTree (){
  return request({
    url: API+"/tree",
    method:"get"
  });
}

export function getForm(id) {

  return request({
    url: API+id,
    method: 'get'
  })

}


export function add(obj) {
  return request({
    url: API,
    method: "post",
    data: obj
  })

}

export function update(id,obj){
  return request({
    url: API+id,
    method: 'put',
    data: obj,
  })

}

export function delObj(id) {
  return request({
    url:API+id,
    method: 'delete',
  })

}


