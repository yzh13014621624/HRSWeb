/**
 * @description mock 的假数据编写
 * @author minjie
 * @date 2018/12/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import ServerApi from '@server/ServerApi'

const Mock = require('mockjs')
const Random = Mock.Random

// 表格的查询
Mock.mock(ServerApi.entryQuery.path + '.mock', ServerApi.entryQuery.type, (res:any) => {
  let da:any = []
  for (let i = 1; i <= 10; i++) {
    da.push({
      userId: i,
      projectName: '上嘉' || '盒马',
      projectNumber: Mock.mock('@integer(1000)'),
      sjNumber: 'SJ' + Mock.mock('@integer(1000)') || 'HM' + Mock.mock('@integer(1000)'),
      userName: Mock.mock('@cname'),
      organize: Mock.mock('@cname'),
      workCondition: i === 1 ? '待入职' : '在职',
      entryTime: Mock.mock('@date()'),
      quitTime: Mock.mock('@date()')
    })
  }
  return {
    data: {
      data: da,
      total: 500,
      currentPage: 1,
      pageSize: 10,
      totalNum: 1,
      isMore: null,
      totalPage: 1
    },
    msg: [ '获取数据成功' ],
    code: 200
  }
})

// 获取组织
Mock.mock(ServerApi.entryOrganize.path + '.mock', ServerApi.entryOrganize.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    'code': 200,
    'msg': ['查询组织成功'],
    'data': {
      'currentPage': 1,
      'pageSize': 14,
      'totalNum': 14,
      'isMore': null,
      'totalPage': 1,
      'startIndex': null,
      'data': [
        {
          'foId': 1,
          'firOrganize': '集团总经理办公室',
          'secondOrganizeResponseList': []
        },
        {
          'foId': 2,
          'firOrganize': '集团财务部',
          'secondOrganizeResponseList': []
        },
        {
          'foId': 3,
          'firOrganize': '集团人力资源中心',
          'secondOrganizeResponseList': []
        },
        {
          'foId': 4,
          'firOrganize': '综合事务部',
          'secondOrganizeResponseList': []
        },
        {
          'foId': 14,
          'firOrganize': '嘉加营运部',
          'secondOrganizeResponseList': [
            {
              'soId': 161,
              'secOrganize': '成都盒马鲜活中心营运仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 162,
              'secOrganize': '成都鲜活中心',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 13,
          'firOrganize': '外区招聘事业部 ',
          'secondOrganizeResponseList': [
            {
              'soId': 119,
              'secOrganize': '北京盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 120,
              'secOrganize': '北京盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 121,
              'secOrganize': '长沙盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 123,
              'secOrganize': '成都盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 122,
              'secOrganize': '长沙盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 124,
              'secOrganize': '成都盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 125,
              'secOrganize': '福州盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 126,
              'secOrganize': '福州盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 127,
              'secOrganize': '广州盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 128,
              'secOrganize': '广州盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 129,
              'secOrganize': '贵阳盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 130,
              'secOrganize': '贵阳盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 131,
              'secOrganize': '海口盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 132,
              'secOrganize': '海口盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 133,
              'secOrganize': '杭州盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 134,
              'secOrganize': '杭州盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 135,
              'secOrganize': '南京盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 136,
              'secOrganize': '南京盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 137,
              'secOrganize': '南通盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 138,
              'secOrganize': '南通盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 139,
              'secOrganize': '宁波盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 140,
              'secOrganize': '宁波盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 141,
              'secOrganize': '青岛盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 142,
              'secOrganize': '青岛盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 143,
              'secOrganize': '上海盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 144,
              'secOrganize': '上海盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 145,
              'secOrganize': '深圳盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 146,
              'secOrganize': '深圳盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 147,
              'secOrganize': '苏州盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 148,
              'secOrganize': '苏州盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 149,
              'secOrganize': '天津盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 150,
              'secOrganize': '天津盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 151,
              'secOrganize': '无锡盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 152,
              'secOrganize': '无锡盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 153,
              'secOrganize': '武汉盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 154,
              'secOrganize': '武汉盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 155,
              'secOrganize': '西安盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 156,
              'secOrganize': '西安盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 157,
              'secOrganize': '厦门盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 158,
              'secOrganize': '厦门盒马骑手兼职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 159,
              'secOrganize': '重庆盒马骑手全职',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 160,
              'secOrganize': '重庆盒马骑手兼职',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 12,
          'firOrganize': '外区人力资源支持服务事业部',
          'secondOrganizeResponseList': [
            {
              'soId': 91,
              'secOrganize': '北京盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 92,
              'secOrganize': '北京盒马加工中心',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 93,
              'secOrganize': '北京盒马鲜活中心',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 94,
              'secOrganize': '长沙盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 95,
              'secOrganize': '成都盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 96,
              'secOrganize': '佛山盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 97,
              'secOrganize': '福州盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 98,
              'secOrganize': '广州盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 99,
              'secOrganize': '贵阳盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 100,
              'secOrganize': '海口盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 101,
              'secOrganize': '杭州盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 102,
              'secOrganize': '昆明盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 103,
              'secOrganize': '南京盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 104,
              'secOrganize': '南通盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 105,
              'secOrganize': '宁波盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 106,
              'secOrganize': '青岛盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 107,
              'secOrganize': '上海盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 108,
              'secOrganize': '上海盒马加工中心',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 109,
              'secOrganize': '上海盒马鲜活中心',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 110,
              'secOrganize': '上海盒马直采中心',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 111,
              'secOrganize': '深圳盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 112,
              'secOrganize': '苏州盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 113,
              'secOrganize': '天津盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 114,
              'secOrganize': '无锡盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 115,
              'secOrganize': '武汉盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 116,
              'secOrganize': '西安盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 117,
              'secOrganize': '厦门盒马店仓',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 118,
              'secOrganize': '重庆盒马店仓',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 11,
          'firOrganize': '仓储事业部',
          'secondOrganizeResponseList': [
            {
              'soId': 69,
              'secOrganize': '北京盒马鲜活中心仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 70,
              'secOrganize': '长沙盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 71,
              'secOrganize': '成都盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 72,
              'secOrganize': '成都盒马加工中心仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 73,
              'secOrganize': '鼎纵仓',
              'thirdOrganizeResponseList': [
                {
                  'toId': 1,
                  'thiOrganize': '上海恩溢常温B2B仓储'
                },
                {
                  'toId': 2,
                  'thiOrganize': '上海果雪常温B2B仓储'
                },
                {
                  'toId': 3,
                  'thiOrganize': '上海海宝常温B2B仓储'
                },
                {
                  'toId': 4,
                  'thiOrganize': '上海银雁常温B2B仓储'
                },
                {
                  'toId': 5,
                  'thiOrganize': '上海月星常温B2B仓储'
                },
                {
                  'toId': 6,
                  'thiOrganize': '上海月星常温B2C仓储'
                },
                {
                  'toId': 7,
                  'thiOrganize': '上海造作常温B2B仓储'
                }
              ]
            },
            {
              'soId': 74,
              'secOrganize': '贵阳盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 75,
              'secOrganize': '杭州盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 76,
              'secOrganize': '华南大区',
              'thirdOrganizeResponseList': [
                {
                  'toId': 8,
                  'thiOrganize': '福州盒马常温B2B仓储'
                },
                {
                  'toId': 9,
                  'thiOrganize': '广州盒马常温B2B仓储'
                },
                {
                  'toId': 10,
                  'thiOrganize': '广州盒马常温B2C仓储'
                },
                {
                  'toId': 11,
                  'thiOrganize': '深圳盒马常温B2B仓储'
                },
                {
                  'toId': 12,
                  'thiOrganize': '深圳盒马加工中心仓储'
                }
              ]
            },
            {
              'soId': 77,
              'secOrganize': '南京盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 78,
              'secOrganize': '青岛盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 79,
              'secOrganize': '上海盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 80,
              'secOrganize': '上海盒马常温B2C仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 81,
              'secOrganize': '太仓宝原常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 82,
              'secOrganize': '天津盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 83,
              'secOrganize': '天津盒马常温B2C仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 84,
              'secOrganize': '武汉盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 85,
              'secOrganize': '西安盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 86,
              'secOrganize': '厦门盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 87,
              'secOrganize': '重庆盒马常温B2B仓储',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 88,
              'secOrganize': '猎豹突击队',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 89,
              'secOrganize': '盒马深圳充电房',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 90,
              'secOrganize': '盒马北京冷链仓',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 10,
          'firOrganize': '运输事业部',
          'secondOrganizeResponseList': [
            {
              'soId': 4,
              'secOrganize': '北京盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 5,
              'secOrganize': '北京盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 6,
              'secOrganize': '北京盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 7,
              'secOrganize': '北京盒马冷冻中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 8,
              'secOrganize': '北京盒马鲜活中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 9,
              'secOrganize': '长沙盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 10,
              'secOrganize': '长沙盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 11,
              'secOrganize': '长沙盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 12,
              'secOrganize': '成都盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 13,
              'secOrganize': '成都盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 14,
              'secOrganize': '成都盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 15,
              'secOrganize': '成都盒马鲜活中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 16,
              'secOrganize': '福州盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 17,
              'secOrganize': '福州盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 18,
              'secOrganize': '福州盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 19,
              'secOrganize': '广州盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 20,
              'secOrganize': '广州盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 21,
              'secOrganize': '广州盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 22,
              'secOrganize': '广州尤妮佳常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 24,
              'secOrganize': '杭州盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 23,
              'secOrganize': '贵阳盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 25,
              'secOrganize': '杭州盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 26,
              'secOrganize': '杭州盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 27,
              'secOrganize': '南京盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 28,
              'secOrganize': '南京盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 29,
              'secOrganize': '南京盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 30,
              'secOrganize': '青岛盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 31,
              'secOrganize': '青岛盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 32,
              'secOrganize': '青岛盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 33,
              'secOrganize': '上海安鲜达常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 34,
              'secOrganize': '上海百世店加常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 35,
              'secOrganize': '上海便利蜂常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 36,
              'secOrganize': '上海恩溢常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 37,
              'secOrganize': '上海果雪常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 38,
              'secOrganize': '上海海宝常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 39,
              'secOrganize': '上海盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 40,
              'secOrganize': '上海盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 41,
              'secOrganize': '上海盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 42,
              'secOrganize': '上海盒马鲜活中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 43,
              'secOrganize': '上海凯登常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 44,
              'secOrganize': '上海乐天马特常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 45,
              'secOrganize': '上海零担运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 46,
              'secOrganize': '上海顺丰常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 47,
              'secOrganize': '上海喜士多常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 48,
              'secOrganize': '上海尤妮佳常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 49,
              'secOrganize': '上海月星常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 50,
              'secOrganize': '上海造作常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 51,
              'secOrganize': '上海资生堂常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 52,
              'secOrganize': '深圳盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 53,
              'secOrganize': '深圳盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 54,
              'secOrganize': '深圳盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 55,
              'secOrganize': '天津盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 56,
              'secOrganize': '天津盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 57,
              'secOrganize': '天津盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 58,
              'secOrganize': '武汉盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 59,
              'secOrganize': '武汉盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 60,
              'secOrganize': '武汉盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 61,
              'secOrganize': '西安盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 62,
              'secOrganize': '西安盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 63,
              'secOrganize': '西安盒马加工中心运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 64,
              'secOrganize': '运输监控',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 65,
              'secOrganize': '运输结算',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 66,
              'secOrganize': '重庆盒马常温B2B运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 67,
              'secOrganize': '重庆盒马常温B2C运输',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 68,
              'secOrganize': '重庆盒马加工中心运输',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 9,
          'firOrganize': '我好送事业部',
          'secondOrganizeResponseList': []
        },
        {
          'foId': 8,
          'firOrganize': '电商事业部',
          'secondOrganizeResponseList': []
        },
        {
          'foId': 7,
          'firOrganize': '好饭碗事业部',
          'secondOrganizeResponseList': [
            {
              'soId': 3,
              'secOrganize': '产品运营部',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 6,
          'firOrganize': '软件开发部',
          'secondOrganizeResponseList': [
            {
              'soId': 1,
              'secOrganize': '软件开发组',
              'thirdOrganizeResponseList': []
            },
            {
              'soId': 2,
              'secOrganize': '数据分析部',
              'thirdOrganizeResponseList': []
            }
          ]
        },
        {
          'foId': 5,
          'firOrganize': '品牌宣传与企业文化部',
          'secondOrganizeResponseList': []
        }
      ]
    }
  }
})

// 删除
Mock.mock(ServerApi.entryDelete.path + '.mock', ServerApi.entryDelete.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '删除成功' ],
    code: 200
  }
})

// 新增
Mock.mock(ServerApi.entryAdd.path + '.mock', ServerApi.entryAdd.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '新增成功' ],
    code: 200
  }
})

// 查看详情
Mock.mock(ServerApi.entryDetail.path + '.mock', ServerApi.entryDetail.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '查看详情成功' ],
    code: 200
  }
})

// 修改
Mock.mock(ServerApi.entryUpadte.path + '.mock', ServerApi.entryUpadte.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '修改成功' ],
    code: 200
  }
})

// 导入
Mock.mock(ServerApi.entryImport.path + '.mock', ServerApi.entryImport.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '导入成功' ],
    code: 200
  }
})

// 导出
Mock.mock(ServerApi.entryExport.path + '.mock', ServerApi.entryExport.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '导出成功' ],
    code: 200
  }
})

// 下载导入模板
Mock.mock(ServerApi.entryDowloadModel.path + '.mock', ServerApi.entryDowloadModel.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '导出成功' ],
    code: 200
  }
})

// 入职生效-实现
Mock.mock(ServerApi.entrySuccess.path + '.mock', ServerApi.entrySuccess.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    data: {},
    msg: [ '入职生效' ],
    code: 200
  }
})

// 查询法人主体-实现
Mock.mock(ServerApi.entryLegalEntity.path + '.mock', ServerApi.entryLegalEntity.type, (res:any) => {
  console.log(JSON.parse(res.body))
  return {
    code: 200,
    currentPage: 1,
    data: [
      { entityId: 1, entity: '上海上嘉物流有限公司' },
      { entityId: 2, entity: '上海上嘉物流科技有限公司' },
      { entityId: 3, entity: '宁波上嘉弘昇物流有限公司' },
      { entityId: 4, entity: '上海上嘉物流有限公司北京分公司' },
      { entityId: 5, entity: '宁波上嘉弘昇物流有限公司深圳分公司' },
      { entityId: 6, entity: '宁波上嘉弘昇物流有限公司广州分公司' },
      { entityId: 7, entity: '宁波上嘉弘昇物流有限公司苏州分公司' },
      { entityId: 8, entity: '宁波上嘉弘昇物流有限公司成都分公司' },
      { entityId: 9, entity: '宁波上嘉弘昇物流有限公司武汉分公司' },
      { entityId: 10, entity: '宁波上嘉弘昇物流有限公司杭州分公司' },
      { entityId: 11, entity: '宁波上嘉弘昇物流有限公司南京分公司' },
      { entityId: 12, entity: '宁波上嘉弘昇物流有限公司西安分公司' },
      { entityId: 13, entity: '宁波上嘉弘昇物流有限公司南通分公司' },
      { entityId: 14, entity: '宁波上嘉弘昇物流有限公司长沙分公司' },
      { entityId: 15, entity: '重庆上嘉现代物流发展有限公司' },
      { entityId: 16, entity: '宁波上嘉弘昇物流有限公司厦门分公司' },
      { entityId: 17, entity: '上海上嘉供应链管理有限公司天津分公司' },
      { entityId: 18, entity: '上海上嘉物流科技有限公司福州分公司' },
      { entityId: 19, entity: '宁波上嘉弘昇物流有限公司贵阳分公司' },
      { entityId: 20, entity: '上海上嘉物流科技有限公司昆明分公司' }
    ],
    isMore: null,
    pageSize: 20,
    startIndex: null,
    totalNum: 20,
    totalPage: 1,
    msg: ['查询法人主体成功']
  }
})
