/*
 * @description: 选择角色、更换角色
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-07 15:50:07
 * @LastEditTime: 2020-06-08 17:16:43
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, Input, Icon, Modal, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { FormatInputValue, compareDeep, AesUtil } from '@utils/index'
import SearchInput from '@shared/SearchInput/index'
import '../index.styl'

const { Item } = Form

interface State {
  userID: number
  isDistabledBtn: boolean
  records: KeyValue
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

interface ModalPrpos {
  titleName: number
  tableDataLoad: () => void // 加载table数据
}

interface SelectRoleProps extends BaseProps, FormComponentProps, ModalPrpos {}

export default class EditModal extends RootComponent<SelectRoleProps, State> {
  modalRef = React.createRef<BasicModal>()
  constructor (props: SelectRoleProps) {
    super(props)
    this.state = {
      userID: 0,
      isDistabledBtn: true,
      records: {}
    }
  }

  // 打开模态框（1新增 2编辑 3选择角色 4更换角色 5删除 6修改密码 7停用/启用）
  openModal = async (type: number, records?: any) => {
    (type === 3 || type === 4) && await this.modalRef.current!.onShow()
    const { userID, arId, userPhone } = records
    const { props: { form: { setFieldsValue } } } = this
    // 用户编辑/修改密码
    if (type === 4) {
      setTimeout(() => {
        setFieldsValue({
          arId: arId || undefined
        })
        this.changeBtnStatus()
      }, 200)
    } else {
      this.changeBtnStatus()
    }
    this.setState({
      userID,
      records
    })
  }

  closeModal = () => {
    this.props.form.setFieldsValue({
      arId: undefined
    })
    this.modalRef.current!.handleCancel()
  }

  // 新增编辑用户
  userEdit = (titleName: number) => {
    const { api: { SystemGrantRoles }, axios: { request }, state: { userID, records }, $message: { success } } = this
    this.props.form.validateFields(['arId'], async (err, value) => {
      if (!err) {
        let param = {
          arId: value.arId || undefined,
          userID,
          roleName: records.roleName
        }
        let { code } = await request(SystemGrantRoles, param)
        if (code === 200) {
          success(`${titleName === 3 ? '选择成功' : '更换成功'}`)
        }
        this.props.tableDataLoad()
        this.closeModal()
      }
    })
  }

  getSelected = (value: any, i: any) => {
    this.setState({
      records: value
    })
  }

  changeBtnStatus = () => {
    const { props: { form: { getFieldsValue }, titleName } } = this
    setTimeout(() => {
      const { arId } = getFieldsValue()
      if (arId) this.setState({ isDistabledBtn: false })
      else this.setState({ isDistabledBtn: true })
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator }, titleName },
      api: { SystemQueryRoleList },
      state: { isDistabledBtn }
    } = this
    return (
      <div id='accountManagement'>
        <BasicModal
          destroyOnClose
          ref={this.modalRef}
          width={480}
          maskClosable = {false}
          title={titleName === 3 ? '选择角色' : '更换角色'}
        >
          <Row className='modalAccountManagement'>
            <Col>
              <Form>
                <Item label='角色' className='pieceoverviewInfo-input' {...formItemLayout}>
                  { getFieldDecorator('arId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择角色'
                        // validator: this.validateName
                      }
                    ]
                  })(<SearchInput
                    url={SystemQueryRoleList}
                    type={3}
                    placeholder='请选择角色'
                    param={{ pageSize: 100, roleStatus: 2 }}
                    getSelected={this.getSelected}
                    className='input-220'
                    onChange={this.changeBtnStatus}
                  />) }
                </Item>
              </Form>
              <div className='modalBtnDiv'>
                <Button type="primary" onClick={() => this.userEdit(titleName)} disabled={isDistabledBtn}>确定</Button>
                <Button onClick={() => this.closeModal()}>取消</Button>
              </div>
            </Col>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
