/*
 * @description: 薪酬核算Tab主页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-20 17:16:10
 * @LastEditTime: 2020-05-26 13:37:56
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Tabs } from 'antd'

import './index.styl'
import BeforeTax from './BeforeTax' // 税前组件
import PersonalTax from './PersonalTax' // 个税组件
import AfterTax from './AfterTax' // 税后组件
import SysUtil from '@utils/SysUtil'

const TabPane = Tabs.TabPane

interface SalaryAccountProps {}
interface SalaryAccountState {
  defaultActive:any
}

@hot(module)
export default class SalaryAccountPage extends RootComponent<SalaryAccountProps, SalaryAccountState> {
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    this.state = {
      defaultActive: params.get('key') || '1'
    }
  }

  onTabChange = (defaultActive:any) => {
    this.setState({ defaultActive })
    SysUtil.clearSession('HistoryList')
  }

  render () {
    const { state: { defaultActive }, AuthorityList: { salaryaccount }, isAuthenticated } = this
    return (
      <div id='salary-account-page'>
        <Tabs defaultActiveKey={defaultActive} onChange={this.onTabChange}>
          {
            isAuthenticated(salaryaccount[20]) &&
            <TabPane tab="税前" key="1">
              <BeforeTax {...this.props} />
            </TabPane>
          }
          {
            isAuthenticated(salaryaccount[21]) &&
            <TabPane tab="个税" key="2">
              <PersonalTax {...this.props} />
            </TabPane>
          }
          {
            isAuthenticated(salaryaccount[22]) &&
            <TabPane tab="税后" key="3">
              <AfterTax {...this.props} />
            </TabPane>
          }
        </Tabs>
      </div>
    )
  }
}
