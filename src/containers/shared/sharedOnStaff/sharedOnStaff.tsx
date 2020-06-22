/*
 * @description: 新增在职员工
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-09-24 14:46:02
 * @LastEditTime: 2020-06-08 16:57:00
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicDowload } from '@components/index'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'
import { IconDc } from '@components/icon/BasicIcon'
import { Form, Select, Input, Button, Modal, Icon, DatePicker } from 'antd'
import './sharedOnStaff.styl'
import SharedStructure from '@shared/structure/SharedStructure'
import { HttpUtil } from '@utils/index'
import date from '@assets/images/date.png'
import moment from 'moment'

const Option = Select.Option
const { Item } = Form
const { MonthPicker } = DatePicker

interface FormProps extends FormComponentProps {
  searchData: Function,
  searchParams?: any,
  type: any,
  // dateDay:any // 日期参数
}
// 表单
@hot(module) // 热更新（局部刷新界面）
class FormCompoent extends RootComponent<FormProps, any> {
  constructor (props: any) {
    super(props)
    const { projectNumber, sjNumber, userName, organizeArr, month, type } = this.props.searchParams
    let params = new URLSearchParams(location.search)
    let dates = params.get('before')
    this.state = {
      value: [],
      searchData: {
        projectNumber: projectNumber || '',
        sjNumber: sjNumber || '',
        userName: userName || '',
        organizeArr: organizeArr || [],
        month: moment().subtract(1, 'month').format('YYYY-MM'),
        type: ''
      },
      placeholderText: '' || '管理编号',
      dateDay: dates || null
    }
  }
  searchData = (e: any) => {
    e.preventDefault()
    const { searchData } = this.props
    this.props.form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        const { organizeArr, sjNumber, userName, month } = values
        if (this.state.placeholderText === '管理编号') {
          let data = {
            organizeArr,
            sjNumber,
            userName,
            projectNumber: '',
            month: moment(month).format('YYYY-MM')
          }
          searchData(data)
        } else {
          let data = {
            organizeArr,
            sjNumber: '',
            userName,
            projectNumber: sjNumber,
            month: moment(month).format('YYYY-MM')
          }
          searchData(data)
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
    const {
      state: { placeholderText, dateDay },
      props: { form: { getFieldDecorator }, searchParams, type }
    } = this
    return (
      <Form layout="inline" style={{ textAlign: 'left' }} className="form-box" onSubmit={this.searchData}>
        <Item style={{ marginRight: '0.05rem' }}>
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue="管理编号" onChange={this.placeholderChange} style={{ width: '0.63rem', height: '0.21rem' }}>
            <Option value="工号">工号</Option>
            <Option value="管理编号">管理编号</Option>
          </Select>
        </Item>
        <Item className="form-item-mwrgin-20" >
          {getFieldDecorator('sjNumber', {
            rules: [{
              required: false,
              pattern: new RegExp(/^[A-Za-z0-9]+$/, 'g'),
              message: '请输入字母或数字'
            }]
          })(
            <Input placeholder={`请输入${placeholderText}`} className='input-180' allowClear />
          )}
        </Item>
        <Item className="form-item-mwrgin-20">
          {getFieldDecorator('userName', {
            rules: [{
              required: false,
              pattern: new RegExp(/^[a-zA-Z\u4e00-\u9fa5]{1,15}$/, 'g'),
              message: '请输入中文或英文 长度在15位之内'
            }]
          })(
            <Input placeholder="请输入姓名" className='input-180' maxLength={15} allowClear/>
          )}
        </Item>
        <Item className="form-item-mwrgin-20" label="月度">
          {getFieldDecorator('month', {
            initialValue: dateDay === null ? moment().subtract(1, 'month') : moment(dateDay, 'YYYY年MM月')
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
          {getFieldDecorator('organizeArr', {
          })(<SharedStructure width="0.94rem" type="string" multiple />)}
        </Item>
        <Item>
          <Button type="primary" htmlType="submit">搜索</Button>
          <BasicDowload action={this.api.SalaryExportChooseList}
            parmsData={{ ...searchParams, type } } fileName="员工数据导出"
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
  searchParams: any,
  columnData: any,
  salayrUserList: {},
  workCondition: any

}
interface ContraPageProps extends FormComponentProps{
  // 父组件需要传递过来的参数
  visible: boolean
  closeDialog: any
  onChanges?:Function
  history?: any,
  type: any,
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
        organizeArr: [],
        projectNumber: '',
        sjNumber: '',
        userName: '',
        month: moment().subtract(1, 'month').format('YYYY-MM'),
        type: ''
      },
      salayrUserList: {},
      workCondition: '',
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
          title: '在职时间',
          width: 100,
          dataIndex: 'entryTime',
          sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/')),
          render: (text: string, record: any) => {
            return (
              <span>{text || '- - -'}</span>
            )
          }
        }
      ]
    }
  }
  componentDidMount () {
    this.setState({
      visible: this.props.visible
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps: any, nextState: any) {
    this.renderTableColumn(nextProps.type)
  }

  renderTableColumn = (type: number) => {
    let { columnData } = this.state

    columnData = [
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
        title: `${type === 1 ? '入职' : '离职'}日期`,
        width: 100,
        dataIndex: `${type === 1 ? 'entryTime' : 'quitTime'}`,
        sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/')),
        render: (text: string, record: any) => {
          return (
            <span>{text || '- - -'}</span>
          )
        }
      }
    ]

    this.setState({
      columnData
    })
  }

  // 查询数据
  searchData = (data:any) => {
    this.setState({
      searchParams: data
    })
  }
  handleOk = () => {
    if (this.selectedRows.length <= 0) {
      this.$message.warning('请选择一个用户')
      return false
    } else {
      const month = this.state.searchParams.month
      const { userId } = this.selectedRows[0]
      this.axios.request(this.api.getCloseInfo, { month }).then(({ code }) => {
        if (code === 200) {
          // this.$message.success('删除成功')
          this.props.history.push(`/home/salaryprePage/salaryAdd?userId=${userId}&month=${month}`)
        }
      })
    }
  }

  handleCancel = () => {
    const { searchParams } = this.state.searchParams
    this.props.closeDialog(false)
    this.setState({
      searchParams: {
        month: moment().subtract(1, 'month').format('YYYY-MM')
      }
    })
  }

  getSelectedRow = (selectedRowKeys:any, selectedRows: any) => { // 当多选框被选中时， 将数据放在state上
    this.setState({ selectedRowKeys })
    this.selectedRows = selectedRows
  }
  render () {
    const {
      state: { searchParams, columnData },
      props: { type }
    } = this
    return (
      <Modal
        width='1400px'
        title={ type === 1 ? '选择在职员工' : '选择离职员工' }
        className="employees-title"
        style={{ textAlign: 'center' }}
        visible={this.props.visible}
        destroyOnClose={true}
        footer={null}
        onCancel={this.handleCancel}
        maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
      >
        <WrappedRegistrationForm searchParams={searchParams} {...this.props} searchData={this.searchData} />
        <TableItem
          mock={false}
          filterKey="index"
          rowKey={({ index }) => index}
          searchParams={{ ...searchParams, type } }
          URL={this.api.SalaryQueryUserList}
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
