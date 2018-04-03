import request from '@/utils/request';
import { API_ADMIN , API_AUTH } from '@/utils/lib/CommonConstant';


const  API =API_ADMIN +"dictType/";

// 获取字典树
export function getDictTree (){
   return request({
     url: API+"/tree",
     method:"get"
   });
}

export function getDictType(id) {

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



