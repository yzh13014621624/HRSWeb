/**
 * @author lixinying
 * @createTime 2019/04/13
 * @description 参保管理-公司维护
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/companyInsured',
    title: '公司维护',
    exact: true,
    key: 'HRS000200020000',
    level: 2, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: 'HRS000200000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "companyInsured" */ '@pages/main/insured/companyInsured/CompanyInsuredPage'))
  },
  {
    path: '/home/companyInsured/parametersAdd',
    title: '新增',
    exact: true,
    key: 'HRS000200020001',
    level: 3, // 等级
    parent: 'HRS000200020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "companyInsured" */ '@pages/main/insured/companyInsured/add/ParametersAdd'))
  },
  {
    path: '/home/companyInsured/ParametersDetails',
    title: '详情',
    exact: true,
    key: 'HRS000200020002',
    level: 3, // 等级
    parent: 'HRS000200020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "companyInsured" */ '@pages/main/insured/companyInsured/details/ParametersDetails'))
  }
]
