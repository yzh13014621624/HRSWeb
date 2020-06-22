/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 教育背景
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Icon, DatePicker, Select, Row, Col, Divider } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import moment from 'moment'
import { JudgeUtil, FormatInputValue } from '@utils/index'
import { date, IconPer4, IconAddbtn, IconJbtn } from '@components/icon/BasicIcon'
import { initData, itemLayoutTwo as itemLayout } from './index'

let id = 0
const keysAry:string[] = ['educationId', 'userId', 'graduateTime', 'school', 'major', 'education']

interface CustomeEducatoryProps extends FormComponentProps {
  onChange?:any
  value?: any
}

interface CustomeEducatoryState {
  data: any
}

class CustomeEducatory extends RootComponent<CustomeEducatoryProps, CustomeEducatoryState> {
  constructor (props:CustomeEducatoryProps) {
    super(props)
    this.state = {
      data: { keys: [0] }
    }
  }
  static getDerivedStateFromProps ({ value }:any) {
    if (value) return { data: initData(value, keysAry) }
    return null
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
    getFieldDecorator('educationId' + k, { initialValue: data['educationId' + k] ? data['educationId' + k] : 0 })
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
            <Icon component={IconPer4}></Icon><span>教育背景</span>
          </Col>
          <Col span={1} className='gutter-icon-title'>
            <Icon onClick={this.add} component={IconAddbtn}></Icon>
          </Col>
        </Row>
        {keys.map((k:any) => (
          <Row key={k} className="gutter-row-p">
            {this.initId(data, k)}
            <Col span={23} className='gutter-row'>
              <Row type="flex" justify="start">
                <Col span={5}>
                  <Form.Item {...itemLayout} label="毕业时间" className="form-item">
                    {getFieldDecorator('graduateTime' + k, {
                      initialValue: data['graduateTime' + k] ? moment(data['graduateTime' + k]) : undefined
                    })(
                      <DatePicker.MonthPicker allowClear placeholder="请选择日期" suffixIcon={(<img src={date}/>)}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item {...itemLayout} label="学校" className="form-item">
                    {getFieldDecorator('school' + k, {
                      initialValue: data['school' + k] ? data['school' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                          message: '请输入中文或英文'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={20} allowClear placeholder="请输入学校" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item {...itemLayout} label="专业" className="form-item">
                    {getFieldDecorator('major' + k, {
                      initialValue: data['major' + k] ? data['major' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                          message: '请输入中文或英文' // ' 请输入专业'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={20} allowClear placeholder="请输入专业" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item {...itemLayout} label="学历" className="form-item">
                    {getFieldDecorator('education' + k, {
                      initialValue: data['education' + k] ? data['education' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          message: '请选择'
                        }
                      ]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '0.93rem' }} allowClear>
                        <Select.Option key="初中及以下" value="初中及以下">初中及以下</Select.Option>
                        <Select.Option key="高中" value="高中">高中</Select.Option>
                        <Select.Option key="大专" value="大专">大专</Select.Option>
                        <Select.Option key="本科" value="本科">本科</Select.Option>
                        <Select.Option key="硕士" value="硕士">硕士</Select.Option>
                        <Select.Option key="博士" value="博士">博士</Select.Option>
                      </Select>
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
      if (value && key === 'graduateTime') {
        index++
        obj[key] = value.format('YYYY-MM')
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

export default Form.create<CustomeEducatoryProps>({
  // 任一表单域的值发生改变时的回调 返回所有的改变的值
  onValuesChange: ({ onChange }:any, changedValues, allValues) => {
    if (onChange) onChange(changData(allValues))
  }
})(CustomeEducatory)
