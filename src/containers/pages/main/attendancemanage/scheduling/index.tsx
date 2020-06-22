/*
 * @description: 考勤主页面
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-19 14:52:39
 * @LastEditTime: 2020-06-18 11:43:35
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent, TableItem, BasicModal, BasicDowload, FileUpload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Tabs, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconSc, IconDc, IconDr, IconXz, IconTj, IconZaizhi, IconDairuzhi, IconLizhi } from '@components/icon/BasicIcon'
import SharedStructure from '@shared/structure/SharedStructure'
import { BaseProps } from 'typings/global'
import moment from 'moment'
import { SysUtil, JudgeUtil } from '@utils/index'
import Hema from './hema'
import './index.styl'

const { Option } = Select
const { TabPane } = Tabs
const { Item } = Form
const { MonthPicker } = DatePicker
const chChooseListColumnData = [
  { title: '序号', dataIndex: 'index' },
  { title: '项目', dataIndex: 'projectName' },
  { title: '工号', dataIndex: 'projectNumber' },
  { title: '管理编号', dataIndex: 'sjNumber' },
  { title: '姓名', dataIndex: 'userName' },
  { title: '组织', dataIndex: 'organize' },
  { title: '在职状态', dataIndex: 'workCondition' },
  { title: '入职日期', dataIndex: 'entryTime' }
]
interface SchedulingProps extends FormComponentProps {

}
interface SchedulingSearchProps extends FormComponentProps {
  searchData: Function
  searchParams?: any
}
interface ModalSearchProps extends FormComponentProps {
  searchData: Function,
  chChooseListSearchParams: any
}
interface SchedulingState {
  searchParams: any
  chChooseListSearchParams: any
  projectType: string
  selectedRadioItem: any,
  warnMsg: string,
  errorBtn: string,
  deleteIds: any[],
  selections: any[],
  isDeleteBatch: boolean,
  curretnTab: any,
  attendStatus: number
}
interface SchedulingSearchState {
  projectType: string
  searchParams?: any
}
class SchedulingSearch extends RootComponent<SchedulingSearchProps, SchedulingSearchState> {
  constructor (props: SchedulingSearchProps) {
    super(props)
    const { searchParams = { } } = this.props
    this.state = {
      projectType: searchParams.projectType || '管理编号',
      searchParams: searchParams
    }
  }
  // 搜索排版列表
  handleSearch = (e: any) => {
    e.preventDefault()

    const { form: { validateFields }, searchData }:any = this.props
    validateFields((err: any, value: any) => {
      if (err) return
      value.yearMonth = moment(value.monthDate).format('YYYYMM')
      delete value.monthDate
      value.projectType = this.state.projectType
      searchData(value)
    })
  }

  // 切换工号
  handleToggleProject = (val: string) => {
    this.setState({
      projectType: val
    })
  }

  validateJobNumber = (rules: any, value: any, callback: any) => {
    const reg = /^[a-zA-Z0-9]+$/
    if (value && !reg.test(value)) {
      callback(new Error('工号输入需为字母/数字'))
    }
    callback()
  }

  validateName = (rules: any, value: any, callback: any) => {
    const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
    if (value && !reg.test(value)) {
      callback(new Error('姓名需为中英文'))
    }
    callback()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const defaultTree = SysUtil.getSessionStorage('commonOrganize').filter((item: any) => item.organize === '上嘉集团')
    const { projectType, searchParams } = this.state
    return (
      <div className='scheduling-serach'>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Item>
            <Select className='input-120' onChange={this.handleToggleProject} defaultValue={projectType}>
              <Option value='管理编号'>管理编号</Option>
              <Option value='工号'>工号</Option>
            </Select>
          </Item>
          <Item>
            { projectType === '管理编号' ? getFieldDecorator('sjNumber', {
              initialValue: searchParams.sjNumber,
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input placeholder='请输入管理编号' allowClear />
            ) : getFieldDecorator('projectNumber', {
              initialValue: searchParams.projectNumber,
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input placeholder='请输入工号' allowClear />
            )}
          </Item>
          <Item>
            {getFieldDecorator('userName', {
              initialValue: searchParams.userName,
              rules: [
                {
                  validator: this.validateName
                }
              ]
            })(<Input placeholder='请输入姓名' allowClear maxLength={15} />)}
          </Item>
          <Item>
            {getFieldDecorator('organizeArr')(<SharedStructure defaultTree={defaultTree} width='220px' type="string" multiple/>)}
          </Item>
          <Item label='月度：'>
            {getFieldDecorator('monthDate', {
              initialValue: searchParams.yearMonth ? moment(searchParams.yearMonth, 'YYYYMM') : moment().month(moment().month() - 1)
            })(<MonthPicker format='YYYY年MM月' className='picker-120 input-120' allowClear={false} />)}
          </Item>
          <Item>
            {
              getFieldDecorator('source', { initialValue: searchParams.source })(
                <Select className='input-150' placeholder='请选择数据来源' allowClear>
                  <Option value='系统新增'>系统新增</Option>
                  <Option value='AI人脸识别'>AI人脸识别</Option>
                </Select>
              )
            }
            {getFieldDecorator('organizeArr', {
              initialValue: searchParams.organizeArr
            })(<SharedStructure width='220px' type="string" multiple/>)}
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Item>
        </Form>
      </div>
    )
  }
}
const SchedulingSearchComponent = Form.create<SchedulingSearchProps>()(SchedulingSearch)

class ModalSearch extends RootComponent<ModalSearchProps, SchedulingSearchState> {
  constructor (props: ModalSearchProps) {
    super(props)
    this.state = {
      projectType: '管理编号'
    }
  }

  // 切换工号
  handleToggleProject = (val: string) => {
    this.setState({
      projectType: val
    })
  }

  // 禁用当月之前的月份
  disabledMonth = (current: any) => {
    if (moment().month() !== 0 && current.year() < moment().year()) {
      return true
    } else if (current.year() === moment().year()) {
      return current && (current.month() !== moment().month() && current.month() !== moment().month() - 1)
    } else if (moment().month() === 0 && current.year() === moment().year() - 1) {
      return current && (current.month() !== 11)
    } else {
      return true
    }
  }

  // 搜索新增排版-选择列表
  handleSearchChooseList = (e: any) => {
    e.preventDefault()
    const { form: { validateFields }, searchData }:any = this.props
    validateFields((err: any, value: any) => {
      if (err) return
      value.yearMonth = moment(value.monthDate).format('YYYYMM')
      if (!value.organizeArr || value.organizeArr.length === 0) {
        const defaultValueTree = SysUtil.getSessionStorage('commonOrganize').filter((item: any) => item.organize === '上嘉集团')
        value.organizeArr = this.recursion(defaultValueTree)
      }
      searchData(value)
    })
  }

  // 递归拿到组织数组
  recursion = (data: any, lastArray: any[] = [], key = '') => {
    data.forEach((el: any) => {
      let keys = key === '' ? el.organize + '' : `${key}-${el.organize}`
      lastArray.push(keys)
      !JudgeUtil.isEmpty(el.next) && this.recursion(el.next, lastArray, keys)
    })
    return lastArray
  }

  validateJobNumber = (rules: any, value: any, callback: any) => {
    const reg = /^[a-zA-Z0-9]+$/
    if (value && !reg.test(value)) {
      callback(new Error('工号输入需为字母/数字'))
    }
    callback()
  }

  validateName = (rules: any, value: any, callback: any) => {
    const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
    if (value && !reg.test(value)) {
      callback(new Error('姓名需为中英文'))
    }
    callback()
  }

  render () {
    const {
      props: { chChooseListSearchParams, form: { getFieldDecorator } },
      state: { projectType },
      api: { ApiExportUserList }
    } = this
    const defaultTree = SysUtil.getSessionStorage('commonOrganize').filter((item: any) => item.organize === '上嘉集团')
    return (
      <Row className='dialog-search'>
        <Form layout="inline" onSubmit={this.handleSearchChooseList}>
          <Item label='月度：'>
            {getFieldDecorator('monthDate', { initialValue: moment().month(moment().month() - 1) })(<MonthPicker style={{ width: 110 }} className='picker-100 input-100' allowClear={false} disabledDate={this.disabledMonth}/>)}
          </Item>
          <Item>
            <Select className='input-100' style={{ width: 100 }} onChange={this.handleToggleProject} defaultValue='管理编号'>
              <Option value='管理编号'>管理编号</Option>
              <Option value='工号'>工号</Option>
            </Select>
          </Item>
          <Item>
            { projectType === '管理编号' ? getFieldDecorator('sjNumber', {
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input className='input-180' placeholder='请输入管理编号' allowClear />
            ) : getFieldDecorator('projectNumber', {
              rules: [
                {
                  validator: this.validateJobNumber
                }
              ]
            })(
              <Input className='input-180' placeholder='请输入工号' allowClear />
            )}
          </Item>
          <Item>
            {getFieldDecorator('userName', {
              rules: [
                {
                  validator: this.validateName
                }
              ]
            })(<Input className='input-180' placeholder='请输入姓名' maxLength={15} allowClear />)}
          </Item>
          <Item>
            {getFieldDecorator('organizeArr')(<SharedStructure defaultTree={defaultTree} width='180px' type="string" multiple/>)}
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Item>
          <Item>
            <BasicDowload action={ApiExportUserList}
              parmsData={chChooseListSearchParams} fileName="员工列表导出"
              dowloadURL="URL"
              className="contract-page-button" btntype="primary">
              <Icon component={IconDc}/>导出
            </BasicDowload>
          </Item>
        </Form>
      </Row>
    )
  }
}
const ModalSearchComponent = Form.create<ModalSearchProps>()(ModalSearch)

class Scheduling extends RootComponent<BaseProps, SchedulingState> {
  basicModal = React.createRef<BasicModal>()
  BasicModalOne = React.createRef<BasicModal>()
  BasicModalTwo = React.createRef<BasicModal>()
  BasicModalThree = React.createRef<BasicModal>()
  BasicModalFour = React.createRef<BasicModal>()
  tableRef = React.createRef<TableItem<any>>()
  FileUpload = React.createRef<FileUpload>()
  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('scheduling_searchParams')
    this.state = {
      searchParams: searchParams || {
        yearMonth: moment().month(moment().month() - 1).format('YYYYMM')
      },
      chChooseListSearchParams: {
        yearMonth: moment().month(moment().month() - 1).format('YYYYMM')
      },
      projectType: '管理编号',
      selectedRadioItem: {},
      warnMsg: '',
      errorBtn: '知道了',
      deleteIds: [],
      selections: [],
      isDeleteBatch: false,
      curretnTab: '0',
      attendStatus: 0
    }
  }

  componentWillUnmount = () => {
    this.setState = (state) => {}
  }

  componentDidMount = () => {
    this.attendStatus()
  }

  // 获取月份审核状态
  attendStatus = () => {
    const { searchParams: { yearMonth } } = this.state
    this.axios.request(this.api.attendStatus, { yearMonth }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          attendStatus: data
        })
      }
    })
  }

  // 切换工号
  handleToggleProject = (val: string) => {
    this.setState({
      projectType: val
    })
  }

  // 搜索排版列表
  handleSearch = (data: any) => {
    this.tableRef.current!.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.setState({
      searchParams: data,
      deleteIds: [],
      selections: []
    }, () => {
      this.attendStatus()
    })
  }
  // 搜索新增排版-选择列表
  handleSearchChooseList = (data: any) => {
    this.setState({
      chChooseListSearchParams: data
    })
  }

  // 新增排版
  handleAdd = () => {
    this.basicModal.current!.handleOk()
  }
  // 单选列表
  handleGetSelectedRadio = (selectedRowKeys:any, selectedRows: any) => {
    this.setState({
      selectedRadioItem: selectedRows[0]
    })
  }

  // 确定按钮
  handleConfirm = () => {
    const { history } = this.props
    const { selectedRadioItem: { userId }, chChooseListSearchParams } = this.state
    const yearMonth = chChooseListSearchParams.yearMonth
    if (!userId) {
      this.$message.warning('请选择一个用户')
      return
    }
    const payload = {
      userId: Number(userId),
      yearMonth: Number(yearMonth),
      attendSystem: 1
    }
    this.axios.request(this.api.ApiGetAttendParamInit, payload).then(({ code }) => {
      if (code === 200) {
        this.basicModal.current!.handleCancel()
        history.push(`scheduling/schedulingAdd?userId=${userId}&yearMonth=${yearMonth}`)
      }
    }).finally(() => {
      this.setState({
        chChooseListSearchParams: {
          yearMonth: moment().month(moment().month() - 1).format('YYYYMM')
        }
      })
    })
  }

  handleCancel = (tag: boolean) => {
    if (!tag) {
      this.basicModal.current!.handleCancel()
    }
    this.setState({
      chChooseListSearchParams: {
        yearMonth: moment().month(moment().month() - 1).format('YYYYMM')
      }
    })
  }

  onDetail = (item: any) => {
    if (item.source === '系统新增') {
      this.props.history.push(`/home/scheduling/schedulingAdd/${item.aId}`)
    } else {
      this.props.history.push(`/home/scheduling/faceDetail/${item.aId}`)
    }
  }

  openDeleteModal = (item: any) => {
    this.setState({
      deleteIds: [item.aId],
      isDeleteBatch: false
    })
    this.handleModal(1, 'one', '确认删除？')
  }

  handleADelete = () => {
    const { selections } = this.state
    if (selections.length === 0) {
      this.$message.warning('请选择员工')
    } else {
      this.setState({
        deleteIds: this.state.selections,
        isDeleteBatch: true
      })
      this.handleModal(1, 'one', '确认删除？')
    }
  }

  onDelete = () => {
    const {
      state: { deleteIds, isDeleteBatch },
      api: { deleteAttend },
      axios: { request }
    } = this
    this.BasicModalOne.current!.handleCancel()
    request(deleteAttend, { aIds: deleteIds }, false).then(({ code }) => {
      if (code === 200) {
        if (isDeleteBatch) {
          this.setState({ selections: [] })
          this.tableRef.current!.deletedAndUpdateTableData()
        } else {
          this.$message.success('删除成功')
          this.tableRef.current!.loadingTableData()
        }
      }
    })
  }

  onCancel = () => {
    this.setState({ deleteIds: [] })
    this.handleModal(0, 'one')
  }

  handleReview = () => {
    this.handleModal(1, 'three', '确认审核通过？')
  }

  handleCancelReview = () => {
    this.handleModal(1, 'four', '确认取消审核？')
  }

  onReviewPass = () => {
    this.handleModal(0, 'three')
    const { searchParams: { yearMonth } } = this.state
    this.axios.request(this.api.setAttendStatus, { yearMonth, status: 1 }).then(({ code, data }) => {
      if (code === 200) {
        this.$message.success('审核通过成功！')
        this.attendStatus()
      }
    })
  }

  onCancelReview = () => {
    this.handleModal(0, 'four')
    const { searchParams: { yearMonth } } = this.state
    this.axios.request(this.api.setAttendStatus, { yearMonth, status: 2 }).then(({ code, data }) => {
      if (code === 200) {
        this.$message.success('取消审核成功！')
        this.attendStatus()
      }
    })
  }

  onCancelThree = () => {
    this.handleModal(0, 'three')
  }

  handleListSelection = (selectedRowKeys:any, selectedRows: any) => {
    const selectIds: any = []
    selectedRows.forEach((e: any) => {
      selectIds.push(e.aId)
    })
    this.setState({
      selections: selectIds
    })
  }

  getRemoveSelect = (selectedRowKeys:any, selectedRows: any) => {
    console.log(selectedRowKeys, selectedRows)
  }

  /** 模态框的显示 num: 0 关闭 1 打开  msg: 显示的消息 */
  handleModal = (num:number, type:string, msg?:string) => {
    if (type === 'one') {
      const { handleOk, handleCancel } = this.BasicModalOne.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    } else if (type === 'two') {
      const { handleOk, handleCancel } = this.BasicModalTwo.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    } else if (type === 'three') {
      const { handleOk, handleCancel } = this.BasicModalThree.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    } else {
      const { handleOk, handleCancel } = this.BasicModalFour.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    }
  }

  onChangeTab = (value: any) => {
    this.setState({
      curretnTab: value
    })
  }

  // 跳转到日统计
  dayStatistics = () => {
    this.props.history.push('/home/dayStatistics')
  }

  render () {
    const {
      isAuthenticated,
      AuthorityList,
      state: {
        searchParams, attendStatus, chChooseListSearchParams, warnMsg, errorBtn, curretnTab
      },
      props: {
        form: { getFieldDecorator }
      },
      api: {
        ApiGetAttendList, ApiGetChooseList, exportAddendTem, ApiExportAttendList, ApiImportAttendList
      }
    } = this
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 50 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 150 },
      { title: '姓名', dataIndex: 'userName', width: 90 },
      { title: '组织', dataIndex: 'organize', width: 250 },
      { title: '在职状态', dataIndex: 'workCondition', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'entryTime',
        sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/')),
        width: 100
      },
      { title: '离职日期', dataIndex: 'quitTime', width: 100 },
      { title: '月度', dataIndex: 'yearMonth', width: 100 },
      { title: '数据来源', dataIndex: 'source', width: 100 },
      { title: '考勤机', dataIndex: 'deviceName', width: 100 },
      {
        title: '考勤制度',
        dataIndex: 'attendSystem',
        width: 100,
        render: (value: any, item: any) => {
          return <span>{value === 1 ? '五天工作制' : '六天工作制'}</span>
        }
      },
      { title: '工时类型', dataIndex: 'hourType', width: 80 },
      {
        title: '计薪类型',
        dataIndex: 'salaryType',
        width: 80,
        render: (value: any, item: any) => {
          if (value) {
            return <span>{value === 1 ? '计薪制' : '计件制'}</span>
          }
          return <span>---</span>
        }
      },
      { title: '额定出勤天数', dataIndex: 'ratedAttend', width: 100 },
      { title: '额定法定假天数', dataIndex: 'ratedHolidayAttend', width: 120 },
      { title: '实际应出勤天数', dataIndex: 'realAttend', width: 100 },
      { title: '实际法定假出勤天数', dataIndex: 'realLegalHoliday', width: 150 },
      { title: '实际病假天数', dataIndex: 'realSick', width: 100 },
      { title: '实际事假天数', dataIndex: 'realThing', width: 100 },
      { title: '实际产前假天数', dataIndex: 'realMaternityBefore', width: 130 },
      { title: '实际产假天数', dataIndex: 'realMaternityIn', width: 100 },
      { title: '实际产后假天数', dataIndex: 'realMaternityAfter', width: 130 },
      { title: '实际陪产假天数', dataIndex: 'realMaternityWith', width: 130 },
      { title: '实际婚假天数', dataIndex: 'realMarried', width: 100 },
      { title: '实际年假天数', dataIndex: 'realYear', width: 100 },
      { title: '实际丧假天数', dataIndex: 'realFuneral', width: 100 },
      { title: '实际产检假天数', dataIndex: 'realMaternityCheck', width: 130 },
      { title: '实际旷工天数', dataIndex: 'realAbsent', width: 130 },
      { title: '本月有效出勤天数', dataIndex: 'monthValidAttend', width: 130 },
      { title: '本月薪资试用期天数', dataIndex: 'monthSalaryProbation', width: 150 },
      { title: '本月薪资转正天数', dataIndex: 'monthSalaryFormal', width: 180 },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        render: (value: any, item: any) => {
          return (
            <span>{isAuthenticated(AuthorityList.scheduling[3]) && <Button type='link' onClick={() => this.onDetail(item)}>查看</Button>}{isAuthenticated(AuthorityList.scheduling[4]) && <Button type='link' onClick={() => this.openDeleteModal(item)}>删除</Button>}</span>
          )
        }
      }
    ]
    return (
      <div id='scheduling'>
        <Tabs
          activeKey={curretnTab}
          onChange={this.onChangeTab}
        >
          <TabPane tab='上嘉' key="0">
            <SchedulingSearchComponent searchData={this.handleSearch} />
            <Row className='scheduling-head'>
              {isAuthenticated(AuthorityList.scheduling[1]) && <Button type="primary" onClick={this.handleAdd}>
                <Icon component={IconTj}/>新增
              </Button>}
              {isAuthenticated(AuthorityList.scheduling[5]) && <Button type="primary" onClick={this.handleADelete}>
                <Icon component={IconSc}/>批量删除
              </Button>}
              {isAuthenticated(AuthorityList.scheduling[6]) && <FileUpload
                ref={this.FileUpload} action={ApiImportAttendList.path}>
                <Button className="contract-page-button" type="primary">
                  <Icon component={IconDr}/>导入
                </Button>
              </FileUpload>}
              {isAuthenticated(AuthorityList.scheduling[7]) && <BasicDowload action={ApiExportAttendList}
                parmsData={searchParams} fileName="员工考勤导出"
                dowloadURL="URL"
                className="contract-page-button" btntype="primary">
                <Icon component={IconDc}/>导出
              </BasicDowload>}
              {isAuthenticated(AuthorityList.scheduling[8]) && <BasicDowload
                action={exportAddendTem}
                parmsData={{ type: '.xlsx' }}
                fileName="考勤导入模板"
                btntype="primary"
              >
                <Icon component={IconXz}/>下载导入模板
              </BasicDowload>}
              <Button className="contract-page-button" onClick={this.dayStatistics} type="primary">
                AI人脸识别-日统计
              </Button>
            </Row>
            <Row className='scheduling-content'>
              <TableItem
                ref={this.tableRef}
                rowSelectionFixed
                filterKey="index"
                rowKey={({ index }) => index}
                URL={ ApiGetAttendList }
                scroll={{ x: 3600 }}
                searchParams={searchParams}
                columns={columnData}
                getSelectedRow={this.handleListSelection}
              />
            </Row>
            <Row className='review'>
              {
                attendStatus === 1
                  ? <>
                    <div className='tips pass'>
                      <Icon className='pass-icon' type="check-circle" style={{ color: '#40A9FF' }} />
                      该月度员工考勤已通过审核！
                    </div>
                    <Button type='primary' className='review-btn pass' onClick={this.handleCancelReview}>反审核</Button>
                  </>
                  : <>
                    <Button type='primary' className='review-btn' onClick={this.handleReview}>审核通过</Button>
                    <div className='tips'>（员工考勤数据审查无误后，才可核算该月度薪资！）</div>
                  </>
              }
            </Row>
            <BasicModal
              ref={this.basicModal}
              title='选择员工'
              width={1100}
              destroyOnClose={true}
              colseModel={this.handleCancel}
            >
              <ModalSearchComponent searchData={this.handleSearchChooseList} chChooseListSearchParams={chChooseListSearchParams} />
              <Row className='dialog-table'>
                <TableItem
                  rowSelectionType='radio'
                  onRow
                  filterKey="userId"
                  rowKey={({ userId }) => userId}
                  URL={ ApiGetChooseList }
                  searchParams={ chChooseListSearchParams }
                  columns={chChooseListColumnData}
                  getSelectedRow={this.handleGetSelectedRadio}
                />
              </Row>
              <Row className='dialog-btn'>
                <Button type='primary' onClick={this.handleConfirm} className='confrim-btn'>确定</Button>
                <Button className='cancel-btn' onClick={() => this.handleCancel(false)}>取消</Button>
              </Row>
            </BasicModal>
            {/** 确认弹出框 */}
            <BasicModal ref={this.BasicModalOne} title="提示" destroyOnClose={true}>
              <p className="delete-p"><span>{warnMsg}</span></p>
              <Row>
                <Button onClick={() => (this.onDelete())} type="primary">确认</Button>
                <Button onClick={() => (this.onCancel())} type="primary">取消</Button>
              </Row>
            </BasicModal>
            <BasicModal ref={this.BasicModalThree} title="提示" destroyOnClose={true}>
              <p className="delete-p"><span>{warnMsg}</span></p>
              <Row>
                <Button onClick={() => (this.onReviewPass())} type="primary">确认</Button>
                <Button onClick={() => (this.handleModal(0, 'three'))} type="primary">取消</Button>
              </Row>
            </BasicModal>
            <BasicModal ref={this.BasicModalFour} title="提示" destroyOnClose={true}>
              <p className="delete-p"><span>{warnMsg}</span></p>
              <Row>
                <Button onClick={() => (this.onCancelReview())} type="primary">确认</Button>
                <Button onClick={() => (this.handleModal(0, 'four'))} type="primary">取消</Button>
              </Row>
            </BasicModal>
            <BasicModal ref={this.BasicModalTwo} title="提示">
              <p className='error-p'><span>{warnMsg}</span></p>
              <Row>
                <Button onClick={() => (this.handleModal(0, 'two'))} type="primary">{errorBtn}</Button>
              </Row>
            </BasicModal>
          </TabPane>
          <TabPane tab='盒马(钉钉)' key='1'>
            <Hema projectId={2} />
          </TabPane>
          <TabPane tab='上嘉(钉钉)' key='2'>
            <Hema projectId={1} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
const scheduling = Form.create<SchedulingProps>()(Scheduling)
export default scheduling
