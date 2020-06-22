/*
 * @description: 参数维护Tab主页面
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 13:51:20
 * @LastEditTime : 2019-12-25 14:34:10
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem } from '@components/index'
import { Tabs } from 'antd'
import { HttpUtil } from '@utils/index'
import ProjectContract from './ProjectContract/index'
import SalaryStandard from './SalaryStandard/index'
import PieceParameter from './PieceParameter/index'

import './index.styl'

const TabPane = Tabs.TabPane

interface SalaryParameterProps {
  location: any
}
interface SalaryParameterState {
  defaultActive:any
}

export default class SalaryParameterPage extends RootComponent<SalaryParameterProps, SalaryParameterState> {
  constructor (props: any) {
    super(props)
    let { tabValue } = HttpUtil.parseUrl(this.props.location.search)
    this.state = {
      defaultActive: tabValue || '1'
    }
  }

  onTabChange = (defaultActive: any) => {
    this.setState({ defaultActive })
  }

  render () {
    const {
      AuthorityList: { salaryparametersetting },
      isAuthenticated,
      state: { defaultActive }
    } = this
    return (
      <div className='salaryparametersetting'>
        <Tabs defaultActiveKey={defaultActive} onChange={this.onTabChange}>
          { isAuthenticated(salaryparametersetting[10]) && <TabPane tab="项目合同费用设置" key="1">
            <ProjectContract />
          </TabPane>
          }
          { isAuthenticated(salaryparametersetting[11]) && <TabPane tab="工资标准设置" key="2">
            <SalaryStandard {...this.props}/>
          </TabPane>
          }
          { isAuthenticated(salaryparametersetting[12]) && <TabPane tab="上嘉项目-计件制参数设置" key="3">
            <PieceParameter {...this.props}/>
          </TabPane>
          }
        </Tabs>
      </div>
    )
  }
}
