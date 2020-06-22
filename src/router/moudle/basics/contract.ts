/**
 * @author maqian
 * @createTime 2019/03/26
 * @description 合同模块
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/ContractPage',
    title: '合同',
    exact: true,
    key: 'HRS000100020000',
    level: 2, // 等级
    index: 2, // 左侧菜单显示的顺序
    parent: 'HRS000100000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/ContractPage'))
  },
  {
    path: '/home/ContractPage/InitialSignatureAddPage',
    title: '新增初签合同',
    exact: true,
    key: 'HRS000100020001',
    level: 3, // 等级
    parent: 'HRS000100020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/InitialSignature/InitialSignatureAdd/InitialSignatureAddPage'))
  },
  {
    path: '/home/ContractPage/TrialSignatureAddPage',
    title: '新增续签合同',
    exact: true,
    key: 'HRS000100020008',
    level: 3, // 等级
    parent: 'HRS000100020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/TrialSignature/TrialSignatureAdd/TrialSignatureAddPage'))
  },
  {
    path: '/home/ContractPage/TrialSignatureDetail',
    title: '续签合同详情',
    exact: true,
    key: 'HRS000100020002',
    level: 3, // 等级
    parent: 'HRS000100020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/TrialSignature/TrialSignatureDetail/TrialSignatureDetailPage'))
  },
  {
    path: '/home/ContractPage/InitialSignatureDetail',
    title: '初签合同详情',
    exact: true,
    key: 'HRS000100020009',
    level: 3, // 等级
    parent: 'HRS000100020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/InitialSignature/InitialSignatureDetail/InitialSignatureDetailPage'))
  },
  { // 初签电子合同
    path: '/home/ContractPage/ElectroniContract/:id/:status/:key',
    title: '电子合同',
    exact: true,
    key: 'HRS000100020010',
    level: 3, // 等级
    parent: 'HRS000100020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/ElectroniContract'))
  },
  { // 异动合同
    path: '/home/ContractPage/TransContractAdd',
    title: '异动初签合同',
    exact: true,
    key: 'HRS000100020011',
    level: 3, // 等级
    parent: 'HRS000100020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/basics/contract/TransContractAdd/TransContractAdd'))
  }
]
