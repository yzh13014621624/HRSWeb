/**
 * @author minjie
 * @createTime 2019/04/07
 * @description 参保城市
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, Button, DatePicker, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import date from '@assets/images/date.png'
import moment from 'moment'
import SysUtil from '@utils/SysUtil'

interface SearchItemPageProps extends FormComponentProps {
  getSearchData:Function
  searchParams?: any
  namePlaceholder?: string
  type?: number // 用来区分是参保标准还是参保城市 1-参保标准 2-参保城市
}

@hot(module)
class SearchItemPage extends RootComponent<SearchItemPageProps, any> {
  constructor (props:any) {
    super(props)
  }

  /** 提交查询的信息 */
  hanldSubmit = (e:any) => {
    e.preventDefault()
    const { getSearchData, form, type } = this.props
    const { getFieldsValue } = form
    let { time, standardName } = getFieldsValue()
    if (getSearchData) {
      standardName = standardName && standardName !== '' ? standardName : undefined
      let obj:any = { standardName }
      if (time && time.length > 0) {
        obj['startTime'] = time[0].format('YYYY-MM-DD')
        obj['endTime'] = time[1].format('YYYY-MM-DD')
      }
      getSearchData(obj)
      type === 1 && SysUtil.setSessionStorage('StandardPage_searchParams', obj)
      type === 2 && SysUtil.setSessionStorage('CityPage_searchParams', obj)
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { endTime, startTime, standardName } = this.props.searchParams
    const namePlaceholder = this.props.namePlaceholder
    return (
      <Form layout="inline" onSubmit={this.hanldSubmit}>
        <Form.Item label="创建时间" >
          {getFieldDecorator('time', {
            initialValue: startTime ? [moment(startTime, 'YYYY-MM-DD'), moment(endTime, 'YYYY-MM-DD')] : undefined
          })(
            <DatePicker.RangePicker
              suffixIcon={<img src={date}/>}
              placeholder={['请选择日期', '请选择日期']}
              format="YYYY-MM-DD"
            />
          )}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('standardName', {
            initialValue: standardName
          })(
            <Input allowClear placeholder={namePlaceholder}></Input>
          )}
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create<SearchItemPageProps>()(SearchItemPage)
