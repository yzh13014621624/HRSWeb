/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 证书
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Icon, DatePicker, Divider, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { date, ind5, IconPer6, IconAddbtn, IconJbtn } from '@components/icon/BasicIcon'
import moment from 'moment'

import { JudgeUtil, FormatInputValue } from '@utils/index'
import { Upload, initData, itemLayoutTwo as itemLayout } from './index'

const { RangePicker } = DatePicker
let id = 0
const keysAry:string[] = ['certificateId', 'userId', 'certificateName', 'effectTime', 'invalidTime', 'certificateImage', 'certificateImageUrl']

interface CustomeCertificateProps extends FormComponentProps {
  onChange?:any
  value?: any
}

interface CustomeCertificateState {
  data: any
}

class CustomeCertificate extends RootComponent<CustomeCertificateProps, CustomeCertificateState> {
  constructor (props:CustomeCertificateProps) {
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

  initTime = (effectTime:any, invalidTime:any) => {
    if (effectTime) {
      return [moment(effectTime, 'YYYY-MM-DD'), moment(invalidTime, 'YYYY-MM-DD')]
    } else {
      return undefined
    }
  }

  initId = (data:any, k:number) => {
    const { getFieldDecorator } = this.props.form
    getFieldDecorator('certificateId' + k, { initialValue: data['certificateId' + k] ? data['certificateId' + k] : 0 })
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
            <Icon component={IconPer6}/><span>证书</span><span>(非必填)</span>
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
                <Col span={6}>
                  <Form.Item {...itemLayout} label="证书名称" className="form-item form-item-line">
                    {getFieldDecorator('certificateName' + k, {
                      initialValue: data['certificateName' + k],
                      rules: [
                        {
                          required: false,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                          message: '请输入中文或英文'
                        }
                      ],
                      getValueFromEvent: (e:any) => FormatInputValue.removeEmpty(e.target.value)
                    })(
                      <Input type="text" maxLength={20} allowClear placeholder="请输入证书名称" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...itemLayout} label="有效日期" className="form-item-data form-item-line">
                    {getFieldDecorator('effectTime' + k, {
                      initialValue: this.initTime(data['effectTime' + k], data['invalidTime' + k])
                    })(
                      <RangePicker
                        suffixIcon={<img src={date}/>}
                        placeholder={['请选择日期', '请选择日期']}
                        format="YYYY-MM-DD"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6} offset={2}>
                  <Form.Item {...itemLayout} className="form-item-inline">
                    {getFieldDecorator('certificateImage' + k, {
                      initialValue: data['certificateImage' + k]
                    })(
                      <Upload backgroundImage={ind5} bgImageStyle={{ width: 140, height: 80 }}
                        images={data['certificateImage' + k] ? data['certificateImageUrl' + k] : undefined}
                        width={180} height={125} placeholder='证书照片' backgroundColor='white' />
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
      if (value && key === 'effectTime') {
        index++
        obj[key] = value[0].format('YYYY-MM-DD')
        obj['invalidTime'] = value[1].format('YYYY-MM-DD')
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

export default Form.create<CustomeCertificateProps>({
  // 任一表单域的值发生改变时的回调 返回所有的改变的值
  onValuesChange: ({ onChange }:any, changedValues, allValues) => {
    if (onChange) onChange(changData(allValues))
  }
})(CustomeCertificate)
