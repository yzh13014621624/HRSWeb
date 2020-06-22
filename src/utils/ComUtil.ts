/*
 * @description: 通用工具
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-05 14:05:14
 * @LastEditTime: 2019-10-25 11:21:53
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

/**
 * 判断目标元素是否存在指定数组中
 * @param ele 目标元素
 * @param array 目标数组
 */
export function inArray (ele: string | number, array: (string|number)[]) {
  const i = array.indexOf(ele)
  return {
    include: i !== -1,
    index: i
  }
}

/** 组织的数据处理返回 New return [{ id: '1-1', lablekey: 'ss-ss', lable: 's' }] */
export function outArrayNew (data:any) {
  if (data && data.length > 0) {
    return recursion(data, '', '')
  } else {
    return []
  }
}

/** 组织：递归数据遍历 New */
function recursion (data:any, key:string, id:string) {
  let ary:any = []
  data.forEach((el:any) => {
    let keys = key === '' ? el.organize + '' : `${key}-${el.organize}`
    let ids = id === '' ? el.orid + '' : `${id}-${el.orid}`
    ary.push({ id: el.orid, ids: ids, lablekey: keys, lable: el.organize })
    if (!JudgeUtil.isEmpty(el.next)) {
      ary = [...ary, ...recursion(el.next, keys, ids)]
    }
  })
  return ary
}

/** 组织：递归数据遍历 */
const insi = (data:any, index:number, nameAry:any, key:string = '', id:string = ''):any => {
  let ary:any = []
  let obj = nameAry[index]
  data.forEach((el:any) => {
    let keys = key === '' ? el[obj.value] : key + '-' + el[obj.value]
    let idkey = id === '' ? el[obj.id] : id + '-' + el[obj.id]
    if (el[obj.ary] && el[obj.ary].length > 0) {
      ary.push({
        id: idkey,
        lablekey: keys,
        lable: el[obj.value]
      })
      ary = [...ary, ...insi(el[obj.ary], index + 1, nameAry, keys, idkey)]
    } else {
      ary.push({
        id: idkey,
        lablekey: keys,
        lable: el[obj.value]
      })
    }
  })
  return ary
}

/** 组织的数据处理返回 return [{ id: '1-1', lablekey: 'ss-ss', lable: 's' }] */
export function outArray (data:any) {
  if (data && data.length > 0) {
    let nameAry = [
      { ary: 'firstOrganizeResponseList', value: 'zerOrganize', id: 'zoId' },
      { ary: 'secondOrganizeResponseList', value: 'firOrganize', id: 'foId' },
      { ary: 'thirdOrganizeResponseList', value: 'secOrganize', id: 'soId' },
      { ary: null, value: 'thiOrganize', id: 'toId' }
    ]
    let s = insi(data, 0, nameAry, '', '')
    return s
  } else {
    return []
  }
}

export class JudgeUtil {
  /*  获取原始类型 */
  static toRawType (v: any) {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase()
  }

  /**
   * 判断是否是数字
   * @param obj 需要判断的值
   */
  static isNumber (obj:any):boolean {
    return typeof obj === 'number' && isFinite(obj)
  }

  /** 判读是否是数组 */
  static isArrayFn (value:any) {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value)
    } else {
      return JudgeUtil.toRawType(value) === 'array'
    }
  }

  /* 判断是否为纯对象 */
  static isPlainObj (obj: any) {
    return JudgeUtil.toRawType(obj) === 'object'
  }

  /**
   * 判读是否为空
   */
  static isEmpty (obj:any) {
    return (typeof obj === 'undefined' || obj === null || obj === '')
  }

  /** 将值转换成rem */
  static pxtoRem (val:number | string) {
    let rem = (window as any).rem
    if (typeof val === 'string') {
      let a:number = Number(val.substring(0, val.indexOf('px')))
      return (a / rem) + 'rem'
    } else {
      return (val / rem) + 'rem'
    }
  }
}

/* 格式化 input 表单框数据 */
export class FormatInputValue {
  static intLen: number = 8
  static decimalsLen: number = 2

  /* 只允许输入整数 */
  static parsetInt (v: string, intLen = FormatInputValue.intLen) {
    return v.substr(0, intLen).replace(/[^\d]/g, '')
  }

  /* 只允许输入整数且支持可以保留负号 */
  static parsetIntAndKeepMinus (v: string, intLen = FormatInputValue.intLen) {
    v = v
      .replace(/[^\d-]/g, '')
      .replace(/-{1,}/g, '-')
      .replace(/^-/, '$#$')
      .replace(/-/g, '')
      .replace('$#$', '-')
    if (v.indexOf('-') > -1) intLen += 1
    return v.substr(0, intLen)
  }

  /**
   * 保留小数点，默认保留两位
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixed (v: string, decimalsLen = FormatInputValue.decimalsLen, intLen = FormatInputValue.intLen) {
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return v
  }

  /* 保留小数点和负号，小数点默认保留两位 */
  static toFixedAndKeepMinus (v: string, decimalsLen = FormatInputValue.decimalsLen, intLen = FormatInputValue.intLen) {
    v = v
      .replace(/[^\d.-]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(/-{1,}/g, '-')
      .replace(/^-/, '$#$')
      .replace(/-/g, '')
      .replace('$#$', '-')
      .replace(new RegExp(`^(-?\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
    if (v.indexOf('-') > -1) intLen += 1
    // debugger
    v = v
      .replace(/^-?\d+/, (match: string) => match.substr(0, intLen))
    return v.substr(0, intLen + decimalsLen + 1)
  }

  /**
   * 转换限制
   * @param reg 表达式
   * @param val 转换值
   * @param len 长度
   */
  static conversionOf (reg:any, val:string, len?:number):string {
    val = val.replace(reg, '')
    if (len) {
      val = val.length > len ? val.substr(0, len) : val
    }
    return val
  }

  /**
   * 去除空格
   */
  static removeEmpty = (val:any) => {
    return val.replace(/(^\s*)|(\s*$)/g, '')
  }
}

/* 深度对比两个对象是否相同 */
export function compareDeep (origin: any, target: any) {
  let p
  if (typeof origin === 'number' && typeof target === 'number' && isNaN(origin) && isNaN(target)) {
    return true
  }
  if (origin === target) {
    return true
  }
  if (typeof origin === 'function' && typeof target === 'function') {
    if ((origin instanceof RegExp && target instanceof RegExp) ||
    (origin instanceof String || target instanceof String) ||
    (origin instanceof Number || target instanceof Number)) {
      return origin.toString() === target.toString()
    } else {
      return false
    }
  }
  if (origin instanceof Date && target instanceof Date) {
    return origin.getTime() === target.getTime()
  }
  if (!(origin instanceof Object && target instanceof Object)) {
    return false
  }
  if (origin.prototype !== target.prototype) {
    return false
  }
  if (origin.constructor !== target.constructor) {
    return false
  }
  for (p in target) {
    if (!origin.hasOwnProperty(p)) {
      return false
    }
  }
  for (p in origin) {
    if (!target.hasOwnProperty(p)) {
      return false
    }
    if (typeof target[p] !== typeof origin[p]) {
      return false
    }
    if (!compareDeep(origin[p], target[p])) {
      return false
    }
  }
  return true
}
