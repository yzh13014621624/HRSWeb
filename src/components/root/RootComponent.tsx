/**
 * @author minjie
 * @createTime 2010/03/18
 * @description 通用的组件，所有的继承, 将界面上需要用到的组件都放在了这，之后进行继承使用
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { message, Modal } from 'antd'
import { Axios } from '@components/axios/Axios'
import ServerApi from '@server/ServerApi'
import AuthorityList from '@server/AuthorityList'
import { SysUtil, globalEnum } from '@utils/index'

import { KeyValue } from 'typings/global'
import { string } from 'prop-types'

export default class RootComponent<P = {}, S = {}> extends React.Component<P, S> {
  $message = message // 消息组件
  axios = Axios
  api = ServerApi // api 的调用
  error = error // model 弹出框的Error
  warning = warning // model 弹出框的Waring
  isAuthenticated = isAuthenticated // 权限的判断
  AuthorityList = AuthorityList
  lastClickTimeList: KeyValue = {}

  /**
   * @description: 阻止连续多次点击
   * @param {callback} 事件处理函数
   * @param {key} 当页面存在多个点击按钮时候，需要给每个按钮指定的 key
   * @param {interval} 指定间隔时间之后才允许再次点击
   */
  preventMoreClick = (callback: Function, key = 0, interval = 500) => {
    const current = Date.now()
    const preClickTime = this.lastClickTimeList[key] || 0
    if (current - preClickTime > interval) {
      this.lastClickTimeList[key] = current
      callback()
    }
  }

  /**
   * @description: 监听表单框填写项的变化，并且会根据是否传入 cacheToStorage 来缓存数据到 localStorage
   * @param {fieldsValue} 通过 Form.getFieldsValue() 收集到的表单域数据
   * @param {name} 缓存的模块名称或者缓存的数据 key
   * @param {key} 根据用户提供的唯一标识缓存
   */
  watchFieldsValues = (fieldsValue: KeyValue, name?: string, key?: string, defaultValue?: any) => {
    let hasPadedValue = false // 表单任意项中是否填充的有数据
    let requiredNum = 0 // 统计必填项数量
    let paddedReqNum = 0 // 已填充的必填项数量
    for (const key of Object.keys(fieldsValue)) {
      let value = fieldsValue[key]
      value = value === 0 ? String(value) : value
      const isReq = key.includes('req') // 判断是否为必填项
      isReq && requiredNum++
      if (value) {
        if (isReq) {
          if (value instanceof Array) !!value.length && paddedReqNum++
          else paddedReqNum++
        }
        if (!hasPadedValue) { // 只允许该值修改一次
          if (value instanceof Array) !!value.length && (hasPadedValue = true)
          else hasPadedValue = true
        }
      }
    }
    if (name) {
      if (hasPadedValue) this.setCachedToStorage(name, fieldsValue, key, defaultValue)
      else this.removeCachedStorage(name, key, defaultValue)
    }
    return {
      hasPadedValue,
      disabledButton: requiredNum !== paddedReqNum
    }
  }

  /**
   * @description: 读取 localStorage 缓存的信息，由于大多数缓存在新增和修改数据，缓存的数据需要根据用户 id 来缓存，
   * name 一般指的是当前模块的操作名称，key 通常是用户的唯一标识，数据结构为 { name: { key: { k: any }, key: { key: any } } }
   * 如果 key 没有指定，默认取缓存的任意数据
   * 可参考 pages/main/basics/quit/QuitAdd 中的 getLocaleStoragedStaffInfo 方法
   * @param {name} 缓存的模块名称或者缓存的数据 key
   */
  getCachedFromStorage = (name: string, key?: string) => {
    const cachedInfo = SysUtil.getLocalStorage(name)
    if (key) return (cachedInfo && cachedInfo[key])
    return cachedInfo
  }

  /**
   * @description: 设置数据到缓存，默认会以 { name: data } 的形式存储数据，但是通常情况为缓存用户的数据，和上面的 getCachedFromStorage 操作相反，
   * 为了根据用户唯一标识缓存数据，需要提供 key，存储的数据格式为 { name: { key: { k: any }, key: { key: any } } }
   * 可参考 pages/main/basics/quit/QuitAdd 中的 setLocaleStoragedStaffInfo 方法
   * @param {name} 缓存的模块名称或者缓存的数据 key
   * @param {data} 缓存的数据
   * @param {key} 根据用户提供的唯一标识缓存
   * @param {defalutValue} 缓存指定的默认值
   */
  setCachedToStorage = (name: string, data: any, key?: string, defalutValue = {}) => {
    if (!key) {
      SysUtil.setLocalStorage(name, data)
      return
    }
    const storagedInfo = SysUtil.getLocalStorage(name) || defalutValue
    storagedInfo[key] = data
    SysUtil.setLocalStorage(name, storagedInfo)
  }

  /**
   * @description: 根据 name 移除缓存的数据，默认清空整个 name，但是多为清空一个模块内用户数据信息，移除后形式为 { name: { key: { k: any ... } } }
   * 可参考 pages/main/basics/quit/QuitAdd 中的 clearLocaleStoragedStaffInfo 方法
   * @param {name} 缓存的模块名称或者缓存的数据 key
   * @param {key} 根据用户提供的唯一标识缓存
   * @param {defalutValue} 缓存指定的默认值
   */
  removeCachedStorage = (name: string, key = '', defalutValue = {}) => {
    if (!key) {
      SysUtil.clearLocalStorage(name)
      return
    }
    let cachedInfo = this.getCachedFromStorage(name, key)
    !cachedInfo && (cachedInfo = defalutValue)
    delete cachedInfo[key]
    if (!Object.keys(cachedInfo).length) SysUtil.clearLocalStorage(name) // 默认以对象形式操作，可能存在 bug
    else SysUtil.setLocalStorage(name, cachedInfo)
  }
}

export { hot } from 'react-hot-loader'

/**
 * 判断权限
 * @param code 权限的code
 */
export function isAuthenticated (code: string): boolean {
  if (process.env.SERVICE_URL === 'pro' || process.env.SERVICE_URL === 'pre' || process.env.SERVICE_URL === 'tes') {
    const auth = SysUtil.getSessionStorage(globalEnum.auth)
    return auth && auth.indexOf(code) >= 0
  } else {
    return true
  }
}

/**
 * 错误的输出等
 * @param msg   输出的消息
 * @param title 标题
 */
function error (msg:any, title?:string) {
  Modal.error({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise((resolve, reject) => (resolve()))
    }
  })
}
function warning (msg:any, title?:string) {
  Modal.warning({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise((resolve, reject) => (resolve()))
    }
  })
}
