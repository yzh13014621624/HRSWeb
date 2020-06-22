/**
 * @author maqian
 * @createTime 2019/03/26
 * @description 合同界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Tabs } from 'antd'
import InitialSignaturePage from './InitialSignature/InitialSignaturePage' // 初签
import TrialSignaturePage from './TrialSignature/TrialSignaturePage' // 续签
import ProbationPeriodPage from './ProbationPeriod/ProbationPeriodPage' // 试用期

import './contract.styl'

const TabPane = Tabs.TabPane

interface ContractPageStates {
  listArrays: Array<object>
  defaultActive:any
}
@hot(module) // 热更新（局部刷新界面）
export default class ContractPage extends RootComponent<any, ContractPageStates> {
  constructor (props: any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    this.state = {
      listArrays: [],
      defaultActive: params.get('key') || '1'
    }
  }
  onTabChange = (defaultActive:any) => {
    this.setState({ defaultActive })
  }

  render () {
    const { state: { defaultActive }, AuthorityList: { contract } } = this
    return (
      <div id="contract-page">
        <Tabs defaultActiveKey={defaultActive} onChange={this.onTabChange}>
          {
            this.isAuthenticated(contract[23]) &&
            <TabPane tab="初签" key="1">
              <InitialSignaturePage statusSelect={1} {...this.props} />
              {/* 给子组件进行传值 */}
            </TabPane>
          }
          {
            this.isAuthenticated(contract[24]) &&
            <TabPane tab="续签" key="2">
              <TrialSignaturePage statusSelect={2} {...this.props}/>
            </TabPane>
          }
          {
            this.isAuthenticated(contract[25]) &&
            <TabPane tab="试用期" key="3">
              <ProbationPeriodPage statusSelect="试用期" {...this.props}/>
            </TabPane>
          }
        </Tabs>
      </div>
    )
  }
}
