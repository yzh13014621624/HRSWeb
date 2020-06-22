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
  title?: string | any // 顶部的提示
  width?: string | any // 宽度
  colseModel?: Function // 关闭的时候的方法
  destroyOnClose?: boolean
  maskClosable?: boolean // 点击蒙层是否允许关闭
  baseModalStyl?: string // 为了方便控制modal里面元素的样式
}

interface BasicModalState {
  visibleS: boolean
}

export default class BasicModal extends RootComponent<BasicModalProps, BasicModalState> {
  static defaultProps = {
    title: '提示',
    destroyOnClose: false,
    maskClosable: true,
    baseModalStyl: ''
  }

  constructor (props:any) {
    super(props)
    this.state = {
      visibleS: false
    }
  }

  /**
   * 显示弹窗
   */
  onShow = () => {
    this.setState({
      visibleS: true
    })
  }

  /* 点击确定的回调  */
  handleOk = () => {
    this.setState({
      visibleS: true
    })
  }

  /* 模态框的 关闭 */
  handleCancel = () => {
    const { colseModel } = this.props
    if (colseModel) {
      colseModel(true)
    }
    this.setState({
      visibleS: false
    })
  }

  render () {
    const { visibleS } = this.state
    const { children, title, width, destroyOnClose, maskClosable, baseModalStyl } = this.props
    const isReactElement: boolean = typeof children === 'object' && (children as object).hasOwnProperty('$$typeof')
    let ch: [] = children as any
    let lastIndex = ch.length
    const modalChilren = () => {
      return (
        <div>
          {ch.slice(0, lastIndex - 1)}
          <div className="basic-modal">
            {ch[lastIndex - 1]}
          </div>
        </div>
      )
    }
    return (
      <Modal
        title={(<p className="basic-modal-title">{title}</p>)}
        centered={true}
        footer={false}
        destroyOnClose={destroyOnClose}
        maskClosable={maskClosable}
        visible={visibleS}
        onOk={this.handleOk}
        width={width || '2.5rem'}
        onCancel={this.handleCancel}
        className={baseModalStyl}
      >
        {
          isReactElement ? children : modalChilren()
        }
      </Modal>
    )
  }
}
