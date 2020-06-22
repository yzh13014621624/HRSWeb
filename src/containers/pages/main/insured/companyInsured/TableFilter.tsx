/*
 * @description: 参保管理 - 公司维护 过滤筛选组件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-24 09:09:39
 * @LastEditTime: 2019-05-08 14:17:54
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from 'rootComponent'
import { Form, Input, Button, DatePicker } from 'antd'

import moment from 'moment'

import './style/TableFilter'

import { FormComponentProps } from 'antd/lib/form'
import {
  BaseProps,
  KeyValue
} from 'typings/global'

interface SearchParams {
  createTime: moment.Moment[]
  projectName: string
  legalEntity: string
}
interface TableFilterProps extends BaseProps, FormComponentProps {
  searchParams: SearchParams
}
interface TableFilterState {
  isPassProjectName: boolean
  isPassLegalEntity: boolean
}

class TableFilterComponent extends RootComponent<TableFilterProps, TableFilterState> {
  timerId: any = null
  tipsTimerId: any = null
  showTips: boolean = true

  constructor (props: TableFilterProps) {
    super(props)
    this.state = {
      isPassProjectName: true,
      isPassLegalEntity: true
    }
  }

  getSelectValue = () => {
    setTimeout(() => {
      const { isPassProjectName, isPassLegalEntity } = this.state
      if (!(isPassProjectName && isPassLegalEntity)) return
      const { form, getFilterData } = this.props
      const data = form.getFieldsValue()
      getFilterData(data as SearchParams)
    }, 50)
  }

  validateFields = (rule: KeyValue, value: string, callback: Function) => {
    const { fullField } = rule
    let tips = ''
    const reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){0,30}$/g
    if (value.trim() && !reg.test(value)) {
      if (fullField === 'projectName') {
        this.setState({
          isPassProjectName: false
        })
        tips = '项目名称最多可输入30字符'
      } else {
        this.setState({
          isPassLegalEntity: false
        })
        tips = '法人主体名称最多可输入30字符'
      }
    } else {
      if (fullField === 'projectName') {
        this.setState({
          isPassProjectName: true
        })
      } else {
        this.setState({
          isPassLegalEntity: true
        })
      }
    }
    if (tips && this.showTips) {
      this.$message.error(tips, 2)
      this.showTips = false
      this.tipsTimerId = setTimeout(() => {
        this.showTips = true
      }, 2000)
    }
    callback()
  }

  // 修正点击 input 清空按钮时候表单框不变色问题
  clearFieldValue = (key: string) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      const { getFieldValue } = this.props.form
      const val = getFieldValue(key)
      if (!val.trim()) {
        if (key === 'projectName') {
          this.setState({
            isPassProjectName: true
          })
        } else if (key === 'legalEntity') {
          this.setState({
            isPassLegalEntity: true
          })
        }
      }
    }, 0)
  }

  submit = (e: any) => {
    const { isPassProjectName, isPassLegalEntity } = this.state
    if (!(isPassProjectName && isPassLegalEntity)) return
    e.preventDefault()
    const { form, getFilterData } = this.props
    const data = form.getFieldsValue()
    getFilterData(data as SearchParams)
  }

  render () {
    const { createTime, projectName, legalEntity } = this.props.searchParams
    const { getFieldDecorator } = this.props.form
    return (
      <div id="company_pay_table_filter_container">
        <Form layout="inline" onSubmit={this.submit}>
          <Form.Item label="创建时间">
            {
              getFieldDecorator('createTime', {
                initialValue: createTime
              })(
                <DatePicker.RangePicker placeholder={['请选择日期', '请选择日期']} />
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('projectName', {
                initialValue: projectName,
                validateTrigger: 'onBlur',
                rules: [{
                  validator: (rule: KeyValue, value: string, callback: Function) => {
                    this.validateFields(rule, value, callback)
                  }
                }]
              })(
                <Input
                  allowClear
                  placeholder="请输入项目名称"
                  onChange={() => this.clearFieldValue('projectName')}
                  className={`${this.state.isPassProjectName ? null : 'error_border'}`} />
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('legalEntity', {
                initialValue: legalEntity,
                validateTrigger: 'onBlur',
                rules: [{
                  validator: (rule: KeyValue, value: string, callback: Function) => {
                    this.validateFields(rule, value, callback)
                  }
                }]
              })(
                <Input
                  allowClear
                  placeholder="请输入法人主体"
                  onChange={() => this.clearFieldValue('legalEntity')}
                  className={`${this.state.isPassLegalEntity ? null : 'error_border'}`} />
              )
            }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
    clearTimeout(this.tipsTimerId)
  }
}

export default Form.create<TableFilterProps>()(TableFilterComponent)
