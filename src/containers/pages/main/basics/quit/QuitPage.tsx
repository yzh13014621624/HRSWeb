/**
 * @author lixinying
 * @createTime 2019/04/03
 * @lastEditTim 2019/04/10
 * @description 离职界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, FileUpload, BasicDowload, TableItem, BasicModal } from '@components/index'
import AddNewStaffComponent from '@shared/addnewstaff'
import { Form, Input, Select, Button, Row, Col, Divider, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'

import moment from 'moment'

import SysUtil from '@utils/SysUtil'

import SharedStructure from '@shared/structure/SharedStructure'

import { IconTj, IconDr, IconDc, IconXz } from '@components/icon/BasicIcon'

import './QuitPage.less'

import { BaseProps, KeyValue } from 'typings/global'

interface SearchParams {
  selectValue?: string
  filterNumberType?: string
  userName?: string
  projectNumber?: string
  sjNumber?: string
  organize?: string[]
}
interface PageSearchState extends KeyValue {
  searchParams?: SearchParams | {}
}
interface FilterProps extends BaseProps, FormComponentProps {
  getFilterData: (data: SearchParams) => void
  searchParams: SearchParams
}
interface FilterState {
  isPassProductId: boolean
  isPassUserName: boolean
}
interface PageState extends PageSearchState {}

class TableFilterComponent extends RootComponent<FilterProps, FilterState> {
  timerId: any
  tipsTimerId: any
  showTips: boolean
  constructor (props: FilterProps) {
    super(props)
    this.timerId = 0
    this.tipsTimerId = 0
    this.showTips = true
    this.state = {
      isPassProductId: true,
      isPassUserName: true
    }
  }
  validateFields = (rule: KeyValue, value: string, callback: Function) => {
    const { fullField } = rule
    let tips = ''
    if (fullField === 'filterNumberType') {
      const reg = /^[a-zA-Z0-9]+$/g
      if (value.trim() && !reg.test(value)) {
        this.setState({
          isPassProductId: false
        })
        tips = '工号为字母或数字'
      } else {
        this.setState({
          isPassProductId: true
        })
      }
    } else {
      const reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){0,15}$/g
      if (value.trim() && !reg.test(value)) {
        this.setState({
          isPassUserName: false
        })
        tips = '姓名为中英文最多可输入15字'
      } else {
        this.setState({
          isPassUserName: true
        })
      }
    }
    if (tips && this.showTips) {
      this.$message.error(tips, 2)
      this.showTips = false
      this.tipsTimerId = setTimeout(() => {
        this.showTips = true
      }, 2000)
    }
    callback()
  }
  getSelectValue = () => {
    setTimeout(() => {
      const { isPassProductId, isPassUserName } = this.state
      if (!isPassProductId || !isPassUserName) return
      const { form, getFilterData } = this.props
      const data = form.getFieldsValue()
      getFilterData(data as SearchParams)
    }, 50)
  }
  // 修正点击 input 清空按钮时候表单框不变色问题
  clearFieldValue = (key: string) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      const { getFieldValue } = this.props.form
      const val = getFieldValue(key)
      if (!val.trim()) {
        if (key === 'filterNumberType') {
          this.setState({
            isPassProductId: true
          })
        } else {
          this.setState({
            isPassUserName: true
          })
        }
      }
    }, 0)
  }
  searchTableData = (e: any) => {
    const { isPassProductId, isPassUserName } = this.state
    if (!isPassProductId || !isPassUserName) return
    e.preventDefault()
    const { form, getFilterData } = this.props
    const data = form.getFieldsValue()
    getFilterData(data as SearchParams)
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { searchParams } = this.props
    return (
      <Row>
        <Col>
          <Form layout="inline" onSubmit={this.searchTableData}>
            <Form.Item style={{ marginRight: 20 }}>
              {
                getFieldDecorator('selectValue', {
                  initialValue: searchParams.selectValue || '管理编号'
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '0.625rem' }} onChange={this.getSelectValue}>
                    <Select.Option value="管理编号">管理编号</Select.Option>
                    <Select.Option value="工号">工号</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item style={{ marginRight: 20 }}>
              {
                getFieldDecorator('filterNumberType', {
                  initialValue: searchParams.filterNumberType ? searchParams.filterNumberType : (searchParams.projectNumber || searchParams.sjNumber),
                  validateTrigger: 'onBlur',
                  rules: [{
                    validator: (rule: KeyValue, value: string, callback: Function) => {
                      this.validateFields(rule, value, callback)
                    }
                  }]
                })(
                  <Input
                    style={{ width: '1.145rem' }}
                    allowClear
                    placeholder={`请输入${searchParams.selectValue || '管理编号'}`}
                    onChange={() => this.clearFieldValue('filterNumberType')}
                    className={`${this.state.isPassProductId ? null : 'error_border'}`} />
                )
              }
            </Form.Item>
            <Form.Item style={{ marginRight: 20 }}>
              {
                getFieldDecorator('userName', {
                  initialValue: searchParams.userName,
                  validateTrigger: 'onBlur',
                  rules: [{
                    validator: (rule: KeyValue, value: string, callback: Function) => {
                      this.validateFields(rule, value, callback)
                    }
                  }]
                })(
                  <Input
                    style={{ width: '1.145rem' }}
                    allowClear
                    placeholder="请输入姓名"
                    onChange={() => this.clearFieldValue('userName')}
                    className={`${this.state.isPassUserName ? null : 'error_border'}`} />
                )
              }
            </Form.Item>
            <Form.Item style={{ marginRight: 20 }}>
              {
                getFieldDecorator('organize', {
                  initialValue: searchParams.organize
                })(
                  <SharedStructure type="string" multiple />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    )
  }
  componentWillUnmount () {
    clearTimeout(this.timerId)
    clearTimeout(this.tipsTimerId)
  }
}

@hot(module)
export default class QuitPage extends RootComponent<BaseProps, PageState> {
  modal = React.createRef<AddNewStaffComponent>()
  table = React.createRef<TableItem<{}>>()
  selectedRowKeys: (string|number)[] = []

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('QuitPage_searchParams')
    if (searchParams) {
      searchParams.organize = searchParams.organizeArr
      delete searchParams.organizeArr
    }
    this.state = {
      searchParams: searchParams || {
        selectValue: '管理编号',
        filterNumberType: '',
        userName: '',
        organize: []
      }
    }
  }

  // 读取表格筛选内容
  getFilterData = ({ selectValue, filterNumberType, userName, organize }: SearchParams) => {
    const searchParams: KeyValue = {
      userName,
      organize,
      selectValue,
      filterNumberType
    }
    if (selectValue === '管理编号') searchParams.sjNumber = filterNumberType
    else searchParams.projectNumber = filterNumberType
    this.setState({
      searchParams
    })
  }

  // 新增弹窗
  addNewStaffData = () => {
    (this.modal.current as AddNewStaffComponent).showModal()
  }
  // 读取新增表格筛选内容
  getSelectedStaff = (selectedStaff: KeyValue) => {
    SysUtil.setSessionStorage('QuitAdd', selectedStaff)
    this.props.history.push('/home/quitPage/quitAdd')
  }

  viewStaffQuitDetail = (selectedStaff: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('QuitEdit', selectedStaff)
    this.props.history.push('/home/quitPage/quitDetails')
  }

  /* 获取多选选中 */
  getSelectedRow = (selectedRowKeys: any[], selectedRows: any[]) => {
    this.selectedRowKeys = selectedRowKeys
  }

  render () {
    const [, add, view, , im, ex, dl] = this.AuthorityList.quit
    const { quitList, quitChoose, quitExport, quitImport, quitExportNewAdd, quitDownloadTemplate } = this.api
    const FilterComponent = Form.create<FilterProps>()(TableFilterComponent)
    const { userName, organize, selectValue, sjNumber = '', projectNumber = '' } = this.state.searchParams as KeyValue
    const searchParams: KeyValue = { userName, organizeArr: organize, selectValue }
    if (selectValue === '管理编号') searchParams.sjNumber = sjNumber
    else searchParams.projectNumber = projectNumber
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 100 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '工号', dataIndex: 'projectNumber', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      { title: '组织', dataIndex: 'organize', width: 200 },
      { title: '员工类型', dataIndex: 'roleType', width: 100 },
      { title: '合同类型', dataIndex: 'typeName', width: 200 },
      { title: '法人主体', dataIndex: 'entity', width: 200 },
      {
        title: '入职日期',
        width: 100,
        dataIndex: 'entryTime',
        sorter: (a:any, b:any) => moment(a.dateOfEntry).isBefore(b.dateOfEntry)
      },
      {
        title: '离职日期',
        dataIndex: 'quitTime',
        sorter: (a:any, b:any) => moment(a.quitTime).isBefore(b.quitTime)
      },
      {
        title: '操作',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (text: string, record: KeyValue) => (
          <span>
            <a onClick={this.viewStaffQuitDetail.bind(this, record)}>查看</a>
          </span>
        )
      }
    ]
    if (!this.isAuthenticated(view)) columnData.splice(columnData.length - 1)
    const width = columnData.reduce((total, { width = 160 }) => total + width, 0)
    return (
      <div style={{ padding: 20 }}>
        <AddNewStaffComponent
          {...this.props}
          url={quitChoose}
          exportUrl={quitExportNewAdd}
          exportField="exportJumpChooseListRequest"
          ref={this.modal}
          getSelectedStaff={this.getSelectedStaff} />
        <FilterComponent getFilterData={this.getFilterData} searchParams={this.state.searchParams} />
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Col>
            {
              this.isAuthenticated(add) &&
              <Button type="primary" icon="plus-circle" onClick={this.addNewStaffData}>新增</Button>
            }
            {
              this.isAuthenticated(im) &&
              <FileUpload action={quitImport.path}>
                <Button className="custom-page-btn" type="primary">
                  <Icon component={IconDr} />导入
                </Button>
              </FileUpload>
            }
            {
              this.isAuthenticated(ex) &&
              <BasicDowload
                fileName="HR离职信息导出"
                className="custom-page-btn"
                btntype="primary"
                dowloadURL="URL"
                action={quitExport}
                parmsData={searchParams}>
                <Icon component={IconDc} />导出
              </BasicDowload>
            }
            {
              this.isAuthenticated(dl) &&
              <BasicDowload
                fileName="HR离职信息导入模板"
                className="custom-page-btn"
                btntype="primary"
                action={quitDownloadTemplate}
                parmsData={{ type: '.xlsx' }}>
                <Icon component={IconXz} />下载导入模版
              </BasicDowload>
            }
          </Col>
        </Row>
        <TableItem
          onRow
          rowSelectionFixed
          filterKey="id"
          ref={this.table}
          rowKey={({ id }) => id}
          scroll={{ x: width }}
          URL={quitList}
          searchParams={searchParams}
          columns={columnData}
          getSelectedRow={this.getSelectedRow}
          bufferSearchParamsKey='QuitPage_searchParams'
        />
      </div>
    )
  }
}
