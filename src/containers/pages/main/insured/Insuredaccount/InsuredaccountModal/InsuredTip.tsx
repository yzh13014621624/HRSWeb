/**
 * @author maqian
 * @createTime 2019/04/11
 * @description 撤回关账确定模态框
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Modal } from 'antd'
import '../InsuredAccountePage.styl'

interface InsuredTipProps {
  tipVisible?:any
  TipChange?:any
  returnData?:any
}
@hot(module) // 热更新（局部刷新界面）
export default class InsuredTip extends RootComponent<InsuredTipProps, any> {
  constructor (props:any) {
    super(props)
    this.state = {
      visible: false
    }
  }
  handleOk = (e:any) => {
    // 发送数据导出的请求,撤回关账
    const { returnData: { iaId, entityId, projectId } } = this.props
    this.axios.request(this.api.insureclose, {
      iaId,
      projectId,
      entityId,
      closeAccount: 0,
      handleType: 1
    }).then((res:any) => {
      // 消息提示 路径跳转
      if (res.code === 200) {
        this.props.TipChange(false) // 关闭撤回关账模态
      }
    }).catch((err:any) => {
      this.error(err.msg[0])
      this.props.TipChange(false) // 关闭撤回关账模态
    })
  }
  handleCancel = (e:any) => {
    this.props.TipChange(false)
  }

  render () {
    const { tipVisible } = this.props
    return (
      <div>
        <Modal
          title="提示"
          visible={tipVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          closable={false}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
          style={{ textAlign: 'center', height: '1.2rem' }}
          bodyStyle={{ height: '0.86rem', padding: '0.13rem 0 0 0' }}
          className="title-style"
          width='2.5rem'
        >
          <p style={{ paddingBottom: '0.15rem' }}>确定撤回本月关账？</p>
          <Button onClick={this.handleOk} className='comfirm-btn' type="primary">确定</Button>
          <Button onClick={this.handleCancel} className='cancel-btn'>取消</Button>
        </Modal>
      </div>
    )
  }
}
