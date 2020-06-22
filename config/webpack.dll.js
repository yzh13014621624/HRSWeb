/**
 * @author minjie
 * @createTime   2019/09/18
 * @description  tii na
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

'use strict'
process.env.NODE_ENV = 'production'
const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV,
  entry: {
    // 需要预配置动态链接的库
    vendor: [
      'ali-oss',
      'antd',
      'axios',
      'crypto-js',
      'js-md5',
      'jquery',
      'mobx',
      'mobx-react',
      'moment',
      'nprogress',
      'react',
      'react-dom',
      'react-loadable',
      'react-router-dom',
      'react-sortable-hoc'
    ]
  },
  output: {
    path: path.resolve(__dirname, './dll'),
    publicPath: './',
    filename: '[name].js',
    library: '[name]_library_wcr'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, './dll', '[name].manifest.json'),
      name: '[name]_library_wcr'
    })
  ]
}
