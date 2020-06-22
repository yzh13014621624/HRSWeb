/*
 * @description: 全局状态管理
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-23 10:12:48
 * @LastEditTime: 2019-11-27 16:08:04
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'
import { SysUtil, globalEnum, inArray } from '@utils/index'

import AuthorityList from '@server/AuthorityList'

const { getSessionStorage } = SysUtil
const { admin, auth } = globalEnum

export class MobxGlobal {
  authorityList = AuthorityList // 总权限列表

  @observable
  downloadTask: string = ''

  @observable // 登录角色信息
  admin: any = getSessionStorage(admin) || {}

  @observable // 当前角色权限列表
  adminAuthorityList: string[] = getSessionStorage(auth) || []

  @action
  setTaskNum = (num: string) => {
    this.downloadTask = num
  }

  @action
  loginOut = () => {
    sessionStorage.clear()
    this.adminAuthorityList = []
  }

  @action
  setAdminInfo = (admin: any) => { this.admin = admin }

  @action
  setAuthorityList = (adminAuthorityList: string[]) => { this.adminAuthorityList = adminAuthorityList }

  @action // 判断权限，支持列表形式权限判断
  hasAuthority = (key: string | ReadonlyArray<string>): boolean | boolean[] => {
    const adminAuthorityList = this.adminAuthorityList
    if (typeof key === 'string') return inArray(key, adminAuthorityList).include
    const tempList = [...adminAuthorityList, ...key]
    if (tempList.length === adminAuthorityList.length) return Array(key.length).fill(true)
    const tempArr: boolean[] = []
    key.forEach(item => {
      tempArr.push(inArray(item, adminAuthorityList).include)
    })
    return tempArr
  }
}

export default new MobxGlobal()
