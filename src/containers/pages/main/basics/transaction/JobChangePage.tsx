/*
 * @description: 基本信息 - 异动 主板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-03 14:39:46
 * @LastEditTime: 2020-05-28 15:18:48
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicDowload, TableItem, FileUpload } from '@components/index'
import AddNewStaffComponent from '@shared/addnewstaff'
import SharedStructure from '@shared/structure/SharedStructure'
import { hot } from 'react-hot-loader'
import { SysUtil, outArrayNew } from '@utils/index'
import { Form, Input, Select, Button, Row, Col, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import moment from 'moment'

import { IconTj, IconDr, IconDc, IconXz, IconFill } from '@components/icon/BasicIcon'

import './style/JobChangePage'

import {
  BaseProps,
  KeyValue
} from 'typings/global'
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
interface PageState extends PageSearchState {
  warnTips: string
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
    const { getFieldDecorator } = this.props.form
    const { searchParams } = this.props
    return (
      <Row>
        <Col>
          <Form layout="inline" onSubmit={this.searchTableData}>
            <Form.Item>
              {
                getFieldDecorator('selectValue', {
                  initialValue: searchParams.selectValue || '管理编号'
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getSelectValue} style={{ width: '0.625rem' }}>
                    <Select.Option value="管理编号">管理编号</Select.Option>
                    <Select.Option value="工号">工号</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item>
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
                    allowClear
                    placeholder={`请输入${searchParams.selectValue || ''}`}
                    onChange={() => this.clearFieldValue('filterNumberType')}
                    className={`${this.state.isPassProductId ? null : 'error_border'}`} />
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
                    className={`${this.state.isPassUserName ? null : 'error_border'}`} />
                )
              }
            </Form.Item>
            <Form.Item>
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
export default class JobChangePage extends RootComponent<BaseProps, PageState> {
  table = React.createRef<TableItem<{}>>()
  modal = React.createRef<AddNewStaffComponent>()
  tableHeader = [
    { title: '序号', dataIndex: 'index', width: 100 },
    { title: '项目', dataIndex: 'userInfo.projectName', width: 100 },
    { title: '工号', dataIndex: 'userInfo.projectNumber', width: 100 },
    { title: '管理编号', dataIndex: 'userInfo.sjNumber', width: 100 },
    { title: '姓名', dataIndex: 'userInfo.userName', width: 100 },
    { title: '组织', dataIndex: 'userInfo.organize', width: 200 },
    { title: '员工类型', dataIndex: 'userInfo.roleType', width: 100 },
    { title: '法人主体', dataIndex: 'userInfo.entity', width: 200 },
    { title: '入职日期', dataIndex: 'userInfo.entryTime', width: 100 },
    { title: '状态', dataIndex: 'userInfo.workCondition', width: 100 },
    { title: '薪资等级', dataIndex: 'levelName', width: 100 },
    { title: '薪资档级', dataIndex: 'gradeName', width: 100 },
    { title: '薪资层级', dataIndex: 'rankName', width: 100 },
    { title: '基本工资', dataIndex: 'baseSalary', width: 100 },
    { title: '绩效工资', dataIndex: 'performanceSalary', width: 100 },
    { title: '试用期基本工资', dataIndex: 'probationBaseSalary', width: 120 },
    { title: '试用期绩效工资', dataIndex: 'probationPerSalary', width: 120 },
    {
      title: '异动生效日期',
      dataIndex: 'transactionDate',
      width: 120,
      sorter: (a: KeyValue, b: KeyValue) => moment(a.transactionDate).isBefore(b.transactionDate)
    },
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
      render: (data: KeyValue) => {
        return (
          <span>
            <a onClick={this.editStaffInfo.bind(this, data)}>查看</a>
          </span>
        )
      }
    }
  ]
  organizeList: any[] = []

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('JobChangePage_searchParams')
    let commonOrganize = SysUtil.getSessionStorage('commonOrganize')
    this.organizeList = outArrayNew(commonOrganize).map((el:any) => el.lablekey)
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
      warnTips: ''
    }
  }

  // 查看详情
  editStaffInfo = (data: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('JobChangeEdit', data)
    this.props.history.push('/home/jobChange/editJobChange')
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
    SysUtil.setSessionStorage('JobChangePageAddNewStaff', selectedStaff)
    this.props.history.push('/home/jobChange/addJobChange')
  }

  render () {
    const [, add, view, , ex, dw, im] = this.AuthorityList.transaction
    const { tableHeader } = this
    if (!this.isAuthenticated(view)) tableHeader.splice(tableHeader.length - 1)
    const width = tableHeader.reduce((total, { width = 100 }) => total + width, 0)
    const { jobChangeAddList, jobChangeList, exportList, jobChangeImport, jobChangeTemplate } = this.api
    const { userName, organize, selectValue, filterNumberType = '' } = this.state.searchParams as KeyValue
    const searchParams: KeyValue = { userName, organizeArr: organize, selectValue }
    if (selectValue === '管理编号') searchParams.sjNumber = filterNumberType
    else searchParams.projectNumber = filterNumberType
    const FilterComponent = Form.create<FilterProps>()(TableFilterComponent)
    return (
      <div id="job_change">
        <AddNewStaffComponent
          {...this.props}
          ref={this.modal}
          url={jobChangeAddList}
          getSelectedStaff={this.getSelectedStaff} />
        <FilterComponent getFilterData={this.getFilterData} searchParams={this.state.searchParams} />
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Col style={{ position: 'relative' }}>
            {
              this.isAuthenticated(add) &&
              <Button type="primary" onClick={this.addNewStaffData}>
                <Icon component={IconTj}/>新增
              </Button>
            }
            {
              this.isAuthenticated(im) &&
              <FileUpload params={{ organizeList: this.organizeList }} action={jobChangeImport.path}>
                <Button className="custom-page-btn" type="primary">
                  <Icon component={IconDr} />导入
                </Button>
              </FileUpload>
            }
            {
              this.isAuthenticated(ex) &&
              <BasicDowload
                fileName="HR异动信息导出"
                className="custom-page-btn"
                btntype="primary"
                dowloadURL="URL"
                action={exportList}
                parmsData={searchParams}>
                <Icon component={IconDc} />导出
              </BasicDowload>
            }
            {
              this.isAuthenticated(dw) &&
              <BasicDowload
                fileName="HR异动信息导入模板"
                className="custom-page-btn"
                btntype="primary"
                action={jobChangeTemplate}
                parmsData={{ type: '.xlsx' }}>
                <Icon component={IconXz} />下载导入模版
              </BasicDowload>
            }
            <div className="tips">
              <Icon component={IconFill} className="tips_icon" />
              导入时，若相关信息项为空，则默认该信息项与异动前一致！
            </div>
          </Col>
        </Row>
        <TableItem
          ref={this.table}
          onRow={true}
          URL={jobChangeList}
          searchParams={searchParams}
          rowSelectionFixed
          filterKey="id"
          rowKey={({ id }) => id}
          columns={tableHeader}
          scroll={{ x: width }}
          bufferSearchParamsKey='JobChangePage_searchParams'
        />
      </div>
    )
  }
}
