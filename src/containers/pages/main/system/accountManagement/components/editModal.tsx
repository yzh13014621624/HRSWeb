/*
 * @description: 新增编辑、修改密码弹窗
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-07 15:50:07
 * @LastEditTime: 2020-06-08 16:54:42
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, Input, Icon, Modal, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { FormatInputValue, compareDeep, AesUtil } from '@utils/index'
import '../index.styl'
const { Item } = Form

/** 判断是否都存在值 */
function hasErrors (fieldsError:any) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

interface State {
  userID: number
  isDistabledBtn: boolean // 按钮是否置灰
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

interface ModalPrpos {
  titleName: number
  tableDataLoad: () => void // 加载table数据
}

interface EditModalProps extends BaseProps, FormComponentProps, ModalPrpos {}

export default class EditModal extends RootComponent<EditModalProps, State> {
  modalRef = React.createRef<BasicModal>()
  modalDeleteRef = React.createRef<BasicModal>()
  modalUserRef = React.createRef<BasicModal>()
  constructor (props: EditModalProps) {
    super(props)
    this.state = {
      userID: 0,
      isDistabledBtn: true
    }
  }

  // 控制form表单输入框的值
  transformInputValue = (value: string) => {
    return FormatInputValue.parsetInt(value, 11)
  }

  /** 密码验证 */
  validatorPwd = (rules:any, value:any, callback:any) => {
    let reg = /^((?![a-zA-z]+$)(?!\d+$)[a-zA-Z\d]{6,16})+$/
    try {
      if (value.length < 6) {
        callback(new Error('请输入长度大于6位的字符'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入字母和数字组合的密码'))
      }
      callback()
    } catch (err) {
      callback(new Error('请输入密码'))
    }
  }

  /** 用户名校验 */
  validator = (rules:any, value:any, callback:any) => {
    let reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
    try {
      if (value.length === 0) {
        callback(new Error('请输入用户姓名'))
      } else if (!reg.test(value)) {
        callback(new Error('长度为10字以内的中英文'))
      }
      callback()
    } catch (err) {
      callback(new Error('请输入用户姓名'))
    }
  }

  // 打开模态框（1新增 2编辑 3选择角色 4更换角色 5删除 6修改密码 7停用/启用）
  openModal = async (type: number, records?: any) => {
    (type === 1 || type === 2) && await this.modalRef.current!.onShow()
    if (type !== 1) {
      const { userID, userName, userPhone } = records
      const { props: { form: { setFieldsValue } } } = this
      // 用户编辑/修改密码
      if (type === 2) {
        setFieldsValue({
          userName: userName,
          userPhone: userPhone
        })
      }
      this.setState({
        userID
      })
    }
    this.changeBtnStatus()
  }

  closeModal = () => {
    this.props.form.resetFields()
    this.modalRef.current!.handleCancel()
  }

  // 新增编辑用户
  userEdit = (titleName: number) => {
    const { api: { SystemInsertUser, SystemUpdUser, SystemResetPassword }, axios: { request }, state: { userID }, $message: { success } } = this
    this.props.form.validateFields(['userPhone', 'password'], async (err, values) => {
      let value = this.props.form.getFieldsValue()
      if (!err) {
        // 新增
        let param = {}
        if (titleName === 1) {
          param = {
            ...value
            // userPassword: AesUtil.encryptCBC(value.userPassword)
          }
          let { code }: any = await request(SystemInsertUser, param)
          if (code === 200) {
            success('新增成功！')
          }
        } else if (titleName === 2) {
          // 编辑
          param = {
            ...value,
            userID
          }
          let { code }: any = await request(SystemUpdUser, param)
          if (code === 200) {
            success('修改成功！')
          }
        }
        this.props.tableDataLoad()
        this.modalRef.current!.handleCancel()
      }
    })
  }

  changeBtnStatus = () => {
    const { props: { form: { getFieldsValue }, titleName } } = this
    setTimeout(() => {
      const { userPhone, userName } = getFieldsValue()
      if ((userPhone || titleName !== 1) && (userPhone || titleName !== 2) && userName) this.setState({ isDistabledBtn: false })
      else this.setState({ isDistabledBtn: true })
    }, 0)
  }

  render () {
    const {
      props: { form: { getFieldDecorator, getFieldsError }, titleName },
      state: { isDistabledBtn }
    } = this
    return (
      <div id='accountManagement'>
        <BasicModal
          destroyOnClose={true}
          ref={this.modalRef}
          width={480}
          maskClosable = {false}
          title={titleName === 1 ? '新增' : titleName === 6 ? '修改密码' : '查看'}
        >
          <Form>
            <Row className='modalAccountManagement'>
              {/* {
                titleName !== 6 */}
              <Col>
                <Item label='用户名' className='pieceoverviewInfo-input' {...formItemLayout}>
                  { getFieldDecorator('userPhone', {
                    // initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '请输入正确的手机号',
                        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
                      }
                    ],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear placeholder="请输入手机号" type='text' onChange={this.changeBtnStatus}></Input>) }
                </Item>
                {/* {
                  titleName === 1 &&
                  <Item label='密码' className='pieceoverviewInfo-input' {...formItemLayout}>
                    { getFieldDecorator('userPassword', {
                      // initialValue: '',
                      rules: [
                        {
                          required: true,
                          validator: this.validatorPwd
                        }
                      ]
                    })(<Input allowClear placeholder="长度为6-16位的字母&数字组合" maxLength={16} type='text' onChange={this.changeBtnStatus}></Input>) }
                  </Item>
                } */}
                <Item label='用户姓名' className='pieceoverviewInfo-input' {...formItemLayout}>
                  { getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        validator: this.validator
                      }
                    ],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return FormatInputValue.removeEmpty(e.target.value)
                    }
                  })(<Input allowClear placeholder="请输入用户姓名" maxLength={10} onChange={this.changeBtnStatus}></Input>) }
                </Item>
              </Col>
              {/* : <Col>
                <Item label='新密码' className='pieceoverviewInfo-input' {...formItemLayout}>
                  { getFieldDecorator('password', {
                    // initialValue: '',
                    rules: [
                      {
                        required: true,
                        validator: this.validatorPwd
                      }
                    ]
                  })(<Input allowClear placeholder="长度为6-16位的字母&数字组合" maxLength={16} type='password' onChange={this.changeBtnStatus}></Input>) }
                </Item>
              </Col>
          } */}
              <div className='modalBtnDiv'>
                <Button type="primary" disabled={hasErrors(getFieldsError()) || isDistabledBtn} onClick={() => this.userEdit(titleName)}>{titleName === 2 ? '保存' : '确定'}</Button>
                <Button onClick={() => this.closeModal()}>取消</Button>
              </div>
            </Row>
          </Form>
        </BasicModal>
      </div>
    )
  }
}
