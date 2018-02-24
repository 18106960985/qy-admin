/* eslint-disable no-extend-native */
import FileSaver from 'file-saver';
// import {csvFormatRows} from 'd3-dsv';

Date.prototype.Format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  }
  return fmt;
};

Date.prototype.toJSON = function () {
  return this.Format('yyyy-MM-dd hh:mm:ss');
};

String.prototype.stringPad = function (len, char, way) {
  if (way !== 'L' && way !== 'R' && way !== 'l' && way !== 'r') {
    return this;
  }
  let val = this.trim();
  for (let i = 0; i < len - val.length; i++) {
    if (way === 'R' || way === 'r') {
      val = char + val;
    } else {
      val = val + char;
    }
  }
  return val;
};

Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};
Array.prototype.baoremove = function(dx)
{
  if(isNaN(dx)||dx>this.length){return false;}
  this.splice(dx,1);
};

const CONDITION_TRANS = {
  'EQ': '=',
  'NEQ': '<>',
  'LT': '<',
  'LTE': '<=',
  'LIKE': '?',
  'GT': '>',
  'GTE': '>=',
  'IN': '='
};

/**
 * 查询表单转查询条件
 *
 *     传入的form格式如下
 *    1， 属性与检索方式用下划线（_）分割
 *
 *    2， 检索方式参考本文件的 CONDITION_TRANS 对象
 *
 *      searchForm:{
 *                  name_LIKE:'',
 *                  signatoryId_EQ:'',
 *                  contractOrganizationId_EQ:'',
 *                  status_EQ:'',
 *                  operativeDate:'',
 *                  loseEfficacyDate:'',
 *              },
 *
 *
 * @param form
 * @returns {string}
 */
export const toFilters = form => {
  let filters = [];
  for (let parameter in form) {
    let cons = parameter.split('_');
    if (form[parameter] instanceof Array && isEmpty(form[parameter][0])) {
      continue;
    }
    if (isEmpty(form[parameter])) {
      continue;
    }
    if (cons[0].toLowerCase().indexOf('Date'.toLowerCase()) !== -1 && !isEmpty(form[parameter][0]) && !isEmpty(form[parameter][1])) {
      filters.push(cons[0] + CONDITION_TRANS.GTE + new Date(form[parameter][0]).Format('yyyy-MM-dd'));
      filters.push(cons[0] + CONDITION_TRANS.LTE + new Date(form[parameter][1]).Format('yyyy-MM-dd'));
      continue;
    }
    switch (cons[1]) {
      case 'EQ':
        filters.push(cons[0] + CONDITION_TRANS.EQ + form[parameter]);
        break;
      case 'NEQ':
        filters.push(cons[0] + CONDITION_TRANS.NEQ + form[parameter]);
        break;
      case 'LT':
        filters.push(cons[0] + CONDITION_TRANS.LT + form[parameter]);
        break;
      case 'LTE':
        filters.push(cons[0] + CONDITION_TRANS.LTE + form[parameter]);
        break;
      case 'LIKE':
        filters.push(cons[0] + CONDITION_TRANS.LIKE + form[parameter]);
        break;
      case 'GT':
        filters.push(cons[0] + CONDITION_TRANS.GT + form[parameter]);
        break;
      case 'GTE':
        filters.push(cons[0] + CONDITION_TRANS.GTE + form[parameter]);
        break;
      case 'IN':
        filters.push(cons[0] + CONDITION_TRANS.IN + form[parameter]);
        break;
    }
  }
  console.log(filters.join(';'));
  return filters.join(';');
};

export const parseSearchCondition = o => {
  let str = [];
  for (let p in o) {
    if (o[p] !== '' && o[p] !== null) {
      let conditions = p.split('_');
      if (conditions.length === 2) {
        str.push(conditions[1] + CONDITION_TRANS[conditions[0]] + o[p]);
      } else {
        str.push(p + '=' + o[p]);
      }
    }
  }
  return str.join(';');
};

export const objToFilter = o => {
  let str = [];
  for (let p in o) {
    if (!isEmpty(o[p])) {
      str.push(p + '=' + o[p]);
    }
  }
  return str.join(';');
};

export const resetObjNull = o => {
  for (let p in o) {
    if (o[p] instanceof Array) {
      o[p] = [];
    } else {
      o[p] = null;
    }
  }
};

/**
 * 判断属性是否空
 * @param str
 * @returns {boolean}
 */
export const isEmpty = str => {
  if (str === '' || str == null || str === undefined) {
    return true;
  }
  if (str instanceof Array) {
    if (str == null || str.length <= 0) {
      return true;
    }
  }

  return false;
};

/**
 *
 * @param value   传入下拉框值
 * @param prop    传入下拉框值属性
 * @param list    传入下拉框数据（数据源--数组对象格式数据）
 * @returns {object}
 */
