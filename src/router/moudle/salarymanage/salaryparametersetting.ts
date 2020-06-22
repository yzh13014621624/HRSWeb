import Loadable from '../../loadable'

export default [
  {
    path: '/home/salaryparametersetting',
    title: '参数维护',
    exact: true,
    key: 'HRS000500060000',
    level: 2, // 等级
    index: 5, // 左侧菜单显示的顺序
    parent: 'HRS000500000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryparametersetting'))
  },
  {
    path: '/home/salaryparametersetting/parameterset',
    title: '工资标准设置',
    exact: true,
    key: 'HRS000500061000',
    level: 3, // 等级
    // index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000500060000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryparametersetting/salarystandard/parameterset'))
  },
  {
    path: '/home/salaryparametersetting/PieceParameterDetail',
    title: '上嘉项目-计件制参数设置',
    exact: true,
    key: 'HRS000500062000',
    level: 3, // 等级
    // index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000500060000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryparametersetting/pieceparameter/pieceparameterdetail'))
  }
]
