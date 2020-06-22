/*
 * @description: Tab表单
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-26 14:05:58
 * @LastEditTime: 2020-06-01 14:49:16
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { IconFill, date } from '@components/icon/BasicIcon'
import { RootComponent, TableItem } from '@components/index'
import { BaseProps } from 'typings/global'
import { Button, Form, Row, DatePicker, Select, Input, Modal, Col } from 'antd'

const Option = Select.Option
const { MonthPicker } = DatePicker

interface HistoryFormProps extends BaseProps, FormComponentProps {
  onSearchChange:Function
  type:any
}

class HistoryForm extends RootComponent<HistoryFormProps, any> {
  constructor (props:HistoryFormProps) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      placeholderText: '' || '管理编号',
      numberRequired: true,
      nameRequired: true
    }
  }

  placeholderChange = (val:string) => {
    this.setState({
      placeholderText: val
    })
  }

  onSumbitEvent = (e:any) => {
    e.preventDefault()
    const { state: { placeholderText }, props: { type, form: { getFieldsValue, validateFieldsAndScroll } } } = this
    const { number, name } = getFieldsValue()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { to, from, name, number } = values
        let dataParmas:any = {
          name,
          to: to.format('YYYY-MM'),
          from: from.format('YYYY-MM'),
          number,
          type
        }
        if (placeholderText === '管理编号') {
          dataParmas['numberType'] = 1
        } else {
          dataParmas['numberType'] = 2
        }
        this.props.onSearchChange(dataParmas)
        // this.axios.request(this.api.HistroyList, dataParmas).then(({ data }) => {
        //   console.log(data)
        // }).catch((err:any) => {
        //   this.error(err.msg[0])
        // })
      }
    })
  }

  disabledStartDate = (startValue :any) => { // 开始日期禁用
    const { endValue } = this.state
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  disabledEndDate = (endValue:any) => { // 结束日期禁用
    const { startValue } = this.state
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() < startValue.valueOf()
  }

  onChange = (field:any, value:any) => {
    this.setState({
      [field]: value
    })
  }

  onStartChange = (value:any) => {
    this.onChange('startValue', value)
  }

  onEndChange = (value:any) => {
    this.onChange('endValue', value)
  }

  handleStartOpenChange = (open:any) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }
  handleEndOpenChange = (open:any) => {
    this.setState({ endOpen: open })
  }
  inputChange = (type: number) => {
    setTimeout(() => {
      const { number, name }: any = this.props.form.getFieldsValue()
      let str = ''
      if (!type && number) {
        str = 'nameRequired'
        if (!name) this.props.form.resetFields(['name'])
      } else if (name) {
        str = 'numberRequired'
        if (!number) this.props.form.resetFields(['number'])
      } else {
        this.setState({
          nameRequired: true,
          numberRequired: true
        })
      }
      this.setState({
        [str]: false
      })
    }, 0)
  }

  render () {
    const { startValue, endValue, endOpen, placeholderText, nameRequired, numberRequired } = this.state
    const { form: { getFieldDecorator } } = this.props
    return (
      <Form layout='inline' onSubmit={(e) => this.onSumbitEvent(e)} className='form-box-set'>
        <Form.Item label='查询时间' className='set-start'>
          {getFieldDecorator('from', {
            rules: [{ required: true, message: '请选择开始日期' }]
          })(
            <MonthPicker
              format="YYYY-MM"
              placeholder="开始时间"
              disabledDate={this.disabledStartDate}
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
              suffixIcon={(<img src={date}/>)}
              className='input-150'
            />
          )}
        </Form.Item>
        <span style={{ textAlign: 'center', margin: '0.05rem 0.04rem 0', display: 'inline-block' }}>
          至
        </span>
        <Form.Item>
          {getFieldDecorator('to', {
            rules: [{ required: true, message: '请选择结束日期' }]
          })(
            <MonthPicker
              format="YYYY-MM"
              placeholder="结束时间"
              open={endOpen}
              disabledDate={this.disabledEndDate}
              onChange={this.onEndChange}
              onOpenChange={this.handleEndOpenChange}
              suffixIcon={(<img src={date}/>)}
              className='input-150'
            />
          )}
        </Form.Item>
        <Form.Item className='set-number'>
          <Select defaultValue="管理编号" onChange={this.placeholderChange} className='input-120'>
            <Option value="工号">工号</Option>
            <Option value="管理编号">管理编号</Option>
          </Select>
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('number', {
            initialValue: '',
            rules: [{
              required: numberRequired,
              pattern: new RegExp(/^([a-zA-Z_]|[0-9]){1,14}$/, 'g'),
              message: '请输入字母或数字 长度在14位之内'
            }]
          })(
            <Input placeholder={`请输入${placeholderText}`} allowClear className='input-150' maxLength={14} onChange={() => this.inputChange(0)}/>
          )}
        </Form.Item>
        <Form.Item className='set-number-10'>
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [{
              required: nameRequired,
              pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z_]){1,15}$/, 'g'),
              message: '请输入中文或英文 长度在15位之内'
            }]
          })(
            <Input placeholder="请输入姓名" allowClear className='input-150' maxLength={15} onChange={() => this.inputChange(1)}/>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" className='btn-style' htmlType="submit" >搜索</Button>
        </Form.Item>
      </Form>
    )
  }
}

const HistorySalaryForm = Form.create<HistoryFormProps>()(HistoryForm)
export default HistorySalaryForm
