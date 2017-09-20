var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./webpack.base.conf')

var webpackConfig = merge(config, {
  watch: true,
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ]
})

module.exports = webpackConfig
