/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 工作经历
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicMonthRangePicker } from '@components/index'
import { Form, Input, Icon, Select, Divider, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconPer5, IconAddbtn, IconJbtn } from '@components/icon/BasicIcon'
import moment from 'moment'
import { JudgeUtil, FormatInputValue } from '@utils/index'
import { initData, itemLayoutTwo as itemLayout } from './index'

const keysAry:string[] = ['weId', 'userId', 'startTime', 'endTime', 'workCompany', 'position', 'salaryRe', 'quitCause']
let id = 0

interface CustomWorkProps extends FormComponentProps {
  onChange?:any
  value?: any
}

interface CustomWorkState {
  data: any
}

class CustomWork extends RootComponent<CustomWorkProps, CustomWorkState> {
  constructor (props:CustomWorkProps) {
    super(props)
    this.state = {
      data: { keys: [0] }
    }
  }

  static getDerivedStateFromProps ({ value }:any) {
    if (value) return { data: initData(value, keysAry) }
    return null
  }

  /** 对数值进行验证 */
  transformInputValue = (e:any) => {
    let value = e.target.value
    value = value.substr(0, 11).replace(/[^0-9.]/g, '').replace(/^\./, '').replace(/\.{2,}/g, '.') // 不允许首位出现 .
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只允许 . 出现一次
    value = value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2') // 设置格式为 1.23
    value = value.replace(/^\d+/, (match: string) => { // 整数位只允许输入 8 未，首位 0 不允许出现 2 次以上
      return (parseFloat(match) + '').substr(0, 8)
    })
    return value
  }

  remove = (k:any) => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter((key:any) => key !== k)
    })
  }

  add = () => {
    const form = this.props.form
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(++id)
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  /** 设置id 值 */
  initId = (data:any, k:number) => {
    const { getFieldDecorator } = this.props.form
    getFieldDecorator('weId' + k, { initialValue: data['weId' + k] ? data['weId' + k] : 0 })
    getFieldDecorator('userId' + k, { initialValue: data['userId' + k] ? data['userId' + k] : 0 })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { data } = this.state
    getFieldDecorator('keys', { initialValue: data.keys })
    const keys = getFieldValue('keys')
    return (
      <div>
        <Divider/>
        <Row>
          <Col span={23} className='gutter-row-title'>
            <Icon component={IconPer5}></Icon><span>工作经历</span><span>(非必填)</span>
          </Col>
          <Col span={1} className='gutter-icon-title'>
            <Icon onClick={this.add} component={IconAddbtn}></Icon>
          </Col>
        </Row>
        {keys.map((k:any) => (
          <Row key={k} className="gutter-row-p">
            {this.initId(data, k)}
            <Col span={23} className='gutter-row'>
              <Row type="flex" justify="space-around">
                <Col span={8}>
                  <Form.Item label="工作日期" className="form-item-date form-item-line">
                    {getFieldDecorator('startTime' + k, {
                      initialValue: data['startTime' + k] ? [moment(data['startTime' + k], 'YYYY-MM'), moment(data['endTime' + k], 'YYYY-MM')] : undefined
                    })(
                      <BasicMonthRangePicker/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="工作单位" className="form-item form-item-line">
                    {getFieldDecorator('workCompany' + k, {
                      initialValue: data['workCompany' + k] ? data['workCompany' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                          message: '请输入中文或英文' // '请输入单位名称'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={20} allowClear placeholder="请输入单位名称" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="职位" className="form-item form-item-line">
                    {getFieldDecorator('position' + k, {
                      initialValue: data['position' + k] ? data['position' + k] : undefined,
                      rules: [{ required: false, message: '请选择' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear style={{ width: '0.93rem' }}>
                        <Select.Option key="员工" value="员工">员工</Select.Option>
                        <Select.Option key="组长" value="组长">组长</Select.Option>
                        <Select.Option key="主管" value="主管">主管</Select.Option>
                        <Select.Option key="经理" value="经理">经理</Select.Option>
                        <Select.Option key="总监" value="总监">总监</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="薪资" className="form-item form-item-line">
                    {getFieldDecorator('salaryRe' + k, {
                      initialValue: data['salaryRe' + k] ? data['salaryRe' + k] : undefined,
                      getValueFromEvent: this.transformInputValue
                    })(
                      <Input type="text" maxLength={11} allowClear placeholder="请输入薪资" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item labelCol={{
                    span: 3
                  }} wrapperCol={{
                    span: 21
                  }} label="离职原因" className="form-item-textare">
                    {getFieldDecorator('quitCause' + k, {
                      initialValue: data['quitCause' + k] ? data['quitCause' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                          message: '请输入中文或英文'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input.TextArea maxLength={50} placeholder="最多可输入50字" style={{ width: '4.2rem' }} autoSize={{ minRows: 3, maxRows: 6 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            {keys.length >= 2 ? (
              <Col span={1} className="gutter-icon">
                <Icon onClick={() => this.remove(k)} component={IconJbtn}></Icon>
              </Col>
            ) : null}
          </Row>
        ))}
      </div>
    )
  }
}

const changData = (allValues:any) => {
  let data:Array<any> = []
  let keys = allValues.keys // 获取记录的主键
  keys.forEach((num:number) => {
    let obj:any = {}
    let index = 0
    keysAry.forEach((key:string) => {
      // 获取实际的值
      let value:any = allValues[key + num]
      if (value && key === 'startTime') {
        index++
        obj[key] = value[0]
        obj['endTime'] = value[1]
      } else if (!JudgeUtil.isEmpty(value) || value === 0) {
        index++
        obj[key] = value
      }
    })
    if (index >= 3) data.push(obj)
  })
  delete allValues.keys // 删除主键
  return data
}

export default Form.create<CustomWorkProps>({
  // 任一表单域的值发生改变时的回调
  onValuesChange: ({ onChange }:any, changedValues, allValues) => {
    if (onChange) onChange(changData(allValues))
  }
})(CustomWork)
