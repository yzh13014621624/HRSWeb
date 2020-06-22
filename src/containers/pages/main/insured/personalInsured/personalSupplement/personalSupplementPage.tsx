/*
 * @description: 参保管理模块 - 个人参保 - 个人补缴信息 主板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 15:50:39
 * @LastEditTime: 2020-05-27 11:37:11
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import TableFilterComponent from '../TableFilter'
import TableOperateComponent from '../TableOperate'
import TableItem from '@components/table/TableItem'
import BaseModal from '@components/modal/BasicModal'
import AddNewStaffComponent from '@shared/addnewstaff'
import SysUtil from '@utils/SysUtil'
import { Row, Button } from 'antd'
import { hot } from 'react-hot-loader'

import moment from 'moment'

import '../style/PersonalSupplementPage'

import { BaseProps, KeyValue } from 'typings/global'
interface SearchParams {
  selectValue: string
  filterNumberType: string
  userName: string
  projectName: string
  legalEntity: string
}
interface BaseState {
  searchParams: SearchParams
  modalType: number
  rejectRemovedStaffInfo: KeyValue[]
}

@hot(module)
export default class PersonalSupplementPage extends RootComponent<BaseProps, BaseState> {
  modal = React.createRef<BaseModal>()
  newAddModal = React.createRef<AddNewStaffComponent>()
  table = React.createRef<TableItem<{}>>()
  currentStaffInfo: KeyValue = {}
  isSingleRemove: boolean = true
  selectedRowKeys: (string|number)[] = []
  selectedRows: KeyValue[] = []

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('personalSupplement_searchParams')
    if (searchParams) {
      searchParams.legalEntity = searchParams.legalEntity || searchParams.entity
    }
    this.state = {
      searchParams: searchParams || {
        selectValue: '管理编号',
        filterNumberType: '',
        userName: '',
        projectName: '',
        legalEntity: ''
      },
      modalType: 1,
      rejectRemovedStaffInfo: []
    }
  }

  getFilterData = (searchParams: SearchParams) => {
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
        this.deleteStaffData()
        break
    }
  }

  // 新增
  addNewStaffData () {
    (this.newAddModal.current as AddNewStaffComponent).showModal()
  }

  // 读取新增表格筛选内容
  getSelectedStaff = (selectedStaff: KeyValue) => {
    SysUtil.setSessionStorage('PersonalSupplementAdd', selectedStaff)
    this.props.history.push('/home/personalInsured/personalSupplement/add')
  }

  // 批量删除
  deleteStaffData () {
    let modalType = 1
    this.isSingleRemove = false
    if (this.selectedRowKeys.length) modalType = 2
    this.showModal(modalType)
  }

  getSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    this.selectedRowKeys = selectedRowKeys
    this.selectedRows = selectedRows
  }

  viewCurrentStaffDetail = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('PersonalSupplementAdd', row)
    this.props.history.push('/home/personalInsured/personalSupplement/detail')
  }

  removeCurrentStaff = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    this.isSingleRemove = true
    this.currentStaffInfo = row
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

  // 删除员工信息
  confirmRemoveStaffInfo = async () => {
    const { isSingleRemove, currentStaffInfo, selectedRowKeys } = this
    let idDeleteList: (string|number)[] = []
    if (isSingleRemove) {
      if (!this.judgeCurrentCompanyIsRejectRemove()) return
      idDeleteList.push(currentStaffInfo.id)
    } else {
      let isPass = true
      await this.getMultiRejectRemoveStaffInfo()
        .then(() => {
          idDeleteList = selectedRowKeys
        })
        .catch(() => {
          isPass = false
        })
      if (!isPass) return
    }
    this.axios.request(this.api.supplementDelete, { idDeleteList })
      .then(() => {
        this.hideModal()
        this.selectedRowKeys = []
        this.selectedRows = []
        ;(this.table.current as TableItem<{}>).deletedAndUpdateTableData()
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 判断单条数据是否关账 0 - 未关账，1 - 已关账
  judgeCurrentCompanyIsRejectRemove () {
    const { closeAccount } = this.currentStaffInfo
    if (closeAccount) {
      this.showModal(3)
      return false
    }
    return true
  }

  // 多选判断是否关账
  async getMultiRejectRemoveStaffInfo () {
    let rejectRemovedStaffInfo = []
    rejectRemovedStaffInfo = this.selectedRows.filter(item => item.closeAccount > 0)
    if (rejectRemovedStaffInfo.length) {
      this.hideModal()
      await this.setState({
        rejectRemovedStaffInfo
      })
      await setTimeout(() => {
        this.showModal(4)
      }, 200)
      return Promise.reject(new Error('删除数据中存在引用数据'))
    }
    return Promise.resolve()
  }

  render () {
    let ModalChildren: (props: any) => JSX.Element
    const [,,,,,, supView,, supDel] = this.AuthorityList.personalInsured
    const { isAuthenticated } = this
    const canIView = isAuthenticated(supView)
    const canIDel = isAuthenticated(supDel)
    const { supplementNewList, supplementList, supplementImport, supplementExport, supplementTemplate } = this.api
    const { searchParams, modalType, rejectRemovedStaffInfo } = this.state
    const { userName, projectName, legalEntity, selectValue, filterNumberType = '' } = searchParams as KeyValue
    const params: KeyValue = { userName, projectName, entity: legalEntity, selectValue, filterNumberType }
    if (selectValue === '管理编号') params.sjNumber = filterNumberType
    else params.projectNumber = filterNumberType
    // 表头配置
    const tableHeader = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '法人主体', dataIndex: 'entity', width: 100 },
      { title: '工号', dataIndex: 'projectNumber', width: 100, render: (text: string) => (<span>{text || '- - -'}</span>) },
      { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      { title: '参保城市', dataIndex: 'cityName', width: 100 },
      { title: '参保标准', dataIndex: 'standardName', width: 100 },
      { title: '年份', dataIndex: 'makeupYear', width: 100 },
      { title: '月份', dataIndex: 'makeupMonth', width: 100 },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
        sorter: (a: KeyValue, b: KeyValue) => moment(a.createTime).isAfter(b.createTime)
      },
      {
        title: '操作',
        width: 100,
        align: 'center',
        render: (row: KeyValue) => {
          return (
            <span>
              {
                canIView &&
                <a style={{ paddingRight: '0.1rem' }} onClick={this.viewCurrentStaffDetail.bind(this, row)}>查看</a>
              }
              {
                canIDel &&
                <a onClick={this.removeCurrentStaff.bind(this, row)}>删除</a>
              }
            </span>
          )
        }
      }
    ]
    if (!canIView && !canIDel) tableHeader.splice(tableHeader.length - 1)
    if (modalType === 1) {
      ModalChildren = (props: any) => {
        return (
          <div>
            <h2 className="tips_text">请选择需删除的员工补缴记录。</h2>
            <Row className="remove_button_wrapper">
              <Button type="primary" className="ant_button_confirm" onClick={this.hideModal}>确定</Button>
            </Row>
          </div>
        )
      }
    } else if (modalType === 2) {
      ModalChildren = (props: any) => {
        return (
          <div>
            <h2 className="tips_text">确认删除？</h2>
            <Row className="remove_button_wrapper">
              <Button type="primary" className="ant_button_confirm" onClick={this.confirmRemoveStaffInfo}>是</Button>
              <Button className="ant_button_cancel" onClick={this.hideModal}>否</Button>
            </Row>
          </div>
        )
      }
    } else if (modalType === 3) {
      ModalChildren = (props: any) => {
        return (
          <div>
            <h2 className="tips_text">该员工补缴记录已进入当月关账计算，不可删除。</h2>
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
            <h2 className="tips_text">以下员工补缴记录已进入当月关账计算，不可删除。</h2>
            <div className="reject_list">
              {
                rejectRemovedStaffInfo.map(item => {
                  return (
                    <Row key={item.id}>
                      管理编号：{item.sjNumber}-补缴创建时间：{item.createTime}
                    </Row>
                  )
                })
              }
            </div>
            <Row className="remove_button_wrapper">
              <Button type="primary" className="ant_button_confirm" onClick={this.hideModal}>知道了</Button>
            </Row>
          </div>
        )
      }
    }
    return (
      <div id="personal_supplement_page">
        <AddNewStaffComponent url={supplementNewList} {...this.props} ref={this.newAddModal} getSelectedStaff={this.getSelectedStaff} />
        <TableFilterComponent getFilterData={this.getFilterData} searchParams={searchParams} />
        <TableOperateComponent
          type={2}
          add
          im
          ex
          download
          importAction={supplementImport}
          exportAction={supplementExport}
          exportParams={params}
          exportFileName="HR个人参保补缴信息导出"
          downloadAction={supplementTemplate}
          downloadFileName="HR个人参保补缴模板信息导出模板"
          submit={this.handlerSubmit} />
        <TableItem
          onRow
          ref={this.table}
          URL={supplementList}
          filterKey="id"
          rowKey={({ id }) => id}
          columns={tableHeader}
          searchParams={params}
          getSelectedRow={this.getSelectedRow}
          bufferSearchParamsKey='personalSupplement_searchParams'
        />
        {/* 删除提示 */}
        <BaseModal ref={this.modal}>
          <ModalChildren />
        </BaseModal>
      </div>
    )
  }
}
