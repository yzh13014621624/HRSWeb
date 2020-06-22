/*
 * @description: 新增公共弹窗
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-07 15:12:34
 * @LastEditTime: 2020-05-28 12:14:41
 */
import * as React from 'react'
import { RootComponent, BasicDowload, TableItem } from '@components/index'
import SharedStructure from '@shared/structure/SharedStructure'
import { Form, Input, Select, Button, Row, Col, Modal, Icon } from 'antd'
import { IconDc } from '@components/icon/BasicIcon'

import './index.styl'

import { FormComponentProps } from 'antd/lib/form'
import {
  BaseProps,
  KeyValue
} from 'typings/global'

interface UrlInteface {
  path:string
  type?:string
}
interface SearchParams {
  selectValue?: string
  filterNumberType?: string
  userName?: string
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
interface NewStaffProps extends BaseProps {
  url: UrlInteface // 选择员工接口
  exportUrl?: UrlInteface // 导出接口
  exportField?: string // 导出接口的字段名
  column?: KeyValue[]
  getSelectedStaff: (data: KeyValue) => void
}
interface NewStaffState extends PageSearchState {
  showAddModal: boolean
  selectedStaffData: KeyValue[]
}

// 表头配置
const tableHeader = [
  { title: '序号', dataIndex: 'index', width: 100 },
  { title: '项目', dataIndex: 'projectName', width: 100 },
  { title: '工号', dataIndex: 'projectNumber', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
  { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
  { title: '姓名', dataIndex: 'userName', width: 100 },
  { title: '组织', dataIndex: 'organize', width: 200 },
  { title: '在职状态', dataIndex: 'workCondition', width: 100 },
  { title: '入职日期', dataIndex: 'entryTime', width: 100 }
]

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
            <Form.Item>
              {
                getFieldDecorator('selectValue', {
                  initialValue: searchParams.selectValue
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getSelectValue} style={{ width: '0.63rem', height: '0.21rem' }}>
                    <Select.Option value="管理编号">管理编号</Select.Option>
                    <Select.Option value="工号">工号</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('filterNumberType', {
                  initialValue: searchParams.filterNumberType,
                  validateTrigger: 'onBlur',
                  rules: [{
                    validator: (rule: KeyValue, value: string, callback: Function) => {
                      this.validateFields(rule, value, callback)
                    }
                  }]
                })(
                  <Input
                    allowClear
                    placeholder={`请输入${searchParams.selectValue}`}
                    onChange={() => this.clearFieldValue('filterNumberType')}
                    className={`${this.state.isPassProductId ? null : 'error_border'} input-180`} />
                )
              }
            </Form.Item>
            <Form.Item>
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
                    allowClear
                    placeholder="请输入姓名"
                    onChange={() => this.clearFieldValue('userName')}
                    className={`${this.state.isPassUserName ? null : 'error_border'} input-180`} />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('organize', {
                  initialValue: searchParams.organize
                })(
                  <SharedStructure type="string" multiple width="0.94rem" />
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

export default class AddNewStaffComponent extends RootComponent<NewStaffProps, NewStaffState> {
  table: React.RefObject<TableItem<{}>>

  constructor (props: NewStaffProps) {
    super(props)
    this.state = {
      searchParams: {
        selectValue: '管理编号',
        filterNumberType: '',
        userName: '',
        organize: []
      },
      showAddModal: false,
      selectedStaffData: []
    }
    this.table = React.createRef()
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

  getAddSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    this.setState({
      selectedStaffData: selectedRows
    })
  }

  showModal = () => {
    this.setState({
      showAddModal: true
    })
  }

  hideModal = () => {
    this.setState({
      showAddModal: false,
      searchParams: {
        selectValue: '管理编号',
        filterNumberType: '',
        userName: '',
        organize: []
      }
    })
  }

  confirmAddModal = () => {
    const data = this.state.selectedStaffData
    if (!data.length) {
      this.$message.warn('请选择员工', 2)
      return
    }
    this.props.getSelectedStaff(data[0])
    this.hideModal()
  }

  cancelModal = () => {
    this.hideModal()
  }

  render () {
    const { exportUrl, exportField, url, column } = this.props
    const FilterComponent = Form.create<FilterProps>()(TableFilterComponent)
    const columns = column || tableHeader
    const { selectValue, filterNumberType = '', userName, organize } = this.state.searchParams as KeyValue
    const params: KeyValue = { userName, organizeArr: organize }
    if (selectValue === '管理编号') params.sjNumber = filterNumberType
    else params.projectNumber = filterNumberType
    return (
      <Modal
        className="add_new_staff_modal-wrapper"
        style={{ textAlign: 'center' }}
        title="选择员工"
        destroyOnClose
        // centered={true}
        footer={null}
        width={1000}
        visible={this.state.showAddModal}
        onCancel={this.cancelModal}>
        <div className="add_new_staff-wrapper">
          <FilterComponent getFilterData={this.getFilterData} searchParams={this.state.searchParams}/>
          {exportUrl &&
            <BasicDowload
              fileName="HR员工信息导出"
              className="custom-page-btn"
              btntype="primary"
              dowloadURL="URL"
              action={exportUrl}
              // parmsData={{ [exportField as string]: params }}>
              parmsData={params}>
              <Icon component={IconDc} />导出
            </BasicDowload>
          }
        </div>
        <TableItem
          ref={this.table}
          onRow={true}
          URL={url}
          searchParams={params}
          getSelectedRow={this.getAddSelectedRow}
          rowSelectionType="radio"
          filterKey={'userId'}
          rowKey={({ userId }) => userId}
          columns={columns} />
        <Row style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Button
            className="confirm_button"
            type="primary"
            onClick={this.confirmAddModal}>
            确定
          </Button>
          <Button
            className="cancel_button"
            onClick={this.cancelModal}>
            取消
          </Button>
        </Row>
      </Modal>
    )
  }
}
