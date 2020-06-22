/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 入职新增的一些配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

/**
  * 表单组件的 排列
  * labelCol: { span: 7 },
  * wrapperCol: { span: 17 }
  */
export const itemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
}
/**
  * 表单组件的 排列
  * labelCol: { span: 8 },
  * wrapperCol: { span: 16 }
  */
export const itemLayoutTwo = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
/**
  * 表单组件的 排列
  * labelCol: { span: 11 },
  * wrapperCol:{ span: 13 }
  */
export const itemLayoutThere = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 }
}

/**
 * 组件数据初始化
 * @param data    初始值
 * @param keysAry 保存的keys
 */
export const initData = (data:any, keysAry: string[]) => {
  if (data.length > 0) {
    let a:any = { keys: [] }
    data.forEach((el:any, index: number) => {
      a['keys'].push(index)
      for (let i = 0; i < keysAry.length; i++) {
        a[keysAry[i] + index] = el[keysAry[i]]
      }
    })
    return a
  }
  return { keys: [0] }
}
/**
 * 通用的验证
 * @param rules 验证的规则： pattern 写了就必须写message
 * @param value 值
 * @param callback 返回的
 */
export const validatorCommon = (rules:any, value:any, callback:any) => {
  if (rules.required) {
    if (!value || value === '' || value === null) {
      callback(new Error(rules.message || '请输入'))
    } else {
      validatorRules(rules, value, callback)
    }
  } else {
    if (value) {
      validatorRules(rules, value, callback)
    }
    callback()
  }
  callback()
}

/** 去除第一个空格 */
export const getValueFromEventFirstNull = (e:any) => {
  let value = e.target.value
  return value.replace(/^\s*/g, '')
}

