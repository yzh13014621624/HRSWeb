/*
 * @description: 参数维护---工资标准组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 14:15:15
 * @LastEditTime: 2020-05-27 16:52:42
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Popover, Col, Table } from 'antd'
import { BaseProps } from 'typings/global'
import SysUtil from '@utils/SysUtil'
import moment from 'moment'
import './index.styl'

const { Item } = Form

interface FormProps extends BaseProps, FormComponentProps{
  searchParams: any
}

class SalaryStandard extends RootComponent<FormProps, any> {
  constructor (props: FormProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('salarystandard_searchParams')
    this.state = {
      searchParams: searchParams || {}
    }
  }

  // 编辑
  edit = (reconds: any) => {
    let status = 1
    sessionStorage.setItem('salarystandardtitle', reconds.entity)
    const dataStatus = !(reconds.overtimeBase && reconds.fullTimeWages && reconds.socialWages && reconds.timeMinWages && reconds.traineeMinWages)
    dataStatus ? status = 1 : status = 2 // 1-新增 2-编辑
    this.props.history.push(`/home/salaryparametersetting/parameterset?entityId=${reconds.entityId}&wageStandardId=${reconds.wageStandardId}&status=${status}`)
  }

  // 搜索
  searchData = () => {
    const { entity } = this.props.form.getFieldsValue()
    this.setState({ searchParams: { entity } })
  }
  // 处理表格里的数据显示
  disposeValue = (value: any) => {
    return value ? Number(value).toFixed(2) : '待维护'
  }

  render () {
    const {
      AuthorityList,
      isAuthenticated,
      state: { searchParams },
      props: {
        form: { getFieldDecorator }
      }
    } = this
    const action = {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
      render: (text: any, reconds: any) => {
        return <span onClick={ () => this.edit(reconds)} className='edit'>编辑</span>
      }
    }
    const columns = [
      {
        title: '序号', dataIndex: 'index'
      },
      {
        title: '法人主体', dataIndex: 'entity'
      },
      {
        title: '全职最低工资',
        dataIndex: 'fullTimeWages',
        render: (text: any) => {
          return <span>{this.disposeValue(text)}</span>
        }
      },
      {
        title: '全职最低工资是否含社金',
        dataIndex: 'fullTimeWagesOrnot',
        render: (text: any, reconds: any) => {
          return <span>{(text === 2 && '否') || (text === 1 && '是') || (!text && '待维护')}</span>
        }
      },
      {
        title: '实习生最低工资',
        dataIndex: 'traineeMinWages',
        render: (text: any) => {
          return <span>{this.disposeValue(text)}</span>
        }
      },
      {
        title: '小时工最低工资',
        dataIndex: 'timeMinWages',
        render: (text: any) => {
          return <span>{this.disposeValue(text)}</span>
        }
      },
      {
        title: '社平工资',
        dataIndex: 'socialWages',
        render: (text: any) => {
          return <span>{this.disposeValue(text)}</span>
        }
      },
      { title: '加班基数',
        dataIndex: 'overtimeBase',
        render: (text: any) => {
          return <span>{this.disposeValue(text)}</span>
        }
      }
      // {
      //   title: '操作',
      //   render: (text: any, reconds: any) => {
      //     return <span onClick={ () => this.edit(reconds)} className='edit'>编辑</span>
      //   }
      // }
    ]
    if (isAuthenticated(AuthorityList.salaryparametersetting[4])) columns.push(action)
    return (
      <div className='salarystandard'>
        <Form layout='inline'>
          <Row className='margin-b-20'>
            <Col>
              <Item>
                {getFieldDecorator('entity', { initialValue: searchParams.entity || undefined })(<Input placeholder='请输入法人主体' allowClear />)}
              </Item>
              <Item>
                <Button className='selectbtn' onClick={this.searchData}>搜索</Button>
              </Item>
            </Col>
          </Row>
        </Form>
        <TableItem
          filterKey="index"
          rowSelection={false}
          rowKey={({ index }) => index}
          searchParams={searchParams}
          URL={this.api.getWageStandardList}
          columns={columns}
          bufferSearchParamsKey='salarystandard_searchParams'
        />
      </div>
    )
  }
}
export default Form.create<FormProps>()(SalaryStandard)
