var proxy = require('http-proxy-middleware')
var target = require('../env.config').host

/**
 * 向 java 后台请求的代理
 */
module.exports = proxy('/api', {
  target,
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/api': '/' },
  onProxyReq(proxyReq, req, res) {
    console.log('sails.config:')
    console.log(sails.config.javaApiHost)
    // 必须要处理 header 信息
    var leader = req.session.leader || { id: null, companyId: null }

    // 修改 header，使其包含用户信息
    proxyReq.setHeader('leader_id', leader.id)
    proxyReq.setHeader('company_id', leader.companyId)
  }
})
