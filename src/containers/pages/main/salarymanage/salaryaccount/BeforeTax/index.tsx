/*
 * @description: 薪酬核算-税前主页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-20 17:16:10
 * @LastEditTime: 2020-05-27 16:24:58
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

import InsuredModal from '../components/InsuredModal' // 税前核算模态框
import CloseModal from '../components/CloseModal' // 税前关账模态框
import ReturnCloseModal from '../components/ReturnCloseModal' // 税前撤回关账模态框

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
const Option = Select.Option
const { MonthPicker } = DatePicker

interface BeforeTaxFormProps extends FormComponentProps, BaseProps {
  onSearchChange:Function // 父组件自定义事件
  dateDay:any // 日期参数
}

@hot(module)
class BeforeTaxForm extends RootComponent<BeforeTaxFormProps, any> {
  constructor (props: BeforeTaxFormProps) {
    super(props)
  }

  onSubmitChange = (e:any) => { // 表单提交
    e.preventDefault()
    const { projectName, time } = this.props.form.getFieldsValue()
    let dateDay = time.format('YYYY.MM')
    let dataParmas = {
      taxStatus: 1,
      projectName,
      time: dateDay
    }
    this.props.onSearchChange(dataParmas) // 参数传递到父组件
    SysUtil.setSessionStorage('beforeTaxDate', dataParmas)
  }

  render () {
    const { props: { form: { getFieldDecorator }, searchParams } } = this
    return (
      <Form layout='inline' onSubmit={(e) => this.onSubmitChange(e)} className='before-form-boxs'>
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

const BeforeTaxFormCompoent = Form.create<BeforeTaxFormProps>()(BeforeTaxForm)

@hot(module)
export default class BeforeTaxPage extends RootComponent<any, any> {
  tableItem = React.createRef<TableItem<any>>()
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    const searchParams = SysUtil.getSessionStorage('BeforeTax_searchParams')
    let dates = params.get('before')
    this.state = {
      searchParams: searchParams || {
        taxStatus: 1,
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

  onSearchChange = (searchParams:any) => { // 表单自定义事件
    this.setState({
      searchParams
    })
  }

  showDetail = (record:any, e:any) => { // 查看按钮
    e.preventDefault()
    const { saId } = record
    this.props.history.push(`/home/salaryAccountPage/BeforeTaxDetail/${saId}`)
  }

  onSetChange = (data:any) => {
    if (data) {
      const { loadingTableData } = this.tableItem.current as TableItem<any>
      loadingTableData()
    }
  }

  insureChange = (record:any, e:any) => { // 税前核算
    e.preventDefault()
    const { saId } = record
    NProgress.set(0.0)
    NProgress.set(0.2)
    NProgress.set(0.4)
    NProgress.set(0.6)
    NProgress.set(0.8)
    NProgress.set(0.9)
    this.axios.request(this.api.BeforeTaxInsured, { saId }, true).then((res:any) => {
      NProgress.set(1.0)
      NProgress.remove()
      this.setState({
        loadModalVisible: true,
        insData: {
          saId
        }
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
      NProgress.set(1.0)
      NProgress.remove()
    })
  }

  offChange = (record:any, e:any) => { // 关帐并归档
    e.preventDefault()
    const { saId } = record
    const { searchParams: { time } } = this.state
    this.setState({
      closeModalVisible: true,
      insureData: record,
      closeData: {
        saId,
        monthly: time,
        type: 1
      }
    })
  }
  returnsChange = (record:any, e:any) => { // 撤回关帐
    e.preventDefault()
    const { endTime, saId } = record
    this.setState({
      returnCloseVisible: true,
      insureData: record,
      returnData: {
        monthly: endTime,
        saId,
        type: 1
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

  onReturnChange = (returnCloseVisible:boolean) => { // 撤回关账自定义事件
    this.setState({
      returnCloseVisible
    })
  }

  render () {
    const { state, AuthorityList, isAuthenticated } = this
    const salaryaccount = AuthorityList.salaryaccount
    const { searchParams, dateDay, loadModalVisible, insureData, closeModalVisible, returnCloseVisible, closeData, insData, returnData } = state
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
                isAuthenticated(salaryaccount[1]) &&
                  <a onClick={(e) => this.showDetail(record, e)} style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="用户查看" className="mgl10">查看</a>
              }
              {
                isAuthenticated(salaryaccount[2]) &&
                  <a title="税前核算" style={{ cursor: 'pointer', margin: '0 13px 0 0' }} onClick={(e:any) => { this.insureChange(record, e) }}>税前核算</a>
              }
              {status === 0 && isAuthenticated(salaryaccount[3]) &&
                <a style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐" onClick={(e) => this.offChange(record, e)}>关帐并归档</a>
              }
              {status === 1 && isAuthenticated(salaryaccount[3]) &&
                <a style={{ pointerEvents: 'none', color: '#999', cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐">关帐并归档</a>
              }
              {status === 1 && isAuthenticated(salaryaccount[4]) &&
                <a style={{ cursor: 'pointer' }} title="撤回关帐" onClick={(e) => this.returnsChange(record, e)}>撤回关帐</a>
              }
            </span>
          )
        }
      }
    ]
    return (
      <div id='before-tax-page'>
        <Row>
          <BeforeTaxFormCompoent searchParams={searchParams} onSearchChange={this.onSearchChange} />
        </Row>
        <TableItem
          ref={this.tableItem}
          rowSelectionFixed
          filterKey="saId"
          URL={this.api.BeforeTaxList}
          columns={columnData}
          rowKey={({ saId }) => saId}
          searchParams={searchParams}
          bufferSearchParamsKey='BeforeTax_searchParams'
        />
        { /* 核算模态框 */ }
        <InsuredModal apiData={insData} apiPath={this.api.BeforeTaxInsuredLoad} onLoadModal={this.onLoadModal} loadExcelName='税前核算成功' {...{ loadModalVisible, insureData }} {...this.props} />
        {/* 关账并归档模态框 */}
        <CloseModal apiPath={this.api.BeforeClose} apiData={closeData} onSetChange={this.onSetChange} onCloseModal={this.onCloseModal} loadExcelName='税前关账成功' {...{ closeModalVisible, insureData }} {...this.props} />
        {/* 撤回关账 */}
        <ReturnCloseModal onSetChange={this.onSetChange} apiData={returnData} apiPath={this.api.BeforReturnClose} onReturnChange={this.onReturnChange} {...{ insureData, returnCloseVisible }} {...this.props} />
      </div>
    )
  }
}
