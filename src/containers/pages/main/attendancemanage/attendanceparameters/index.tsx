/*
 * @description: 考勤管理-参数维护主页面
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-20 15:25:58
 * @LastEditTime: 2020-05-07 18:49:09
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem } from '@components/index'
import { Tabs } from 'antd'
import AttendanceList from './atttendance/attendanceList'
import OverTime from './overtime'
import Shift from './shift'
import Absence from './absence'
import AttendSetting from './attendSetting'
import AttendanceSet from './attendanceset'

const { TabPane } = Tabs

@hot(module)
export default class AttendanceParametersPage extends RootComponent<any, any> {
  constructor (props:any) {
    super(props)
    this.state = {
      curTab: '1'
    }
  }

  handleChange = (curTab: any) => {
    this.setState({
      curTab
    })
  }

  render () {
    const {
      AuthorityList: { composeParam },
      isAuthenticated,
      state: { curTab }
    } = this
    return (
      <div className='attendance-parameters-container'>
        <Tabs activeKey={curTab} onChange={this.handleChange} >
          {
            isAuthenticated(composeParam[19]) && <TabPane tab='出勤参数' key='1'>
              <AttendanceList {...this.props} />
            </TabPane>
          }
          {
            isAuthenticated(composeParam[20]) && <TabPane tab='班次参数' key='2'>
              <Shift />
            </TabPane>
          }
          {
            isAuthenticated(composeParam[21]) && <TabPane tab='缺勤参数' key='3'>
              <Absence />
            </TabPane>
          }
          {
            isAuthenticated(composeParam[22]) && <TabPane tab='加班参数' key='4'>
              <OverTime />
            </TabPane>
          }
          <TabPane tab='考勤参数' key='5'>
            {curTab === '5' && <AttendSetting />}
          </TabPane>
          <TabPane tab='不参与考勤人员设置' key='6'>
            <AttendanceSet />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
