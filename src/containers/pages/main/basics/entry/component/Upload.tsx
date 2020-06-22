/**
 * @author minjie
 * @createTime 2019/11/13
 * @description 入职的上传
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import RcUpload from 'rc-upload'
import { Icon, Modal } from 'antd'
import { IconAddIcon, IconEye, IconSc, IconEdit, IconModalDel } from '@components/icon/BasicIcon'
import { JudgeUtil } from '@utils/index'

import '../style/upload.styl'

interface UploadImageProps {
  /** 获取到文件之后返回文件的对象 (file:File) => {} */
  onChange?: Function // 传递该组件的值
  /** 组件的值 */
  value?: any
  /** 回掉显示的图片 */
  images?: string
  /** 返回图片的buffer */
  onBuffer?: Function
  /** 上传文件的大小 默认值：3m */
  fileSize: number
  /** 上传文件的限制  默认值： .png,.jpg,.jpeg */
  accept: string
  /** 是否能够多传 默认值：false */
  multiple: boolean
  /** 宽度 默认值：180px */
  width: number | string
  /** 高度 默认值：123px */
  height: number | string
  /** 背景颜色 'blue' | 'white' 默认： blue */
  backgroundColor: 'blue' | 'white'
  /** 背景图片 默认 无 */
  backgroundImage: string
  /** 提示的信息 */
  placeholder?: string
  /** 背景图片的高度和宽度 */
  bgImageStyle: { width?: number | string, height?: number | string }
  /** 背景图片的高度和宽度 */
  desc?: string // 对要求上传图片的描述性文字
}

interface UploadImageState {
  /** 图片显示的路径 */
  imgURL: string
  /** 图片的弹框的显示 */
  imageVisible: boolean
}

export default class UploadImage extends RootComponent<UploadImageProps, UploadImageState> {
  constructor (props:any) {
    super(props)
    this.state = {
      imgURL: '',
      imageVisible: false
    }
  }
  static defaultProps = {
    fileSize: 3,
    accept: '.png,.jpg,.jpeg,.JPG,.PNG',
    multiple: false,
    width: 180,
    height: 123,
    backgroundColor: 'blue',
    backgroundImage: '',
    bgImageStyle: {},
    desc: '仅支持png/jpg格式'
  }

  static getDerivedStateFromProps (props:any, state:any) {
    const { images, value } = props
    const { imgURL } = state
    if (imgURL && imgURL === 'delete') {
      return { imgURL: undefined }
    } else if (!images && imgURL && imgURL !== 'delete') {
      return { imgURL }
    } else if (images && !imgURL && !JudgeUtil.isEmpty(value) && value !== 'null') {
      return { imgURL: images }
    }
    return null
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /* 文件上传的 检查 */
  beforeUpload = (file:any, fileList:any) => {
    const { accept, fileSize } = this.props
    const { size, name } = file
    let a = '文件上传出错'
    return new Promise((resolve, reject) => {
      // 对文件的信息进行 类型判断
      let index = name.lastIndexOf('.')
      let typeArry = accept.split(',')
      let suffer = (name as string).substring(index, name.length)
      if (typeArry.indexOf(suffer) < 0) {
        a = '请上传正确的文件'
        this.$message.error(a)
        reject(a)
      }
      if ((size / 1024 / 1024) > fileSize) { // 对文件进行 大小判断
        a = `上传文件的大小不能超过${fileSize}M`
        this.$message.warning(a)
        reject(a)
      }
      resolve(file)
    })
  }

  // 自定义的文件上传, 默认的不传，直接成功
  customRequest = (request:any) => {
    const { file } = request
    request.onSuccess(file)
  }

  onSuccess = (file:any) => {
    const { onChange, onBuffer } = this.props
    const render = new FileReader()
    render.readAsDataURL(file)
    render.onload = (e:any) => {
      this.setState({ imgURL: e.target.result }, () => {
        if (onChange) onChange(file)
        if (onBuffer) onBuffer(e.target.result)
      })
    }
  }

  /** 编辑 */
  edit = (e:any) => {
    let parnts = e.target.parentElement.parentElement.parentElement.parentElement
    let input = parnts.getElementsByTagName('span')[0].getElementsByTagName('input')[0]
    input.click()
  }

  /* 文件的移除 */
  remove = () => {
    const { onChange } = this.props
    if (onChange) onChange(undefined)
    this.setState({ imgURL: 'delete' })
  }

  /** 大图显示 */
  onImageModalCancel = (imageVisible: boolean) => {
    this.setState({ imageVisible })
  }

  render () {
    const { images, accept, multiple, width, height, backgroundColor, backgroundImage, bgImageStyle, placeholder, desc } = this.props
    const { imgURL, imageVisible } = this.state
    const config = {
      accept, // 默认上传的是图片
      multiple, // 多选
      onSuccess: this.onSuccess,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest
    }
    let contentStyle:any = {}
    let isflg = backgroundColor === 'blue'
    contentStyle['backgroundColor'] = isflg ? 'rgba(242,246,252,1)' : '#fff'
    let bgStyle:any = {}
    // if (bgImageStyle) {
    //   const { width, height } = bgImageStyle
    //   if (width) bgStyle['width'] = JudgeUtil.pxtoRem(width)
    //   if (height) bgStyle['height'] = JudgeUtil.pxtoRem(height)
    // }
    if (bgImageStyle) {
      const { width, height } = bgImageStyle
      if (width) bgStyle['width'] = width
      if (height) bgStyle['height'] = height
    }
    return (
      // <div className='ant-upload-container' style={{ width: JudgeUtil.pxtoRem(width), height: JudgeUtil.pxtoRem(height) }}>
      <div className='ant-upload-container' style={{ width, height }}>
        <RcUpload {...config} className='ant-upload-content'>
          <div className='ant-upload-content-bg' style={contentStyle}>
            {backgroundImage !== '' && <img className='ant-upload-img-bg' style={bgStyle} src={backgroundImage}/>}
            <div className='ant-upload-content-text'>
              <Icon className='icon' component={IconAddIcon} />
              <span>{placeholder}</span>
              {isflg && <p>（{desc}）</p>}
            </div>
          </div>
        </RcUpload>
        {(imgURL) && <div className='ant-upload-after-modal' style={contentStyle}>
          <img src={imgURL}/>
          <div className='ant-upload-edit-content'>
            <Icon onClick={this.onImageModalCancel.bind(this, true)} component={IconEye}/>
            <Icon onClick={this.edit} component={IconEdit}/>
            <Icon onClick={this.remove} component={IconSc}/>
          </div>
        </div>}
        <Modal
          getContainer={false}
          footer={null}
          width={800}
          className='cus-modal-content'
          visible={imageVisible}
          closable={false}
          onCancel={this.onImageModalCancel.bind(this, false)}
          style={{ boxShadow: '0px 0px 5px 0px rgba(190,190,190,0.5)' }}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <Icon className='modal-close' onClick={this.onImageModalCancel.bind(this, false)} component={IconModalDel} />
          <img alt="" style={{ width: '100%' }} src={imgURL} />
        </Modal>
      </div>
    )
  }
}
