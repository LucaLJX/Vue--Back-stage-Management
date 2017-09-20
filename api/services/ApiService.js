/**
 * node 端使用的请求
 */
var host = require('../env.config').host

var path = require('path')
var rest = require('restler')

/**
 * 从 req 中获取要配置的 header
 * @param {*} req
 */
function getHeaders(req) {
  // TODO
  // return {
  //   staffid: 5972,
  //   companyid: 2
  // }
  if (req) {
    return {}
  }
  return {}
}

class Ezapi {
  constructor({host}) {
    this.host = host
  }

  request(req, api, data, cb) {
    var url = this.host + api.url
    var callback = function (data, res) {
      if (!data) return cb({code: 500}, null)
      if (data.status == 500) return cb({code: 500}, null)
      if (data.status == 400) return cb({code: 400}, null)
      return cb(data, res)
    }

    sails.log.debug('method & url:', api.method, url)
    sails.log.debug('& request data:', JSON.stringify(data))

    var options = {
      data,
      headers: getHeaders(req),
      method: api.method,
      parser: rest.parsers.auto
    }
    rest.request(url, options)
      .on('complete', callback)
  }

}

module.exports = new Ezapi({host})
