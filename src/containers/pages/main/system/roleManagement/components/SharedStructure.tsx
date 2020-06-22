/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 人员组织架构组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { TreeSelect } from 'antd'

import { JudgeUtil, SysUtil } from '@utils/index'

import './ShareStructure.styl'
import _ from 'lodash'

const TreeNode = TreeSelect.TreeNode
const showCheckedStrategy = TreeSelect.SHOW_ALL // TreeSelect.SHOW_PARENT

interface SharedStructureProps {
  action?: any
  onChange?: any
  width?: string
  type?:string // string | number 默认 number 返回的id 连接 值，string 返回 字符串连接的值
  multiple?:boolean // 是否是多选的 默认是非多选点的
  dropdownClassName?: string // 下拉菜单类名
  defaultTree: any[] // 渲染列表数组
  value?: any
}

interface SharedStructureState {
  selDate: []
  treeData:any[]
  action: any
  type:string
}

export default class SharedStructure extends RootComponent<SharedStructureProps, SharedStructureState> {
  constructor (props:any) {
    super(props)
    const { action, type, multiple, defaultTree } = this.props
    const value = multiple ? props.value || [] : props.value
    this.state = {
      selDate: value,
      treeData: defaultTree,
      type: type || 'number',
      action: action || this.api.entryOrganize // 默认调用的查询全部的
    }
  }

  componentDidUpdate (prevProps: any) {
    if (!_.isEqual(this.props.value, prevProps.value)) {
      this.setState({
        selDate: this.props.value
      })
    }
  }

  static getDerivedStateFromProps (nextProps:any, nextState:any) {
    const { selDate, treeData, type, action } = nextState
    if ('value' in nextProps) {
      return {
        selDate: selDate,
        treeData: treeData,
        type: type,
        action: action // 默认调用的查询全部的
      }
    }
    return null
  }

  // 初始化一级目录
  initFirst = (data:any) => {
    if (data.length > 0) {
      return this.recursion(data)
    }
  }

  /** 组织：递归数据遍历 */
  recursion = (data:any) => {
    return data.map((el:any) => {
      let key = el.authID
      return <TreeNode value={key} title={el.authName} key={key}>
        {JudgeUtil.isEmpty(el.children) ? null : this.recursion(el.children)}
      </TreeNode>
    })
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  // change 事件
  treeSelectChange = (selDate: any) => {
    const { onChange } = this.props
    this.setState({
      selDate: selDate
    })
    if (onChange) {
      onChange(selDate)
    }
  }

  render () {
    const { treeData, selDate } = this.state
    const { width, dropdownClassName, defaultTree } = this.props
    const dropdownStyle = { maxHeight: 400, overflow: 'auto' }
    let tProps = {
      dropdownClassName,
      dropdownStyle,
      className: 'shared-structure',
      allowClear: true,
      value: selDate,
      onChange: this.treeSelectChange,
      treeCheckable: true,
      maxTagCount: 1,
      showCheckedStrategy: showCheckedStrategy,
      showSearch: true,
      maxTagPlaceholder: () => {
        return '...'
      },
      placeholder: '请选择组织',
      searchPlaceholder: '请输入关键字',
      style: {
        width: width || '1.5rem'
      }
    }
    return (
      <TreeSelect {...tProps}>
        {this.initFirst(treeData.length > 0 ? treeData : defaultTree)}
      </TreeSelect>
    )
  }
}
