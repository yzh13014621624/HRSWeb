/**
 * @author lixinying
 * @createTime 2019/04/08
 * @lastEditTim 2019/04/10
 * @description 薪资界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, FileUpload, BasicDowload, TableItem, BasicModal } from '@components/index'
import AddNewStaffComponent from '@shared/addnewstaff'
import SysUtil from '@utils/SysUtil'
import { Form, Input, Select, Button, Row, Col, Divider, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'

import SharedStructure from '@shared/structure/SharedStructure'

import { IconDr, IconDc, IconXz } from '@components/icon/BasicIcon'

import moment from 'moment'

import './SalaryPage.styl'

import {
  BaseProps,
  KeyValue
} from 'typings/global'

interface SearchParams {
  selectValue?: string
  filterNumberType?: string
  userName?: string
  organize?: string[]
  projectNumber?: string
  sjNumber?: string
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
interface PageState extends PageSearchState {
  isSingleRemove: boolean
}

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
    const { props: { searchParams, form: { getFieldDecorator } } } = this
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

@hot(module) // 热更新（局部刷新界面）
export default class SalaryPage extends RootComponent<BaseProps, PageState> {
  modal = React.createRef<AddNewStaffComponent>()
  tipsModal = React.createRef<BasicModal>()
  table = React.createRef<TableItem<{}>>()
  selectedRowKeys: (string|number)[] = []
  currentStaffInfo: KeyValue = {}

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('SalaryPage_searchParams')
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
      },
      isSingleRemove: true
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

  // 新增
  addNewStaffData = () => {
    (this.modal.current as AddNewStaffComponent).showModal()
  }
  // 读取新增表格筛选内容
  getSelectedStaff = (selectedStaff: KeyValue) => {
    SysUtil.setSessionStorage('SalaryAdd', selectedStaff)
    this.props.history.push('/home/salaryPage/salaryAdd')
  }

  viewStaffSalaryDetail = (selectedStaff: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('SalaryEdit', selectedStaff)
    this.props.history.push('/home/salaryPage/salaryDetails')
  }

  handleRemove = (isSingleRemove: boolean, currentStaffInfo: any, e: React.MouseEvent) => {
    e.stopPropagation()
    this.showModal(isSingleRemove)
    this.currentStaffInfo = currentStaffInfo
  }

  showModal = async (isSingleRemove: boolean) => {
    await this.setState({
      isSingleRemove
    })
    ;(this.tipsModal.current as BasicModal).handleOk()
  }

  hideModal = () => {
    (this.tipsModal.current as BasicModal).handleCancel()
  }

  // 删除员工信息
  confirmRemoveStaffInfo = () => {
    const { isSingleRemove } = this.state
    const { api, axios, selectedRowKeys, currentStaffInfo } = this
    let idDeleteList: (string|number)[] | string
    if (isSingleRemove) {
      idDeleteList = [currentStaffInfo.id]
    } else {
      if (!selectedRowKeys.length) {
        this.$message.warn('请选择需删除的员工薪资记录', 2)
        return
      }
      idDeleteList = selectedRowKeys
    }
    axios.request(api.salaryDelete, { idDeleteList }).then(() => {
      if (!isSingleRemove) this.selectedRowKeys = []
      ;(this.table.current as TableItem<{}>).deletedAndUpdateTableData()
      this.hideModal()
    }).catch(({ msg }) => {
      this.$message.error(msg[0])
    })
  }

  /* 获取多选选中 */
  getSelectedRow = (selectedRowKeys: any[], selectedRows: any[]) => {
    this.selectedRowKeys = selectedRowKeys
  }

  render () {
    const [, add, view, , del, im, ex, dl, xg] = this.AuthorityList.salary
    const canIView = this.isAuthenticated(view)
    const canIDel = this.isAuthenticated(del)
    const { salaryExport, salarySelectedExport, salaryImport, salaryImportAndModify, salaryDownloadTemplate, salaryChoose, salaryList } = this.api
    const { isSingleRemove } = this.state
    const FilterComponent = Form.create<FilterProps>()(TableFilterComponent)
    const { userName, organize, selectValue, sjNumber = '', projectNumber = '' } = this.state.searchParams as KeyValue
    const searchParams: KeyValue = { userName, organizeArr: organize, selectValue }
    if (selectValue === '管理编号') searchParams.sjNumber = sjNumber
    else searchParams.projectNumber = projectNumber
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 100 },
      { title: '项目', dataIndex: 'userInfo.projectName', width: 100 },
      { title: '工号', dataIndex: 'userInfo.projectNumber', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '管理编号', dataIndex: 'userInfo.sjNumber', width: 100 },
      { title: '姓名', dataIndex: 'userInfo.userName', width: 100 },
      { title: '组织', dataIndex: 'userInfo.organize', width: 200 },
      { title: '员工类型', dataIndex: 'userInfo.roleType', width: 100 },
      { title: '法人主体', dataIndex: 'userInfo.entity', width: 200 },
      { title: '工时类型', dataIndex: 'hourType', width: 100 },
      { title: '计税类型', dataIndex: 'taxationType', width: 100 },
      { title: '薪资等级', dataIndex: 'levelName', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '薪资档级', dataIndex: 'gradeName', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '薪资层级', dataIndex: 'rankName', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '基本工资', dataIndex: 'baseSalary', width: 100 },
      { title: '绩效工资', dataIndex: 'performanceSalary', width: 100 },
      { title: '试用期基本工资', dataIndex: 'probationBaseSalary', width: 120 },
      { title: '试用期绩效工资', dataIndex: 'probationPerSalary', width: 120 },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
        sorter: (a: KeyValue, b: KeyValue) => moment(a.createTime).isBefore(b.createTime)
      },
      {
        title: '操作',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (text: string, record: KeyValue) => (
          <span>
            {
              canIView &&
              <a onClick={this.viewStaffSalaryDetail.bind(this, record)}>查看</a>
            }
            {/* {
              canIDel &&
              <a onClick={this.handleRemove.bind(this, true, record, e)}>删除</a>
            } */}
          </span>
        )
      }
    ]
    if (!canIView && !canIDel) columnData.splice(columnData.length - 1)
    const width = columnData.reduce((total, { width = 0 }) => total + width, 0)
    return (
      <div style={{ padding: 20 }}>
        <AddNewStaffComponent
          {...this.props}
          ref={this.modal}
          url={salaryChoose}
          exportUrl={salarySelectedExport}
          exportField="exportChooseListRequest"
          getSelectedStaff={this.getSelectedStaff} />
        <FilterComponent getFilterData={this.getFilterData} searchParams={this.state.searchParams} />
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Col>
            {
              this.isAuthenticated(add) &&
              <Button type="primary" icon="plus-circle" onClick={this.addNewStaffData}>新增</Button>
            }
            {/* {
              canIDel &&
              <Button className="custom-page-btn" type="primary" icon="delete" onClick={this.handleRemove.bind(this, false, 0)}>批量删除</Button>
            } */}
            {
              this.isAuthenticated(im) &&
              <FileUpload action={salaryImport.path}>
                <Button className="custom-page-btn" type="primary">
                  <Icon component={IconDr} />导入
                </Button>
              </FileUpload>
            }
            {/* {
              // this.isAuthenticated(xg) &&
              <FileUpload action={salaryImportAndModify.path}>
                <Button className="custom-page-btn" type="primary">
                  <Icon component={IconDr} />导入(修改)
                </Button>
              </FileUpload>
            } */}
            {
              this.isAuthenticated(ex) &&
              <BasicDowload
                fileName="HR薪资信息导出"
                className="custom-page-btn"
                btntype="primary"
                dowloadURL="URL"
                action={salaryExport}
                parmsData={searchParams}>
                <Icon component={IconDc} />导出
              </BasicDowload>
            }
            {
              this.isAuthenticated(dl) &&
              <BasicDowload
                fileName="HR薪资信息导入模板"
                className="custom-page-btn"
                btntype="primary"
                action={salaryDownloadTemplate}
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
          URL={salaryList}
          searchParams={searchParams}
          columns={columnData}
          getSelectedRow={this.getSelectedRow}
          bufferSearchParamsKey='SalaryPage_searchParams'
        />
        {/* 删除提示 */}
        <BasicModal ref={this.tipsModal}>
          <h2 className="tips_text">
            {isSingleRemove ? '删除后该员工异动，离职信息将一并删除，是否确认？' : '删除后员工异动，离职信息将一并删除，是否确认？'}
          </h2>
          <Row className="remove_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.confirmRemoveStaffInfo}>是</Button>
            <Button className="ant_button_cancel" onClick={this.hideModal}>否</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
