/*
 * @description: 考勤管理-公共页面组件
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-23 10:55:31
 * @LastEditTime: 2019-11-26 16:01:54
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem } from '@components/index'
import { Button, Icon, Table } from 'antd'
import { IconTj } from '@components/icon/BasicIcon'

interface CommonPageProps {
  columns: any[],
  handleAddButton: () => void,
  dataSource?: any[],
  loading?: boolean,
  count?: any,
  isAllowAdd?: boolean
}

@hot(module)
export default class CommonPage extends RootComponent<CommonPageProps, any> {
  constructor (props: CommonPageProps) {
    super(props)
  }

  render () {
    const { columns, handleAddButton, dataSource = [], loading = false, count = 0, isAllowAdd = true } = this.props
    return (
      <React.Fragment>
        {isAllowAdd && <div style={{ marginBottom: 20 }}>
          <Button type='primary' onClick={handleAddButton}>
            <Icon component={IconTj}/>
            <span style={{ margin: '0 0.02rem', letterSpacing: 0 }}>新增</span>
          </Button>
        </div>}
        <Table
          rowKey='ophId'
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
        />
        {count !== 0 && <div style={{ marginTop: '20px', textAlign: 'right', color: '#333', fontWeight: 500 }}>共{count}条数据</div>}
      </React.Fragment>
    )
  }
}
