/*
 * @description: 任务管理列表
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-11-20 22:29:10
 * @LastEditTime: 2019-12-03 13:02:53
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Form, Input, DatePicker, Button, Tabs } from 'antd'
import { hot } from 'react-hot-loader'

import { BaseProps, KeyValue } from 'typings/global'
import moment from 'moment'
const { Item } = Form
const { RangePicker } = DatePicker

interface TaskManageState {
}

@hot(module)
class TaskManage extends RootComponent<BaseProps, TaskManageState> {
  table = React.createRef<TableItem<any>>()

  constructor (props: BaseProps) {
    super(props)
    this.state = {}
  }

  searchData = () => {
    const { actionTime, fileName } = this.props.form.getFieldsValue()
    const startAndTime = actionTime && actionTime.length > 0
    const startTime = startAndTime ? moment(actionTime[0]).format('YYYY-MM-DD') : undefined
    const endTime = startAndTime ? moment(actionTime[1]).format('YYYY-MM-DD') : undefined
    const params = {
      startTime,
      endTime,
      type: Number(this.props.type),
      fileName
    }
    this.props.searchData(params)
  }
  render () {
    const {
      type,
      clearForm,
      form: { getFieldDecorator, resetFields }
    } = this.props
    clearForm && resetFields()
    return (
      <div>
        <Form layout='inline'>
          <Item label={`${(type === '1' && '导入') || (type === '2' && '导出')}时间`}>
            {getFieldDecorator('actionTime')(
              <RangePicker />
            )}
          </Item>
          <Item>
            {getFieldDecorator('fileName')(<Input placeholder='请输入文件名称' allowClear maxLength={50} />)}
          </Item>
          <Item>
            <Button onClick={this.searchData} style={{ backgroundColor: 'rgba(64,169,255,1)', color: '#fff' }}>搜索</Button>
          </Item>
        </Form>
      </div>
    )
  }
}

export default Form.create<any>()(TaskManage)
