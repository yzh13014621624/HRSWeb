/**
 * @author minjie
 * @createTime 2019/04/03
 * @description  webpack 测试环境的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'dev'
const path = require('path')
const common = require('./webpack.web.js')
const merge = require('webpack-merge')
const webpack = require('webpack')

const pathURL = '127.0.0.1'
// const pathURL = '0.0.0.0'
const port = 8000

module.exports = merge(common, {
  devtool: 'inline-source-map',
  entry: {
    main: [
      'react-hot-loader/patch',
      path.resolve(__dirname, '../src/index.tsx')
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].[hash:8].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, '../'),
    compress: true,
    host: pathURL,
    hot: true,
    open: true,
    port: port,
    inline: true,
    historyApiFallback: true,
    lazy: false, // 不启动懒加载
    progress: true
  },
  mode: process.env.NODE_ENV,
  target: 'web'
})
