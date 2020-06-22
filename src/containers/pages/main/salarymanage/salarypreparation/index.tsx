/*
 * @description: 薪酬准备列表
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-09-19 14:06:29
 * @LastEditTime: 2020-05-28 15:46:52
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent, TableItem, BasicDowload, BasicModal, FileUpload } from '@components/index'
import { Button, Form, DatePicker, Input, Icon, Select, Col, Row } from 'antd'
import SharedStructure from '@shared/structure/SharedStructure'
import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'
import date from '@assets/images/date.png'
import SharedSelectEmployees from '@shared/sharedOnStaff/sharedOnStaff'
import { SysUtil, outArrayNew } from '@utils/index'
import { FormProps } from 'typings/global'
import moment from 'moment'
import './style/index'

const { Item } = Form
const { Option } = Select
const { MonthPicker } = DatePicker

interface FormItemProps extends FormProps {
  numberType: any,
}
interface State {
  // numberType: any,
  searchParams?: any,
  organizeList:any,
  errorMsg:string,
  isVisible?: any,
  salaryList: any,
  type: number,
  selectedRows: any,
  idList: any,
  selectedRowKeys: any, // 列表中选择数据的id集合
  dateDay:any, // 日期参数
  placeholderText: any,
  rowSelection?: any,
}
@hot(module)
class SchedulingPage extends RootComponent<FormProps, State> {
  BasicModal = React.createRef<BasicModal>()
  BasicModalTwo = React.createRef<BasicModal>()
  tableItem = React.createRef<TableItem<any>>()
  tableRef = React.createRef<TableItem<any>>()
  selectedRows: any[]
  /* 保存多选的信息 */
      public type:string = ''
      constructor (props:any) {
        super(props)
        let commonOrganize = SysUtil.getSessionStorage('commonOrganize')
        const searchParams = SysUtil.getSessionStorage('salarypreparation_searchParams')
        let organizeList = outArrayNew(commonOrganize).map((el:any) => el.lablekey)
        let params = new URLSearchParams(location.search)
        let dates = params.get('before')
        this.selectedRows = []
        this.state = {
          // numberType: this.props.numberType || '工号',
          placeholderText: '' || '管理编号',
          organizeList,
          errorMsg: '',
          isVisible: false, // 弹窗是否可见
          salaryList: [], // 薪酬列表
          type: 1,
          searchParams: searchParams || {},
          selectedRowKeys: [],
          selectedRows: [],
          idList: [], // 存储删除信息的id集合
          dateDay: dates || null // 页面传递的数据
        }
      }
  // 搜索
  searchData = () => {
    const data = this.props.form.getFieldsValue()
    const { usersName, months, sjNumbers, organizeArrs } = data
    data.month = moment(months).format('YYYY-MM')
    data.userName = usersName
    data.sjNumber = sjNumbers
    data.organizeArr = organizeArrs
    let searchParams = Object.assign({}, data)
    delete searchParams.months
    delete searchParams.usersName
    delete searchParams.sjNumbers
    delete searchParams.organizeArrs
    this.setState({
      searchParams
    })
  }
  getSalaryList = (salaryList:any) => {
    this.setState({
      salaryList
    })
  }
  // 模态框
  showModal = (type: number) => {
    this.setState({
      isVisible: true,
      type
    })
  }
  closeDialog = (f:boolean) => {
    this.setState({
      isVisible: f
    })
  }

  /** 模态框的显示 num: 0 关闭 1 打开  msg: 显示的消息 */
  handleModal = (num:number, msg?:string, type?:string) => {
    const { onShow, handleCancel } = this.BasicModal.current as BasicModal
    if (num === 0) {
      handleCancel()
    } else {
      this.type = type || ''
      this.setState({
        errorMsg: msg || ''
      })
      onShow()
    }
  }
  handleModalTwo = (num:number, msg?:string) => {
    const { onShow, handleCancel } = this.BasicModalTwo.current as BasicModal
    if (num === 0) {
      handleCancel()
    } else {
      this.setState({
        errorMsg: msg || ''
      })
      onShow()
    }
  }
  getSelectedRow = (selectedRowKeys:any, selectedRows: any) => { // 当多选框被选中时， 将数据放在state上
    this.setState({
      idList: selectedRowKeys,
      selectedRows,
      selectedRowKeys: selectedRows
    })
  }
  // 删除提示框
  onDeleteModal = (id: any) => {
    const { onShow } = this.BasicModal.current as BasicModal
    this.setState({
      idList: [id]
    })
    onShow()
  }
  // 确认删除
  handleOk = () => {
    const { idList, selectedRows } = this.state
    const { handleCancel } = this.BasicModal.current as BasicModal
    this.axios.request(this.api.SalaryDeleteInfo, { idList }).then(({ code }) => {
      if (code === 200) {
        this.tableRef.current!.deletedAndUpdateTableData()
        this.setState({
          selectedRows: []
        })
      }
    })
    handleCancel()
  }
  handleCancel = () => {
    const { handleCancel } = this.BasicModal.current as BasicModal
    handleCancel()
  }

  deletedsBtn = (id?: any) => {
    const { onShow } = this.BasicModal.current as BasicModal
    const { selectedRows, salaryList, idList } = this.state
    if (!salaryList.length) {
      return this.$message.warn('没有可删除数据')
    }
    if (!selectedRows.length && typeof id !== 'number') {
      return this.$message.warn('请选择员工')
    }
    if (typeof id === 'number') {
      this.setState({
        idList: [id]
      })
      onShow()
    } else if (idList.length) {
      onShow()
    }
  }
  // 姓名校验
    validateName = (rules: any, value: any, callback: any) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (value && !reg.test(value)) {
        callback(new Error('请输入中英文 长度在15位之内'))
      }
      callback()
    }
  // 跳转至薪酬凭证详情
  handlerCheckout = (salaryVoucherId: any) => {
    this.props.history.push(`/home/salaryprePage/salaryDetail?salaryVoucherId=${salaryVoucherId}`)
  }
  placeholderChange = (val:string) => {
    this.setState({
      placeholderText: val
    })
  }
  render () {
    const {
      state: { salaryList, searchParams, organizeList, isVisible, type, dateDay, placeholderText },
      props: { form: { getFieldDecorator } }
    } = this
    const [, adde, addq, edit, det, del, dels, imp, exp, down] = this.AuthorityList.salarypreparation
    let columnData = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 60 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
      { title: '法人主体', dataIndex: 'entity', width: 150 },
      { title: '组织', dataIndex: 'organize', width: 150 },
      { title: '职位', dataIndex: 'position', width: 100 },
      { title: '职级', dataIndex: 'rankValue', width: 100 },
      { title: '序列', dataIndex: 'sequenceValue', width: 100 },
      { title: '职等', dataIndex: 'officialRankValue', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'entryTime',
        width: 100,
        render: (text:string) => (<span>{text || '- - -'}</span>),
        sorter: (a:any, b:any) => Date.parse(a.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTime.replace('-', '/').replace('-', '/'))
      },
      {
        title: '离职日期',
        dataIndex: 'quitTime',
        width: 100,
        sorter: (a:any, b:any) => Date.parse(a.quitTime.replace('-', '/').replace('-', '/')) - Date.parse(b.quitTime.replace('-', '/').replace('-', '/')),
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      { title: '月度', dataIndex: 'month', width: 100 },
      { title: '姓名', dataIndex: 'userName', width: 100 },
      {
        title: '在职状态',
        dataIndex: 'workCondition',
        width: 80
      },
      { title: '身份证号码', dataIndex: 'idCard', width: 100 },
      { title: '绩效工资系数', dataIndex: 'performWages', width: 100 },
      { title: '病假扣款手动调整', dataIndex: 'sickAdjust', width: 120 },
      { title: '产假类扣款手动调整', dataIndex: 'maternityAdjust', width: 130 },
      { title: '招聘提成', dataIndex: 'recruitCommission', width: 80 },
      { title: '销售提成', dataIndex: 'salesCommission', width: 80 },
      { title: '运输提成', dataIndex: 'transportCommission', width: 80 },
      { title: '其他提成', dataIndex: 'otherCommission', width: 80 },
      { title: '高温补贴', dataIndex: 'heatSubsidy', width: 80 },
      { title: '电脑补贴', dataIndex: 'computerSubsidy', width: 80 },
      { title: '通讯补贴', dataIndex: 'communicateSubsidy', width: 80 },
      { title: '冷藏/冷冻补贴', dataIndex: 'refrigerateSubsidy', width: 120 },
      { title: '工龄补贴', dataIndex: 'senioritySubsidy', width: 80 },
      { title: '燃油补贴', dataIndex: 'fuelSubsidy', width: 80 },
      { title: '其他补贴', dataIndex: 'otherSubsidy', width: 80 },
      { title: '单项奖', dataIndex: 'singleBonus', width: 80 },
      { title: '内推奖金', dataIndex: 'recommendBonus', width: 80 },
      { title: '全勤奖', dataIndex: 'fullBonus', width: 80 },
      { title: '出勤奖金', dataIndex: 'attendanceBonus', width: 80 },
      { title: '其他奖金', dataIndex: 'otherBonus', width: 80 },
      { title: '考勤扣款', dataIndex: 'attendDeduct', width: 80 },
      { title: '行政扣款', dataIndex: 'adminEdeduct', width: 80 },
      { title: '住宿扣款', dataIndex: 'accommodateEdeduct', width: 80 },
      { title: '其他扣款', dataIndex: 'otherEdeduct', width: 80 },
      { title: '税前补发', dataIndex: 'beforeReissue', width: 80 },
      { title: '税后补发', dataIndex: 'afterReissue', width: 80 },
      { title: '税前补扣', dataIndex: 'beforeEdeduct', width: 80 },
      { title: '税后补扣', dataIndex: 'afterEdeduct', width: 80 },
      { title: '离职补偿金', dataIndex: 'quitCompensate', width: 100 },
      { title: '年终奖', dataIndex: 'yearEndBonus', width: 80 },
      { title: '13薪', dataIndex: 'thirteenSalary', width: 80 },
      { title: '春节留人方案', dataIndex: 'newYearRetention', width: 100 },
      { title: '其他奖金1', dataIndex: 'otherBonusFirst', width: 100 },
      { title: '操作',
        align: 'center',
        fixed: 'right',
        render: (text: any, records: any) => {
          return <div style={{ color: '#40A9FF', cursor: 'pointer' }}>
            {this.isAuthenticated(det) && <span style={{ marginRight: '10px' }} onClick={() => this.handlerCheckout(records.salaryVoucherId)}>查看</span>}
            {this.isAuthenticated(del) && <span onClick={() => this.deletedsBtn(records.salaryVoucherId)}>删除</span>}
          </div>
        }
      }
    ]
    const rowSelection = {
      onChange: () => {},
      getCheckboxProps: () => ({
        checked: searchParams.length
      })
    }
    return (
      <div id="Scheduling">
        <Form className="FormContanier">
          <Row>
            <Col>
              <Item>
                {getFieldDecorator('projectName', {
                  initialValue: searchParams.projectName || '管理编号'
                })(
                  <Select onChange={this.placeholderChange} placeholder="请选择工号" style={{ width: '120px', borderRadius: '5px' }}>
                    <Option value="工号">工号</Option>
                    <Option value="管理编号">管理编号</Option>
                  </Select>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ marginRight: '35px' }}>
              <Item>
                {getFieldDecorator('sjNumbers', {
                  initialValue: searchParams.sjNumber,
                  rules: [{
                    required: false,
                    pattern: new RegExp(/^([a-zA-Z_]|[0-9]){1,14}$/, 'g'),
                    message: '请输入字母或数字 长度在14位之内'
                  }]
                })(
                  <Input placeholder={`请输入${placeholderText}`} className='input-220' allowClear />
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {getFieldDecorator('usersName', {
                  initialValue: searchParams.userName,
                  rules: [
                    {
                      validator: this.validateName
                    }
                  ]
                })(
                  <Input placeholder="请输入姓名" allowClear style={{ width: '220px' }} maxLength={15}/>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {getFieldDecorator('organizeArrs', { initialValue: searchParams.organizeArr })(
                  <SharedStructure type="string" multiple width="220px" />
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item label='月度'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}>
                {getFieldDecorator('months', {
                  initialValue: moment().month(moment().month() - 1).startOf('month') || moment(searchParams.month, 'YYYY-MM')
                })(
                  <MonthPicker
                    disabledDate={(current: any) => current && current > moment().endOf('day')}
                    format='YYYY年MM月'
                    allowClear={false}
                    suffixIcon={(<img src={ date }/>)}
                  />
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                <Button className="search" onClick={this.searchData}>搜索</Button>
              </Item>
            </Col>
          </Row>
        </Form>
        <Form className="Form_2Container">
          <Row>
            <Col>
              <Item>
                {
                  this.isAuthenticated(adde) &&
                <Button type="primary" onClick={ () => this.showModal(1)}>
                  <Icon component={IconTj} /><span style={{ marginLeft: '3px' }}>新增(在职)</span>
                </Button>
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {
                  this.isAuthenticated(addq) &&
                    <Button type="primary" onClick={ () => this.showModal(2)}>
                      <Icon component={IconTj} /><span style={{ marginLeft: '3px' }}>新增(离职)</span>
                    </Button>
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {
                  this.isAuthenticated(dels) &&
                    <Button type="primary" onClick={() => this.deletedsBtn()}>
                      <Icon component={IconSc}/><span style={{ marginLeft: '3px' }}>批量删除</span>
                    </Button>
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {
                  this.isAuthenticated(imp) &&
                <FileUpload params={{ organizeList }} action={this.api.importSalaryVoucherInfo.path}>
                  <Button type="primary">
                    <Icon component={IconDr}/><span style={{ marginLeft: '3px' }}>导入</span>
                  </Button>
                </FileUpload>
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {
                  this.isAuthenticated(exp) &&
                  <BasicDowload action={this.api.SalaryExportList}
                    parmsData={{ ...searchParams, type }} fileName="薪资凭证维护导出" dowloadURL="URL"
                    btntype="primary">
                    <Icon component={IconDc}/><span style={{ marginLeft: '3px' }}>导出</span>
                  </BasicDowload>
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Item>
                {
                  this.isAuthenticated(down) &&
                  <BasicDowload action={this.api.SalaryExportMaintainInfoTem}
                    parmsData={{ type: '.xlsx' }} fileName="薪资凭证维护导入模板"
                    btntype="primary">
                    <Icon component={IconXz}/><span style={{ marginLeft: '3px' }}>下载导入模版</span>
                  </BasicDowload>
                }
              </Item>
            </Col>
          </Row>
        </Form>
        {/* 确认弹出框 */}
        <BasicModal ref={this.BasicModal} title="提示">
          <p className="delete-p"><span>确认删除？</span></p>
          <Row>
            <Button onClick = { () => this.handleOk()} type="primary">确定</Button>
            <Button onClick={() => (this.handleModal(0))} type="primary">取消</Button>
          </Row>
        </BasicModal>
        <TableItem
          ref = {this.tableRef}
          rowSelectionFixed
          filterKey="salaryVoucherId"
          rowSelection={rowSelection}
          rowKey={({ salaryVoucherId }) => salaryVoucherId}
          URL={this.api.SalaryList}
          searchParams={searchParams}
          getSelectedRow={this.getSelectedRow}
          columns={columnData}
          getSalaryList={this.getSalaryList}
          scroll={{ x: 4200 }}
          bufferSearchParamsKey='salarypreparation_searchParams'
        />
        <SharedSelectEmployees {...this.props} visible={isVisible} closeDialog={this.closeDialog} type={ type } />
      </div>
    )
  }
}
export default Form.create<FormItemProps>()(SchedulingPage)
