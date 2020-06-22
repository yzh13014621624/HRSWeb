/*
 * @description: 参数维护---计件参数组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 14:15:15
 * @LastEditTime: 2020-05-27 16:54:10
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicModal, FileUpload, BasicDowload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Popover, Col, Table } from 'antd'
import { IconDc, IconDr, IconXz } from '@components/icon/BasicIcon'
import { BaseProps } from 'typings/global'
import { SysUtil, outArrayNew } from '@utils/index'
import moment from 'moment'
import './index.styl'

const { Item } = Form

interface FormProps extends BaseProps, FormComponentProps{}

class PieceParameter extends RootComponent<FormProps, any> {
  constructor (props: FormProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('pieceparameter_searchParams')
    this.state = {
      searchParams: searchParams || {},
      exportCondition: {} // 导出的参数
    }
  }

  // 搜索按钮
  searchData = () => {
    const { pipName } = this.props.form.getFieldsValue()
    this.setState({ searchParams: { pipName } })
  }

  // 编辑
  detail = (reconds: any) => {
    const { piProjectId, ppId } = reconds
    let status = 1
    const dataStatus = !ppId
    dataStatus ? status = 1 : status = 2
    this.props.history.push(`/home/salaryparametersetting/pieceparameterdetail?piProjectId=${piProjectId}&ppId=${ppId}&status=${status}`)
  }

  // 处理表格里的数据显示
  disposeValue = (minvalue: any, maxvalue: any) => {
    return maxvalue ? minvalue === maxvalue ? minvalue : `${minvalue}-${maxvalue}` : '待维护'
  }

  // 处理表格里的地址显示
  formatAddress = (value: string) => {
    return value && value.length > 15 ? value.slice(0, 15) + '...' : value
  }

  // 条件搜索框变化时获取输入的值用于导出
  getExportData = (e: any) => {
    e.persist()
    this.setState({
      exportCondition: { pipName: e.target.value }
    })
  }
  render () {
    const {
      AuthorityList,
      isAuthenticated,
      state: { searchParams, organizeList, exportCondition },
      props: { form: { getFieldDecorator } },
      api: { importParameter, exportParameter, exportParameterTem }
    } = this
    const action = {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
      render: (text: any, reconds:any) => {
        return <span onClick={ () => this.detail(reconds)} className='detail'>查看</span>
      }
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 60
      },
      {
        title: '计件项目',
        dataIndex: 'pipName',
        width: 100
      },
      {
        title: '地址',
        dataIndex: 'pipAddress',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.formatAddress(text)}</span>
        }
      },
      {
        title: '收货（每托盘/单价）',
        dataIndex: 'collectMin',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.collectMin, reconds.collectMax)}</span>
        }
      },
      {
        title: '上架（每托盘/单价）',
        dataIndex: 'upShelfMin',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.upShelfMin, reconds.upShelfMax)}</span>
        }
      },
      {
        title: '补货（每托盘/单价）',
        dataIndex: 'buhuoMin',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.buhuoMin, reconds.buhuoMax)}</span>
        }
      },
      {
        title: '整箱拣货-标签拣选（每箱/单价）',
        dataIndex: 'labelGoodsMin',
        width: 200,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.labelGoodsMin, reconds.labelGoodsMax)}</span>
        }
      },
      {
        title: '整箱拣货-RF拣选（每箱/单价）',
        dataIndex: 'labelGoodsFrMin',
        width: 200,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.labelGoodsFrMin, reconds.labelGoodsFrMax)}</span>
        }
      },
      {
        title: '整箱拣货-RF拣选（每行/单价）',
        dataIndex: 'labelGoodsFrHangMin',
        width: 200,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.labelGoodsFrHangMin, reconds.labelGoodsFrHangMax)}</span>
        }
      },
      {
        title: '拆零拣货（单价）',
        dataIndex: 'zeroMin',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.zeroMin, reconds.zeroMax)}</span>
        }
      },
      {
        title: '拆零上架（每托盘/单价）',
        dataIndex: 'zeroUpMin',
        width: 200,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.zeroUpMin, reconds.zeroUpMax)}</span>
        }
      },
      {
        title: '拆零下架（每托盘/单价）',
        dataIndex: 'zeroDownMin',
        width: 200,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.zeroDownMin, reconds.zeroDownMax)}</span>
        }
      },
      {
        title: '越库（每箱/单价）',
        dataIndex: 'crossDockingMin',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.crossDockingMin, reconds.crossDockingMax)}</span>
        }
      },
      {
        title: '移库（每托盘/单价）',
        dataIndex: 'moveLibraryMin',
        width: 150,
        render: (text: any, reconds:any) => {
          return <span>{this.disposeValue(reconds.moveLibraryMin, reconds.moveLibraryMax)}</span>
        }
      }
      // {
      //   title: '操作',
      //   dataIndex: 'action',
      //   render: (text: any, reconds:any) => {
      //     return <span onClick={ () => this.detail(reconds)} className='detail'>查看</span>
      //   }
      // }
    ]
    if (isAuthenticated(AuthorityList.salaryparametersetting[6])) columns.push(action)
    return (
      <div className='pieceparameter'>
        <Form layout='inline'>
          <Row className='margin-b-20' type='flex' justify='space-between'>
            <Col>
              <Item>
                {getFieldDecorator('pipName', { initialValue: searchParams.pipName || undefined })(<Input placeholder='请输入项目名称' allowClear onChange={this.getExportData}/>)}
              </Item>
              <Item>
                <Button className='selectbtn' onClick={this.searchData}>搜索</Button>
              </Item>
            </Col>
            <Col>
              <Item>
                {isAuthenticated(AuthorityList.salaryparametersetting[7]) &&
                  <FileUpload
                    action={importParameter.path}>
                    <Button className='importdata'>
                      <Icon component={IconDr}/>导入
                    </Button>
                  </FileUpload>
                }
                {isAuthenticated(AuthorityList.salaryparametersetting[8]) &&
                  <BasicDowload
                    // exportData
                    action={exportParameter}
                    parmsData={ exportCondition }
                    className='exportdata'
                    dowloadURL="URL"
                    fileName='HR计件参数导出文件'>
                    <Icon component={IconDc}/>导出
                  </BasicDowload>
                }
                {isAuthenticated(AuthorityList.salaryparametersetting[9]) &&
                  <BasicDowload
                    action={exportParameterTem}
                    parmsData={{ type: '.xlsx' }} fileName="HR计件参数导入模板下载"
                    className="download" btntype="primary">
                    <Icon component={IconXz}/>下载导入模版
                  </BasicDowload>
                }
              </Item>
            </Col>
          </Row>
        </Form>
        <TableItem
          rowSelection={false}
          filterKey='index'
          searchParams={searchParams}
          rowKey={({ index }) => index}
          URL={this.api.getParameterList}
          scroll={{ x: 1500 }}
          columns={columns}
          bufferSearchParamsKey='pieceparameter_searchParams'
        />
      </div>
    )
  }
}
export default Form.create<FormProps>()(PieceParameter)
