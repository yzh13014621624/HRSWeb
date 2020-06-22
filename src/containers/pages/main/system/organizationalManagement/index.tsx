/*
 * @description: 组织管理主页面
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-08 15:50:07
 * @LastEditTime: 2020-06-08 16:48:37
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, FileUpload, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, Input, Icon, Modal, Col, Tabs } from 'antd'
import { IconXz, IconDr, IconTj, IconSc, IconEdit } from '@components/icon/BasicIcon'
import { BaseProps, KeyValue } from 'typings/global'
import OrganizationalTree from '@pages/main/system/organizationalManagement/components/organizationalTree/OrganizationalTree'
import { BaseCommonModal } from '@shared/modal/Modal'
import { JudgeUtil, FormatInputValue, SysUtil } from '@utils/index'
import { inject } from 'mobx-react'
import moment from 'moment'
import './index.styl'

const { TabPane } = Tabs
const { Item } = Form

interface State {
  searchParams: string
  type: number
  orlevel: number
  parentId: number
  orId: number
  msg: string
  organize: string
  info: KeyValue
  disabled: boolean
}

interface OrganizationalProps extends BaseProps, FormComponentProps {
  mboxCommont?:any
}

@inject('mboxCommont', 'mobxGlobal')
class OrganizationalManagement extends RootComponent<OrganizationalProps, State> {
  modalDeleteRef = React.createRef<BaseCommonModal>()
  modalRef = React.createRef<BasicModal>()
  organizationalTreeRef = React.createRef<OrganizationalTree>()
  type = 0
  constructor (props: OrganizationalProps) {
    super(props)
    this.state = {
      searchParams: '',
      type: 0, // 默认显示为组织管理
      orlevel: 0,
      parentId: 0,
      orId: 0,
      msg: '',
      organize: '',
      info: {},
      disabled: false
    }
  }

  componentDidMount = () => {
    const searchParams = SysUtil.getSessionStorage('organizationalManagement_searchParams')
    // 挂载的时候更新组织数据
    this.fileSuccessChange()
    this.setState({
      searchParams: searchParams ? searchParams.searchParams : '',
      type: searchParams ? searchParams.type : 0
    })
  }

  searchBtn = () => {
    const { type } = this.state
    let searchParams = this.props.form.getFieldValue('organizational')
    SysUtil.setSessionStorage('organizationalManagement_searchParams', { searchParams, type })
    this.setState({
      searchParams
    })
  }

  tabsChange = (type: string) => {
    this.props.form.setFieldsValue({
      organizational: undefined
    })
    this.setState({
      type: Number(type),
      searchParams: '',
      parentId: 0,
      orId: 0,
      orlevel: 0,
      organize: ''
    })
  }

  treeChange = (treeInfo: KeyValue) => {
    const { value, parentId, orlevel, title, selected } = treeInfo
    this.setState({
      parentId: !selected ? parentId : 0,
      orlevel: !selected ? orlevel : 0,
      orId: !selected ? value : 0,
      organize: !selected ? (title || '') : ''
    })
  }

  // 1 组织 2 +子级组织 3 修改
  openModal = async (type: number) => {
    const { organize, orId } = this.state
    if (type !== 3) {
      this.props.form.setFieldsValue({
        organize: undefined
      })
      if (type === 1) await this.modalRef.current!.onShow()
      else if (type === 2 && orId > 0) await this.modalRef.current!.onShow()
      else this.$message.warn('请先选择父级组织！')
    } else if (type === 3 && organize.length > 0) {
      await this.modalRef.current!.onShow()
      this.props.form.setFieldsValue({
        organize: organize
      })
    } else {
      this.$message.warn('请先选择组织！')
    }
    this.type = type
    this.setState({
      msg: type !== 3 ? '添加组织' : '修改组织',
      disabled: type === 3 && organize.length > 0
    })
  }

  // 打开删除模态框
  deleteModal = () => {
    const { orId } = this.state
    if (orId > 0) {
      this.modalDeleteRef.current!.show()
    } else {
      this.$message.warn('请选择需要删除的组织！')
    }
  }

  // 删除模态框确认按钮
  isDelete = async () => {
    const { state: { orId }, axios: { request }, api: { SystemDelOrganize }, $message: { success } } = this
    const { code } = await request(SystemDelOrganize, { orId: [orId] })
    if (code === 200) {
      success('删除成功！')
      this.modalDeleteRef.current!.handleCancel()
      this.organizationalTreeRef.current!.deleteOrganiztional({ parentId: orId }, 3)
    }
  }

  // 新增修改
  confirmOrCancel = async () => {
    const {
      state: { parentId, orId, orlevel, msg, info: { next } },
      props: { form: { getFieldsValue } },
      api: { SystemAddOrganize, SystemUpdateOrganize },
      axios: { request },
      $message: { success, warn },
      type
    } = this
    const { organize } = getFieldsValue()
    let param = {}
    // 新增非选中
    if (type !== 3) {
      // 组织新增
      if (!parentId && !orId && !orlevel) {
        param = {
          organize,
          orlevel: next[0].level,
          parentId: next[0].parentId
        }
      } else {
        // 新增选中
        param = {
          organize,
          orlevel: type === 1 ? orlevel : orlevel + 1,
          parentId: type === 1 ? parentId === 0 ? orId : parentId : orId
        }
      }
      let { code, data } = await request(SystemAddOrganize, param)
      if (code === 200) {
        success('新增成功！')
        this.modalRef.current!.handleCancel()
        this.organizationalTreeRef.current!.addOrganize(data, 1)
      }
    } else {
      // 编辑
      param = {
        orId,
        organize,
        orlevel
      }
      let { code } = await request(SystemUpdateOrganize, param)
      if (code === 200) {
        success('修改成功！')
        this.modalRef.current!.handleCancel()
        this.organizationalTreeRef.current!.addOrganize({ organize, parentId: orId }, 2)
      }
    }
  }

  // 取消
  closeModal = () => {
    this.modalRef.current!.handleCancel()
  }

  // 获取当前组织的第一个
  getOrganizationInfo = (info: KeyValue) => {
    this.setState({
      info
    })
  }

  // 判断按钮是否置灰
  inputChang = () => {
    setTimeout(() => {
      let organize = this.props.form.getFieldValue('organize')
      this.setState({
        disabled: organize.length > 0 && !JudgeUtil.isEmpty(organize)
      })
    }, 0)
  }

  // 导入成功的回调
  fileSuccessChange = async () => {
    const { mboxCommont: { setOrganize } } = this.props
    await setOrganize() // 初始化信息 - 组织
    this.organizationalTreeRef.current!.refresh()
  }

  render () {
    const {
      props: { form: { getFieldDecorator } },
      state: { searchParams, type, msg, disabled },
      api: { SystemImportOrganize, SystemExportTemplate },
      isAuthenticated,
      AuthorityList: { organizationalManagement }
    } = this
    const [ add, edit, del, imt, dowImt ] = organizationalManagement
    return (
      <div id='organizationalManagement'>
        <Tabs onChange={this.tabsChange} activeKey={String(type)}>
          <TabPane tab={'上嘉'} key='0'>
          </TabPane>
          <TabPane tab={'盒马'} key='1'>
          </TabPane>
          <TabPane tab={'物美'} key='2'>
          </TabPane>
        </Tabs>
        <div className='titleBtn'>
          {
            isAuthenticated(add) &&
            <Button type='primary' onClick={() => this.openModal(1)}><Icon component={IconTj}/>组织</Button>
          }
          {
            isAuthenticated(add) &&
            <Button type='primary' onClick={() => this.openModal(2)}><Icon component={IconTj}/>子级组织</Button>
          }
          {
            isAuthenticated(edit) &&
            <Button type='primary' onClick={() => this.openModal(3)}><Icon component={IconEdit}/>修改</Button>
          }
          {
            isAuthenticated(imt) &&
            <FileUpload action={SystemImportOrganize.path}>
              <Button className="contract-page-button" type="primary">
                <Icon component={IconDr}/>导入
              </Button>
            </FileUpload>
          }
          {
            isAuthenticated(dowImt) &&
            <BasicDowload
              action={SystemExportTemplate}
              parmsData={{ type: '.xlsx' }}
              fileName="组织管理导入模板"
              btntype="primary"
            >
              <Icon component={IconXz}/>下载导入模板
            </BasicDowload>
          }
          {
            isAuthenticated(del) &&
            <Button type='primary' onClick={this.deleteModal}><Icon component={IconSc}/>删除</Button>
          }
        </div>
        <Form layout='inline' className='organizationalForm'>
          <Item>
            {getFieldDecorator('organizational', {
              initialValue: searchParams || undefined
            })(<Input placeholder = "请输入组织名称" allowClear/>)}
          </Item>
          <Item>
            <Button type='primary' onClick={this.searchBtn} className="contract-search-button">搜索</Button>
          </Item>
        </Form>
        <div className='organizationalTree'>
          <OrganizationalTree width={'100%'} type={type} ref={this.organizationalTreeRef} searchParams={searchParams} onChange={this.treeChange} getOrganizationInfo={this.getOrganizationInfo}/>
        </div>
        <BasicModal
          destroyOnClose={true}
          ref={this.modalRef}
          width={480}
          maskClosable = {false}
          title={msg}
        >
          <Row>
            <Item label='组织名称' labelCol={{ span: 6 }} wrapperCol = {{ span: 18 }} className='organizationalItem'>
              { getFieldDecorator('organize', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入法人主体名称（30字以内）'
                  }
                ],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return FormatInputValue.removeEmpty(e.target.value)
                }
              })(<Input allowClear placeholder="请输入法人主体名称（30字以内）" maxLength={30} style={{ width: '80%' }} onChange={this.inputChang}></Input>) }
            </Item>
          </Row>
          <Row className='organizationBtn'>
            <Button type="primary" onClick={() => this.preventMoreClick(this.confirmOrCancel)} disabled={!disabled}>{msg === '添加组织' ? '确定' : '保存'}</Button>
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
      </div>
    )
  }
}
const RoleManagements = Form.create<OrganizationalProps>()(OrganizationalManagement)
export default RoleManagements
