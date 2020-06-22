/**
 * @author maqian
 * @createTime 2019/05/10
 * @description 生成报表
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { message, Modal } from 'antd'
import SysUtil from '@utils/SysUtil'
import { observable, action } from 'mobx'
import { Axios } from '@components/axios/Axios'
import ServerApi from '@server/ServerApi'

class Report {
  @observable.struct

  @action
  setReports = (data:any) => { // 设置值
    let type = SysUtil.getSessionStorage('reportType')
    let a = setInterval(() => {
      Axios.request(ServerApi.getSuccess, {
        type
      }).then((res:any) => {
        Modal.success({
          title: '消息提示',
          centered: true,
          content: res.data[0],
          onOk () {
            return new Promise((resolve, reject) => (resolve()))
          }
        })
        clearInterval(a)
        SysUtil.clearSession('reportType')
      }).catch((err:any) => {
        Modal.error({
          title: '消息提示',
          centered: true,
          content: err,
          onOk () {
            return new Promise((resolve, reject) => (resolve()))
          }
        })
        clearInterval(a)
        SysUtil.clearSession('reportType')
      })
    }, 5000)
  }
}

export default new Report()
