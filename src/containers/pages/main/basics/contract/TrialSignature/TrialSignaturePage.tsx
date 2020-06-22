/**
 * @author maqian
 * @createTime 2019/03/28
 * @description 续签
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import SysUtil from '@utils/SysUtil'
import { TableItem, RootComponent, BasicModal, FileUpload, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, Select, Input, Button, Popconfirm, Row, Col, Divider, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { Link } from 'react-router-dom'
import SharedSelectEmployees from '@shared/sharedemployees/SharedSelectEmployees'
import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'
import SharedStructure from '@shared/structure/SharedStructure'

const Option = Select.Option

interface FormCompoentProps extends FormComponentProps {
  searchData: Function
  searchParams?: any
}
// 表单
@hot(module) // 热更新（局部刷新界面）
class FormCompoent extends RootComponent<FormCompoentProps, any> {
  constructor (props: any) {
    super(props)
    const { projectNumber, sjNumber, userName, organizeArr, placeholderText, signStatus } = this.props.searchParams
    this.state = {
      searchData: {
        projectNumber: projectNumber || '',
        sjNumber: sjNumber || projectNumber,
        userName: userName || '',
        organizeArr: organizeArr || [],
        signStatus: signStatus || undefined
      },
      showBtn: true,
      tipmsg: '', // 模态提示信息
      placeholderText: placeholderText || '管理编号'
    }
  }

  handleSumbit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        const { organizeArr, sjNumber, userName, signStatus } = values
        if (this.state.placeholderText === '管理编号') {
          let data = {
            organizeArr,
            sjNumber,
            userName,
            signStatus,
            projectNumber: '',
            placeholderText: '管理编号'
          }
          this.props.searchData(data)
        } else {
          let data = {
            organizeArr,
            sjNumber: '',
            userName,
            signStatus,
            projectNumber: sjNumber,
            placeholderText: '工号'
          }
          this.props.searchData(data)
        }
      }
    })
  }
  placeholderChange = (val:string) => {
    this.setState({
      placeholderText: val
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { searchData, placeholderText } = this.state
    const { sjNumber, userName, organizeArr, signStatus } = searchData
    return (
      <Form layout="inline" onSubmit={this.handleSumbit}>
        <Form.Item className="contract-com-margin-r-10">
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue={placeholderText} onChange={this.placeholderChange} style={{ width: '0.63rem' }} >
            <Option value="工号">工号</Option>
            <Option value="管理编号">管理编号</Option>
          </Select>
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('sjNumber', {
            initialValue: sjNumber,
            rules: [{
              required: false,
              pattern: new RegExp(/^([a-zA-Z_]|[0-9]){1,14}$/, 'g'),
              message: '请输入字母或数字 长度在14位之内'
            }]
          })(
            <Input placeholder={`请输入${placeholderText}`} width="1.15rem" allowClear />
          )}
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('userName', {
            initialValue: userName || undefined,
            rules: [{
              required: false,
              pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z_]){1,15}$/, 'g'),
              message: '请输入中文或英文 长度在15位之内'
            }]
          })(
            <Input placeholder="请输入姓名" width="1.15rem" allowClear />
          )}
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('organizeArr', {
            initialValue: organizeArr || undefined
          })(<SharedStructure type="string" multiple/>)}
        </Form.Item>
        <Form.Item label='电子合同签署状态'>
          {getFieldDecorator('signStatus', {
            initialValue: signStatus || undefined
          })(
            <Select placeholder='全部' allowClear style={{ width: '1.15rem' }}>
              <Option value={1}>待签署</Option>
              <Option value={2}>待审核</Option>
              <Option value={3}>待重签</Option>
              <Option value={4}>已签署</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" >搜索</Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create<FormCompoentProps>()(FormCompoent)

// 用于定义父组件传递过来的值
interface TrialSignatureProps {
  history?: any
  statusSelect?: number
}
@hot(module) // 热更新（局部刷新界面）
export default class TrialSignaturePage extends RootComponent<TrialSignatureProps, any> {
  keys:any[]
  FileUpload = React.createRef<FileUpload>()
  tableItem = React.createRef<TableItem<any>>()
  constructor (props: any) {
    super(props)
    const searchData = SysUtil.getSessionStorage('TrialSignaturePage_searchParams')
    this.state = {
      delVisible: false, // 删除模态框
      delId: '',
      searchParams: searchData || {
        organizeArr: [],
        projectNumber: '',
        sjNumber: '',
        userName: ''
      },
      visible: false
    }
    this.keys = []
  }
  showDetail = (record:any, e:any) => {
    e.preventDefault()
    this.routerLink(`/home/ContractPage/TrialSignatureDetail`)
    SysUtil.setSessionStorage('TrialDataDetail', record)
  }
  routerLink = (path:string) => {
    this.props.history.push(path)
  }
  searchData = async (data:any) => {
    await this.setState({
      searchParams: data
    })
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  closeDialog = (val:boolean) => {
    this.setState({
      visible: val
    })
  }
  onChanges = (data:any) => {
    const { history } = this.props
    history.replace({ pathname: '/home/ContractPage/TrialSignatureAddPage' })
    SysUtil.setSessionStorage('TrialData', data[0])
  }
  onDelete = (num:number = 0, id?:any, e?:any) => {
    e && e.preventDefault()
    if (num === 0) {
      this.setState({
        delVisible: true,
        delId: [id],
        showBtn: true,
        tipmsg: '确认删除？'
      })
    } else {
      if (this.keys.length > 0) {
        this.setState({
          delVisible: true,
          delId: this.keys,
          showBtn: true,
          tipmsg: '确认删除？'
        })
      } else {
        this.setState({
          delVisible: true,
          showBtn: false,
          tipmsg: '请选择需删除的员工合同'
        })
      }
    }
  }
  /* 删除信息 */
  removeData = (id:any[]) => {
    const { api, axios } = this
    let obj = {
      idDeleteList: id,
      baseType: 2
    }
    axios.request(api.contractDel, obj).then((res:any) => {
      const { removeLodingTable } = this.tableItem.current as TableItem<any>
      removeLodingTable(id.length)
      this.keys = []
      this.$message.success('删除成功！')
      this.setState({
        delVisible: false
      })
      // 消息不显示
    }).catch((err:any) => {
      const { msg } = err
      this.error(msg || err)
      this.setState({
        delVisible: false
      })
    })
  }
  /** 单个改变的时候 */
  getSelect = (record:any, selected:any, selectedRows:any) => {
    if (selected) { // 单个选中
      this.keys.push(record.id)
    } else {
      let index = this.keys.indexOf(record.id)
      if (index >= 0) { // 存在则移除
        this.keys.splice(index, 1)
      }
    }
  }

  /** 多个改变的时候 */
  getSelectAll = (selected:any, selectedRows:any, changeRows:any) => {
    if (selected) { // 全部选中
      selectedRows.forEach((el:any) => {
        let index = this.keys.indexOf(el.id)
        if (index < 0) {
          this.keys.push(el.id)
        }
      })
    } else {
      changeRows.forEach((el:any) => {
        let index = this.keys.indexOf(el.id)
        if (index >= 0) {
          this.keys.splice(index, 1)
        }
      })
    }
  }

  modalCancel = () => {
    this.setState({
      delVisible: false
    })
  }

  showContract = (recode: any, e:any) => { // 电子合同查看
    e.preventDefault()
    const { id, signStatus } = recode
    this.props.history.push(`/home/ContractPage/ElectroniContract/${id}/${signStatus}/2`)
  }

  SignRequest = (recode:any, e:any) => {
    e.preventDefault()
    const { id } = recode
    this.axios.request(this.api.handleRequrst, { id }, true).then((res:any) => {
      this.$message.success('发起成功！')
    }).catch((err:any) => {
      const { msg } = err
      this.error(msg[0] || err)
    })
  }

  render () {
    const { searchParams, visible, delId, tipmsg, showBtn } = this.state
    const { api, AuthorityList, isAuthenticated } = this
    const contract = AuthorityList.contract
    let tags:any = {
      title: '操作',
      key: 'tags',
      align: 'center',
      fixed: 'right',
      width: 160,
      render: (text:string, record:any) => {
        const { signStatus } = record
        return (
          <span>
            {
              isAuthenticated(contract[9]) &&
                <a onClick={(e) => this.showDetail(record, e)} title="用户查看" className="mgl10">查看</a>
            }
            { isAuthenticated(contract[21]) && (signStatus === 2 || signStatus === 4) &&
              <a style={{ margin: '0 0 0 13px' }} onClick={(e) => this.showContract(record, e)} title="电子合同" className="mgl10">电子合同</a>
            }
            {
              isAuthenticated(contract[11]) &&
                <a style={{ margin: '0 0 0 13px' }} onClick={(e) => this.onDelete(0, record.id, e)} title="用户删除" className="mgl10">删除</a>
            }
            {
              (signStatus === 1 || signStatus === 3) &&
              <a style={{ margin: '0 13px' }} onClick={(e) => this.SignRequest(record, e)} title="发起重签" className="mgl10">发起重签</a>
            }
          </span>
        )
      }
    }
    let columnData = [
      { title: '序号', dataIndex: 'index', width: 80 },
      {
        title: '项目',
        dataIndex: 'userInfo.projectName',
        width: 80,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '工号',
        dataIndex: 'userInfo.projectNumber',
        width: 100,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '管理编号',
        dataIndex: 'userInfo.sjNumber',
        width: 100,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '姓名',
        dataIndex: 'userInfo.userName',
        width: 100,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '组织',
        dataIndex: 'userInfo.organize',
        width: 300,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '身份证号码/通行证/护照号',
        dataIndex: 'userInfo.idCard',
        width: 200,
        render: (text:string, recode:any) => { return <span>{text || recode.userInfo.passportCard || '- - -'}</span> }
      },
      {
        title: '员工类型',
        dataIndex: 'userInfo.roleType',
        width: 100,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '合同类型',
        dataIndex: 'typeName',
        width: 170,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '法人主体',
        dataIndex: 'userInfo.entity',
        width: 200,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '工时类型',
        dataIndex: 'hourType',
        width: 150,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '计税类型',
        dataIndex: 'taxationType',
        width: 150,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '续签合同签署次数',
        dataIndex: 'signTimes',
        width: 150,
        render: (text:string) => (<span>{text || '- - -' }</span>)
      },
      {
        title: '合同起始日期',
        dataIndex: 'startTime',
        width: 130,
        render: (text:string) => (<span>{text || '- - -'}</span>),
        sorter: (a:any, b:any) => Date.parse(a.startTime.replace('-', '/').replace('-', '/')) - Date.parse(b.startTime.replace('-', '/').replace('-', '/'))
      },
      {
        title: '合同终止日期',
        dataIndex: 'endTime',
        width: 130,
        render: (text:string) => (<span>{text || '- - -'}</span>),
        sorter: (a:any, b:any) => Date.parse(a.endTime.replace('-', '/').replace('-', '/')) - Date.parse(b.endTime.replace('-', '/').replace('-', '/'))
      },
      {
        title: '电子合同签署状态',
        dataIndex: 'signStatusName',
        width: 150,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      }
    ]
    if (isAuthenticated(contract[9]) || isAuthenticated(contract[11]) || isAuthenticated(contract[21])) {
      columnData.push(tags)
    }
    return (
      <div>
        <Row>
          <WrappedRegistrationForm searchParams={searchParams} searchData={this.searchData} {...this.props} />
        </Row>
        <Row className="row-margin">
          <Col>
            {
              isAuthenticated(contract[8]) &&
                <Button onClick={this.showModal} className="contract-page-button" type="primary">
                  <Icon component={IconTj}/>新增
                </Button>
            }
            {
              isAuthenticated(contract[11]) &&
                <Button onClick={(e) => this.onDelete(1, e)} className="contract-page-button" type="primary">
                  <Icon component={IconSc}/>批量删除
                </Button>
            }
            {
              isAuthenticated(contract[12]) &&
                <FileUpload params={{
                  baseType: 2
                }}
                ref={this.FileUpload} action={api.contraImport.path}>
                  <Button className="contract-page-button" type="primary">
                    <Icon component={IconDr}/>导入
                  </Button>
                </FileUpload>
            }
            {
              isAuthenticated(contract[13]) &&
                <BasicDowload action={api.contRenewExport}
                  dowloadURL="URL"
                  parmsData={searchParams} fileName="续签合同信息导出"
                  className="contract-page-button" btntype="primary">
                  <Icon component={IconDc}/>导出
                </BasicDowload>
            }
            {
              isAuthenticated(contract[14]) &&
                <BasicDowload action={api.contractMoudleLoad}
                  parmsData={{ type: '.xlsx', baseType: 2 }} fileName="续签合同信息导入模板"
                  className="contract-page-button" btntype="primary">
                  <Icon component={IconXz}/>下载导入模版
                </BasicDowload>
            }
          </Col>
        </Row>
        <TableItem
          ref={this.tableItem}
          rowSelectionFixed
          filterKey="index"
          rowKey={({ index }) => index}
          searchParams={searchParams}
          URL={api.contRemewList}
          columns={columnData}
          scroll={{ x: 2300 }}
          getRemoveSelect={this.getSelect}
          getRemoveSelectAll={this.getSelectAll}
          bufferSearchParamsKey='TrialSignaturePage_searchParams'
        />
        <SharedSelectEmployees {...this.props} statusSelectss={2} onChanges={this.onChanges} closeDialog={this.closeDialog} visible={visible} />
        <Modal
          title='提示'
          style={{ textAlign: 'center' }}
          centered={true}
          footer={false}
          visible={this.state.delVisible}
          onCancel={this.modalCancel}
          width={'2.5rem'}
        >
          { showBtn
            ? <div>
              <Row style={{ padding: '0 0 0.26rem 0' }}>
                <p style={{ textAlign: 'center' }}>{tipmsg}</p>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <Button onClick={() => this.removeData(delId)} type="primary" className="sumbit-btn">是</Button>
                <Button onClick={() => this.setState({ delVisible: false })} className="cancel-btn">否</Button>
              </Row>
            </div>
            : <div style={{ textAlign: 'center' }}>
              <Row style={{ padding: '0 33px 0.260rem 0' }}>
                <p >{tipmsg}</p>
              </Row>
              <Row>
                <Button onClick={() => this.setState({ delVisible: false })} type="primary" className="sumbit-btn">确定</Button>
              </Row>
            </div>
          }
        </Modal>
      </div>
    )
  }
}
