/*
 * @description: 不参与考勤人员设置搜索表单
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-04-29 12:58:28
 * @LastEditTime: 2020-04-29 17:51:53
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent, TableItem, BasicModal, BasicDowload, FileUpload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconSc, IconDc, IconDr, IconXz, IconTj, IconZaizhi, IconDairuzhi, IconLizhi, IconFill } from '@components/icon/BasicIcon'
import SharedStructure from '@shared/structure/SharedStructure'
import { FormProps } from 'typings/global'
import moment from 'moment'
import './index.styl'

const { Option } = Select
const { Item } = Form
const { MonthPicker } = DatePicker

interface SearchFormProps extends FormProps {
  searchData: Function
}
interface SearchFormState {
  projectType: string
}

class SearchForm extends RootComponent<SearchFormProps, SearchFormState> {
  constructor (props: SearchFormProps) {
    super(props)
    this.state = {
      projectType: '管理编号'
    }
  }

  // 切换工号
  handleToggleProject = (val: string) => {
    this.setState({
      projectType: val
    })
  }

  // 搜索新增排版-选择列表
  handleSearchChooseList = (e: any) => {
    e.preventDefault()
    const { form: { getFieldsValue }, searchData }:any = this.props
    const chChooseListSearchParams = getFieldsValue()
    // chChooseListSearchParams.yearMonth = moment(chChooseListSearchParams.monthDate).format('YYYYMM')
    searchData(chChooseListSearchParams)
  }

  validateJobNumber = (rules: any, value: any, callback: any) => {
    const reg = /^[a-zA-Z0-9]+$/
    if (value && !reg.test(value)) {
      callback(new Error('工号输入需为字母/数字'))
    }
    callback()
  }

  validateName = (rules: any, value: any, callback: any) => {
    const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
    if (value && !reg.test(value)) {
      callback(new Error('姓名需为中英文'))
    }
    callback()
  }

  render () {
    const {
      props: { form: { getFieldDecorator } },
      state: { projectType },
      api: { ApiExportScheduleChooseList }
    } = this
    return (
      <Row className='dialog-search'>
        <Form layout="inline" onSubmit={this.handleSearchChooseList}>
          <Item>
            <Select className='input-100' style={{ width: 100 }} onChange={this.handleToggleProject} defaultValue='管理编号'>
              <Option value='管理编号'>管理编号</Option>
              <Option value='工号'>工号</Option>
            </Select>
          </Item>
          <Item>
            { projectType === '管理编号' ? getFieldDecorator('sjNumber', {
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input className='input-180' placeholder='请输入管理编号' allowClear />
            ) : getFieldDecorator('projectNumber', {
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input className='input-180' placeholder='请输入工号' allowClear />
            )}
          </Item>
          <Item>
            {getFieldDecorator('userName', {
              rules: [
                {
                  validator: this.validateName
                }
              ]
            })(<Input className='input-180' placeholder='请输入姓名' maxLength={15} allowClear />)}
          </Item>
          <Item>
            {getFieldDecorator('organizeArr')(<SharedStructure width='180px' type="string" multiple/>)}
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Item>
        </Form>
      </Row>
    )
  }
}

export default Form.create<SearchFormProps>()(SearchForm)
