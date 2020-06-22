/*
 * @description: 公共组件搜索input框
 * @author: songliubiao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-26 14:08:35
 * @LastEditTime: 2020-05-21 17:48:56
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Tooltip, Select, Icon } from 'antd'
import { hot } from 'react-hot-loader'
import { KeyValue } from 'typings/global'
import { JudgeUtil, compareDeep } from '@utils/index'
import './index.styl'

const { Option } = Select

enum EnumId {
  cityId = 1,
  charID = 2,
  arId = 3,
  positionId = 4,
}

enum EnumValue {
  cityName = 1,
  charName = 2,
  roleName = 3,
  position = 4,
}

interface UrlInteface {
  path:string
  type?:string
}

declare const SearchInputType: [1, 2, 3, 4]

interface SearchInputProps {
  collectValue: 'id' | 'name' // 收集 id 还是 name ，默认是 id
  url: UrlInteface
  type: (typeof SearchInputType)[number] // 1 - 城市选择 2 - 角色选择 3 - 分配角色 4 - 职级
  param?: KeyValue // 需要添加给接口的额外数据
  onChange?: (v: any) => void
  onSearch?:(v: any) => void
  onBlur?:() => void
  getSelected?: (v: any, i?: any) => void // 获取整个 item
  onClick?: () => void
  value?: string
  placeholder?: string
  className?: string
  isdisabled?: boolean
  i?: number
  limit?: boolean// 因为有些数据量较大会导致服务响应超时如果有需要传入这个字段 和后端商定为10位数，当用户输入达到十位之后再进行搜索
}

interface SearchInputState {
  searchList: KeyValue[],
  value: any
}

@hot(module)
export default class SearchInput extends RootComponent<SearchInputProps, SearchInputState> {
  static defaultProps = {
    collectValue: 'id',
    limit: false
  }

  timeout: any

  constructor (props: SearchInputProps) {
    super(props)
    this.state = ({
      value: props.value,
      searchList: []
    })
  }

  componentDidMount () {
    this.getListData()
  }

  // shouldComponentUpdate (nextProps: SearchInputProps) {
  //   return nextProps.value !== this.props.value
  // }

  UNSAFE_componentWillReceiveProps (props: SearchInputProps) {
    const { value } = props
    if (!compareDeep(this.props, props)) this.getListData(undefined, props)
    this.setState({ value })
  }

  handleSearch = (value: string) => {
    const { props: { url, onSearch, limit }, getListData } = this
    // if的作用由于运单号过多会导致页面卡顿所以限制输入达到一定的长度后再去搜索
    if (limit && value.length < 10) return
    this.setState({ searchList: [] })
    value && getListData(value)
    onSearch && onSearch(value)
  }

  handleChange = (value: any) => {
    const { props: { collectValue, onChange, getSelected, type, i }, state: { searchList } } = this
    const keyName = collectValue === 'id' ? EnumId[type] : EnumValue[type]
    const Item = searchList.find(item => item[keyName] === value)
    onChange && onChange(value)
    getSelected && getSelected(Item, i)
    this.setState({ value })
  }

  getListData = (value?: string, props?: SearchInputProps) => {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    const { axios: { request } } = this
    const { url, type, param } = props || this.props
    let keyName: string
    switch (EnumValue[type]) {
      case 'sj56UserNickname': keyName = 'name'; break
      case 'dwName': keyName = 'name'; break
      case 'charName': keyName = 'roleName'; break
      case 'dname':
        switch (url.path) {
          case '/adminLine/v1/selectLine': keyName = 'lineName'; break
          default: keyName = EnumValue[type]
        } break
      default: keyName = EnumValue[type]
    }
    const params = param ? { [keyName]: value, ...param } : { [keyName]: value }
    // this.timeout = setTimeout(() => {
    request(url, params).then((res) => {
      if (JudgeUtil.isArrayFn(res.data)) {
        this.setState({
          searchList: res.data
        })
      // eslint-disable-next-line no-constant-condition
      } else if (res instanceof Array) {
        this.setState({
          searchList: res
        })
      } else {
        this.setState({
          searchList: res.data.data
        })
      }
    })
    // }, 300)
  }

  // 当重复选用同一条数据时触发
  handleSelect = (v: any) => {
    const { props: { collectValue, getSelected, type, i }, state: { searchList } } = this
    const keyName = collectValue === 'id' ? EnumId[type] : EnumValue[type]
    const Item = searchList.find(item => item[keyName] === v)
    getSelected && getSelected(Item, i)
  }

  // 失去焦点触发
  HandleBlur = () => {
    const { props: { onBlur } } = this
    onBlur && onBlur()
  }

  render () {
    const {
      props: { collectValue, type, placeholder = '请选择', className = 'select-220' },
      state: { searchList, value }
    } = this
    const keyName = EnumId[type]
    const valueName = EnumValue[type]
    return (
      <div className='publicsearchselect'>
        <Select
          allowClear
          showSearch
          className={className}
          placeholder={placeholder}
          value={value}
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          disabled={this.props.isdisabled}
          notFoundContent={null}
          showArrow={!value } // 如果下拉框有值将下拉箭头隐藏
          onBlur={this.HandleBlur}
        >
          {searchList && searchList.map((item: any, i: number) =>
            <Option
              key={`${i}-${item[keyName]}-${item[valueName]}`}
              value={
                collectValue === 'id'
                  ? item[keyName]
                  : item[valueName]}>
              {item[valueName]}
            </Option>)
          }
        </Select>
      </div>
    )
  }
}
