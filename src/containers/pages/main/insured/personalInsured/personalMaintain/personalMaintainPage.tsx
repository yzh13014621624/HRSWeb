/*
 * @description: 参保管理模块 - 个人参保 - 个人参保维护 主板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 16:04:02
 * @LastEditTime: 2020-05-27 10:36:11
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import TableItem from '@components/table/TableItem'
import BaseModal from '@components/modal/BasicModal'
import AddNewStaffComponent from '@shared/addnewstaff'
import TableFilterComponent from '../MaintainTableFilter'

import TableOperateComponent from '../TableOperate'
import { Row, Button } from 'antd'

import moment from 'moment'
import SysUtil from '@utils/SysUtil'

import { hot } from 'react-hot-loader'

import { BaseProps, KeyValue } from 'typings/global'
interface SearchParams {
  selectValue: string
  filterNumberType: string
  userName: string
  organize: string[]
  entryTime: string[]
  leaveTime: string[]
}
interface BaseState {
  searchParams: SearchParams
  modalType: number
}

@hot(module)
export default class PersonalMaintainPage extends RootComponent<BaseProps, BaseState> {
  modal = React.createRef<BaseModal>()
  table = React.createRef<TableItem<{}>>()
  newAddModal = React.createRef<AddNewStaffComponent>()
  selectedRowKeys: (string|number)[] = []
  currentStaffInfo: KeyValue = {}
  isSingleRemove: boolean = true // 是否是单条删除

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('personalMaintain_searchParams')
    if (searchParams) {
      const { entryStartTime, entryEndTime, leaveStartTime, leaveEndTime } = searchParams
      searchParams.entryTime = (entryStartTime && entryEndTime) ? [moment(entryStartTime), moment(entryEndTime)] : []
      searchParams.leaveTime = (leaveStartTime && leaveEndTime) ? [moment(leaveStartTime), moment(leaveEndTime)] : []
      delete searchParams.entryStartTime
      delete searchParams.entryEndTime
      delete searchParams.leaveStartTime
      delete searchParams.leaveEndTime
    }
    this.state = {
      searchParams: searchParams || {
        selectValue: '管理编号',
        filterNumberType: '',
        userName: '',
        organize: [],
        entryTime: [],
        leaveTime: []
      },
      modalType: 1
    }
  }

  getFilterData = (searchParams: SearchParams) => {
    const { entryTime, leaveTime } = searchParams
    if (!entryTime) {
      searchParams.entryTime = []
    } else {
      searchParams.entryTime = searchParams.entryTime.map((el:any) => {
        if (typeof el !== 'string') {
          return el.format('YYYY-MM-DD')
        } else {
          return el
        }
      })
    }
    if (!leaveTime) {
      searchParams.leaveTime = []
    } else {
      searchParams.leaveTime = searchParams.leaveTime.map((el:any) => {
        if (typeof el !== 'string') {
          return el.format('YYYY-MM-DD')
        } else {
          return el
        }
      })
    }
    this.setState({
      searchParams
    })
  }

  handlerSubmit = (t: number) => {
    switch (t) {
      case 1:
        this.addNewStaffData()
        break
      case 2:
        this.showMultiRemoveModal()
        break
    }
  }

  addNewStaffData () {
    (this.newAddModal.current as AddNewStaffComponent).showModal()
  }

  // 读取新增表格筛选内容
  getSelectedStaff = (selectedStaff: KeyValue) => {
    SysUtil.setSessionStorage('PersonalMaintainAdd', selectedStaff)
    this.props.history.push('/home/personalInsured/personalMaintain/add')
  }

  // 批量删除弹窗
  showMultiRemoveModal () {
    this.isSingleRemove = false
    if (!this.selectedRowKeys.length) this.showModal(1)
    else this.showModal(2)
  }

  getSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    this.selectedRowKeys = selectedRows.map((el:any) => {
      return el.userId
    })
  }

  viewCurrentStaffDetail = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('PersonalMaintainEdit', row)
    this.props.history.push('/home/personalInsured/personalMaintain/detail')
  }

  removeCurrentStaff = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    this.currentStaffInfo = row
    this.isSingleRemove = true
    this.showModal(2)
  }

  // 显示模态框
  showModal = async (modalType: number) => {
    await this.setState({
      modalType
    })
    ;(this.modal.current as BaseModal).handleOk()
  }

  // 隐藏模态框
  hideModal = () => {
    (this.modal.current as BaseModal).handleCancel()
  }

  // 删除一条员工信息
  confirmRemoveStaffInfo = () => {
    const { isSingleRemove, api, currentStaffInfo, selectedRowKeys } = this
    let idDeleteList: (string | number)[] = []
    if (isSingleRemove) idDeleteList.push(currentStaffInfo.userId)
    else idDeleteList = selectedRowKeys
    this.axios.request(api.maintainDelete, { idDeleteList })
      .then(() => {
        this.hideModal()
        ;(this.table.current as TableItem<{}>).deletedAndUpdateTableData()
        this.selectedRowKeys = []
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  render () {
    let ModalChildren: (props: any) => JSX.Element
    const [,,,,,,,,,,,,,, mtView,, mtDel] = this.AuthorityList.personalInsured
    const { isAuthenticated } = this
    const canIView = isAuthenticated(mtView)
    const canIDel = isAuthenticated(mtDel)
    // 表头配置
    const tableHeader = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '法人主体', dataIndex: 'entity', width: 100 },
      { title: '工号', dataIndex: 'projectNumber', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 180, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
      { title: '参保城市', dataIndex: 'cityName', width: 100 },
      { title: '参保标准', dataIndex: 'standardName', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'entryTime',
        width: 100,
        sorter: (a: KeyValue, b: KeyValue) => moment(a.createTime).isBefore(b.createTime)
      },
      {
        title: '离职日期',
        dataIndex: 'quitTime',
        width: 100,
        render: (txt: KeyValue) => {
          return (
            <span>{txt || '- - -'}</span>
          )
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
        sorter: (a: KeyValue, b: KeyValue) => moment(a.createTime).isBefore(b.createTime)
      },
      {
        title: '操作',
        width: 120,
        align: 'center',
        render: (row: KeyValue) => {
          return (
            <span>
              {
                canIView &&
                <a onClick={this.viewCurrentStaffDetail.bind(this, row)}>查看</a>
              }
              {/* {
                canIDel &&
                <a onClick={this.removeCurrentStaff.bind(this, row)}>删除</a>
              } */}
            </span>
          )
        }
      }
    ]
    if (!canIView && !canIDel) tableHeader.splice(tableHeader.length - 1)
    const { searchParams, modalType } = this.state
    const { maintainList, maintainNewList, maintainImport, maintainExport, maintainTemplate, maintainImportInsured } = this.api
    const { selectValue, filterNumberType = '', userName, organize, organizeArr, entryTime, leaveTime } = searchParams as KeyValue
    const [entryStartTime = '', entryEndTime = ''] = entryTime
    const [leaveStartTime = '', leaveEndTime = ''] = leaveTime
    const params: KeyValue = {
      selectValue,
      userName,
      organizeArr: !organize ? organizeArr : organize,
      entryStartTime,
      entryEndTime,
      leaveStartTime,
      leaveEndTime,
      filterNumberType
    }
    if (selectValue === '管理编号') params.sjNumber = filterNumberType
    else params.projectNumber = filterNumberType
    if (modalType === 1) {
      ModalChildren = (props: any) => {
        return (
          <div>
            <h2 className="tips_text">请选择需删除的员工参保维护记录。</h2>
            <Row className="remove_button_wrapper">
              <Button type="primary" className="ant_button_confirm" onClick={this.hideModal}>确定</Button>
            </Row>
          </div>
        )
      }
    } else {
      ModalChildren = (props: any) => {
        return (
          <div>
            <h2 className="tips_text">删除后该员工参保信息，补缴信息将一并删除，是否确认？</h2>
            <Row className="remove_button_wrapper">
              <Button type="primary" className="ant_button_confirm" onClick={this.confirmRemoveStaffInfo}>是</Button>
              <Button className="ant_button_cancel" onClick={this.hideModal}>否</Button>
            </Row>
          </div>
        )
      }
    }
    return (
      <div id="personal_maintain_container">
        <AddNewStaffComponent url={maintainNewList} {...this.props} ref={this.newAddModal} getSelectedStaff={this.getSelectedStaff} />
        <TableFilterComponent getFilterData={this.getFilterData} searchParams={searchParams} />
        <TableOperateComponent
          type={3}
          add
          im
          imedit
          ex
          download
          importAction={maintainImport}
          importEditAction={maintainImportInsured}
          exportAction={maintainExport}
          exportParams={params}
          exportFileName="HR个人参保维护信息导出"
          downloadAction={maintainTemplate}
          downloadFileName="HR个人参保维护信息导出模板"
          submit={this.handlerSubmit} />
        <TableItem
          onRow
          ref={this.table}
          URL={maintainList}
          filterKey="id"
          rowKey={({ id }) => id}
          columns={tableHeader}
          searchParams={params}
          getSelectedRow={this.getSelectedRow}
          bufferSearchParamsKey='personalMaintain_searchParams'
        />
        <BaseModal ref={this.modal}>
          <ModalChildren />
        </BaseModal>
      </div>
    )
  }
}
