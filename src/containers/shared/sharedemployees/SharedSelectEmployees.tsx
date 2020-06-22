/**
 * @author maqian
 * @createTime 2019/04/03
 * @description 选择员工组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem, BasicDowload } from '@components/index'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'
import { IconDc } from '@components/icon/BasicIcon'
import { Form, Select, Input, Button, Modal, Icon } from 'antd'
import './SharedSelectEmployees.styl'
import SharedStructure from '@shared/structure/SharedStructure'

const Option = Select.Option

interface FormProps extends FormComponentProps {
  searchData: Function,
  searchParams?: any
  statusSelectss?: any
}
// 表单
@hot(module) // 热更新（局部刷新界面）
class FormCompoent extends RootComponent<FormProps, any> {
  constructor (props: any) {
    super(props)
    const { searchParams, statusSelectss } = props
    const { projectNumber, sjNumber, userName, organizeArr } = searchParams
    this.state = {
      value: [],
      searchData: {
        projectNumber: projectNumber || '',
        sjNumber: sjNumber || '',
        userName: userName || '',
        organizeArr: organizeArr || [],
        baseType: statusSelectss
      },
      placeholderText: '' || '管理编号'
    }
  }
  handleSubmit = (e:any) => {
    e.preventDefault()
    const { statusSelectss, form } = this.props
    form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        const { organizeArr, sjNumber, userName } = values
        if (this.state.placeholderText === '管理编号') {
          let data = {
            organizeArr,
            sjNumber,
            userName,
            projectNumber: '',
            baseType: statusSelectss
          }
          this.props.searchData(data)
        } else {
          let data = {
            organizeArr,
            sjNumber: '',
            userName,
            projectNumber: sjNumber,
            baseType: statusSelectss
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
    const { statusSelectss } = this.props
    const { getFieldDecorator } = this.props.form
    const { searchData, placeholderText } = this.state
    const { sjNumber, userName, organizeArr } = searchData
    return (
      <Form layout="inline" style={{ textAlign: 'left' }} className="form-box" onSubmit={this.handleSubmit}>
        <Form.Item style={{ marginRight: '0.05rem' }}>
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue="管理编号" onChange={this.placeholderChange} style={{ width: '0.63rem', height: '0.21rem' }}>
            <Option value="工号">工号</Option>
            <Option value="管理编号">管理编号</Option>
          </Select>
        </Form.Item>
        <Form.Item className="form-item-mwrgin-20" >
          {getFieldDecorator('sjNumber', {
            rules: [{
              required: false,
              pattern: new RegExp(/^([a-zA-Z_]|[0-9]){1,14}$/, 'g'),
              message: '请输入字母或数字 长度在14位之内'
            }]
          })(
            <Input placeholder={`请输入${placeholderText}`} className='input-180' allowClear />
          )}
        </Form.Item>
        <Form.Item className="form-item-mwrgin-20">
          {getFieldDecorator('userName', {
            rules: [{
              required: false,
              pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z_]){1,15}$/, 'g'),
              message: '请输入中文或英文 长度在15位之内'
            }]
          })(
            <Input placeholder="请输入姓名" className='input-180' allowClear />
          )}
        </Form.Item>
        <Form.Item className="form-item-mwrgin-20">
          {getFieldDecorator('organizeArr', {
            // initialValue: organizeArr
          })(<SharedStructure width="0.94rem" type="string" multiple />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
          <BasicDowload action={this.api.chooseExport}
            parmsData={this.props.searchParams}
            className="export-margin-left" btntype="primary"
            dowloadURL="URL"
          >
            <Icon component={IconDc}/>导出
          </BasicDowload>
        </Form.Item>
      </Form>
    )
  }
}

interface ContractModalState {
  visible: boolean
  selectedRows: []
  searchParams: {}
  columnData: any
}
interface ContraPageProps {
  // 父组件需要传递过来的参数
  visible: boolean
  closeDialog: any
  onChanges?:Function
  statusSelectss?: number
}
@hot(module) // 热更新（局部刷新界面）
export default class ContractModal extends RootComponent<ContraPageProps, ContractModalState> {
  selectedRows: any[]
  constructor (props: any) {
    super(props)
    const { statusSelectss } = props
    this.selectedRows = []
    this.state = {
      visible: true,
      selectedRows: [],
      searchParams: {
        organizeArr: [],
        projectNumber: '',
        sjNumber: '',
        userName: '',
        baseType: statusSelectss
      },
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
          sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/')),
          render: (text:string) => (<span>{text || '- - -'}</span>)
        }
      ]
    }
  }
  componentDidMount () {
    this.setState({
      visible: this.props.visible
    })
  }
  // 查询数据
  searchData = async (data:any) => {
    await this.setState({
      searchParams: data
    })
  }

  handleOk = () => {
    if (this.selectedRows.length <= 0) {
      this.$message.warning('请选择一个用户')
      return false
    } else {
      // 子组件触发父组件事件进行调转，并将数据传到父组件
      (this.props as any).onChanges(this.selectedRows)
    }
  }

  handleCancel = () => {
    // 点击取消关闭
    this.props.closeDialog(false)
    this.setState({
      searchParams: {
        organizeArr: [],
        projectNumber: '',
        sjNumber: '',
        userName: '',
        baseType: this.props.statusSelectss
      }
    })
  }

  getSelectedRow = (selectedRowKeys:any, selectedRows: any) => { // 当多选框被选中时， 将数据放在state上
    this.selectedRows = selectedRows
  }
  render () {
    const { searchParams, columnData } = this.state
    const WrappedRegistrationForm = Form.create<FormProps>()(FormCompoent)
    return (
      <Modal
        width='1000px'
        title="选择员工"
        className="employees-title"
        style={{ textAlign: 'center' }}
        visible={this.props.visible}
        footer={null}
        onCancel={this.handleCancel}
        // closable={false}
        maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        destroyOnClose={true}
      >
        <WrappedRegistrationForm searchParams={searchParams} {...this.props} searchData={this.searchData} />
        <TableItem
          mock={false}
          onRow={true}
          filterKey="userId"
          rowKey={({ userId }) => userId}
          searchParams={searchParams}
          URL={this.api.chooselist}
          columns={columnData}
          rowSelectionType='radio'
          getSelectedRow={this.getSelectedRow}
        />
        <div className="btn-margin-top">
          <Button onClick={this.handleOk} className="sumbit-btn" type="primary">确定</Button>
          <Button onClick={this.handleCancel} className="cancel-btn">取消</Button>
        </div>
      </Modal>
    )
  }
}
