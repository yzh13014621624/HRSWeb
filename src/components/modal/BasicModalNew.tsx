/**
 * @author minjie
 * @createTime 2019/04/07
 * @description 模态框
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Modal } from 'antd'
import './BasicModal.styl'

interface BasicModalProps {
  title?: string | any
  onCancel?: Function
  onOk?: Function
  width?: string|number
  visible: boolean
}

interface BasicModalState {
}

export default class BasicModal extends RootComponent<BasicModalProps, BasicModalState> {
  constructor (props:any) {
    super(props)
  }
  static defaultProps = {
    width: '2.5rem',
    title: '提示'
  }

  /* 模态框的 关闭 */
  handleCancel = () => {
    const { onCancel, onOk } = this.props
    if (onCancel) {
      onCancel(0)
    }
    if (onOk) {
      onOk(0)
    }
  }

  render () {
    const { children, title, visible, width } = this.props
    let ch:[] = children as any
    let lastIndex = 0
    if (children) {
      lastIndex = ch.length
    }
    return (
      <Modal
        title={(<p className="basic-modal-title">{title}</p>)}
        centered={true}
        footer={false}
        visible={visible}
        onOk={this.handleCancel}
        width={width}
        onCancel={this.handleCancel}
      >
        {children ? ch.slice(0, lastIndex - 1) : null}
        {children ? <div className="basic-modal">
          {ch[lastIndex - 1]}
        </div> : null}
      </Modal>
    )
  }
}
