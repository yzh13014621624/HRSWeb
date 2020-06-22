/**
 * @description 驳回
 * @author minjie
 * @createTime 2019/10/22
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModalNew } from '@components/index'
import { Button, Row, Col, Modal, Checkbox } from 'antd'
import { errorRejectMsg } from './entry'

const fontText = {
  fontSize: '16px',
  fontFamily: 'PingFangSC-Medium,PingFangSC',
  fontWeight: 500,
  color: 'rgba(51,51,51,1)',
  lineHeight: '22px'
}

interface RejectModalProps {
  onCancel?: Function
  visible?: boolean
  /** 用户的ID */
  userId: number
}

interface RejectModalState {
  // 错误消息
  errorMsg: string
  // 按钮禁用
  disabledBtn: boolean
  // 显示错误的消息
  visibleModal: boolean
  // 保存选中的值
  checkAry: Array<string>
}

export default class RejectModal extends RootComponent<RejectModalProps, RejectModalState> {
  constructor (props:RejectModalProps) {
    super(props)
    this.state = {
      errorMsg: '',
      disabledBtn: true,
      visibleModal: false,
      checkAry: []
    }
  }

  timeout: any = null

  /** 初始化数据 */
  componentDidMount () {
  }

  handleSubmit = () => {
    const { checkAry } = this.state
    const { userId } = this.props
    if (checkAry.length === 0) {
      this.$message.error('请选择驳回原因！')
    } else {
      this.setState({ disabledBtn: true })
      this.axios.request(this.api.entryReject, { codes: checkAry, userId }, true).then((res:any) => {
        this.setState({ disabledBtn: false })
        this.$message.success('驳回成功！')
        this.handleModel(2) // 关闭，之后记得刷新
      }).catch((err:any) => {
        const { msg } = err
        this.setState({ disabledBtn: checkAry.length === 0 })
        this.setState({ errorMsg: msg || err })
        this.handleBasicModal(1)
      })
    }
  }

  /** 弹窗的显示 */
  handleModel = (num: number) => {
    const { onCancel } = this.props
    if (onCancel) onCancel(num)
  }

  /** 错误提示的弹窗 */
  handleBasicModal = (num: number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 保存选中的意见反馈信息 */
  checkChange = (val:any) => {
    this.setState({ checkAry: val, disabledBtn: val.length === 0 })
  }

  render () {
    const { visible } = this.props
    const { disabledBtn, errorMsg, visibleModal } = this.state
    const propsModal = {
      title: '驳回原因',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, 0),
      footer: false,
      width: 800,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <p style={fontText}>选择驳回原因</p>
        <Checkbox.Group onChange={this.checkChange}>
          <Row>
            {errorRejectMsg.map((el:any, key:number) => (
              <Col key={key} span={6} style={{ margin: '10px 0' }}><Checkbox value={el.value}>{el.title}</Checkbox></Col>
            ))}
          </Row>
        </Checkbox.Group>
        <Row type="flex" justify="center">
          <Button type="primary" disabled={disabledBtn} style={{ width: 140 }} onClick={this.handleSubmit}>确定</Button>
          <Button onClick={this.handleModel.bind(this, 0)} style={{ width: 140, marginLeft: 30 }}>取消</Button>
        </Row>
        <BasicModalNew visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div style={{ textAlign: 'center', paddingBottom: 20 }}>
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModalNew>
      </Modal>
    )
  }
}
