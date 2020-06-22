/*
 * @description: 考勤管理-出勤参数列表页
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-20 16:41:07
 * @LastEditTime: 2020-05-28 12:40:30
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, EmptyTable } from '@components/index'
import { Tabs, Form, Button, DatePicker, Row, Col, Icon, Pagination, Spin } from 'antd'
import date from '@assets/images/date.png'
import AttendanceTable from '../components/attendanceTable'
import { BaseProps } from 'typings/global'
import { IconTj } from '@components/icon/BasicIcon'
import SysUtil from '@utils/SysUtil'
import moment from 'moment'

const { TabPane } = Tabs
const { Item } = Form

interface AttendanceListState {
  yearPickerOpen: boolean,
  chooseYear: any,
  pageData: any[],
  totalCount: number,
  current: number,
  loading: boolean,
  isSearch: boolean
}
interface AttendanceListProps extends BaseProps, FormComponentProps {
}

@hot(module)
class AttendanceList extends RootComponent<AttendanceListProps, AttendanceListState> {
  constructor (props:any) {
    super(props)
    this.state = {
      yearPickerOpen: false,
      chooseYear: null,
      pageData: [],
      totalCount: 0,
      current: 1,
      loading: false,
      isSearch: false
    }
  }

  componentDidMount () {
    this.getPageData()
  }

  getPageData = () => {
    this.setState({ loading: true })
    const { current, chooseYear } = this.state
    const year = chooseYear ? chooseYear.split('-')[0] : chooseYear
    const ahpYear = SysUtil.getSessionStorage('AttendanceList_searchParams')
    const payload = {
      ahpYear: ahpYear || year,
      page: current,
      pageSize: 2
    }
    this.axios.request(this.api.queryAttendParamList, payload, undefined, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          pageData: data.data,
          totalCount: data.totalNum,
          loading: false,
          chooseYear: ahpYear || year
        })
      }
    })
  }

  /** 页面事件 */
  onAdd = () => {
    this.props.history.push('/home/attendanceparameters/atttendance')
  }

  onChangePage = (page: any) => {
    this.setState({ current: page, loading: true }, () => this.getPageData())
  }

  onChangeYear = (value: any) => {
    const date = value.format('YYYY-MM-DD')
    this.setState({
      chooseYear: date,
      yearPickerOpen: false
    })
  }

  onChangeOpen = (status: any) => {
    if (status) {
      this.setState({ yearPickerOpen: true })
    } else {
      this.setState({ yearPickerOpen: false })
    }
  }

  onSearch = () => {
    const { chooseYear } = this.state
    let isSearch = false
    if (chooseYear) {
      isSearch = true
    }
    this.setState({ current: 1, loading: true, isSearch }, () => this.getPageData())
    const year = chooseYear ? chooseYear.split('-')[0] : chooseYear
    SysUtil.setSessionStorage('AttendanceList_searchParams', year)
  }

  render () {
    const {
      isAuthenticated,
      AuthorityList,
      state: {
        yearPickerOpen, chooseYear, pageData, totalCount, current, loading, isSearch
      },
      props: {
        form: { getFieldDecorator }
      }
    } = this
    const paginationConfig = {
      current: current, // 当前的页
      pageSize: 2, // 每页显示的条数
      total: totalCount,
      size: 'small',
      showQuickJumper: true,
      onChange: this.onChangePage,
      itemRender: (current: number, type: string, originalElement: any) => {
        if (type === 'prev') {
          return <Button size='small' style={{ margin: '0 6px' }}>上一页</Button>
        } if (type === 'next') {
          return <Button size='small' style={{ margin: '0 6px' }}>下一页</Button>
        }
        return originalElement
      },
      showTotal: (total:any) => `共${total}条数据 `
    }
    return (
      <div className='attendance-list'>
        <Form layout='inline'>
          <Item label='年度'>
            <DatePicker
              suffixIcon={<img src={date}/>}
              mode='year'
              allowClear={true}
              placeholder='请选择年度'
              onPanelChange={this.onChangeYear}
              open={yearPickerOpen}
              format='YYYY'
              onOpenChange={this.onChangeOpen}
              value={chooseYear ? moment(chooseYear) : chooseYear}
              onChange={() => { this.setState({ chooseYear: null }) }}
            />
          </Item>
          <Item>
            <Button type='primary' onClick={this.onSearch}>搜索</Button>
          </Item>
        </Form>
        <div style={{ marginTop: 10, marginBottom: 20 }}>
          {isAuthenticated(AuthorityList.composeParam[1]) && <Button type='primary' onClick={this.onAdd}>
            <Icon component={IconTj}/>
            <span style={{ margin: '0 0.02rem', letterSpacing: 0 }}>新增</span>
          </Button>}
        </div>
        <Spin spinning={loading}>
          {
            pageData.length > 0 && pageData.map((item: any, index: any) => {
              return (
                <AttendanceTable key={index} dataSource={item} history={this.props.history} isAllowEdit={isAuthenticated(AuthorityList.composeParam[3])} />
              )
            })
          }
          {
            totalCount > 0
              ? <div style={{ textAlign: 'right', margin: '10px' }}>
                <Pagination {...paginationConfig} />
              </div>
              : <EmptyTable tips={isSearch ? '无搜索结果' : '暂无数据'} />
          }
        </Spin>
      </div>
    )
  }
}

export default Form.create<AttendanceListProps>()(AttendanceList)
