/*
 * @description: 盒马员工 OSS 组件
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-03-27 10:11:53
 * @LastEditTime: 2020-04-17 11:50:36
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Modal, Card, Button } from 'antd'

import './contract.styl'

interface BaseProps {
  contractDetail?: any
}

interface BaseState {
  visible: boolean
}

export default class extends RootComponent<BaseProps, BaseState> {
  state = {
    visible: false
  }

  render () {
    const { contractDetail = {} } = this.props
    const { contractOss, typeName, userInfo: { userName } } = contractDetail
    return (
      <div className="upload_contract_wrapper">
        <Card title="合同（oss平台读取）" className="contract_button">
          <Button className="upload_btn" onClick={() => this.setState({ visible: true })}>{`${typeName}-${userName}`}</Button>
          <span className="upload_tips">（点击查看合同详细内容）</span>
        </Card>
        <Modal
          className="upload-more-modal-box"
          width='900px'
          footer={null}
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          style={{ boxShadow: '0px 0px 5px 0px rgba(190,190,190,0.5)' }}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}>
          <iframe width='100%' height={500} src={contractOss} frameBorder="0"></iframe>
        </Modal>
      </div>
    )
  }
}
