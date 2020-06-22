/*
 * @description: 任务管理列表
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-11-20 22:29:10
 * @LastEditTime: 2019-12-03 13:04:02
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Form, Input, DatePicker, Button, Row, Col, Tabs, Tag } from 'antd'
import { hot } from 'react-hot-loader'
import Filter from './filter'
import PrivateTableItem from './TableItem'
import { inject } from 'mobx-react'
import './taskmanage.styl'

import { BaseProps, KeyValue } from 'typings/global'
const { TabPane } = Tabs

interface TaskManageState {
  type: string // 1-导入 2-导出
  searchParams: object,
  importcount: number | string, // 导入的数量
  exportcount: number | string // 导出的数量
  clearForm: boolean // 是否清除表单
}
@inject('mobxGlobal')
@hot(module)
class TaskManage extends RootComponent<BaseProps, TaskManageState> {
  timeInterval: any
  timeTimeout: any
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: BaseProps) {
    super(props)
    this.state = {
      type: '2',
      importcount: 0,
      exportcount: 0,
      searchParams: {
        type: 2
      },
      clearForm: false
    }
  }

  // 用以实时更新任务的数量
  componentDidMount = () => {
    this.axios.request(this.api.count).then(({ code, data }) => {
      let { countExport, countImport, sun } = data
      countExport = countExport > 99 ? '99+' : countExport
      countImport = countImport > 99 ? '99+' : countImport
      sun = sun > 99 ? '99+' : sun
      if (code === 200) {
        this.props.mobxGlobal.setTaskNum(sun)
        this.setState({
          importcount: countImport,
          exportcount: countExport
        })
      }
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.timeInterval)
    clearTimeout(this.timeTimeout)
  }

  // 切换tab事件
  checkTab = (type: string) => {
    const { searchParams } = this.state
    // this.timeInterval = setInterval(() => {
    //   this.axios.request(this.api.count).then(({ code, data }) => {
    //     if (code === 200) {
    //       // let { sun } = data
    //       // sun = sun > 99 ? '99+' : sun
    if (type === '1') {
      this.setState({ importcount: 0 })
      this.props.mobxGlobal.setTaskNum('0')
    }
    //     }
    //   })
    // }, 1000)
    this.setState({
      type,
      clearForm: true,
      searchParams: { type: type ? Number(type) : undefined }
    })
    this.timeTimeout = setTimeout(() => { this.setState({ clearForm: false }) }, 20)
  }

  // 搜索按钮事件
  searchData = (searchData: object) => {
    this.setState({ searchParams: searchData })
  }

  // 下载
  goDown = (recond: any) => {
    this.axios.instance({
      method: 'post',
      url: this.api.taskDownExcel!.path,
      data: { id: recond.id },
      timeout: 10000000
    }).then((res: any) => {
      let { data, code, msg } = res.data
      if (code === 200) {
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = data
        link.setAttribute('download', `${recond.fileName}文件.xlsx`)
        document.body.appendChild(link)
        link.click()
      } else {
        this.$message.error('下载失败！')
      }
    })
  }

  render () {
    const { type, searchParams, importcount, exportcount, clearForm } = this.state
    const columns: any[] = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 100
      },
      {
        title: '文件名',
        dataIndex: 'fileName',
        width: 300
      },
      {
        title: `${(type === '1' && '导入') || (type === '2' && '导出')}时间`,
        dataIndex: 'createTime',
        width: 200
      },
      {
        title: `${(type === '1' && '导入') || (type === '2' && '导出')}状态`,
        dataIndex: 'statusName',
        width: 260,
        render: (text: any, recond: any) => {
          let color: any = (recond.status === 1 && 'green') || (recond.status === 2 && 'volcano') || (recond.status === 3 && 'geekblue')
          return (
            <Tag color={color} key={text}>
              {text}
            </Tag>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'flag',
        width: 150,
        render: (text: any, recond: any) => (
          <span>
            { type === '1'
              ? (text ? <a onClick={() => this.goDown(recond)}>下载出错数据</a> : <a>- - -</a>)
              : (text ? <a onClick={() => this.goDown(recond)}>下载</a> : <a>- - -</a>)
            }
          </span>
        )
      },
      {
        title: '备注',
        dataIndex: 'operationDesc',
        render: (text: any, recond: any) => (
          <a>{text || '- - -'}</a>
        )
      }
    ]
    return (
      <div className='taskmanage'>
        <Tabs defaultActiveKey="2" onChange={this.checkTab}>
          {/* <TabPane tab={<div>导出{exportcount ? <span className='tasklistnum'>{exportcount}</span> : ''}</div>} key="2"> */}
          <TabPane tab={<div>导出</div>} key="2">
            <Filter type={type} searchData={this.searchData} clearForm={clearForm} />
            <Row className='table-m'>
              <PrivateTableItem searchParams={searchParams} columns={columns} />
            </Row>
          </TabPane>
          {/* <TabPane tab={<div>导入{importcount ? <span className='tasklistbackground'><span className={ importcount === '99+' ? 'tasknum_l' : 'tasklistnum'}>{importcount}</span></span> : ''}</div>} key="1"> */}
          <TabPane tab={<div>导入</div>} key="1">
            <Filter type={type} searchData={this.searchData} />
            <Row className='table-m'>
              <PrivateTableItem searchParams={searchParams} columns={columns} />
            </Row>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Form.create<any>()(TaskManage)