export const getSelectObect = (value, prop, list) => {
  if (isEmpty(value)) {
    return '';
  }

  for (let ls in list) {
    if (list[ls][prop] === value) {
      return list[ls];
    }
  }
};




/**
 * 忽略大小写判断字符串是否相同
 * @param str1
 * @param str2
 * @returns {boolean}
 */
export const isStrEqualsIgnorecase = (str1, str2) => {
  if (str1.toUpperCase() === str2.toUpperCase()) {
    return true;
  }

  return false;
};

/**
 * 格式化日期（不含时分秒）
 * @param date
 * @returns {string}
 */
export const formatterDate = date => {
  var datetime = date.getFullYear() +
    '-' +// "年"
    ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0' +
      (date.getMonth() + 1)) +
    '-' +// "月"
    (date.getDate() < 10 ? '0' + date.getDate() : date
      .getDate());
  return datetime;
};

export const clearEmptyChildren = data => {
  for (let i in data) {
    let o = data[i];
    if (o.children !== undefined && o.children instanceof Array) {
      if (o.children.length === 0) {
        delete o.children;
      } else {
        clearEmptyChildren(o.children);
      }
    }
  }
};

export const handleTreeItem = (tree, fn) => {
  tree.forEach(item => {
    fn(item);
    if (item.children) {
      handleTreeItem(item.children, fn);
    }
  });
};

export const findTreeItem = (tree, p, v) => {
  let result = null;
  let fn = (tree, p, v) => {
    tree.forEach(item => {
      if (item[p] === v) {
        result = item;
      }
      if (item.children.length) {
        fn(item.children, p, v);
      }
    });
  };

  fn(tree, p, v);
  return result;
};

// export const downloadFile = (content, headers = [], downloadFileName = 'file') => {
//   let p = csvFormatRows((headers.length === 0 ? [] : [headers]).concat(content));
//   let isFileSaverSupported = false;
//
//   try {
//     isFileSaverSupported = !!new Blob();
//   } catch (e) {
//     isFileSaverSupported = false;
//   }
//
//   if (!isFileSaverSupported) {
//     console.error('File download not supported in your Browser. Please update to a latest browser.', 5000);
//     return;
//   }
//
//   let mimeType = 'text/csv;charset=utf-8';
//   let filename = (downloadFileName || 'file') + '.csv';
//   let file = new File([p], filename, {type: mimeType});
//   FileSaver.saveAs(file, filename);
// };
/**
 * 数组对象去重
 * uniqeByKeys(arr,['id']);
 * @param array
 * @param kys
 */
export const uniqeByKeys = (array, keys) => {
  let arr = [];
  let hash = {};
  for (let i = 0, j = array.length; i < j; i++) {
    let k = objToString(array[i], keys);
    if (!(k in hash)) {
      hash[k] = true;
      arr.push(array[i]);
    }
  }
  return arr;
};
export const objToString = (obj, keys) => {
  let tr = keys.length;
  let key = [];
  while (tr--) {
    key.push(obj[keys[tr]]);
  }
  return key.join('|');
};

export const regExps = {
  isNum: /^(-)?\d+(\.\d+)?$/
};

/**
 *
 *  拼接filers json串
 * @param filters 过滤字段
 * @param sorts 排序关键字
 * @param page  分页
 * @param size  每页
 * @returns {{params: {filters: *, sorts: *, page: *, size: *}}}
 */
export const getFilersParam=(filters,sorts,page,size) =>{
  return {params: {filters: filters,sorts :sorts,page:page ,size:size}};
};

export const findMerchantLevelName=str=>{
  let strTemp = "";
  if (str=="1") {
    strTemp = "总代理";
  } else if (str=="2") {
    strTemp = "代理";
  } else if (str=="3") {
    strTemp = "子代理";
  } else if (str=="4") {
    strTemp = "企业";
  } else if (str=="5") {
    strTemp = "代理管理";
  } else if (str=="6") {
    strTemp = "信息查询";
  } else if (str=="7") {
    strTemp = "用户";
  } else if (str=="8") {
    strTemp = " 信息查询 "; // 代理级
  } else if (str=="9") {
    strTemp = "企业管理";// 代理级
  }else if (str=="10"){
    strTemp = "信息查询"; // 子代理级
  }else if (str=="11"){
    strTemp = "企业管理";// 子代理级
  }else if (str=="12"){
    strTemp = "信息查询";// 企业级
  }else if (str=="13"){
    strTemp = "用户管理";// 企业级
  } else {
    strTemp = "无该权限 ";
  }
  return strTemp;

}

export  const formatJso0n=(filterVal, jsonData)=> {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timestamp') {
      return parseTime(v[j])
    } else {
      return v[j]
    }
  }))
}
