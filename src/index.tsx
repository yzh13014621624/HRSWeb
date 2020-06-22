/**
 * @author minjie
 * @createTime 2019/04/03
 * @description react 主页
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import * as RenderDom from 'react-dom'
import Root from '@router/Root'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { hot } from 'react-hot-loader/root'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import store from './store/index'
import '../statics/lib-flexible/flexible'
import '@assets/style/common'
// import '@assets/images/index'

// if (process.env.NODE_ENV === 'development') {
//   require('@mock/index')
// }
configure({ enforceActions: 'observed' })

let configProvider = {
  csp: {
    nonce: new Date().getTime().toString()
  },
  locale: zhCN
}

RenderDom.render(
  <Provider {...store}>
    <ConfigProvider {...configProvider} >
      <Root/>
    </ConfigProvider>
  </Provider>,
  document.getElementById('app')
)
