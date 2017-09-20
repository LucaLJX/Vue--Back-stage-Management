import apiService from './plugins/apiService'
import apiConstants from './plugins/apiConstants'
import filterUtil from './plugins/filterUtil'
import dictUtil from './plugins/dictUtil'
import authUtil from './plugins/authUtil'
import nfsUtil from './plugins/nfsUtil'

function plugin(Vue) {

  if (plugin.installed) {
    return;
  }
  Vue.apiService = apiService(Vue);

  var as = apiService(Vue);
  Vue.ezjsUtil = {
    constants: {
      api: apiConstants
    },
    request: as.request,
    buildUrl: as.buildFullUrl,

    filterUtil: filterUtil,
    dictUtil: dictUtil,

    nfsUtil: nfsUtil,

    $auth: authUtil,

    eventHub: new Vue()

  };
  console.log('注册ezjs plugin到Vue')
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
