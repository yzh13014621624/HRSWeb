/*
 * @description: 新增员工
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-24 14:46:02
 * @LastEditTime: 2020-05-20 10:05:59
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicDowload } from '@components/index'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'
import { IconDc } from '@components/icon/BasicIcon'
import { Form, Select, Input, Button, Modal, Icon, DatePicker } from 'antd'
import './pieceoverviewonstaff.styl'
import SharedStructure from '@shared/structure/SharedStructure'
import date from '@assets/images/date.png'
import moment from 'moment'

const Option = Select.Option
const { Item } = Form
const { MonthPicker } = DatePicker

interface FormProps extends FormComponentProps {
  searchData: Function
  searchParams?: any
  // dateDay:any // 日期参数
}
// 表单
@hot(module) // 热更新（局部刷新界面）
class FormCompoent extends RootComponent<FormProps, any> {
  constructor (props: any) {
    super(props)
    const { projectNumber, sjNumber, userName, organize, pvTime } = this.props.searchParams
    let params = new URLSearchParams(location.search)
    let dates = params.get('before')
    this.state = {
      value: [],
      searchData: {
        projectNumber: projectNumber || '',
        sjNumber: sjNumber || '',
        userName: userName || '',
        organize: organize || [],
        pvTime
      },
      placeholderText: '' || '管理编号'
    }
  }
  searchData = (e: any) => {
    const data = this.props.form.getFieldsValue()
    const { searchData } = this.props
    delete data.userNameList
    delete data.pvTimeList
    delete data.projectNumberList
    delete data.organizeArr
    data.pvTime = moment(data.pvTime).format('YYYY-MM')
    data.placeholderText = this.state.placeholderText
    searchData(data)
  }
  placeholderChange = (val:string) => {
    this.setState({
      placeholderText: val
    })
  }
  render () {
    const {
      state: { placeholderText, searchData },
      props: { form: { getFieldDecorator }, searchParams }
    } = this
    return (
      <Form layout="inline" style={{ textAlign: 'left' }} className="form-box">
        <Item style={{ marginRight: '0.05rem' }}>
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue="管理编号" onChange={this.placeholderChange} style={{ width: '0.63rem', height: '0.21rem' }}>
            <Option value="工号">工号</Option>
            <Option value="管理编号">管理编号</Option>
          </Select>
        </Item>
        <Item className="form-item-mwrgin-20" >
          {getFieldDecorator('sjNumber', {
            rules: [
              {
                message: '请输入字母或者数字',
                pattern: new RegExp(/^[A-Za-z0-9]+$/, 'g')
              }
            ]
          })(
            <Input placeholder={`请输入${placeholderText}`} className='input-180' allowClear />
          )}
        </Item>
        <Item className="form-item-mwrgin-20">
          {getFieldDecorator('userName', {
            rules: [{
              required: false,
              pattern: new RegExp(/^[\u4e00-\u9fa5_a-zA-Z]+$/, 'g'),
              message: '请输入中文或英文'
            }]
          })(
            <Input placeholder="请输入姓名" maxLength={15} className='input-180' allowClear/>
          )}
        </Item>
        <Item className="form-item-mwrgin-20">
          {getFieldDecorator('pvTime', {
            initialValue: moment().subtract(1, 'month')
          })(
            <MonthPicker
              disabledDate={(current: any) => current && (current < moment().subtract(2, 'month') || current > moment().endOf('day'))}
              format='YYYY年MM月'
              allowClear={false}
              suffixIcon={(<img src={ date }/>)}
            />
          )}
        </Item>
        <Item className="form-item-mwrgin-20">
          {getFieldDecorator('organizeList', {
          })(<SharedStructure width="0.94rem" type="string" multiple />)}
        </Item>
        <Item>
          <Button type="primary" onClick={this.searchData}>搜索</Button>
          <BasicDowload action={this.api.exportPieceworkVoucherUser}
            parmsData={{ ...searchParams } } fileName="员工数据导出"
            className="export-margin-left" btntype="primary"
            dowloadURL="URL"
          >
            <Icon component={IconDc}/>导出
          </BasicDowload>
        </Item>
      </Form>
    )
  }
}
const WrappedRegistrationForm = Form.create<FormProps>()(FormCompoent)
interface ContractModalState {
  visible: boolean
  selectedRows: []
  selectedRowKeys: any // 列表中选择数据的id集合
  searchParams: any
  columnData: any
  salayrUserList: {}
}
interface ContraPageProps extends FormComponentProps{
  // 父组件需要传递过来的参数
  visible: boolean
  closeDialog: any
  onChanges?:Function
  necessary?: any // 传递给页面的数据
  history?: any
}
@hot(module) // 热更新（局部刷新界面）
export default class ContractModal extends RootComponent<ContraPageProps, ContractModalState> {
  selectedRows: any[]
  constructor (props: any) {
    super(props)
    this.selectedRows = []
    this.state = {
      visible: true,
      selectedRows: [],
      selectedRowKeys: [],
      searchParams: {
        organize: [],
        projectNumber: '',
        sjNumber: '',
        userName: '',
        pvTime: moment().subtract(1, 'month').format('YYYY-MM'),
        piProjectId: this.props.necessary.piProjectId
      },
      salayrUserList: {},
      columnData: [
        { title: '序号',
          dataIndex: 'index',
          width: 80,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        { title: '项目',
          dataIndex: 'projectName',
          width: 100,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        { title: '工号',
          dataIndex: 'projectNumber',
          width: 100,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        { title: '管理编号',
          dataIndex: 'sjNumber',
          width: 120,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        { title: '姓名',
          dataIndex: 'userName',
          width: 100,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        { title: '组织',
          dataIndex: 'organize',
          width: 300,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        { title: '在职状态',
          dataIndex: 'workCondition',
          width: 100,
          render: (text:string) => (<span>{text || '- - -'}</span>)
        },
        {
          title: '入职日期',
          width: 100,
          dataIndex: 'entryTime',
          // sorter: (a:any, b:any) => Date.parse(a.pvTime.replace('-', '/').replace('-', '/')) - Date.parse(b.pvTime.replace('-', '/').replace('-', '/')),
          render: (text:string) => (<span>{text || '- - -'}</span>)
        }
      ]
    }
  }

  componentDidMount () {
    // this.setState({
    //   visible: this.props.visible
    // })
  }
  // 查询数据
  searchData = (data:any) => {
    const { placeholderText, sjNumber } = data
    if (placeholderText !== '管理编号') {
      data.projectNumber = sjNumber
      delete data.sjNumber
    }
    data.piProjectId = this.props.necessary.piProjectId
    delete data.placeholderText
    this.setState({
      searchParams: data
    })
  }

  handleOk = () => {
    if (this.selectedRows.length <= 0) {
      this.$message.warning('请选择一个用户')
      return false
    } else {
      const { userId, clock } = this.selectedRows[0]
      if (clock) { // 如果薪资关账
        this.$message.warning('本月薪资已关账，无法新增计件凭证维护')
      } else {
        const { pvTime } = this.state.searchParams
        const pvTimes = pvTime.split('-').join('')
        const { necessary: { piProjectId, pipName, pipAddress } } = this.props
        const userInfo = JSON.stringify({ userId, piProjectId, pipName, pvTime: pvTimes, pipAddress })
        localStorage.setItem('pieceoverviewUserInfo', userInfo)
        this.props.history.push({ pathname: `/home/salarypiece/SalaryPieceOverview/pieceoverviewlist/pieceoverviewadd`, state: { userId, pvTime: pvTimes, piProjectId, pipName, pipAddress } })
      }
    }
  }

  handleCancel = () => {
    const { piProjectId } = this.props.necessary
    this.props.closeDialog(false)
    this.setState({
      searchParams: {
        pvTime: moment().subtract(1, 'month').format('YYYY-MM'),
        piProjectId
      }
    })
  }

  getSelectedRow = (selectedRowKeys:any, selectedRows: any) => { // 当多选框被选中时， 将数据放在state上
    this.setState({ selectedRowKeys })
    this.selectedRows = selectedRows
  }
  render () {
    const {
      state: { searchParams, columnData }
    } = this
    return (
      <Modal
        width='1400px'
        title={'选择员工'}
        className="employees-title"
        style={{ textAlign: 'center' }}
        visible={this.props.visible}
        destroyOnClose={true}
        footer={null}
        onCancel={this.handleCancel}
        maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        maskClosable={false}
      >
        <WrappedRegistrationForm searchParams={searchParams} {...this.props} searchData={this.searchData} />
        <TableItem
          mock={false}
          filterKey="index"
          rowKey={({ index }) => index}
          searchParams={{ ...searchParams } }
          URL={this.api.GetPieceworkVoucherUserList}
          columns={columnData}
          getSelectedRow={this.getSelectedRow}
          rowSelectionType='radio'
          rowSelection
          onRow
        />
        <div className="btn-margin-top">
          <Button onClick={ () => this.handleOk()} className="sumbit-btn" type="primary">确定</Button>
          <Button onClick={this.handleCancel} className="cancel-btn">取消</Button>
        </div>
      </Modal>
    )
  }
}
