/**
 * @author minjie
 * @createTime 2019/05/21
 * @description 修改密码
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Form, Button, Modal, Input } from 'antd'

import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum, AesUtil } from '@utils/index'
import './style/uploadpwd.styl'

interface ModalFormProps extends FormComponentProps {
  handelModal:Function
}

class ModalForm extends RootComponent<ModalFormProps, UpdatePwdState> {
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }
  /** 提交密码 */
  submitData = (e:any) => {
    e.preventDefault()
    const { handelModal, form } = this.props
    const { validateFieldsAndScroll, setFields } = form
    validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        let { newPass, oldPass } = values
        let auth = SysUtil.getSessionStorage(globalEnum.admin)
        this.axios.request(this.api.commonUploadPwd, {
          newPass: AesUtil.encryptCBC(newPass),
          oldPass: AesUtil.encryptCBC(oldPass),
          phone: auth.phone
        }).then((res:any) => {
          let { code } = res
          if (code === 200) {
            // 清除密码
            let obj = SysUtil.getLocalStorage(globalEnum.cehckPwd)
            if (obj) {
              const { loginPassword, phoneNumber } = obj
              if (loginPassword) {
                SysUtil.setLocalStorage(globalEnum.cehckPwd, { phoneNumber })
              }
            }
            sessionStorage.clear()
            this.$message.success('修改密码成功，请重新登录！')
            handelModal(0)
            let timeout:any = setTimeout(() => {
              timeout = null
              window.location.href = '/'
            }, 3000)
          }
        }).catch((err:any) => {
          const { msg, code } = err
          if (code === 400) {
            setFields({ oldPass: { value: oldPass, errors: [new Error(msg)] } })
          }
        })
      }
    })
  }

  /** 密码验证 */
  validatorPwd = (rules:any, value:any, callback:any) => {
    let reg = /^((?![a-zA-z]+$)(?!\d+$)[a-zA-Z\d]{6,15})+$/
    if (value.length < 6) {
      callback(new Error('请输入长度大于6位的字符'))
    } else if (!reg.test(value)) {
      callback(new Error('请输入字母和数字组合的密码'))
    }
    callback()
  }

  /** 新密码验证 */
  validatorNewPwd = (rules:any, value:any, callback:any) => {
    let reg = /^(?![0-9]+$)|(?![a-z]+$)(?![A-Z]+$)|(?!([^(0-9a-zA-Z)])+$)^.{6,15}$/
    const { getFieldValue } = this.props.form
    let oldPass = getFieldValue('oldPass')
    if (value.length < 12) {
      callback(new Error('请输入长度等于12位的字符'))
    }
    if (oldPass === value) {
      callback(new Error('新密码不能同原密码相同'))
    }
    callback()
  }

  /** 新重密码验证 */
  validatorNewPwds = (rules:any, value:any, callback:any) => {
    let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{6,15}$/
    const { getFieldValue } = this.props.form
    let newPass = getFieldValue('newPass')
    if (value.length < 12) {
      callback(new Error('请输入长度等于12位的字符'))
    }
    if (newPass !== value) {
      callback(new Error('两次密码不一致'))
    }
    callback()
  }

  /** 参保名称输入验证 */
  transformPwd = (e:any) => {
    let value = e.target.value
    return value.replace(/(^\s*)|(\s*$)/g, '')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { handelModal } = this.props
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        sm: { span: 16 }
      }
    }
    return (
      <Form {...formItemLayout} onSubmit={this.submitData}>
        <Form.Item label="原 密 码">
          {getFieldDecorator('oldPass', {
            rules: [{ required: true }],
            getValueFromEvent: this.transformPwd
          })(<Input.Password maxLength={15} minLength={6} className="input-220" placeholder="请输入"></Input.Password>)}
        </Form.Item>
        <Form.Item label="新 密 码">
          {getFieldDecorator('newPass', {
            rules: [{ required: true, validator: this.validatorNewPwd }],
            getValueFromEvent: this.transformPwd
          })(<Input.Password className="input-220" placeholder="请输入" maxLength={12}></Input.Password>)}
        </Form.Item>
        <Form.Item label="确认新密码">
          {getFieldDecorator('newPasss', {
            rules: [{ required: true, validator: this.validatorNewPwds }],
            getValueFromEvent: this.transformPwd
          })(<Input.Password className="input-220" placeholder="请输入" maxLength={12}></Input.Password>)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 20, offset: 4 }} className="cus-form-item">
          <Button type="primary" htmlType="submit">确定</Button>
          <Button onClick={handelModal.bind(this, 0)}>取消</Button>
        </Form.Item>
      </Form>
    )
  }
}

interface UpdatePwdProps {
}

interface UpdatePwdState {
  visible:boolean
}

export default class UpdatePwd extends RootComponent<UpdatePwdProps, UpdatePwdState> {
  constructor (props:any) {
    super(props)
    this.state = {
      visible: false
    }
  }

  /** 关闭弹窗 */
  handelModal = (num:number) => {
    this.setState({ visible: num === 1 })
  }

  render () {
    const { visible } = this.state
    const ModalFormItem = Form.create<ModalFormProps>()(ModalForm)
    return (
      <Modal width={'2.5rem'} visible={visible}
        title={(<p className="cus-modal-title">修改密码</p>)}
        onCancel={this.handelModal.bind(this, 0)} footer={null}>
        <ModalFormItem handelModal={this.handelModal}></ModalFormItem>
      </Modal>
    )
  }
}
