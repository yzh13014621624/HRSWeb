/*
 * @description: 员工计件收入
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-20 14:44:39
 * @LastEditTime: 2020-05-29 13:20:19
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Popover, Col, Select } from 'antd'
import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'
import { BaseProps, KeyValue } from 'typings/global'
import SharedStructure from '@shared/structure/SharedStructure'
import moment from 'moment'
import NumberFormatUtils from '@utils/NumberFormat'
import './PieceoverviewPage.styl'
import { clearObserving } from 'mobx/lib/internal'
import SysUtil from '@utils/SysUtil'

const { Item } = Form
const { MonthPicker } = DatePicker
const { Option } = Select

interface State {
  searchParams: KeyValue
  placeholderText: String
}

interface FormProps extends BaseProps, FormComponentProps {}

class SalaryPieceWorkIncome extends RootComponent<FormProps, State> {
  columns: any[] = [
    { title: '序号', dataIndex: 'index', width: 80 },
    { title: '项目', dataIndex: 'projectName', width: 80 },
    { title: '工号', dataIndex: 'projectNumber', width: 120 },
    { title: '管理编号', dataIndex: 'sjNumber', width: 120 },
    { title: '姓名', dataIndex: 'userName', width: 80 },
    { title: '入职时间', dataIndex: 'entryTime', width: 100, sorter: true },
    { title: '法人主体', dataIndex: 'entity', width: 180 },
    { title: '组织', dataIndex: 'organize', width: 230 },
    {
      title: '月度',
      width: 100,
      render: (text: any, records: any) => {
        return (
          <span>{NumberFormatUtils.doubleFormat(this.state.searchParams.pvTime / 100, 2)}</span>
        )
      }
    },
    { title: '身份证号码', dataIndex: 'idCard', width: 180 },
    { title: '计件收入小计', dataIndex: 'pvIncomeTotal', width: 100 },
    { title: '计件小时数小计', dataIndex: 'pvHourNumTotal', width: 100 },
    { title: '平均每小时计件费用', dataIndex: 'hourMoney', width: 150 },
    { title: '非计件小时数小计', dataIndex: 'pvNoHourNumTotal', width: 150 },
    { title: '非计件收入小计', dataIndex: 'pvNoIncomeTotal', width: 130 },
    { title: '实际计件类收入', dataIndex: 'pvIncomeClassTotal', width: 130 },
    { title: '计件奖金', dataIndex: 'pvBonusTotal', width: 100 },
    {
      title: '操作',
      fixed: 'right',
      width: 80,
      render: (text: any, records: any) => {
        const { userId } = records
        return this.isAuthenticated(this.AuthorityList.salarypiece[9]) && <span style = {{ color: '#40A9FF', cursor: 'pointer' }} onClick = {() => this.examineClick(userId)}>查看</span>
      }
    }
  ]
  constructor (props: FormProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('pieceworkincome_searchParams')
    this.state = {
      searchParams: searchParams || {
        selectValue: '',
        pvTime: moment().subtract(1, 'months').format('YYYYMM'),
        organizeArr: [],
        nameInput: '',
        projectInput: ''
      },
      placeholderText: '' || '管理编号'
    }
  }

  selectValueOnChange = (value: number) => {
    this.setState({
      placeholderText: !value ? '工号' : '管理编号'
    })
  }

  // 点击查看按钮
  examineClick = (userId: number) => {
    const { searchParams: { pvTime } } = this.state
    const userInfo = JSON.stringify({ userId, pvTime })
    localStorage.setItem('PieceoverviewPage', userInfo)
    this.props.history.push({ pathname: '/home/salarypiece/pieceworkincome/pieceworkincomeedit', state: { userId, pvTime } })
  }

  // 搜素点击事件
  searchOnClick = () => {
    const { order } = this.state.searchParams
    setTimeout(() => {
      const searchParams = this.props.form.getFieldsValue()
      let pvTimeNum = 0
      if (searchParams.selectValue) {
        searchParams.sjNumber = searchParams.projectNumber
        delete searchParams.projectNumber
      }
      if (searchParams.pvTime) {
        pvTimeNum = parseInt(moment(searchParams.pvTime).format('YYYYMM'))
        searchParams.pvTime = pvTimeNum
      }
      this.setState({
        searchParams: { ...searchParams, order }
      })
    }, 0)
  }

  // 排序触发
  sorterChange = (value: string) => {
    const { searchParams } = this.state
    const order = value === 'ascend' ? 'asc' : 'desc'
    this.setState({
      searchParams: { ...searchParams, order }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { placeholderText, searchParams, searchParams: { organizeArr } } = this.state
    return (
      <div id='PieceoverviewPage'>
        <Row>
          <Form layout='inline'>
            <Item label="月度" >
              { getFieldDecorator('pvTime', {
                initialValue: searchParams.pvTime ? moment(String(searchParams.pvTime), 'YYYYMM') : undefined
              })(
                <MonthPicker allowClear={false} format="YYYY年MM月" disabledDate={(current: any) => current && current > moment().endOf('day')}/>
              ) }
            </Item>
            <Item className="contract-com-margin-r-10">
              { getFieldDecorator('selectValue', {
                initialValue: typeof searchParams.selectValue === 'number' ? searchParams.selectValue : 1
              })(
                <Select onChange={this.selectValueOnChange} className="input-120">
                  <Option value={0}>工号</Option>
                  <Option value={1}>管理编号</Option>
                </Select>
              ) }
            </Item>
            <Item className="contract-com-margin-r">
              {getFieldDecorator('projectNumber', {
                initialValue: searchParams.sjNumber || searchParams.projectNumber,
                rules: [
                  {
                    message: '请输入字母或者数字',
                    pattern: new RegExp(/^[A-Za-z0-9]+$/, 'g')
                  }
                ]
              })(
                <Input placeholder={`请输入${placeholderText}`} allowClear />
              )}
            </Item>
            <Item className="contract-com-margin-r">
              {getFieldDecorator('userName', {
                initialValue: searchParams.userName,
                rules: [
                  {
                    message: '请输入英文或中文',
                    pattern: new RegExp(/^[\u4e00-\u9fa5_a-zA-Z]+$/)
                  }
                ]
              })(<Input placeholder='请输入姓名' allowClear maxLength={15} />)}
            </Item>
            <Item className="contract-com-margin-r">
              {getFieldDecorator('organizeArr', {
                initialValue: searchParams.organizeArr || []
              })(<SharedStructure type="string" multiple />)}
            </Item>
            <Item>
              <Button type="primary" className='contract-search-button' onClick = {this.searchOnClick}>搜索</Button>
            </Item>
            <Item className="pieceworkincome-title-basicdowload">
              <BasicDowload action={this.api.exportUserPiecework}
                parmsData={searchParams} fileName="员工计件收入信息导出"
                dowloadURL="URL"
                btntype="primary">
                <Icon component={IconDc}/>导出
              </BasicDowload>
            </Item>
          </Form>
        </Row>
        <TableItem
          sorterChange={this.sorterChange}
          searchParams = {searchParams}
          rowSelection = {false}
          columns = {this.columns}
          URL = {this.api.PieceoverviewPage}
          rowSelectionFixed
          rowKey = {({ index }) => index}
          scroll={{ x: 2200 }}
          bufferSearchParamsKey='pieceworkincome_searchParams'
        />
      </div>
    )
  }
}
export default Form.create()(SalaryPieceWorkIncome)
