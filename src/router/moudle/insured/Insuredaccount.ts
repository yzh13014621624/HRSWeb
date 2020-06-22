/**
 * @author maqian
 * @createTime 2019/04/08
 * @description 参保管理-参保核算
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/InsuredAccounte',
    title: '参保核算',
    exact: true,
    key: 'HRS000200040000',
    level: 2, // 等级
    index: 2, // 左侧菜单显示的顺序
    parent: 'HRS000200000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "insuredaccount" */ '@pages/main/insured/Insuredaccount/InsuredAccountePage'))
  },
  {
    path: '/home/InsuredAccounte/InsuredAccounteDetail',
    title: '详情',
    exact: true,
    key: 'HRS000200040001',
    level: 3, // 等级
    parent: 'HRS000200040000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "insuredaccount" */ '@pages/main/insured/Insuredaccount/InsuredAccounteDetail/InsuredAccounteDetail'))
  }
]
