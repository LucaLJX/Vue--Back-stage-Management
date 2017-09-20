var path = require('path')
var glob = require('glob')

const SOURCE = 'client/js/**/*.js'

var dirs = glob.sync(SOURCE)

module.exports = {
  entry: getFilesMap(dirs),
  output: {
    path: path.resolve(__dirname, '../.tmp/public'),
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, '../client')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader',
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]'
        }
      }
    ]
  }
}

/**
 * 需要打包 js 文件入口列表映射
 */
function getFilesMap(dirs) {
  const filesMap = {}

  dirs.forEach(item => {
    const name = item.replace(/^client\/js\//, '').replace(/.js$/, '')
    filesMap[name] = path.resolve(item)
  })

  return filesMap
}
