/**
 * @author minjie
 * @createTime 2019/04/03
 * @description table 组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { EmptyTable, ReportTable, RootComponent, customizeRenderEmpty } from '@components/index'
import { Table, ConfigProvider, Button } from 'antd'
import { inArray, JudgeUtil, compareDeep, SysUtil } from '@utils/index'

import './TableItem.less'

import { KeyValue } from 'typings/global'
import { PaginationProps } from 'antd/lib/pagination'
type RowSelectionType = 'checkbox' | 'radio'

interface UrlInteface {
  path:string
  type?:string
}

interface TableItemProps {
  URL: UrlInteface,
  pageSize: number
  rowKey: string | {(record: KeyValue): any},
  columns: KeyValue[]
  searchParams?: KeyValue,
  mock?: boolean,
  index?: boolean // 是否设置列表序号，默认 true
  scroll?: {
    x?: boolean | number | string
    y?: boolean | number | string
  }
  rowSelection?: any, // 默认 true
  rowSelectionFixed?: boolean, // 第一列是否设置为左浮动，默认 true
  rowSelectionType?: RowSelectionType, // 设置表格是单选还是多选，默认多选
  filterKey?: string // 新增 key，和 rowKey 一致，但是只能是字符串类型，例如 id，默认 id
  onRow?: boolean // 是否要单击表单任意行选中/取消选中当前行
  getSelectedRow?: (selectedRowKeys: any[], selectedRows: KeyValue[]) => void // 如果需要，该接口用来提供表格选中的数据给父组件
  getRemoveSelect?: Function // 删除的选中信息
  getRemoveSelectAll?: Function // 删除的选中信息: 全部选中或取消的时候
  bordered?: any
  isPagination?: boolean // 是否需要分页的 true 显示， false 不显示默认的是true
  dataSourcePic?: boolean // 控制表格暂无数据显示的图片提示, 为false显示暂无关键字搜索图片 true显示暂无数据图片 默认为true
  sorterChange?: Function
  requried?: boolean // 用于列表第一次进来时,是否刷新列表 // true:刷新  false：不刷新
  getSalaryList?: (salaryList: any) => void
  setRowClassNameType?: any // 用来操作行样式 1-日统计
  bufferSearchParamsKey?: string // 需要缓存的搜索条件的key
}
interface TableState {
  dataSource: any[]
  pagination: PaginationProps
  selectedRowKeys: any[]
  selectedRows: KeyValue[]
  emptyTableOfficial: boolean // 无数据时展示的文案
}

export default class TableItem<T> extends RootComponent<TableItemProps, TableState> {
  static defaultProps = {
    type: 1,
    pageSize: 10,
    index: true,
    filterKey: 'id',
    onRow: false,
    isPagination: true,
    dataSourcePic: true,
    rowSelection: true,
    rowSelectionFixed: false,
    rowSelectionType: 'checkbox',
    bordered: false,
    requried: true
  }

  columns: KeyValue[] = []
  isOnRow: any
  isRowSelection: any

  constructor (props: TableItemProps) {
    super(props)
    const { pageSize, columns } = props
    this.formatColumsList(columns)
    this.cacheTableProps(props)
    this.state = {
      dataSource: [], // 保存前的数据
      pagination: {
        current: 1, // 当前的页
        pageSize, // 每页显示的条数
        total: 1,
        size: 'small',
        showQuickJumper: true,
        onChange: (page: number) => {
          const { pagination } = this.state
          // 在页码改变时刷新重加载数据
          if (page !== pagination.current) {
            pagination.current = page
            this.setState({ pagination })
            this.loadingTableData()
          }
        },
        itemRender: (current: number, type: string, originalElement: any) => {
          if (type === 'prev') {
            return <Button size="small" style={{ margin: '0 6px' }}>上一页</Button>
          } if (type === 'next') {
            return <Button size="small" style={{ margin: '0 6px' }}>下一页</Button>
          }
          return originalElement
        },
        showTotal: (total:any) => `总条数：${total}`
      },
      selectedRowKeys: [],
      selectedRows: [],
      emptyTableOfficial: true

    }
  }

  /* 格式化 Table 组件 column 属性 */
  formatColumsList (columns: KeyValue[]) {
    for (const item of columns) {
      if (!item.render) item.render = (text: string) => (<span>{(JudgeUtil.isEmpty(text) && '- - -') || text}</span>)
    }
    this.columns = columns
  }

  /* 缓存表格相关操作 */
  cacheTableProps (props: TableItemProps) {
    const {
      onRow, rowSelection, rowSelectionFixed, rowSelectionType,
      filterKey, getRemoveSelect, getRemoveSelectAll
    } = props
    let isOnRow, isRowSelection
    // 设置点击当前行任意位置取消/选中行
    if (onRow && rowSelection) {
      isOnRow = (row: KeyValue) => {
        return {
          onClick: () => {
            this.selectedCurrentRow(row)
          }
        }
      }
    }
    // 设置第一列为多选
    if (rowSelection) {
      isRowSelection = {
        type: rowSelectionType,
        fixed: rowSelectionFixed,
        onChange: async (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
          const rowList = [...this.state.selectedRows, ...selectedRows]
          const row = rowList.filter((item, i, arr) => {
            const { include } = inArray(item[filterKey!], selectedRowKeys)
            return include && arr.indexOf(item) === i && item
          })
          await this.setState({
            selectedRowKeys,
            selectedRows: row
          })
          this.submitSelectedRow(selectedRowKeys, row.length > 0 ? row : selectedRows)
        },
        onSelect: (record:any, selected:any, selectedRows:any, nativeEvent:any) => {
          getRemoveSelect && getRemoveSelect(record, selected, selectedRows)
        },
        onSelectAll: (selected:any, selectedRows:any, changeRows:any) => {
          getRemoveSelectAll && getRemoveSelectAll(selected, selectedRows, changeRows)
        }
      }
    }
    this.isOnRow = isOnRow
    this.isRowSelection = isRowSelection
  }

  componentDidMount () {
    const { requried } = this.props
    if (requried) {
      this.loadingTableData()
    }
  }

  async UNSAFE_componentWillReceiveProps (nextProps: TableItemProps) {
    const { columns, searchParams } = this.props
    if (!compareDeep(columns, nextProps.columns)) {
      this.formatColumsList(nextProps.columns)
    }
    if (!compareDeep(searchParams, nextProps.searchParams)) {
      const pagination = this.state.pagination
      pagination.current = 1
      await this.setState({ pagination })
      this.loadingTableData(nextProps)
    }
  }

  /* 加载数据 */
  loadingTableData = (props: TableItemProps = this.props) => {
    const { state: { pagination, selectedRows, selectedRowKeys }, submitSelectedRow } = this
    let { mock = false, searchParams, index, filterKey, bufferSearchParamsKey } = props
    SysUtil.setSessionStorage(bufferSearchParamsKey || '', searchParams)
    const page = pagination.current!
    const pageSize = pagination.pageSize!
    const params = { page, pageSize, ...searchParams }
    const hasSelected = !!selectedRowKeys.length
    const flag = this.isObjEqual(props.searchParams)
    if (flag) this.setState({ emptyTableOfficial: true })
    else this.setState({ emptyTableOfficial: false })
    this.axios.request(props.URL, params, mock)
      .then(({ data }) => {
        let dataObj: any[] = []
        if (JudgeUtil.isArrayFn(data)) { // 返回的值为数组的时候
          dataObj = data
        } else {
          const { totalNum } = data
          pagination.total = totalNum
          dataObj = data.data
          if ((totalNum > 0) && ((page * pageSize) - totalNum > 0) && ((((page * pageSize) - totalNum) % pageSize) <= 0)) {
            pagination.current = page - 1
            this.setState({ pagination }, () => this.loadingTableData())
            return
          }
        }
        if (index) {
          dataObj.forEach((item: any, i: number) => {
            item.index = (i + 1) + (page - 1) * pageSize
            const newKey = item[filterKey!]
            // 更新选中的数据
            if (hasSelected) {
              selectedRowKeys.forEach((oldKey, index) => {
                if (newKey === oldKey) selectedRows.splice(index, 1, item)
              })
            }
          })
        }
        hasSelected && submitSelectedRow(selectedRowKeys, selectedRows) // 更新列表中选中的数据，并且通知所有父组件
        // 修复当 table 出现重复 key 时，表格在其他页面更新合并了重复 key，导致表格页面展示数量多于 10 条情况
        this.setState({
          dataSource: []
        }, () =>
          this.setState({
            dataSource: dataObj,
            pagination,
            selectedRows,
            selectedRowKeys
          })
        )
        props.getSalaryList && props.getSalaryList(dataObj)
      })
  }

  /* 点击表格任意一行选中或者取消选中 */
  selectedCurrentRow = (row: KeyValue) => {
    const {
      props: { filterKey, rowSelectionType },
      state: { selectedRowKeys, selectedRows }
    } = this
    const currentVal = row[filterKey!]
    if (rowSelectionType === 'radio') {
      selectedRowKeys.splice(0)
      selectedRows.splice(0)
      selectedRowKeys.push(currentVal)
      selectedRows.push(row)
    } else {
      const { include, index } = inArray(currentVal, selectedRowKeys)
      if (include) {
        selectedRows.some((item, i) => {
          if (currentVal === item[filterKey!]) {
            selectedRowKeys.splice(index, 1)
            selectedRows.splice(i, 1)
            return true
          }
          return false
        })
      } else {
        selectedRowKeys.push(currentVal)
        selectedRows.push(row)
      }
    }
    this.setState({
      selectedRowKeys,
      selectedRows
    })
    this.submitSelectedRow(selectedRowKeys, selectedRows)
  }

  /* 提供该接口，以供父组件可能需要用到表格选中的数据 */
  submitSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    const { rowSelection, getSelectedRow } = this.props
    rowSelection && getSelectedRow && getSelectedRow(selectedRowKeys, selectedRows)
  }

  /**
   * 删除之后计算
   * @param num  删除了几条数据
   */
  removeLodingTable = (num?:number) => {
    const { pagination, dataSource } = this.state
    if (num) {
      let pageSize = dataSource.length - num
      let current:any = pagination.current
      if (pageSize === 0) {
        pagination.current = current > 1 ? current - 1 : current
      }
    }
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      pagination
    })
    this.loadingTableData()
  }

  /* 删除表格数据之后调用该方法 */
  deletedAndUpdateTableData = () => {
    this.$message.success('删除成功', 2)
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.loadingTableData()
  }

  // 排序
  onChange = (pagination: any, filters: any, sorter: any) => {
    const { sorterChange } = this.props
    if (sorterChange) {
      sorterChange(sorter.order)
    }
  }

  componentWillUnmount () { this.setState = (state, callback) => {} }

  // 比较搜索条件是否变化---用于解决初始无数据时和搜索无数据时展示的文案
  isObjEqual = (o1: any) => {
    let count = 0
    let o2 = o1 ? JSON.parse(JSON.stringify(o1)) : o1
    if (o2) {
      // 剔除列表初始加载中的空串和空数组
      for (let i in o2) {
        if (typeof o2[i] !== 'number') {
          if (!o2[i].length) {
            delete o2[i]
          }
        }
      }
      // 剔除列表初始加载中的额外的必传参数如果不剔除列表初始无数据时会显示暂无搜索结果应该显示为暂无数据
      o2['page'] = undefined
      o2['pageSize'] = undefined
      o2['type'] = undefined
      o2['noAttend'] = undefined
      var props2 = Object.getOwnPropertyNames(o2)
      const len = props2.length
      for (var i = 0; i < len; i++) {
        if (!o2[props2[i]]) count++
      }
      if (len > 0 && len === count) return true
      else return false
    }
  }

  // 目前用于设置鼠标移入行样式
  setClassName = (v: any, i: any) => {
    const { props: { setRowClassNameType } } = this
    if (setRowClassNameType === 1) {
      const { faceAttendDetail: { paramType } } = v
      if (paramType) {
        if (paramType === '1') return 'bg-b'
        else if (paramType === '3') return 'bg-g'
        else if (paramType === '2') return 'bg-m'
      } else return ''
    }
    return 'bg-normal'
  }

  render () {
    const {
      columns,
      isOnRow,
      isRowSelection,
      props: { onRow, scroll, rowKey, rowSelection, bordered, isPagination, dataSourcePic },
      state: { dataSource, pagination, selectedRowKeys, emptyTableOfficial }
    } = this
    const hasData = dataSource.length > 0
    return (
      <div className="table-content">
        <ConfigProvider renderEmpty={dataSourcePic ? emptyTableOfficial ? EmptyTable : customizeRenderEmpty : ReportTable}>
          <Table<T>
            className={`table ${onRow && rowSelection ? 'select_row' : null}`}
            size="middle"
            onRow={isOnRow}
            rowSelection={isRowSelection && { ...isRowSelection, selectedRowKeys }}
            scroll={scroll}
            rowKey={rowKey}
            onChange={this.onChange}
            columns={columns}
            bordered={bordered}
            pagination={isPagination ? hasData ? pagination : false : false }
            dataSource={dataSource}
            rowClassName={this.setClassName}
          />
        </ConfigProvider>
      </div>
    )
  }
}
