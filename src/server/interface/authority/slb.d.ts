/*
 * @description: songliubiao 权限定义文件
 * @author: songliubiao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: songliubiao
 * @Date: 2019-07-01 11:25:04
 * @LastEditTime: 2019-09-09 14:33:21
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type RA = ReadonlyArray<string>

declare const AuthorityList: [
  /* <<<<<<<< 采购单模块 >>>>>>>> */
  'purchase'
   /* <<<<<<<< 采购单模块 >>>>>>>> */

]

type AuthoritySLB = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthoritySLB
