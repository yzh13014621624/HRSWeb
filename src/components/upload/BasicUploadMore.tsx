/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 简单的一个上传
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import RcUpload from 'rc-upload'
import { hot } from 'react-hot-loader'
import { Document, Page } from 'react-pdf'
import { Icon, Modal } from 'antd'
import './style/uploadmore.styl'

import { IconSc, IconEye } from '@components/icon/BasicIcon'

interface SortableElementsProps {
  bufferURl:string
  accept: string
  queryImg:Function
  remove:Function
  index:number
}

class SortableElements extends RootComponent<SortableElementsProps> {
  state = {
    numPages: null,
    pageNumber: 1
  }

  shouldComponentUpdate (nextProps: SortableElementsProps) {
    if (nextProps.bufferURl === this.props.bufferURl) return false
    return true
  }

  onDocumentLoadSuccess = ({ numPages }: any) => {
    this.setState({ numPages })
  }

  render () {
    const { pageNumber } = this.state
    const { bufferURl, queryImg, remove, index, accept } = this.props
    const isPDF = accept.includes('pdf') // 判断是否是 pdf 类型，目前情况只有 pdf 和 图片类型
    return (
      <div className="img-content">
        {
          isPDF && bufferURl &&
          <Document className="pdf_container" file={bufferURl} onLoadSuccess={this.onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        }
        {!isPDF && <img className="content-img" src={bufferURl}></img>}
        <div className="img-content-dialog">
          <p className="content-icon">
            <Icon onClick={() => (queryImg(bufferURl))} component={IconEye} style={{ margin: '0 14px' }}/>
            <Icon onClick={() => (remove(index))} component={IconSc} style={{ margin: '0 14px' }}/>
          </p>
        </div>
      </div>
    )
  }
}

interface ImgContentProps {
  items:any
  accept: string
  remove:Function
  queryImg:Function
}

class ImgContent extends RootComponent<ImgContentProps> {
  render () {
    const { items, remove, queryImg, accept } = this.props
    const SortableItem = SortableElement(SortableElements)
    return (
      <div className='upload-more-img-content'>
        {items.map((el:any, key:any) => (
          <SortableItem accept={accept} key={key} remove={() => remove(key)} bufferURl={el.bufferURl} queryImg={queryImg} index={key} />
        ))}
      </div>
    )
  }
}

interface BasicUploadMoreProps {
  value?: any
  onChange?: any // 传递该组件的值
  width?: number | string // 宽度
  accept?:string // 图片上传的类型 image/png,image/jpg,image/jpeg，文件上传类型 application/pdf
  className?: string // 样式类名
  style?: object // 行内样式
  multiple?:boolean // 是否多选
  size?:number // 限制的大小
  maxlength?: number // 限制上传的数量，如果超出会默认覆盖掉最后一个
}

interface BasicUploadMoreState {
  fileSize: number
  selDate: Array<any> // 保存当前文件中的值
  aryData:Array<any> // 保存传输过来的值
  picList: any // 总的值
  multiple: boolean
  accept:string
  previewVisible: boolean // 弹出框
  pageNumbers: number
  pageNumber: number
}

@hot(module)
export default class BasicUploadMore extends RootComponent<BasicUploadMoreProps, BasicUploadMoreState> {
  static getDerivedStateFromProps (props:any, state:any) {
    const { value, maxlength } = props
    const { fileSize, selDate, multiple, accept, previewVisible } = state
    if ('value' in props) {
      let val:any = []
      if (value) {
        val = value.map((el:any) => {
          return el['imageOssUrl'] ? {
            bufferURl: el.imageOssUrl, // 新上传得图片
            imageUrl: el.imageUrl,
            file: undefined
          } : el
        })
        val.forEach((el:any) => { // 去重删除
          let index = selDate.indexOf(el)
          if (index >= 0) {
            selDate.splice(index, 1)
          }
        })
      }
      const picList = [...val, ...selDate]
      return {
        fileSize: fileSize,
        selDate: selDate,
        aryData: val,
        multiple: multiple,
        accept: accept || '.png,.jpg,.jpeg,.JPG,.PNG.JPEG',
        previewVisible: previewVisible,
        picList: maxlength < Infinity ? picList.slice(0, maxlength) : picList
      }
    }
    return null
  }

