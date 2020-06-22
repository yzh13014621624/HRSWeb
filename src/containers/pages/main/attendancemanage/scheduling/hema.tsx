/*
 * @description: 考勤管理-公共页面组件
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-23 10:55:31
 * @LastEditTime: 2020-06-16 15:55:48
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { FormProps } from 'typings/global'
import { RootComponent, TableItem, BasicDowload } from '@components/index'
import { Button, Icon, Select, Form, Input, DatePicker, Col, Spin } from 'antd'
import { IconDc } from '@components/icon/BasicIcon'
import moment from 'moment'
import { SysUtil, JudgeUtil } from '@utils/index'
import SharedStructure from '@shared/structure/SharedStructure'
import './index.styl'

const Item = Form.Item
const { Option } = Select

interface SearchProps extends FormComponentProps {
  searchData: Function
}
interface SearchState {
  projectType: string
}

class SearchComponent extends RootComponent<SearchProps, SearchState> {
  constructor (props: SearchProps) {
    super(props)
    this.state = {
      projectType: '管理编号'
    }
  }

  componentWillUnmount = () => {
    this.setState = (state) => {}
  }

  // 搜索排版列表
  handleSearch = (e: any) => {
    e.preventDefault()

    const { form: { validateFields }, searchData }:any = this.props
    validateFields((err: any, value: any) => {
      if (err) return
      value.date = moment(value.monthDate).format('YYYY-MM-DD')
      delete value.monthDate
      searchData(value)
    })
  }

  // 切换工号
  handleToggleProject = (val: string) => {
    this.setState({
      projectType: val
    })
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
    const { getFieldDecorator } = this.props.form
    const { projectType } = this.state
    const defaultTree = SysUtil.getSessionStorage('commonOrganize').filter((item: any) => item.organize === '盒马')
    return (
      <div className='scheduling-serach'>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Item>
            <Select className='input-120' onChange={this.handleToggleProject} defaultValue='管理编号'>
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
              <Input placeholder='请输入管理编号' allowClear />
            ) : getFieldDecorator('projectNumber', {
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input placeholder='请输入工号' allowClear />
            )}
          </Item>
          <Item>
            {getFieldDecorator('userName', {
              rules: [
                {
                  validator: this.validateName
                }
              ]
            })(<Input placeholder='请输入姓名' allowClear maxLength={15} />)}
          </Item>
          <Item>
            {getFieldDecorator('organizeArr')(<SharedStructure defaultTree={defaultTree} width='220px' type="string" multiple/>)}
          </Item>
          <Item label='日期：'>
            {getFieldDecorator('monthDate', { initialValue: moment().subtract(1, 'days') })(<DatePicker className='picker-150 input-150' allowClear={false} />)}
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Item>
        </Form>
      </div>
    )
  }
}
const HemaSearch = Form.create<SearchProps>()(SearchComponent)

interface HemaProps extends FormProps {
}
interface HemaState {
  hemaInfo: any
  loading: boolean
  searchParams: any
}

@hot(module)
class Hema extends RootComponent<HemaProps, HemaState> {
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: HemaProps) {
    super(props)
    const projectId = this.props.projectId
    this.state = {
      hemaInfo: {},
      loading: false,
      searchParams: {
        projectId,
        date: moment().subtract(1, 'days')
      }
    }
  }

  componentWillUnmount = () => {
    this.setState = (state) => {}
  }

  componentDidMount = () => {
  }

  // 搜索排版列表
  handleSearch = (data: any) => {
    this.tableRef.current!.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.setState({
      searchParams: { ...data, projectId: this.props.projectId }
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator } },
      state: {
        hemaInfo, loading, searchParams
      },
      api: {
        getHemaAttendanceList, exportHemaAttendList
      }
    } = this
    const formItemLayout = {
      labelCol: {
        span: 2,
        style: {
          width: '120px'
        }
      },
      wrapperCol: { span: 4 }
    }
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 50 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 150 },
      { title: '姓名', dataIndex: 'userName', width: 90 },
      { title: '组织', dataIndex: 'organize', width: 250 },
      { title: '在职状态', dataIndex: 'workCondition', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'entryTime',
        sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/')),
        width: 100
      },
      { title: '离职日期', dataIndex: 'quitTime', width: 100 },
      { title: '考勤日期', dataIndex: 'attendanceDate', width: 100 },
      { title: '班次', dataIndex: 'className', width: 100 },
      { title: '关联的审批单', dataIndex: 'approveId', width: 100 },
      { title: '上班打卡时间', dataIndex: 'onDutyCheckTime', width: 100 },
      { title: '上班打卡结果', dataIndex: 'onDutytimeResult', width: 120 },
      { title: '上班打卡位置', dataIndex: 'onDutylocationResult', width: 100 },
      { title: '下班打卡时间', dataIndex: 'offDutyCheckTime', width: 150 },
      { title: '下班打卡结果', dataIndex: 'offDutytimeResult', width: 100 },
      { title: '下班打卡位置', dataIndex: 'offDutylocationResult', width: 100 },
      { title: '工作时长（小时）', dataIndex: 'workTime', width: 130 },
      { title: '迟到时长（分钟）', dataIndex: 'lateTime', width: 130 },
      { title: '严重迟到时长（分钟）', dataIndex: 'severelyLateTime', width: 180 },
      { title: '早退时长（分钟）', dataIndex: 'leaveEarlyTime', width: 130 },
      { title: '出差时长（分钟）', dataIndex: 'travelTime', width: 130 },
      { title: '外出时长（分钟）', dataIndex: 'outTime', width: 130 },
      { title: '请假时长（分钟）', dataIndex: 'leaveTime', width: 130 }
    ]
    return (
      <div className='hema-list'>
        <HemaSearch searchData={this.handleSearch} />
        <Item>
          <BasicDowload action={exportHemaAttendList}
            parmsData={searchParams} fileName="员工列表导出"
            dowloadURL="URL"
            className="contract-page-button" btntype="primary">
            <Icon component={IconDc}/>导出
          </BasicDowload>
        </Item>
        <TableItem
          ref={this.tableRef}
          rowSelectionFixed
          filterKey="index"
          rowKey={({ index }) => `table${index}`}
          URL={ getHemaAttendanceList }
          scroll={{ x: 2170 }}
          searchParams={searchParams}
          columns={columnData}
        />
      </div>
    )
  }
}

export default Form.create<FormProps>()(Hema)
