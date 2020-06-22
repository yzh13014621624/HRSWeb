/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 家庭成员
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Icon, Select, Divider, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconPer3, IconAddbtn, IconJbtn } from '@components/icon/BasicIcon'
import { JudgeUtil, FormatInputValue } from '@utils/index'
import { initData, itemLayoutTwo as itemLayout } from './index'

const keysAry:string[] = ['familyId', 'userId', 'appellation', 'memberName', 'age', 'contactWay', 'position']
let id = 0

interface CustomeFamilyProps extends FormComponentProps {
  onChange?:any
  value?: any
}

interface CustomeFamilyState {
  data: any
}

class CustomeFamily extends RootComponent<CustomeFamilyProps, CustomeFamilyState> {
  constructor (props:CustomeFamilyProps) {
    super(props)
    this.state = {
      data: { keys: [0] }
    }
  }

  static getDerivedStateFromProps ({ value }:any) {
    if (value) return { data: initData(value, keysAry) }
    return null
  }

  /* 移除 */
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

  /* 新增 */
  add = () => {
    const form = this.props.form
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(++id)
    form.setFieldsValue({
      keys: nextKeys
    })
  }
  /** 电话验证 */
  validatePhone = (rule:any, value:any, callback:any) => {
    let regone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
    let regTwo = /^1(3|4|5|6|7|8)\d{9,10}$/
    let msg = ''
    if (regone.test(value) || regTwo.test(value)) {
      callback()
    } else {
      msg = '请输入正确的号码'
      callback(msg)
    }
  }

  /** 设置id 值 */
  initId = (data:any, k:number) => {
    const { getFieldDecorator } = this.props.form
    getFieldDecorator('familyId' + k, { initialValue: data['familyId' + k] ? data['familyId' + k] : 0 })
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
            <Icon component={IconPer3}></Icon><span>家庭成员</span>
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
                <Col span={4}>
                  <Form.Item {...itemLayout} label="称谓" className="form-item">
                    {getFieldDecorator('appellation' + k, {
                      initialValue: data['appellation' + k] ? data['appellation' + k] : undefined
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear style={{ width: '0.93rem' }}>
                        <Select.Option key="父亲" value="父亲">父亲</Select.Option>
                        <Select.Option key="母亲" value="母亲">母亲</Select.Option>
                        <Select.Option key="儿子" value="儿子">儿子</Select.Option>
                        <Select.Option key="女儿" value="女儿">女儿</Select.Option>
                        <Select.Option key="哥哥" value="哥哥">哥哥</Select.Option>
                        <Select.Option key="姐姐" value="姐姐">姐姐</Select.Option>
                        <Select.Option key="弟弟" value="弟弟">弟弟</Select.Option>
                        <Select.Option key="妹妹" value="妹妹">妹妹</Select.Option>
                        <Select.Option key="其他" value="其他">其他</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="姓名" className="form-item">
                    {getFieldDecorator('memberName' + k, {
                      initialValue: data['memberName' + k] ? data['memberName' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                          message: '请输入中文或英文' // '请输入姓名'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={15} allowClear placeholder="请输入姓名" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="年龄" className="form-item">
                    {getFieldDecorator('age' + k, {
                      initialValue: data['age' + k] ? data['age' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          pattern: /^[0-9]+$/,
                          message: '请输入数字'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={2} allowClear placeholder="请输入年龄" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="联系方式" className="form-item">
                    {getFieldDecorator('contactWay' + k, {
                      initialValue: data['contactWay' + k] ? data['contactWay' + k] : undefined,
                      rules: [
                        {
                          required: false,
                          validator: this.validatePhone
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={12} allowClear placeholder="请输入手机号或电话" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...itemLayout} label="职位" className="form-item">
                    {getFieldDecorator('position' + k, {
                      initialValue: data['position' + k] ? data['position' + k] : undefined
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '0.93rem' }} allowClear>
                        <Select.Option key="员工" value="员工">员工</Select.Option>
                        <Select.Option key="组长" value="组长">组长</Select.Option>
                        <Select.Option key="主管" value="主管">主管</Select.Option>
                        <Select.Option key="经理" value="经理">经理</Select.Option>
                        <Select.Option key="总监" value="总监">总监</Select.Option>
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
      if (!JudgeUtil.isEmpty(value) || value === 0) {
        index++
        obj[key] = value
      }
    })
    if (index >= 3) data.push(obj)
  })
  delete allValues.keys // 删除主键
  return data
}

export default Form.create<CustomeFamilyProps>({
  onValuesChange: ({ onChange }:any, changedValues, allValues) => {
    if (onChange) onChange(changData(allValues))
  }
})(CustomeFamily)
