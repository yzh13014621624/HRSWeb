/*
 * @description: 薪资归档主页面
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-19 15:50:07
 * @LastEditTime: 2020-05-20 10:06:07
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload } from '@components/index'
import { Button, Form, Row, Input } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { HttpUtil } from '@utils/index'
import './index.styl'
const { Item } = Form

// 税后
const columnData23 = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '项目', dataIndex: 'projectName', width: 80 },
  { title: '工号', dataIndex: 'projectNumber', width: 100 },
  { title: '管理编号', dataIndex: 'sjNumber', width: 100 },
  { title: '姓名', dataIndex: 'userName', width: 80 },
  { title: '法人主体', dataIndex: 'entity', width: 100 },
  { title: '组织', dataIndex: 'organize', width: 180 },
  { title: '职位', dataIndex: 'position', width: 80 },
  { title: '等级', dataIndex: 'levelId', width: 80 },
  { title: '档级', dataIndex: 'gradeId', width: 80 },
  { title: '层级', dataIndex: 'rankId', width: 80 },
  { title: '入职日期', dataIndex: 'entryTime', width: 100 },
  { title: '离职日期', dataIndex: 'quitTime', width: 100 },
  { title: '在职状态', dataIndex: 'workCondition', width: 100 },
  { title: '计薪类型', dataIndex: 'salaryType', width: 100 },
  { title: '员工类型', dataIndex: 'roleType', width: 100 },
  { title: '合同类型', dataIndex: 'type', width: 100 },
  { title: '工时类型', dataIndex: 'hourType', width: 100 },
  { title: '计税类型', dataIndex: 'taxationType', width: 100 },
  { title: '身份证号码', dataIndex: 'idCard', width: 100 },
  { title: '出生日期', dataIndex: 'birth', width: 100 },
  { title: '手机号码', dataIndex: 'contactWay', width: 100 },
  { title: '银行卡号', dataIndex: 'bankCard', width: 100 },
  { title: '额定出勤天数', dataIndex: 'ratedAttend', width: 120 },
  { title: '实际出勤天数', dataIndex: 'realAttend', width: 120 },
  { title: '有效出勤天数', dataIndex: 'monthValidAttend', width: 120 },
  { title: '本月实际试用期基本工资', dataIndex: 'realProbationPay', width: 160 },
  { title: '本月实际基本工资', dataIndex: 'realBaseSalary', width: 130 },
  { title: '本月基本工资合计', dataIndex: 'baseSalarySum', width: 130 },
  { title: '绩效工资系数', dataIndex: 'performWages', width: 120 },
  { title: '本月实际试用期绩效工资', dataIndex: 'realProbationPerPay', width: 160 },
  { title: '本月实际绩效工资', dataIndex: 'realPerformancePay', width: 130 },
  { title: '本月绩效工资合计', dataIndex: 'realPerformancePaySum', width: 130 },
  { title: '本月绩效奖金', dataIndex: 'performanceBonus', width: 120 },
  { title: '本月其他工资', dataIndex: 'otherSalary', width: 120 },
  { title: '本月固定薪资合计', dataIndex: 'fixedSlarySum', width: 130 },
  { title: '本月法定假加班工资', dataIndex: 'holidayOperateSalary', width: 150 },
  { title: '服务年限', dataIndex: 'serviceTime', width: 100 },
  { title: '事假扣款', dataIndex: 'thingDeduct', width: 100 },
  { title: '病假扣款', dataIndex: 'sickDeduct', width: 100 },
  { title: '产假扣款', dataIndex: 'maternityDeduct', width: 100 },
  { title: '旷工扣款', dataIndex: 'absentDeduct', width: 100 },
  { title: '考勤扣款合计', dataIndex: 'attendDeductSum', width: 120 },
  { title: '餐费补贴', dataIndex: 'mealSubsidy', width: 100 },
  { title: '住宿补贴', dataIndex: 'roomSubsidy', width: 100 },
  { title: '叉车补贴', dataIndex: 'forkliftSubsidy', width: 100 },
  { title: '高温补贴', dataIndex: 'heatSubsidy', width: 100 },
  { title: '电脑补贴', dataIndex: 'computerSubsidy', width: 100 },
  { title: '岗位津贴', dataIndex: 'postSalary', width: 100 },
  { title: '燃油补贴', dataIndex: 'fuelSubsidy', width: 100 },
  { title: '工龄补贴', dataIndex: 'senioritySubsidy', width: 100 },
  { title: '冷藏/冷冻补贴', dataIndex: 'refrigerateSubsidy', width: 120 },
  { title: '通讯补贴', dataIndex: 'communicateSubsidy', width: 100 },
  { title: '其他补贴', dataIndex: 'otherSubsidy', width: 100 },
  { title: '各类补贴合计', dataIndex: 'subsidySum', width: 120 },
  { title: '销售提成', dataIndex: 'salesCommission', width: 100 },
  { title: '内推奖金', dataIndex: 'recommendBonus', width: 100 },
  { title: '运输提成', dataIndex: 'transportCommission', width: 100 },
  { title: '招聘提成', dataIndex: 'recruitCommission', width: 100 },
  { title: '其他提成', dataIndex: 'otherCommission', width: 100 },
  { title: '单项奖', dataIndex: 'singleBonus', width: 100 },
  { title: '考勤扣款', dataIndex: 'attendDeduct', width: 100 },
  { title: '行政扣款', dataIndex: 'admindeduct', width: 100 },
  { title: '全勤奖金', dataIndex: 'fullBonus', width: 100 },
  { title: '出勤奖金', dataIndex: 'attendanceBonus', width: 100 },
  { title: '旷工罚款', dataIndex: 'absentForfeit', width: 100 },
  { title: '其他奖金', dataIndex: 'otherBonus', width: 100 },
  { title: '其他扣款', dataIndex: 'otherdeduct', width: 100 },
  { title: '各类奖惩合计', dataIndex: 'rewardAndPunishSum', width: 120 },
  { title: '计件收入', dataIndex: 'pvIncomeTotal', width: 100 },
  { title: '非计件收入', dataIndex: 'pvNoIncomeTotal', width: 110 },
  { title: '实际计件类收入合计', dataIndex: 'pvTotal', width: 160 },
  { title: '计件奖金', dataIndex: 'pvBonusTotal', width: 100 },
  { title: '最低工资补足', dataIndex: 'minWageSupplement', width: 120 },
  { title: '税前补发', dataIndex: 'beforeReissue', width: 100 },
  { title: '税前补扣', dataIndex: 'beforededuct', width: 100 },
  { title: '税前调整合计', dataIndex: 'adjustBeforeSum', width: 130 },
  { title: '税前工资合计', dataIndex: 'salaryBeforeSum', width: 130 },
  { title: '养老险-个人', dataIndex: 'pensionPersonal', width: 120 },
  { title: '养老险补缴-个人', dataIndex: 'pensionPersonalAdd', width: 140 },
  { title: '养老保险个人小计', dataIndex: 'pensionPersonSum', width: 150 },
  { title: '医疗险-个人', dataIndex: 'medicalPersonal', width: 120 },
  { title: '医疗险补缴-个人', dataIndex: 'medicalPersonalAdd', width: 150 },
  { title: '医疗保险个人小计', dataIndex: 'medicalPersonSum', width: 160 },
  { title: '失业险-个人', dataIndex: 'unemploymentPersonal', width: 120 },
  { title: '失业险补缴-个人', dataIndex: 'unemploymentPersonalAdd', width: 160 },
  { title: '失业保险个人小计', dataIndex: 'unemploymentPersonSum', width: 160 },
  { title: '补充医疗险-个人', dataIndex: 'supplementPersonal', width: 160 },
  { title: '补充医疗险补缴-个人', dataIndex: 'supplementPersonalAdd', width: 160 },
  { title: '补充医疗保险个人小计', dataIndex: 'supplementPersonSum', width: 160 },
  { title: '大病医疗险-个人', dataIndex: 'seriousillnessPersonal', width: 150 },
  { title: '大病医疗险补缴-个人', dataIndex: 'seriousillnessPersonalAdd', width: 180 },
  { title: '大病医疗保险个人小计', dataIndex: 'seriousillnessPersonalSum', width: 190 },
  { title: '医疗类保险个人小计', dataIndex: 'medicalSum', width: 180 },
  { title: '社保合计-个人', dataIndex: 'socialSecuritySum', width: 140 },
  { title: '公积金-个人', dataIndex: 'housePersonal', width: 130 },
  { title: '公积金补缴-个人', dataIndex: 'housePersonalAdd', width: 160 },
  { title: '公积金合计-个人', dataIndex: 'housePersonalSum', width: 180 },
  { title: '社保公积金合计-个人', dataIndex: 'socialHouseSum', width: 180 },
  { title: '非居民所得税/劳务税', dataIndex: 'noResidentIncomeTax', width: 180 },
  { title: '居民劳务税', dataIndex: 'residentServiceTax', width: 100 },
  { title: '工资个税合计', dataIndex: 'salaryPersonTaxSum', width: 120 },
  { title: '实发薪资小计', dataIndex: 'realSalarySum', width: 120 },
  { title: '年终奖', dataIndex: 'yearEndBonus', width: 100 },
  { title: '13薪酬', dataIndex: 'thirteenSalary', width: 100 },
  { title: '春节留人计划', dataIndex: 'newYearRetention', width: 120 },
  { title: '其他奖金1', dataIndex: 'otherBonusFirst', width: 100 },
  { title: '一年一次优惠奖金合计', dataIndex: 'preferentialBonusTotal', width: 180 },
  { title: '奖金税', dataIndex: 'bonusTax', width: 100 },
  { title: '离职补偿金', dataIndex: 'quitCompensate', width: 120 },
  { title: '实发年终奖合计', dataIndex: 'realBonusSum', width: 150 },
  { title: '税后补发', dataIndex: 'afterReissue', width: 100 },
  { title: '税后补扣', dataIndex: 'afterEdeduct', width: 100 },
  { title: '住宿扣款', dataIndex: 'accommodateEdeduct', width: 100 },
  { title: '工会费', dataIndex: 'unionFee', width: 100 },
  { title: '税后项目合计', dataIndex: 'postTaxProjectSum', width: 140 },
  { title: '养老险-公司', dataIndex: 'pensionCompany', width: 140 },
  { title: '养老险补缴-公司', dataIndex: 'pensionCompanyAdd', width: 150 },
  { title: '医疗险-公司', dataIndex: 'medicalCompany', width: 130 },
  { title: '医疗险补缴-公司', dataIndex: 'medicalCompanyAdd', width: 130 },
  { title: '失业险-公司', dataIndex: 'unemploymentCompany', width: 120 },
  { title: '失业险补缴-公司', dataIndex: 'unemploymentCompanyAdd', width: 150 },
  { title: '生育险-公司', dataIndex: 'fertilityCompany', width: 130 },
  { title: '生育险补缴-公司', dataIndex: 'fertilityCompanyAdd', width: 150 },
  { title: '工伤险-公司', dataIndex: 'workhurtCompany', width: 120 },
  { title: '工伤险补缴-公司', dataIndex: 'workhurtCompanyAdd', width: 130 },
  { title: '补充医疗险-公司', dataIndex: 'supplementCompany', width: 130 },
  { title: '补充医疗险补缴-公司', dataIndex: 'supplementCompanyAdd', width: 160 },
  { title: '大病医疗险-公司', dataIndex: 'seriousillnessCompany', width: 150 },
  { title: '大病医疗险补缴-公司', dataIndex: 'seriousillnessCompanyAdd', width: 160 },
  { title: '残保金-公司', dataIndex: 'residualPremiumCompany', width: 130 },
  { title: '社保合计-公司', dataIndex: 'socialCompanySum', width: 130 },
  { title: '公积金-公司', dataIndex: 'houseCompany', width: 120 },
  { title: '公积金补缴-公司', dataIndex: 'houseCompanyAdd', width: 140 },
  { title: '公积金合计-公司', dataIndex: 'houseCompanySum', width: 140 },
  { title: '社保公积金合计-公司', dataIndex: 'socialHouseCompanySum', width: 160 },
  { title: '雇主责任险', dataIndex: 'liabilityInsurance', width: 100 },
  { title: '管理费', dataIndex: 'manageFee', width: 100 },
  { title: '人力成本', dataIndex: 'humanCost', width: 100 },
  { title: '最终实发', dataIndex: 'finalGrant' }
]
// 个税核算
const columnData22 = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '管理编号', dataIndex: 'sjNumber', width: 130 },
  { title: '月度', dataIndex: 'monthlyTime', width: 80 },
  { title: '法人主体', dataIndex: 'entity', width: 180 },
  { title: '姓名', dataIndex: 'userName', width: 80 },
  { title: '组织', dataIndex: 'organize', width: 180 },
  { title: '身份证号码', dataIndex: 'idCard', width: 150 },
  { title: '手机号码', dataIndex: 'contactWay', width: 130 },
  { title: '员工类型', dataIndex: 'roleType', width: 90 },
  { title: '合同类型', dataIndex: 'typeName', width: 140 },
  { title: '税前工资合计', dataIndex: 'beforeSalarySum', width: 120 },
  { title: '养老保险个人小计', dataIndex: 'pensionPersonSum', width: 130 },
  { title: '医疗类保险个人小计', dataIndex: 'medicalPersonSum', width: 150 },
  { title: '失业保险个人小计', dataIndex: 'unemploymentPersonSum', width: 130 },
  { title: '公积金总计-个人', dataIndex: 'housePersonalSum', width: 120 },
  { title: '居民所得税', dataIndex: 'residentIncomeTax', width: 110 },
  { title: '非居民所得税', dataIndex: 'noResidentIncomeTax', width: 120 },
  { title: '劳务税', dataIndex: 'serviceTax', width: 80 },
  { title: '非居民劳务税', dataIndex: 'noServiceTax', width: 120 },
  { title: '一年一次优惠奖金合计', dataIndex: 'preferentialBonusTotal', width: 180 },
  { title: '奖金税', dataIndex: 'bonusTax', width: 100 },
  { title: '离职补偿金', dataIndex: 'quitCompensate', width: 110 },
  { title: '所有个税合计', dataIndex: 'incomeTaxTotal', width: 120 }
]
// 税前人员信息表
const columnData20 = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '姓名', dataIndex: 'name', width: 80 },
  { title: '手机号码', dataIndex: 'phoneNumber', width: 120 },
  { title: '人员地区', dataIndex: 'personnelArea', width: 100 },
  { title: '国籍(地区)', dataIndex: 'nationality', width: 100 },
  { title: '证照类型', dataIndex: 'idType', width: 140 },
  { title: '证件号', dataIndex: 'idNumber', width: 180 },
  { title: '出生日期', dataIndex: 'birth', width: 110 },
  { title: '性别', dataIndex: 'sex', width: 80 },
  { title: '入职日期', dataIndex: 'entryTime', width: 100 },
  { title: '扣缴义务人', dataIndex: 'withholdingAgent', width: 230 },
  { title: '人员状态', dataIndex: 'staffStatus', width: 100 },
  { title: '是否雇员', dataIndex: 'haveEmployee', width: 100 },
  { title: '涉税事项', dataIndex: 'taxMatters', width: 100 },
  { title: '申报部门编号', dataIndex: 'departmentNumber', width: 100 },
  { title: '员工邮箱', dataIndex: 'emile', width: 100 },
  { title: '工号', dataIndex: 'jobNumber', width: 100 },
  { title: '部门', dataIndex: 'department', width: 100 },
  { title: '职位', dataIndex: 'jobName', width: 100 },
  { title: '职级', dataIndex: 'rank', width: 100 },
  { title: '离职时间', dataIndex: 'departureTime', width: 100 },
  { title: '个人邮箱', dataIndex: 'personalEmail', width: 100 },
  { title: '民族', dataIndex: 'nation', width: 100 },
  { title: '纳税人识别号', dataIndex: 'taxIdentificationNumber', width: 100 },
  { title: '学历', dataIndex: 'educationBackground', width: 100 },
  { title: '职业', dataIndex: 'profession', width: 100 },
  { title: '户籍所在地(省)', dataIndex: 'province', width: 140 },
  { title: '户籍所在地(市)', dataIndex: 'city', width: 140 },
  { title: '户籍所在地(区县)', dataIndex: 'area', width: 150 },
  { title: '户籍所在地(详情)', dataIndex: 'addressInfo', width: 150 },
  { title: '经常居住地(省)', dataIndex: 'permanentProvince', width: 140 },
  { title: '经常居住地(市)', dataIndex: 'permanentCity', width: 140 },
  { title: '经常居住地(区县)', dataIndex: 'permanentArea', width: 150 },
  { title: '经常居住地(详情)', dataIndex: 'permanentAddressInfo', width: 150 },
  { title: '联系地址(省)', dataIndex: 'contactProvince', width: 140 },
  { title: '联系地址(市)', dataIndex: 'contactCity', width: 140 },
  { title: '联系地址(区县)', dataIndex: 'contactArea', width: 150 },
  { title: '联系地址(详情)', dataIndex: 'contactAddressInfo', width: 150 },
  { title: '是否伤残', dataIndex: 'isDisabled', width: 100 },
  { title: '残疾证号', dataIndex: 'disabledNumber', width: 100 },
  { title: '是否烈属', dataIndex: 'isHeroicFamily', width: 100 },
  { title: '烈属证号', dataIndex: 'heroicNumber', width: 100 },
  { title: '是否孤老', dataIndex: 'isDieAlone', width: 100 },
  { title: '备注', dataIndex: 'remark' }
]
// 税前人员工资表
const columnData21 = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '管理编号', dataIndex: 'sjNumber', width: 120 },
  { title: '法人主体', dataIndex: 'legalPerson', width: 100 },
  { title: '姓名', dataIndex: 'name', width: 80 },
  { title: '组织', dataIndex: 'organization', width: 190 },
  { title: '身份证号码', dataIndex: 'idCardNumber', width: 160 },
  { title: '手机号码', dataIndex: 'phoneNumber', width: 130 },
  { title: '税前工资合计', dataIndex: 'totalWages', width: 160 },
  { title: '养老保险个人小计', dataIndex: 'endowmentInsurance', width: 170 },
  { title: '医疗类保险个人小计', dataIndex: 'medicalInsurance', width: 180 },
  { title: '失业保险个人小计', dataIndex: 'unemploymentInsurance', width: 170 },
  { title: '公积金总计-个人', dataIndex: 'accumulationFund', width: 170 },
  { title: '一年一次优惠奖金合计', dataIndex: 'oneYearBonus', width: 190 },
  { title: '奖金税', dataIndex: 'bonusTax', width: 100 },
  { title: '实发年终奖小计', dataIndex: 'yearEndBonus', width: 170 },
  { title: '离职补偿金', dataIndex: 'separationAllowance', width: 150 },
  { title: '离职补偿金个税', dataIndex: 'compensationIncomeTax', width: 170 },
  { title: '实发离职补偿金', dataIndex: 'actualAmount' }
]

interface State {
  scrollX: number
  column: KeyValue[]
  searchParams: KeyValue
}

interface SalaryprefiledetailProps extends BaseProps, FormComponentProps {}

class Salaryprefiledetail extends RootComponent<SalaryprefiledetailProps, State> {
  necessary: KeyValue = HttpUtil.parseUrl(this.props.location.search)
  constructor (props: SalaryprefiledetailProps) {
    super(props)
    this.state = {
      scrollX: 0, // 存放表单的scroll值
      column: [],
      searchParams: {}
    }
  }

  UNSAFE_componentWillMount = () => {
    const { type, month, saId } = this.necessary
    let column: KeyValue[] = []
    if (type === '20') {
      column = columnData20
      this.setState({
        scrollX: 5150
      })
    } else if (type === '21') {
      column = columnData21
      this.setState({
        scrollX: 2700
      })
    } else if (type === '22') {
      column = columnData22
      this.setState({
        scrollX: 2700
      })
    } else if (type === '23') {
      column = columnData23
      this.setState({
        scrollX: 16900
      })
    }
    this.setState({
      column,
      searchParams: {
        type: Number(type),
        month,
        saId: Number(saId) > 0 ? Number(saId) : 0
      }
    })
  }

  // 搜索按钮
  searchBtn = () => {
    const { searchParams } = this.state
    const lable = this.props.form.getFieldValue('lable')
    this.setState({
      searchParams: { ...searchParams, lable }
    })
  }

  // 返回
  cancel = () => {
    this.props.history.push('/home/salaryprefile')
  }

  render () {
    const {
      state: { column, searchParams, scrollX },
      props: { form: { getFieldDecorator } },
      necessary: { fileName, type, archiveId }
    } = this
    return (
      <div id='salaryprefiledetail'>
        <Row className='salaryprefiledetail-head'>{fileName}</Row>
        <Row className='salaryprefiledetail-search'>
          <Form layout='inline'>
            <Item>
              {getFieldDecorator('lable', {
                rules: [
                  {
                    message: '请输入英文、数字或中文',
                    pattern: new RegExp(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/)
                  }
                ]
              })(<Input maxLength={15} allowClear placeholder='请输入管理编号/姓名'/>)}
            </Item>
            <Item>
              <Button type='primary' onClick={this.searchBtn}>搜索</Button>
            </Item>
          </Form>
        </Row>
        <Row className='salaryprefiledetail-content'>
          <TableItem
            rowSelection = {false}
            filterKey="_id"
            rowKey={({ _id }) => _id}
            URL={this.api.GetArchiveInfo}
            searchParams={ searchParams }
            columns={column}
            scroll={{ x: scrollX }}
          />
        </Row>
        <Row className='salaryprefiledetail-footer'>
          <BasicDowload
            action={this.api.SalaryFileExportArchiveList}
            parmsData={{ archiveId }}
            fileName={fileName}
            isLoadeTime={true} // 是否下文件名后面加时间
            type="default"
            dowloadURL="URL"
            btntype='primary'
            className="confirm-btn"
          >
            下载Excel文件
          </BasicDowload>
          <Button className='cancel-btn' onClick={this.cancel}>返 回</Button>
        </Row>
      </div>
    )
  }
}
export default Form.create<SalaryprefiledetailProps>()(Salaryprefiledetail)
