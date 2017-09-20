var gulp = require('gulp')
var webpack = require('webpack')
var uglify = require('gulp-uglify')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var minifycss = require('gulp-minify-css')
var watch = require('gulp-watch')
var del = require('del')
var chalk = require('chalk')

// webpack 配置
var devConfig = require('./build/webpack.dev.conf')
var prodConfig = require('./build/webpack.prod.conf')

/**
 * 清除
 */
gulp.task('clean', cb => del(['.tmp/public/**/*'], cb))

/**
 * sass 和 scss 编译为 css, 并 autoprefixer, 压缩 css
 */
gulp.task('sass', () => {
  gulp.src(['client/scss/**/*.scss', 'client/scss/**/*.sass'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('.tmp/public/css'))
})

/**
 * 打包和压缩 js 脚本 --生产模式
 */
gulp.task('webpack:prod', cb => {
  webpack(prodConfig, (err, stats) => {
    compileLogger(err, stats)
    cb()
  })
})

/**
 * 打包 js --开发模式
 */
gulp.task('webpack:dev', () => {
  webpack(devConfig).watch({}, (err, stats) => {
    compileLogger(err, stats)
  })
})

/**
 * 复制 assets 里面文件到 public 目录
 */
gulp.task('copy', () => {
  gulp.src('client/assets/**/*')
    .pipe(gulp.dest('.tmp/public'))
})

/**
 * watch 文件夹 assets 变化
 */
gulp.task('watch', () => {
  watch('client/assets/**/*', () => {
    gulp.start('copy')
  })

  watch('client/scss/**/*', () => {
    gulp.start('sass')
  })
})


/**
 * 所有文件处理  --生产模式用
 */
gulp.task('build', ['clean'], () => {
  gulp.start(['webpack:prod', 'sass', 'copy'])
})

/**
 * 默认任务 build 和 watch  --开发模式用
 */
gulp.task('default', ['clean'], () => {
  gulp.start(['sass', 'copy'])
  gulp.start('watch', 'webpack:dev')
})


/**
 * webpack 编译记录错误
 */
function compileLogger(err, stats) {
  if (err) {
    console.log(chalk.red(err))
    return
  }

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  console.log(`Webpack '${chalk.green('success')}' after ` +
    `${chalk.magenta((stats.endTime - stats.startTime) + ' ms')}\n`)
}
