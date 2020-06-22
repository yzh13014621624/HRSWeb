/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 入职新增
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicModalNew } from '@components/index'
import { Prompt } from 'react-router-dom'
import { Form, Input, Divider, Icon, Row, Col, Button, Select, DatePicker, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from 'typings/global'
import SearchInput from '@shared/SearchInput/index'
import moment from 'moment'

import { SysUtil, JudgeUtil, FormatInputValue } from '@utils/index'

import { date, ind1, ind2, ind3, ind4, other1, other2, other3, IconPer1, IconPer2, IconPer6, IconFill } from '@components/icon/BasicIcon'
import { CustomeFamily, CustomeEducatory, CustomWork, BirthDetail, getValueFromEventFirstNull,
  CustomeCertificate, Upload, RejectModal, itemLayout, validatorCommon, getValueFromEventFirstNotNull,
  itemLayoutTwo, itemLayoutThere, UserInfo, registerCompanyAry } from '../component/index'
import Organization from '@shared/organization/Organization'

import '../style/EntryAdd.styl'
const { Item } = Form

interface FormItemProps extends FormComponentProps, BaseProps {
}

/** 判断是否都存在值 */
function hasErrors (fieldsError:any) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

interface FormItemState {
  userId: number // 用户编号
  HRsUser: any // 好饭碗的信息
  legalEntityAry: any // 法人主体
  positionAry: any // 职位
  projectAry: any // 项目
  origanAry:Array<any> // 保存组织的信息
  postAry: Array<string> // 工作岗位
  errorMsg: string // 修改的时候的错误的消息
  nationalityState: boolean // 护照 和 身份证是否必填 护照 false 身份证 true
  disableBtn: boolean // 按钮的禁用
  picText: string // 港澳台通行证的图片
  titleText: string
  showWarning: boolean // 是否显示错误的信息
  countryAry:Array<any> // 国家
  // 弹窗的显示隐藏
  visibleModal: boolean
  // 驳回弹窗的显示隐藏
  visibleReject: boolean
  /** 选择上嘉项目的时候， 工作岗位为非必填 */
  jobRequired: boolean
  /** 好饭碗登录的显示 */
  hfwLoginNumShow: boolean
}

class FormItem extends RootComponent<FormItemProps, FormItemState> {
  timerId:any = null
  private handleModalKey: number = 0
  private HrsUserInfo:any = {} // 保存值
  personalPicBase64: string | undefined = '' // 个人照片的 base64 数据
  isShangJia: number = 0 // 该详情信息是否是上嘉
  constructor (props:FormItemProps) {
    super(props)
    const { match } = this.props
    let userId = match.params.id || 0
    let countryAry = SysUtil.getSessionStorage('commonCountry')
    // 进行排序
    countryAry.sort((a:any, b:any) => {
      if (a.countryId > b.countryId) return 1
      else if (a.countryId < b.countryId) return -1
      else return 0
    })
    this.state = {
      showWarning: false,
      userId: userId,
      HRsUser: {},
      legalEntityAry: [], // 法人主体
      positionAry: [], // 职位
      projectAry: [], // 项目
      origanAry: [], // 保存组织的信息
      postAry: [],
      countryAry, // 国家
      errorMsg: '',
      nationalityState: true, // 状态的设置
      disableBtn: false, // 按钮的禁用
      picText: '护照照片',
      titleText: '护照号',
      visibleModal: false,
      visibleReject: false,
      jobRequired: true,
      hfwLoginNumShow: false
    }
  }

  /* 初始化数据 */
  componentDidMount () {
    const { userId } = this.state
    if (userId !== 0) { // 详情
      // 查看的时候 查询文件的信息
      this.getUserDetail(this.api.entryDetail, userId)
      SysUtil.clearSession('entry_info')
      this.searchAry().then((projectAry:any) => {
        this.setState({ projectAry })
      })
    } else {
      // 查询组织, 在新增的时候查询
      this.searchAry().then((projectAry:any) => {
        this.setState({ projectAry }, () => {
          // 新增的时候 判断是否存在 上次保留的信息
          let a = SysUtil.getSessionStorage('entry_info')
          if (a) this.initUserInfo(a)
          this.props.form.validateFields()
        })
      })
    }
    console.log(this.api.entryGetPositionList, 'this.api.entryGetPositionList')
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    window.clearTimeout(this.timerId)
    this.HrsUserInfo = {}
  }

  // 查询项目
  searchAry = () => {
    return new Promise((resolve, reject) => {
      this.axios.request(this.api.entryProject, {}, true).then((project:any) => {
        resolve(project.data || [])
      }).catch((err:any) => {
        console.log(err.msg)
      })
    })
  }

  /* 查询详情 */
  getUserDetail = (url:any, userId:number) => {
    if (userId) {
      this.axios.request(url, {
        userId: userId // 用户的编号
      }, true).then((res:any) => {
        this.initUserInfo(res.data)
      }).catch((err:any) => {
        this.error(err.msg || err)
      })
    }
  }

  /** 初始的时候设置值 */
  initUserInfo = (data:UserInfo) => {
    let { projectId, country, entryTime, projectName, entity, roleType } = data
    let { userId } = this.state
    // 存在初始值 则查询信息设置值
    if (projectId) {
      this.projectOnchange(projectId, projectName)
    }
    if (userId !== 0) {
      this.judgeHFWLogin(entity, 'entity', projectName, roleType)
    }
    // 判断时间的信息
    if (entryTime && userId === 0) {
      let year = moment().format('YYYY')
      let month:any = moment().format('MM')
      month = Number(month) - 1
      if (Number(month) < 10) {
        month = '0' + month
      }
      let date = `${year}-${month}-01`
      let da1 = new Date(date).getTime()
      entryTime = moment(entryTime, 'YYYY-MM-DD').format('YYYY-MM-DD')
      let da2 = new Date(entryTime).getTime()
      if (da2 <= da1) {
        data.entryTime = undefined
      }
    }
    if (!JudgeUtil.isEmpty(country)) {
      this.initChange(country)
    }
    this.personalPicBase64 = data.baseFaceImg || undefined
    this.setState({ HRsUser: data || {} }, () => {
      this.props.form.validateFields()
    })
  }

  /* 提交信息事件 */
  handleSubmit = (e:React.FormEvent) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll({
      force: true,
      scroll: { offsetTop: 100, alignWithTop: true }
    }, (err, values) => {
      if (!err) {
        const keysAry = ['userImage', 'idCardFront', 'idCardNegative', 'passportImage', 'householdImg', 'returnSheetImg', 'diplomaImg', 'householdSelfImg']
        let { ary, a, b } = this.uploadArys(values, keysAry)
        if (ary.length > 0) { // 判断之后重新赋值
          this.axios.axios.all(ary).then((res:any) => {
            a.forEach((el:any, index:number) => { // 上传之后赋值 重新赋值
              values[el] = res[index].data.data
            })
            let { hrsCertificateList } = values
            b.forEach((el:number, index:number) => { // 根据记录上传信息
              hrsCertificateList[el]['certificateImage'] = res[a.length + index].data.data
            })
            this.HrsUserInfo = values
            this.subData(values) // 发送请求
          })
        } else {
          this.HrsUserInfo = values
          this.subData(values)
        }
      }
    })
  }

  /** 发送上传的请求 */
  subData = (values:any, perform:number = 0) => {
    const {
      state: { userId }
    } = this
    let year = ''
    values.baseFaceImg = this.personalPicBase64 // 人脸识别的 base64 图片
    const { rank, sequence, officialRank } = values
    values.rank = rank ? Number(rank) : undefined
    values.sequence = sequence ? Number(sequence) : undefined
    values.officialRank = officialRank ? Number(officialRank) : undefined
    if (typeof values.birth !== 'string') {
      year = values.birth.fromNow(true).split(' ')[0]
      values.birth = values.birth.format('YYYY-MM-DD')
    } else {
      year = moment(values.birth, 'YYYY-MM-DD').fromNow(true).split(' ')[0]
    }
    if (Number(year) >= 18) {
      if (values['country'] === '中国' && values['passportCard']) {
        values['passportCard'] = ''
      } else if (values['country'] === '外籍' && values['idCard']) {
        values['idCard'] = ''
      }
      this.setState({ disableBtn: true })
      if (userId === 0) {
        if (typeof values.entryTime !== 'string') {
          values.entryTime = values.entryTime.format('YYYY-MM-DD')
        }
        // 任然新增 是否履职 (0 仍新增,1 正常) perform
        values['perform'] = perform
        // 判断值, 当国际不是中国，且相反会信息没有值的时候，主动赋值为 ''
        // { ...values, rank: rank.position, sequence: sequence.position, officialRank: officialRank.position }
        this.axios.request(this.api.entryAdd, values, true).then(() => {
          // 存在入职的情况， 年龄不行提示 重复入职， 不可录用
          this.$message.success('新增成功！')
          // 清空信息
          SysUtil.clearSession('entry_info')
          this.handleBack()
        }).catch((err:any) => {
          const { code, msg } = err
          if (code === 4001) {
            this.handleModalKey = 2
          } else {
            this.handleModalKey = 0
          }
          this.handelModal(1)
          this.setState({ errorMsg: msg, disableBtn: false })
        })
      } else {
        values['userId'] = userId
        values['entryTimeRe'] = values.entryTime.format('YYYY-MM-DD')
        values.entryTime = null // new Date(values.entryTime.format('YYYY-MM-DD'))
        this.axios.request(this.api.entryUpadte, values, true).then(() => {
          this.$message.success('保存成功！')
          this.handleBack()
        }).catch((err:any) => {
          const { code, msg } = err
          // 不可重复入职， 不能录用的
          this.setState({ errorMsg: msg, disableBtn: false })
          this.handelModal(1)
        })
      }
    } else {
      this.setState({ errorMsg: '未满18周岁不可录用！' })
      this.handelModal(1)
    }
  }

  /** 文件上传 */
  uploadArys = (values:any, nameAry:Array<string>) => {
    let a:any = []
    let ary:any = [] // 主文件的信息，身份证等信息
    let b:Array<number> = [] // 证书的 对象的index
    nameAry.forEach((el:any) => {
      let file = values[el]
      if (typeof file !== 'string' && file && file.type) { // 不是字符串的话是文件对象
        a.push(el) // 添加需要重置值的字段
        let data = new FormData() // 创建对象的信息
        data.append('file', file, file.name)
        data.append('type', el)
        ary.push(this.axios.upload({ method: 'post', url: this.api.entryOssUpload.path, data }, true))
      } else if (!file) {
        values[el] = null
      }
    })
    const { hrsCertificateList } = values
    // 针对附加的信息
    if (hrsCertificateList) {
      hrsCertificateList.forEach((el:any, index:number) => {
        let { certificateImage } = el
        if (certificateImage && typeof certificateImage !== 'string') {
          let file = certificateImage
          if (file && file.type) { // 是一个文件才进行这个数据的操作
            b.push(index) // 记录 是那个对象存在 文件上传的
            let formData = new FormData()
            // 创建对象的信息
            formData.append('file', file, file.name)
            formData.append('type', 'certificateImage')
            ary.push(this.axios.upload({
              method: 'post',
              url: this.api.entryOssUpload.path,
              data: formData
            }, true))
          } else if (!certificateImage) {
            certificateImage = null
          }
        }
      })
    }
    return { a, b, ary }
  }

  /* 点击取消和返回的 */
  handleBack = () => {
    this.props.history.replace('/home/entryPage')
  }

  /** 验证信息 */
  errorsShow = (name:string) => {
    const { isFieldTouched, getFieldError } = this.props.form
    const { userId } = this.state
    if (userId !== 0) { // 详情
      return getFieldError(name)
    } else {
      return isFieldTouched(name) && getFieldError(name)
    }
  }

  /* 验证银行卡（接口验证） */
  checkBankCard = (rule:any, value:any, callback:any) => {
    let one = /^(402658|410062|468203|512425|524011|622580|622588|622598|622609|95555|621286|621483|621485|621486|621299|621276)\d{10}$/g
    let two = /^(690755)\d{9}$/g
    let three = /^(690755)\d{12}$/g
    let four = /^(356885|356886|356887|356888|356890|439188|439227|479228|479229|521302|356889|545620|545621|545947|545948|552534|552587|622575|622576|622577|622578|622579|545619|622581|622582|545623|628290|439225|518710|518718|628362|439226|628262|625802|625803)\d{10}$/g
    let five = /^(370285|370286|370287|370289)\d{9}$/g
    let six = /^(620520)\d{13}$/g
    if (!(one.test(value) || two.test(value) || three.test(value) || four.test(value) || five.test(value) || six.test(value))) {
      callback(new Error('请输入正确的招行卡号'))
    }
    callback()
  }

  /** 输入身份证的时候显示 */
  validatorIdCard = (rule:any, value:any, callback:any) => {
    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的身份证号'))
    }
    callback()
  }

  /** 身份证改变 */
  idCardChange = (e:any) => {
    let value = e.target.value
    const { setFieldsValue } = this.props.form
    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
    if (!reg.test(value)) {
      setFieldsValue({ birth: undefined })
    } else {
      let val = value.substring(6, 14)
      val = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8)
      setFieldsValue({ birth: val })
    }
  }

  /** 工号的验证 */
  validatorProjectNumber = (rule:any, value:any, callback:any) => {
    const { projectNumber } = this.state.HRsUser
    const { request } = this.axios
    let msg = ''
    if (value && value.length > 14) {
      callback(new Error('工号长度在14位之内'))
    } else {
      if (value && value !== '') {
        request(this.api.entryCheckProject, {
          projectNumber: value
        }, true).then((res:any) => {
          callback()
        }).catch((err:any) => {
          const { setFields } = this.props.form
          const { code } = err
          if (code && code === 401 && projectNumber !== value) {
            setFields({
              projectNumber: {
                value: value,
                errors: [new Error('工号重复')]
              }
            })
          }
        })
      }
    }
    callback()
  }

  /** 项目的改变 */
  projectOnchange = (val:any, e?:any) => {
    this.isShangJia += 1
    // 查询组织 查询职位 查询法人主体
    const {
      axios: { request, axios },
      state: { userId, projectAry },
      props: { form: { setFieldsValue } },
      api: { entryPosition, entryLegalEntity, entryGetJobType }
    } = this
    if (val) {
      /* 获取项目的名称 start */
      let projectName:string
      if (e && typeof e !== 'string') { // 选择的时候
        projectName = e.props.title
        setFieldsValue({ organize: undefined, positionId: undefined, entityId: undefined, job: undefined })
      } else { // 初始化
        projectName = e
      }
      if (!projectName) {
        let a = projectAry.find((el:any) => el.projectId === val)
        if (a) projectName = a.projectName
      }
      /* 获取项目的名称 end */
      // 当项目为上嘉的时候，工作岗位为必填，其他的部位必填
      this.setState({ jobRequired: projectName.includes('上嘉') })
      if (userId === 0) this.judgeHFWLogin(projectName, 'project')
      let commonOrganize = SysUtil.getSessionStorage('commonOrganize')
      let ary = commonOrganize.find((el:any) => el.organize.includes(projectName))
      axios.all([
        request(entryPosition, { projectId: Number(val || 0) }),
        request(entryLegalEntity, { projectArr: [Number(val || -1)] }),
        request(entryGetJobType, { projectIdList: [Number(val || 0)] })
      ]).then(axios.spread((position:any, legalEntity:any, postAry:any) => {
        this.setState({
          legalEntityAry: legalEntity.data || [],
          origanAry: ary ? [ary] : [],
          positionAry: position.data || [],
          postAry: postAry.data || []
        })
      })).catch((err:any) => {
        console.log(err.msg)
      })
      // if (userId === 0 && val) {
      //   let commonOrganize = SysUtil.getSessionStorage('commonOrganize')
      //   let ary = commonOrganize.find((el:any) => el.organize.includes(projectName))
      //   axios.all([
      //     request(entryPosition, { projectId: Number(val || 0) }),
      //     request(entryLegalEntity, { projectArr: [Number(val || -1)] }),
      //     request(entryGetJobType, { projectIdList: [Number(val || 0)] })
      //   ]).then(axios.spread((position:any, legalEntity:any, postAry:any) => {
      //     this.setState({
      //       legalEntityAry: legalEntity.data || [],
      //       origanAry: ary ? [ary] : [],
      //       positionAry: position.data || [],
      //       postAry: postAry.data || []
      //     })
      //   })).catch((err:any) => {
      //     console.log(err.msg)
      //   })
      // } else {
      //   axios.all([
      //     request(entryPosition, { projectId: Number(val || 0) }),
      //     request(entryGetJobType, { projectIdList: [Number(val || 0)] })
      //   ]).then(axios.spread((position:any, postAry:any) => {
      //     this.setState({
      //       positionAry: position.data || [],
      //       postAry: postAry.data || []
      //     })
      //   })).catch((err:any) => {
      //     console.log(err.msg)
      //   })
      // }
    } else {
      setFieldsValue({ organize: undefined, positionId: undefined, entityId: undefined, job: undefined })
    }
  }

  initChange = (val:any, flg:boolean = false) => {
    // 是否验证的
    const { setFieldsValue } = this.props.form
    let name:string = 'idCard'
    let HRsUser = this.state.HRsUser
    name = (val === '中国' || '' || null) ? 'idCard' : 'passportCard'
    if (name === 'idCard' && flg) {
      HRsUser.idCard = undefined
      setFieldsValue({ idCard: undefined })
    } else if (flg) {
      HRsUser.passportCard = undefined
      setFieldsValue({ passportCard: undefined })
    }
    let titleText = ''
    let picText = ''
    if (val === '中国香港' || val === '中国澳门') {
      titleText = '港澳内地通行证'
      picText = '港澳居民来往内地通行证照片'
    } else if (val === '中国台湾') {
      titleText = '台湾大陆通行证'
      picText = '台湾居民来往大陆通行证照片'
    } else if (val === '中国') {
      picText = '护照/通行证照片'
    } else {
      titleText = '护照号'
      picText = '护照照片'
    }
    if (flg) {
      HRsUser.birth = undefined
      setFieldsValue({ birth: undefined })
    }
    let nationalityState = false
    if (val === '中国' || !val || val === '') {
      nationalityState = true
    }
    this.setState({
      nationalityState,
      HRsUser,
      titleText,
      picText
    })
  }

  /** 国家改变 */
  countryChange = (val:any) => {
    this.initChange(val, true)
  }

  /** 身份证的识别 正面 */
  onIdCardChange = (imgBuffer:any) => {
    const {
      props: { form: { setFieldsValue } },
      axios, api } = this
    if (imgBuffer) {
      let sub = 'data:image/jpeg;base64,'
      axios.request(api.entryOCR, {
        image: imgBuffer.substring(sub.length, imgBuffer.length),
        configure: 'face' // front 身份证含照片  reverse 身份证带国徽
      }).then(({ address, birth, name, nationality, num, sex, data }:any) => {
        if (!data) {
          let obj:any = {}
          if (birth) {
            birth = birth.substring(0, 4) + '-' + birth.substring(4, 6) + '-' + birth.substring(6, 8)
            obj['birth'] = birth
            obj['country'] = '中国'
            this.setState({ nationalityState: true })
          }
          obj['residenceAdress'] = address
          obj['userName'] = name
          obj['nation'] = nationality
          obj['idCard'] = num
          obj['sex'] = sex
          setFieldsValue(obj)
        } else {
          this.$message.error('身份证识别失败，未获取到信息')
        }
      }).catch((err:any) => {
        this.$message.error(err.msg || err)
      })
    }
  }

  /** 输入联系方式之后 */
  contactWayChange = (e:any) => {
    const { userId, HRsUser: { workCondition }, hfwLoginNumShow } = this.state
    const { setFieldsValue } = this.props.form
    if ((userId === 0 || (userId !== 0 && workCondition === '待入职')) && hfwLoginNumShow) {
      setFieldsValue({ hfwLoginNum: e.target.value })
    }
  }

  /** 入职禁用时间 */
  disabledDate = (current:any) => {
    let year = moment().format('YYYY')
    let month:any = moment().format('MM')
    month = Number(month) - 1
    if (Number(month) < 10) {
      month = '0' + month
    }
    let date = `${year}-${month}-01`
    return current && current < moment(date)
  }

  /** 显示弹窗的 */
  handelModal = (num:number) => {
    if (num === 2) { // 仍然新增
      this.subData(this.HrsUserInfo, 1)
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 是否驳回的弹窗 */
  rejectModal = (num:number) => {
    if (num === 2) this.handleBack()
    this.setState({ visibleReject: num === 1 })
  }

  /** 是否显示好饭碗的字段 */
  entityChange = (value:string, e:any) => {
    if (value) {
      let allValues = SysUtil.getSessionStorage('entry_info') || {}
      allValues['entity'] = e.props.title
      SysUtil.setSessionStorage('entry_info', allValues)
      this.judgeHFWLogin(e.props.title, 'entity')
    }
  }

  /**
   * 判断是否显示 好饭碗登录（上嘉， 6家主体， 类型：全职）
   * @param value   主体
   * @param type('entity' | 'project' | 'roleType') 类型
   */
  judgeHFWLogin = (value:string, type: 'entity' | 'project' | 'roleType', projects?: string, roleTypes?:string) => {
    const { form: { getFieldValue } } = this.props
    const { projectAry } = this.state
    let project: string = ''
    let entity: string = ''
    let roleType: string = ''
    let allValues = SysUtil.getSessionStorage('entry_info') || {}
    let projectId = getFieldValue('projectId')
    if (projects && roleTypes) {
      entity = value
      project = projects
      roleType = roleTypes
    } else {
      if (type === 'project') {
        project = value
        entity = allValues['entity']
        roleType = getFieldValue('roleType')
      } else if (type === 'entity') {
        let a = projectAry.find((el:any) => el.projectId === projectId)
        if (a) project = a.projectName
        entity = value
        roleType = getFieldValue('roleType')
      } else {
        let a = projectAry.find((el:any) => el.projectId === projectId)
        if (a) project = a.projectName
        entity = allValues['entity']
        roleType = value
      }
    }
    let flg = (registerCompanyAry.includes(entity) && project.includes('上嘉') && roleType === '全职')
    this.setState({ hfwLoginNumShow: flg })
  }

  /** 员工类型改变的时候 */
  roleTypeChange = (value:string) => {
    this.judgeHFWLogin(value, 'roleType')
  }

  getUploadedPic = (base64: string | undefined) => {
    this.personalPicBase64 = base64
  }

  // 职级的回调
  getRank = async (v: any) => {
    const { props: { form: { setFieldsValue } } } = this
    await this.setState({ disableBtn: true })
    setFieldsValue({
      sequence: undefined,
      officialRank: undefined
    })
  }

  // 序列的回调
  getSequence = async (v: any) => {
    const { props: { form: { setFieldsValue } } } = this
    await this.setState({ disableBtn: true })
    setFieldsValue({
      officialRank: undefined
    })
  }

  // 职等的回调
  getOfficialRank = (v: any) => {
    this.setState({ disableBtn: false })
  }

  render () {
    const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError, getFieldValue } = this.props.form
    const { AuthorityList, isAuthenticated } = this
    const { HRsUser, nationalityState, userId,
      legalEntityAry, positionAry, projectAry, origanAry, countryAry, errorMsg, disableBtn,
      picText, titleText, visibleModal, visibleReject, postAry, jobRequired, hfwLoginNumShow } = this.state
    // 主要的字段信息
    let { bankCard, birth, computerLevel, contactAdress, contactWay, country, entryTime,
      foreignLanguage, idCard, entity, maritalStatus, maxEducation, nation, nativePlace,
      organize, passportCard, projectNumber, quitTime, residenceAdress,
      residenceNature, roleType, sex, sjNumber, urgentPhone, urgentRelation, urgentUser,
      userName, workCondition, projectName, projectId, positionId, entityId,
      userImage, idCardFront, idCardNegative, passportImage,
      hrsCertificateList, hrsEducationList, hrsFamilyList, hrsWorkExperienceList, officialRank,
      rank, sequence, job, jobName, dataSource } = HRsUser
    // 毕业证照片,  户口本照片, 退工单照片
    let { hfwLoginNum, diplomaImg, diplomaImgUrl, householdImg, householdImgUrl,
      returnSheetImg, returnSheetImgUrl, householdSelfImg, householdSelfImgUrl } = HRsUser
    let codeitionShow = false
    jobRequired && this.isShangJia !== 1 && (projectNumber = undefined)
    if (workCondition) {
      codeitionShow = workCondition === '待入职'
    }
    return (
      <div style={{ padding: '0.2rem' }}>
        <Form layout="inline" className="entry-add-from " onSubmit={this.handleSubmit}>
          <Row>
            <Col span={23} className='gutter-row-title'>
              <Icon component={IconPer1}></Icon><span>个人信息</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: '0.15rem' }} type="flex">
            <Col offset={1} className="entry_pic_item">
              <Item>
                {getFieldDecorator('userImage', {
                  initialValue: userImage
                })(
                  <Upload
                    desc="需高清可见五官脸部，仅支持png/jpg格式"
                    placeholder='个人照片'
                    width={'0.78rem'}
                    height={'0.89rem'}
                    bgImageStyle={{ width: '0.5rem', height: '0.5rem' }}
                    images={userImage ? HRsUser.userImageUrl : undefined}
                    backgroundImage={ind1}
                    onBuffer={this.getUploadedPic} />
                )}
              </Item>
            </Col>
            <Col className="entry_pic_item">
              <Item>
                {getFieldDecorator('idCardFront', {
                  initialValue: idCardFront
                })(
                  <Upload backgroundImage={ind2} bgImageStyle={{ width: '1.13rem', height: '0.5rem' }} images={idCardFront ? HRsUser.idCardFrontUrl : undefined}
                    width={'1.56rem'} height={'0.89rem'} placeholder='身份证正面照片' onBuffer={this.onIdCardChange} />
                )}
              </Item>
            </Col>
            <Col className="entry_pic_item">
              <Item>
                {getFieldDecorator('idCardNegative', {
                  initialValue: idCardNegative
                })(
                  <Upload backgroundImage={ind3} bgImageStyle={{ width: '1.04rem', height: '0.5rem' }} images={idCardNegative ? HRsUser.idCardNegativeUrl : undefined}
                    width={'1.56rem'} height={'0.89rem'} placeholder='身份证反面照片' />
                )}
              </Item>
            </Col>
            <Col className="entry_pic_item">
              <Item>
                {getFieldDecorator('passportImage', {
                  initialValue: passportImage
                })(
                  <Upload backgroundImage={ind4} bgImageStyle={{ width: '0.92rem', height: '0.5rem' }} images={passportImage ? HRsUser.passportImageUrl : undefined}
                    width={'1.56rem'} height={'0.89rem'} placeholder={picText} />
                )}
              </Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={6}>
              <Item {...itemLayout} label="姓名"
                validateStatus={this.errorsShow('userName') ? 'error' : ''}
                help={this.errorsShow('userName') || ''}
                className="form-item">
                {getFieldDecorator('userName', {
                  initialValue: userName,
                  rules: [{
                    required: true,
                    max: 15,
                    message: '请输入中文或英文',
                    pattern: /^\S[\u0391-\uFFE5a-zA-Z\s]+$/,
                    validator: validatorCommon
                  }],
                  getValueFromEvent: getValueFromEventFirstNull
                })(<Input maxLength={15} allowClear placeholder="请输入姓名"/>)}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('sex') ? 'error' : ''}
                help={this.errorsShow('sex') || ''}
                label="性别"
                className="form-item">
                {getFieldDecorator('sex', {
                  initialValue: sex,
                  rules: [{ required: true, message: '请选择性别' }]
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择性别" allowClear>
                    <Select.Option key="男" value="男">男</Select.Option>
                    <Select.Option key="女" value="女">女</Select.Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('country') ? 'error' : ''}
                help={this.errorsShow('country') || ''}
                label="国家" className="form-item">
                {getFieldDecorator('country', {
                  initialValue: country,
                  rules: [{ required: true, message: '请选择国家' }]
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择国家" onChange={this.countryChange} allowClear>
                    {countryAry.map((el:any, index:any) => (
                      <Select.Option key={index} value={el.country}>{el.country}</Select.Option>
                    ))}
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('nation') ? 'error' : ''}
                help={this.errorsShow('nation') || ''}
                label="民族" className="form-item">
                {getFieldDecorator('nation', {
                  initialValue: nation,
                  rules: [
                    { required: true, message: '请输入民族' },
                    { pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入汉字' }
                  ],
                  getValueFromEvent: getValueFromEventFirstNotNull
                })(
                  <Input type="text" maxLength={15} allowClear placeholder="请输入民族"/>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Item {...itemLayout}
                validateStatus={this.errorsShow('nativePlace') ? 'error' : ''}
                help={this.errorsShow('nativePlace') || ''}
                label="籍贯" className="form-item">
                {getFieldDecorator('nativePlace', {
                  initialValue: nativePlace,
                  rules: [
                    { required: true, message: '请输入籍贯' },
                    { pattern: /^[\u4e00-\u9fa50-9]+$/, message: '请输入数字或汉字' }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={30} allowClear placeholder="请输入籍贯" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              {nationalityState ? <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('idCard') ? 'error' : ''}
                help={this.errorsShow('idCard') || ''}
                label="身份证号" className="form-item">
                {getFieldDecorator('idCard', {
                  initialValue: idCard,
                  rules: [
                    { required: true, validator: this.validatorIdCard }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" onChange={this.idCardChange} maxLength={18} allowClear placeholder="请输入身份证号" />
                )}
              </Item> : <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('passportCard') ? 'error' : ''}
                help={this.errorsShow('passportCard') || ''}
                label={titleText} className="form-item">
                {getFieldDecorator('passportCard', {
                  initialValue: passportCard,
                  rules: [
                    { required: true, message: `请输入${titleText}` },
                    {
                      pattern: /^([a-zA-Z0-9])+$/,
                      message: '请输入字母或数字'
                    }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={9} allowClear placeholder={`请输入${titleText}`} />
                )}
              </Item>}
            </Col>
            <Col span={6}>
              {nationalityState ? <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('birth') ? 'error' : ''}
                help={this.errorsShow('birth') || ''}
                label="出生日期" className="form-item">
                {getFieldDecorator('birth', {
                  initialValue: birth,
                  rules: [{ required: true, message: '请输入身份证号' }]
                })(
                  <BirthDetail/>
                )}
              </Item> : <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('birth') ? 'error' : ''}
                help={this.errorsShow('birth') || ''}
                label="出生日期" className="form-item">
                {getFieldDecorator('birth', {
                  initialValue: birth ? moment(birth, 'YYYY-MM-DD') : undefined,
                  rules: [{ required: true, message: '请选择日期' }]
                })(
                  <DatePicker placeholder="请选择日期" allowClear showToday={false} suffixIcon={(<img src={date}/>)}/>
                )}
              </Item>}
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('maritalStatus') ? 'error' : ''}
                help={this.errorsShow('maritalStatus') || ''}
                label="婚姻状况" className="form-item">
                {getFieldDecorator('maritalStatus', {
                  initialValue: maritalStatus,
                  rules: [{ required: true, message: '请选择婚姻状况' }]
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                    <Select.Option key="已婚" value="已婚">已婚</Select.Option>
                    <Select.Option key="未婚" value="未婚">未婚</Select.Option>
                    <Select.Option key="离异" value="离异">离异</Select.Option>
                  </Select>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Item {...itemLayout}
                validateStatus={this.errorsShow('bankCard') ? 'error' : ''}
                help={this.errorsShow('bankCard') || ''}
                label="银行卡号" className="form-item">
                {getFieldDecorator('bankCard', {
                  initialValue: bankCard,
                  rules: [{ required: true, validator: this.checkBankCard }],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={16} allowClear placeholder="请输入卡号" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('residenceAdress') ? 'error' : ''}
                help={this.errorsShow('residenceAdress') || ''}
                label="户籍地址" className="form-item">
                {getFieldDecorator('residenceAdress', {
                  initialValue: residenceAdress,
                  rules: [
                    { required: true, message: '请输入户籍地址' }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={30} allowClear placeholder="请输入户籍地址" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('residenceNature') ? 'error' : ''}
                help={this.errorsShow('residenceNature') || ''}
                label="户口性质" className="form-item">
                {getFieldDecorator('residenceNature', {
                  initialValue: residenceNature,
                  rules: [{
                    required: true, message: '请选择户口性质'
                  }]
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                    <Select.Option key="本地农村" value="本地农村">本地农村</Select.Option>
                    <Select.Option key="本地城镇" value="本地城镇">本地城镇</Select.Option>
                    <Select.Option key="外地农村" value="外地农村">外地农村</Select.Option>
                    <Select.Option key="外地城镇" value="外地城镇">外地城镇</Select.Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('maxEducation') ? 'error' : ''}
                help={this.errorsShow('maxEducation') || ''}
                label="最高学历" className="form-item">
                {getFieldDecorator('maxEducation', {
                  initialValue: maxEducation,
                  rules: [{
                    required: true, message: '请选择最高学历'
                  }]
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                    <Select.Option key="初中及以下" value="初中及以下">初中及以下</Select.Option>
                    <Select.Option key="高中" value="高中">高中</Select.Option>
                    <Select.Option key="中专" value="中专">中专</Select.Option>
                    <Select.Option key="大专" value="大专">大专</Select.Option>
                    <Select.Option key="本科" value="本科">本科</Select.Option>
                    <Select.Option key="硕士" value="硕士">硕士</Select.Option>
                    <Select.Option key="博士" value="博士">博士</Select.Option>
                  </Select>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Item {...itemLayout}
                validateStatus={this.errorsShow('contactWay') ? 'error' : ''}
                help={this.errorsShow('contactWay') || ''}
                label="联系方式" className="form-item">
                {getFieldDecorator('contactWay', {
                  initialValue: contactWay,
                  rules: [{
                    required: true,
                    pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                    message: '请输入正确的联系方式',
                    validator: validatorCommon
                  }],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input maxLength={11} onChange={this.contactWayChange} allowClear placeholder="请输入钉钉账号的手机号码" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('contactAdress') ? 'error' : ''}
                help={this.errorsShow('contactAdress') || ''}
                label="联系地址" className="form-item">
                {getFieldDecorator('contactAdress', {
                  initialValue: contactAdress,
                  rules: [
                    { required: true, message: '请输入联系地址' }
                    // { pattern: /^[\u4e00-\u9fa50-9]+$/, message: '请输入中文或数字' }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={30} allowClear placeholder="请输入联系地址"/>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere} label="计算机水平" className="form-item">
                {getFieldDecorator('computerLevel', {
                  initialValue: computerLevel,
                  validateFirst: true
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                    <Select.Option key="不合格" value="不合格">不合格</Select.Option>
                    <Select.Option key="合格" value="合格">合格</Select.Option>
                    <Select.Option key="良好" value="良好">良好</Select.Option>
                    <Select.Option key="优秀" value="优秀">优秀</Select.Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere} label="外语" className="form-item">
                {getFieldDecorator('foreignLanguage', {
                  initialValue: foreignLanguage,
                  validateFirst: true
                })(
                  <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                    <Select.Option key="英语" value="英语">英语</Select.Option>
                    <Select.Option key="法语" value="法语">法语</Select.Option>
                    <Select.Option key="德语" value="德语">德语</Select.Option>
                    <Select.Option key="韩语" value="韩语">韩语</Select.Option>
                    <Select.Option key="日语" value="日语">日语</Select.Option>
                    <Select.Option key="其它" value="其它">其它</Select.Option>
                  </Select>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Item {...itemLayout}
                validateStatus={this.errorsShow('urgentUser') ? 'error' : ''}
                help={this.errorsShow('urgentUser') || ''}
                label="紧急联系人" className="form-item">
                {getFieldDecorator('urgentUser', {
                  initialValue: urgentUser,
                  rules: [
                    { required: true, message: '请输入联系人' },
                    { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '请输入中文或英文' }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={15} allowClear placeholder="请输入联系人" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('urgentRelation') ? 'error' : ''}
                help={this.errorsShow('urgentRelation') || ''}
                label="紧急联系人关系" className="form-item">
                {getFieldDecorator('urgentRelation', {
                  initialValue: urgentRelation,
                  rules: [
                    { required: true, message: '请输入联系人关系' },
                    { pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入中文' }
                  ],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input type="text" maxLength={10} allowClear placeholder="请输入联系人关系" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item {...itemLayoutThere}
                validateStatus={this.errorsShow('urgentPhone') ? 'error' : ''}
                help={this.errorsShow('urgentPhone') || ''}
                label="紧急联系人电话" className="form-item">
                {getFieldDecorator('urgentPhone', {
                  initialValue: urgentPhone,
                  rules: [{ required: true, message: '请输入正确的电话号码', pattern: /^1(3|4|5|6|7|8|9)\d{9}$/ }],
                  getValueFromEvent: getValueFromEventFirstNull
                })(
                  <Input maxLength={11} allowClear placeholder="请输入电话" />
                )}
              </Item>
            </Col>
            {hfwLoginNumShow && <Col span={6}>
              {dataSource !== '好饭碗' && ((userId === 0) || (userId !== 0 && codeitionShow))
                ? <Item {...itemLayoutThere}
                  validateStatus={this.errorsShow('hfwLoginNum') ? 'error' : ''}
                  help={this.errorsShow('hfwLoginNum') || ''}
                  label="好饭碗登录账号" className="form-item">
                  {getFieldDecorator('hfwLoginNum', {
                    initialValue: hfwLoginNum || contactWay,
                    rules: [{
                      required: true,
                      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                      message: '请输入正确的联系方式',
                      validator: validatorCommon
                    }],
                    getValueFromEvent: getValueFromEventFirstNull
                  })(
                    <Input maxLength={11} allowClear placeholder="请输入好饭碗登录账号" />
                  )}
                </Item> : <Item {...itemLayoutThere} label="好饭碗登录账号" className="form-item">
                  {getFieldDecorator('hfwLoginNum', { initialValue: hfwLoginNum || contactWay })(
                    <span className="detail">{hfwLoginNum || contactWay || '- - -'}</span>
                  )}
                </Item>}
            </Col>}
          </Row>
          <Divider/>
          <Row>
            <Col span={23} className='gutter-row-title'>
              <Icon component={IconPer2}></Icon><span>在职信息</span>
            </Col>
          </Row>
          {userId === 0 ? <div>
            <Row>
              <Col span={6}>
                <Item {...itemLayout}
                  validateStatus={this.errorsShow('projectId') ? 'error' : ''}
                  help={this.errorsShow('projectId') || ''}
                  label="项目" className="form-item">
                  {getFieldDecorator('projectId', {
                    initialValue: projectId,
                    rules: [{ required: true, message: '请选择项目' }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.projectOnchange} allowClear>
                      {projectAry.map((el:any) => (
                        <Select.Option key={el.projectId} value={el.projectId} title={el.projectName}>{el.projectName}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Item>
              </Col>
              {
                !jobRequired &&
                <Col span={6}>
                  <Item {...itemLayoutThere} label="工号" className="form-item">
                    {getFieldDecorator('projectNumber', {
                      initialValue: projectNumber,
                      rules: [
                        { validator: this.validatorProjectNumber }
                      ],
                      getValueFromEvent: getValueFromEventFirstNull
                    })(
                      <Input maxLength={14} type="text" allowClear placeholder="请输入工号" disabled={workCondition === '在职'}/>
                    )}
                  </Item>
                </Col>
              }
              {
                !jobRequired &&
                  <Col span={6}>
                    <Item {...itemLayoutThere}
                      validateStatus={this.errorsShow('roleType') ? 'error' : ''}
                      help={this.errorsShow('roleType') || ''}
                      label="员工类型" className="form-item">
                      {getFieldDecorator('roleType', {
                        initialValue: roleType,
                        rules: [{
                          required: true, message: '请选择员工类型'
                        }]
                      })(
                        <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.roleTypeChange} allowClear>
                          <Select.Option key="全职" value="全职">全职</Select.Option>
                          <Select.Option key="实习生" value="实习生">实习生</Select.Option>
                          <Select.Option key="小时工" value="小时工">小时工</Select.Option>
                          <Select.Option key="劳务工" value="劳务工">劳务工</Select.Option>
                          <Select.Option key="三方全职" value="三方全职">三方全职</Select.Option>
                          <Select.Option key="三方兼职" value="三方兼职">三方兼职</Select.Option>
                          <Select.Option key="个人承包" value="个人承包">个人承包</Select.Option>
                        </Select>
                      )}
                    </Item>
                  </Col>
              }
              {
                !jobRequired &&
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('positionId') ? 'error' : ''}
                    help={this.errorsShow('positionId') || ''}
                    label="职位" className="form-item">
                    {getFieldDecorator('positionId', {
                      initialValue: positionId,
                      rules: [{ required: jobRequired, message: '请选择职位' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                        {positionAry.map((el:any) => (
                          <Select.Option key={el.positionId}>{el.position}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Item>
                </Col>
              }
            </Row>
            {
              jobRequired &&
              <Row>
                <Col span={6}>
                  <Item {...itemLayout}
                    validateStatus={this.errorsShow('roleType') ? 'error' : ''}
                    help={this.errorsShow('roleType') || ''}
                    label="员工类型" className="form-item">
                    {getFieldDecorator('roleType', {
                      initialValue: roleType,
                      rules: [{
                        required: true, message: '请选择员工类型'
                      }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.roleTypeChange} allowClear>
                        <Select.Option key="全职" value="全职">全职</Select.Option>
                        <Select.Option key="实习生" value="实习生">实习生</Select.Option>
                        <Select.Option key="小时工" value="小时工">小时工</Select.Option>
                        <Select.Option key="劳务工" value="劳务工">劳务工</Select.Option>
                        <Select.Option key="三方全职" value="三方全职">三方全职</Select.Option>
                        <Select.Option key="三方兼职" value="三方兼职">三方兼职</Select.Option>
                        <Select.Option key="个人承包" value="个人承包">个人承包</Select.Option>
                      </Select>
                    )}
                  </Item>
                </Col>
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('rank') ? 'error' : ''}
                    help={this.errorsShow('rank') || ''}
                    label="职级" className="form-item">
                    {getFieldDecorator('rank', {
                      initialValue: rank ? String(rank) : undefined,
                      rules: [{ required: true, message: '请选择职级' }]
                    })(
                      <SearchInput
                        url={this.api.entryGetPositionList}
                        type={4}
                        placeholder="请选择"
                        param={{ orlevel: 1 }}
                        getSelected={this.getRank}
                      />
                    )}
                  </Item>
                </Col>
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('sequence') ? 'error' : ''}
                    help={this.errorsShow('sequence') || ''}
                    label="序列" className="form-item">
                    {getFieldDecorator('sequence', {
                      initialValue: sequence ? String(sequence) : undefined,
                      rules: [{ required: true, message: '请选择序列' }]
                    })(
                      <SearchInput
                        url={this.api.entryGetPositionList}
                        type={4}
                        placeholder="请选择"
                        param={{ orlevel: 2, parentId: getFieldValue('rank') }}
                        getSelected={this.getSequence}
                      />
                    )}
                  </Item>
                </Col>
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('officialRank') ? 'error' : ''}
                    help={this.errorsShow('officialRank') || ''}
                    label="职等" className="form-item">
                    {getFieldDecorator('officialRank', {
                      initialValue: officialRank ? String(officialRank) : undefined,
                      rules: [{ required: true, message: '请选择职等' }]
                    })(
                      <SearchInput
                        url={this.api.entryGetPositionList}
                        type={4}
                        placeholder="请选择"
                        param={{ orlevel: 3, parentId: getFieldValue('sequence') }}
                        getSelected={this.getOfficialRank}
                      />
                    )}
                  </Item>
                </Col>
              </Row>
            }
            <Row>
              <Col span={6}>
                <Item {...itemLayout}
                  validateStatus={this.errorsShow('job') ? 'error' : ''}
                  help={this.errorsShow('job') || ''}
                  label="工作岗位"
                  className={legalEntityAry.length > 0 ? 'form-item custom-select-width' : 'form-item'}>
                  {getFieldDecorator('job', {
                    initialValue: job,
                    rules: [{ required: jobRequired, message: '请选择工作岗位' }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                      {postAry.map((el:any, index:number) => (
                        <Select.Option key={index} value={el.id} >{el.name}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item {...itemLayoutThere}
                  validateStatus={this.errorsShow('entityId') ? 'error' : ''}
                  help={this.errorsShow('entityId') || ''}
                  label="法人主体"
                  className={legalEntityAry.length > 0 ? 'form-item custom-select-width' : 'form-item'}>
                  {getFieldDecorator('entityId', {
                    initialValue: entityId,
                    rules: [{ required: true, message: '请选择法人主体' }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.entityChange} allowClear>
                      {legalEntityAry.map((el:any, index:number) => (
                        <Select.Option title={el.entity} key={el.entityId} value={el.entityId}>{el.entity}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item {...itemLayoutThere}
                  validateStatus={this.errorsShow('organize') ? 'error' : ''}
                  help={this.errorsShow('organize') || ''}
                  label="组织"
                  className={origanAry.length > 0 ? 'form-item custom-select-width' : 'form-item'}>
                  {getFieldDecorator('organize', {
                    initialValue: organize,
                    rules: [{
                      required: true,
                      message: '请选择组织信息'
                    }]
                  })(
                    <Organization data={origanAry}/>
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item {...itemLayoutThere}
                  validateStatus={this.errorsShow('entryTime') ? 'error' : ''}
                  help={this.errorsShow('entryTime') || ''}
                  label="入职日期" className="form-item">
                  {getFieldDecorator('entryTime', {
                    initialValue: entryTime ? moment(entryTime, 'YYYY-MM-DD') : undefined,
                    rules: [{
                      required: true, message: '请选择日期'
                    }]
                  })(
                    <DatePicker placeholder="请选择日期" allowClear showToday={false} suffixIcon={(<img src={date}/>)}/>
                  )}
                </Item>
              </Col>
            </Row>
          </div> : <div>
            <Row>
              {
                !codeitionShow
                  ? <Col span={6}>
                    <Item {...itemLayout} label="项目" className="form-item">
                      <span className="detail">{projectName || '- - -'}</span>
                    </Item>
                  </Col>
                  : <Col span={6}>
                    <Item {...itemLayout}
                      validateStatus={this.errorsShow('projectId') ? 'error' : ''}
                      help={this.errorsShow('projectId') || ''}
                      label="项目" className="form-item">
                      {getFieldDecorator('projectId', {
                        initialValue: projectId,
                        rules: [{ required: true, message: '请选择项目' }]
                      })(
                        <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.projectOnchange} allowClear>
                          {projectAry.map((el:any) => (
                            <Select.Option key={el.projectId} value={el.projectId} title={el.projectName}>{el.projectName}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Item>
                  </Col>
              }
              {
                jobRequired
                  ? <Col span={6}>
                    <Item {...itemLayoutThere} label="工号" className="form-item">
                      <span className="detail">{projectNumber || '- - -'}</span>
                    </Item>
                  </Col>
                  : <Col span={6}>
                    <Item {...itemLayoutThere} label="工号" className="form-item">
                      {getFieldDecorator('projectNumber', {
                        initialValue: projectNumber,
                        rules: [
                          { validator: this.validatorProjectNumber }
                        ],
                        getValueFromEvent: getValueFromEventFirstNull
                      })(
                        <Input maxLength={14} type="text" allowClear placeholder="请输入工号" />
                      )}
                    </Item>
                  </Col>
              }
              {
                !jobRequired && <div>
                  {
                    !codeitionShow
                      ? <Col span={6}>
                        <Item {...itemLayoutThere} label="员工类型" className="form-item">
                          <span className="detail">{roleType || '- - -'}</span>
                        </Item>
                      </Col>
                      : <Col span={6}>
                        <Item {...itemLayoutThere}
                          validateStatus={this.errorsShow('roleType') ? 'error' : ''}
                          help={this.errorsShow('roleType') || ''}
                          label="员工类型" className="form-item">
                          {getFieldDecorator('roleType', {
                            initialValue: roleType,
                            rules: [{
                              required: true, message: '请选择员工类型'
                            }]
                          })(
                            <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.roleTypeChange} allowClear>
                              <Select.Option key="全职" value="全职">全职</Select.Option>
                              <Select.Option key="实习生" value="实习生">实习生</Select.Option>
                              <Select.Option key="小时工" value="小时工">小时工</Select.Option>
                              <Select.Option key="劳务工" value="劳务工">劳务工</Select.Option>
                              <Select.Option key="三方全职" value="三方全职">三方全职</Select.Option>
                              <Select.Option key="三方兼职" value="三方兼职">三方兼职</Select.Option>
                              <Select.Option key="个人承包" value="个人承包">个人承包</Select.Option>
                            </Select>
                          )}
                        </Item>
                      </Col>
                  }
                </div>
              }
              {/* {
                (!codeitionShow && !jobRequired)
                  ? <Col span={6}>
                    <Item {...itemLayoutThere} label="员工类型" className="form-item">
                      <span className="detail">{roleType || '- - -'}</span>
                    </Item>
                  </Col>
                  : <Col span={6}>
                    <Item {...itemLayoutThere}
                      validateStatus={this.errorsShow('roleType') ? 'error' : ''}
                      help={this.errorsShow('roleType') || ''}
                      label="员工类型" className="form-item">
                      {getFieldDecorator('roleType', {
                        initialValue: roleType,
                        rules: [{
                          required: true, message: '请选择员工类型'
                        }]
                      })(
                        <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.roleTypeChange} allowClear>
                          <Select.Option key="全职" value="全职">全职</Select.Option>
                          <Select.Option key="实习生" value="实习生">实习生</Select.Option>
                          <Select.Option key="小时工" value="小时工">小时工</Select.Option>
                          <Select.Option key="劳务工" value="劳务工">劳务工</Select.Option>
                          <Select.Option key="三方全职" value="三方全职">三方全职</Select.Option>
                          <Select.Option key="三方兼职" value="三方兼职">三方兼职</Select.Option>
                          <Select.Option key="个人承包" value="个人承包">个人承包</Select.Option>
                        </Select>
                      )}
                    </Item>
                  </Col>
              } */}
              {
                !jobRequired &&
                  <Col span={6}>
                    <Item {...itemLayoutThere}
                      validateStatus={this.errorsShow('positionId') ? 'error' : ''}
                      help={this.errorsShow('positionId') || ''}
                      label="职位" className="form-item">
                      {getFieldDecorator('positionId', {
                        initialValue: positionId === null ? undefined : positionId,
                        rules: [{ required: jobRequired, message: '请选择职位' }]
                      })(
                        <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                          {positionAry.map((el:any) => (
                            <Select.Option key={el.positionId} value={el.positionId}>{el.position}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Item>
                  </Col>
              }
            </Row>
            {
              jobRequired && <Row>
                {
                  !codeitionShow
                    ? <Col span={6}>
                      <Item {...itemLayout} label="员工类型" className="form-item">
                        <span className="detail">{roleType || '- - -'}</span>
                      </Item>
                    </Col>
                    : <Col span={6}>
                      <Item {...itemLayout}
                        validateStatus={this.errorsShow('roleType') ? 'error' : ''}
                        help={this.errorsShow('roleType') || ''}
                        label="员工类型" className="form-item">
                        {getFieldDecorator('roleType', {
                          initialValue: roleType,
                          rules: [{
                            required: true, message: '请选择员工类型'
                          }]
                        })(
                          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.roleTypeChange} allowClear>
                            <Select.Option key="全职" value="全职">全职</Select.Option>
                            <Select.Option key="实习生" value="实习生">实习生</Select.Option>
                            <Select.Option key="小时工" value="小时工">小时工</Select.Option>
                            <Select.Option key="劳务工" value="劳务工">劳务工</Select.Option>
                            <Select.Option key="三方全职" value="三方全职">三方全职</Select.Option>
                            <Select.Option key="三方兼职" value="三方兼职">三方兼职</Select.Option>
                            <Select.Option key="个人承包" value="个人承包">个人承包</Select.Option>
                          </Select>
                        )}
                      </Item>
                    </Col>
                }
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('rank') ? 'error' : ''}
                    help={this.errorsShow('rank') || ''}
                    label="职级" className="form-item">
                    {getFieldDecorator('rank', {
                      initialValue: rank ? String(rank) : undefined,
                      rules: [{ required: true, message: '请选择职级' }]
                    })(
                      <SearchInput
                        url={this.api.entryGetPositionList}
                        type={4}
                        placeholder="请选择"
                        param={{ orlevel: 1 }}
                        getSelected={this.getRank}
                      />
                    )}
                  </Item>
                </Col>
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('sequence') ? 'error' : ''}
                    help={this.errorsShow('sequence') || ''}
                    label="序列" className="form-item">
                    {getFieldDecorator('sequence', {
                      initialValue: sequence ? String(sequence) : undefined,
                      rules: [{ required: true, message: '请选择序列' }]
                    })(
                      <SearchInput
                        url={this.api.entryGetPositionList}
                        type={4}
                        placeholder="请选择"
                        param={{ orlevel: 2, parentId: getFieldValue('rank') }}
                        getSelected={this.getSequence}
                      />
                    )}
                  </Item>
                </Col>
                <Col span={6}>
                  <Item {...itemLayoutThere}
                    validateStatus={this.errorsShow('officialRank') ? 'error' : ''}
                    help={this.errorsShow('officialRank') || ''}
                    label="职等" className="form-item">
                    {getFieldDecorator('officialRank', {
                      initialValue: officialRank ? String(officialRank) : undefined,
                      rules: [{ required: true, message: '请选择职等' }]
                    })(
                      <SearchInput
                        url={this.api.entryGetPositionList}
                        type={4}
                        placeholder="请选择"
                        param={{ orlevel: 3, parentId: getFieldValue('sequence') }}
                        getSelected={this.getOfficialRank}
                      />
                    )}
                  </Item>
                </Col>
              </Row>
            }
            <Row>
              {
                !codeitionShow
                  ? <Col span={6}>
                    <Item {...itemLayout} label="法人主体" className="form-item">
                      <span className="detail">{entity || '- - -'}</span>
                    </Item>
                  </Col>
                  : <Col span={6}>
                    <Item {...itemLayout}
                      validateStatus={this.errorsShow('entityId') ? 'error' : ''}
                      help={this.errorsShow('entityId') || ''}
                      label="法人主体"
                      className={legalEntityAry.length > 0 ? 'form-item custom-select-width' : 'form-item'}>
                      {getFieldDecorator('entityId', {
                        initialValue: entityId,
                        rules: [{ required: true, message: '请选择法人主体' }]
                      })(
                        <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.entityChange} allowClear>
                          {legalEntityAry.map((el:any, index:number) => (
                            <Select.Option title={el.entity} key={el.entityId} value={el.entityId}>{el.entity}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Item>
                  </Col>
              }
              <Col span={6}>
                <Item {...itemLayoutThere} label="管理编号" className="form-item">
                  <span className="detail">{sjNumber || '- - -'}</span>
                </Item>
              </Col>
              {
                !codeitionShow
                  ? <Col span={6}>
                    <Item {...itemLayoutThere} label="组织" className="form-item">
                      <span className="detail">{organize || '- - -'}</span>
                    </Item>
                  </Col>
                  : <Col span={6}>
                    <Item {...itemLayoutThere}
                      validateStatus={this.errorsShow('organize') ? 'error' : ''}
                      help={this.errorsShow('organize') || ''}
                      label="组织"
                      className={origanAry.length > 0 ? 'form-item custom-select-width' : 'form-item'}>
                      {getFieldDecorator('organize', {
                        initialValue: organize,
                        rules: [{
                          required: true,
                          message: '请选择组织信息'
                        }]
                      })(
                        <Organization data={origanAry}/>
                      )}
                    </Item>
                  </Col>
              }
              <Col span={6}>
                {codeitionShow ? <Item {...itemLayoutThere}
                  validateStatus={this.errorsShow('entryTime') ? 'error' : ''}
                  help={this.errorsShow('entryTime') || ''}
                  label="入职日期" className="form-item">
                  {getFieldDecorator('entryTime', {
                    initialValue: entryTime ? moment(entryTime, 'YYYY-MM-DD') : undefined,
                    rules: [{
                      required: true, message: '请选择日期'
                    }]
                  })(
                    <DatePicker placeholder="请选择日期" allowClear showToday={false} suffixIcon={(<img src={date}/>)}/>
                  )}
                </Item> : <Item {...itemLayoutThere} label="入职日期" className="form-item">
                  {getFieldDecorator('entryTime', {
                    initialValue: entryTime ? moment(entryTime, 'YYYY-MM-DD') : undefined
                  })(<span className="detail">{entryTime || '- - -'}</span>)}
                </Item>}
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                {codeitionShow ? <Item {...itemLayout}
                  validateStatus={this.errorsShow('job') ? 'error' : ''}
                  help={this.errorsShow('job') || ''}
                  label="工作岗位" className='form-item'>
                  {getFieldDecorator('job', {
                    initialValue: job,
                    rules: [{ required: jobRequired, message: '请选择工作岗位' }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" allowClear>
                      {postAry.map((el:any, index:number) => (
                        <Select.Option key={index} value={el.id} >{el.name}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Item> : <Item {...itemLayout} label="工作岗位" className="form-item">
                  {getFieldDecorator('job', {
                    initialValue: job
                  })(<span className="detail">{jobName || '- - -'}</span>)}
                </Item>}
              </Col>
              <Col span={6}>
                <Item {...itemLayoutThere} label="在职状态" className="form-item">
                  <span className="detail">{workCondition || '- - -'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item {...itemLayoutThere} label="离职日期" className="form-item">
                  <span className="detail">{quitTime || '- - -'}</span>
                </Item>
              </Col>
            </Row>
          </div>}
          {getFieldDecorator('hrsFamilyList', {
            initialValue: hrsFamilyList
          })(<CustomeFamily/>)}
          {getFieldDecorator('hrsEducationList', {
            initialValue: hrsEducationList
          })(<CustomeEducatory />)}
          {getFieldDecorator('hrsWorkExperienceList', {
            initialValue: hrsWorkExperienceList
          })(<CustomWork />)}
          {getFieldDecorator('hrsCertificateList', {
            initialValue: hrsCertificateList
          })(<CustomeCertificate />)}
          {/** 其他信息 */}
          <Divider/>
          <Row>
            <Col span={23} className='gutter-row-title'>
              <Icon component={IconPer6}/><span>其他信息</span><span>(非必填)</span>
              <div className='waring-title'>
                <Icon component={IconFill}/>
                <span>若未上传毕业证、户口本、退工单等照片信息，所造成的用工风险由本次操作者承担！</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={23}>
              <Row className="gutter-row" style={{ padding: `0.05rem 0` }}>
                <Col span={4} offset={2}>
                  <Item {...itemLayout} className="form-item-inline">
                    {getFieldDecorator('diplomaImg', {
                      initialValue: diplomaImg
                    })(
                      <Upload backgroundImage={other1} bgImageStyle={{ width: '0.74rem', height: '0.47rem' }}
                        images={diplomaImg ? diplomaImgUrl : undefined}
                        width={'0.94rem'} height={'0.65rem'} placeholder='毕业证照片' backgroundColor='white' />
                    )}
                  </Item>
                </Col>
                <Col span={4}>
                  <Item {...itemLayout} className="form-item-inline">
                    {getFieldDecorator('householdImg', {
                      initialValue: householdImg
                    })(
                      <Upload backgroundImage={other2} bgImageStyle={{ width: '0.74rem', height: '0.43rem' }}
                        images={householdImg ? householdImgUrl : undefined}
                        width={'0.94rem'} height={'0.65rem'} placeholder='户口本首页' backgroundColor='white' />
                    )}
                  </Item>
                </Col>
                <Col span={4}>
                  <Item {...itemLayout} className="form-item-inline">
                    {getFieldDecorator('householdSelfImg', {
                      initialValue: householdSelfImg
                    })(
                      <Upload backgroundImage={other2} bgImageStyle={{ width: '0.74rem', height: '0.43rem' }}
                        images={householdSelfImg ? householdSelfImgUrl : undefined}
                        width={'0.94rem'} height={'0.65rem'} placeholder='户口本本人页' backgroundColor='white' />
                    )}
                  </Item>
                </Col>
                <Col span={4}>
                  <Item {...itemLayout} className="form-item-inline">
                    {getFieldDecorator('returnSheetImg', {
                      initialValue: returnSheetImg
                    })(
                      <Upload backgroundImage={other3} bgImageStyle={{ width: '0.68rem', height: '0.5rem' }}
                        images={returnSheetImg ? returnSheetImgUrl : undefined}
                        width={'0.94rem'} height={'0.65rem'} placeholder='退工单照片' backgroundColor='white' />
                    )}
                  </Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider/>
          { userId === 0 ? <Item>
            <Button disabled={hasErrors(getFieldsError()) || disableBtn} type="primary" htmlType="submit" style={{ width: 160 }}>确定</Button>
            <Button className="ant_button_cancel" onClick={this.handleBack}
              style={{ width: 160, marginLeft: 30 }}>取消</Button>
          </Item> : <Item>
            {isAuthenticated(AuthorityList.entry[5]) && <Button disabled={hasErrors(getFieldsError()) || disableBtn}
              type="primary" htmlType="submit" style={{ width: 160 }}>保存</Button>}
            {isAuthenticated(AuthorityList.entry[9]) && workCondition === '待入职' && dataSource === '好饭碗' && <Button disabled={hasErrors(getFieldsError()) || disableBtn}
              onClick={this.rejectModal.bind(this, 1)} type="primary" style={{ width: 160, marginLeft: 30 }}>驳回</Button> }
            <Button className={isAuthenticated(AuthorityList.entry[5]) ? 'ant_button_cancel' : 'ant_button_auth'} onClick={this.handleBack}
              style={{ width: 160 }}>
              返回</Button>
          </Item> }
        </Form>
        {/* 模态框 */}
        <BasicModalNew visible={visibleModal} onCancel={this.handelModal}>
          {this.handleModalKey === 0 && <Row style={{ padding: '0.156rem 0 0.2rem', textAlign: 'center' }}>
            <span>{errorMsg}</span>
          </Row>}
          {this.handleModalKey === 2 && <Row style={{ padding: '0.156rem 0.286rem' }}>
            <p style={{ width: '1.828rem' }}>{errorMsg}</p>
          </Row>}
          {this.handleModalKey === 0 && <Row style={{ textAlign: 'center' }}>
            <Button onClick={this.handelModal.bind(this, 0)} type="primary">知道了</Button>
          </Row>}
          {this.handleModalKey === 2 && <Row>
            <Button onClick={this.handelModal.bind(this, this.handleModalKey)} type="primary">仍新增</Button>
            <Button onClick={this.handelModal.bind(this, 0)} type="primary">放弃</Button>
          </Row>}
        </BasicModalNew>
        {userId === 0 ? <Prompt when={true} message="entry_info"></Prompt> : null}
        <RejectModal userId={userId} visible={visibleReject} onCancel={this.rejectModal}/>
      </div>
    )
  }
}

export default Form.create<FormItemProps>({
  name: 'entry_from',
  onValuesChange ({ match }:any, changedValues:any, allValues:any) {
    let userId = match.params.id || 0
    let values = SysUtil.getSessionStorage('entry_info')
    if (values && values['entity']) allValues['entity'] = values['entity']
    if (userId === 0) SysUtil.setSessionStorage('entry_info', allValues)
  }
})(FormItem)
