/*
 * @description: 基本信息 - 异动 模块(异动主板/新增/详情)所有路由配置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-03 14:46:48
 * @LastEditTime: 2019-04-23 09:24:11
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/jobChange',
    title: '异动',
    exact: true,
    key: 'HRS000100040000',
    level: 2, // 等级
    index: 4, // 左侧菜单显示的顺序
    parent: 'HRS000100000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "jobChange" */ '@pages/main/basics/transaction/JobChangePage'))
  },
  {
    path: '/home/jobChange/addJobChange',
    title: '新增异动',
    exact: true,
    key: 'HRS000100040001',
    level: 3, // 等级
    parent: 'HRS000100040000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "jobChange" */ '@pages/main/basics/transaction/Add/JobChangeAdd'))
  },
  {
    path: '/home/jobChange/editJobChange',
    title: '异动信息详情',
    exact: true,
    key: 'HRS000100040002',
    level: 3, // 等级
    parent: 'HRS000100040000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "jobChange" */ '@pages/main/basics/transaction/Edit/JobChangeEdit'))
  }
]
