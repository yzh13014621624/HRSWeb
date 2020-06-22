import Loadable from '../../loadable'

export default [
  {
    path: '/home/salaryAccountPage',
    title: '薪酬核算',
    exact: true,
    key: 'HRS000500030000',
    level: 2, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: 'HRS000500000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryaccount'))
  },
  {
    path: '/home/salaryAccountPage/BeforeTaxDetail/:id',
    title: '税前详情',
    exact: true,
    key: 'HRS000500030001',
    level: 3, // 等级
    parent: 'HRS000500030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryaccount/BeforeTax/BeforeTaxDetail/BeforeTaxDetail'))
  },
  {
    path: '/home/salaryAccountPage/PersonalTaxDetail/:id',
    title: '个税详情',
    exact: true,
    key: 'HRS000500030005',
    level: 3, // 等级
    parent: 'HRS000500030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryaccount/PersonalTax/PersonalTaxDetail/PersonalTaxDetail'))
  },
  {
    path: '/home/salaryAccountPage/AfterTaxDetail/:id',
    title: '税后详情',
    exact: true,
    key: 'HRS000500030009',
    level: 3, // 等级
    parent: 'HRS000500030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryaccount/AfterTax/AfterTaxDetail/AfterTaxDetail'))
  },
  {
    path: '/home/salaryAccountPage/HistoryForm',
    title: '历史薪资查询',
    exact: true,
    key: 'HRS000500040000',
    level: 3, // 等级
    parent: 'HRS000500000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryaccount/HistorySalary'))
  }
]
