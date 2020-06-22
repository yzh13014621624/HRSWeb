/**
 * @description OSS 服务文件
 * @author minjie
 * @createTime 2018/10/18
 * @copyright Copyright © 2018 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { Axios } from '@components/index'
import ServerApi from '@server/ServerApi'
import { SysUtil, OssPathEnum } from '@utils/index'

const OSSClient = require('ali-oss')

export default class OSSUtil {
  static ak = SysUtil.getSessionStorage(OssPathEnum.ossKey)

  /**
   * 上传图片或者文件
   * @param file File 对象
   * @param modules 定义上传文件在 OSS 文件里面的存放位置
   * @param fileName 自定义上传文件的名称
   */
  static async multipartUpload (file: File, moudle: string, fileName?: string): Promise<{ name: string, url: string }> {
    try {
      await OSSUtil.getSTS(moudle)
      const { accessKeyId, accessKeySecret, securityToken, region, path, bucketName }: any = OSSUtil.ak
      const client = new OSSClient({
        region,
        accessKeyId,
        accessKeySecret,
        bucket: bucketName,
        stsToken: securityToken,
        secure: true
      })
      fileName = fileName || OSSUtil.createFileName(file.name)
      const name = path + '/' + fileName
      const result = await client.multipartUpload(name, file)
      return { name: result.name, url: result.res.requestUrls }
    } catch (e) {
      console.log(e)
      return { name: '', url: '' }
    }
  }

  /* 获取 STS */
  static async getSTS (moudle: string) {
    try {
      const { ak } = OSSUtil
      if (ak && (new Date().getTime() < new Date(ak.expiration).getTime())) return
      const { data } = await Axios.request(ServerApi.ossGetkey, { moudle })
      SysUtil.setSessionStorage(OssPathEnum.ossKey, data)
      OSSUtil.ak = data
    } catch (e) {
      console.log(e)
    }
  }

  /* 统一生成文件名 */
  static createFileName (filePath: string) {
    const suffer = filePath.substring(filePath.lastIndexOf('.'))
    const timestamp = new Date().getTime()
    return `hr__${timestamp}${suffer}`
  }
}
