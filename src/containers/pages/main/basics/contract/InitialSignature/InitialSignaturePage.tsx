/**
 * @author maqian
 * @createTime 2019/03/28
 * @description 初签
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { TableItem, RootComponent, BasicModal, FileUpload, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, Select, Input, Button, Row, Col, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import SharedSelectEmployees from '@shared/sharedemployees/SharedSelectEmployees'
import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'
import SharedStructure from '@shared/structure/SharedStructure'
import SysUtil from '@utils/SysUtil'

const Option = Select.Option

interface FormCompoentProps extends FormComponentProps {
  searchData: Function,
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
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue={placeholderText} onChange={this.placeholderChange} style={{ width: '0.63rem' }}>
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
            <Input placeholder={`请输入${placeholderText}`} allowClear width="1.15rem" />
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
            <Input placeholder="请输入姓名" allowClear width="1.15rem" />
          )}
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('organizeArr', {
            initialValue: organizeArr || undefined
          })(<SharedStructure type="string" multiple />)}
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

interface InitialSignatureProps {
  history?: any
  statusSelect?: number
}
interface InitialSignatureStatus {
  searchParams?:any
  visible?:any
  visibleOne:boolean
  // delVisible?:any
  // delId?:any
  // tipmsg?:string
  // showBtn?:boolean
}
@hot(module) // 热更新（局部刷新界面）
export default class InitialSignaturePage extends RootComponent<InitialSignatureProps, InitialSignatureStatus> {
  FileUpload = React.createRef<FileUpload>()
  tableItem = React.createRef<TableItem<any>>()
  // keys:any[]
  constructor (props: any) {
    super(props)
    const searchData = SysUtil.getSessionStorage('InitialSignaturePage_searchParams')
    // this.keys = []
    this.state = {
      visible: false,
      visibleOne: false,
      // delVisible: false, // 删除模态框
      // delId: '',
      // showBtn: true,
      // tipmsg: '', // 模态提示信息
      searchParams: searchData || {
        organizeArr: [],
        projectNumber: '',
        sjNumber: '',
        userName: ''
      }
    }
  }
  showDetail = (record:any, e:any) => {
    e.preventDefault()
    this.props.history.push(`/home/ContractPage/InitialSignatureDetail`)
    SysUtil.setSessionStorage('InitiaDataDetail', record)
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  searchData = async (data:any) => {
    await this.setState({
      searchParams: data
    })
  }

  closeDialog = (f:boolean) => {
    this.setState({
      visible: f,
      visibleOne: f
    })
  }
  onChanges = (data:any) => { // 父组件自定义一个onChanges事件
    // 父组件得到子组件传递的data数据，将路径与数据添加到路由上
    const { history } = this.props
    history.replace({ pathname: '/home/ContractPage/InitialSignatureAddPage' })
    SysUtil.setSessionStorage('InitiaData', data[0])
  }

  onContractChanges = (data:any) => {
    const { history } = this.props
    history.replace({ pathname: '/home/ContractPage/TransContractAdd' })
    SysUtil.setSessionStorage('TransContractData', data[0])
  }
  // onDelete = (num:number = 0, id?:any) => {
  //   if (num === 0) {
  //     this.setState({
  //       delVisible: true,
  //       delId: [id],
  //       showBtn: true,
  //       tipmsg: '删除后该员工薪资，异动，离职，续签合同等信息将一并删除，是否确认？'
  //     })
  //   } else {
  //     if (this.keys.length > 0) {
  //       this.setState({
  //         delVisible: true,
  //         delId: this.keys,
  //         showBtn: true,
  //         tipmsg: '删除后该员工薪资，异动，离职，续签合同等信息将一并删除，是否确认？'
  //       })
  //     } else {
  //       this.setState({
  //         delVisible: true,
  //         showBtn: false,
  //         tipmsg: '请选择需删除的员工合同'
  //       })
  //     }
  //   }
  // }
  // /* 删除信息 */
  // removeData = (id:any[]) => {
  //   const { api, axios } = this
  //   let obj = {
  //     idDeleteList: id,
  //     baseType: 1
  //   }
  //   axios.request(api.contractDel, obj).then((res:any) => {
  //     const { removeLodingTable } = this.tableItem.current as TableItem<any>
  //     removeLodingTable(id.length)
  //     this.keys = []
  //     this.$message.success('删除成功！')
  //     this.setState({
  //       delVisible: false
  //     })
  //   }).catch((err:any) => {
  //     const { msg } = err
  //     this.error(msg || err)
  //     this.setState({
  //       delVisible: false
  //     })
  //   })
  // }
  // /** 单个改变的时候 */
  // getSelect = (record:any, selected:any, selectedRows:any) => {
  //   if (selected) { // 单个选中
  //     this.keys.push(record.id)
  //   } else {
  //     let index = this.keys.indexOf(record.id)
  //     if (index >= 0) { // 存在则移除
  //       this.keys.splice(index, 1)
  //     }
  //   }
  // }

  // /** 多个改变的时候 */
  // getSelectAll = (selected:any, selectedRows:any, changeRows:any) => {
  //   if (selected) { // 全部选中
  //     selectedRows.forEach((el:any) => {
  //       let index = this.keys.indexOf(el.id)
  //       if (index < 0) {
  //         this.keys.push(el.id)
  //       }
  //     })
  //   } else {
  //     changeRows.forEach((el:any) => {
  //       let index = this.keys.indexOf(el.id)
  //       if (index >= 0) {
  //         this.keys.splice(index, 1)
  //       }
  //     })
  //   }
  // }
  // modalCancel = () => {
  //   this.setState({
  //     delVisible: false
  //   })
  // }
  showContract = (recode:any, e:any) => { // 电子合同查看
    e.preventDefault()
    const { id, signStatus } = recode
    this.props.history.push(`/home/ContractPage/ElectroniContract/${id}/${signStatus}/1`)
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

  InitialContract = () => { // 异动初签合同
    // e.preventDefault()
    this.setState({
      visibleOne: true
    })
  }

  render () {
    // const { searchParams, visible, delId, tipmsg, showBtn } = this.state
    const { searchParams, visible, visibleOne } = this.state
    const { api, AuthorityList, isAuthenticated } = this
    const contract = AuthorityList.contract
    let tags:any = {
      title: '操作',
      key: 'tags',
      fixed: 'right',
      align: 'center',
      width: 120,
      render: (text:string, record:any) => {
        const { signStatus } = record
        return (
          <span>
            {
              isAuthenticated(contract[2]) &&
                <a onClick={(e) => this.showDetail(record, e)} title="用户查看" className="mgl10">查看</a>
            }
            { isAuthenticated(contract[22]) && (signStatus === 2 || signStatus === 4) &&
              <a style={{ margin: '0 13px' }} onClick={(e) => this.showContract(record, e)} title="电子合同" className="mgl10">电子合同</a>
            }
            {
              (signStatus === 1 || signStatus === 3) &&
              <a style={{ margin: '0 13px' }} onClick={(e) => this.SignRequest(record, e)} title="发起重签" className="mgl10">发起重签</a>
            }
            {/* {
              isAuthenticated(contract[4]) &&
                <a style={{ margin: '0 13px' }} onClick={() => this.onDelete(0, record.id)} title="用户删除" className="mgl10">删除</a>
            } */}
          </span>
        )
      }
    }
    let columnData = [
      { title: '序号', dataIndex: 'index', width: 80 },
      {
        title: '项目',
        dataIndex: 'userInfo.projectName',
        width: 100,
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
        render: (text:string, recode:any) => {
          return <span>{text || recode.userInfo.passportCard || '- - -'}</span>
        }
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
        title: '初签合同签署次数',
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
    if (isAuthenticated(contract[2]) || isAuthenticated(contract[4])) {
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
              isAuthenticated(contract[1]) &&
              <Button onClick={this.showModal} className="contract-page-button" type="primary">
                <Icon component={IconTj}/>新增
              </Button>
            }
            {
              isAuthenticated(contract[20]) &&
              <Button onClick={this.InitialContract} className="contract-page-button" type="primary">
                <Icon component={IconTj}/>异动初签合同
              </Button>
            }
            {/* {
              isAuthenticated(contract[4]) &&
                <Button onClick={() => this.onDelete(1)} className="contract-page-button" type="primary">
                  <Icon component={IconSc}/>批量删除
                </Button>
            } */}
            {
              isAuthenticated(contract[5]) &&
                <FileUpload params={{
                  baseType: 1
                }}
                ref={this.FileUpload} action={api.contraImport.path}>
                  <Button className="contract-page-button" type="primary">
                    <Icon component={IconDr}/>导入
                  </Button>
                </FileUpload>
            }
            {
              isAuthenticated(contract[6]) &&
                <BasicDowload action={api.contractExport}
                  parmsData={searchParams} fileName="初签合同信息导出"
                  dowloadURL="URL"
                  className="contract-page-button" btntype="primary">
                  <Icon component={IconDc}/>导出
                </BasicDowload>
            }
            {
              isAuthenticated(contract[7]) &&
                <BasicDowload action={api.contractMoudleLoad}
                  parmsData={{ type: '.xlsx', baseType: 1 }} fileName="初签合同信息导入模板"
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
          URL={api.contractfirstlist}
          columns={columnData}
          scroll={{ x: 2200 }}
          bufferSearchParamsKey='InitialSignaturePage_searchParams'
          // getRemoveSelect={this.getSelect}
          // getRemoveSelectAll={this.getSelectAll}
        />
        <SharedSelectEmployees onChanges={this.onChanges} statusSelectss={1} {...this.props} visible={visible} closeDialog={this.closeDialog} />
        <SharedSelectEmployees onChanges={this.onContractChanges} statusSelectss={4} {...this.props} visible={visibleOne} closeDialog={this.closeDialog} />
        {/* <Modal
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
              <Row style={{ padding: '0 0 0.260rem 0' }}>
                <p style={{ textAlign: 'left' }}>{tipmsg}</p>
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
        </Modal> */}
      </div>
    )
  }
}
