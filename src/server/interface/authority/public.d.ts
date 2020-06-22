/*
 * @description: 公共接口
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-07-01 11:19:39
 * @LastEditTime: 2019-08-06 14:14:16
 * @Copyright: Copyright © 2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */

type RA = ReadonlyArray<string>
declare const AuthorityList: [
]

type AuthorityPublic = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthorityPublic
