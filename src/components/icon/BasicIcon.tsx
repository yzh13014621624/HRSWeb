/**
 * @author minjie
 * @createTime 2019/04/08
 * @description 加载动画
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { JudgeUtil } from '@utils/index'

import sc from '@assets/images/icon/sc.png' // 删除
import dc from '@assets/images/icon/dc.png' // 导出
import dr from '@assets/images/icon/dr.png' // 导入
import xz from '@assets/images/icon/xz.png' // 新增
import tj from '@assets/images/icon/tj.png' // 提交
import upload from '@assets/images/icon/upload.png' // 上传
import Fill from '@assets/images/icon/Fill 1.png' // 提示
import silder1 from '@assets/images/icon/silder-1.png' // 主页
import silder2 from '@assets/images/icon/silder-2.png' // 基本信息
import silder3 from '@assets/images/icon/silder-3.png' // 参保
import silder4 from '@assets/images/icon/silder-4.png' // 报表
import siderDate from '@assets/images/icon/sider-date.png' // 考勤
import siderSalary from '@assets/images/icon/sider-salary.png' // 薪酬
import group from '@assets/images/icon/group.png' // 分组收起

import successImg from '@assets/images/success.png' // 成功

import eye from '@assets/images/icon/eye.png'
import edit from '@assets/images/icon/edit.png'
import modalDel from '@assets/images/icon/modal_del.png'

import date from '@assets/images/date.png'
import ind1 from '@assets/images/share/entry/ind1.png'
import ind2 from '@assets/images/share/entry/ind2.png'
import ind3 from '@assets/images/share/entry/ind3.png'
import ind4 from '@assets/images/share/entry/ind4.png'
import ind5 from '@assets/images/share/entry/ind5.png'
import other1 from '@assets/images/share/entry/other1.png'
import other2 from '@assets/images/share/entry/other2.png'
import other3 from '@assets/images/share/entry/other3.png'
import correct from '@assets/images/share/entry/correct.png'

import per1 from '@assets/images/share/entry/per1.png'
import per2 from '@assets/images/share/entry/per2.png'
import per3 from '@assets/images/share/entry/per3.png'
import per4 from '@assets/images/share/entry/per4.png'
import per5 from '@assets/images/share/entry/per5.png'
import per6 from '@assets/images/share/entry/per6.png'
import per7 from '@assets/images/share/entry/per7.png'
import per9 from '@assets/images/share/entry/per9.png'

import addIcon from '@assets/images/share/entry/add-icon.png'
import addbtn from '@assets/images/share/entry/addbtn.png'
import jbtn from '@assets/images/share/entry/jbtn.png'

import zaizhi from '@assets/images/share/entry/zaizhi.png'
import dairuzhi from '@assets/images/share/entry/dairuzhi.png'
import lizhi from '@assets/images/share/entry/lizhi.png'

import exportExcel from '@assets/images/share/combinedreportform/ex-excel.png'
import exportPDF from '@assets/images/share/combinedreportform/ex-pdf.png'
import exportFile from '@assets/images/share/combinedreportform/ex-file.png'

import lock from '@assets/images/icon/lock.png'

import loginPhone from '@assets/images/login/loginPhone.png'
import phoneCode from '@assets/images/login/phoneCode.png'
import loginPwd from '@assets/images/login/pwd.png'

import sdate from '@assets/images/salary/sdate.png' // 薪酬日期

import './BasicIcon.less'

export { date, ind1, ind2, ind3, ind4, ind5, other1, other2, other3, addIcon }

let iconTemplte = (icon:any, className:string) => {
  return <img src={icon} className={className}></img>
}
export const IconZaizhi = () => iconTemplte(zaizhi, 'icon-10')
export const IconDairuzhi = () => iconTemplte(dairuzhi, 'icon-10')
export const IconLizhi = () => iconTemplte(lizhi, 'icon-10')

export const IconSc = () => iconTemplte(sc, 'icon-16')
export const IconDc = () => iconTemplte(dc, 'icon-16')
export const IconDr = () => iconTemplte(dr, 'icon-16')
export const IconXz = () => iconTemplte(xz, 'icon-16')
export const IconTj = () => iconTemplte(tj, 'icon-16')
export const IconSdate = () => iconTemplte(sdate, 'icon-16')
export const IconUpload = () => iconTemplte(upload, 'icon-16')
export const IconLock = () => iconTemplte(lock, 'icon-16-20')
export const IconEye = () => iconTemplte(eye, 'icon-eye')
export const IconEdit = () => iconTemplte(edit, 'icon-16')
export const successImgs = () => iconTemplte(successImg, 'icon-20')
export const IconModalDel = () => iconTemplte(modalDel, 'icon_modal_del')

export const IconSilder1 = () => iconTemplte(silder1, 'icon-18')
export const IconSilder2 = () => iconTemplte(silder2, 'icon-18')
export const IconSilder3 = () => iconTemplte(silder3, 'icon-18')
export const IconSilder4 = () => iconTemplte(silder4, 'icon-18')
export const IconSiderDate = () => iconTemplte(siderDate, 'icon-18')
export const IconSiderSalary = () => iconTemplte(siderSalary, 'icon-18')
export const IconPer1 = () => iconTemplte(per1, 'icon-18')
export const IconPer2 = () => iconTemplte(per2, 'icon-18')
export const IconPer3 = () => iconTemplte(per3, 'icon-18')
export const IconPer4 = () => iconTemplte(per4, 'icon-18')
export const IconPer5 = () => iconTemplte(per5, 'icon-18')
export const IconPer6 = () => iconTemplte(per6, 'icon-18')
export const IconPer7 = () => iconTemplte(per7, 'icon-18')
export const IconPer9 = () => iconTemplte(per9, 'icon-18')

export const IconExportExcel = () => iconTemplte(exportExcel, 'icon-16')
export const IconExportPdf = () => iconTemplte(exportPDF, 'icon-16')
export const IconExportFile = () => iconTemplte(exportFile, 'icon-16')

export const IconFill = () => (
  <img src={Fill} className="icon-16" style={{ fontSize: 15 }}></img>
)

export const IconAddIcon = () => (
  <img src={addIcon} style={{ width: JudgeUtil.pxtoRem(40), height: JudgeUtil.pxtoRem(40) }}></img>
)
export const IconAddbtn = () => {
  return <img src={addbtn} style={{ width: '0.07rem', height: '0.07rem' }}></img>
}
export const IconJbtn = () => {
  return <img src={jbtn} style={{ width: '0.07rem', height: '0.07rem' }}></img>
}
export const IconCorrect = () => {
  return <img src={correct} style={{ width: '0.07rem', height: '0.07rem' }}></img>
}
export const IconGroup = () => {
  return <img src={group} style={{ width: '0.11rem', height: '0.11rem' }}></img>
}

export const LoginPhone = () => {
  return <img src={loginPhone} style={{ width: '16px', height: '23px' }}></img>
}

export const PhoneCode = () => {
  return <img src={phoneCode} style={{ width: '18px', height: '20px' }}></img>
}

export const LoginPwd = () => {
  return <img src={loginPwd} style={{ width: '17px', height: '20px' }}></img>
}
