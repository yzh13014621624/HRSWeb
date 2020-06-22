/**
 * @author minjie
 * @createTime 2019/04/07
 * @description 参保管理-参保参数
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Tabs, Button } from 'antd'
import { BaseProps } from 'typings/global'
import CityPage from './city/CityPage'
import StandardPage from './standard/StandardPage'

interface ParametersPageProps extends BaseProps {
}

interface ParametersPageState {
  defaultActiveKey: string
}

@hot(module)
export default class ParametersPage extends RootComponent<ParametersPageProps, ParametersPageState> {
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    const { AuthorityList, isAuthenticated } = this
    let defaultActiveKey = params.get('type') || 'stand'
    if (isAuthenticated(AuthorityList.parameters[1]) && isAuthenticated(AuthorityList.parameters[9])) {
      defaultActiveKey = params.get('type') || 'stand'
    } else if (isAuthenticated(AuthorityList.parameters[1])) {
      defaultActiveKey = 'stand'
    } else if (isAuthenticated(AuthorityList.parameters[9])) {
      defaultActiveKey = 'city'
    }
    this.state = {
      defaultActiveKey: defaultActiveKey
    }
  }
  callback = (defaultActiveKey:any) => {
    this.setState({ defaultActiveKey })
  }

  render () {
    const { defaultActiveKey } = this.state
    const { AuthorityList, isAuthenticated } = this
    return (
      <div style={{ padding: 20 }}>
        <Tabs defaultActiveKey={defaultActiveKey} onChange={this.callback}>
          {isAuthenticated(AuthorityList.parameters[1]) ? <Tabs.TabPane tab="参保标准" key="stand">
            <StandardPage type={defaultActiveKey} {...this.props}/>
          </Tabs.TabPane> : null}
          {isAuthenticated(AuthorityList.parameters[9]) ? <Tabs.TabPane tab="参保城市" key="city">
            <CityPage type={defaultActiveKey} {...this.props}/>
          </Tabs.TabPane> : null}
        </Tabs>
      </div>
    )
  }
}
