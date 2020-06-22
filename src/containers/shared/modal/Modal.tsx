/*
 * @description: 通用操作模态框
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-08 17:40:23
 * @LastEditTime: 2020-05-08 18:52:02
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Button, Input, Row, Checkbox } from 'antd'

import './index.styl'

import { BaseProps } from 'typings/global'

interface UrlInteface {
  path:string
  type?:string
}

interface BaseModalProps extends BaseProps {
  text?: string // 提示文本
  path?: string // 跳转路由
  confirmText?: string // 确定按钮文本
  cancelText?: string // 取消按钮文本
  intercept?: boolean // 是否拦截确定事件，默认 false
  url?: UrlInteface // 后台接口
  params?: object // 后台数据
  load?: () => void // 处理之后是否刷新数据，也可以是其他逻辑处理
  confirm?: (data?: any) => void // 拦截确定事件的处理函数
  showConfirm?: boolean // 隐藏与否确定按钮
  showCancle?: boolean // 隐藏与否取消按钮
  onClose?: () => void // 拦截取消事件的处理函数
}

interface BaseModalState {
  rejectReason?: string
}
class BaseModal extends RootComponent<BaseModalProps, BaseModalState> {
  static defaultProps = {
    confirmText: '确认',
    cancelText: '取消',
    showConfirm: true,
    showCancle: true,
    intercept: false
  }

  modalRef = React.createRef<BasicModal>()

  preventConfirmMoreClick = true
  preventCancleMoreClick = true

  constructor (props: BaseModalProps) {
    super(props)
  }

  show = () => {
    this.modalRef.current!.handleOk()
  }

  handlerConfirm = () => {
    if (this.preventConfirmMoreClick) {
      const { props, axios, handleCancel } = this
      const { url, intercept, path, params, load, confirm, history, showCancle } = props
      this.preventConfirmMoreClick = false
      if (!showCancle) {
        handleCancel()
        setTimeout(() => {
          this.preventConfirmMoreClick = true
        }, 1200)
        return
      }
      if (intercept) {
        confirm && confirm()
        setTimeout(() => {
          this.preventConfirmMoreClick = true
        }, 1200)
        return
      }
      axios.request(url!, params!).then(() => {
        handleCancel()
        load && load()
        path && history.replace(path)
        setTimeout(() => {
          this.preventConfirmMoreClick = true
        }, 1200)
      })
    }
  }

  handleCancel = () => {
    if (this.preventCancleMoreClick) {
      this.preventCancleMoreClick = false
      const { onClose } = this.props
      this.modalRef.current!.handleCancel()
      onClose && onClose()
      setTimeout(() => {
        this.preventCancleMoreClick = true
      }, 1200)
    }
  }

  createModalChildren (txt?: string) {
    const {
      modalRef, handlerConfirm, handleCancel,
      props: { confirmText, cancelText, text, showConfirm, showCancle }
    } = this
    return (
      <BasicModal ref={modalRef} title={'提示'} width="2.5rem">
        <div className="modal_container">
          <div className='modal_text'>{txt || text}</div>
          <div className='modal-action'>
            {showConfirm && <Button onClick={handlerConfirm} className="b-confirm" type='primary'>{confirmText}</Button>}
            {showCancle && <Button onClick={handleCancel} className="b-cancel">{cancelText}</Button>}
          </div>
        </div>
      </BasicModal>
    )
  }
}

/* 通用模态框 */
export class BaseCommonModal extends BaseModal {
  render = () => this.createModalChildren()
}
