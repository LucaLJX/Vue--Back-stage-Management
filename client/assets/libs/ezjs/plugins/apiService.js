var HOST = '',
  URL_PREFIX = '/api'

var SERVER_ERROR = -1,
  SYSTEM_ERROR = -2;

let apiService = function (Vue) {
  var _validateRes = function (res, cb) {
    if (res && res.status == 200) {
      var resBody = res.body;
      if (resBody.message) {
        //无论状态是否为200,只要message有值,就需要弹出提示信息.
        Vue.prototype.$Message.error(resBody.message, 3)
      }

      if (resBody && resBody.code == 200) {
        var data = resBody.data;
        Vue.prototype.$Loading.finish()
        return cb && cb(null, data)
      } else {
        Vue.prototype.$Loading.error()
        return cb && cb(SYSTEM_ERROR)
      }
    } else {
      Vue.prototype.$Loading.error();
      var msg = "网络异常或者服务器异常,请联系管理员.";
      if (res.body && res.body.message) {
        msg = res.body.message;
      }
      Vue.prototype.$Message.error(msg, 3)
      return cb && cb(SERVER_ERROR)
    }
  }

  var _parseUrl = function (url, data) {
    var arr = url.split('/');
    for (var i in arr) {
      var it = arr[i];
      if (it.indexOf(':') == 0) {
        arr[i] = data['_' + it.substring(1)];
      }
    }
    return arr.join('/');
  }

  var buildUrl = function (url, data) {
    return HOST + URL_PREFIX + _parseUrl(url, data);
  }

  var _get = function (url, cb) {
    Vue.http.get(url).then(function (res) {
      _validateRes(res, cb)
    }, function (res) {
      _validateRes(res, cb)
    })
  };

  var _post = function (url, data, cb) {
    Vue.http.post(url, data).then(function (res) {
      _validateRes(res, cb)
    }, function (res) {
      _validateRes(res, cb)
    })
  };

  return {
    request: function (api, data, cb) {
      var url = buildUrl(api.url, data);
      Vue.prototype.$Loading.start()
      if (api.method == 'get') {
        _get(url, cb);
      } else if (api.method == 'post') {
        _post(url, data, cb);
      } else {
        _post(url, data, cb);
      }
    },
    buildFullUrl(url){
      return buildUrl(url, {});
    }
  }
};


export default apiService;
