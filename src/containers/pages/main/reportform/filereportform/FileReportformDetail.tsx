/**
 * @author maqian
 * @createTime 2019/04/25
 * @description 报表中心-归档报表详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import ReportformCommon from '@shared/reportform/ReportformCommon'
import { EmptyTable, ReportTable } from '@components/empty/BasicEmpty'
import { Button, Form, Row, Input, Spin } from 'antd'
import SysUtil from '@utils/SysUtil'
import './style/FileReportformDetail.styl'

interface FileReportformDetailProps extends FormComponentProps {
  history?:any
}

@hot(module)
class FileReportformDetail extends RootComponent<FileReportformDetailProps, any> {
  columnData: any[]
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    this.columnData = []
    let raId = params.get('raId')
    this.state = {
      formType: params.get('type') || '',
      formTitle: params.get('title') || '', // 获取的表的名称
      raId: raId ? +raId : 0,
      searchParams: {
        raId: raId ? +raId : 0,
        gbKeyword: ''
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
    const { searchParams, formType, showPic, raId } = this.state
    const { reportYear, reportMonth } = searchParams
    this.props.form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        if (values.gbKeyword === undefined || values.gbKeyword === null || values.gbKeyword === '') {
          values.gbKeyword = ''
          this.setState({
            showPic: false
          })
        }
        if (values.gbKeyword) {
          this.setState({
            showPic: true
          })
        }
        let data = {
          raId: raId,
          gbKeyword: values.gbKeyword.replace(/^\s*|\s*$/g, '')
        }
        this.setState({
          searchParams: data
        })
        this.axios.request(this.api.filereportDetail, data).then((res:any) => {
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
    let data = SysUtil.getSessionStorage('fileMonthDate')
    if (data) {
      this.routerLink(`/home/FileReportformPage?date=${data}`)
    } else {
      this.routerLink(`/home/FileReportformPage`)
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
    const { formTitle, formType, raId, searchParams, loading, columnData, showPic } = this.state
    const [ , , excelloader, pdfloader, sousuo ] = this.AuthorityList.filereportform
    return (
      <div id="file-reportform-detail">
        <Spin tip="Loading..." spinning={loading}>
          <Row style={{ textAlign: 'center' }}>
            <span className="file-reportform-title">{formTitle}</span>
          </Row>
          <Row className='file-reportform-sohu'>
            {
              this.isAuthenticated(sousuo) &&
                <Form layout="inline" onSubmit={this.handleSumbit}>
                  <Form.Item>
                    {getFieldDecorator('gbKeyword', {
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
          {
            showPic
              ? <ReportformCommon
                formType={formType}
                columnData={columnData}
                onChanges={this.onChanges}
                raId={+raId}
                searchParams={searchParams}
                ReportTable={ReportTable} // 暂无关键字
                requestUrl={this.api.filereportDetail} // 换接口
                dataSourcePic={false}
              />
              : <ReportformCommon
                formType={formType}
                onChanges={this.onChanges}
                columnData={columnData}
                raId={+raId}
                ReportTable={EmptyTable}
                searchParams={searchParams}
                requestUrl={this.api.filereportDetail}
                dataSourcePic={true}
              />
          }
          <Row className="file-reportform-btn-mt">
            {this.isAuthenticated(excelloader) &&
              <BasicDowload
                action={this.api.filexport}
                parmsData={{ raId: +raId }}
                fileName={formTitle}
                isLoadeTime={true} // 是否下文件名后面加时间
                type="default"
                className="btn-style"
                dowloadURL="URL"
              >
                下载Excel文件
              </BasicDowload>
            }
            {/* {
              (((formType !== '花名册汇总表') && (formType !== '在职名单汇总表') && (formType !== '离职名单汇总表')) && columnData.length > 0 && this.isAuthenticated(pdfloader))
                ? <BasicDowload action={this.api.dynamicRequest}
                  parmsData={{ raId: raId }}
                  fileName={formTitle}
                  loadDate={null}
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
const WrappedRegistrationForm = Form.create()(FileReportformDetail)
export default WrappedRegistrationForm
