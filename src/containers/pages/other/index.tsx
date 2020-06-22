/*
* @author: minjie
* @description: 文件上传的
 * @createTime: 2019/6/3
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, FileUpload } from '@components/index'
import { Button, Tabs } from 'antd'

import { ExecuteSqlScriptItem } from './sub/index'

const { TabPane } = Tabs

export default class GuidePage extends RootComponent<any, any> {
  // 银行卡信息导入--实现
  bankpath:string = 'CheckBankCard/importUserInfo'
  constructor (props:any) {
    super(props)
  }

  /** 首页的信息 */
  goBack = () => {
    this.props.history.replace('/home/homeInfo')
  }

  render () {
    return (
      <div>
        <Button type='primary' onClick={this.goBack}>返回主页</Button>
        <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="文件上传" key="1">
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <FileUpload action={this.bankpath}>
                  <Button type="primary">银行卡信息导入-上传</Button>
                </FileUpload>
              </span>
            </TabPane>
            <TabPane tab="接口调用" key="2">
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <ExecuteSqlScriptItem/>
              </span>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