  static defaultProps = {
    maxlength: Infinity
  }

  previewImage:string // 保存模态框显示的图片

  constructor (props:any) {
    super(props)
    const { size, multiple, accept } = this.props
    const value = props.value || []
    this.state = {
      fileSize: size || 3,
      selDate: [],
      aryData: value || [],
      multiple: multiple || true,
      accept: accept || '.png,.jpg,.jpeg,.JPG,.PNG.JPEG',
      previewVisible: false,
      picList: value || [],
      pageNumbers: 0,
      pageNumber: 1
    }
    this.previewImage = ''
  }

  /* 组件销毁之前 对 state 的状态做出处理 */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 将值传递给父级的事件 */
  triggerChange = (changedValue:any) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  onSuccess = (file:any) => {
    /* 一下为值的回显 */
    const reader = new FileReader()
    const {
      state: { selDate, picList },
      props: { maxlength }
    } = this
    reader.onloadend = () => {
      const obj = {
        bufferURl: reader.result, // 新上传得图片
        file: file
      }
      if (picList.length < maxlength!) {
        selDate.push(obj)
      } else {
        selDate.splice(maxlength! - 1, 1, obj)
      }
      this.setState({ selDate })
      this.triggerChange(this.state.picList)
    }
    reader.readAsDataURL(file)
  }

  /* 文件上传的 检查 */
  beforeUpload = (file:any) => {
    const { fileSize, accept } = this.state
    const { size, name } = file
    let a = '文件上传出错'
    return new Promise((resolve, reject) => {
      // 对文件的信息进行 类型判断
      const res = name.split('.')
      const suffer = res[res.length - 1]
      if (!accept.includes(suffer)) {
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
  customRequest = (data:any) => {
    const { file } = data
    data.onSuccess(file)
  }

  /* 文件的移除 */
  remove = (key:number) => {
    const { picList, aryData, selDate } = this.state
    picList.splice(key, 1)
    if (key > (aryData.length - 1)) { // 在传递的值中删除数据
      selDate.splice((picList.length - 1) - key, 1)
    } else { // 本地中删除
      aryData.splice(key, 1)
    }
    this.setState({ aryData, selDate })
    this.triggerChange(picList)
  }

  /* 查看文件 */
  queryImg = (url:any) => {
    this.previewImage = url
    this.setState({
      previewVisible: true
    })
  }

  /* 拖动的事件 */
  onSortEnd = ({ oldIndex, newIndex }:any) => {
    const { picList } = this.state
    // 位置改变
    picList.splice(newIndex, 0, picList.splice(oldIndex, 1)[0])
    this.setState({
      aryData: picList,
      selDate: []
    })
    this.triggerChange(picList)
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  onDocumentLoadSuccess = ({ numPages }: any) => {
    this.setState({ pageNumbers: numPages })
  }

  onItemClick = ({ pageNumber }: any) => this.setState({ pageNumber })

  render () {
    const {
      previewImage,
      props: { style, children },
      state: { multiple, accept, picList, previewVisible },
      onSuccess, beforeUpload, customRequest
    } = this
    const config = {
      multiple,
      accept,
      onSuccess,
      beforeUpload,
      customRequest
    }
    const SortableList = SortableContainer(ImgContent)
    const isPDF = accept.includes('pdf')
    return (
      <div style={style}>
        <RcUpload {...config}>
          {children}
        </RcUpload>
        <SortableList axis='xy' pressDelay={1000} accept={accept}
          onSortEnd={this.onSortEnd} items={picList}
          remove={this.remove} queryImg={this.queryImg} />
        <Modal
          className="upload-more-modal-box"
          width='580px'
          footer={null}
          visible={previewVisible}
          onCancel={this.handleCancel}
          style={{ boxShadow: '0px 0px 5px 0px rgba(190,190,190,0.5)' }}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}>
          {isPDF && <iframe width='100%' height={500} src={previewImage} frameBorder="0"></iframe>}
          {!isPDF && <img alt="" style={{ width: '100%' }} src={previewImage} />}
        </Modal>
      </div>
    )
  }
}
