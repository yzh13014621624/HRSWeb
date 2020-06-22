/*
 * @description: 项目-计件凭证维护
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-20 14:44:39
 * @LastEditTime: 2020-05-29 16:52:58
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, FileUpload, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Select, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'
import moment from 'moment'
import SharedStructure from '@shared/structure/SharedStructure'
import './Index.styl'
import { SysUtil } from '@utils/index'
import NumberFormatUtils from '@utils/NumberFormat'
import PieceOverviewOnStaff from './pieceoverviewonstaff/pieceoverviewonstaff'

const { MonthPicker } = DatePicker
const { Option } = Select
const { Item } = Form

interface State {
  searchParams: KeyValue
  placeholderText: number
  isVisible: boolean
  pvId: any[]
  clocks: boolean
  pipName: string
  necessary: KeyValue
  searchData: KeyValue
}

interface FormProps extends BaseProps, FormComponentProps{}

class PieceoverviewList extends RootComponent<FormProps, State> {
  FileUpload = React.createRef<FileUpload>()
  modalRef = React.createRef<BasicModal>()
  tableRef = React.createRef<TableItem<any>>()
  necessary: KeyValue = JSON.parse(localStorage.getItem('pieceoverviewList-userInfo') as string)
  constructor (props: FormProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('pieceoverviewlist_searchParams')
    this.state = {
      searchParams: searchParams || {
        organizeArr: [],
        pvTime: this.necessary.pvTime,
        piProjectId: this.necessary.piProjectId
      },
      placeholderText: 1,
      searchData: {
        pvTime: this.necessary.pvTime,
        piProjectId: this.necessary.piProjectId
      },
      isVisible: false, // 弹窗是否可见
      pipName: this.necessary.pipName || '',
      pvId: [], // 存储删除信息的id
      clocks: false, // 存储是否能删除的状态
      necessary: {} // 存储传递给详情页的属性
    }
  }

  searchOnChang = (e: any) => {
    setTimeout(() => {
      const searchParams = this.props.form.getFieldsValue()
      searchParams.pvTime = searchParams.pvTimeList
      searchParams.projectNumber = searchParams.projectNumberList
      searchParams.userName = searchParams.userNameList
      delete searchParams.pvTimeList
      delete searchParams.projectNumberList
      delete searchParams.userNameList
      let pvTimeNum = 0
      if (searchParams.selectValue) {
        searchParams.sjNumber = searchParams.projectNumber
        delete searchParams.projectNumber
      }
      delete searchParams.selectValue
      if (searchParams.pvTime) {
        pvTimeNum = parseInt(moment(searchParams.pvTime).format('YYYYMM'))
        this.necessary.pvTime = pvTimeNum
        searchParams.pvTime = pvTimeNum
      }
      searchParams.piProjectId = this.necessary.piProjectId
      this.setState({
        searchData: searchParams
      })
    }, 200)
  }

  // 搜素点击事件
  searchOnClick = () => {
    const { searchData, placeholderText } = this.state
    searchData.selectValue = placeholderText
    this.setState({
      searchParams: searchData
    })
  }

  // 列表查看按钮
  examineClick = (records: KeyValue) => {
    const { necessary: { piProjectId } } = this
    this.props.history.push(`/home/salarypiece/SalaryPieceOverview/pieceoverviewlist/pieceoverviewinfo?pvId=${records.pvId}&piProjectId=${piProjectId}`)
  }

  // 下拉框onchange事件
  selectValueOnChange = (value: any) => {
    this.setState({
      placeholderText: value
    })
  }

  // 获取表格选中的数据
  getSelectedRow = (keys: any[], selectedRow: KeyValue[]) => {
    const { clocks } = this.state
    if (selectedRow.length > 0) {
      if (clocks !== selectedRow[0].clock) {
        this.setState({
          clocks: selectedRow[0].clock
        })
      }
    }
    this.setState({
      pvId: keys
    })
  }

  // 批量删除
  deletedsBtn = (id?: any, clock?: any) => {
    const { clocks, pvId } = this.state
    if (clock) {
      this.$message.warn('本月薪资已关账,无法删除')
    } else {
      if (typeof id === 'number') {
        this.setState({
          pvId: [id]
        })
        this.modalRef.current!.onShow()
      } else {
        if (pvId.length === 0) {
          this.$message.warn('请选择员工')
        } else if (clocks) {
          this.$message.warn('本月薪资已关账,无法删除')
        } else {
          this.modalRef.current!.onShow()
        }
      }
    }
  }

  // 根据 useId 移除 localeStorage 中指定的信息
  clearLocaleStoragedPieceoverviewInfo (name: string) {
    const { userId } = this.necessary
    let pieceoverviewInfo = SysUtil.getLocalStorage(name)
    if (!pieceoverviewInfo) pieceoverviewInfo = {}
    delete pieceoverviewInfo[userId]
    if (!Object.keys(pieceoverviewInfo).length) SysUtil.clearLocalStorage(name)
    else SysUtil.setLocalStorage(name, pieceoverviewInfo)
  }

  // 模态框确定按钮
  handleOk = () => {
    const { pvId } = this.state
    this.axios.request(this.api.DelPieceworkVoucher, { pvId }).then(({ code }) => {
      if (code === 200) {
        this.tableRef.current!.deletedAndUpdateTableData()
        this.setState({
          clocks: false,
          pvId: []
        })
      }
    })
    this.modalRef.current!.handleCancel()
  }

  // 模态框取消按钮
  handleCancel = () => {
    this.modalRef.current!.handleCancel()
  }

  // 新增模态框
  showModal = () => {
    const { maintenance } = this.necessary
    if (maintenance) {
      this.setState({
        isVisible: true
      })
    } else {
      this.errorProject()
    }
  }

  closeDialog = (f:boolean) => {
    this.setState({
      isVisible: f
    })
  }

  // 计件项目参数没配置
  errorProject = () => {
    this.$message.error('请先配置该计件项目参数!')
  }

  render () {
    const {
      api,
      necessary,
      necessary: { pvTime },
      props: { form: { getFieldDecorator } },
      state: {
        placeholderText,
        searchParams,
        pipName,
        isVisible,
        searchData,
        searchParams: { organizeArr }
      }
    } = this
    const [, add, , examine, del, dels, im, ex, dl] = this.AuthorityList.salarypiece
    const columns = [
      { title: '序号', dataIndex: 'index', width: 80 },
      { title: '计件项目', dataIndex: 'pipName', width: 100 },
      { title: '地址', dataIndex: 'pipAddress', width: 200 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
      { title: '法人主体', dataIndex: 'entity', width: 200 },
      { title: '组织', dataIndex: 'organize', width: 280 },
      { title: '计薪类型', dataIndex: 'salaryType', width: 100 },
      { title: '月份', dataIndex: 'pvTime', width: 100 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      { title: '身份证号码', dataIndex: 'idCard', width: 180 },
      { title: '收货（每托盘）数量', dataIndex: 'collectGoods', width: 130 },
      { title: '收货（每托盘）单价', dataIndex: 'collectGoodsPrice', width: 130 },
      { title: '本月收货（每托盘）金额',
        width: 150,
        render: (text: any, records: any) => {
        // 等于收货（每托盘）数量 * 收货（每托盘）单价
          return (
            <span>{NumberFormatUtils.doubleFormat(records.collectGoods * records.collectGoodsPrice, 3)}</span>
          )
        }
      },
      { title: '上架（每托盘）数量', dataIndex: 'upShelf', width: 130 },
      { title: '上架（每托盘）单价', dataIndex: 'upShelfPrice', width: 130 },
      { title: '本月上架（每托盘）金额',
        width: 150,
        render: (text: any, records: any) => {
        // 等于上架（每托盘）数量 * 上架（每托盘）单价
          return (
            <span>{NumberFormatUtils.doubleFormat(records.upShelf * records.upShelfPrice, 3)}</span>
          )
        }
      },
      { title: '补货（每托盘）数量', dataIndex: 'repairGoods', width: 130 },
      { title: '补货（每托盘）单价', dataIndex: 'repairGoodsPrice', width: 130 },
      { title: '本月补货（每托盘）金额',
        width: 150,
        render: (text: any, records: any) => {
        // 等于补货（每托盘）数量 * 补货（每托盘）单价
          return (
            <span>{NumberFormatUtils.doubleFormat(records.repairGoods * records.repairGoodsPrice, 3)}</span>
          )
        }
      },
      { title: '整箱拣货-标签拣选（每箱）数量', dataIndex: 'rfLabel', width: 190 },
      { title: '整箱拣货-标签拣选（每箱）单价', dataIndex: 'rfLabelPrice', width: 190 },
      { title: '本月整箱拣货-标签拣选（每箱）金额',
        width: 220,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.rfLabel * records.rfLabelPrice, 3)}</span>
          )
        }
      },
      { title: '整箱拣货-RF拣选（每箱）数量', dataIndex: 'rfBox', width: 180 },
      { title: '整箱拣货-RF拣选（每箱）单价', dataIndex: 'rfBoxPrice', width: 180 },
      { title: '本月整箱拣货-RF拣选（每箱）金额',
        width: 220,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.rfBox * records.rfBoxPrice, 3)}</span>
          )
        }
      },
      { title: '整箱拣货-RF拣选（每行）数量', dataIndex: 'rfRow', width: 180 },
      { title: '整箱拣货-RF拣选（每行）单价', dataIndex: 'rfRowPrice', width: 180 },
      { title: '本月整箱拣货-RF拣选（每行）金额',
        width: 220,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.rfRow * records.rfRowPrice, 3)}</span>
          )
        }
      },
      { title: '拆零拣货（每行）数量', dataIndex: 'zeroPick', width: 140 },
      { title: '拆零拣货（每行）单价', dataIndex: 'zeroPickPrice', width: 140 },
      { title: '本月拆零拣货（每行）金额',
        width: 160,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.zeroPick * records.zeroPickPrice, 3)}</span>
          )
        }
      },
      { title: '拆零上架（每托盘）数量', dataIndex: 'zeroUp', width: 160 },
      { title: '拆零上架（每托盘）单价', dataIndex: 'zeroUpPrice', width: 160 },
      { title: '本月拆零上架（每托盘）金额',
        width: 180,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.zeroUp * records.zeroUpPrice, 3)}</span>
          )
        }
      },
      { title: '拆零下架（每托盘）数量', dataIndex: 'zeroDown', width: 160 },
      { title: '拆零下架（每托盘）单价', dataIndex: 'zeroDownPrice', width: 160 },
      { title: '本月拆零下架（每托盘）金额',
        width: 180,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.zeroDown * records.zeroDownPrice, 3)}</span>
          )
        }
      },
      { title: '越库（每箱）数量', dataIndex: 'crossDocking', width: 150 },
      { title: '越库（每箱）单价', dataIndex: 'crossDockingPrice', width: 150 },
      { title: '本月越库（每箱）金额',
        width: 160,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.crossDocking * records.crossDockingPrice, 3)}</span>
          )
        }
      },
      { title: '移库（每托盘）数量', dataIndex: 'moveLibrary', width: 150 },
      { title: '移库（每托盘）单价', dataIndex: 'moveLibraryPrice', width: 150 },
      { title: '本月移库（每托盘）金额',
        width: 160,
        render: (text: any, records: any) => {
          return (
            <span>{NumberFormatUtils.doubleFormat(records.moveLibrary * records.moveLibraryPrice, 3)}</span>
          )
        }
      },
      { title: '本月计件小时数', dataIndex: 'pvHourNum', width: 100 },
      { title: '计件收入', dataIndex: 'pvIncome', width: 110 },
      { title: '本月非计件小时数', dataIndex: 'pvNoHourNum', width: 130 },
      { title: '非计件收入', dataIndex: 'pvNoIncome', width: 100 },
      { title: '计件系数', dataIndex: 'pvCoe', width: 100 },
      { title: '计件奖金', dataIndex: 'pvBonus', width: 100 },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 120,
        render: (text: any, records: any) => (
          <div>
            {
              this.isAuthenticated(examine) &&
              <span style = {{ color: '#40A9FF', cursor: 'pointer', margin: '0 13px' }} onClick={() => this.examineClick(records)}>查看</span>
            }
            {
              this.isAuthenticated(del) &&
              <span style = {{ color: '#40A9FF', cursor: 'pointer' }} onClick={ () => this.deletedsBtn(records.pvId, records.clock) }>删除</span>
            }
          </div>
        )
      }
    ]
    console.log(pvTime, 'pvTime')
    console.log(searchParams.pvTime, 'searchParams.pvTime')
    return (
      <div id="pieceoverviewlist">
        <Row>
          <Col>
            <div className='pieceoverviewlist-project-text'><span>计件项目: </span>{pipName}</div>
          </Col>
          <Col>
            <Form layout='inline'>
              <Item label="月度" className="contract-com-margin-r-10">
                { getFieldDecorator('pvTimeList', {
                  initialValue: !searchParams.pvTime ? moment(pvTime, 'YYYYMM') : moment(String(searchParams.pvTime), 'YYYYMM')
                })(
                  <MonthPicker onChange={this.searchOnChang} allowClear={false} format="YYYY年MM月" disabledDate={(current: any) => current && current > moment().endOf('day')}/>
                ) }
              </Item>
              <Item className="contract-com-margin-r-10">
                { getFieldDecorator('selectValue', {
                  initialValue: typeof searchParams.selectValue === 'number' ? searchParams.selectValue : 1
                })(
                  <Select onChange={this.selectValueOnChange} className="input-120">
                    <Option value={0}>工号</Option>
                    <Option value={1}>管理编号</Option>
                  </Select>
                ) }
              </Item>
              <Item className="contract-com-margin-r">
                {getFieldDecorator('projectNumberList', {
                  initialValue: searchParams.projectNumber,
                  rules: [
                    {
                      message: '请输入字母或者数字',
                      pattern: new RegExp(/^[A-Za-z0-9]+$/, 'g')
                    }
                  ]
                })(
                  <Input placeholder={`请输入${placeholderText === 0 ? '工号' : '管理编号'}`} allowClear onChange={this.searchOnChang} />
                )}
              </Item>
              <Item className="contract-com-margin-r">
                {getFieldDecorator('userNameList', {
                  initialValue: searchParams.userName,
                  rules: [
                    {
                      message: '请输入英文或中文',
                      pattern: new RegExp(/^[\u4e00-\u9fa5_a-zA-Z]+$/)
                    }
                  ]
                })(<Input placeholder='请输入姓名' allowClear maxLength={15} onChange={this.searchOnChang} />)}
              </Item>
              <Item className="contract-com-margin-r">
                {getFieldDecorator('organizeArr', {
                  initialValue: organizeArr || []
                })(<SharedStructure type="string" multiple onChange={this.searchOnChang} />)}
              </Item>
              <Item>
                <Button type="primary" className="contract-search-button" onClick = {this.searchOnClick}>搜索</Button>
              </Item>
            </Form>
          </Col>
          <Col>
            {
              this.isAuthenticated(add) &&
              <Button className="contract-page-button" type="primary" onClick={this.showModal}>
                <Icon component={IconTj}/>新增
              </Button>
            }
            {
              this.isAuthenticated(dels) &&
              <Button className="contract-page-button" type="primary" onClick={this.deletedsBtn}>
                <Icon component={IconSc}/>批量删除
              </Button>
            }
            {
              this.isAuthenticated(im) &&
              (necessary.maintenance
                ? <FileUpload ref={this.FileUpload} action={api.importPiecework.path} params={{ pipName, pvTime: searchParams.pvTime || pvTime }}>
                  <Button className="contract-page-button" type="primary">
                    <Icon component={IconDr}/>导入
                  </Button>
                </FileUpload>
                : <Button className="contract-page-button" type="primary" onClick={this.errorProject}>
                  <Icon component={IconDr}/>导入
                </Button>)
            }
            {
              this.isAuthenticated(ex) &&
              <BasicDowload
                action={api.exportParameterSalary}
                parmsData={searchData}
                fileName="项目-计件凭证维护导出"
                dowloadURL="URL"
                className="contract-page-button"
                btntype="primary">
                <Icon component={IconDc}/>导出
              </BasicDowload>
            }
            {
              this.isAuthenticated(dl) &&
              <BasicDowload action={api.ExportParameterTem}
                parmsData={{ type: '.xlsx' }} fileName="项目-计件凭证维护导入模板"
                className="contract-page-button" btntype="primary">
                <Icon component={IconXz}/>下载导入模版
              </BasicDowload>
            }
          </Col>
        </Row>
        <TableItem
          ref = {this.tableRef}
          searchParams = {searchParams}
          columns = {columns}
          URL = {this.api.PieceoverviewList}
          rowSelectionFixed
          getSelectedRow={this.getSelectedRow}
          filterKey="pvId"
          rowKey = {({ pvId }) => pvId}
          scroll={{ x: 5780 }}
          bufferSearchParamsKey='pieceoverviewlist_searchParams'
        />
        <BasicModal
          ref={this.modalRef}
          maskClosable = {false}
        >
          <p className="delete-p"><span>确认删除？</span></p>
          <Row className='modalbtn'>
            <Col>
              <Button onClick = {this.handleOk} type="primary">确定</Button>
              <Button onClick = {this.handleCancel} type="primary">取消</Button>
            </Col>
          </Row>
        </BasicModal>
        <PieceOverviewOnStaff {...this.props} visible={isVisible} closeDialog={this.closeDialog} necessary={necessary}></PieceOverviewOnStaff>
      </div>
    )
  }
}
export default Form.create()(PieceoverviewList)
