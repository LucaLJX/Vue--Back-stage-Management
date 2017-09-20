import apiService from '../apiService'
import apiConstants from '../apiConstants'
import sessionUtil from '../sessionUtil'
import filterUtil from '../filterUtil'
import util from '../util'

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
    	sessionUtil: sessionUtil,

        filterUtil: filterUtil,
        util: util,
    }

}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;
