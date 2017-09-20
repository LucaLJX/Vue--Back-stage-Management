import layout from './components/layout'
import router from './router'
import ezjs from '../../assets/libs/ezjs/index'

// 验证登录状态
$.post('/login/status').then(res => {
	if (!res.data) {
    location.href = '/login?companyId=' + CURRENT_LEADER.companyId
	}
}).fail(e => { console.error(e)} )

new Vue({
  el: '#app',
  router,
  components: {
    layout
  }
})

//If your web server can't handle requests encoded as application/json, you can enable the emulateJSON option. This will send the request as application/x-www-form-urlencoded MIME type, as if from an normal HTML form.
Vue.http.options.emulateJSON = true;

Vue.use(ezjs);

// 开启debug模式
Vue.config.debug = true;

/**
 * 只要包含一个角色即返回true
 * @param role
 * @returns {boolean}
 */
const authCheck = function (...roles) {
  if (!roles) {
    return false;
  }
  for(var role of roles) {
    if (CURRENT_LEADER.roles.indexOf(role) >= 0) {
      return true;
    }
  }
  return false;
}

Object.defineProperties(Vue.prototype, {
  authCheck: {
    get: function () {
      return authCheck;
    }
  },
  $nfs: {
    get: function () {
      return {
        uploadUrl: nfsUtil.uploadUrl,
        getFileUrl: function (token) {
          return nfsUtil.getFileUrl(token)
        },
        types: {
          company: {
            type: 'company'
          },
          documentTree: {
            type: 'document/tree/' + CURRENT_LEADER.companyId
          },
          material: {
            type: 'material/' + CURRENT_LEADER.companyId
          },
          question: {
            type: 'question/' + CURRENT_LEADER.companyId
          },
          // 新增
          documents: {
            type: 'new/documents/' + CURRENT_LEADER.companyId
          },
          teachers: {
            type: 'new/teachers/' + CURRENT_LEADER.companyId
          },
          course: {
            type: 'new/course/' + CURRENT_LEADER.companyId
          }
        }
      }
    }
  }
});



