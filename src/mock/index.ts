/**
 * @author minjie
 * @createTime 2010/03/18
 * @description mock
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

require('./commont')
require('./basics/contract')
require('./basics/entry')
require('./basics/quit')
require('./basics/salary')
require('./basics/transaction')

require('./insured/Insuredaccount')
require('./insured/parameters')
require('./insured/personalInsured')

// require('./reportform')

// 在这里可以做一些通用的配置
const Mock = require('mockjs')
// 设置所有ajax请求的超时时间，模拟网络传输耗时
Mock.setup({
  timeout: 0 - 500
})
