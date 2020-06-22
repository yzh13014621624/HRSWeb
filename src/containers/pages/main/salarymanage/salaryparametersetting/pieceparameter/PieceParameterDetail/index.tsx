/*
 * @description: 参数维护---工资标准组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 14:15:15
 * @LastEditTime: 2020-05-28 10:20:12
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Popover, Col, Table } from 'antd'
import { BaseProps } from 'typings/global'
import { HttpUtil } from '@utils/index'
import moment from 'moment'
import locationimg from '@assets/images/icon/location.png'
import DynamicForm from '../dynamicform'
import './index.styl'
import { ANT_MARK } from 'antd/lib/locale-provider'

interface FormProps extends BaseProps, FormComponentProps{
  piProjectId: number // 计件项目id
  ppId: number // 计件id
  status: number // 页面状态
  allFormData: any[] // 最终传给后端的
  allInformation: any[] // 详情的数据
  btnStatusOne: boolean // 确定按钮的状态
  btnStatusTwo: boolean // 确定按钮的状态
  btnStatusThree: boolean // 确定按钮的状态
  btnStatusFour: boolean // 确定按钮的状态
  btnStatusFive: boolean // 确定按钮的状态
  btnStatusSix: boolean // 确定按钮的状态
  btnStatusSeven: boolean // 确定按钮的状态
  btnStatusEight: boolean // 确定按钮的状态
  btnStatusNine: boolean // 确定按钮的状态
  btnStatusTen: boolean // 确定按钮的状态
  btnStatusEleven: boolean // 确定按钮的状态
  information1: any[] // 第1个动态表单的值
  information2: any[] // 第2个动态表单的值
  information3: any[] // 第3个动态表单的值
  information4: any[] // 第4个动态表单的值
  information5: any[] // 第5个动态表单的值
  information6: any[] // 第6个动态表单的值
  information7: any[] // 第7个动态表单的值
  information8: any[] // 第8个动态表单的值
  information9: any[] // 第9个动态表单的值
  information10: any[] // 第10个动态表单的值
  information11: any[] // 第11个动态表单的值
}

class PieceParameterDetail extends RootComponent<FormProps, any> {
  dynamicFormOne = React.createRef<any>()
  dynamicFormTwo = React.createRef<any>()
  dynamicFormThree = React.createRef<any>()
  dynamicFormFour = React.createRef<any>()
  dynamicFormFive = React.createRef<any>()
  dynamicFormSix = React.createRef<any>()
  dynamicFormSeven = React.createRef<any>()
  dynamicFormEight = React.createRef<any>()
  dynamicFormNine = React.createRef<any>()
  dynamicFormTen = React.createRef<any>()
  dynamicFormEleven = React.createRef<any>()
  constructor (props: FormProps) {
    super(props)
    this.state = {
      piProjectId: undefined,
      ppId: undefined,
      status: undefined,
      allFormData: [],
      allInformation: [],
      btnStatusOne: false,
      btnStatusTwo: false,
      btnStatusThree: false,
      btnStatusFour: false,
      btnStatusFive: false,
      btnStatusSix: false,
      btnStatusSeven: false,
      btnStatusEight: false,
      btnStatusNine: false,
      btnStatusTen: false,
      btnStatusEleven: false,
      information1: [],
      information2: [],
      information3: [],
      information4: [],
      information5: [],
      information6: [],
      information7: [],
      information8: [],
      information9: [],
      information10: [],
      information11: []
    }
  }

  componentDidMount = async () => {
    const { piProjectId, ppId, status } = HttpUtil.parseUrl(this.props.location.search)
    await this.setState({
      piProjectId: Number(piProjectId),
      ppId: Number(ppId),
      status: Number(status)
    })
    this.axios.request(this.api.getParameterInfo, { piProjectId }).then(({ data }) => {
      this.setState({ allInformation: data })
      status === '2' && data.ppDataList.map((item: any) => {
        this.processingData(item.ppInfoList, item.type)
      })
    })
  }

  processingData = (value: any, type: any) => {
    let arr1: any[] = []
    let arr2: any[] = []
    let arr3: any[] = []
    let arr4: any[] = []
    let arr5: any[] = []
    let arr6: any[] = []
    let arr7: any[] = []
    let arr8: any[] = []
    let arr9: any[] = []
    let arr10: any[] = []
    let arr11: any[] = []
    let ppMin: any[] = []
    let ppMax: any[] = []
    let ppPrice: any[] = []
    value.map((item: any) => {
      ppMin.push(item.ppMin)
      ppMax.push(item.ppMax)
      ppPrice.push(item.ppPrice)
    })
    switch (type) {
      case 1: arr1.push(ppMin); arr1.push(ppMax); arr1.push(ppPrice); this.setState({ information1: arr1 }); break
      case 2: arr2.push(ppMin); arr2.push(ppMax); arr2.push(ppPrice); this.setState({ information2: arr2 }); break
      case 3: arr3.push(ppMin); arr3.push(ppMax); arr3.push(ppPrice); this.setState({ information3: arr3 }); break
      case 4: arr4.push(ppMin); arr4.push(ppMax); arr4.push(ppPrice); this.setState({ information4: arr4 }); break
      case 5: arr5.push(ppMin); arr5.push(ppMax); arr5.push(ppPrice); this.setState({ information5: arr5 }); break
      case 6: arr6.push(ppMin); arr6.push(ppMax); arr6.push(ppPrice); this.setState({ information6: arr6 }); break
      case 7: arr7.push(ppMin); arr7.push(ppMax); arr7.push(ppPrice); this.setState({ information7: arr7 }); break
      case 8: arr8.push(ppMin); arr8.push(ppMax); arr8.push(ppPrice); this.setState({ information8: arr8 }); break
      case 9: arr9.push(ppMin); arr9.push(ppMax); arr9.push(ppPrice); this.setState({ information9: arr9 }); break
      case 10: arr10.push(ppMin); arr10.push(ppMax); arr10.push(ppPrice); this.setState({ information10: arr10 }); break
      case 11: arr11.push(ppMin); arr11.push(ppMax); arr11.push(ppPrice); this.setState({ information11: arr11 }); break
    }
  }

  // 确定按钮
  confirmBtn = () => {
    this.setState({ allFormData: [] }, () => {
      const dynamicFormOne = this.dynamicFormOne.current!.getFieldsValue()
      this.disposeData(dynamicFormOne, 1)
      const dynamicFormTwo = this.dynamicFormTwo.current!.getFieldsValue()
      this.disposeData(dynamicFormTwo, 2)
      const dynamicFormThree = this.dynamicFormThree.current!.getFieldsValue()
      this.disposeData(dynamicFormThree, 3)
      const dynamicFormFour = this.dynamicFormFour.current!.getFieldsValue()
      this.disposeData(dynamicFormFour, 4)
      const dynamicFormFive = this.dynamicFormFive.current!.getFieldsValue()
      this.disposeData(dynamicFormFive, 5)
      const dynamicFormSix = this.dynamicFormSix.current!.getFieldsValue()
      this.disposeData(dynamicFormSix, 6)
      const dynamicFormSeven = this.dynamicFormSeven.current!.getFieldsValue()
      this.disposeData(dynamicFormSeven, 7)
      const dynamicFormEight = this.dynamicFormEight.current!.getFieldsValue()
      this.disposeData(dynamicFormEight, 8)
      const dynamicFormNine = this.dynamicFormNine.current!.getFieldsValue()
      this.disposeData(dynamicFormNine, 9)
      const dynamicFormTen = this.dynamicFormTen.current!.getFieldsValue()
      this.disposeData(dynamicFormTen, 10)
      const dynamicFormEleven = this.dynamicFormEleven.current!.getFieldsValue()
      this.disposeData(dynamicFormEleven, 11)
      setTimeout(() => {
        this.testData()
      }, 100)
    })
  }

  // 处理表单的数据处理成满足后端的格式
  disposeData = (value: any, type: number) => {
    const { piProjectId, ppId, allFormData, status } = this.state
    let { keys, reqppMin, reqppMax, reqppPrice } = value
    reqppMin = reqppMin ? ['0', ...this.removeEmpty(reqppMin)] : ['0']
    reqppMax = this.removeEmpty(reqppMax)
    reqppPrice = this.removeEmpty(reqppPrice)
    const parameterList: any[] = []
    for (let i = 0; i < keys.length; i++) {
      parameterList.push({
        ppMin: reqppMin[i] && Number(reqppMin[i]),
        ppMax: reqppMax[i] && Number(reqppMax[i]),
        ppPrice: reqppPrice[i] && Number(reqppPrice[i]),
        ppId: (status === 2) ? ppId : undefined
      })
    }
    allFormData.push({ parameterList, type })
    for (let i = 0; i < allFormData.length; i++) {
      if (allFormData[i].type === type) {
        allFormData.splice(i, 1)
      }
    }
    allFormData.push({ parameterList, type })
    this.setState({ allFormData: [] })
    const dynamicFormOneParam = {
      piProjectId,
      ppId: (status === 2) ? ppId : undefined,
      list: allFormData
    }
    this.setState({ allFormData: [ dynamicFormOneParam ] })
  }

  // 检验填写的数据是否符合要求
  testData = async () => {
    const { allFormData } = await this.state
    const arr = allFormData[0].list
    let flag1 = false
    let flag2 = false
    for (let i = 0; i < arr.length; i++) {
      // 判断数量区间是否连续---如果是提示数量区间不连续！true---不连续 false---连续
      for (let j = 0; j < arr[i].parameterList.length - 1; j++) {
        if (arr[i].parameterList[j].ppMax !== arr[i].parameterList[j + 1].ppMin) {
          flag1 = true
        }
      }
      // 判断区间的数量上限是否小于等于下限---如果是提示区间的数量上限不能小于等于下限！true---不满足 false---满足
      for (let k = 0; k < arr[i].parameterList.length; k++) {
        if (arr[i].parameterList[k].ppMin >= arr[i].parameterList[k].ppMax) {
          flag2 = true
        }
      }
    }
    if (flag1) {
      this.$message.error('数量区间不连续！')
      return
    }
    if (flag2) {
      this.$message.error('区间的数量上限不能小于等于下限！')
      return
    }
    this.addOrEditorRequest()
  }

  // 新增和修改开始请求接口的事件
  addOrEditorRequest = () => {
    const { allFormData, status } = this.state
    this.axios.request(this.api.insertInsuredInfo, ...allFormData).then(({ code }) => {
      if (code === 200) {
        this.$message.success('保存成功')
        this.props.history.push(`/home/salaryparametersetting?tabValue=${3}`)
      }
    })
  }

  // 取消按钮
  cancelBtn = () => {
    Modal.confirm({
      title: '您正在编辑信息，是否确认离开?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => (this.props.history.push(`/home/salaryparametersetting?tabValue=${3}`))
    })
  }

  // 通过表单必填项的输入来改变确定按钮的状态
  changeBtnStatusOne = (btnStatus: boolean) => this.setState({ btnStatusOne: btnStatus })
  changeBtnStatusTwo = (btnStatus: boolean) => this.setState({ btnStatusTwo: btnStatus })
  changeBtnStatusThree = (btnStatus: boolean) => this.setState({ btnStatusThree: btnStatus })
  changeBtnStatusFour = (btnStatus: boolean) => this.setState({ btnStatusFour: btnStatus })
  changeBtnStatusFive = (btnStatus: boolean) => this.setState({ btnStatusFive: btnStatus })
  changeBtnStatusSix = (btnStatus: boolean) => this.setState({ btnStatusSix: btnStatus })
  changeBtnStatusSeven = (btnStatus: boolean) => this.setState({ btnStatusSeven: btnStatus })
  changeBtnStatusEight = (btnStatus: boolean) => this.setState({ btnStatusEight: btnStatus })
  changeBtnStatusNine = (btnStatus: boolean) => this.setState({ btnStatusNine: btnStatus })
  changeBtnStatusTen = (btnStatus: boolean) => this.setState({ btnStatusTen: btnStatus })
  changeBtnStatusEleven = (btnStatus: boolean) => this.setState({ btnStatusEleven: btnStatus })

  // 去除数组中的空元素
  removeEmpty = (arr: any) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === undefined || !arr[i]) {
        arr.splice(i, 1)
        i = i - 1
      }
    }
    return arr
  }

  render () {
    let {
      allInformation, btnStatusOne, btnStatusTwo, btnStatusThree, btnStatusFour, btnStatusFive, btnStatusSix, btnStatusSeven,
      btnStatusEight, btnStatusNine, btnStatusTen, btnStatusEleven, information1, information2, information3, information4,
      information5, information6, information7, information8, information9, information10, information11, status
    } = this.state
    const { AuthorityList, isAuthenticated } = this
    let statusNum = 0
    btnStatusOne && (statusNum += 1)
    btnStatusTwo && (statusNum += 1)
    btnStatusThree && (statusNum += 1)
    btnStatusFour && (statusNum += 1)
    btnStatusFive && (statusNum += 1)
    btnStatusSix && (statusNum += 1)
    btnStatusSeven && (statusNum += 1)
    btnStatusEight && (statusNum += 1)
    btnStatusNine && (statusNum += 1)
    btnStatusTen && (statusNum += 1)
    btnStatusEleven && (statusNum += 1)
    status === 2 && !btnStatusOne && !btnStatusTwo && !btnStatusThree && !btnStatusFour && !btnStatusFive && !btnStatusSix && !btnStatusSeven && !btnStatusEight && !btnStatusNine && !btnStatusTen && !btnStatusEleven && (statusNum = 11)
    const btnStatus = (statusNum === 11 ? !1 : !0)
    return (
      <div className='pieceparameterdetail'>
        <Row className='warehouse'>
          <p>{allInformation.pipName}</p>
          <p><img src={locationimg} />{allInformation.pipAddress}</p>
        </Row>
        <Row className='bigbox'>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormOne}
              title='收货（每托盘/单价）'
              changeBtnStatus={this.changeBtnStatusOne}
              information={information1}/>
          </Col>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormTwo}
              title='上架（每托盘/单价）'
              changeBtnStatus={this.changeBtnStatusTwo}
              information={information2}/>
          </Col>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormThree}
              title='补货（每托盘/单价）'
              changeBtnStatus={this.changeBtnStatusThree}
              information={information3}/>
          </Col>
        </Row>
        <Row className='bigbox'>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormFour}
              title='整箱拣货-标签拣选（每箱/单价）'
              changeBtnStatus={this.changeBtnStatusFour}
              information={information4}/>
          </Col>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormFive}
              title='整箱拣货-RF拣选（每箱/单价）'
              changeBtnStatus={this.changeBtnStatusFive}
              information={information5}/>
          </Col>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormSix}
              title='整箱拣货-RF拣选（每行/单价）'
              changeBtnStatus={this.changeBtnStatusSix}
              information={information6}/>
          </Col>
        </Row>
        <Row className='bigbox'>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormSeven}
              title='拆零拣货（单价）'
              changeBtnStatus={this.changeBtnStatusSeven}
              information={information7}/>
          </Col>

          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormEight}
              title='拆零上架（每托盘/单价）'
              changeBtnStatus={this.changeBtnStatusEight}
              information={information8}/>
          </Col>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormNine}
              title='拆零下架（每托盘/单价）'
              changeBtnStatus={this.changeBtnStatusNine}
              information={information9}/>
          </Col>
        </Row>
        <Row className='bigbox'>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormTen}
              title='越库（每箱/单价）'
              changeBtnStatus={this.changeBtnStatusTen}
              information={information10}/>
          </Col>
          <Col className='box'>
            <DynamicForm
              ref={this.dynamicFormEleven}
              title='移库（每托盘/单价）'
              changeBtnStatus={this.changeBtnStatusEleven}
              information={information11}/>
          </Col>
        </Row>
        <Row className='action'>
          <Col>
            {isAuthenticated(AuthorityList.salaryparametersetting[5]) &&
              <Button className={ !btnStatus ? 'actionbtn confirmbtn' : 'actionbtn distableconfirmbtn' } onClick={this.confirmBtn} disabled={btnStatus}>确定</Button>
            }
            <Button className='actionbtn cancelbtn' onClick={this.cancelBtn}>{isAuthenticated(AuthorityList.salaryparametersetting[5]) ? '取消' : '返回'}</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Form.create<FormProps>()(PieceParameterDetail)
