/*
 * @description: huxianghe 权限定义文件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-23 09:41:42
 * @LastEditTime: 2019-09-23 09:52:59
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { RA } from 'typings/global'

declare const AuthorityList: ['quit', 'salary', 'transaction', 'companyInsured', 'personalInsured', 'combinedreportform']

type AuthorityHXH = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthorityHXH
