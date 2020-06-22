/*
 * @description: 排班主页面
 * @author: songliubiao
 * @lastEditors: zhousong
 * @Date: 2019-09-19 14:52:39
 * @LastEditTime: 2020-06-08 16:53:53
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent, TableItem, BasicModal, BasicDowload, FileUpload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconSc, IconDc, IconDr, IconXz, IconTj, IconZaizhi, IconDairuzhi, IconLizhi, IconFill } from '@components/icon/BasicIcon'
import SharedStructure from '@shared/structure/SharedStructure'
import { BaseProps } from 'typings/global'
import moment from 'moment'
import SysUtil from '@utils/SysUtil'
import './index.styl'
const { Option } = Select
const { Item } = Form
const { MonthPicker } = DatePicker
interface ComposeProps extends FormComponentProps {

}
interface ComposeSearchProps extends FormComponentProps {
  searchData: Function
  searchParams?: any
}
interface ModalSearchProps extends FormComponentProps {
  searchData: Function,
  chChooseListSearchParams: any
}
interface ComposeState {
  searchParams: any
  chChooseListSearchParams: any
  projectType: string
  selectedRadioItem: any,
  warnMsg: string,
  errorBtn: string,
  deleteIds: any[],
  selections: any[],
  isDeleteBatch: boolean
}
interface ComposeSearchState {
  projectType: string
  searchParams?: any
}
class ComposeSearch extends RootComponent<ComposeSearchProps, ComposeSearchState> {
  constructor (props: ComposeSearchProps) {
    super(props)
    const { searchParams } = this.props
    this.state = {
      projectType: searchParams.projectType || '管理编号',
      searchParams
    }
  }
  // 搜索排版列表
  handleSearch = (e: any) => {
    e.preventDefault()
    const { form: { validateFields }, searchData }:any = this.props
    validateFields((err: any, value: any) => {
      if (err) return
      value.yearMonth = moment(value.monthDate).format('YYYYMM')
      value.projectType = this.state.projectType
      delete value.monthDate
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

  // 禁用当月之前的月份
  disabledMonth = (current: any) => {
    if (current.year() < moment().year()) {
      return true
    } else if (current.year() === moment().year()) {
      return current.month() < moment().month()
    } else {
      return false
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
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
            {getFieldDecorator('organizeArr', {
              initialValue: searchParams.organizeArr
            })(<SharedStructure width='220px' type="string" multiple/>)}
          </Item>
          <Item label='月度：'>
            {getFieldDecorator('monthDate', {
              initialValue: moment(searchParams.yearMonth, 'YYYY-MM')
            })(<MonthPicker format='YYYY年MM月' className='picker-120 input-120' allowClear={false} disabledDate={this.disabledMonth}/>)}
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
const ComposeSearchComponent = Form.create<ComposeSearchProps>()(ComposeSearch)

class ModalSearch extends RootComponent<ModalSearchProps, ComposeSearchState> {
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
    if (current.year() < moment().year()) {
      return true
    } else if (current.year() === moment().year()) {
      return current.month() < moment().month()
    } else {
      return false
    }
  }

  // 搜索新增排版-选择列表
  handleSearchChooseList = (e: any) => {
    e.preventDefault()
    const { form: { getFieldsValue }, searchData }:any = this.props
    const chChooseListSearchParams = getFieldsValue()
    chChooseListSearchParams.yearMonth = moment(chChooseListSearchParams.monthDate).format('YYYYMM')
    searchData(chChooseListSearchParams)
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
      api: { ApiExportScheduleChooseList }
    } = this
    return (
      <Row className='dialog-search'>
        <Form layout="inline" onSubmit={this.handleSearchChooseList}>
          <Item label='月度：'>
            {getFieldDecorator('monthDate', {
              initialValue: moment()
            })(
              <MonthPicker
                style={{ width: 110 }}
                className='picker-100 input-100'
                allowClear={false}
                disabledDate={(current: any) =>
                  current && current < moment().subtract(1, 'month')
                }
                // disabledDate={this.disabledMonth}
              />)}
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
            {getFieldDecorator('organizeArr')(<SharedStructure width='180px' type="string" multiple/>)}
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Item>
          <Item>
            <BasicDowload action={ApiExportScheduleChooseList}
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

class Compose extends RootComponent<BaseProps, ComposeState> {
  basicModal = React.createRef<BasicModal>()
  BasicModalOne = React.createRef<BasicModal>()
  BasicModalTwo = React.createRef<BasicModal>()
  tableRef = React.createRef<TableItem<any>>()
  FileUpload = React.createRef<FileUpload>()
  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('compose_searchParams')
    this.state = {
      searchParams: searchParams || {
        yearMonth: moment().format('YYYYMM')
      },
      chChooseListSearchParams: {
        yearMonth: moment().format('YYYYMM')
      },
      projectType: '管理编号',
      selectedRadioItem: {},
      warnMsg: '',
      errorBtn: '知道了',
      deleteIds: [],
      selections: [],
      isDeleteBatch: false
    }
  }
    // 切换工号
    handleToggleProject = (val: string) => {
      this.setState({
        projectType: val
      })
    }

    componentWillUnmount () {
      this.setState = (state, callback) => { }
    }

  // 搜索排版列表
  handleSearch = (data: any) => {
    this.tableRef.current!.setState({ selectedRowKeys: [], selectedRows: [] })
    this.setState({
      searchParams: data,
      deleteIds: [],
      selections: []
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
    this.axios.request(this.api.ApiScheduleInsertInfo, payload).then(({ code }) => {
      if (code === 200) {
        history.push(`/home/compose/composeAdd?userId=${userId}&yearMonth=${yearMonth}`)
      }
    }).finally(() => {
      this.setState({
        chChooseListSearchParams: {
          yearMonth: moment().format('YYYYMM')
        }
      })
      this.basicModal && this.basicModal.current! && this.basicModal.current!.handleCancel()
    })
  }

  handleCancel = (tag: boolean) => {
    if (!tag) {
      this.basicModal.current!.handleCancel()
    }
    this.setState({
      chChooseListSearchParams: {
        yearMonth: moment().format('YYYYMM')
      }
    })
  }

  onDetail = (item: any) => {
    this.props.history.push(`/home/compose/composeAdd/${item.sId}`)
  }

  openDeleteModal = (item: any) => {
    this.setState({
      deleteIds: [item.sId],
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
      api: { ApiDeleteScheduleInfo },
      axios: { request }
    } = this
    this.BasicModalOne.current!.handleCancel()
    request(ApiDeleteScheduleInfo, { idDeleteList: deleteIds }, false).then(({ code }) => {
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

  handleListSelection = (selectedRowKeys:any, selectedRows: any) => {
    const selectIds: any = []
    selectedRows.forEach((e: any) => {
      selectIds.push(e.sId)
    })
    this.setState({
      selections: selectIds
    })
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
    } else {
      const { handleOk, handleCancel } = this.BasicModalTwo.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    }
  }

  render () {
    const {
      isAuthenticated,
      AuthorityList,
      state: {
        searchParams, projectType, chChooseListSearchParams, warnMsg, errorBtn
      },
      props: {
        form: { getFieldDecorator }
      },
      api: {
        ApiQueryScheduleList, ApiScheduleChooseList, ApiImportScheduleTem, ApiExportSchedule, ApiImportSchedule
      }
    } = this
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'userInfo.projectName', width: 50 },
      { title: '工号', dataIndex: 'userInfo.projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'userInfo.sjNumber', width: 150 },
      { title: '姓名', dataIndex: 'userInfo.userName', width: 90 },
      { title: '组织', dataIndex: 'userInfo.organize', width: 250 },
      { title: '在职状态', dataIndex: 'userInfo.workCondition', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'userInfo.entryTime',
        sorter: (a:any, b:any) => Date.parse(a.userInfo.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.userInfo.entryTime.replace('-', '/').replace('-', '/')),
        width: 100
      },
      { title: '离职日期', dataIndex: 'userInfo.quitTime', width: 100 },
      { title: '月度', dataIndex: 'yearMonth', width: 100 },
      {
        title: '考勤制度',
        dataIndex: 'attendSystem',
        width: 100,
        render: (value: any, item: any) => {
          return <span>{value === 1 ? '五天工作制' : '六天工作制'}</span>
        }
      },
      { title: '工时类型', dataIndex: 'userInfo.hourType', width: 80 },
      {
        title: '计薪类型',
        dataIndex: 'userInfo.salaryType',
        width: 80,
        render: (value: any, item: any) => {
          if (value) {
            return <span>{value === 1 ? '计薪制' : '计件制'}</span>
          }
          return <span>---</span>
        }
      },
      { title: '额定出勤天数', dataIndex: 'ratedAttend', width: 100 },
      { title: '额定法定假天数', dataIndex: 'ratedLegalHoliday', width: 120 },
      { title: '排班出勤天数', dataIndex: 'schedulingAttend', width: 100 },
      { title: '排班法定假出勤天数', dataIndex: 'schedulingLegalHoliday', width: 150 },
      { title: '排班病假天数', dataIndex: 'schedulingSick', width: 100 },
      { title: '排班事假天数', dataIndex: 'schedulingThing', width: 100 },
      { title: '排班产前假天数', dataIndex: 'schedulingMaternityBefore', width: 130 },
      { title: '排班产假天数', dataIndex: 'schedulingMaternityIn', width: 100 },
      { title: '排班产后假天数', dataIndex: 'schedulingMaternityAfter', width: 130 },
      { title: '排班陪产假天数', dataIndex: 'schedulingMaternityWith', width: 130 },
      { title: '排班婚假天数', dataIndex: 'schedulingMarried', width: 100 },
      { title: '排班年假天数', dataIndex: 'schedulingYear', width: 100 },
      { title: '排班丧假天数', dataIndex: 'schedulingFuneral', width: 100 },
      { title: '排班产检假天数', dataIndex: 'schedulingMaternityCheck', width: 180 },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        render: (value: any, item: any) => {
          return (
            <span>{isAuthenticated(AuthorityList.compose[3]) && <Button type='link' onClick={() => this.onDetail(item)}>查看</Button>}{isAuthenticated(AuthorityList.compose[4]) && <Button type='link' onClick={() => this.openDeleteModal(item)}>删除</Button>}</span>
          )
        }
      }
    ]

    const chChooseListColumnData = [
      { title: '序号', dataIndex: 'index', width: 100 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      { title: '组织', dataIndex: 'organize', width: 200 },
      { title: '在职状态', dataIndex: 'workCondition', width: 100 },
      { title: '入职日期', dataIndex: 'entryTime', width: 100 }
    ]

    return (
      <div id='compose'>
        <ComposeSearchComponent searchData={this.handleSearch} searchParams={searchParams}/>
        <Row className='compose-head'>
          {
            isAuthenticated(AuthorityList.compose[1]) && <Button type="primary" onClick={this.handleAdd}>
              <Icon component={IconTj}/>新增
            </Button>
          }
          {
            isAuthenticated(AuthorityList.compose[5]) && <Button type="primary" onClick={this.handleADelete}>
              <Icon component={IconSc}/>批量删除
            </Button>
          }
          {
            isAuthenticated(AuthorityList.compose[6]) && <FileUpload
              ref={this.FileUpload} action={ApiImportSchedule.path}>
              <Button className="contract-page-button" type="primary">
                <Icon component={IconDr}/>导入
              </Button>
            </FileUpload>
          }
          {
            isAuthenticated(AuthorityList.compose[7]) && <BasicDowload action={ApiExportSchedule}
              parmsData={searchParams} fileName="员工排班导出"
              dowloadURL="URL"
              className="contract-page-button" btntype="primary">
              <Icon component={IconDc}/>导出
            </BasicDowload>
          }
          {
            isAuthenticated(AuthorityList.compose[8]) && <BasicDowload
              action={ApiImportScheduleTem}
              parmsData={{ type: '.xlsx' }}
              fileName="排班导入模板"
              btntype="primary"
            >
              <Icon component={IconXz}/>下载导入模板
            </BasicDowload>
          }
          <Item style={{ float: 'right' }}>
            <div className="tip-right">
              <Icon component={IconFill} className="tips-icon" />
                AI人脸识别打卡的员工必须先排班，否则无法自动获取考勤数据！
            </div>
          </Item>
        </Row>
        <Row className='compose-content'>
          <TableItem
            ref={this.tableRef}
            rowSelectionFixed
            filterKey="index"
            rowKey={({ index }) => index}
            URL={ ApiQueryScheduleList }
            scroll={{ x: 2950 }}
            searchParams={searchParams}
            columns={columnData}
            getSelectedRow={this.handleListSelection}
            bufferSearchParamsKey='compose_searchParams'
          />
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
              filterKey="index"
              rowKey={({ index }) => index}
              URL={ ApiScheduleChooseList }
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
        <BasicModal ref={this.BasicModalOne} title="提示">
          <p className="delete-p"><span>{warnMsg}</span></p>
          <Row>
            <Button onClick={() => (this.onDelete())} type="primary">确认</Button>
            <Button onClick={() => (this.onCancel())} type="primary">取消</Button>
          </Row>
        </BasicModal>
        <BasicModal ref={this.BasicModalTwo} title="提示">
          <p className='error-p'><span>{warnMsg}</span></p>
          <Row>
            <Button onClick={() => (this.handleModal(0, 'two'))} type="primary">{errorBtn}</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
const compose = Form.create<ComposeProps>()(Compose)
export default compose
