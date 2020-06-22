/*
 * @description: 基本信息 - 异动 状态管理
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-08 18:40:27
 * @LastEditTime: 2019-04-09 09:23:49
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'
import { KeyValue } from 'typings/global'

class Transaction {
  @observable
  staffInfo: KeyValue = {}

  @action
  setStaffInfo (staffInfo: KeyValue) {
    this.staffInfo = staffInfo
  }
}
export default new Transaction()
