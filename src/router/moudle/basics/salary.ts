/**
 * @author lixinying
 * @createTime 2019/04/08
 * @description 薪资模块
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/salaryPage',
    title: '薪资',
    exact: true,
    key: 'HRS000100030000',
    level: 2, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: 'HRS000100000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salary" */ '@pages/main/basics/salary/SalaryPage'))
  },
  {
    path: '/home/salaryPage/salaryAdd',
    title: '新增',
    exact: true,
    key: 'HRS000100030001',
    level: 3, // 等级
    parent: 'HRS000100030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salary" */ '@pages/main/basics/salary/add/SalaryAdd'))
  },
  {
    path: '/home/salaryPage/salaryDetails',
    title: '新增薪资',
    exact: true,
    key: 'HRS000100030002',
    level: 3, // 等级
    parent: 'HRS000100030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salary" */ '@pages/main/basics/salary/details/SalaryDetails'))
  }
]
