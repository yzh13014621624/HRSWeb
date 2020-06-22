/**
 * @author minjie
 * @createTime 2019/04/08
 * @description 参保管理-参数维护
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/parameters',
    title: '参数维护',
    exact: true,
    key: 'HRS000200010000',
    level: 2, // 等级
    index: 4, // 左侧菜单显示的顺序
    parent: 'HRS000200000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "parameters" */ '@pages/main/insured/parameters/ParametersPage'))
  },
  {
    path: '/home/parameters/standard',
    title: '新增参保标准',
    exact: true,
    key: 'HRS000200010002',
    level: 3, // 等级
    parent: 'HRS000200010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "parameters" */ '@pages/main/insured/parameters/standard/StandardAddOrDetail'))
  },
  {
    path: '/home/parameters/standard/:id',
    title: '参保标准详情',
    exact: true,
    key: 'HRS000200010003',
    level: 3, // 等级
    parent: 'HRS000200010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "parameters" */ '@pages/main/insured/parameters/standard/StandardAddOrDetail'))
  },
  {
    path: '/home/parameters/city',
    title: '新增参保城市',
    exact: true,
    key: 'HRS000200010010',
    level: 3, // 等级
    parent: 'HRS000200010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "parameters" */ '@pages/main/insured/parameters/city/CityAddOrDetail'))
  },
  {
    path: '/home/parameters/city/:id',
    title: '参保城市详情',
    exact: true,
    key: 'HRS000200010011',
    level: 3, // 等级
    parent: 'HRS000200010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "parameters" */ '@pages/main/insured/parameters/city/CityAddOrDetail'))
  }
]
