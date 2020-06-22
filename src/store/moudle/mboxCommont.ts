/**
 * @author maqian
 * @createTime 2019/05/10
 * @description 一些信息的获取，国家，组织结构等
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'
import { Axios } from '@components/axios/Axios'
import ServerApi from '@server/ServerApi'
import { SysUtil, JudgeUtil } from '@utils/index'

class Commont {
  @observable.struct
  organizationAry:Array<any> = [] // 组织

  @action
  setCountry = () => { // 设置值
    Axios.request(ServerApi.commontCountry).then((res:any) => {
      // 保存在 session 中
      SysUtil.setSessionStorage('commonCountry', res.data)
    }).catch((err:any) => {
      console.log('查询国家：', err)
    })
  }

  @action
  setOrganize = async (admin: any) => { // 设置值
    const { authData, authType } = admin || {}
    console.log('%c 🌮 admin: ', 'font-size:20px;background-color: #42b983;color:#fff;', admin)
    await Axios.request(ServerApi.entryProject).then(async (res:any) => {
      await Axios.request(ServerApi.entryOrganize, {
        projectArr: res.data.map((el:any) => el.projectId)
      }).then((res:any) => {
        let commonOrganize = res.data
        // 返回所有orgid的父级id string数组
        if (authType === 1) {
          let arrChain = this.chainOrganize(commonOrganize, authData, [], '')
          this.authOrganize([...new Set(arrChain)], commonOrganize)
        }
        SysUtil.setSessionStorage('commonOrganize', commonOrganize)
      }).catch((err:any) => {
        console.log(err.msg)
      })
      await Axios.request(ServerApi.entryOrganize, {
        projectArr: [1, 2, 3]
      }).then((res:any) => {
        SysUtil.setSessionStorage('commonOrganizeArr', res.data)
      }).catch((err:any) => {
        console.log(err.msg)
      })
    })
  }

  // 递归获取组织结构
  authOrganize = (authArr: string[], commonOrganize: any[]) => {
    for (let ix = commonOrganize.length - 1; ix > -1; ix--) {
      let strBol = false
      if (authArr.indexOf(String(commonOrganize[ix].orid)) > -1) {
        strBol = true
      }
      if (!strBol) {
        commonOrganize.splice(ix, 1)
        continue
      }
      if (!JudgeUtil.isEmpty(commonOrganize[ix].next)) {
        this.authOrganize(authArr, commonOrganize[ix].next)
      }
    }
    return commonOrganize
  }

  // 筛选组织权限(commonOrganize：组织原数组，authData：有的权限数组，newCommonOrganize：筛选后组成链式结构的数组)
  chainOrganize = (commonOrganize: any[], authData: any[], newCommonOrganize: any[], key: string) => {
    commonOrganize.map((v: any) => {
      let keys = key === '' ? v.orid + '' : `${key}-${v.orid}`
      if (authData.indexOf(v.orid) > -1) {
        newCommonOrganize.push(...keys.split('-'))
      }
      if (!JudgeUtil.isEmpty(v.next)) {
        this.chainOrganize(v.next, authData, newCommonOrganize, keys)
      }
    })
    return newCommonOrganize
  }
}

export default new Commont()
