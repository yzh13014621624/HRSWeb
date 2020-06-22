/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 组件的输出
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import RootComponent from './root/RootComponent' // 基础组件
import TableItem from './table/TableItem' // 表格
import BasicModal from './modal/BasicModal' // 模态框
import BasicModalNew from './modal/BasicModalNew' // 模态框（新）
import Loading from './loading/Loading' // 加载
import FileUpload from './upload/FileUpload' // 文件导入
import BasicDowload from './upload/BasicDowload' // 文件导出
import BasicDowloadFont from './upload/BasicDowloadFont' // 文件导出
import BasicUploadMore from './upload/BasicUploadMore' // 多文件的
import BasicUploadJob from './upload/BasicUploadJob' // 多文件的
import BaseUpload from './upload/BaseUpload' // 多文件的上传，包含图片和 pdf 文件
import { Axios } from './axios/Axios' // Axios
import BasicDatePicker from './date/BasicDatePicker' // 时间
import BasicMonthRangePicker from './date/BasicMonthRangePicker' // 月份连选
import { EmptyTable, customizeRenderEmpty, ReportTable } from './empty/BasicEmpty' // 空
import Version from './version' // 版本
import Linkvideo from './linkvideo' // 链接到视频

export {
  Axios,
  RootComponent,
  Loading,
  BasicModal,
  BasicModalNew,
  BasicUploadMore,
  BasicUploadJob,
  BasicDatePicker,
  BasicMonthRangePicker,
  TableItem,
  FileUpload,
  BasicDowload,
  BasicDowloadFont,
  EmptyTable,
  ReportTable,
  customizeRenderEmpty,
  Version,
  Linkvideo,
  BaseUpload
}
