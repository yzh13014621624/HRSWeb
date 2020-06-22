/*
 * @description: 薪酬核算-个税主页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-20 17:16:10
 * @LastEditTime: 2020-05-27 16:27:11
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, FileUpload } from '@components/index'
import { BaseProps } from 'typings/global'
import { IconDc, IconDr, IconFill } from '@components/icon/BasicIcon'
import { Button, Form, Row, DatePicker, Select, Icon, Col } from 'antd'
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'
import './style/index.styl'
import moment from 'moment'
import SysUtil from '@utils/SysUtil'
import date from '@assets/images/date.png'

import InsuredModal from '../components/InsuredModal' // 个税核算模态框
import CloseModal from '../components/CloseModal' // 个税撤回模态框
import ReturnCloseModal from '../components/ReturnCloseModal' // 个税撤回关账模态框

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

const Option = Select.Option
const { MonthPicker } = DatePicker

interface PersonalTaxFormProps extends BaseProps, FormComponentProps {
  onSearchChange:Function // 父组件自定义事件
  dateDay:any // 日期参数
}

class PersonalTaxForm extends RootComponent<PersonalTaxFormProps, any> {
  constructor (props:PersonalTaxFormProps) {
    super(props)
    this.state = {
      dataParmas: {}
    }
  }

  onSubmitChange = (e:any) => {
    e.preventDefault()
    const { projectName, time } = this.props.form.getFieldsValue()
    let dateDay = time.format('YYYY.MM')
    let dataParmas = {
      taxStatus: 2,
      projectName,
      time: dateDay
    }
    this.setState({
      dataParmas
    })
    this.props.onSearchChange(dataParmas) // 参数传递到父组件
    SysUtil.setSessionStorage('personalTaxDate', dataParmas)
  }

  render () {
    const { dataParmas } = this.state
    const { form: { getFieldDecorator }, searchParams } = this.props
    return (
      <Form layout='inline' onSubmit={(e) => this.onSubmitChange(e)} className='personal-form-boxs'>
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
      </Form>
    )
  }
}

const BeforeTaxFormCompoent = Form.create<PersonalTaxFormProps>()(PersonalTaxForm)

@hot(module)
export default class PersonalTaxPage extends RootComponent<any, any> {
  tableItem = React.createRef<TableItem<any>>()
  FileUpload = React.createRef<FileUpload>()
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    const searchParams = SysUtil.getSessionStorage('PersonalTax_searchParams')
    let dates = params.get('personal')
    this.state = {
      searchParams: searchParams || {
        taxStatus: 2,
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
      insData: {}, // 核算参数存放
      closeData: {}, // 关账参数
      returnData: {} // 撤回关账参数
    }
  }

  onSetChange = (data:any) => {
    if (data) {
      const { loadingTableData } = this.tableItem.current as TableItem<any>
      loadingTableData()
    }
  }

  onSearchChange = (searchParams:any) => {
    this.setState({
      searchParams
    })
  }

  showDetail = (record:any, e:any) => { // 查看按钮
    e.preventDefault()
    const { saId } = record
    this.props.history.push(`/home/salaryAccountPage/PersonalTaxDetail/${saId}`)
  }

  insureChange = (record:any, e:any) => { // 个税核算
    e.preventDefault()
    const { saId } = record
    NProgress.set(0.0)
    NProgress.set(0.2)
    NProgress.set(0.4)
    NProgress.set(0.6)
    NProgress.set(0.8)
    NProgress.set(0.9)
    this.axios.request(this.api.PersonalTaxInsured, { saId, type: 0 }).then((res:any) => {
      NProgress.set(1.0)
      NProgress.remove()
      this.setState({
        loadModalVisible: true,
        insureData: record,
        insData: {
          difference: 0,
          saId
        }
      })
    }).catch((err:any) => {
      NProgress.set(1.0)
      NProgress.remove()
      this.error(err.msg[0])
    })
  }
  offChange = (record:any, e:any) => { // 关帐并归档
    e.preventDefault()
    const { saId } = record
    this.setState({
      closeModalVisible: true,
      insureData: record,
      closeData: {
        saId,
        type: 1
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
        monthlyTime: endTime,
        saId
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
    const {
      searchParams, dateDay, loadModalVisible, insureData,
      closeModalVisible, returnCloseVisible, insData, closeData, returnData
    } = state
    const { projectName, time } = searchParams
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
                isAuthenticated(salaryaccount[5]) &&
                  <a onClick={(e) => this.showDetail(record, e)} style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="用户查看" className="mgl10">查看</a>
              }
              {
                isAuthenticated(salaryaccount[6]) &&
                  <a title="个税核算" style={{ cursor: 'pointer', margin: '0 13px 0 0' }} onClick={(e:any) => { this.insureChange(record, e) }}>个税核算</a>
              }
              {status === 0 && isAuthenticated(salaryaccount[7]) &&
                <a style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐" onClick={(e) => this.offChange(record, e)}>关帐并归档</a>
              }
              {status === 1 && isAuthenticated(salaryaccount[7]) &&
                <a style={{ pointerEvents: 'none', color: '#999', cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐">关帐并归档</a>
              }
              {status === 1 && isAuthenticated(salaryaccount[8]) &&
                <a style={{ cursor: 'pointer' }} title="撤回关帐" onClick={(e) => this.returnChange(record, e)}>撤回关帐</a>
              }
            </span>
          )
        }
      }
    ]
    return (
      <div id='personal-tax-page'>
        <Row>
          <Col span={14}>
            <BeforeTaxFormCompoent searchParams={searchParams} onSearchChange={this.onSearchChange} />
          </Col>
          <Col span={10}>
            {
              isAuthenticated(salaryaccount[14]) &&
                <FileUpload params={{
                  pvTime: time.replace('.', '')
                }}
                style={{ float: 'right', marginTop: 7 }}
                ref={this.FileUpload} action={this.api.PersonalImport.path}>
                  <Button type="primary">
                    <Icon component={IconDr}/>导入
                  </Button>
                </FileUpload>
            }
            {
              isAuthenticated(salaryaccount[13]) &&
                <BasicDowload action={this.api.exportToBeMaintainedUser}
                  parmsData={{
                    projectName,
                    pvTime: time.replace('.', '')
                  }}
                  type='default'
                  dowloadURL="URL"
                  className='comfirms-btn'
                  style={{ marginTop: 7, float: 'right', marginRight: 10 }}
                >
                  <Icon component={IconDc}/>导出（待维护居民所得税员工）
                </BasicDowload>
            }
            <div className="tip-right">
              <Icon component={IconFill} className="tips-icon" />
              关账操作，每月只能执行一次！
            </div>
          </Col>
        </Row>
        <TableItem
          ref={this.tableItem}
          rowSelectionFixed
          filterKey="saId"
          URL={this.api.BeforeTaxList}
          columns={columnData}
          rowKey={({ saId }) => saId}
          // scroll={{ x: 1700 }}
          searchParams={searchParams}
          bufferSearchParamsKey='PersonalTax_searchParams'
        />
        { /* 核算模态框 */ }
        <InsuredModal apiData={insData} apiPath={this.api.PersonalExport} onLoadModal={this.onLoadModal} loadExcelName='个税核算成功' {...{ loadModalVisible, insureData }} />
        {/* 关账并归档模态框 */}
        <CloseModal apiPath={this.api.PersonalTaxInsured} apiData={closeData} onSetChange={this.onSetChange} onCloseModal={this.onCloseModal} loadExcelName='个税关账成功' {...{ insureData, closeModalVisible }} />
        {/* 撤回关账 */}
        <ReturnCloseModal apiData={returnData} apiPath={this.api.PersonalReturnClose} onSetChange={this.onSetChange} onReturnChange={this.onReturnChange} {...{ returnCloseVisible, insureData }} />
      </div>
    )
  }
}
