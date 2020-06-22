/**
 * @author maqian
 * @createTime 2019/04/24
 * @description 报表中心-固定报表
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { EmptyTable } from '@components/empty/BasicEmpty'
import { RootComponent, BasicDowloadFont } from '@components/index'
import { Button, Form, Row, DatePicker, Col, ConfigProvider, Table, Modal } from 'antd'

import moment from 'moment'
import { SysUtil, globalEnum } from '@utils/index'
import SelectForm from './compoent/SelectForm'

import './style/FixedReportformPage.styl'

import date from '@assets/images/date.png'

const { MonthPicker } = DatePicker

const authorAry: Array<any> = [
  { name: '花名册汇总表', authorCode: 'HRS000300010005' },
  { name: '在职名单汇总表', authorCode: 'HRS000300010006' },
  { name: '离职名单汇总表', authorCode: 'HRS000300010007' },
  { name: '试用期审核名单汇总表', authorCode: 'HRS000300010008' },
  { name: '合同到期名单汇总表', authorCode: 'HRS000300010009' },
  { name: '合同信息汇总表', authorCode: 'HRS000300010010' },
  { name: '异动信息汇总表', authorCode: 'HRS000300010011' },
  { name: '参保明细汇总表', authorCode: 'HRS000300010012' },
  { name: '参保费用拆分汇总表', authorCode: 'HRS000300010013' },
  { name: '参保费用付款汇总表', authorCode: 'HRS000300010014' }
]

interface FixedReportFormProps extends FormComponentProps {
  searchParams:any
  searchData:Function
  report:any
  showEvent:Function
}
// 固定报表表单
class FixedReportForm extends RootComponent<FixedReportFormProps, any> {
  constructor (props:any) {
    super(props)
    const { reportMonth, reportYear } = props.searchParams
    this.state = {
      searchData: {
        reportYear: reportYear || 0,
        reportMonth: reportMonth || 0
      },
      report: props.report || null
    }
  }
  componentDidMount () {
    const { report, searchParams, searchData } = this.props
    // SysUtil.clearSession('fixMonthDate')
    const data = SysUtil.getSessionStorage('fixedreportform_searchParams')
    if (!report) {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()
      if (month <= 0) {
        year = date.getFullYear() - 1
        month = 12
      }
      let monthSting = (month < 10 ? '0' + month : month)
      let mydate = (year.toString() + '-' + monthSting.toString())
      this.setState({
        report: mydate
      })
      let dataParms = {
        reportYear: year,
        reportMonth: month
      }
      this.initData(data || dataParms)
      searchData(data || dataParms)
    } else {
      this.initData(searchParams)
      this.props.searchData(searchParams)
    }
  }
  initData = (parmas:any) => {
    this.axios.request(this.api.fixedreportlist, parmas).then(({ data }) => {
      const auth = SysUtil.getSessionStorage(globalEnum.auth)
      // 保存现在的权限
      let authAry:any[] = []
      if (auth) authAry = authorAry.filter((el:any) => auth.includes(el.authorCode))
      let ary:any[] = []
      let num: number = 0
      // 消息提示 路径跳转
      data.forEach((item: any) => {
        let a = authAry.find((es:any) => es.name === item.reportType)
        if (a) {
          item.index = ++num
          ary.push(item)
        }
      })
      this.props.searchData(parmas, ary)
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }
  handleSumbit = (e:any) => {
    e.preventDefault()
    let valiFileValue = this.props.form.getFieldsValue()
    let dataParms = {}
    if (valiFileValue.reportMonth) {
      let data = valiFileValue.reportMonth.format('YYYY-MM')
      let year = +data.split('-')[0]
      let month = +data.split('-')[1]
      this.setState({
        report: data
      })
      // 将data存到session里面
      SysUtil.setSessionStorage('fixMonthDate', data)
      dataParms = {
        reportYear: year,
        reportMonth: month
      }
    } else {
      dataParms = {
        reportYear: 0,
        reportMonth: 0
      }
    }
    this.initData(dataParms)
    this.props.searchData(dataParms)
  }
  monthChange = (date: any) => { // 月底发生改变时事件函数
    let data = date.format('YYYY-MM')
    let year = Number(data.split('-')[0])
    let month = Number(data.split('-')[1])
    let years = moment().year() // 当前年
    let months = moment().month() + 1 // 当前月
    if (year === years && month === months) {
      this.props.showEvent(true, years, month)
    } else {
      this.props.showEvent(false)
    }
  }

  render () {
    const { form } = this.props
    const { report } = this.state
    const { getFieldDecorator } = form
    const { reportYear, reportMonth } = SysUtil.getSessionStorage('fixedreportform_searchParams') || {}
    return (
      <Form layout='inline' onSubmit={this.handleSumbit}>
        <Form.Item label="报表月度">
          {getFieldDecorator('reportMonth', {
            initialValue: reportYear && reportMonth ? moment(`${reportYear}:${reportMonth}`, 'YYYY:MM') : (report ? moment(report, 'YYYY:MM') : undefined),
            rules: [{
              required: true, message: '请选择报表月度'
            }]
          })(
            <MonthPicker
              disabledDate={(current: any) => current && current > moment().startOf('month')}
              format='YYYY年MM月'
              allowClear={false}
              suffixIcon={(<img src={date}/>)}
              onChange={this.monthChange}
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
const WrappedFormCompoent = Form.create<FixedReportFormProps>()(FixedReportForm)

interface FixedReportformPageProps {
  history?:any
}

@hot(module)
export default class FixedReportformPage extends RootComponent<FixedReportformPageProps, any> {
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    let adate = params.get('date')
    this.state = {
      searchParams: { // 查询参数
        reportYear: adate ? +adate.split('-')[0] : 0,
        reportMonth: adate ? +adate.split('-')[1] : 0 // 报表月度
      },
      report: adate || null,
      dataSource: [],
      btnShow: false, // 生成报表是否显示 true显示 false不显示
      ryears: null,
      rmonth: null
    }
  }

  showDetail = (record:any, e:any) => { // 查看详情
    e.preventDefault()
    SysUtil.setSessionStorage('fixData', record)
    this.props.history.push(`/home/FixedReportformPage/FixedReportformDetail?type=${record.reportType}&title=${record.reportName}`)
  }
  searchData = async (data:any, tableData?:any) => { // 获取子组件传递过来的数据
    SysUtil.setSessionStorage('fixedreportform_searchParams', data)
    await this.setState({
      searchParams: data,
      dataSource: tableData
    })
  }
  generateReport = (e:any) => { // 生成报表按钮
    e.preventDefault()
    this.setState({
      previewVisible: true
    })
  }
  showEvent = (data:boolean, ryears:number, rmonth:number) => { // 用于控制生成报表按钮是否显示
    this.setState({
      btnShow: data,
      ryears,
      rmonth: rmonth < 10 ? '0' + rmonth : rmonth + ''
    })
  }
  closeModal = (show:boolean) => { // 生成报表成功用于刷新列表页
    this.setState({
      previewVisible: show
    })
  }

  render () {
    const { isAuthenticated, AuthorityList, state } = this
    const { searchParams, dataSource, report, btnShow, previewVisible, ryears, rmonth } = state
    const [ , detail, , excelloader, pdfloader ] = AuthorityList.fixedreportform
    let tags:any = {
      title: '操作',
      key: 'tags',
      width: 200,
      render: (text:string, record:any) => {
        const { reportType, reportName } = record
        return (
          <span>
            {
              isAuthenticated(detail) &&
                <a style={{ margin: '0 13px 0 0' }} onClick={(e) => this.showDetail(record, e)} title="用户查看" className="mgl10">查看</a>
            }
            {
              isAuthenticated(excelloader) &&
                <BasicDowloadFont action={this.api.detailExport}
                  parmsData={{
                    keyword: '',
                    reportFromType: record.reportType,
                    reportYear: record.reportYear,
                    reportMonth: record.reportMonth
                  }}
                  isLoadeTime={true} // 是否下文件名后面加时间，true为不带时间
                  fileName={reportName}
                  type="default"
                  className="btn-style"
                >
                  下载Excel文件
                </BasicDowloadFont>
            }
            {/* {((reportType === '花名册汇总表') || (reportType === '在职名单汇总表') || (reportType === '离职名单汇总表')) && isAuthenticated(pdfloader)
              ? null
              : <span style={{ margin: '0 13px' }}>
                <BasicDowloadFont action={this.api.dynamicRequest}
                  parmsData={{
                    keyword: '',
                    reportFromType: record.reportType,
                    reportYear: record.reportYear,
                    reportMonth: record.reportMonth
                  }}
                  fileName={reportName}
                  isLoadeTime={true} // 是否下文件名后面加时间
                  type="default"
                  suffix=".pdf"
                  className="btn-style"
                >
                  下载PDF文件
                </BasicDowloadFont>
              </span>
            } */}
          </span>
        )
      }
    }
    let columnData:any = [
      { title: '序号', dataIndex: 'index', align: 'center', width: 100 },
      { title: '报表名称',
        dataIndex: 'reportName',
        width: 200,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      { title: '年份',
        dataIndex: 'reportYear',
        width: 100,
        render: (text:string) => (<span>{text + '年' || '- - -'}</span>)
      },
      { title: '月份',
        dataIndex: 'reportMonth',
        width: 100,
        render: (text:string) => (<span>{text + '月' || '- - -'}</span>)
      }
    ]
    if (isAuthenticated(detail) || isAuthenticated(excelloader) || isAuthenticated(pdfloader)) {
      columnData.push(tags)
    }
    return (
      <div id="fixed-report-form-page">
        <Row style={{ marginBottom: 20 }}>
          <Col span={20}>
            <WrappedFormCompoent report={report} searchParams={searchParams} searchData={this.searchData} showEvent={this.showEvent} {...this.props} />
          </Col>
          {
            btnShow &&
            <Col span={4}>
              <Button type="primary" className='btn-style' onClick={this.generateReport}>生成报表</Button>
            </Col>
          }
        </Row>
        <ConfigProvider renderEmpty={EmptyTable}>
          <Table
            rowKey={({ index }:any) => index }
            columns={columnData}
            dataSource={dataSource}
            pagination={false}
          />
        </ConfigProvider>
        <Modal
          width='2.6rem'
          footer={null}
          maskClosable={false}
          className='modal-style'
          title='选择报表类型'
          style={{ textAlign: 'center' }}
          visible={previewVisible}
          onCancel={ () => { this.setState({ previewVisible: false }) }}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <SelectForm ryears={ryears} rmonth={rmonth} closeModal={this.closeModal} {...this.props} />
        </Modal>
      </div>
    )
  }
}
