/*
 * @description: Table 表格过滤条件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-11 09:26:20
 * @LastEditTime: 2020-05-27 11:39:38
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from 'rootComponent'
// import SharedStructure from '@shared/structure/SharedStructure'
import { Form, Input, Select, Button, Row, Col, Icon } from 'antd'

import './style/TableFilter'

import { FormComponentProps } from 'antd/lib/form'
import {
  BaseProps,
  KeyValue
} from 'typings/global'

interface SearchParams {
  selectValue: string
  filterNumberType: string
  userName: string
  projectName: string
  legalEntity: string
  projectNumber?: string
  sjNumber?: string
  entity?: string
}
interface TableFilterProps extends BaseProps, FormComponentProps {
  searchParams: SearchParams
}
interface TableFilterState {
  isPassProductId: boolean
  isPassUserName: boolean
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
      isPassProductId: true,
      isPassUserName: true,
      isPassProjectName: true,
      isPassLegalEntity: true
    }
  }

  getSelectValue = () => {
    setTimeout(() => {
      const { isPassProductId, isPassUserName, isPassProjectName, isPassLegalEntity } = this.state
      if (!(isPassProductId && isPassUserName && isPassProjectName && isPassLegalEntity)) return
      const { form, getFilterData } = this.props
      const data = form.getFieldsValue()
      getFilterData(data as SearchParams)
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
    } else {
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
        } else if (key === 'projectName') {
          this.setState({
            isPassProjectName: true
          })
        } else {
          this.setState({
            isPassLegalEntity: true
          })
        }
      }
    }, 0)
  }

  submit = (e: any) => {
    const { isPassProductId, isPassUserName, isPassProjectName, isPassLegalEntity } = this.state
    if (!(isPassProductId && isPassUserName && isPassProjectName && isPassLegalEntity)) return
    e.preventDefault()
    const { form, getFilterData } = this.props
    const data = form.getFieldsValue()
    getFilterData(data as SearchParams)
  }

  render () {
    const { selectValue, filterNumberType, userName, projectName, legalEntity, sjNumber, projectNumber, entity } = this.props.searchParams
    const { getFieldDecorator } = this.props.form
    return (
      <div id="table_filter_container">
        <Form layout="inline" onSubmit={this.submit}>
          <Form.Item>
            {
              getFieldDecorator('selectValue', {
                initialValue: typeof selectValue === 'string' ? selectValue : projectNumber ? '工号' : '管理编号'
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
                initialValue: filterNumberType || sjNumber || projectNumber,
                validateTrigger: 'onBlur',
                rules: [{
                  validator: (rule: KeyValue, value: string, callback: Function) => {
                    this.validateFields(rule, value, callback)
                  }
                }]
              })(
                <Input
                  allowClear
                  placeholder={`请输入${typeof selectValue === 'string' ? selectValue : projectNumber ? '工号' : '管理编号'}`}
                  onChange={() => this.clearFieldValue('sjNumber')}
                  className={`${this.state.isPassProductId ? null : 'error_border'}`} />
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
                  className={`${this.state.isPassUserName ? null : 'error_border'}`} />
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
                initialValue: legalEntity || entity,
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
          {/* <Form.Item>
            {
              getFieldDecorator('organize', {
                initialValue: ''
              })(
                <SharedStructure />
              )
            }
          </Form.Item> */}
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
