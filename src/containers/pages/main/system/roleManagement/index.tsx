/*
 * @description: 角色管理主页面
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-08 15:50:07
 * @LastEditTime: 2020-06-12 11:10:32
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, Input, Icon, Modal, Col } from 'antd'
import { IconAddbtn, IconJbtn, IconTj, IconCorrect } from '@components/icon/BasicIcon'
import { BaseProps, KeyValue } from 'typings/global'
import { BaseCommonModal } from '@shared/modal/Modal'
import { FormatInputValue, SysUtil } from '@utils/index'
import moment from 'moment'
import './index.styl'
const { Item } = Form

interface State {
  searchParams: KeyValue
  msg: string // 模态框显示标题
  disabled: boolean
}

interface RoleManagementProps extends BaseProps, FormComponentProps {}

class RoleManagement extends RootComponent<RoleManagementProps, State> {
  modalDeleteRef = React.createRef<BaseCommonModal>()
  modalRef = React.createRef<BasicModal>()
  tableRef = React.createRef<TableItem<any>>()
  addOrEdit: boolean = true // 新增-true 编辑-false
  selectData: any = {} // 当前操作的整条数据---点击查看或者删除的时候的当条数据
  constructor (props: RoleManagementProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('roleManagement_searchParams')
    this.state = {
      searchParams: searchParams || {},
      msg: '',
      disabled: true
    }
  }

  // 列表选中数据
  getSelect = (selectedRowKeys: any, selectedRows: any) => {

  }

  // 搜素按钮
  searchBtn = () => {
    const roleName = this.props.form.getFieldValue('roleNames')
    this.setState({
      searchParams: {
        roleName: roleName || undefined
      }
    })
  }

  // 打开模态框（1新增 2编辑）
  openModal = async (type: number, records?: any) => {
    const {
      props: { form: { setFieldsValue } }
    } = this
    this.props.form.resetFields()
    await this.modalRef.current!.handleOk()
    if (type === 1) {
      this.addOrEdit = true
      this.setState({ msg: '新增角色' })
    } else {
      this.addOrEdit = false
      this.selectData = records
      this.setState({
        msg: '编辑角色',
        disabled: false
      })
      // 这个时候使用setFieldsValue回显模态框里面的角色信息
      this.props.form.setFieldsValue({
        roleName: records.roleName
      })
    }
  }

  // 关闭模态框 addOrEdit为true说明是新增   false说明是编辑  主要用于区分打开模态框之后操作按钮是要执行新增的逻辑还是编辑的逻辑
  confirmOrCancel = () => {
    const { addOrEdit, api: { SystemInsertRole, SystemEditRole }, axios: { request }, $message: { success }, selectData } = this
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        if (addOrEdit) {
          // 调新增的接口走新增的逻辑
          let { code } = await request(SystemInsertRole, value)
          if (code === 200) {
            success('新增成功！')
          }
        } else {
          // 调编辑的接口走编辑的逻辑
          let { code } = await request(SystemEditRole, { ...value, arId: selectData.arId })
          if (code === 200) {
            success('修改成功！')
          }
        }
        this.closeModal()
        this.tableRef.current!.loadingTableData()
      }
    })
  }

  closeModal = () => {
    this.modalRef.current!.handleCancel()
  }

  // 删除列表行
  handleDelete = (records: any) => {
    this.selectData = records
    this.modalDeleteRef.current!.show()
  }

  // 删除二次确认
  isDelete = async () => {
    // selectData 删除要用到的参数从这里面取
    const { selectData, api: { SystemEeleteRole }, axios: { request }, $message: { success } } = this
    this.modalDeleteRef.current!.handleCancel()
    // 调删除的接口走删除的逻辑
    let { code } = await request(SystemEeleteRole, { arId: selectData.arId })
    if (code === 200) {
      success('删除成功！')
      this.tableRef.current!.loadingTableData()
    }
  }

  // 权限配置跳转
  toPage = (records: KeyValue) => {
    const { arId, roleName, roleStatus } = records
    if (roleStatus === 2) {
      this.props.history.push(`/home/authConfig/${arId}?arId=${arId}&roleName=${roleName}`)
    } else {
      this.props.history.push(`/home/authConfig?arId=${arId}&roleName=${roleName}`)
    }
  }

  // 按钮状态
  changeBtnStatus = () => {
    const { props: { form: { getFieldsValue, getFieldError } } } = this
    setTimeout(() => {
      const { roleName } = getFieldsValue()
      if (roleName && !getFieldError('roleName')) this.setState({ disabled: false })
      else this.setState({ disabled: true })
    }, 0)
  }

  /** 角色名称验证 */
  validator = (rules:any, value:any, callback:any) => {
    // let reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
    try {
      if (value.length === 0) {
        callback(new Error('请输入角色名称'))
      }
      // } else if (!reg.test(value)) {
      //   callback(new Error('长度为20字以内的中英文'))
      // }
      callback()
    } catch (err) {
      callback(new Error('请输入角色名称'))
    }
  }

  render () {
    const {
      props: { form: { getFieldDecorator } },
      state: { searchParams, msg, disabled },
      api: { SystemQueryRoleList },
      AuthorityList: { roleManagement }
    } = this
    const [ edit, add, authEdit, del ] = roleManagement
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 150 },
      { title: '角色名称', dataIndex: 'roleName', width: 200 },
      {
        title: '权限配置状态',
        dataIndex: 'roleStatus',
        width: 250,
        render: (text: any) => {
          return (
            <div className='configure'>
              <Icon component={text === 2 ? IconCorrect : IconJbtn} style={{ marginRight: '5px' }}/>{text === 2 ? '已配置' : '未配置'}
            </div>
          )
        }
      },
      { title: '创建人', dataIndex: 'operatorName', width: 200 },
      { title: '创建时间', dataIndex: 'createTime', width: 250 },
      {
        title: '操作',
        render: (text: any, records: any) => (
          <div style={{ color: '#40A9FF' }} className="roleManagement-operation">
            {
              this.isAuthenticated(edit) &&
              <span onClick={() => this.openModal(2, records)}>查看</span>
            }
            {
              this.isAuthenticated(authEdit) &&
              <span onClick={() => this.toPage(records)}>权限配置</span>
            }
            {
              this.isAuthenticated(del) &&
              <span onClick={() => this.handleDelete(records)}>删除</span>
            }
          </div>
        )
      }
    ]
    return (
      <div id='roleManagement'>
        <Row type='flex' justify='space-between'>
          <Form layout='inline'>
            <Item>
              {getFieldDecorator('roleNames', {
                initialValue: searchParams.roleName
              })(<Input placeholder = "请输入角色名称" allowClear maxLength={20}/>)}
            </Item>
            <Item>
              <Button type='primary' onClick={this.searchBtn} className="contract-search-button">搜索</Button>
            </Item>
          </Form>
        </Row>
        {
          this.isAuthenticated(add) &&
          <Row className="roleManagement-addBtn">
            <Button className="contract-page-button" type="primary" onClick={() => this.openModal(1)}>
              <Icon component={IconTj}/>新增
            </Button>
          </Row>
        }
        <Row>
          <TableItem
            ref={this.tableRef}
            rowSelectionFixed
            filterKey="arId"
            rowKey={({ arId }) => arId}
            scroll={{ x: 1300 }}
            URL={SystemQueryRoleList}
            searchParams={ searchParams }
            columns={columnData}
            getSelectedRow={this.getSelect}
            bufferSearchParamsKey='roleManagement_searchParams'
          />
        </Row>
        <BasicModal
          destroyOnClose={true}
          ref={this.modalRef}
          width={480}
          maskClosable = {false}
          title={msg}
        >
          <Row>
            <Item label='角色名称' labelCol={{ span: 6 }} wrapperCol = {{ span: 18 }} className='roleItem'>
              { getFieldDecorator('roleName', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    validator: this.validator
                  }
                ],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return FormatInputValue.removeEmpty(e.target.value)
                }
              })(<Input allowClear placeholder="请输入角色名称" maxLength={20} style={{ width: '80%' }} onChange={this.changeBtnStatus}></Input>) }
            </Item>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={() => this.preventMoreClick(this.confirmOrCancel)} disabled={disabled}>{msg === '新增角色' ? '确定' : '保存'}</Button>
            <Button onClick={this.closeModal}>取消</Button>
          </Row>
        </BasicModal>
        <BaseCommonModal
          {...this.props}
          ref={this.modalDeleteRef}
          confirm={this.isDelete}
          intercept
          text='确认要删除吗？'
        />
        {/* <BasicModal
          destroyOnClose
          ref={this.modalDeleteRef}
          maskClosable = {false}
        >
          <p>确认删除？</p>
          <Row>
            <Col>
              <Button type="primary">确定</Button>
              <Button onClick={() => this.closeModal(titleName)}>取消</Button>
            </Col>
          </Row>
        </BasicModal> */}
      </div>
    )
  }
}
const RoleManagements = Form.create<RoleManagementProps>()(RoleManagement)
export default RoleManagements
