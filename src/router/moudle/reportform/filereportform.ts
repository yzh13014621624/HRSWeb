/**
 * @author
 * @createTime 2019/04/24
 * @description 报表中心-归档报表
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/FileReportformPage',
    title: '归档报表',
    exact: true,
    key: 'HRS000300030000',
    level: 2, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: 'HRS000300000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "filereportform" */ '@pages/main/reportform/filereportform/FileReportformPage'))
  },
  {
    path: '/home/FileReportformPage/FileReportformDetail',
    title: '报表详情',
    exact: true,
    key: 'HRS000300030001',
    level: 3, // 等级
    parent: 'HRS000300030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "filereportform" */ '@pages/main/reportform/filereportform/FileReportformDetail'))
  }
]
