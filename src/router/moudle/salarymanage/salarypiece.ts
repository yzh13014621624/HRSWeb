import Loadable from '../../loadable'

export default [
  {
    path: '/home/salarypiece',
    title: '计件计算',
    exact: true,
    key: 'HRS000500020000',
    level: 2, // 等级
    index: 2, // 左侧菜单显示的顺序
    parent: 'HRS000500000000', // 父级
    component: Loadable(() => import('@pages/main/salarymanage/salarypiece/PiecePage'))
  },
  {
    path: '/home/salarypiece/SalaryPieceOverview/pieceoverviewlist',
    title: '项目-计件凭证维护',
    exact: true,
    key: 'HRS000500020010',
    level: 3, // 等级
    parent: 'HRS000500020000', // 父级
    component: Loadable(() => import('@pages/main/salarymanage/salarypiece/pieceoverview/pieceoverviewlist/PieceoverviewList'))
  },
  {
    path: '/home/salarypiece/pieceworkincome/pieceworkincomeedit',
    title: '员工计件收入详情',
    exact: true,
    key: 'HRS000500020009',
    level: 3, // 等级
    parent: 'HRS000500020000', // 父级
    component: Loadable(() => import('@pages/main/salarymanage/salarypiece/pieceworkincome/pieceworkincomeedit/PieceworkIncomeInfo'))
  },
  {
    path: '/home/salarypiece/SalaryPieceOverview/pieceoverviewlist/pieceoverviewinfo',
    title: '项目-计件凭证详情',
    exact: true,
    key: 'HRS000500020002',
    level: 4, // 等级
    parent: 'HRS000500020010', // 父级
    component: Loadable(() => import('@pages/main/salarymanage/salarypiece/pieceoverview/pieceoverviewlist/pieceoverviewedit/PieceoverviewEdit'))
  },
  {
    path: '/home/salarypiece/SalaryPieceOverview/pieceoverviewlist/pieceoverviewadd',
    title: '新增项目-计件凭证维护',
    exact: true,
    key: 'HRS000500020001',
    level: 4, // 等级
    parent: 'HRS000500020010', // 父级
    component: Loadable(() => import('@pages/main/salarymanage/salarypiece/pieceoverview/pieceoverviewlist/pieceoverviewadd/pieceoverviewadd'))
  }
]
