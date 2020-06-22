/*
 * @description: 薪酬核算-税后主页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-20 17:16:10
 * @LastEditTime: 2020-05-29 18:23:44
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { IconFill } from '@components/icon/BasicIcon'
import { RootComponent, TableItem } from '@components/index'
import { Button, Form, Row, DatePicker, Icon, Select, Modal } from 'antd'
import { BaseProps } from 'typings/global'
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'
import './style/index.styl'
import moment from 'moment'
import SysUtil from '@utils/SysUtil'
import date from '@assets/images/date.png'

import InsuredModal from '../components/InsuredModal' // 税后核算模态框
import CloseModal from '../components/CloseModal' // 税后关账模态框
import ReturnCloseModal from '../components/ReturnCloseModal' // 税后撤回关账模态框

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
const Option = Select.Option
const { MonthPicker } = DatePicker

interface AfterTaxFormProps extends BaseProps, FormComponentProps {
  onSearchChange:Function // 父组件自定义事件
  dateDay:any // 日期参数
}
@hot(module)
class AfterTaxForm extends RootComponent<AfterTaxFormProps, any> {
  constructor (props:AfterTaxFormProps) {
    super(props)
  }

  onSumbitChange = (e:any) => {
    e.preventDefault()
    const { projectName, time } = this.props.form.getFieldsValue()
    let dateDay = time.format('YYYY.MM')
    let dataParmas = {
      taxStatus: 3,
      projectName,
      time: dateDay
    }
    this.props.onSearchChange(dataParmas) // 参数传递到父组件
    SysUtil.setSessionStorage('afterTaxDate', dataParmas)
  }

  onHistory = (e:any) => {
    e.preventDefault()
    this.props.history.push(`/home/salaryAccountPage/HistoryForm`)
    let list = [
      { title: '项目', dataIndex: 'projectId', width: 120 },
      { title: '工号', dataIndex: 'entity', width: 200 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 150 },
      { title: '姓名', dataIndex: 'userName', width: 150 },
      { title: '法人主体', dataIndex: 'legalEntity', width: 200 },
      { title: '组织', dataIndex: 'organize', width: 200 },
      { title: '职位', dataIndex: 'position', width: 150 },
      { title: '职级', dataIndex: 'rankValue', width: 100 },
      { title: '序列', dataIndex: 'sequenceValue', width: 100 },
      { title: '职等', dataIndex: 'officialRankValue', width: 100 },
      { title: '入职时间', dataIndex: 'entryTime', width: 150 },
      { title: '离职时间', dataIndex: 'quitTime', width: 150 },
      { title: '在职状态', dataIndex: 'workCondition', width: 150 },
      { title: '计薪类型', dataIndex: 'salaryType', width: 150 },
      { title: '身份证号码', dataIndex: 'idCard', width: 180 }
    ]
    SysUtil.setSessionStorage('HistoryList', list)
  }

  render () {
    const { props: { form: { getFieldDecorator }, searchParams }, AuthorityList, isAuthenticated } = this
    const salaryaccount = AuthorityList.salaryaccount
    return (
      <Form layout='inline' onSubmit={(e) => this.onSumbitChange(e)} className='after-form-boxs'>
        <Form.Item label='项目'>
          {getFieldDecorator('projectName', {
            initialValue: searchParams.projectName || '上嘉'
          })(
            <Select style={{ width: '0.7rem', marginRight: '0.05rem' }}>
              <Option value="上嘉">上嘉</Option>
              <Option value="盒马">盒马</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label='月度' >
          {getFieldDecorator('time', {
            initialValue: !searchParams.time ? moment().subtract(1, 'month') : moment(searchParams.time, 'YYYY:MM')
          })(
            <MonthPicker
              disabledDate={(current: any) => current && current >= moment().startOf('month')}
              format='YYYY年MM月'
              allowClear={false}
              suffixIcon={(<img src={date}/>)}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" className='btn-style' htmlType="submit">搜索</Button>
        </Form.Item>
        {
          isAuthenticated(salaryaccount[15]) &&
            <Button onClick={(e) => this.onHistory(e)} type="primary" className='btn-style' style={{ float: 'right', marginTop: 7 }}>员工历史薪资查询</Button>
        }
        <Form.Item style={{ float: 'right' }}>
          <div className="tip-right">
            <Icon component={IconFill} className="tips-icon" />
            关账操作，每月只能执行一次！
          </div>
        </Form.Item>
      </Form>
    )
  }
}

const AfterTaxFormCompoent = Form.create<AfterTaxFormProps>()(AfterTaxForm)

@hot(module)
export default class AfterTaxPage extends RootComponent<any, any> {
  tableItem = React.createRef<TableItem<any>>()
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    let dates = params.get('after')
    const searchParams = SysUtil.getSessionStorage('AfterTax_searchParams')
    this.state = {
      searchParams: searchParams || {
        taxStatus: 3,
        projectName: null || '上嘉',
        time: dates || null || moment().subtract(1, 'month').format('YYYY.MM') // 报表月度
      },
      dateDay: dates || null, // 页面传递的数据
      // 核算模态数据
      loadModalVisible: false, // 核算模态显示/隐藏
      insureData: null, // 数据存放
      // 关账并归档数据
      closeModalVisible: false, // 关账模态显示/隐藏
      // 撤回关账
      returnCloseVisible: false,
      closeData: {}, // 关账参数存放
      insData: {}, // 核算参数存放
      returnData: {} // 撤回关账参数
    }
  }

  onSearchChange = (searchParams:any) => {
    this.setState({
      searchParams
    })
  }

  onSetChange = (data:any) => {
    if (data) {
      const { loadingTableData } = this.tableItem.current as TableItem<any>
      loadingTableData()
    }
  }

  showDetail = (record:any, e:any) => { // 查看按钮
    e.preventDefault()
    const { projectId } = record
    this.props.history.push(`/home/salaryAccountPage/AfterTaxDetail/${projectId}`)
  }
  insureChange = (record:any, e:any) => { // 税后核算
    e.preventDefault()
    const { saId, endTime } = record
    NProgress.set(0.0)
    NProgress.set(0.2)
    NProgress.set(0.4)
    NProgress.set(0.6)
    NProgress.set(0.8)
    NProgress.set(0.9)
    this.axios.request(this.api.AfterTaxInsured, { saId, type: 0, month: endTime.replace('.', '') }, true).then((res:any) => {
      NProgress.set(1.0)
      NProgress.remove()
      this.setState({
        loadModalVisible: true,
        insureData: endTime.replace('.', '')
      })
    }).catch((err:any) => {
      NProgress.set(1.0)
      NProgress.remove()
      this.error(err.msg[0])
    })
  }
  offChange = (record:any, e:any) => { // 关帐并归档
    e.preventDefault()
    const { saId, endTime } = record
    this.setState({
      closeModalVisible: true,
      insureData: endTime.replace('.', ''),
      closeData: {
        saId,
        type: 1,
        month: endTime.replace('.', '')
      }
    })
  }
  returnChange = (record:any, e:any) => { // 撤回关帐
    e.preventDefault()
    const { saId, endTime } = record
    this.setState({
      returnCloseVisible: true,
      insureData: record,
      returnData: {
        saId,
        month: endTime.replace('.', '')
      }
    })
  }

  onLoadModal = (loadModalVisible:boolean) => { // 核算模态自定义事件
    this.setState({
      loadModalVisible
    })
  }

  onCloseModal = (closeModalVisible:boolean) => { // 关账并归档自定义事件
    this.setState({
      closeModalVisible
    })
  }

  onReturnChange = (returnCloseVisible:boolean) => { // 关账并归档自定义事件
    this.setState({
      returnCloseVisible
    })
  }

  render () {
    const { state, AuthorityList, isAuthenticated } = this
    const salaryaccount = AuthorityList.salaryaccount
    const { searchParams, dateDay, loadModalVisible, insureData, closeModalVisible, returnCloseVisible, returnData, closeData } = state
    let columnData = [
      { title: '序号', dataIndex: 'index', align: 'center' },
      { title: '项目', dataIndex: 'projectName', render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '月度', dataIndex: 'endTime', render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '核算人数', dataIndex: 'number', render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '状态', dataIndex: 'statusMeaning', render: (text:string) => (<span>{text || '- - -'}</span>) },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          const { status } = record
          return (
            <span>
              {
                isAuthenticated(salaryaccount[9]) &&
                  <a onClick={(e) => this.showDetail(record, e)} style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="用户查看" className="mgl10">查看</a>
              }
              {
                isAuthenticated(salaryaccount[10]) &&
                  <a title="税后核算" style={{ cursor: 'pointer', margin: '0 13px 0 0' }} onClick={(e:any) => { this.insureChange(record, e) }}>税后核算</a>
              }
              {status === 0 && isAuthenticated(salaryaccount[11]) &&
                <a style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐" onClick={(e) => this.offChange(record, e)}>关帐并归档</a>
              }
              {status === 1 && isAuthenticated(salaryaccount[11]) &&
                <a style={{ pointerEvents: 'none', color: '#999', cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐" >关帐并归档</a>
              }
              {status === 1 && isAuthenticated(salaryaccount[12]) &&
                <a style={{ cursor: 'pointer' }} title="撤回关帐" onClick={(e) => this.returnChange(record, e)}>撤回关帐</a>
              }
            </span>
          )
        }
      }
    ]
    return (
      <div id='after-tax-page'>
        <Row>
          <AfterTaxFormCompoent searchParams={searchParams} onSearchChange={this.onSearchChange} {...this.props} />
        </Row>
        <TableItem
          ref={this.tableItem}
          rowSelectionFixed
          filterKey="projectId"
          URL={this.api.BeforeTaxList}
          columns={columnData}
          rowKey={({ projectId }) => projectId}
          // scroll={{ x: 1700 }}
          searchParams={searchParams}
          bufferSearchParamsKey='AfterTax_searchParams'
        />
        { /* 核算模态框 */ }
        <InsuredModal onLoadModal={this.onLoadModal} loadExcelName='税后核算成功' {...{ insureData, loadModalVisible }} />
        {/* 关账并归档模态框 */}
        <CloseModal apiPath={this.api.AfterTaxInsured} onSetChange={this.onSetChange} apiData={closeData} onCloseModal={this.onCloseModal} loadExcelName='税后关账成功' {...{ insureData, closeModalVisible }} />
        {/* 撤回关账 */}
        <ReturnCloseModal apiData={returnData} onSetChange={this.onSetChange} apiPath={this.api.AfterRecallCloseStatus} onReturnChange={this.onReturnChange} {...{ insureData, returnCloseVisible }} />
      </div>
    )
  }
}
