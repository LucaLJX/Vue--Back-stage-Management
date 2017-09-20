import login from './views/login'
// import router from './router'
import ezjs from '../../assets/libs/ezjs/index'

new Vue({
  el: '#app',
  // router,
  components: {
    login
  }
})
//If your web server can't handle requests encoded as application/json, you can enable the emulateJSON option. This will send the request as application/x-www-form-urlencoded MIME type, as if from an normal HTML form.
Vue.http.options.emulateJSON = true;

Vue.use(ezjs);

// 开启debug模式
Vue.config.debug = true;

