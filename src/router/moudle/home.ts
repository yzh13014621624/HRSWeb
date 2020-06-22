/**
 * @author minjie
 * @createTime 2019/03/20
 * @description 主页的模块
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../loadable'

export default [
  {
    path: '/home/homeInfo',
    title: '首页',
    exact: true,
    icon: 'IconSilder1',
    key: '0',
    level: 1, // 等级
    parent: '-1', // 父级
    component: Loadable(() => import(/* webpackChunkName: "home" */ '@pages/home/index/HomeInfo'))
  },
  {
    title: '基本信息',
    path: '/home/basics',
    key: 'HRS000100000000',
    icon: 'IconSilder2',
    exact: true,
    level: 1, // 等级
    parent: '-1' // 父级
  },
  {
    title: '考勤管理',
    path: '/home/attendancemanage',
    key: 'HRS000400000000',
    icon: 'IconSiderDate',
    exact: true,
    level: 1, // 等级
    parent: '-1' // 父级
  },
  {
    title: '参保管理',
    path: '/home/insured',
    key: 'HRS000200000000',
    icon: 'IconSilder3',
    exact: true,
    level: 1, // 等级
    parent: '0' // 父级
  },
  {
    title: '薪酬管理',
    path: '/home/salarymanage',
    key: 'HRS000500000000',
    icon: 'IconSiderSalary',
    exact: true,
    level: 1, // 等级
    parent: '0' // 父级
  },
  {
    title: '报表中心',
    path: '/home/reportform',
    key: 'HRS000300000000',
    icon: 'IconSilder4',
    exact: true,
    level: 1, // 等级
    parent: '-1' // 父级
  },
  {
    title: '系统管理',
    path: '/home/system',
    key: 'HRS000600000000',
    icon: 'IconSilder4',
    exact: true,
    level: 1, // 等级
    parent: '-1' // 父级
  }
]
