/*
 * @description: 参数维护---项目合同组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 14:14:58
 * @LastEditTime : 2019-12-24 11:54:07
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Col } from 'antd'
import { BaseProps } from 'typings/global'
import './index.styl'
import { setTimeout } from 'timers'

const { Item } = Form
const fromcol = {
  labelCol: { span: 8 },
  wrapperCol: { span: 13 }
}
interface FormProps extends BaseProps, FormComponentProps{
  btnStatus: boolean // 按钮的状态
  projectId: number // 项目id --- 点击编辑时把id存起来方便其他地方使用
  modalTitle: string // 模态框标题
}

class ProjectContract extends RootComponent<FormProps, any> {
  BasicModal = React.createRef<BasicModal>()
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: FormProps) {
    super(props)
    this.state = {
      btnStatus: true,
      projectId: undefined,
      modalTitle: ''
    }
  }

  // 编辑
  editor = (records: any) => {
    this.BasicModal.current!.handleOk()
    this.props.form.setFieldsValue({
      reqaddedTax: records.addedTax,
      reqattachTax: records.attachTax,
      reqserviceCharge: records.serviceCharge
    })
    this.setState({
      projectId: records.projectId,
      modalTitle: records.projectName
    })
    this.changeBtnStatus()
  }

  // 确定
  handleConfirm = () => {
    const { projectId } = this.state
    const { reqaddedTax, reqattachTax, reqserviceCharge } = this.props.form.getFieldsValue()
    const param = {
      projectId,
      addedTax: reqaddedTax,
      attachTax: reqattachTax,
      serviceCharge: reqserviceCharge
    }
    this.axios.request(this.api.updateContractCost, param).then(({ code }) => {
      if (code === 200) {
        this.handleCancel()
        this.tableRef.current!.loadingTableData()
      }
    })
  }

  // 取消
  handleCancel = () => {
    this.BasicModal.current!.handleCancel()
  }

  // 确定按钮是否可以点击
  changeBtnStatus = () => {
    setTimeout(() => {
      const { disabledButton } = this.watchFieldsValues(this.props.form.getFieldsValue())
      this.setState({ btnStatus: disabledButton })
    }, 0)
  }

  // 限制输入框输入---只能输入1-100后面保留两位小数
  formatInputValue = (value: any) => {
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    value = value.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    if (value.indexOf('.') < 0 && value !== '') {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
      value = parseFloat(value)
    }
    if (value > 100) {
      const sl2 = String(value).slice(0, 2)
      const sl3 = String(value).slice(0, 3)
      if (sl3 === '100') {
        return sl3
      }
      return sl2
    }
    return value
  }

  render () {
    const {
      AuthorityList,
      isAuthenticated,
      state: { btnStatus, modalTitle },
      props: { form: { getFieldDecorator } }
    } = this
    const action = {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
      render: (text: any, records: any) => {
        return <span onClick={ () => this.editor(records)} className='editor'>编辑</span>
      }
    }
    const columns = [
      { title: '序号', dataIndex: 'index' },
      { title: '项目', dataIndex: 'projectName' },
      {
        title: '增值税参数',
        dataIndex: 'addedTax',
        render: (text: any, records: any) => {
          return <span>{text ? `${text}%` : '待维护'}</span>
        }
      },
      {
        title: '附加税参数',
        dataIndex: 'attachTax',
        render: (text: any, records: any) => {
          return <span>{text ? `${text}%` : '待维护'}</span>
        }
      },
      {
        title: '服务费参数',
        dataIndex: 'serviceCharge',
        render: (text: any, records: any) => {
          return <span>{text ? `${text}%` : '待维护'}</span>
        }
      }
      // {
      //   title: '操作',
      //   render: (text: any, records: any) => {
      //     return <span onClick={ () => this.editor(records)} className='editor'>编辑</span>
      //   }
      // }
    ]
    const sign = (<span className='percent'>%</span>)
    if (isAuthenticated(AuthorityList.salaryparametersetting[2])) columns.push(action)
    return (
      <div className='projectcontract'>
        <TableItem
          ref={this.tableRef}
          filterKey="index"
          rowSelection={false}
          rowKey={({ index }) => index}
          URL={this.api.getContractCostList}
          columns={columns} />
        <BasicModal
          ref={this.BasicModal}
          title={`${modalTitle}-项目合同费用设置`}
          maskClosable={false}
          baseModalStyl='baseModal'
        >
          <Form>
            <Row>
              <Col span={23}>
                <Item label='增值税参数' {...fromcol}>
                  {getFieldDecorator('reqaddedTax', {
                    rules: [{ required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.formatInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder='请输入数值' onChange={this.changeBtnStatus} allowClear/>
                  )}
                </Item>
              </Col>
              <Col span={1}>{sign}</Col>
            </Row>
            <Row>
              <Col span={23}>
                <Item label='附加税参数' {...fromcol}>
                  {getFieldDecorator('reqattachTax', {
                    rules: [{ required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.formatInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder='请输入数值' onChange={this.changeBtnStatus} allowClear/>
                  )}
                </Item>
              </Col>
              <Col span={1}>{sign}</Col>
            </Row>
            <Row>
              <Col span={23}>
                <Item label='服务费参数' {...fromcol}>
                  {getFieldDecorator('reqserviceCharge', {
                    rules: [{ required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.formatInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder='请输入数值' onChange={this.changeBtnStatus} allowClear/>
                  )}
                </Item>
              </Col>
              <Col span={1}>{sign}</Col>
            </Row>
            <Row className='action'>
              <Col>
                {
                  isAuthenticated(AuthorityList.salaryparametersetting[1]) &&
                  <Button className={ !btnStatus ? 'actionbtn confirmbtn' : 'actionbtn distableconfirmbtn' } onClick={this.handleConfirm} disabled={btnStatus}>确定</Button>
                }
                <Button className='actionbtn cancelbtn' onClick={this.handleCancel}>取消</Button>
              </Col>
            </Row>
          </Form>
        </BasicModal>
      </div>
    )
  }
}
export default Form.create<FormProps>()(ProjectContract)
