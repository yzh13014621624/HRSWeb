/*
 * @description: 权限定义文件
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-09 11:19:59
 * @LastEditTime: 2019-09-09 13:57:25
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type RA = ReadonlyArray<string>

declare const AuthorityList: [
  /* <<<<<<<< 广告管理模块 >>>>>>>> */
    'advertisement',
  /* <<<<<<<< 广告管理模块 >>>>>>>> */
   /* <<<<<<<< 基础信息模块 >>>>>>>> */
   'baseinfo',
   /* <<<<<<<< 基础信息模块 >>>>>>>> */
]

type AuthorityQY = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthorityQY
