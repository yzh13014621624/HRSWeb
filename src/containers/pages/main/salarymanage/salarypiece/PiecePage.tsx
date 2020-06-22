/*
 * @description: 计件计算主页面
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-19 15:05:56
 * @LastEditTime: 2020-05-26 18:58:39
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Tabs } from 'antd'
import { BaseProps } from 'typings/global'
import './Index.styl'
import SalaryPieceOverview from './pieceoverview/Pieceoverview'// 计件项目总览列表
import SalaryPieceWorkIncome from './pieceworkincome/PieceoverviewPage'// 员工计件收入
import { HttpUtil } from '@utils/index'

const { TabPane } = Tabs

interface State {
  defaultActive: string
}

export default class SalaryPiece extends RootComponent<BaseProps, State> {
  constructor (props: BaseProps) {
    super(props)
    let { defaultActive = '1' } = HttpUtil.parseUrl(this.props.location.search)
    this.state = {
      defaultActive
    }
  }

  tabDefaultActive = (defaultActive: string) => {
    if (defaultActive === '1' && HttpUtil.parseUrl(this.props.location.search)) {
      this.props.history.push('/home/salarypiece')
    }
    this.setState({ defaultActive })
  }

  render () {
    const { state: { defaultActive }, AuthorityList: { salarypiece }, isAuthenticated } = this
    return (
      <div id = 'salaryPiecePage'>
        <Tabs defaultActiveKey = {defaultActive} onChange = {this.tabDefaultActive}>
          {
            isAuthenticated(salarypiece[11]) &&
            <TabPane tab="计件项目总览" key='1'>
              <SalaryPieceOverview {...this.props}/>
            </TabPane>
          }
          {
            isAuthenticated(salarypiece[12]) &&
            <TabPane tab="员工计件收入" key='2'>
              <SalaryPieceWorkIncome {...this.props}/>
            </TabPane>
          }
        </Tabs>
      </div>
    )
  }
}