/** 去除空格: /(^\s*)|(\s*$)/g */
export const getValueFromEventFirstNotNull = (e:any) => {
  let value = e.target.value
  return value.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 进行验证
 * @param rules 验证的规则： pattern 写了就必须写message
 * @param value 值
 * @param callback 返回的
 */
const validatorRules = (rules:any, value:any, callback:any) => {
  // 字段长度,  最大长度 校验文案 最小长度 正则表达式校验 是否必选 校验前转换字段值
  const { len, max, message, min, pattern, type } = rules
  if (pattern && !pattern.test(value)) {
    callback(new Error(message || '验证不通过！'))
  } else if (len && value.length !== len) { // 存在长度的判断则只做
    callback(new Error(`输入长度为${len}字符`))
  } else {
    let len:number = value.length
    if (max && min && (len > max || max < min)) {
      callback(new Error(`输入长度在${min}~${max}之间`))
    } else if (max && len > max) {
      callback(new Error(`输多输入${max}字符`))
    } else if (min && len < min) {
      callback(new Error(`最少输入${min}字符`))
    } else {
      callback()
    }
  }
}

/**
 * 用户信息对应的字段
 */
export interface UserInfo {
  /** 用户id */
  userId:number
  /** 姓名 */
  userName:string
  /** 性别 */
  sex:string
  /** 出生日期 */
  birth:string
  /** 民族 */
  nation:string
  /** 籍贯 */
  nativePlace:string
  /** 国家 */
  country:string
  /** 婚姻状况 */
  maritalStatus:string
  /** 身份证号码 */
  idCard:string
  /** 护照号码 */
  passportCard:string
  /** 银行卡号码 */
  bankCard:string
  /** 最高学历 */
  maxEducation:string
  /** 户口地址 */
  residenceAdress:string
  /** 户口性质 */
  residenceNature:string
  /** 联系地址 */
  contactAdress:string
  /** 联系方式 */
  contactWay:string
  /** 计算机水平 */
  computerLevel:string
  /** 外语 */
  foreignLanguage:string
  /** 紧急联系人 */
  urgentUser:string
  /** 紧急联系人关系 */
  urgentRelation:string
  /** 紧急联系人电话 */
  urgentPhone:string
  /** 在职状态 */
  workCondition:string
  /** 工号 */
  projectNumber:string
  /** 管理编号 */
  sjNumber:string
  /** 法人主体id */
  entityId:number
  /** 法人主体 */
  entity: string
  /** 组织 */
  organize:string
  /** 职位id */
  positionId:number
  /** 职位 */
  position:string
  /** 入职日期 */
  entryTime:string | undefined
  /** 离职日期 */
  quitTime:string
  /** 角色类型 */
  roleType:string
  /** 项目id */
  projectId:number
  /** 项目名 */
  projectName:string
  /** 个人照片 */
  userImage:string
  /** 身份证正面照片 */
  idCardFront:string
  /** 身份证反面照片 */
  idCardNegative:string
  /** 护照照片 */
  passportImage:string
  /** 家庭成员信息 */
  hrsFamilyList:Array<HrsFamilyResponse>
  /** 教育背景信息 */
  hrsEducationList:Array<HrsEducationResponse>
  /** 工作经历信息 */
  hrsWorkExperienceList:Array<HrsWorkExperienceResponse>
  /** 证书信息 */
  hrsCertificateList:Array<HrsCertificateResponse>
  /** 好饭碗登录 */
  hfwLoginNum: string | undefined
  /** 户口首页照片 */
  householdImg: string | undefined
  /** 户口本人照片 */
  householdSelfImg: string | undefined
  /** 退工单照片 */
  returnSheetImg: string | undefined
  /** 毕业证照片 */
  diplomaImg: string | undefined
  /** 工作岗位 */
  job: number | undefined
  /** 工作岗位 */
  jobName: string | undefined
  /** 数据来源 */
  dataSource: string | undefined
  [key:string]: any
}

class HrsFamilyResponse {
  [key:string]:any
}
class HrsEducationResponse {
  [key:string]:any
}
class HrsWorkExperienceResponse {
  [key:string]:any
}
class HrsCertificateResponse {
  [key:string]:any
}
export const countryAry = ['中国', '外籍']

/** 驳回的时候选择的信息 */
export const errorRejectMsg = [
  { title: '姓名信息有误', value: 0 },
  { title: '性别信息有误', value: 1 },
  { title: '国家信息有误', value: 2 },
  { title: '民族信息有误', value: 3 },
  { title: '籍贯信息有误', value: 4 },
  { title: '身份证号信息有误', value: 5 },
  { title: '出生日期信息有误', value: 6 },
  { title: '婚姻状况信息有误', value: 7 },
  { title: '银行卡号信息有误', value: 8 },
  { title: '户籍地址信息有误', value: 9 },
  { title: '户口性质信息有误', value: 10 },
  { title: '最高学历信息信息有误', value: 11 },
  { title: '联系地址信息有误', value: 12 },
  { title: '紧急联系人信息有误', value: 14 },
  { title: '紧急联系人关系信息有误', value: 15 },
  { title: '紧急联系人电话信息有误', value: 16 },
  { title: '毕业证照片有误', value: 17 },
  { title: '户口本首页有误', value: 18 },
  { title: '户口本本人页有误', value: 19 },
  { title: '退工单照片有误', value: 20 }
//  { title: '联系方式信息有误', value: 13 },
//  { title: '好饭碗登录账号信息有误', value: 17 },
//  { title: '项目信息有误', value: 18 },
//  { title: '员工类型信息有误', value: 19 },
//  { title: '工作岗位信息有误', value: 20 },
//  { title: '法人主体信息有误', value: 21 },
//  { title: '组织信息有误', value: 22 },
//  { title: '入职日期信息有误', value: 23 }
]

/** 判断是否属于的公司的信息 */
export const registerCompanyAry:string[] = [
  '上海靓了么网络科技有限公司',
  '上海上嘉物流科技有限公司',
  '宁波上嘉弘昇物流有限公司',
  '上海上嘉供应链管理有限公司',
  '安徽人人享网络科技有限公司',
  '上海上嘉物流有限公司'
]

export const sortFun = <T>(ary:Array<T | any>[], field: string, type: 'object'|'number'|'string' = 'number') => {
  ary.sort((a:T|any, b:T|any) => {
    if (type === 'string') {
      a = Number(a)
      b = Number(b)
    } else if (type === 'object') {
      a = Number(a['field'])
      b = Number(b['field'])
    }
    if (a > b) return 1
    else if (a < b) return -1
    else return 0
  })
  return ary
}
