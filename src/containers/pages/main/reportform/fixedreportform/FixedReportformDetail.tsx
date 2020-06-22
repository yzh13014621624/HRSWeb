/**
 * @author maqian
 * @createTime 2019/04/25
 * @description 报表中心-固定报表详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { TableItem, RootComponent, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import ReportformCommon from '@shared/reportform/ReportformCommon'
import { FormComponentProps } from 'antd/lib/form'
import SysUtil from '@utils/SysUtil'
import { EmptyTable, ReportTable } from '@components/empty/BasicEmpty'
import { Button, Form, Row, Input, Spin } from 'antd'
import './style/FixedReportformDetail.styl'
import NumberFormat from '@utils/NumberFormat'

interface FixedReportformDetailProps extends FormComponentProps {
  history?:any
}
@hot(module)
class FixedReportformDetail extends RootComponent<FixedReportformDetailProps, any> {
  columnData: any[]
  constructor (props:any) {
    super(props)
    this.columnData = []
    const { location } = props
    let params = new URLSearchParams(location.search)
    let data = SysUtil.getSessionStorage('fixData')
    this.state = {
      formType: params.get('type') || '',
      formTitle: params.get('title') || '', // 获取的表的名称
      searchParams: {
        keyword: '',
        reportFromType: data.reportType,
        reportYear: data.reportYear,
        reportMonth: data.reportMonth
      },
      loading: false,
      columnData: [],
      showPic: false
    }
  }
  componentDidMount () {
    this.setState({
      loading: true
    })
  }
  handleSumbit = (e:any) => {
    e.preventDefault()
    const { searchParams, formType } = this.state
    const { reportYear, reportMonth } = searchParams
    this.props.form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        if (values.keyword === undefined || values.keyword === null || values.keyword === '') {
          values.keyword = ''
          this.setState({
            showPic: false
          })
        }
        if (values.keyword) {
          this.setState({
            showPic: true
          })
        }
        let data = {
          keyword: values.keyword.replace(/^\s*|\s*$/g, ''),
          reportFromType: formType,
          reportYear: reportYear,
          reportMonth: reportMonth
        }
        this.setState({
          searchParams: data
        })
        this.axios.request(this.api.fixreportdetail, data).then((res:any) => {
          // 消息提示 路径跳转
          let data = res.data.data
          data.forEach((item: any, i: number) => {
            item.index = (i + 1)
          })
          this.setState({
            columnData: data
          })
        }).catch((err:any) => {
          console.log(err)
        })
      }
    })
  }
  closeClick = (e:any) => {
    e.preventDefault()
    SysUtil.clearSession('fixData')
    let data = SysUtil.getSessionStorage('fixMonthDate')
    if (data) {
      this.routerLink(`/home/FixedReportformPage?date=${data}`)
    } else {
      this.routerLink(`/home/FixedReportformPage`)
    }
  }
  routerLink = (path:string) => {
    this.props.history.push(path)
  }
  onChanges = (data:any, loading:boolean) => {
    this.setState({
      columnData: data,
      loading
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const [ , , sousuo, exceloade, pdfloade ] = this.AuthorityList.fixedreportform
    const { formTitle, formType, searchParams, loading, showPic, columnData } = this.state
    return (
      <div id="fixed-reportform-detail">
        <Spin tip="Loading..." spinning={loading}>
          <Row style={{ textAlign: 'center' }}>
            <span className="fixed-reportform-title">{formTitle}</span>
          </Row>
          <Row className='fixed-reportform-sohu'>
            {
              this.isAuthenticated(sousuo) &&
                <Form layout="inline" onSubmit={this.handleSumbit}>
                  <Form.Item>
                    {getFieldDecorator('keyword', {
                    })(
                      <Input placeholder="请输入关键词" allowClear width="220" />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" >搜索</Button>
                  </Form.Item>
                </Form>
            }
          </Row>
          { showPic
            ? <ReportformCommon
              formType={formType}
              columnData={columnData}
              onChanges={this.onChanges}
              searchParams={searchParams}
              ReportTable={ReportTable} // 暂无关键字
              requestUrl={this.api.fixreportdetail} // 换接口
              dataSourcePic={false}
            />
            : <ReportformCommon
              formType={formType}
              columnData={columnData}
              onChanges={this.onChanges}
              searchParams={searchParams}
              ReportTable={EmptyTable} // 暂无数据
              requestUrl={this.api.fixreportdetail} // 换接口
              dataSourcePic={true}
            />
          }
          <Row className="fixed-reportform-btn-mt">
            {this.isAuthenticated(exceloade) &&
              <BasicDowload action={this.api.detailExport}
                parmsData={searchParams}
                fileName={formTitle}
                isLoadeTime={true} // 是否下文件名后面加时间
                type="default"
                dowloadURL="URL"
                className="btn-style"
              >
                下载Excel文件
              </BasicDowload>
            }
            {/* {
              (((formType !== '花名册汇总表') && (formType !== '在职名单汇总表') && (formType !== '离职名单汇总表')) && columnData.length > 0 && this.isAuthenticated(pdfloade))
                ? <BasicDowload action={this.api.dynamicRequest}
                  parmsData={searchParams}
                  fileName={formTitle}
                  isLoadeTime={true} // 是否下文件名后面加时间
                  type="default"
                  suffix=".pdf"
                  className="btn-style btn-margin"
                >
                  下载PDF文件
                </BasicDowload>
                : null
            } */}
            <Button className="return_button" onClick={(e:any) => { this.closeClick(e) } }>返回</Button>
          </Row>
        </Spin>
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create()(FixedReportformDetail)
export default WrappedRegistrationForm
