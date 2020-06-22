/*
 * @description: 报表中心 - 新建组合报表 主板 路由
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-23 17:51:16
 * @LastEditTime: 2019-04-25 18:52:45
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/combinedReportForm',
    title: '组合报表',
    exact: true,
    key: 'HRS000300020000',
    level: 2, // 等级
    index: 2, // 左侧菜单显示的顺序
    parent: 'HRS000300000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "combinedReportForm" */ '@pages/main/reportform/combinedreportform/CombinedReportformPage'))
  }
]
