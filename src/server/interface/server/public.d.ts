/*
 * @description: 公共接口
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-07-01 11:19:39
 * @LastEditTime: 2020-05-15 14:29:05
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const PublicList: [
  // 二维码扫描登录
  'LoginStrategy'
]

type ServerPublic = {
  [api in (typeof PublicList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerPublic
