/**
 * @author maqian
 * @createTime 2019/04/24
 * @description 报表中心-固定报表
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/FixedReportformPage',
    title: '固定报表',
    exact: true,
    key: 'HRS000300010000',
    level: 2, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000300000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "fixedreportform" */ '@pages/main/reportform/fixedreportform/FixedReportformPage'))
  },
  {
    path: '/home/FixedReportformPage/FixedReportformDetail',
    title: '报表详情',
    exact: true,
    key: 'HRS000300010001',
    level: 3, // 等级
    parent: 'HRS000300010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "fixedreportform" */ '@pages/main/reportform/fixedreportform/FixedReportformDetail'))
  }
]
