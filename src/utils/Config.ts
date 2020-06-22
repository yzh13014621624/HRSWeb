/**
 * @author minjie
 * @createTime 2019/07/06
 * @description 配置文件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

interface InitInterface {
  axiosBasePath: string
  axiosHeaders: any
  waterMark: string
  loggerLogstore: string
  OSSPrivateBucket: string
}

class ConfigUtil {
  constructor () {
    let obj:InitInterface = this.init()
    this.axiosBasePath = obj.axiosBasePath
    this.axiosHeaders = obj.axiosHeaders
    this.OSSPrivateBucket = obj.OSSPrivateBucket
    this.loggerLogstore = obj.loggerLogstore
    this.waterMark = obj.waterMark
  }
  /** axios 的访问地址 */
  axiosBasePath: string = ''
  /** 普通请求的超时时间 */
  axiosTimeout:number = 15000
  /** 访问的请求头 */
  axiosHeaders: any = {}

  /** 用户服务的（翟顺辉） */
  userSeverBasePath: string = 'http://zct-api.sj56.com.cn/stallone'

  /** 好饭碗 dev tes pre pro */
  waterMark: string = ''

  /** OSS 服务 */
  OSSRegion: string = 'oss-cn-hangzhou'
  OSSPrivateBucket: string = ''

  /** 路由请求超时时间 */
  reactRouterTimeout:number = 9000

  /** 日志访问host */
  loggerHost:string = 'cn-hangzhou.log.aliyuncs.com'
  /** 日志访问Project */
  loggerProject:string = 'sj56-logs-hrs'
  /** 日志访问Logstore */
  loggerLogstore:string = ''
  /** 日志访问Topic */
  loggerTopic:string = 'hrs'

  /** 初始化信息 */
  init ():InitInterface {
    const path = 'https://hrts.sj56.com.cn:9091'
    // 开发环境(新的)
    switch (process.env.SERVICE_URL) {
      case 'dev':
        return {
          axiosBasePath: 'https://hrts.sj56.com.cn:9091',
          axiosHeaders: {},
          waterMark: '开发',
          loggerLogstore: 'hrs-store-ode-track',
          OSSPrivateBucket: 'file-oss-hrs-np'
        }
      case 'tes':
        return {
          axiosBasePath: 'https://hrts.sj56.com.cn:9092',
          axiosHeaders: {},
          waterMark: '测试',
          loggerLogstore: 'hrs-store-tes-track',
          OSSPrivateBucket: 'file-oss-hrs-np'
        }
      case 'pre':
        return {
          axiosBasePath: 'https://hrts.sj56.com.cn:9093',
          axiosHeaders: {},
          waterMark: '预发',
          loggerLogstore: 'hrs-store-pre-track',
          OSSPrivateBucket: 'file-oss-hrs-np'
        }
      case 'pro':
        return {
          axiosBasePath: 'https://hrps.sj56.com.cn',
          axiosHeaders: {},
          waterMark: '',
          loggerLogstore: 'hrs-store-pro-track',
          OSSPrivateBucket: 'file-oss-hrs'
        }
      default:
        return {
          axiosBasePath: path,
          axiosHeaders: {},
          waterMark: '开发',
          loggerLogstore: 'hrs-store-ode-track',
          OSSPrivateBucket: 'file-oss-hrs-np'
        }
    }
  }
}

export default new ConfigUtil()
