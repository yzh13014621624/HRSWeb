/*
 * @description: 权限定义文件
 * @author: yanzihao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: yanzihao
 * @Date: 2019-07-01 14:18:18
 * @LastEditTime: 2019-09-06 14:55:33
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type RA = ReadonlyArray<string>

declare const AuthorityList: [
  /* <<<<<<<< 销售单 >>>>>>>> */
  'queryOrderWebList', 'getOrderWebInfo', 'orderRefund', 'getOrderNumByStatus',
  /* <<<<<<<< 会员 >>>>>>>> */
  'getMemberDetail', 'getMemberList', 'getRefundList', 'getOrderRecordById',
  /* <<<<<<<< 营业额统计统计 >>>>>>>> */
  'getBusinessReceipt', 'getGoodsStatisList',
  /* <<<<<<<< 功能权限 >>>>>>>> */
  /* <<<<<<<< 销售单 >>>>>>>> */
  'saleorder',
  /* <<<<<<<< 会员 >>>>>>>> */
  'member',
]

type AuthorityYZH = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthorityYZH
