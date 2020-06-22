/*
 * @description: 权限定义文件
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-10-10 10:57:28
 * @LastEditTime: 2019-10-10 11:01:18
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

type RA = ReadonlyArray<string>

declare const AuthorityList: [
  // 税前
  // 税后
  // 个税
  // 历史薪酬
]

type AuthorityMQ = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthorityMQ
