/*
 * @description: 删除、停用启用模态框
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-07 15:50:07
 * @LastEditTime: 2020-05-12 16:57:42
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Form, Row, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import '../index.styl'

const { Item } = Form

interface State {
  userID: number
  status: number
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
      status: 0
    }
  }

  // 打开模态框（1新增 2编辑 3选择角色 4更换角色 5删除 6修改密码 7停用/启用）
  openModal = async (type: number, records?: any) => {
    await this.modalRef.current!.onShow()
    const { userID, roleName, userPhone, status } = records
    const { props: { form: { setFieldsValue } } } = this
    this.setState({
      userID,
      status
    })
  }

  closeModal = () => {
    this.props.form.resetFields()
    this.modalRef.current!.handleCancel()
  }

  // 5删除 7停用/启用
  userEdit = async (titleName: number) => {
    const { api: { SystemDeleteAdminUser, SystemEnable }, axios: { request }, state: { userID, status }, $message: { success } } = this
    if (titleName === 5) {
      let { code } = await request(SystemDeleteAdminUser, { userID })
      success('删除成功！')
    } else {
      let { code } = await request(SystemEnable, { userID, status: status === 0 ? 1 : 0 })
      success(`${status ? '启用成功' : '停用成功'}！`)
    }
    this.props.tableDataLoad()
    this.modalRef.current!.handleCancel()
  }

  render () {
    const {
      props: { form: { getFieldDecorator }, titleName },
      api: { SystemQueryRoleList },
      state: { status }
    } = this
    return (
      <div id='accountManagement'>
        <BasicModal
          destroyOnClose
          ref={this.modalRef}
          maskClosable = {false}
        >
          <p className='accountDeleteModal'>{titleName === 5 ? '确认要删除吗？' : `确认${status ? '启用' : '停用'}该账号？`}</p>
          <Row>
            <Col className='modalBtn'>
              <Button type="primary" onClick={() => this.userEdit(titleName)}>确定</Button>
              <Button onClick={() => this.closeModal()}>取消</Button>
            </Col>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
