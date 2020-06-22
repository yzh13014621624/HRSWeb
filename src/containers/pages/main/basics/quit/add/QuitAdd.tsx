/**
 * @author lixinying
 * @createTime 2019/04/03
 * @lastEditTim 2019/04/10
 * @description 新增
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Prompt } from 'react-router-dom'
import { Form, Input, Divider, Row, Col, Button, Select, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'

import date from '@assets/images/date.png'

import SysUtil from '@utils/SysUtil'
import moment from 'moment'

import './QuitAdd.styl'

import { BaseProps, KeyValue } from 'typings/global'

interface FormProps extends BaseProps, FormComponentProps {
  userId: number
  entryTime: string
  reasonList: KeyValue[]
}
interface FormState {
  disabled: boolean
  quitInfo: KeyValue
}

class FormComponent extends RootComponent<FormProps, FormState> {
  timerId: any = null

  constructor (props: FormProps) {
    super(props)
    this.state = {
      disabled: true,
      quitInfo: this.getLocaleStoragedStaffInfo('QuitAddInfo')
    }
  }

  componentDidMount () {
    this.getFieldsValue(0)
  }

  // 根据 userId 读取 localeStorage 中指定的信息
  getLocaleStoragedStaffInfo (name: string) {
    const { userId } = this.props
    const staffInfo = SysUtil.getLocalStorage(name)
    return (staffInfo && staffInfo[userId]) || {}
  }

  // 根据 userId 设置 localeStorage 中指定的信息
  setLocaleStoragedStaffInfo (name: string, info: any) {
    const { userId } = this.props
    let staffInfo = SysUtil.getLocalStorage(name)
    if (!staffInfo) staffInfo = {}
    staffInfo[userId] = info
    SysUtil.setLocalStorage(name, staffInfo)
  }

  // 根据 useId 移除 localeStorage 中指定的信息
  clearLocaleStoragedStaffInfo (name: string) {
    const { userId } = this.props
    let staffInfo = SysUtil.getLocalStorage(name)
    if (!staffInfo) staffInfo = {}
    delete staffInfo[userId]
    if (!Object.keys(staffInfo).length) SysUtil.clearLocalStorage(name)
    else SysUtil.setLocalStorage(name, staffInfo)
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
      if (t > 0) this.setLocaleStoragedStaffInfo('QuitAddInfo', fieldsValue)
      else console.log('初始化表单数据')
    }, 50)
  }

  handleSubmit = () => {
    const { quitTime, quitCause, quittext = '' } = this.props.form.getFieldsValue()
    const params = {
      userId: this.props.userId,
      quitTime: moment(quitTime).format('YYYY-MM-DD'),
      reasonId: quitCause,
      jumpExplain: quittext
    }
    this.axios.request(this.api.quitInsert, params)
      .then(() => {
        this.$message.success('新增成功', 2)
        SysUtil.clearSession('QuitAdd')
        this.clearLocaleStoragedStaffInfo('QuitAddInfo')
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
    const { form, entryTime, reasonList, userId } = this.props
    const { getFieldDecorator } = form
    const { quitTime, quitCause, quittext } = this.state.quitInfo
    // 动态配置 datepicker 组件是否选择日期
    const isSelectedDate = {
      initialValue: moment(quitTime),
      rules: [{ required: true, message: '请选择生效日期' }]
    }
    if (!quitTime) delete isSelectedDate.initialValue
    return (
      <div id="quit-add">
        <Form layout="inline">
          <Form.Item label="离职日期" className="select-item" >
            {getFieldDecorator('quitTime', isSelectedDate)(
              <DatePicker
                placeholder="请选择日期"
                disabledDate={(current: any) => current && moment(current).isBefore(entryTime)}
                onChange={this.getFieldsValue.bind(this, 1)} />
            )}
          </Form.Item>
          <Form.Item label="离职原因" className="select-item" style={{ marginLeft: '0.36rem' }}>
            {getFieldDecorator('quitCause', {
              initialValue: quitCause,
              rules: [{ required: true }]
            })(
              <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '1.145rem' }} onChange={this.getFieldsValue.bind(this, 1)}>
                {reasonList.map((item: KeyValue) => <Select.Option value={item.reasonId} key={item.reasonId}>{item.jumpReason}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Form>
        <Form.Item label="离职说明：" className="custextarea">
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
              placeholder="最多可输入50字"
              autoSize={false}
              onChange={this.getFieldsValue.bind(this, 1)} />
          )}
        </Form.Item>
        <Divider style={{ height: 1 }}>
        </Divider>
        <Form.Item>
          <Button type="primary" disabled={this.state.disabled} onClick={this.handleSubmit} className="ant_button_confirm">确定</Button>
          <Button onClick={this.cancel} className="ant_button_cancel">取消</Button>
        </Form.Item>
        <Prompt when message={`QuitAddInfo-${userId}`} />
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }
}

@hot(module)
export default class EntryAdd extends RootComponent<BaseProps, any> {
  staffBaseInfo: KeyValue = SysUtil.getSessionStorage('QuitAdd') || {}

  constructor (props: BaseProps) {
    super(props)
    this.state = {
      staffBaseInfo: {},
      userId: this.props.userId
    }
  }
  componentDidMount () {
    this.getStaffQuitDetail()
  }
  getStaffQuitDetail () {
    const { userId } = this.staffBaseInfo
    this.axios.request(this.api.quitPageInsert, { userId })
      .then(({ data }) => {
        this.setState({
          staffBaseInfo: data
        })
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }
  render () {
    const {
      projectName, projectNumber, sjNumber, userName, organize, entity, roleType, entryTime, userId,
      reasonList = []
    } = this.state.staffBaseInfo
    const CustomForm = Form.create<FormProps>()(FormComponent)
    return (
      <div id="quit-add" style={{ padding: 20 }}>
        <div style={{ marginLeft: 60, marginTop: 21, marginBottom: 30 }}>
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
        <Divider style={{ height: 1, marginLeft: 20 }} />
        <CustomForm {...this.props} userId={userId} entryTime={entryTime} reasonList={reasonList} />
      </div>
    )
  }
}
