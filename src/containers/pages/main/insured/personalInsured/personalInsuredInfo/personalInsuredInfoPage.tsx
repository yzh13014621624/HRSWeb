/*
 * @description: 参保管理模块 - 个人参保 - 个人参保信息 主板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 15:43:30
 * @LastEditTime: 2020-05-27 11:35:00
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import TableFilterComponent from '../TableFilter'
import TableOperateComponent from '../TableOperate'
import TableItem from '@components/table/TableItem'
import SysUtil from '@utils/SysUtil'
import { hot } from 'react-hot-loader'

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
}

@hot(module)
export default class PersonalInsuredInfoPage extends RootComponent<BaseProps, BaseState> {
  table = React.createRef<TableItem<{}>>()

  constructor (props: BaseProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('personalInsuredInfo_searchParams')
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
      }
    }
  }

  getFilterData = (searchParams: SearchParams) => {
    this.setState({
      searchParams
    })
  }

  viewCurrentStaffDetail = (row: KeyValue, e: React.MouseEvent) => {
    e.stopPropagation()
    SysUtil.setSessionStorage('PersonalInsuredDetail', row)
    this.props.history.push('/home/personalInsured/personalInsuredInfo/detail')
  }

  render () {
    // 表头配置
    const tableHeader = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 80 },
      { title: '法人主体', dataIndex: 'entity' },
      { title: '工号', dataIndex: 'projectNumber', render: (text: string) => (<span>{text || '- - -'}</span>) },
      {
        title: '管理编号',
        dataIndex: 'sjNumber',
        sorter: (a: KeyValue, b: KeyValue) => {
          const NumA = Number(a.sjNumber.replace(/^[a-zA-Z0]+/g, ''))
          const NumB = Number(b.sjNumber.replace(/^[a-zA-Z0]+/g, ''))
          return NumA - NumB
        }
      },
      { title: '姓名', dataIndex: 'userName' },
      { title: '参保城市', dataIndex: 'cityName' },
      { title: '参保标准', dataIndex: 'standardName' },
      {
        title: '操作',
        align: 'center',
        render: (row: KeyValue) => {
          return (
            <span>
              <a onClick={this.viewCurrentStaffDetail.bind(this, row)}>查看</a>
            </span>
          )
        }
      }
    ]
    if (!this.isAuthenticated(this.AuthorityList.personalInsured[2])) tableHeader.splice(tableHeader.length - 1)
    const { searchParams } = this.state
    const { personalInsuredInfoPage, personalInsuredExport } = this.api
    const { userName, projectName, legalEntity, selectValue, filterNumberType = '' } = searchParams as KeyValue
    const params: KeyValue = { userName, projectName, entity: legalEntity, filterNumberType, selectValue }
    if (selectValue === '管理编号') params.sjNumber = filterNumberType
    else params.projectNumber = filterNumberType
    return (
      <div id="personal_insure_info_page">
        <div className="opterate-wrapper">
          <TableFilterComponent getFilterData={this.getFilterData} searchParams={this.state.searchParams} />
          <TableOperateComponent
            ex
            type={1}
            exportAction={personalInsuredExport}
            exportParams={params}
            exportFileName="HR个人参保信息导出" />
        </div>
        <TableItem
          rowSelection={false}
          ref={this.table}
          URL={personalInsuredInfoPage}
          filterKey="id"
          rowKey={({ id }) => id}
          columns={tableHeader as any}
          searchParams={params}
          bufferSearchParamsKey='personalInsuredInfo_searchParams'
        />
      </div>
    )
  }
}
