/**
 * @author
 * @createTime 2019/04/24
 * @description 报表中心-归档报表
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem, BasicDowloadFont } from '@components/index'
import { FormComponentProps } from 'antd/lib/form'
import { Button, Form, Row, DatePicker, Divider } from 'antd'
import { hot } from 'react-hot-loader'
import moment from 'moment'
import SysUtil from '@utils/SysUtil'
import date from '@assets/images/date.png'
import './style/FileReportformPage.styl'

const { MonthPicker } = DatePicker

interface FileReportformProps extends FormComponentProps {
  searchParams:any
  searchData:Function
  report:any
}
// 固定报表表单
class FileReportform extends RootComponent<FileReportformProps, any> {
  constructor (props:any) {
    super(props)
    const { reportMonth, reportYear } = props.searchParams
    this.state = {
      searchData: {
        reportYear: reportYear || 0,
        reportMonth: reportMonth || 0
      },
      report: props.report || ''
    }
  }
  componentDidMount () {
    const { report, searchParams, searchData } = this.props
    // SysUtil.clearSession('fileMonthDate')
    const data = SysUtil.getSessionStorage('filereportform_searchParams')
    if (!report) {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()
      if (month <= 0) {
        year = date.getFullYear() - 1
        month = 12
      }
      let monthSting = (month < 10 ? '0' + month : month)
      let mydate = (year.toString() + monthSting.toString())
      this.setState({
        report: mydate
      })
      let dataParms = {
        reportYear: year,
        reportMonth: month
      }
      this.props.searchData(data || dataParms)
    } else {
      this.props.searchData(searchParams)
    }
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
      SysUtil.setSessionStorage('fileMonthDate', data)
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
    this.props.searchData(dataParms)
  }
  disabledDate = (current:any) => { // 月份选择器时间禁用
    // 禁用大于当前月份的月份
    return current && current > moment().endOf('day')
  }
  render () {
    const { form, searchParams } = this.props
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
              disabledDate={(current: any) => current && current >= moment().startOf('month')}
              // disabledDate={this.disabledDate}
              format='YYYY年MM月'
              allowClear={false}
              suffixIcon={(<img src={date}/>)}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-style">搜索</Button>
        </Form.Item>
      </Form>
    )
  }
}
const WrappedFormCompoent = Form.create<FileReportformProps>()(FileReportform)

interface FileReportformPageProps {
  history?:any
}

@hot(module)
export default class FileReportformPage extends RootComponent<FileReportformPageProps, any> {
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
      report: adate
    }
  }
  showDetail = (record:any, e:any) => { // 查看详情
    e.preventDefault()
    this.props.history.push(`/home/FileReportformPage/FileReportformDetail?raId=${record.raId}&type=${record.reportfromType}&title=${record.raName}`)
  }
  searchData = async (data:any) => { // 获取子组件传递过来的数据
    SysUtil.setSessionStorage('filereportform_searchParams', data)
    await this.setState({
      searchParams: data
    })
  }
  render () {
    const { searchParams, report } = this.state
    const { api, isAuthenticated, AuthorityList } = this
    const [ , detail, excelloader, pdfloader ] = AuthorityList.filereportform
    let tags:any = {
      title: '操作',
      key: 'tags',
      width: 200,
      render: (text:string, record:any) => {
        const { reportfromType, raId, raName } = record
        return (
          <span>
            {
              isAuthenticated(detail) &&
                <a style={{ margin: '0 13px' }} onClick={(e) => this.showDetail(record, e)} title="用户查看" className="mgl10">查看</a>
            }
            {
              isAuthenticated(excelloader) &&
                <BasicDowloadFont action={this.api.filexport}
                  parmsData={{ raId: raId }}
                  type="default"
                  fileName={raName}
                  isLoadeTime={true} // 是否下文件名后面加时间
                  className="btn-style"
                  dowloadURL="URL"
                >
                  下载Excel文件
                </BasicDowloadFont>
            }
            {/* {((reportfromType === '花名册汇总表') || (reportfromType === '在职名单汇总表') || (reportfromType === '离职名单汇总表')) && isAuthenticated(pdfloader)
              ? null
              : <span style={{ margin: '0 13px' }}>
                <BasicDowloadFont action={this.api.dynamicRequest}
                  parmsData={{ raId: raId }}
                  type="default"
                  suffix=".pdf"
                  isLoadeTime={true} // 是否下文件名后面加时间
                  fileName={raName}
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
    let columnData = [
      { title: '序号', dataIndex: 'index', align: 'center', width: 100 },
      { title: '报表名称',
        dataIndex: 'raName',
        width: 200,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      { title: '年份',
        dataIndex: 'reportYear',
        width: 80,
        render: (text:string) => (<span>{text + '年' || '- - -'}</span>)
      },
      { title: '月份',
        dataIndex: 'reportMonth',
        width: 80,
        render: (text:string) => (<span>{(+text < 10) ? '0' + text + '月' : text + '月' || '- - -'}</span>)
      },
      { title: '归档人',
        dataIndex: 'raUserName',
        width: 80,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '归档时间',
        dataIndex: 'createTime',
        width: 120,
        render: (text:string) => (<span>{text || '- - -'}</span>),
        sorter: (a:any, b:any) => Date.parse(a.createTime.replace('-', '/').replace('-', '/')) - Date.parse(b.createTime.replace('-', '/').replace('-', '/'))
      }
    ]
    if (isAuthenticated(detail) || isAuthenticated(excelloader) || isAuthenticated(pdfloader)) {
      columnData.push(tags)
    }
    return (
      <div id="file-report-form-page">
        <Row style={{ marginBottom: 20 }}>
          <WrappedFormCompoent report={report} searchParams={searchParams} searchData={this.searchData} {...this.props} />
        </Row>
        <TableItem
          mock={false}
          filterKey="index"
          rowKey={({ index }) => index}
          searchParams={searchParams}
          rowSelection={false}
          URL={api.filereportlist}
          columns={columnData}
        />
      </div>
    )
  }
}
