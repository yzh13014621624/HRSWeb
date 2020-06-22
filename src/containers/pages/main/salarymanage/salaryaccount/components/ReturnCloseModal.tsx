/*
 * @description: 撤回关账模态框
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-23 16:19:24
 * @LastEditTime: 2019-10-18 10:09:11
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Modal } from 'antd'

import './index.styl'

interface ReturnCloseModalProps {
  returnCloseVisible:boolean // 模态显示或隐藏
  onReturnChange:Function // 父组件自定义事件
  insureData:any // 数据存放
  apiPath: any
  apiData:any
  onSetChange?: (data:boolean) => void
}
interface ReturnCloseModalState {}

export default class ReturnCloseModal extends RootComponent<ReturnCloseModalProps, ReturnCloseModalState> {
  constructor (props: ReturnCloseModalProps) {
    super(props)
  }

  onHandleOk = () => {
    const { apiPath, apiData, onSetChange } = this.props
    this.axios.request(apiPath, apiData).then((res:any) => {
      if (onSetChange) onSetChange(true)
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
    this.onHandleCancel()
  }

  onHandleCancel = () => {
    this.props.onReturnChange(false)
  }

  render () {
    const { returnCloseVisible } = this.props
    return (
      <Modal
        title="提示"
        visible={returnCloseVisible}
        footer={null}
        closable={false}
        maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        style={{ textAlign: 'center', height: '1.45rem' }}
        bodyStyle={{ height: '1.1rem', padding: '0.13rem 0 0 0' }}
        className="return-close-modal"
        width='2.5rem'
      >
        <p style={{ paddingBottom: '0.05rem' }}>确定撤回本月关账吗？</p>
        <p style={{ paddingBottom: '0.15rem' }}>撤回关账后，上次关账时归档的报表将被删除！！！</p>
        <Button onClick={this.onHandleOk} className='comfirm-btn' type="primary">确定</Button>
        <Button onClick={this.onHandleCancel} className='cancel-btn'>取消</Button>
      </Modal>
    )
  }
}
