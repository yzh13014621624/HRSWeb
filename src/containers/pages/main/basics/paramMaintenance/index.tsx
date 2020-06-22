/**
 * @description 电子合同
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModalNew } from '@components/index'
import { Button, Row, Col, Icon } from 'antd'
import moment from 'moment'

import { IconSc, IconDc, IconDr, IconXz, IconTj,
  IconZaizhi, IconDairuzhi, IconLizhi } from '@components/icon/BasicIcon'

interface QueryPageProps {
  history:any
}

interface QueryPageState {
  serachParam:any
  errorMsg: string
  visibleModal: boolean
}

export default class QueryPage extends RootComponent<QueryPageProps, QueryPageState> {
  // 上架下架的key
  upperShelfKey:any = undefined
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  // 暂时保存信息
  private serachParam:any = {}

  constructor (props:any) {
    super(props)
    this.state = {
      serachParam: {},
      errorMsg: '',
      visibleModal: false
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 查看 */
  queryDetail = (id:any) => {
    this.props.history.push(`/home/paramMaintenance/detail/${id}`)
  }

  /** 设置查询的信息 */
  setSerachParam = (serachParam:any) => {
    this.serachParam = serachParam
  }

  /** 查询信息 */
  loadingData = () => {
    this.setState({ serachParam: this.serachParam })
  }

  /** 上/下 架 */
  upperShelf = () => {
    if (this.upperShelfKey) {
      let status = this.upperShelfKey.status === '上架' ? '下架' : '上架'
      this.axios.request(this.api.paramMaintenanceStatus, {
        ecId: Number(this.upperShelfKey.ecId),
        status: status
      }).then((res:any) => {
        this.upperShelfKey = undefined
        this.loadingData()
        this.$message.success(`${status}成功！`)
      }).catch((err:any) => {
        let { code, msg } = err
        this.handleModalKey = 0
        this.handleModal(1)
        this.setState({ errorMsg: msg || err })
      })
    }
  }

  /** 上下架 之前 */
  upperShelfAfter = (record:any) => {
    this.upperShelfKey = record
    let status = record.status === '上架' ? '下架' : '上架'
    this.setState({ errorMsg: `确认${status}该合同吗？` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 提示 */
  handleModal = (num:number) => {
    if (num === 2) {
      this.upperShelf()
    }
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const columnData = [
      { title: '序号', dataIndex: 'id', key: 'id' },
      { title: '合同类型', dataIndex: 'ecName', key: 'ecName' },
      { title: '员工类型', dataIndex: 'corporateName', key: 'corporateName' },
      { title: '创建人', dataIndex: 'ecType', key: 'ecType' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a:any, b:any) => {
          let at = new Date(a.createTime).getTime()
          let bt = new Date(b.createTime).getTime()
          if (at > bt) {
            return 1
          } else if (at < bt) {
            return -1
          } else {
            return 0
          }
        },
        render: (text:string, record:any) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      {
        title: '使用状态',
        dataIndex: 'status',
        key: 'status',
        render: (text:string) => {
          let ic = text === '上架' ? IconZaizhi : IconLizhi
          return (
            <span><Icon component={ic}/>{text}</span>
          )
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.queryDetail.bind(this, record.ecId)}>查看</span>
              {record.status === '上架' && <span className='cus-lable-error' onClick={this.upperShelfAfter.bind(this, record)}>下架</span>}
              {record.status !== '上架' && <span onClick={this.upperShelfAfter.bind(this, record)}>上架</span>}
            </div>
          )
        }
      }
    ]
    let { serachParam, errorMsg, visibleModal } = this.state
    return (
      <div style={{ margin: 19, padding: 20 }}>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="ecId"
          URL={this.api.paramMaintenanceQuery}
          searchParams={serachParam}
          columns={columnData}
        />
        <BasicModalNew visible={visibleModal} onCancel={this.handleModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleModal.bind(this, 0)}>取消</Button>
          </Row>}
        </BasicModalNew>
      </div>
    )
  }
}
