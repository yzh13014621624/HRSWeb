/*
 * @description: 参保管理模块 - 个人参保 主板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 15:36:05
 * @LastEditTime: 2020-05-26 12:02:33
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { SysUtil } from '@utils/index'
import { Tabs } from 'antd'
import { hot } from 'react-hot-loader'

// 个人参保信息
import PersonalInsuredInfo from './personalInsuredInfo/personalInsuredInfoPage'
// 个人补缴信息
import PersonalSupplement from './personalSupplement/personalSupplementPage'
// 个人参保维护
import PersonalMaintain from './personalMaintain/personalMaintainPage'

import './style'

import { BaseProps } from 'typings/global'

@hot(module)
export default class PersonalInsured extends RootComponent<BaseProps> {
  render () {
    const key: any = this.props.location.state || '1'
    const { AuthorityList: { personalInsured }, isAuthenticated } = this
    return (
      <div id="personal_insured_container">
        <Tabs defaultActiveKey={key}>
          {
            isAuthenticated(personalInsured[12]) &&
            <Tabs.TabPane tab="个人参保维护" key="1">
              <PersonalMaintain {...this.props} />
            </Tabs.TabPane>
          }
          {
            isAuthenticated(personalInsured[1]) &&
            <Tabs.TabPane tab="个人参保信息" key="2">
              <PersonalInsuredInfo {...this.props} />
            </Tabs.TabPane>
          }
          {
            isAuthenticated(personalInsured[4]) &&
            <Tabs.TabPane tab="个人补缴信息" key="3">
              <PersonalSupplement {...this.props} />
            </Tabs.TabPane>
          }

        </Tabs>
      </div>
    )
  }
}
