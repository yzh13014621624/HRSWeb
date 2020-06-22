/**
 * @author lixinying
 * @createTime 2019/04/13
 * @lastEditTim 2019/04/10
 * @description 参保管理 - 公司维护
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import SysUtil from '@utils/SysUtil'
import { Button, Row } from 'antd'
import TableFilter from './TableFilter'
import TableOperateComponent from './TableOperate'
import { hot } from 'react-hot-loader'

import moment from 'moment'

import './style/CompanyInsuredPage'

import date from '@assets/images/date.png'

import { BaseProps, KeyValue } from 'typings/global'

interface SearchParams {
  createTime: moment.Moment[]
  projectName: string
  legalEntity: string
}

interface BaseState {
  searchParams: SearchParams
  modalType: number
  rejectRemovedStaffInfo: KeyValue[]
}

@hot(module)
export default class InsuredAccountePage extends RootComponent<BaseProps, BaseState> {
  isSingleRemove: boolean = true
  selectedRowKeys: (string|number)[] = []
  selectedRows: KeyValue[] = []
  currentStaffInfo: KeyValue = {}
  modal = React.createRef<BasicModal>()
  table = React.createRef<TableItem<{}>>()

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('companyInsured_searchParams')
    if (searchParams) {
      const { startTime, endTime, entity } = searchParams
      searchParams.createTime = (startTime && endTime) ? [moment(startTime), moment(endTime)] : []
      searchParams.legalEntity = entity
      delete searchParams.startTime
      delete searchParams.endTime
      delete searchParams.entity
    }
    this.state = {
      searchParams: searchParams || {
        createTime: [],
        projectName: '',
        legalEntity: ''
      },
      modalType: 1,
      rejectRemovedStaffInfo: []
    }
  }

  getSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    this.selectedRowKeys = selectedRowKeys
    this.selectedRows = selectedRows
  }

  viewCurrentStaffDetail = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('ParametersDetail', row)
    this.props.history.push('/home/companyInsured/ParametersDetails')
  }

  removeCurrentStaff = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    this.isSingleRemove = true
    this.currentStaffInfo = row
    this.showModal(2)
  }

  searchData = async (searchParams: SearchParams) => {
    const createTime = searchParams.createTime
    if (!createTime) searchParams.createTime = []
    await this.setState({
      searchParams
    })
  }

  handleSubmit = (t: number) => {
    switch (t) {
      case 1:
        this.addNewStaffData()
        break
      case 2:
        this.showMultiRemoveModal()
        break
    }
  }

  addNewStaffData = () => {
    this.props.history.push('/home/companyInsured/parametersAdd')
  }

  // 批量删除弹窗
  showMultiRemoveModal () {
    this.isSingleRemove = false
    if (!this.selectedRowKeys.length) this.showModal(1)
    else this.showModal(2)
  }

  // 删除员工信息
  confirmRemoveStaffInfo = async () => {
    const { isSingleRemove, currentStaffInfo, selectedRowKeys } = this
    let id: (string|number)[] = []
    if (isSingleRemove) {
      if (!this.judgeCurrentCompanyIsRejectRemove()) return
      id.push(currentStaffInfo.id)
    } else {
      let isPass = true
      await this.getMultiRejectRemoveStaffInfo()
        .then(() => {
          id = selectedRowKeys
        })
        .catch(() => {
          isPass = false
        })
      if (!isPass) return
    }
    this.axios.request(this.api.companyMaintainDelete, { id })
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

  // 判断单条数据是否被引用
  judgeCurrentCompanyIsRejectRemove () {
    const { issUser } = this.currentStaffInfo
    if (issUser > 0) {
      this.showModal(3)
      return false
    }
    return true
  }

  // 多选判断是否正引用/曾被引用
  async getMultiRejectRemoveStaffInfo () {
    let rejectRemovedStaffInfo = []
    rejectRemovedStaffInfo = this.selectedRows.filter(item => item.issUser > 0)
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

  // 显示模态框
  showModal = async (modalType: number) => {
    await this.setState({
      modalType
    })
    ;(this.modal.current as BasicModal).handleOk()
  }

  // 隐藏模态框
  hideModal = () => {
    (this.modal.current as BasicModal).handleCancel()
  }

  render () {
    let ModalChildren: (props: any) => JSX.Element
    const [, , view, , del] = this.AuthorityList.companyInsured
    const canIView = this.isAuthenticated(view)
    const canIDel = this.isAuthenticated(del)
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 100 },
      { title: '法人主体', dataIndex: 'entity', width: 100 },
      { title: '参保城市', dataIndex: 'icName', width: 100 },
      { title: '参保标准', dataIndex: 'standardName', width: 100 },
      { title: '起缴规则', dataIndex: 'startRuleTime', width: 100 },
      { title: '停缴规则', dataIndex: 'endRuleTime', width: 100 },
      // {
      //   title: '生效日期',
      //   dataIndex: 'takeEffectTime',
      //   width: 100
      // },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
        sorter: (a: KeyValue, b: KeyValue) => moment(a.createTime).isBefore(b.createTime)
      },
      {
        title: '操作',
        width: 100,
        key: 'tags',
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
    const { searchParams, modalType, rejectRemovedStaffInfo } = this.state
    const { issUser } = this.currentStaffInfo
    const { createTime, projectName, legalEntity } = searchParams
    const [startTime, endTime] = createTime
    const params: KeyValue = {
      startTime: (startTime && moment(startTime).format('YYYY-MM-DD')) || '',
      endTime: (endTime && moment(endTime).format('YYYY-MM-DD')) || '',
      projectName,
      entity: legalEntity
    }
    const { queryCompanyList, companyImport, exportExcel, companyTemplateDownload } = this.api
    const tips = issUser === 1 ? '曾被引用' : '正被引用'
    if (!canIView && !canIDel) columnData.splice(columnData.length - 1)
    if (modalType === 1) {
      ModalChildren = (props: any) => {
        return (
          <div>
            <h2 className="tips_text">请选择需删除的公司（法人主体）</h2>
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
            <h2 className="tips_text">同法人主体同一生效日期对应的其他项目记录将一并删除，确认删除？</h2>
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
            <h2 className="tips_text">该公司维护参数{tips}，不可删除。</h2>
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
            <h2 className="tips_text">以下公司（法人主体）维护参数正被引用/曾被引用，不可删除。</h2>
            <div className="reject_list">
              {
                rejectRemovedStaffInfo.map(item => <Row key={item.id}>{item.entity}</Row>)
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
      <div id="insured-accounte-page" style={{ padding: 20 }}>
        <TableFilter searchParams={this.state.searchParams} getFilterData={this.searchData} />
        <TableOperateComponent
          importAction={companyImport}
          exportAction={exportExcel}
          exportParams={params}
          exportFileName="HR公司维护信息导出"
          downloadAction={companyTemplateDownload}
          downloadFileName="HR公司维护信息导出模板"
          submit={this.handleSubmit} />
        <TableItem
          onRow
          filterKey="id"
          rowSelection={false}
          ref={this.table}
          URL={queryCompanyList}
          columns={columnData}
          rowKey={({ id }) => id}
          searchParams={params}
          getSelectedRow={this.getSelectedRow}
          bufferSearchParamsKey='companyInsured_searchParams'
        />
        {/* 删除提示 */}
        <BasicModal ref={this.modal}>
          <ModalChildren />
        </BasicModal>
      </div>
    )
  }
}
