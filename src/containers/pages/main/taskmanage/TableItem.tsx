/*
 * @description: 任务管理列表tab组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-11-20 22:29:10
 * @LastEditTime: 2019-11-29 16:58:45
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Form, Row, Tabs } from 'antd'
import { hot } from 'react-hot-loader'
import { BaseProps, KeyValue } from 'typings/global'

interface TaskManageState {
}

@hot(module)
class PrivateTableItem extends RootComponent<BaseProps, TaskManageState> {
  time: any
  tableRef = React.createRef<TableItem<any>>()
  constructor (props: BaseProps) {
    super(props)
  }

  componentDidMount = () => {
    // this.time = setInterval(() => {
    //   this.tableRef.current!.loadingTableData()
    // }, 2000)
  }

  componentWillUnmount = () => {
    // clearInterval(this.time)
  }

  render () {
    const { searchParams, columns } = this.props
    return (
      <div>
        <TableItem
          ref={this.tableRef}
          rowSelection={false}
          filterKey='index'
          searchParams={searchParams}
          rowKey={({ index }) => index}
          URL={this.api.taskQueryList}
          columns={columns}
          scroll={{ x: 1500 }}
        />
      </div>
    )
  }
}

export default Form.create<any>()(PrivateTableItem)
