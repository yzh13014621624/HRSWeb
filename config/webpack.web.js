/**
 * @author minjie
 * @createTime   2019/04/03
 * @description  webpack 公共的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const path = require('path')
const packages = require('../package.json')
const moment = require('moment')
const webpack = require('webpack')
const theme = require('./theme.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const resolvePath = function (dir) {
  return path.join(__dirname, '..', dir)
}

const { CheckerPlugin } = require('awesome-typescript-loader')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})
let headerText = '上嘉HR系统'
if (process.env.tag === 'tes') {
  console.log(process.env.tag, 'process.env.tagprocess.env.tagprocess.env.tag')
  headerText = '上嘉HR系统-测试'
} else if (process.env.tag === 'pre') {
  headerText = '上嘉HR系统-预发'
} else if (process.env.tag === 'dev') {
  headerText = '上嘉HR系统-开发'
}

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: headerText,
      filename: 'index.html',
      template: resolvePath('config/index.ejs'),
      hash: true,
      inject: true,
      cache: false,
      favicon: resolvePath('src/assets/images/icon.ico'),
      minify: {
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true // 缩小CSS样式元素和样式属性
      },
      nodeModules: resolvePath('node_modules')
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash:8].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash:8].css'
    }),
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        SERVICE_URL: JSON.stringify(process.env.tag),
        version: JSON.stringify(packages.version),
        build: JSON.stringify(moment(new Date()).format('YYYY.MM.DD HHmmss')),
        headerText: JSON.stringify(headerText)
      }
    }),
    new HappyPack({
      id: 'css',
      loaders: ['css-loader', 'postcss-loader'],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'less',
      loaders: ['css-loader',
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            modifyVars: theme,
            javascriptEnabled: true
          }
        }
      ],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'stylus',
      loaders: ['css-loader', 'postcss-loader', 'stylus-loader'],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'tsxs',
      loaders: [{
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }],
      threadPool: happyThreadPool
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'assets/images/[name].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'css/fonts/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=less'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=stylus'
        ]
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=css'
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.(j|t)sx?$/,
        include: /node_modules/,
        use: ['react-hot-loader/webpack']
      },
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['happypack/loader?id=tsxs']
      },
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              transplieOnly: true,
              useCache: true,
              cacheDirectory: resolvePath('node_modules/.cache-loader'),
              useBabel: true,
              babelCore: '@babel/core'
            }
          },
          resolvePath('config/px2RemLoader.js')
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@components': resolvePath('src/components'),
      '@shared': resolvePath('src/containers/shared'),
      '@pages': resolvePath('src/containers/pages'),
      '@utils': resolvePath('src/utils'),
      '@router': resolvePath('src/router'),
      '@assets': resolvePath('src/assets'),
      '@server': resolvePath('src/server'),
      '@mock': resolvePath('src/mock'),
      '@statics': resolvePath('statics'),
      rootComponent$: resolvePath('src/components/root/RootComponent.tsx'),
      serverApi$: resolvePath('src/server/ServerApi.ts')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css', '.styl']
  }
}
