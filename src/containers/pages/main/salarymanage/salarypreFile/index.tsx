/*
 * @description: 薪资归档主页面
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-19 15:50:07
 * @LastEditTime: 2020-06-01 12:18:23
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicDowloadFont } from '@components/index'
import { Button, Form, Row, DatePicker, Select, Icon, Modal, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import SysUtil from '@utils/SysUtil'
import moment from 'moment'
import './index.styl'
const { Item } = Form
const { MonthPicker } = DatePicker

interface UrlInteface {
  path:string
  fileName?:string
  suffix?:string
}

interface State {
  visible: boolean
  searchParams: KeyValue
  params: UrlInteface[]
}

interface SalaryprefileProps extends BaseProps, FormComponentProps {}

class Salaryprefile extends RootComponent<SalaryprefileProps, State> {
  submitModalRef = React.createRef<BasicDowload>()
  constructor (props: any) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('salarypreFile_searchParams')
    console.log(searchParams, 'searchParams')
    this.state = {
      visible: false, // 模态框是否展示
      searchParams: searchParams || {
        month: moment().subtract(1, 'months').format('YYYY-MM-DD')
      },
      params: [
        {
          path: 'url',
          fileName: '测试名称',
          suffix: 'xlsx'
        }
      ]
    }
  }

  // 列表选中数据
  getSelect = (selectedRowKeys: any, selectedRows: any) => {
    const params: any[] = []
    selectedRowKeys.map((archiveId: any) => {
      params.push({
        ...this.api.SalaryFileExportArchiveList,
        fileName: '测试名称',
        suffix: 'xlsx',
        parmsData: {
          archiveId
        }
      })
    })
    this.setState({
      params
    })
  }

  // 搜素按钮
  searchBtn = () => {
    const formValues = this.props.form.getFieldsValue()
    this.setState({
      searchParams: {
        month: formValues.month ? moment(formValues.month).format('YYYY-MM-DD') : undefined
      }
    })
  }

  dowloadBtn = () => {
    Modal.warning({
      title: '提示',
      content: '请先选择需下载的文件！'
    })
  }

  handleSearch = (records: KeyValue) => {
    const { history } = this.props
    const { fileName, type, month, archiveId, saId } = records
    history.push(`salaryprefile/salaryprefiledetail?fileName=${fileName}&type=${type}&month=${month}&archiveId=${archiveId}&saId=${saId}`)
  }

  render () {
    const { state: { searchParams, params }, isAuthenticated, AuthorityList: { salaryprefile } } = this
    const { getFieldDecorator } = this.props.form
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 150 },
      { title: '文件名', dataIndex: 'fileName', width: 320 },
      { title: '项目', dataIndex: 'projectName', width: 200 },
      { title: '月度', dataIndex: 'month', width: 300 },
      {
        title: '操作',
        render: (text: any, records: any) => {
          return (
            <div style={{ color: '#40A9FF' }}>
              {
                isAuthenticated(salaryprefile[1]) &&
                <span style = {{ marginRight: '20px', cursor: 'pointer' }} onClick={() => this.handleSearch(records)}>查看</span>
              }
              {
                isAuthenticated(salaryprefile[2]) &&
                <BasicDowloadFont
                  action={this.api.SalaryFileExportArchiveList}
                  parmsData={{
                    archiveId: records.archiveId
                  }}
                  isLoadeTime={true} // 是否下文件名后面加时间，true为不带时间
                  fileName={records.fileName}
                  type="default"
                  className="btn-style"
                >
                  下载Excel文件
                </BasicDowloadFont>
              }
            </div>
          )
        }
      }
    ]
    return (
      <div id='salaryprefile'>
        <Row className='salaryprefile-search' type='flex' justify='space-between'>
          <Form layout='inline'>
            <Item label='月度：' >
              {getFieldDecorator('month', {
                initialValue: searchParams.month ? moment(String(searchParams.month), 'YYYY-MM-DD') : undefined
              })(<MonthPicker format="YYYY年MM月"/>)}
            </Item>
            <Item>
              <Button type='primary' className='contract-search-button' onClick={this.searchBtn}>搜索</Button>
            </Item>
          </Form>
          {
            (params.length > 0 && params[0].path !== 'url' && isAuthenticated(salaryprefile[3]))
              ? <BasicDowload
                multiDownload={params}
                type='default'
                dowloadURL="URL"
                btntype='primary'
              >
                <span>批量下载</span>
              </BasicDowload>
              : <Button type='primary' onClick={this.dowloadBtn}>批量下载</Button>
          }
        </Row>
        <Row className='salaryprefile-content'>
          <TableItem
            rowSelectionFixed
            filterKey="archiveId"
            rowKey={({ archiveId }) => archiveId}
            URL={this.api.QueryArchiveList}
            searchParams={ searchParams }
            columns={columnData}
            scroll={{ x: 1000 }}
            getSelectedRow={this.getSelect}
            bufferSearchParamsKey='salarypreFile_searchParams'
          />
        </Row>
      </div>
    )
  }
}
const salaryprefile = Form.create<SalaryprefileProps>()(Salaryprefile)
export default salaryprefile
