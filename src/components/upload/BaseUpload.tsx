/*
 * @description: 支持上传图片、pdf 文件，如果后续需要其他格式会继续拓展文件类型
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2020-04-01 13:36:04
 * @LastEditTime: 2020-04-17 11:26:27
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import RcUpload from 'rc-upload'
import { Document, Page } from 'react-pdf'
import { Icon, Modal } from 'antd'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { hot } from 'react-hot-loader'

import { inArray } from '@utils/ComUtil'

import './style/uploadmore.styl'
import { IconSc, IconEye } from '@components/icon/BasicIcon'

interface ImgItem {
  uid: number // 每个上传文件的 id
  url: string // 图片的 buffer 地址或者 oss 返回的长路径
  tempUrl: string // 图片的 buffer 地址或者 oss 返回的短路径
  file?: File // File 对象，用于使用 FormData 提交图片数据
}

interface SortableElementsProps {
  item: ImgItem
  accept: string[]
  handleCurrentFile: (v: ImgItem, t: number) => void
}

interface ImgContentProps {
  items: ImgItem[]
  accept: string[]
  handleCurrentFile: (v: ImgItem, t: number) => void
}

interface BasicUploadProps {
  value?: ImgItem[]
  onChange?: (v: ImgItem[]) => void
  accept?: string | string[] // 图片上传的类型 image/png,image/jpg,image/jpeg，文件上传类型 application/pdf
  className?: string
  style?: object
  multiple?: boolean // 是否多选
  fileSize?: number // 限制的大小，单位 M
  maxlength?: number // 限制上传的数量，如果超出会默认覆盖掉最后一个，默认为 Infinity
  customeUpload?: (...arg: any) => Promise<{ url: string, tempUrl: string }> // 自定义上传函数，目前针对 pdf 文件上传专门定制
}

interface BasicUploadState {
  previewVisible: boolean // 弹出框
  picList: ImgItem[]
  pageNumbers: number
  pageNumber: number
}

const filter = (list: ImgItem[] | undefined) => {
  if (list) return list.filter(({ url }) => url)
  return []
}

class SortableElements extends RootComponent<SortableElementsProps> {
  shouldComponentUpdate (nextProps: SortableElementsProps) {
    if (nextProps.item.url === this.props.item.url) return false
    return true
  }

  render () {
    const { accept, item, handleCurrentFile } = this.props
    const { url } = item
    const isPDF = accept.join().includes('pdf') // 判断是否是 pdf 类型，目前情况只有 pdf 和 图片类型
    return (
      <div className="img-content">
        {
          isPDF && url &&
          <Document className="pdf_container" file={url} loading="加载中...">
            <Page pageNumber={1} />
          </Document>
        }
        {!isPDF && <img className="content-img" src={url}></img>}
        <div className="img-content-dialog">
          <p className="content-icon">
            <Icon onClick={() => handleCurrentFile(item, 1)} component={IconEye} style={{ margin: '0 14px' }}/>
            <Icon onClick={() => handleCurrentFile(item, 2)} component={IconSc} style={{ margin: '0 14px' }}/>
          </p>
        </div>
      </div>
    )
  }
}

class ImgContent extends RootComponent<ImgContentProps> {
  render () {
    const { items, handleCurrentFile, accept } = this.props
    const SortableItem = SortableElement(SortableElements)
    return (
      <div className='upload-more-img-content'>
        {items.map((item: ImgItem, i) => (
          <SortableItem accept={accept} item={item} key={item.uid} handleCurrentFile={handleCurrentFile} index={i} />
        ))}
      </div>
    )
  }
}

@hot(module)
export default class BaseUpload extends RootComponent<BasicUploadProps, BasicUploadState> {
  static defaultProps = {
    fileSize: 20,
    multiple: false,
    maxlength: Infinity
  }

  accept = ['.png', '.jpg', '.jpeg', '.JPG', '.PNG', '.JPEG']

  previewImage: string = '' // 保存模态框显示的图片

  constructor (props: BasicUploadProps) {
    super(props)
    const { accept, value } = props
    if (accept) {
      if (typeof accept === 'string') {
        const { include } = inArray(accept, this.accept)
        if (!include) this.accept.push(accept)
      } else {
        this.accept = [...this.accept, ...accept]
      }
    }
    this.state = {
      picList: filter(value),
      previewVisible: false,
      pageNumbers: 0,
      pageNumber: 0
    }
  }

  UNSAFE_componentWillReceiveProps ({ value }: BasicUploadProps) {
    this.setState({
      picList: filter(value)
    })
  }

  customRequest = (request: any) => {
    const { file } = request
    request.onSuccess(file)
  }

  beforeUpload = (file: any) => {
    const { props: { fileSize }, accept, $message: { error, warning } } = this
    const { size, name } = file
    const res = name.split('.')
    const suffix = res[res.length - 1]
    if (!accept.join().includes(suffix)) {
      error('请上传格式正确的图片')
      return false
    }
    if ((size / 1024 / 1024) > fileSize!) {
      warning(`上传图片的大小不能超过${fileSize}M`)
      return false
    }
  }

  onSuccess = async (file: File) => {
    const { state: { picList }, props: { customeUpload, maxlength }, handleChange } = this
    const len = picList.length
    let imgItem: ImgItem
    if (customeUpload) {
      const { url, tempUrl } = await customeUpload(file)
      imgItem = {
        uid: len > 0 ? picList[len - 1].uid + 1 : 0,
        url: url,
        tempUrl: tempUrl,
        file: undefined
      }
    } else {
      imgItem = await this.readFileSync(file)
    }
    if (len < maxlength!) picList.push(imgItem)
    else picList.splice(maxlength! - 1, 1, imgItem)
    handleChange(picList)
    this.setState({ picList })
  }

  /* 读取 file 文件 */
  async readFileSync (file: File): Promise<ImgItem> {
    return new Promise(resolve => {
      const reader = new FileReader()
      const { state: { picList } } = this
      const len = picList.length
      reader.readAsDataURL(file)
      reader.onload = (e: any) => {
        const { result } = e.target
        const imgItem: ImgItem = {
          uid: len > 0 ? picList[len - 1].uid + 1 : 0,
          url: result,
          tempUrl: result,
          file
        }
        resolve(imgItem)
      }
    })
  }

  /** 将值传递给父级的事件 */
  handleChange = (v: ImgItem[]) => {
    const { onChange } = this.props
    onChange && onChange(v)
  }

  // t: 操作文件的类型，1 - 查看，2 - 删除
  handleCurrentFile = (curItem: ImgItem, t: number) => {
    const { uid, url } = curItem
    const picList = this.state.picList.filter(item => item.uid !== uid)
    if (t > 1) {
      this.handleChange(picList)
      this.setState({ picList })
      return
    }
    this.previewImage = url
    this.setState({ previewVisible: true })
  }

  onSortEnd = ({ oldIndex, newIndex }: any) => {
    const { picList } = this.state
    picList.splice(newIndex, 0, picList.splice(oldIndex, 1)[0])
    this.handleChange(picList)
    this.setState({ picList })
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
      accept,
      props: { multiple, style, children },
      state: { picList, previewVisible },
      onSuccess, beforeUpload, customRequest,
      handleCurrentFile, onSortEnd,
      handleCancel
    } = this
    const acceptList = accept.join()
    const config = {
      multiple,
      accept: acceptList,
      onSuccess,
      beforeUpload,
      customRequest
    }
    const SortableList = SortableContainer(ImgContent)
    const isPDF = acceptList.includes('pdf')
    return (
      <div style={style}>
        <RcUpload {...config}>
          {children}
        </RcUpload>
        <SortableList
          axis='xy'
          pressDelay={1000}
          accept={accept}
          items={picList}
          onSortEnd={onSortEnd}
          handleCurrentFile={handleCurrentFile} />
        <Modal
          className="upload-more-modal-box"
          width='900px'
          footer={null}
          visible={previewVisible}
          onCancel={handleCancel}
          style={{ boxShadow: '0px 0px 5px 0px rgba(190,190,190,0.5)' }}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}>
          {isPDF && <iframe width='100%' height={500} src={previewImage} frameBorder="0"></iframe>}
          {!isPDF && <img alt="" style={{ width: '100%' }} src={previewImage} />}
        </Modal>
      </div>
    )
  }
}
