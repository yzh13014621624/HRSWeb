module.exports = {
  ident: 'postcss',
  plugins: [
    require('autoprefixer'),
    require('postcss-px2rem-exclude')({
      remUnit: 192,
      remPrecision: 2,
      exclude: /node_modules/i
    })
  ]
}
