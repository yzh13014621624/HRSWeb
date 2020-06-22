/*
 * @description: 个人参保维护表格筛选条件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-20 10:08:43
 * @LastEditTime: 2020-05-27 10:47:14
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from 'rootComponent'
import SharedStructure from '@shared/structure/SharedStructure'
import moment from 'moment'
import { Form, Input, Select, Button, DatePicker, Row, Col, Icon } from 'antd'

import './style/MaintainTableFilter'

import { FormComponentProps } from 'antd/lib/form'
import {
  BaseProps,
  KeyValue
} from 'typings/global'

interface SearchParams {
  selectValue: string
  filterNumberType: string
  userName: string
  organizeArr: string[]
  organize: string[]
  entryTime: moment.Moment[]
  leaveTime: moment.Moment[]
  projectNumber?: string
  sjNumber?: string
}
interface TableFilterProps extends BaseProps, FormComponentProps {
  searchParams: SearchParams
}
interface TableFilterState {
  isPassProductId: boolean
  isPassUserName: boolean
  selectValue: string
}

class TableFilterComponent extends RootComponent<TableFilterProps, TableFilterState> {
  timerId: any = null
  tipsTimerId: any = null
  showTips: boolean = true

  constructor (props: TableFilterProps) {
    super(props)
    const { selectValue } = this.props.searchParams
    this.state = {
      selectValue: selectValue || '',
      isPassProductId: true,
      isPassUserName: true
    }
  }

  getSelectValue = (e: any) => {
    setTimeout(() => {
      const { isPassProductId, isPassUserName } = this.state
      if (!(isPassProductId && isPassUserName)) return
      const { form, getFilterData, searchParams: { organize } } = this.props
      const data = form.getFieldsValue()
      data.organize = data.organize || organize
      getFilterData(data as SearchParams)
      this.setState({
        selectValue: e
      })
    }, 50)
  }

  validateFields = (rule: KeyValue, value: string, callback: Function) => {
    const { fullField } = rule
    let tips = ''
    if (fullField === 'filterNumberType') {
      const reg = /^[a-zA-Z0-9]+$/g
      if (value.trim() && !reg.test(value)) {
        this.setState({
          isPassProductId: false
        })
        tips = '工号为字母或数字'
      } else {
        this.setState({
          isPassProductId: true
        })
      }
    } else if (fullField === 'userName') {
      const reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){0,15}$/g
      if (value.trim() && !reg.test(value)) {
        this.setState({
          isPassUserName: false
        })
        tips = '姓名为中英文最多可输入15字'
      } else {
        this.setState({
          isPassUserName: true
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
        if (key === 'filterNumberType') {
          this.setState({
            isPassProductId: true
          })
        } else if (key === 'userName') {
          this.setState({
            isPassUserName: true
          })
        }
      }
    }, 0)
  }

  submit = (e: any) => {
    const { isPassProductId, isPassUserName } = this.state
    if (!(isPassProductId && isPassUserName)) return
    e.preventDefault()
    const { form, getFilterData, searchParams: { organize } } = this.props
    const data = form.getFieldsValue()
    data.selectValue = this.state.selectValue
    data.organize = data.organize || organize
    getFilterData(data as SearchParams)
  }

  render () {
    const { filterNumberType, userName, organizeArr, projectNumber, sjNumber, leaveTime, entryTime } = this.props.searchParams
    const { selectValue } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <div id="maintain_table_filter_container">
        <Form layout="inline" onSubmit={this.submit}>
          <Form.Item className="select">
            {
              getFieldDecorator('selectValue', {
                initialValue: selectValue
              })(
                <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getSelectValue}>
                  <Select.Option value="管理编号">管理编号</Select.Option>
                  <Select.Option value="工号">工号</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('filterNumberType', {
                initialValue: filterNumberType || projectNumber || sjNumber,
                validateTrigger: 'onBlur',
                rules: [{
                  validator: (rule: KeyValue, value: string, callback: Function) => {
                    this.validateFields(rule, value, callback)
                  }
                }]
              })(
                <Input
                  allowClear
                  placeholder={`请输入${selectValue || '管理编号'}`}
                  onChange={() => this.clearFieldValue('filterNumberType')}
                  className={`${this.state.isPassProductId ? null : 'error_border'} input-160`} />
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('userName', {
                initialValue: userName,
                validateTrigger: 'onBlur',
                rules: [{
                  validator: (rule: KeyValue, value: string, callback: Function) => {
                    this.validateFields(rule, value, callback)
                  }
                }]
              })(
                <Input
                  allowClear
                  placeholder="请输入姓名"
                  onChange={() => this.clearFieldValue('userName')}
                  className={`${this.state.isPassUserName ? null : 'error_border'} input-160`} />
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('organize', {
                initialValue: organizeArr
              })(
                <SharedStructure type="string" multiple width="0.83rem" />
              )
            }
          </Form.Item>
          <Form.Item label="入职日期" className="date">
            {
              getFieldDecorator('entryTime', {
                initialValue: entryTime
              })(
                <DatePicker.RangePicker placeholder={['请选择日期', '请选择日期']} />
              )
            }
          </Form.Item>
          <Form.Item label="离职日期" className="date">
            {
              getFieldDecorator('leaveTime', {
                initialValue: leaveTime
              })(
                <DatePicker.RangePicker placeholder={['请选择日期', '请选择日期']} />
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
