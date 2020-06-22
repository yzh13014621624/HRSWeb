/*
 * @description: 账号管理主页面
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-07 15:50:07
 * @LastEditTime: 2020-06-08 17:15:03
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, Input, Icon, Modal, Col } from 'antd'
import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'
import { BaseProps, KeyValue } from 'typings/global'
import { SysUtil } from '@utils/index'
import EditModal from './components/editModal'
import SelectRole from './components/selectRole'
import DeleteModal from './components/deleteModal'
import moment from 'moment'
import './index.styl'
const { Item } = Form

interface State {
  titleName: number
  identification: number
  searchParams: KeyValue
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
interface AccountManagementProps extends BaseProps, FormComponentProps {}

class AccountManagement extends RootComponent<AccountManagementProps, State> {
  editModalRef = React.createRef<EditModal>()
  selectRole = React.createRef<SelectRole>()
  deleteModalRef = React.createRef<DeleteModal>()
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: AccountManagementProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('accountManagement_searchParams')
    this.state = {
      titleName: 0,
      identification: 2, // 启用停用状态
      searchParams: searchParams || {}
    }
  }

  componentDidMount = () => {
    // const { api: { SystemQueryRoleList } } = this
    // this.axios.request(SystemQueryRoleList, ).then(({ code }) => {

    // })
  }
  // 列表选中数据
  getSelect = (selectedRowKeys: any, selectedRows: any) => {

  }

  // 搜索按钮
  searchBtn = () => {
    const userInfo = this.props.form.getFieldValue('userInfo')
    this.setState({
      searchParams: {
        userInfo: userInfo || undefined
      }
    })
  }

  // 打开模态框（1新增 2编辑 3选择角色 4更换角色 5删除 7停用/启用）
  openModal = async (type: number, records?: any, identification?: number) => {
    (type === 1 || type === 2) && this.editModalRef.current!.openModal(type, records);
    (type === 3 || type === 4) && await this.selectRole.current!.openModal(type, records);
    (type === 5 || type === 7) && await this.deleteModalRef.current!.openModal(type, records)
    this.setState({
      titleName: type,
      identification: identification || 2
    })
  }

  tableDataLoad = () => {
    this.tableRef.current!.loadingTableData()
  }

  render () {
    const {
      state: { searchParams, titleName, identification },
      props: { form: { getFieldDecorator } },
      AuthorityList: { accountManagement }
    } = this
    const [ edit, add, det, rep, del ] = accountManagement
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 100 },
      { title: '用户名', dataIndex: 'userPhone', width: 180 },
      {
        title: '角色',
        dataIndex: 'roleName',
        width: 200,
        render: (text: any, records: any) => {
          return (
            <div>
              {
                text
                  ? <span>{text}</span>
                  : (this.isAuthenticated(rep) && <span style={{ color: '#40A9FF', cursor: 'pointer' }} onClick={() => this.openModal(3, records)}>选择角色</span>)
              }
            </div>
          )
        }
      },
      { title: '用户姓名', dataIndex: 'userName', width: 220 },
      { title: '创建时间', dataIndex: 'createTime', width: 260 },
      {
        title: '操作',
        // width: 300,
        render: (text: any, records: any) => {
          return (
            <div style={{ color: '#40A9FF' }} className="accountManagement-operation">
              {
                this.isAuthenticated(edit) &&
                <span onClick={() => this.openModal(2, records)}>查看</span>
              }
              {
                this.isAuthenticated(det) &&
                <span onClick={() => this.openModal(7, records)} style={text.status === 1 ? { color: '#3DBB00' } : { color: '#F5222D' }}>{text.status === 1 ? '启用' : '停用'}</span>
              }
              {
                records.roleName && this.isAuthenticated(rep) &&
                <span onClick={() => this.openModal(4, records)}>更换角色</span>
              }
              {
                this.isAuthenticated(del) &&
                <span onClick={() => this.openModal(5, records)}>删除</span>
              }
            </div>
          )
        }
      }
    ]
    return (
      <div id='accountManagement'>
        <Row type='flex' justify='space-between'>
          <Form layout='inline'>
            <Item>
              {getFieldDecorator('userInfo', {
                initialValue: searchParams.userInfo
              })(<Input placeholder = "请输入用户名/姓名" allowClear maxLength={11}/>)}
            </Item>
            <Item>
              <Button type='primary' onClick={this.searchBtn} className="contract-search-button">搜索</Button>
            </Item>
          </Form>
        </Row>
        {
          this.isAuthenticated(add) &&
          <Row className="accountManagement-addBtn">
            <Button className="contract-page-button" type="primary" onClick={() => this.openModal(1)}>
              <Icon component={IconTj}/>新增
            </Button>
          </Row>
        }
        <Row>
          <TableItem
            rowSelectionFixed
            ref={this.tableRef}
            filterKey="userID"
            rowKey={({ userID }) => userID}
            URL={this.api.SystemQueryUserList}
            searchParams={ searchParams }
            columns={columnData}
            getSelectedRow={this.getSelect}
            scroll={{ x: 1400 }}
            bufferSearchParamsKey='accountManagement_searchParams'
          />
        </Row>
        <EditModal titleName={titleName} {...this.props} ref={this.editModalRef} tableDataLoad={() => this.tableDataLoad()}/>
        <SelectRole titleName={titleName} {...this.props} ref={this.selectRole} tableDataLoad={() => this.tableDataLoad()}/>
        <DeleteModal titleName={titleName} {...this.props} ref={this.deleteModalRef} tableDataLoad={() => this.tableDataLoad()}/>
      </div>
    )
  }
}
export default Form.create<AccountManagementProps>()(AccountManagement)
