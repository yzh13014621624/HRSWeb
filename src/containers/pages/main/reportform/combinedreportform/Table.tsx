/*
 * @description: 组合报表的生成表格数据
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-28 13:44:26
 * @LastEditTime: 2019-11-27 16:40:42
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicDowload } from '@components/index'
import moment from 'moment'
import BasicModal from '@components/modal/BasicModal'
import { IconExportExcel, IconExportPdf, IconExportFile } from '@components/icon/BasicIcon'
import { EmptyTable } from '@components/empty/BasicEmpty'
import { Card, Row, Col, Button, Input, Icon, Table, ConfigProvider } from 'antd'

import * as TableColumns from './data'
import { inArray, compareDeep } from '@utils/ComUtil'

import './style/Table'

import { KeyValue } from 'typings/global'
import { PaginationProps } from 'antd/lib/pagination'
type CheckboxValueType = string | number | boolean

interface TableProps {
  projectCheckedList: CheckboxValueType[]
  entityCheckedList: CheckboxValueType[]
  organizeCheckedList: CheckboxValueType[]
  reportFormName: string
  templateName: string
  templateAlias: string
  reportFormDate: moment.Moment
  showModal: () => void
}

interface TableState {
  tableData: KeyValue[]
  pagination: PaginationProps
  keyWords: string
  isShowPDF: boolean
  isCreateReportForm: boolean
  isShowTable: boolean
}

export default class ReportFormTable extends RootComponent<TableProps, TableState> {
  modal = React.createRef<BasicModal>()
  modal2 = React.createRef<BasicModal>()

  constructor (props: TableProps) {
    super(props)
    this.state = {
      tableData: [],
      keyWords: '',
      isShowPDF: false,
      isCreateReportForm: true,
      isShowTable: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1,
        size: 'small',
        showQuickJumper: true,
        onChange: (page: number) => {
          const { pagination } = this.state
          pagination.current = page
          this.setState({ pagination })
          this.getTableData()
        },
        itemRender: (current: number, type: string, originalElement: any) => {
          if (type === 'prev') {
            return <Button size="small" style={{ margin: '0 6px' }}>上一页</Button>
          } if (type === 'next') {
            return <Button size="small" style={{ margin: '0 6px' }}>下一页</Button>
          }
          return originalElement
        }
      }
    }
  }

  async UNSAFE_componentWillReceiveProps (props: TableProps) {
    if (!compareDeep(this.props, props)) {
      const pagination = this.state.pagination
      pagination.current = 1
      await this.setState({ pagination })
    }
  }

  // 格式化接口数据
  formatRequestData (create: boolean) {
    const { state, props } = this
    const { keyWords } = state
    const {
      projectCheckedList, entityCheckedList, organizeCheckedList, reportFormName, templateName, reportFormDate
    } = props
    const [reportYear, reportMonth] = moment(reportFormDate).format('YYYY-MM').split('-')
    const params = {
      create,
      keyword: keyWords.trim(),
      projectIdArr: projectCheckedList,
      mainBodyIdArr: entityCheckedList,
      reportFromType: templateName,
      organizeArr: organizeCheckedList,
      reportYear: +reportYear,
      reportMonth: +reportMonth,
      reportName: reportFormName
    }
    return params
  }

  // 查询当前月度报表是否有数据
  queryReportData = async () => {
    const { axios, api, props } = this
    const { combinedQueryReportData } = api
    const { reportFormDate, templateName } = props
    const [reportYear, reportMonth] = moment(reportFormDate).format('YYYY-MM').split('-')
    const params = {
      reportFromType: templateName,
      reportYear: +reportYear,
      reportMonth: +reportMonth
    }
    await axios.request(combinedQueryReportData, params)
      .then(() => {
        this.props.showModal()
      })
      .catch(() => {
        this.showModal2()
      })
  }

  getTableData = async (create: boolean = true) => {
    const { axios, api, state: { pagination } } = this
    const { combinedQueryList } = api
    // 搜索时置为 1
    const page = create ? pagination.current! : 1
    const pageSize = pagination.pageSize!
    const params = this.formatRequestData(create)
    await axios.request(combinedQueryList, { ...params, page, pageSize })
      .then(({ data }) => {
        data.data.forEach((item: KeyValue, i: number) => {
          item.index = (i + 1) + (page - 1) * pageSize
        })
        pagination.total = data.totalNum
        this.setState({
          tableData: data.data,
          isCreateReportForm: create,
          isShowTable: true,
          pagination
        })
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  getKeyWords = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      keyWords: e.target.value
    })
  }

  exportPDFTableData = () => {
    // if (!this.showWarnTips()) return
    // const params = this.formatRequestData(false)
    // this.axios.request(this.api.combinedExportExcel, params)
    //   .then(() => {
    //     this.$message.success('导出成功！', 2)
    //   })
    //   .catch(({ msg }) => {
    //     this.$message.error(msg[0], 2)
    //   })
  }

  exportFileTableData = () => {
    const params = {
      reportName: this.props.reportFormName
    }
    this.axios.request(this.api.combinedExportFile, params)
      .then(() => {
        this.$message.success('成功归档！', 2)
        this.hideModal()
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0], 2)
      })
  }

  // 转换组织数据
  transformOrganizeData (data: string[]) {
    const organizeList: Array<number[]> = [[], [], [], []]
    data.forEach(item => {
      const [zeroId, secondId, thirdId, fourthId] = item.split('-')
      if (zeroId) {
        const { include } = inArray(+zeroId, organizeList[0])
        if (!include) organizeList[0].push(+zeroId)
      }
      if (secondId) {
        const { include } = inArray(+secondId, organizeList[1])
        if (!include) organizeList[1].push(+secondId)
      }
      if (thirdId) {
        const { include } = inArray(+thirdId, organizeList[2])
        if (!include) organizeList[2].push(+thirdId)
      }
      if (fourthId) {
        const { include } = inArray(+fourthId, organizeList[3])
        if (!include) organizeList[3].push(+fourthId)
      }
    })
    return organizeList
  }

  // 计算列宽
  computedColumnWidth () {
    const hasData = !!this.state.tableData.length
    const column: KeyValue[] = (TableColumns as KeyValue)[this.props.templateAlias] || []
    let total = 0
    column.forEach((item, i: number) => {
      if (hasData) {
        item.width = 160
        total += 160
      } else {
        item.width = 100
        total += 100
      }
      if (i < 1) item.align = 'center'
      if (!item.render) item.render = (text: string) => (<span>{text || '- - -'}</span>)
    })
    return { total, column }
  }

  // 无数据提示
  showWarnTips (tips = '无筛选结果，不可导出！') {
    if (!this.state.tableData.length) {
      this.$message.warn(tips, 2)
      return false
    }
    return true
  }

  showModal = () => {
    if (!this.showWarnTips('无筛选结果，不可归档！')) return
    this.modal.current!.handleOk()
  }

  hideModal = () => {
    this.modal.current!.handleCancel()
  }

  showModal2 = () => {
    this.modal2.current!.handleOk()
  }

  hideModal2 = () => {
    this.modal2.current!.handleCancel()
  }

  get column () {
    const { column } = this.computedColumnWidth()
    return column
  }

  get scrollX () {
    const { total } = this.computedColumnWidth()
    return total + 10
  }

  render () {
    const [,, search, file, exportExcel, exportPdf] = this.AuthorityList.combinedreportform
    const { column, scrollX, state, props, api } = this
    const { tableData, isCreateReportForm, isShowTable, pagination } = state
    const { reportFormName, templateAlias, templateName } = props
    const { combinedExportExcel } = api
    const reg = /rosterColumns|workingColumns|quitColumns/
    const params = this.formatRequestData(false)
    const tips = isCreateReportForm ? '暂无数据' : '无搜索结果'
    const Empty = () => EmptyTable({ ...props, tips })
    const hasData = tableData.length > 0
    return (
      <div>
        {
          isShowTable &&
          <Card id="table_report_form">
            <Row className="report_form_title">{reportFormName}</Row>
            <Row type="flex" justify="space-between" className="table_operate_wrapper">
              <Col>
                <Input placeholder="请输入关键词" onChange={this.getKeyWords} />
                {
                  this.isAuthenticated(search) &&
                  <Button type="primary" onClick={this.getTableData.bind(this, false)}>搜索</Button>
                }
              </Col>
              <Col>
                {
                  this.isAuthenticated(exportExcel) &&
                  <BasicDowload
                    fileName={`HR${templateName}导出文件`}
                    className="custom-page-btn"
                    btntype="primary"
                    dowloadURL="URL"
                    action={combinedExportExcel}
                    parmsData={params}>
                    <Icon component={IconExportExcel} />导出Excel文件
                  </BasicDowload>
                }
                {
                  this.isAuthenticated(exportPdf) &&
                  !reg.test(templateAlias) &&
                  <Button type="primary" onClick={this.exportPDFTableData}>
                    <Icon component={IconExportPdf}></Icon>
                    <span className="txt">导出PDF文件</span>
                  </Button>
                //   <BasicDowload
                //   fileName="HR"
                //   className="custom-page-btn"
                //   btntype="primary"
                //   action={combinedExportExcel}
                //   parmsData={params}>
                //   <Icon component={IconExportPdf} />导出PDF文件
                // </BasicDowload>
                }
                {
                  this.isAuthenticated(file) &&
                  <Button type="primary" onClick={this.showModal}>
                    <Icon component={IconExportFile}></Icon>
                    <span className="txt">归档</span>
                  </Button>
                }
              </Col>
            </Row>
            <ConfigProvider renderEmpty={Empty}>
              <Table
                bordered
                pagination={hasData ? pagination : false }
                columns={column}
                dataSource={tableData}
                // rowKey={({ rrId }: KeyValue) => rrId}
                scroll={{ x: scrollX, y: tableData.length ? 640 : 0 }}>
              </Table>
            </ConfigProvider>
          </Card>
        }
        <BasicModal ref={this.modal}>
          <h1>确认归档？</h1>
          <Row className="table_modal_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.exportFileTableData}>是</Button>
            <Button className="ant_button_cancel" onClick={this.hideModal}>否</Button>
          </Row>
        </BasicModal>
        <BasicModal ref={this.modal2}>
          <h2 className="tips_text">该月无报表数据，请重新选择月度！</h2>
          <Row className="remove_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.hideModal2}>确定</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
