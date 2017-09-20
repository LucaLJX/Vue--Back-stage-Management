var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./webpack.base.conf')

var webpackConfig = merge(config, {
  devtool: false,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
})

module.exports = webpackConfig
