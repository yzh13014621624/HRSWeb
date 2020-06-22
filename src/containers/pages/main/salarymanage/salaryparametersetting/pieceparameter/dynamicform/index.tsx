/*
 * @description: 参数维护---动态增加表单组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 14:15:15
 * @LastEditTime : 2019-12-18 14:51:20
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent } from '@components/index'
import { Button, Form, Row, Input, Col } from 'antd'
import { BaseProps } from 'typings/global'
import addimg from '@assets/images/icon/add.png'
import reduceimg from '@assets/images/icon/reduce.png'
import './index.styl'

const { Item } = Form

interface FormProps extends BaseProps, FormComponentProps{
  title?: string // 标题
  information?: any // 数据源
  informations: any // 存储删除数据后的数据用于替换数据
}

class DynamicForm extends RootComponent<FormProps, any> {
  id: number
  constructor (props: FormProps) {
    super(props)
    this.id = 100
    this.state = {
      informations: []
    }
  }

  // 删除一条表单
  remove = (k:any, i: number) => {
    const { form, information } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    if (information.length !== 0) {
      information[0].splice(i, 1)
      information[1].splice(i, 1)
      information[2].splice(i, 1)
    }
    form.setFieldsValue({
      keys: keys.filter((key: any) => key !== k)
    })
    this.setState({ informations: information })
    this.changeBtnStatus()
  }

  // 添加一条表单
  add = () => {
    const { form, information } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.id++)
    form.setFieldsValue({
      keys: nextKeys
    })
    this.props.changeBtnStatus(false)
    information.length > 0 && this.props.changeBtnStatus(true)
  }

  // 确定按钮是否可以点击
  changeBtnStatus = () => {
    const { form, information } = this.props
    const keys = form.getFieldValue('keys')
    setTimeout(() => {
      let { reqppMin, reqppMax, reqppPrice } = this.props.form.getFieldsValue()
      reqppMin = reqppMin ? this.removeEmptyArrayEle(reqppMin) : reqppMin = ['0']
      reqppMax = this.removeEmptyArrayEle(reqppMax)
      reqppPrice = this.removeEmptyArrayEle(reqppPrice)
      let flag: boolean = true
      if (keys.length === 1) {
        flag = !!(reqppMin.length > 0 && reqppMax.length > 0 && reqppPrice.length > 0 && keys.length === reqppMin.length && keys.length === reqppMax.length && keys.length === reqppPrice.length)
      } else {
        flag = !!(reqppMin.length > 0 && reqppMax.length > 0 && reqppPrice.length > 0 && keys.length - 1 === reqppMin.length && keys.length === reqppMax.length && keys.length === reqppPrice.length)
      }
      // let flag = !(reqppMin.length > 0 && reqppMax.length > 0 && reqppPrice.length > 0 && keys.length === reqppMax.length && keys.length === reqppPrice.length)
      // console.log(reqppMin, reqppMax, reqppPrice, keys)
      // console.log(flag)
      this.props.changeBtnStatus(flag)
      information.length > 0 && this.props.changeBtnStatus(!flag)
    }, 0)
  }

  // 去除数组中的undefined和empty
  removeEmptyArrayEle = (arr: any) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === undefined || arr[i] === '') {
        arr.splice(i, 1)
        i = i - 1
      }
    }
    return arr
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    let { title, information } = this.props
    let { informations } = this.state
    informations.length > 0 && (information = informations)
    const defaultArr = ['999999999']
    getFieldDecorator('keys', { initialValue: information[2] && information[2].length > 0 ? information[2].map((i: any, index: number) => index) : [0] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k:any, index: number) => (
      <Row className='linefrom' key={index}>
        {
          index === 0
            ? <Col span={1} offset={4}>0</Col>
            : <Col span={5}>
              <Item>
                {getFieldDecorator(`reqppMin[${k}]`, {
                  initialValue: information[0] && information[0].length > 0 && information[0][index],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return e.target.value.replace(/[^\d]/g, '')
                  }
                })(<Input onChange={this.changeBtnStatus} allowClear/>)}
              </Item>
            </Col>
        }
        <Col span={4}>&lt;=数量&lt;</Col>
        <Col span={5}>
          <Item>
            {getFieldDecorator(`reqppMax[${k}]`, {
              initialValue: (information[1] && information[1].length > 0 && information[1][index]) || defaultArr[index],
              getValueFromEvent: (e: any) => {
                e.persist()
                return e.target.value.replace(/[^\d]/g, '')
              }
            })(<Input onChange={this.changeBtnStatus} allowClear maxLength={9}/>)}
          </Item>
        </Col>
        <Col span={2}>单价</Col>
        <Col span={5}>
          <Item>
            {getFieldDecorator(`reqppPrice[${k}]`, {
              initialValue: information[2] && information[2].length > 0 && information[2][index],
              getValueFromEvent: (e: any) => {
                e.persist()
                return e.target.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\\-)*(\d+)\.(\d{0,3}).*$/, '$1$2.$3').replace(/^\./g, '')
              }
            })(<Input onChange={this.changeBtnStatus} allowClear maxLength={9} />)}
          </Item>
        </Col>
        <Col span={1}>元</Col>
        <Col span={1}>
          {index >= 1 ? (
            <img src={reduceimg} onClick={() => this.remove(k, index)} className='addorreduceimg' />
          ) : null}
        </Col>
      </Row>
    ))
    return (
      <div className='dynamicform'>
        <Form>
          <Row className='groupcard'>
            <Col className='w-480'>
              <p className='title'><span>*</span><span>{title}</span></p>
              {formItems}
              <p className='addBtn'><Button className='add' onClick={this.add}><img src={addimg} className='addorreduceimg' />添加</Button></p>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create<FormProps>()(DynamicForm)
