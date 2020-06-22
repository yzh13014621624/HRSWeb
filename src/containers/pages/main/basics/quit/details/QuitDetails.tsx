/**
 * @author lixinying
 * @createTime 2019/04/03
 * @lastEditTim 2019/04/10
 * @description 详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import SysUtil from '@utils/SysUtil'
import { Form, Input, Divider, Row, Col, Button, Select, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'

import date from '@assets/images/date.png'
import moment from 'moment'

import './QuitDetails.styl'

import { BaseProps, KeyValue } from 'typings/global'

interface FormProps extends BaseProps, FormComponentProps {}

interface FormState {
  staffBaseInfo: { userInfo: KeyValue, [key: string]: any }
  disabled: boolean
  inputDisabled: boolean
}

class FormComponent extends RootComponent<FormProps, FormState> {
  timerId: any = null
  staffBaseInfo: KeyValue = SysUtil.getSessionStorage('QuitEdit') || {}

  constructor (props: FormProps) {
    super(props)
    this.state = {
      staffBaseInfo: {
        userInfo: {}
      },
      disabled: true,
      inputDisabled: false
    }
  }
  componentDidMount () {
    this.getStaffQuitDetail()
  }

  getStaffQuitDetail () {
    this.axios.request(this.api.quitEditDetail, { id: this.staffBaseInfo.id })
      .then(({ data }) => {
        const { jumpExplain, reasonId } = data
        data.quitCause = reasonId
        data.quittext = jumpExplain
        const quitTimes = Number(moment(data.quitTime).format('YYYYMMDD'))
        const newDate = Number(moment(new Date()).format('YYYYMMDD'))
        if (newDate - quitTimes > 0) {
          this.setState({
            inputDisabled: true
          })
        }
        this.setState({
          staffBaseInfo: data
        })
        this.getFieldsValue(0)
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 设定 button 按钮点击状态
  getFieldsValue = (t: number) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      const fieldsValue = this.props.form.getFieldsValue()
      const { quitTime, quitCause } = fieldsValue
      const disabled = !(quitTime && quitCause)
      this.setState({
        disabled
      })
    }, 50)
  }

  handleSubmit = () => {
    const { quitTime, quitCause, quittext = '' } = this.props.form.getFieldsValue()
    const params = {
      id: this.staffBaseInfo.id,
      quitTime: moment(quitTime).format('YYYY-MM-DD'),
      reasonId: quitCause,
      jumpExplain: quittext
    }
    this.axios.request(this.api.quitUpadte, params)
      .then(() => {
        this.$message.success('保存成功', 2)
        SysUtil.clearSession('QuitEdit')
        this.props.history.replace('/home/quitPage')
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  cancel = () => {
    this.props.history.replace('/home/quitPage')
  }

  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    const { inputDisabled } = this.state
    const { quitTime, quitCause, quittext, userInfo, reasonList = [] } = this.state.staffBaseInfo
    const { projectName, projectNumber, sjNumber, userName, organize, entity, roleType, entryTime } = userInfo
    return (
      <div id="quit-add">
        <div style={{ marginLeft: 40, marginTop: 1 }}>
          <Row style={{ marginBottom: 22 }}>
            <Col span={6}>项目：{projectName}</Col>
            <Col span={6}>工号：{projectNumber || '---'}</Col>
            <Col span={6}>管理编号：{sjNumber}</Col>
            <Col span={6}>姓名：{userName}</Col>
          </Row>
          <Row>
            <Col span={6}>组织：{organize}</Col>
            <Col span={6}>法人主体：{entity}</Col>
            <Col span={6}>员工类型：{roleType}</Col>
            <Col span={6}>入职日期：{entryTime}</Col>
          </Row>
        </div>
        <Divider style={{ height: 1 }} />
        <Form layout="inline">
          <Form.Item label="离职日期" className="select-item" >
            {getFieldDecorator('quitTime', {
              initialValue: moment(quitTime),
              rules: [{ required: true }]
            })(
              <DatePicker
                placeholder="请选择日期"
                disabled={inputDisabled}
                disabledDate={(current: any) => current && moment(current).isBefore(entryTime)}
                onChange={this.getFieldsValue.bind(this, 1)} />
            )}
          </Form.Item>
          <Form.Item label="离职原因" className="select-item" style={{ marginLeft: 70 }}>
            {getFieldDecorator('quitCause', {
              initialValue: quitCause,
              rules: [{ required: true }]
            })(
              <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} style={{ width: '1.145rem' }} onChange={this.getFieldsValue.bind(this, 1)} disabled={inputDisabled}>
                {reasonList.map((item: KeyValue) => <Select.Option value={item.reasonId} key={item.reasonId}>{item.jumpReason}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Form>
        <Form.Item label="离职说明" className="custextarea">
          {getFieldDecorator('quittext', {
            initialValue: quittext,
            rules: [
              {
                pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,50}$/, 'g'),
                message: '请输入中文或英文 长度在50位之内'
              }
            ]
          })(
            <Input.TextArea
              disabled={inputDisabled}
              placeholder="最多可输入50字"
              autoSize={false}
              onChange={this.getFieldsValue.bind(this, 1)} />
          )}
        </Form.Item>
        <Divider style={{ height: 1 }} />
        {
          /* eslint-disable */
          this.isAuthenticated(this.AuthorityList.quit[3]) && !inputDisabled
            ?
              <Form.Item>
                <Button type="primary" disabled={this.state.disabled} onClick={this.handleSubmit} className="ant_button_confirm">保存</Button>
                <Button onClick={this.cancel} className="ant_button_cancel">取消</Button>
              </Form.Item>
            :
              <Form.Item>
                <Button type="primary" onClick={this.cancel} className="ant_button_confirm">返回</Button>
              </Form.Item>
        }
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }
}
@hot(module)
export default class EntryAdd extends RootComponent<BaseProps> {
  render () {
    const CustomForm = Form.create<FormProps>()(FormComponent)
    return (
      <div id="quit-detalis" >
        <CustomForm {...this.props} />
      </div>
    )
  }
}
