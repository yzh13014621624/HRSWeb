/*
 * @description: 参保管理模块 - 个人参保 - 个人参保/补缴信息、个人参保维护路由配置
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 16:09:05
 * @LastEditTime: 2019-04-10 16:50:14
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/personalInsured',
    title: '个人维护',
    exact: true,
    key: 'HRS000200030000',
    level: 2, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000200000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "personalInsured" */ '@pages/main/insured/personalInsured'))
  },
  {
    path: '/home/personalInsured/personalInsuredInfo/detail',
    title: '个人参保信息详情',
    exact: true,
    key: 'HRS000200030002',
    level: 3, // 等级
    parent: 'HRS000200030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "personalInsured" */ '@pages/main/insured/personalInsured/personalInsuredInfo/personalInsuredInfoDetail'))
  },
  {
    path: '/home/personalInsured/personalSupplement/add',
    title: '新增个人补缴',
    exact: true,
    key: 'HRS000200030005',
    level: 3, // 等级
    parent: 'HRS000200030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "personalInsured" */ '@pages/main/insured/personalInsured/personalSupplement/personalSupplementAdd'))
  },
  {
    path: '/home/personalInsured/personalSupplement/detail',
    title: '个人补缴详情',
    exact: true,
    key: 'HRS000200030006',
    level: 3, // 等级
    parent: 'HRS000200030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "personalInsured" */ '@pages/main/insured/personalInsured/personalSupplement/personalSupplementDetail'))
  },
  {
    path: '/home/personalInsured/personalMaintain/add',
    title: '个人参保维护',
    exact: true,
    key: 'HRS000200030013',
    level: 3, // 等级
    parent: 'HRS000200030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "personalInsured" */ '@pages/main/insured/personalInsured/personalMaintain/personalMaintainAdd'))
  },
  {
    path: '/home/personalInsured/personalMaintain/detail',
    title: '个人参保维护',
    exact: true,
    key: 'HRS000200030014',
    level: 3, // 等级
    parent: 'HRS000200030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "personalInsured" */ '@pages/main/insured/personalInsured/personalMaintain/personalMaintainDetail'))
  }
]
