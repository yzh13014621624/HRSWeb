/**
 * @description 发送短信通知
 * @author minjie
 * @createTime 2019/10/23
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModalNew } from '@components/index'
import { Button, Row, Modal } from 'antd'

export interface SmsInterface {
  userId: number
  errMsg: string
  msg: string
  times: number
}

interface SendSMSProps {
  onCancel?: Function
  visible: boolean
  smsData: SmsInterface
}

interface SendSMSState {
  // 错误消息
  errorMsg: string
  // 按钮禁用
  disabledBtn: boolean
  // 显示错误的消息
  visibleModal: boolean
}

export default class SendSMS extends RootComponent<SendSMSProps, SendSMSState> {
  constructor (props:SendSMSProps) {
    super(props)
    this.state = {
      errorMsg: '',
      disabledBtn: false,
      visibleModal: false
    }
  }

  handalModalKey: number = 0

  /** 初始化数据 */
  componentDidMount () {
  }

  /** 发送短信之前 */
  sendSmsAfter = () => {
    const { smsData: { errMsg, msg, times } } = this.props
    this.handalModalKey = 2
    this.setState({ errorMsg: msg })
    this.handleBasicModal(1)
  }

  sendSms = () => {
    this.setState({ disabledBtn: true })
    const { smsData: { userId } } = this.props
    this.axios.request(this.api.entrySendSms, { userId }, true).then((res:any) => {
      this.setState({ disabledBtn: false })
      this.$message.success('发送成功！')
      this.handleModel() // 关闭，之后记得刷新
    }).catch((err:any) => {
      this.setState({ disabledBtn: false })
      this.setState({ errorMsg: err.msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 弹窗的显示 */
  handleModel = () => {
    const { onCancel } = this.props
    if (onCancel) onCancel(false)
  }

  /** 错误提示的弹窗 */
  handleBasicModal = (num: number) => {
    if (num === 2) this.sendSms()
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { visible } = this.props
    const { disabledBtn, errorMsg, visibleModal } = this.state
    const propsModal = {
      title: '消息提示',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, 0),
      footer: false,
      width: 400,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <p style={{ textAlign: 'center', marginBottom: 40 }}>好饭碗登录账号不存在，请去好饭碗注册该账号</p>
        <Row type="flex" justify="center">
          <Button type="primary" disabled={disabledBtn} style={{ width: 140 }} onClick={this.sendSmsAfter}>发送短信通知</Button>
          <Button onClick={this.handleModel.bind(this, 0)} style={{ width: 140, marginLeft: 30 }}>知道了</Button>
        </Row>
        <BasicModalNew visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div style={{ textAlign: 'center', paddingBottom: 20 }}>
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModalNew>
        <BasicModalNew visible={visibleModal} onCancel={this.handleBasicModal}>
          <p className="delete-p"><span>{errorMsg}</span></p>
          {this.handalModalKey === 0 ? <Row>
            <Button onClick={this.handleBasicModal.bind(this, 0, '')} type="primary">确认</Button>
          </Row> : <Row>
            <Button onClick={this.handleBasicModal.bind(this, this.handalModalKey, '')} type="primary">确认</Button>
            <Button onClick={this.handleBasicModal.bind(this, 0, '')} type="primary">取消</Button>
          </Row>}
        </BasicModalNew>
      </Modal>
    )
  }
}
