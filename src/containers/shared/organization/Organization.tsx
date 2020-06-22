/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 人员组织架构组件- 下拉框的选择
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Select } from 'antd'

import { outArrayNew, JudgeUtil } from '@utils/ComUtil'

const Option = Select.Option

interface EntryOrganizeProps {
  onChange?: any
  width?: string
  data: Array<any>
  placeholder?:string
}

interface EntryOrganizeState {
  selData: []
  data: Array<any>
  dataBuffer:Array<any>
  fetching: boolean
  search: boolean
}

export default class EntryOrganize extends RootComponent<EntryOrganizeProps, EntryOrganizeState> {
  constructor (props:any) {
    super(props)
    const value = props.value || []
    this.state = {
      selData: value,
      data: [],
      dataBuffer: [],
      fetching: false,
      search: false
    }
  }

  static getDerivedStateFromProps (props:any, state:any) {
    // 在 传入值之后 进行修改state
    if (props.data !== state.data) {
      let oary = outArrayNew(props.data)
      let ary = state.data
      if (!state.search) {
        ary = oary.length > 300 ? oary.slice(0, 300) : oary
      }
      return {
        selData: props.value || [],
        data: ary,
        dataBuffer: oary,
        search: false
      }
    }
    return null
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** change 事件 */
  treeSelectChange = (selData:any) => {
    this.setState({ selData, data: [] })
    this.triggerChange(selData)
  }

  triggerChange = (changedValue:any) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  fetchUser = (value:any) => {
    const { dataBuffer } = this.state
    if (!JudgeUtil.isEmpty(value)) {
      let data = dataBuffer.filter((el:any) => {
        return el.lablekey.indexOf(value) >= 0
      })
      this.setState({ data, search: true })
    } else {
      this.setState({ search: false })
    }
  }

  render () {
    const { data, selData } = this.state
    const { placeholder } = this.props
    return (
      <Select
        showSearch
        allowClear
        value={selData}
        placeholder={placeholder || '请选择组织'}
        filterOption={false}
        onSearch={this.fetchUser}
        getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
        onChange={this.treeSelectChange}
      >
        {data.map(d => (
          <Option key={d.lablekey} value={d.lablekey} title={d.lablekey}>{d.lablekey}</Option>
        ))}
      </Select>
    )
  }
}
