/*
 * @description: 不参与考勤人员设置
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-04-29 11:42:56
 * @LastEditTime: 2020-05-21 10:11:50
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent, TableItem, BasicModal, BasicDowload, FileUpload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconSc, IconDc, IconDr, IconXz, IconTj, IconZaizhi, IconDairuzhi, IconLizhi, IconFill } from '@components/icon/BasicIcon'
import SharedStructure from '@shared/structure/SharedStructure'
import { FormProps } from 'typings/global'
import moment from 'moment'
import SearchForm from '../components/searchForm'
import './index.styl'
const { Option } = Select
const { Item } = Form
const { MonthPicker } = DatePicker

interface SettingProps extends FormProps {
}

interface AttendanceSetState {
  searchParams: any // 不参与考勤人员设置主页面搜索条件
  modalSearchParams: any // 模态框搜索条件
  modalSelectedRowKeys: any[] // 模态框选中的数据
}

class AttendanceSet extends RootComponent<SettingProps, AttendanceSetState> {
  basicModal = React.createRef<BasicModal>()
  basicConfirmModal = React.createRef<BasicModal>()
  tableRef = React.createRef<TableItem<any>>()
  actionData: any // 用于存储点击删除时的数据
  constructor (props: SettingProps) {
    super(props)
    this.state = {
      searchParams: {},
      modalSearchParams: {},
      modalSelectedRowKeys: []
    }
  }

  // 新增按钮-打开模态框
  handleAdd = () => {
    this.basicModal.current!.handleOk()
  }

  // 关闭模态框
  handleCancel = (tag: boolean) => {
    if (!tag) {
      this.basicModal.current!.handleCancel()
    }
    this.setState({ modalSelectedRowKeys: [], modalSearchParams: {} })
  }

  // 获取主页面列表选中的数据
  handleListSelection = (selectedRowKeys:any, selectedRows: any) => {
  }

  // 获取模态框列表选中的数据
  handleGetSelectedRadio = (selectedRowKeys:any, selectedRows: any) => {
    this.setState({ modalSelectedRowKeys: selectedRowKeys })
  }

  // 获取主页面搜索条件
  getSearchParams = (searchData: any) => {
    this.setState({ searchParams: searchData })
  }

  // 获取模态框搜索条件
  getModalSearchParams = (searchData: any) => {
    this.setState({ modalSearchParams: searchData })
  }

  // 模态框新增确定按钮
  handleConfirm = () => {
    const {
      state: { modalSelectedRowKeys },
      api: { addNoAttendFace }
    } = this
    if (!modalSelectedRowKeys.length) {
      this.$message.warn('请选择一个用户')
      return
    }
    this.axios.request(addNoAttendFace, { userId: modalSelectedRowKeys[0], noAttend: 2 }).then(({ code }) => {
      if (code === 200) {
        this.handleCancel(false)
        this.$message.success('新增成功')
        this.tableRef.current!.loadingTableData()
      }
    })
  }

  // 列表删除
  delData = (recond: any) => {
    this.basicConfirmModal.current!.handleOk()
    this.actionData = recond
  }

  // 确认删除或者取消按钮 1-删除 0-取消
  onDeleteOrCancel = (type: number) => {
    const {
      actionData: { userId },
      api: { addNoAttendFace }
    } = this
    this.basicConfirmModal.current!.handleCancel()
    if (type === 1) {
      this.axios.request(addNoAttendFace, { userId, noAttend: 1 }).then(({ code }) => {
        if (code === 200) {
          this.$message.success('删除成功')
          this.tableRef.current!.loadingTableData()
        }
      })
    }
  }

  render () {
    const {
      isAuthenticated,
      AuthorityList,
      api: { queryNoAttendFace },
      props: {
        form: { getFieldDecorator }
      },
      state: { searchParams, modalSearchParams }
    } = this
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 100 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 150 },
      { title: '姓名', dataIndex: 'userName', width: 150 },
      { title: '组织', dataIndex: 'organize', width: 300 },
      { title: '在职状态', dataIndex: 'workCondition', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'entryTime',
        sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/')),
        width: 150
      },
      // { title: '离职日期', dataIndex: 'userInfo.quitTime', width: 100 },
      // { title: '月度', dataIndex: 'yearMonth', width: 100 },
      // {
      //   title: '考勤制度',
      //   dataIndex: 'attendSystem',
      //   width: 100,
      //   render: (value: any, item: any) => {
      //     return <span>{value === 1 ? '五天工作制' : '六天工作制'}</span>
      //   }
      // },
      // { title: '工时类型', dataIndex: 'userInfo.hourType', width: 80 },
      // {
      //   title: '计薪类型',
      //   dataIndex: 'userInfo.salaryType',
      //   width: 80,
      //   render: (value: any, item: any) => {
      //     if (value) {
      //       return <span>{value === 1 ? '计薪制' : '计件制'}</span>
      //     }
      //     return <span>---</span>
      //   }
      // },
      // { title: '额定出勤天数', dataIndex: 'ratedAttend', width: 100 },
      // { title: '额定法定假天数', dataIndex: 'ratedLegalHoliday', width: 120 },
      // { title: '排班出勤天数', dataIndex: 'schedulingAttend', width: 100 },
      // { title: '排班法定假出勤天数', dataIndex: 'schedulingLegalHoliday', width: 150 },
      // { title: '排班病假天数', dataIndex: 'schedulingSick', width: 100 },
      // { title: '排班事假天数', dataIndex: 'schedulingThing', width: 100 },
      // { title: '排班产前假天数', dataIndex: 'schedulingMaternityBefore', width: 130 },
      // { title: '排班产假天数', dataIndex: 'schedulingMaternityIn', width: 100 },
      // { title: '排班产后假天数', dataIndex: 'schedulingMaternityAfter', width: 130 },
      // { title: '排班陪产假天数', dataIndex: 'schedulingMaternityWith', width: 130 },
      // { title: '排班婚假天数', dataIndex: 'schedulingMarried', width: 100 },
      // { title: '排班年假天数', dataIndex: 'schedulingYear', width: 100 },
      // { title: '排班丧假天数', dataIndex: 'schedulingFuneral', width: 100 },
      // { title: '排班产检假天数', dataIndex: 'schedulingMaternityCheck', width: 180 },
      {
        title: '操作',
        dataIndex: 'action',
        render: (value: any, item: any) => {
          return (
            <span><Button type='link' onClick={() => this.delData(item)}>删除</Button></span>
          )
        }
      }
    ]
    const modalColumnData = [
      { title: '序号', dataIndex: 'index', width: 60 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '工号', dataIndex: 'projectNumber', width: 120 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 120 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      { title: '组织', dataIndex: 'organize', width: 200 },
      { title: '在职状态', dataIndex: 'workCondition', width: 100 },
      { title: '入职日期', dataIndex: 'entryTime', width: 100 }
    ]

    return (
      <div id='attendanceset'>
        <SearchForm searchData={this.getSearchParams}/>
        <Row className='actionbtn'>
          <Button type="primary" onClick={this.handleAdd}>
            <Icon component={IconTj}/>新增
          </Button>
        </Row>
        <Row>
          <TableItem
            ref={this.tableRef}
            rowSelectionFixed
            filterKey="userId"
            rowKey={({ userId }) => userId}
            URL={ queryNoAttendFace }
            searchParams={{ ...searchParams, noAttend: 2 }}
            columns={columnData}
            getSelectedRow={this.handleListSelection}
          />
        </Row>
        <BasicModal
          ref={this.basicModal}
          title='选择员工'
          width={1100}
          destroyOnClose={true}
          colseModel={this.handleCancel}
        >
          <SearchForm searchData={this.getModalSearchParams} />
          <Row style={{ marginTop: '10px' }}>
            <TableItem
              rowSelectionType='radio'
              onRow
              filterKey="userId"
              rowKey={({ userId }) => userId}
              URL={ queryNoAttendFace }
              searchParams={{ ...modalSearchParams, noAttend: 1 }}
              columns={modalColumnData}
              getSelectedRow={this.handleGetSelectedRadio}
            />
          </Row>
          <Row className='dialog-btn'>
            <Button type='primary' onClick={this.handleConfirm} className='confrim-btn'>确定</Button>
            <Button className='cancel-btn' onClick={() => this.handleCancel(false)}>取消</Button>
          </Row>
        </BasicModal>
        {/** 确认弹出框 */}
        <BasicModal ref={this.basicConfirmModal} title="提示">
          <p className="delete-p"><span>确定要删除吗？</span></p>
          <Row>
            <Button onClick={() => this.onDeleteOrCancel(1)} type="primary">确认</Button>
            <Button onClick={() => this.onDeleteOrCancel(0)} type="primary">取消</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}

export default Form.create<FormProps>()(AttendanceSet)
