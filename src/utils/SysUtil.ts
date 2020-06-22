/**
 * @description 系统的设置（session cookie）
 * @author minjie
 * @class SysUtil
 * @createTime 2019/04/03
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import AesUtil from './AesUtil'

// 对 IE 的 Object.assign 进行修改
if (typeof Object.assign !== 'function') {
  Object.assign = function (target:any, varArgs:any) { // .length of function is 2
    'use strict'
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object')
    }
    var to = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index]
      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
    }
    return to
  }
}

export default class SysUtil {
  /**
   * 对象的拷贝
   * @param {*} obj 需要拷贝的对象
   */
  static deepCopyObj (obj:any) {
    if (obj === null) {
      return null
    }
    if (typeof obj !== 'object') {
      return obj
    }
    let newobj:any = {}
    for (const key in obj) {
      newobj[key] = SysUtil.deepCopyObj(obj[key])
    }
    return newobj
  }

  /**
   * uuid
   */
  static uuid () {
    let s:any = []
    let hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    return s.join('')
  }

  /**
   *  traceId
   */
  static traceId () {
    return 'WebPage_' + SysUtil.uuid() + '_' + new Date().getTime()
  }

  /**
   * 获取对应的文件信息  sessionStorage
   * @param name  对应保存信息的名称
   */
  static getSessionStorage (name:string) {
    if (process.env.NODE_ENV === 'production') name = AesUtil.encryptECB(name)
    let o = sessionStorage.getItem(name)
    if (typeof o !== 'undefined' && o !== null) {
      let obj:any = {}
      if (process.env.NODE_ENV === 'production') {
        obj = AesUtil.decryptECB(o)
      } else {
        obj = o
      }
      return JSON.parse(obj)
    }
    return null
  }

  /**
   * 设置保存信息  sessionStorage
   * @param name  保存的姓名
   * @param obj   需要存储的对象
   */
  static setSessionStorage (name:string, obj:any) {
    if (obj) {
      obj = JSON.stringify(obj)
      if (process.env.NODE_ENV === 'production') {
        obj = AesUtil.encryptECB(obj)
        name = AesUtil.encryptECB(name)
      }
      sessionStorage.setItem(name, obj)
    }
  }

  /**
   * 移除信息
   */
  static clearSession (name:string) {
    if (process.env.NODE_ENV === 'production') {
      name = AesUtil.encryptECB(name)
    }
    sessionStorage.removeItem(name)
  }

  /**
   * 获取对应的文件信息  localStorage
   * @param name  对应保存信息的名称
   */
  static getLocalStorage (name:string) {
    if (process.env.NODE_ENV === 'production') name = AesUtil.encryptECB(name)
    let o = localStorage.getItem(name)
    if (typeof o !== 'undefined' && o !== null) {
      let obj:any = {}
      if (process.env.NODE_ENV === 'production') {
        obj = AesUtil.decryptECB(o)
      } else {
        obj = o
      }
      return JSON.parse(obj)
    }
    return null
  }

  /**
   * 设置保存信息   localStorage
   * @param name  保存的姓名
   * @param obj   需要存储的对象
   */
  static setLocalStorage (name:string, obj:any) {
    if (obj) {
      obj = JSON.stringify(obj)
      if (process.env.NODE_ENV === 'production') {
        obj = AesUtil.encryptECB(obj)
        name = AesUtil.encryptECB(name)
      }
      localStorage.setItem(name, obj)
    }
  }

  /**
   * 移除信息
   */
  static clearLocalStorage (name:string) {
    if (process.env.NODE_ENV === 'production') {
      name = AesUtil.encryptECB(name)
    }
    localStorage.removeItem(name)
  }

  /**
   * 判断浏览器类型
   * @param val
   */
  static getBrowserInfo (val:string):boolean {
    let ua:any = navigator.userAgent.toLocaleLowerCase()
    let browserType:string = ''
    let browserVersion:string = ''
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
      browserType = 'IE'
      browserVersion = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1]
    } else if (ua.match(/firefox/) != null) {
      browserType = '火狐'
    } else if (ua.match(/ubrowser/) != null) {
      browserType = 'UC'
    } else if (ua.match(/opera/) != null) {
      browserType = '欧朋'
    } else if (ua.match(/bidubrowser/) != null) {
      browserType = '百度'
    } else if (ua.match(/metasr/) != null) {
      browserType = '搜狗'
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
      browserType = 'QQ'
    } else if (ua.match(/maxthon/) != null) {
      browserType = '遨游'
    } else if (ua.match(/chrome/) != null) {
      var is360 = SysUtil._mime('type', 'application/vnd.chromium.remoting-viewer')
      browserType = is360 ? '360' : 'Chrome'
    } else if (ua.match(/safari/) != null) {
      browserType = 'Safari'
    }
    return val === browserType
  }

  static _mime (option:string, value:string) {
    let mimeTypes:any = navigator.mimeTypes
    for (var mt in mimeTypes) {
      if (mimeTypes[mt][option] === value) {
        return true
      }
    }
    return false
  }
}
