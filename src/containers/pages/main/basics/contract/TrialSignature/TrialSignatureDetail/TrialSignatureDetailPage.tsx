/**
 * @author maqian
 * @createTime 2019/04/02
 * @description 初签合同详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, Button, Spin, Row, Col, Divider } from 'antd'
import './TrialSignatureDetailPage.styl'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil } from '@utils/index'

import BaseScanedFiles from '../../components/Contract/ScanedFiles'
import BasePDF from '../../components/Contract/PDF'
import BaseContract from '../../components/Contract/Contract'

const itemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }

interface ImgItem {
  uid: number
  url: string
  tempUrl: string
  file?: File
}
interface TrialSignatureDetailPageProps extends FormComponentProps {
  // Contract: any
  location?:any
  history?:any
}
@hot(module) // 热更新（局部刷新界面）
class TrialSignatureDetailPage extends RootComponent<TrialSignatureDetailPageProps, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      loading: false,
      id: '',
      userId: '',
      disabled: false, // 提交按钮禁用
      listArr: [] // 获取用户详情的数据
    }
  }
  routerLink = (path:string) => {
    this.props.history.push(path)
  }
  // 转换图片和 pdf 文件格式，用于上传组件
  handleTranformPicAndPdf (data: any) {
    let { images, contractPdf, contractPdfUrl } = data
    if (images) {
      images = images.map((item: any, i: number) => {
        const { imageOssUrl, imageUrl } = item
        return {
          url: imageOssUrl,
          tempUrl: imageUrl,
          uid: i,
          file: undefined
        }
      })
    } else {
      images = []
    }
    if (contractPdf) {
      contractPdf = [{
        url: contractPdfUrl,
        tempUrl: contractPdf,
        uid: 0,
        file: undefined
      }]
    } else {
      contractPdf = []
    }
    data.images = images
    data.contractPdf = contractPdf
    return data
  }
  // 处理合同图片
  handleContractPics = async (fileList: ImgItem[], id: string) => {
    const formData = new FormData()
    let imageAry:any = []
    const { insertOssUpload } = this.api
    // 创建对象的信息
    if (fileList) {
      fileList.forEach(item => {
        const { file, tempUrl } = item
        if (file) {
          formData.append('file', file, file.name)
        } else {
          imageAry.push(tempUrl)
        }
      })
    }
    formData.append('userId', id)
    const { data: { code, data, msg } } = await this.axios.upload({
      method: 'post',
      url: insertOssUpload.path,
      data: formData
    })
    return [...imageAry, ...data]
  }

  // 处理合同 pdf 文件
  handleContractPdf = (fileList: ImgItem[]) => {
    if (fileList && fileList.length) return fileList[0].tempUrl
    return ''
  }
  handleSumbit = async () => {
    this.setState({
      disabled: true
    })
    let data = this.props.form.getFieldsValue()
    const { id, userId } = this.state
    let dataParm: any = {
      id: id
    }
    const contractPicList = await this.handleContractPics(data.images, userId)
    const contractPdf = this.handleContractPdf(data.pdf)
    dataParm.images = contractPicList
    dataParm.contractPdf = contractPdf
    // 提交发起请求
    this.axios.request(this.api.contractDetial, dataParm).then((res:any) => {
      if (res.code === 200) {
        this.$message.success('保存成功')
        SysUtil.clearSession('TrialDataDetail')
      }
      this.routerLink('/home/ContractPage?key=2')
    }).catch((err: any) => {
      this.error(err.msg[0])
      this.setState({
        disabled: true
      })
    })
  }
  cancelBtn = () => {
    this.routerLink('/home/ContractPage?key=2')
    SysUtil.clearSession('TrialDataDetail')
  }

  componentDidMount () {
    let data = SysUtil.getSessionStorage('TrialDataDetail')
    this.setState({
      loading: true,
      userId: data.userId,
      id: data.id
    })
    this.initData(data.id)
  }
  initData = (id:any) => {
    this.axios.request(this.api.contractInfo, { id }).then(({ data }) => {
      // 获取带数据放到数据中
      data = this.handleTranformPicAndPdf(data)
      this.setState({
        listArr: data,
        loading: false
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
      this.setState({
        loading: false
      })
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { disabled, listArr, loading } = this.state
    const { userInfo, typeName, hourType, taxationType, startTime, endTime, images, contractPdf, contractOss } = listArr
    return (
      <div id="trial-signature-detail-page">
        <Spin tip="Loading..." spinning={loading}>
          <Form layout="inline">
            <Row>
              <Col span={6}>
                <Form.Item label="项目" className="cfrom-item" labelAlign='left' style={{ marginRight: 10 }}>
                  <span>{(userInfo ? userInfo.projectName : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="工号" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.projectNumber : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="管理编号" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.sjNumber : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="姓名" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.userName : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="身份证号码/通行证/护照号" className="cfrom-item" labelAlign='left'>
                  <span>{(userInfo ? (userInfo.idCard || userInfo.passportCard) : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="组织" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.organize : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="法人主体" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.entity : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="员工类型" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.roleType : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="合同类型" className="cfrom-item" labelAlign='left'>
                  <span>{typeName || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="工时类型" className="cfrom-item" {...itemLayout}>
                  <span>{hourType || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="计税类型" className="cfrom-item" {...itemLayout}>
                  <span>{taxationType || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="入职日期" className="cfrom-item" {...itemLayout}>
                  <span>{(userInfo ? userInfo.entryTime : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="合同有效时间" className="cfrom-item" labelAlign='left'>
                  <span>{startTime || '- - -'} </span>至
                  <span> {endTime || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item style={{ display: 'block' }} className="upload-img">
              {getFieldDecorator('images', {
                initialValue: images || []
              })(
                <BaseScanedFiles />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'block' }} className="upload-img">
              {getFieldDecorator('pdf', {
                initialValue: contractPdf
              })(
                <BasePDF />
              )}
            </Form.Item>
            {
              contractOss &&
              <Form.Item style={{ display: 'block' }} className="upload-img">
                <BaseContract contractDetail={listArr} />
              </Form.Item>
            }
            {
              this.isAuthenticated(this.AuthorityList.contract[10])
                ? <Form.Item className="btn-margin-top">
                  <Button onClick={() => this.preventMoreClick(this.handleSumbit)} disabled={disabled} className="sumbit-btn" type="primary">保存</Button>
                  <Button onClick={this.cancelBtn} className="cancel-btn">取消</Button>
                </Form.Item>
                : <Form.Item className="btn-margin-top">
                  <Button onClick={this.cancelBtn} className="cancel-btn">返回</Button>
                </Form.Item>
            }
          </Form>
        </Spin>
      </div>
    )
  }
}
const ContractForm = Form.create<TrialSignatureDetailPageProps>()(TrialSignatureDetailPage)
export default ContractForm
