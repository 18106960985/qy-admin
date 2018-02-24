import {isEmpty, resetObjNull, objToFilter} from './util.js';

/**
 * 判断手机格式
 * @param str1
 * @returns {boolean}
 */
export const isPhone = (str) => {
  const regex = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
  if(!regex.test(str)){
    regex.lastIndex = 0;
    return false;
  }else{
    regex.lastIndex = 0;
    return true
  }
}
/**
 * 身份证号码验证
 * @param str1
 * @returns {boolean}
 */
export const isIdCardNo = (str) => {
  const regex = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
  if(!regex.test(str)){
    regex.lastIndex = 0;
    return false;
  }else{
    regex.lastIndex = 0;
    return true
  }
}

/**
 *匹配密码，以字母开头，长度在6-16之间，只能包含字符、数字和下划线。
 * @param str1
 * @returns {boolean}
 */
export const isPwd = (str) => {
  const regex = /^[a-zA-Z]\w{6,15}$/;
  if(!regex.test(str)){
    regex.lastIndex = 0;
    return false;
  }else{
    regex.lastIndex = 0;
    return true
  }
}
/**
 *验证字符，只能包含中文、英文、数字、下划线等字符。
 * @param str1
 * @returns {boolean}
 */

export const stringCheck = (str) => {
  const regex = /^[a-zA-Z0-9一-龥-_]+$/;
  if(!regex.test(str)){
    regex.lastIndex = 0;
    return false;
  }else{
    regex.lastIndex = 0;
    return true
  }
}

export const isTelPhone = (str) => {
  const regex = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/;
  if(!regex.test(str)){
    regex.lastIndex = 0;
    return false;
  }else{
    regex.lastIndex = 0;
    return true
  }
}

export const isInteger = (str) => {
  const regex = /^[+]?\d+$/;
  if(!regex.test(str)){
    regex.lastIndex = 0;
    return false;
  }else{
    regex.lastIndex = 0;
    return true
  }
}




/**
 * 获得验证规则
 *  rulesList.push({param:'phone',flag:false});
 * @param rulesList
 * @returns {*}
 */
export const getRulesList=(rulesList)=>{

  if(isEmpty(rulesList)){//如果等于空
    return  null;
  }
  let retList={};
  rulesList.map(item=>{
    if(!item.element){
      retList[item.element] = switchRules(item.param,item.flag);
    }else{
      retList[item.element] = switchRules(item.param,item.flag);
    }

  });
  return  retList;
}



/**
 * 以下都是验证回调
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const  validatePhone = (rule, value, callback) => {
  if(!value)callback();
  let flag = isPhone(value);
  if (!flag) {
    return callback(new Error('请填写正确的手机号'));
  } else {
    callback();
  }
};
export const  validatePWD = (rule, value, callback) => {

  let flag = isPwd(value);

  if (!flag) {
    return callback(new Error('请输入合法密码，格式以字母开头，长度在6-16之间，只能包含字符、数字和下划线'));
  } else {
    callback();
  }
};
export const  validateString = (rule, value, callback) => {
  let flag = stringCheck(value);
  if (!flag) {
    return callback(new Error('请输入合法账号，只能包含中文、英文、数字、下划线等字符'));
  } else {
    callback();
  }
};

export const  validateIdCardNo = (rule, value, callback) => {
  if(!value)callback();
  let flag = isIdCardNo(value);
  if (!flag) {
    return callback(new Error('请输入合法身份证号码'));
  } else {
    callback();
  }


};

export const  validateTelPhone = (rule, value, callback) => {
  if(!value)callback();
  let flag = isTelPhone(value);
  if (!flag) {
    return callback(new Error('请输入正确固定号码！'));
  } else {
    callback();
  }
};

/**
 * 利用switch挑选需要的验证规则
 */
export const switchRules=(param,flag)=>{
  let temp;
  switch (param){
    case  'name':
      temp= [
        {required: flag, message: '请输入名称', trigger: 'change'},
        {validator: validateString, trigger: 'blur'},
        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change'}
      ];

      break;
    case 'phone':
      temp= [
        {required: flag, message: '请输入手机号', trigger: 'change'},
        {validator: validatePhone, trigger: 'blur'},
        {min: 11, max: 11, message: '长度在11个字符', trigger: 'change'}
      ];

      break;

    case 'telPhone':
      temp=[
        {required: flag, message: '请输入固定电话', trigger: 'change'},
        {validator: validateTelPhone, trigger: 'blur'},
        {min: 7, max: 12, message: '长度在 7 到12 个字符', trigger: 'blur'}
      ];
      break;
    case 'identityCard':
      temp=[
        {required: flag, message: '请输入身份证', trigger: 'blur'},
        {validator: validateIdCardNo, trigger: 'blur'},
        {min: 18, max: 18, message: '长度在18 到 18 个字符', trigger: 'blur'}
      ];

      break;

    case 'companyName':
      temp= [
        {required: flag, message: '请输入公司名称', trigger: 'blur'},
        {min: 2, max: 50, message: '长度在2 到 50 个字符', trigger: 'blur'}
      ]
      break;

    case 'password':
      temp= [
        {required: flag, message: '请输入密码', trigger: 'blur'},
        {validator: validateString, trigger: 'blur'},
        {min: 0, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur'}
      ];

      break;

    case 'status':
      temp=[
        {required: flag, message: '请选择状态类型', trigger: 'change'}
      ];

      break;

    case 'account':
      temp=[
        {required: flag, message: '请输入账号', trigger: 'change'},
        {validator: validateString, trigger: 'blur'},
        {min: 0, max: 16, message: '最长15个字符', trigger: 'blur'}
      ];

      break;


    case 'merchantLevel':
      temp=[
        {required: true, message: '请选择权限类型', trigger: 'change'}
      ];
      break;
    case 'type':
      temp= [
        {required: true, message: '请选择组类型', trigger: 'change'}
      ];
      break;


  }
  return temp;

}


/**
 *
 * @returns {Array}
 */
export const myRulesList= ()=>{
  /*
 *定义引入的规则
 * param为要限制的规则名称是，flag 是否必输
 */
  let rulesList=[];
  rulesList.push({param:'name',flag:true});
  rulesList.push({param:'account',flag:true});
  rulesList.push({param:'status',flag:true});
  rulesList.push({param:'password',flag:true});
  rulesList.push({param:'phone',flag:false});
  rulesList.push({param:'identityCard',flag:false});
  rulesList.push({param:'companyName',flag:false});
  rulesList.push({param:'telPhone',flag:false});
  rulesList.push({param:'merchantLevel',flag:true});
  return rulesList;
}
