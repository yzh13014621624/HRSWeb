/**
 * @author minjie
 * @createTime   2019/04/03
 * @description  webpack 正式环境的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'prod'
const path = require('path')
const common = require('./webpack.web.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const packages = require('../package.json')
const resolvePath = function (dir) {
  return path.join(__dirname, '..', dir)
}

let prodConfig = merge(common, {
  target: 'web',
  mode: process.env.NODE_ENV,
  entry: {
    main: [path.resolve(__dirname, '../src/index.tsx')]
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([{
      from: resolvePath('statics'),
      to: resolvePath('dist/statics')
    }]),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require(path.join(__dirname, './dll/', 'vendor.manifest.json'))
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./dll/vendor.js'),
      includeSourcemap: false,
      hash: true
    })
  ],
  optimization: {
    splitChunks: {
      name: 'comon',
      chunks: 'all',
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      minSize: 30000,
      cacheGroups: {
        vendor: { // 抽离第三方插件
          test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minSize: 0, // 大于0个字节
          name: `vendor-${packages.version}`, // 打包后的文件名，任意命名
          filename: 'js/common.bundle.[chunkhash:8].js',
          priority: 10,
          minChunks: 2 // 在分割之前，这个代码块最小应该被引用的次数
        },
        common: {
          chunks: 'initial',
          minSize: 0, // 大于0个字节
          minChunks: 2 // 抽离公共代码时，这个代码块最小被引用的次数
        }
      }
    },
    runtimeChunk: {
      name: 'mianifels'
    },
    minimizer: [
      new UglifyJSPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: 'all' // 移除注释
      }),
      new OptimizeCssAssetsPlugin()
    ]
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  }
})

if (process.env.tag === 'testdev') {
  // prodConfig.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8919 }))
}

module.exports = prodConfig
