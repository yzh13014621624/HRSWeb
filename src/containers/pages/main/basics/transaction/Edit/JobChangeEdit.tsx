/*
 * @description: 基本信息 - 异动 - 编辑和详情 模块
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-03 15:23:05
 * @LastEditTime: 2020-05-27 17:15:07
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from 'rootComponent'
import { BasicModal, BasicUploadJob } from '@components/index'
import moment from 'moment'
import { Card, Row, Button, Form, Input, Select, DatePicker } from 'antd'
import { salaryCategory } from '../Enum'
import { hot } from 'react-hot-loader'
import SearchInput from '@shared/SearchInput/index'

import { SysUtil, FormatInputValue } from '@utils/index'

import Organization from '@shared/organization/Organization'

import '../style/JobChangeAdd'

import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
interface JobChangeProps extends FormComponentProps, BaseProps {
  getFieldsValue: (data: KeyValue) => void
}
interface SelectOptions {
  currentStaffInfo: KeyValue
  legalEntityList: KeyValue[]
  organizeList: KeyValue[]
  postList: KeyValue[]
  levelList: KeyValue[] // 等级列表
  gradeList: KeyValue[] // 档级列表
  rankList: KeyValue[] // 层级列表
}
interface State extends SelectOptions {
  originStaffInfo: KeyValue
  disabled: boolean
  btnFont: string
}

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(2)
}

class FormComponent extends RootComponent<JobChangeProps, State> {
  modal = React.createRef<BasicModal>()
  timerId: any = null
  isSjProject: boolean = true

  constructor (props: JobChangeProps) {
    super(props)
    this.state = {
      originStaffInfo: {},
      currentStaffInfo: {},
      legalEntityList: [], // 法人主体列表
      organizeList: [], // 组织列表
      postList: [], // 职位列表
      levelList: [],
      gradeList: [],
      rankList: [],
      disabled: true,
      btnFont: '上传异动相关证明图片'
    }
  }

  componentDidMount () {
    this.getJobChangeBeforeStaffInfo()
  }

  getJobChangeBeforeStaffInfo () {
    const { id } = SysUtil.getSessionStorage('JobChangeEdit')
    const { jobChangeBeforeInfo } = this.api
    this.axios.request(jobChangeBeforeInfo, { id }).then(async ({ data }: KeyValue) => {
      const { entityList, projectList, userInfo, changesInfo } = data
      const list = data.levelList
      let commonOrganize = SysUtil.getSessionStorage('commonOrganize')
      let organizeList:any = []
      if (userInfo.projectId) {
        organizeList = [commonOrganize.find((el:any) => el.organize.includes(userInfo.projectName))]
      }
      const {
        id,
        entityId, organize, positionId, levelId, gradeId, rankId,
        baseSalary, performanceSalary, probationBaseSalary, probationPerSalary,
        performanceBonus, hierarchySalary,
        transactionDate, images,
        contractBaseSalary, contractProBaseSalary,
        salaryType, otherSalary, mealStandard, roomStandard, forkliftStandard, unionFee, overtimeBase, postSalary, display, liabilityInsurance, manageFee,
        rank, sequence, officialRank
      } = changesInfo
      const currentStaffInfo = {
        id,
        legalEntity: entityId,
        organize,
        post: positionId,
        salaryType: salaryType || '1',
        levelId,
        gradeId,
        images,
        rankId,
        baseSalary,
        bonusSalary: performanceSalary,
        probationBaseSalary,
        performanceBonus,
        hierarchySalary,
        rank: rank || undefined,
        sequence: sequence || undefined,
        officialRank: officialRank || undefined,
        probationBonusSalary: probationPerSalary,
        effectDate: moment(transactionDate),
        otherSalary: otherSalary || '0.00',
        mealStandard: mealStandard || '0.00',
        roomStandard: roomStandard || '0.00',
        forkliftStandard: forkliftStandard || '0.00',
        unionFee: unionFee || '0.00',
        overtimeBase: overtimeBase || '0.00',
        postSalary: postSalary || '0.00',
        liabilityInsurance: liabilityInsurance || '0.00',
        manageFee: manageFee || '0.00',
        contractBaseSalary,
        contractProBaseSalary,
        display
      }
      this.isSjProject = userInfo.projectName === '上嘉'
      await this.setState({
        originStaffInfo: userInfo,
        currentStaffInfo,
        legalEntityList: entityList,
        postList: projectList,
        levelList: list['薪资等级'] || [],
        gradeList: list['薪资档级'] || [],
        rankList: list['薪资层级'] || [],
        organizeList: organizeList, // outArray(organizeList)
        btnFont: images.length > 0 ? '继续上传' : '上传异动相关证明图片'
      })
      this.getFieldsValue()
    })
  }

  transformInputValue = (value: string) => {
    return FormatInputValue.toFixed(value)
  }

  // 设定 button 按钮点击状态
  getFieldsValue = (t?:any, value?:any) => {
    let displayOnChange = 0
    if (this.timerId) clearTimeout(this.timerId)
    const { isSjProject } = this
    const { currentStaffInfo: { display }, originStaffInfo: { salaryProbation, type, roleType, projectName }, currentStaffInfo } = this.state
    this.timerId = setTimeout(() => {
      const { legalEntity, organize, baseSalary, overtimeBase, effectDate, contractProBaseSalary, contractBaseSalary, rank, sequence, officialRank } = this.props.form.getFieldsValue()
      let disabled = isSjProject ? !(legalEntity && organize && baseSalary && overtimeBase && effectDate && rank && sequence && officialRank) : !(legalEntity && organize && baseSalary && effectDate)
      if (type === 1 && roleType === '全职' && projectName === '上嘉' && (legalEntity === 1 || legalEntity === 2 || legalEntity === 3 || legalEntity === 21 || legalEntity === 33 || legalEntity === 34)) {
        displayOnChange = 1
      }
      this.setState({
        currentStaffInfo: Object.assign({}, this.state.currentStaffInfo, { display: displayOnChange })
      }, () => {
        if (display === 1 && !disabled) {
          if (salaryProbation !== '无试用期') {
            // 判断是否切换到六家公司内
            disabled = !((contractProBaseSalary || (typeof contractProBaseSalary !== 'string' && currentStaffInfo.contractProBaseSalary)) && (contractBaseSalary || (typeof contractBaseSalary !== 'string' && currentStaffInfo.contractBaseSalary)))
          } else {
            disabled = !(contractBaseSalary || (typeof contractBaseSalary !== 'string' && currentStaffInfo.contractBaseSalary))
          }
        }
        this.setState({ disabled })
      })
    }, 50)
    if (t === -1) {
      if (value && value.length > 0) {
        this.setState({
          btnFont: '继续上传'
        })
      } else {
        this.setState({
          btnFont: '上传异动相关证明图片'
        })
      }
    }
  }

  confirmAddNewStaff = (e: any) => {
    e.preventDefault()
    const { originStaffInfo, currentStaffInfo } = this.state
    const { projectName, userId, salaryProbation } = originStaffInfo
    const {
      legalEntity, organize, post, levelId, gradeId, rankId, baseSalary,
      bonusSalary, probationBaseSalary, probationBonusSalary, effectDate,
      performanceBonus, hierarchySalary, images,
      salaryType, otherSalary, mealStandard, roomStandard, forkliftStandard, unionFee, overtimeBase, postSalary, liabilityInsurance, manageFee,
      contractBaseSalary, contractProBaseSalary,
      rank, sequence, officialRank
    } = this.props.form.getFieldsValue()
    const transactionDate = moment(effectDate).format('YYYY-MM-DD')
    const [y, m, d] = transactionDate.split('-')
    if (Number(d) > 1) {
      this.$message.warn('异动日期仅能选择每月1日', 2)
      return
    }
    const params:any = {
      userId: originStaffInfo.userId,
      id: currentStaffInfo.id,
      entityId: legalEntity || null,
      organize,
      positionId: post || null,
      salaryType: +salaryType,
      levelId: levelId || null,
      gradeId: gradeId || null,
      rankId: rankId || null,
      rank: rank || null,
      sequence: sequence || null,
      officialRank: officialRank || null,
      images,
      contractBaseSalary: toFixed(contractBaseSalary),
      contractProBaseSalary: toFixed(contractProBaseSalary),
      baseSalary: toFixed(baseSalary),
      performanceSalary: toFixed(bonusSalary),
      probationBaseSalary: toFixed(probationBaseSalary),
      probationPerSalary: toFixed(probationBonusSalary),
      performanceBonus: toFixed(performanceBonus),
      hierarchySalary: toFixed(hierarchySalary),
      otherSalary: toFixed(otherSalary),
      mealStandard: toFixed(mealStandard),
      roomStandard: toFixed(roomStandard),
      forkliftStandard: toFixed(forkliftStandard),
      unionFee: toFixed(unionFee),
      overtimeBase: toFixed(overtimeBase),
      postSalary: toFixed(postSalary),
      liabilityInsurance: toFixed(liabilityInsurance),
      manageFee: toFixed(manageFee),
      transactionDate: transactionDate
    }
    let arr = [
      'baseSalary', 'entityId', 'gradeId', 'hierarchySalary',
      'levelId', 'organize', 'performanceBonus', 'performanceSalary',
      'positionId', 'probationBaseSalary', 'probationPerSalary', 'rankId',
      'salaryType', 'otherSalary', 'mealStandard', 'roomStandard', 'forkliftStandard', 'unionFee',
      'overtimeBase', 'postSalary', 'contractProBaseSalary', 'contractBaseSalary', 'manageFee', 'liabilityInsurance',
      'rank', 'sequence', 'officialRank'
    ]
    let num:number = 0
    arr.forEach((item:any) => {
      if (params[item] !== originStaffInfo[item]) {
        num++ // 有不相等的
      }
    })
    if (num === 0) {
      this.modal.current!.handleOk()
      return
    }
    for (const key of salaryCategory[projectName]) {
      delete params[key]
    }
    if (currentStaffInfo.display !== 1) {
      delete params['contractBaseSalary']
      delete params['contractProBaseSalary']
    }
    if (salaryProbation === '无试用期') {
      if (currentStaffInfo.display === 1) {
        delete params['contractProBaseSalary']
      }
      delete params['probationBaseSalary']
      delete params['probationPerSalary']
    }
    this.uploadImage(images, userId, (res:string) => {
      params.images = res
      // 提交发起请求
      this.axios.request(this.api.jobChangeEdit, params)
        .then(() => {
          SysUtil.clearSession('JobChangeEdit')
          this.$message.success('保存成功', 2)
          this.props.history.replace('/home/jobChange')
        })
        .catch(({ msg }) => {
          this.$message.error(msg[0])
        })
    })
  }
  /** 上传图片 */
  uploadImage = (fileList:any, id:number, callback:Function) => {
    let formData = new FormData()
    let imageAry:any = []
    const { jobChageUpload } = this.api
    // 创建对象的信息
    fileList.forEach((el:any) => {
      if (el['file']) {
        formData.append('file', el['file'], el['file'].name)
      } else if (el['imageUrl']) {
        imageAry.push(el['imageUrl'])
      }
    })
    formData.append('userId', id + '')
    this.axios.upload({
      method: 'post',
      url: jobChageUpload.path,
      data: formData
    }).then((res:any) => {
      const { code, data, msg } = res.data
      if (code === 200) {
        let obj = [...imageAry, ...data]
        callback(obj)
      } else {
        // 上传失败
        console.log(msg)
      }
    }).catch((err:any) => {
      console.log(err.msg[0])
    })
  }
  cancelAddNewStaff = () => {
    this.props.history.replace('/home/jobChange')
  }

  hideModal = () => {
    this.modal.current!.handleCancel()
  }

  // 职级的回调
  getRank = (v: any, i: any) => {
    const { props: { form: { setFieldsValue } } } = this
    setFieldsValue({
      sequence: undefined,
      officialRank: undefined
    })
  }

  // 序列的回调
  getSequence = () => {
    const { props: { form: { setFieldsValue } } } = this
    setFieldsValue({
      officialRank: undefined
    })
  }

  // 职等的回调
  getOfficialRank = () => {}

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const {
      originStaffInfo, currentStaffInfo, disabled, legalEntityList, organizeList, postList,
      levelList, gradeList, rankList, btnFont
    } = this.state
    const {
      legalEntity, organize, post, salaryType, levelId, gradeId, rankId,
      baseSalary, bonusSalary, probationBaseSalary, probationBonusSalary,
      performanceBonus, hierarchySalary, images,
      effectDate,
      otherSalary, mealStandard, roomStandard, forkliftStandard, unionFee, overtimeBase, postSalary, liabilityInsurance, manageFee,
      contractBaseSalary, contractProBaseSalary,
      display,
      rank, sequence, officialRank
    } = currentStaffInfo
    const {
      projectName, projectNumber, sjNumber, userName, entryTime, roleType
    } = originStaffInfo
    const isSjProject = projectName === '上嘉'
    const isHmProject = projectName === '盒马'
    const isWmProject = projectName === '物美'
    return (
      <Form layout="inline" onSubmit={this.confirmAddNewStaff}>
        <div className="edit_content">
          <Card style={{ width: '3.125rem' }}>
            <h2 className="card_title">
              <i className="icon"></i>
              异动前
            </h2>
            <Row>
              <label>项目:</label>
              <p className="txt">{projectName}</p>
            </Row>
            <Row>
              <label>工号:</label>
              <p className="txt">{projectNumber || '- - -'}</p>
            </Row>
            <Row>
              <label>管理编号:</label>
              <p className="txt">{sjNumber}</p>
            </Row>
            <Row>
              <label>姓名:</label>
              <p className="txt">{userName}</p>
            </Row>
            <Row>
              <label>入职日期:</label>
              <p className="txt">{entryTime}</p>
            </Row>
            <Row>
              <label>员工类型:</label>
              <p className="txt">{roleType}</p>
            </Row>
            <Row>
              <label>法人主体:</label>
              <p className="txt">{originStaffInfo.entity}</p>
            </Row>
            <Row>
              <label>组织:</label>
              <p className="txt">{originStaffInfo.organize}</p>
            </Row>
            {
              !isSjProject &&
              <Row>
                <label>职位:</label>
                <p className="txt">{originStaffInfo.position}</p>
              </Row>
            }
            {
              isSjProject &&
              <Row>
                <label>计薪类型:</label>
                <p className="txt">
                  {(originStaffInfo.salaryType && (originStaffInfo.salaryType === 1 ? '计薪制' : '计件制')) || '计薪制'}
                </p>
              </Row>
            }
            {
              isSjProject &&
              <Row>
                <label>薪资等级:</label>
                <p className="txt">{originStaffInfo.levelName}</p>
              </Row>
            }
            {
              isSjProject &&
              <Row>
                <label>薪资档级:</label>
                <p className="txt">{originStaffInfo.gradeName}</p>
              </Row>
            }
            {
              isHmProject &&
              <Row>
                <label>薪资层级:</label>
                <p className="txt">{originStaffInfo.rankName}</p>
              </Row>
            }
            <Row>
              <label>基本工资:</label>
              <p className="txt">{originStaffInfo.baseSalary}</p>
            </Row>
            {
              display === 1 && originStaffInfo.contractBaseSalary &&
              <Row>
                <label>合同基本工资:</label>
                <p className="txt">{originStaffInfo.contractBaseSalary || '0.00'}</p>
              </Row>
            }
            {
              (isSjProject || isHmProject) &&
              <Row>
                <label>绩效工资:</label>
                <p className="txt">{originStaffInfo.performanceSalary}</p>
              </Row>
            }
            {
              isHmProject &&
              <Row>
                <label>层级工资:</label>
                <p className="txt">{originStaffInfo.hierarchySalary}</p>
              </Row>
            }
            {
              (isSjProject || isHmProject) &&
              <Row>
                <label>绩效奖金:</label>
                <p className="txt">{originStaffInfo.performanceBonus}</p>
              </Row>
            }
            {
              (isSjProject || isHmProject) && originStaffInfo.salaryProbation !== '无试用期' &&
              <Row>
                <label>试用期基本工资:</label>
                <p className="txt">{originStaffInfo.probationBaseSalary}</p>
              </Row>
            }
            {
              display === 1 && originStaffInfo.contractProBaseSalary && originStaffInfo.salaryProbation !== '无试用期' &&
              <Row>
                <label>合同试用期基本工资:</label>
                <p className="txt">{originStaffInfo.contractProBaseSalary || '0.00'}</p>
              </Row>
            }
            {
              (isSjProject || isHmProject) && originStaffInfo.salaryProbation !== '无试用期' &&
              <Row>
                <label>试用期绩效工资:</label>
                <p className="txt">{originStaffInfo.probationPerSalary}</p>
              </Row>
            }
            {
              isSjProject &&
              <div className="sj_salary">
                <Row>
                  <label>其他工资:</label>
                  <p className="txt">{originStaffInfo.otherSalary}</p>
                </Row>
                <Row>
                  <label>餐补标准:</label>
                  <p className="txt">{originStaffInfo.mealStandard}</p>
                </Row>
                <Row>
                  <label>房补标准:</label>
                  <p className="txt">{originStaffInfo.roomStandard}</p>
                </Row>
                <Row>
                  <label>叉车标准:</label>
                  <p className="txt">{originStaffInfo.forkliftStandard}</p>
                </Row>
                <Row>
                  <label>工会费:</label>
                  <p className="txt">{originStaffInfo.unionFee}</p>
                </Row>
                <Row>
                  <label>加班基数:</label>
                  <p className="txt">{originStaffInfo.overtimeBase}</p>
                </Row>
                <Row>
                  <label>岗位津贴:</label>
                  <p className="txt">{originStaffInfo.postSalary}</p>
                </Row>
                <Row>
                  <label>雇主责任险:</label>
                  <p className="txt">{originStaffInfo.liabilityInsurance}</p>
                </Row>
                <Row>
                  <label>管理费:</label>
                  <p className="txt">{originStaffInfo.manageFee}</p>
                </Row>
                <Row>
                  <label>职级:</label>
                  <p className="txt">{originStaffInfo.rankValue}</p>
                </Row>
                <Row>
                  <label>序列:</label>
                  <p className="txt">{originStaffInfo.sequenceValue}</p>
                </Row>
                <Row>
                  <label>职等:</label>
                  <p className="txt">{originStaffInfo.officialRankValue}</p>
                </Row>
                <Row>
                  <label>薪资试用期:</label>
                  <p className="txt">{originStaffInfo.salaryProbation}</p>
                </Row>
              </div>
            }
            <Row style={{ paddingBottom: '0px' }}>
              <Form.Item style={{ display: 'block', marginTop: '0.74rem' }} className="upload-img">
                {getFieldDecorator('beforeimages', {
                  initialValue: originStaffInfo.images
                })(
                  <BasicUploadJob iconBool={false}>
                  </BasicUploadJob>
                )}
              </Form.Item>
            </Row>
          </Card>
          <Card style={{ width: '3.125rem' }}>
            <h2 className="card_title">
              <i className="icon"></i>
              异动后
            </h2>
            <Row>
              <label>项目:</label>
              <p className="txt">{projectName}</p>
            </Row>
            <Row>
              <label>工号:</label>
              <p className="txt">{projectNumber || '- - -'}</p>
            </Row>
            <Row>
              <label>管理编号:</label>
              <p className="txt">{sjNumber}</p>
            </Row>
            <Row>
              <label>姓名:</label>
              <p className="txt">{userName}</p>
            </Row>
            <Row>
              <label>入职日期:</label>
              <p className="txt">{entryTime}</p>
            </Row>
            <Row>
              <label>员工类型:</label>
              <p className="txt">{roleType}</p>
            </Row>
            <Form.Item className="form_item custom-select-width" label="法人主体">
              {getFieldDecorator('legalEntity', {
                initialValue: legalEntity,
                rules: [{
                  required: true, message: '请选择法人主体'
                }]
              })(
                <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                  {legalEntityList.map((item: KeyValue) => <Select.Option value={item.entityId} key={item.entityId}>{item.entity}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item className="form_item custom-select-width" label="组织">
              {getFieldDecorator('organize', {
                initialValue: organize,
                rules: [{
                  required: true, message: '请选择组织'
                }]
              })(
                <Organization placeholder="请选择" onChange={this.getFieldsValue} data={organizeList}></Organization>
              )}
            </Form.Item>
            {
              !isSjProject &&
              <Form.Item className="form_item" label="职位">
                {getFieldDecorator('post', {
                  initialValue: post
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue} allowClear>
                    {postList.map((item: KeyValue) => <Select.Option value={item.positionId} key={item.positionId}>{item.position}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            }
            {
              isSjProject &&
              <Form.Item label="计薪类型" className="form_item">
                {getFieldDecorator('salaryType', {
                  initialValue: (salaryType + '') || '1',
                  rules: [{ required: true }]
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                    <Select.Option value="1">计薪制</Select.Option>
                    <Select.Option value="2">计件制</Select.Option>
                  </Select>
                )}
              </Form.Item>
            }
            {
              isSjProject &&
              <Form.Item className="form_item" label="薪资等级">
                {getFieldDecorator('levelId', {
                  initialValue: levelId
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue} allowClear>
                    {levelList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            }
            {
              isSjProject &&
              <Form.Item className="form_item" label="薪资档级">
                {getFieldDecorator('gradeId', {
                  initialValue: gradeId
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue} allowClear>
                    {gradeList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            }
            {
              isHmProject &&
              <Form.Item className="form_item" label="薪资层级">
                {getFieldDecorator('rankId', {
                  initialValue: rankId
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue} allowClear>
                    {rankList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            }
            <Form.Item className="form_item" label="基本工资">
              {getFieldDecorator('baseSalary', {
                initialValue: baseSalary,
                rules: [{ required: true }],
                getValueFromEvent: (e: any) => {
                  e.persist()
                  return this.transformInputValue(e.target.value)
                }
              })(
                <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
              )}
            </Form.Item>
            {
              display === 1 &&
              <Form.Item className="form_item" label="合同基本工资">
                {getFieldDecorator('contractBaseSalary', {
                  initialValue: contractBaseSalary,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              (isSjProject || isHmProject) &&
              <Form.Item className="form_item" label="绩效工资">
                {getFieldDecorator('bonusSalary', {
                  initialValue: bonusSalary,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              isHmProject &&
              <Form.Item className="form_item" label="层级工资">
                {getFieldDecorator('hierarchySalary', {
                  initialValue: hierarchySalary,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              (isSjProject || isHmProject) &&
              <Form.Item className="form_item" label="绩效奖金">
                {getFieldDecorator('performanceBonus', {
                  initialValue: performanceBonus,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              (isSjProject || isHmProject) && originStaffInfo.salaryProbation !== '无试用期' &&
              <Form.Item className="form_item" label="试用期基本工资">
                {getFieldDecorator('probationBaseSalary', {
                  initialValue: probationBaseSalary,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              display === 1 && originStaffInfo.salaryProbation !== '无试用期' &&
              <Form.Item className="form_item item_margin_left_20" label="合同试用期基本工资">
                {getFieldDecorator('contractProBaseSalary', {
                  initialValue: contractProBaseSalary,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              (isSjProject || isHmProject) && originStaffInfo.salaryProbation !== '无试用期' &&
              <Form.Item className="form_item" label="试用期绩效工资">
                {getFieldDecorator('probationBonusSalary', {
                  initialValue: probationBonusSalary,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input placeholder="请输入" allowClear maxLength={11} onChange={this.getFieldsValue} />
                )}
              </Form.Item>
            }
            {
              isSjProject &&
              <div>
                <Form.Item className="form_item" label="其他工资">
                  {getFieldDecorator('otherSalary', {
                    initialValue: otherSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="餐补标准">
                  {getFieldDecorator('mealStandard', {
                    initialValue: mealStandard,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="房补标准">
                  {getFieldDecorator('roomStandard', {
                    initialValue: roomStandard,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="叉车标准">
                  {getFieldDecorator('forkliftStandard', {
                    initialValue: forkliftStandard,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="工会费">
                  {getFieldDecorator('unionFee', {
                    initialValue: unionFee || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="加班基数">
                  {getFieldDecorator('overtimeBase', {
                    initialValue: overtimeBase,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="岗位津贴">
                  {getFieldDecorator('postSalary', {
                    initialValue: postSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="雇主责任险">
                  {getFieldDecorator('liabilityInsurance', {
                    initialValue: liabilityInsurance,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="管理费">
                  {getFieldDecorator('manageFee', {
                    initialValue: manageFee,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item label="职级" className="form_item custom-select-width">
                  {getFieldDecorator('rank', {
                    initialValue: rank ? String(rank) : undefined,
                    rules: [{ required: true }]
                  })(
                    <SearchInput
                      url={this.api.entryGetPositionList}
                      type={4}
                      placeholder="请选择"
                      collectValue={'id'}
                      param={{ orlevel: 1 }}
                      getSelected={this.getRank}
                      onChange={this.getFieldsValue.bind(this, 2)}
                    />
                  )}
                </Form.Item>
                <Form.Item label="序列" className="form_item custom-select-width">
                  {getFieldDecorator('sequence', {
                    initialValue: sequence ? String(sequence) : undefined,
                    rules: [{ required: true }]
                  })(
                    <SearchInput
                      url={this.api.entryGetPositionList}
                      type={4}
                      collectValue={'id'}
                      placeholder="请选择"
                      param={{ orlevel: 2, parentId: getFieldValue('rank') }}
                      getSelected={this.getSequence}
                      onChange={this.getFieldsValue.bind(this, 2)}
                    />
                  )}
                </Form.Item>
                <Form.Item label="职等" className="form_item custom-select-width">
                  {getFieldDecorator('officialRank', {
                    initialValue: officialRank ? String(officialRank) : undefined,
                    rules: [{ required: true }]
                  })(
                    <SearchInput
                      url={this.api.entryGetPositionList}
                      type={4}
                      collectValue={'id'}
                      placeholder="请选择"
                      param={{ orlevel: 3, parentId: getFieldValue('sequence') }}
                      getSelected={this.getOfficialRank}
                      onChange={this.getFieldsValue.bind(this, 2)}
                    />
                  )}
                </Form.Item>
              </div>
            }
            <Form.Item className="form_item" label="异动生效日期">
              {getFieldDecorator('effectDate', {
                initialValue: effectDate,
                rules: [
                  {
                    required: true,
                    message: '请选择生效日期'
                  }
                ]
              })(
                <DatePicker
                  disabledDate={(current: any) => current && current < moment().startOf('month')}
                  onChange={this.getFieldsValue} />
              )}
            </Form.Item>
            <div className="upload_pic">
              <Form.Item style={{ display: 'block' }} className="upload-img">
                {getFieldDecorator('images', {
                  initialValue: images
                })(
                  <BasicUploadJob onChange={this.getFieldsValue.bind(this, -1)} iconBool={true}>
                    <Button icon="upload" className="upload_button">{btnFont}</Button>
                    <p className="tip">（按住ctrl键可多选，建议尺寸为580*820px,大小不超过3M）</p>
                  </BasicUploadJob>
                )}
              </Form.Item>
            </div>
          </Card>
        </div>
        {
          /* eslint-disable */
          this.isAuthenticated(this.AuthorityList.transaction[3])
            ?
              <Form.Item className="button_wrapper">
                <Button className="confirm_button" type="primary" disabled={disabled} htmlType="submit">保存</Button>
                <Button className="cancel_button" onClick={this.cancelAddNewStaff}>取消</Button>
              </Form.Item>
            :
              <Form.Item className="button_wrapper">
                <Button className="confirm_button" type="primary" onClick={this.cancelAddNewStaff}>返回</Button>
              </Form.Item>
        }
        <BasicModal ref={this.modal}>
          <h2 className="tips_text">未修改任何信息，不需保存！</h2>
          <Row className="remove_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.hideModal}>知道了</Button>
          </Row>
        </BasicModal>
      </Form>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
    this.setState = (state, callback) => {}
  }
}

@hot(module)
export default class JobChangeAdd extends RootComponent<BaseProps, State> {
  render () {
    const JobChangeFormComponent = Form.create<JobChangeProps>()(FormComponent)
    return (
      <div id="add_job_change">
        <JobChangeFormComponent {...this.props} />
      </div>
    )
  }
}
