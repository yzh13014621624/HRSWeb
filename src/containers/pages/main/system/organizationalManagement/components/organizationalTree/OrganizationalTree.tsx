/**
 * @author qiuyang
 * @createTime 2020/05/13
 * @description 人员组织架构树无选择框版
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Tree } from 'antd'
import { JudgeUtil, SysUtil, compareDeep } from '@utils/index'

import './OrganizationalTree.styl'

const { TreeNode } = Tree

interface OrganizationalTreeProps {
  onChange?: any
  width?: string
  type?: number // 返回组织数组（0、上嘉 1、盒马 2、物美）不传默认全部
  searchParams?: string
  getOrganizationInfo?: (info: any) => void // 获取当前组织的第一个对象
}

interface OrganizationalTreeState {
  commonOrganize: any[]
  treeData: any[]
  type: number
  searchParams: any
  selectedKeys: any[]
  expandedKeys: any[]
  autoExpandParent: boolean
  organizationInfo: any
}

export default class OrganizationalTree extends RootComponent<OrganizationalTreeProps, OrganizationalTreeState> {
  expandedKey: any[] = []
  keyLevel: any[] = []
  constructor (props: any) {
    super(props)
    const { type, searchParams } = this.props
    this.state = {
      commonOrganize: (SysUtil.getSessionStorage('commonOrganizeArr') || []),
      treeData: [],
      type: typeof type === 'number' ? type : -1,
      searchParams: searchParams || '', // 搜索指定的节点
      selectedKeys: [], // 设置选中的树节点
      expandedKeys: [], // 展开指定的树节点
      autoExpandParent: false,
      organizationInfo: {}
    }
  }

  componentDidMount = () => {
    this.organizationInfo()
  }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    const { type, searchParams } = this.state
    // type变化清空内部状态
    if (!compareDeep(type, nextProps.type)) {
      this.props.onChange && this.props.onChange({})
      this.expandedKey = []
      this.keyLevel = []
      this.setState({
        type: nextProps.type,
        expandedKeys: [],
        selectedKeys: [],
        searchParams: ''
      })
      this.organizationInfo()
    } else if (!compareDeep(searchParams, nextProps.searchParams)) {
      this.props.onChange && this.props.onChange({})
      this.expandedKey = []
      this.keyLevel = []
      this.setState({
        expandedKeys: [],
        selectedKeys: []
      }, () => {
        this.searchParamsChange(this.keyLevel, nextProps.searchParams)
        let arr: any = new Set([...this.expandedKey])
        this.selectedValue([...arr], nextProps.searchParams)
        this.setState({
          searchParams: nextProps.searchParams,
          expandedKeys: [...arr],
          autoExpandParent: true
        })
      })
    }
  }

  // 选中精确查找选中值
  selectedValue = (data: any[], searchParams: string) => {
    let judge = false
    let index = 0
    // 用来筛选数据
    let str = ''
    for (let i = 0; i < data.length; i++) {
      let strArr: any[] = data[i].split('-')
      if (strArr[strArr.length - 1] === searchParams) {
        judge = true
        index = i
        str = searchParams
        break
      } else {
        judge = false
      }
    }
    if (judge) {
      const { commonOrganize, type } = this.state
      let organizeArr = type > -1 ? [commonOrganize[type]] : commonOrganize
      // 获取选中数据详情
      const organizeInfo = this.getSelectData(organizeArr, searchParams, [])[0]
      let param = {
        value: organizeInfo.orid,
        parentId: organizeInfo.parentId,
        orlevel: organizeInfo.level,
        title: organizeInfo.organize
      }
      this.props.onChange && this.props.onChange(param)
      this.setState({
        selectedKeys: [data[index]]
      })
    }
  }

  // 递归查询选中的数据的其他参数
  getSelectData = (data: any, param: string, organizeInfo: any[]) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].organize === param) {
        organizeInfo.push(data[i])
        break
      } else if (!JudgeUtil.isEmpty(data[i].next)) {
        this.getSelectData(data[i].next, param, organizeInfo)
      }
    }
    return organizeInfo
  }

  // 添加组织(type 1 新增， 2 编辑， 3 删除)
  addOrganize = async (data: any, type: number) => {
    let { commonOrganize } = this.state
    let commonOrganizes = await this.recursionOrganize(commonOrganize, data, type)
    SysUtil.setSessionStorage('commonOrganizeArr', commonOrganizes)
    this.setState({
      commonOrganize: commonOrganizes
    })
  }

  // 递归操作数组实现本地新增编辑删除等操作
  recursionOrganize = (organizes: any, data: any, type: number) => {
    organizes.map((el: any, i: number) => {
      if (el.orid === data.parentId) {
        const { parentId, orId, organize, orlevel } = data
        // 新增
        if (type === 1) {
          // 如果添加子级可能出现next为null
          if (!JudgeUtil.isEmpty(el.next)) {
            el.next.push({ parentId, orid: orId, organize, level: orlevel, next: null })
          } else {
            el.next = [{ parentId, orid: orId, organize, level: orlevel, next: null }]
          }
        } else if (type === 2) {
          // 编辑
          el.organize = organize
        } else {
          // 删除
          organizes.splice(i, 1)
        }
      } else {
        if (!JudgeUtil.isEmpty(el.next)) {
          this.recursionOrganize(el.next, data, type)
        }
      }
    })
    return organizes
  }

  // 查询含字符的元素
  searchParamsChange = (data: any[], searchParams: string) => {
    if (JudgeUtil.isEmpty(searchParams)) {
      this.expandedKey = []
      this.keyLevel = []
      this.setState({
        expandedKeys: [],
        selectedKeys: [],
        searchParams: ''
      })
    } else {
      data.map((value: any, i: any) => {
        let arr = value.organize.split('-')
        let str = arr[arr.length - 1]
        if (str.indexOf(searchParams) > -1) {
          this.parentSelectedKeys(value.organize)
        }
      })
    }
  }

  // 更新数据
  refresh = () => {
    this.setState({
      commonOrganize: (SysUtil.getSessionStorage('commonOrganizeArr') || [])
    })
  }

  organizationInfo = async () => {
    const { state: { type, commonOrganize }, props: { getOrganizationInfo } } = await this
    this.setState({
      organizationInfo: commonOrganize[type]
    })
    getOrganizationInfo && getOrganizationInfo(commonOrganize[type])
  }

  parentSelectedKeys = (organize: string) => {
    this.keyLevel.map((item: any, i: any) => {
      if (organize.indexOf(item.organize) > -1) {
        this.expandedKey.push(item.organize)
      }
    })
  }

  // 初始化一级目录
  initFirst = (data:any) => {
    if (data.length > 0) {
      return this.recursion(data, '')
    }
  }

  // 展开树节点触发
  onExpand = (expandedKeys: any[], e: any) => {
    const { expanded } = e
    this.keyLevel = []
    if (!expanded) {
      this.setState({
        selectedKeys: []
      })
      this.props.onChange && this.props.onChange({ selected: true })
    }
    this.expandedKey = expandedKeys
    this.setState({
      expandedKeys
    })
  }

  // 选中树节点触发
  onSelect = (selectedKeys: any, e: any) => {
    this.props.onChange && this.props.onChange(e.node.props)
    this.setState({
      selectedKeys
    })
  }

  // 删除，删除本地缓存 (type 1 新增， 2 编辑， 3 删除)
  deleteOrganiztional = (data: any, type: number) => {
    const { commonOrganize } = this.state
    const commonOrganizes = this.recursionOrganize(commonOrganize, data, type)
    SysUtil.setSessionStorage('commonOrganizeArr', commonOrganizes)
    this.setState({
      commonOrganize: commonOrganizes
    })
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 组织：递归数据遍历 */
  recursion = (data: any, key: string) => {
    return data.map((el:any) => {
      let keys = key === '' ? el.organize + '' : `${key}-${el.organize}`
      let values = el.orid
      let element = {
        ...el,
        organize: keys
      }
      this.keyLevel.push(element)
      return <TreeNode value={values} title={el.organize} key={keys} orlevel={el.level} parentId={el.parentId}>
        {JudgeUtil.isEmpty(el.next) ? null : this.recursion(el.next, keys)}
      </TreeNode>
    })
  }

  render () {
    const { treeData, type, expandedKeys, selectedKeys, commonOrganize } = this.state
    const { width } = this.props
    let treeDatas = type > -1 ? [commonOrganize[type]] : commonOrganize
    let tprops = {
      selectedKeys,
      expandedKeys,
      onExpand: this.onExpand,
      onSelect: this.onSelect,
      style: {
        width: width || '1.5rem',
        display: 'inline-block'
      }
    }
    return (
      <Tree {...tprops}>
        {this.initFirst(treeDatas)}
      </Tree>
    )
  }
}
