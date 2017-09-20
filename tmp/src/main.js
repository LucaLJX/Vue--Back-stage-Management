/**
 * Created by aresn on 16/6/20.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import App from 'components/app.vue';
import Routers from './router';
import Env from './config/env';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './styles/common.css';

import apiPlugin from './libs/plugins/apiPlugin'


Vue.use(VueResource);
//If your web server can't handle requests encoded as application/json, you can enable the emulateJSON option. This will send the request as application/x-www-form-urlencoded MIME type, as if from an normal HTML form.
Vue.http.options.emulateJSON = true;

Vue.use(VueRouter);
Vue.use(iView);

Vue.use(apiPlugin);

// 开启debug模式
Vue.config.debug = true;

// 路由配置
let router = new VueRouter({
    // 是否开启History模式的路由,默认开发环境开启,生产环境不开启。如果生产环境的服务端没有进行相关配置,请慎用
    //history: Env != 'production'
    history: false
});

Vue.router = router;
// Http
// Vue.http.options.root = 'https://api-demo.websanova.com/api/v1';
Vue.http.options.root = '/api/common';

// Vue Auth
Vue.use(require('./libs/auth/src/index.js'), {
    auth: require('./libs/auth/drivers/auth/bearer.js'),
    http: require('./libs/auth/drivers/http/vue-resource.1.x.js'),
    // http: require(f'./libs/auth/drivers/http/axios.1.x.js'),
    router: require('./libs/auth/drivers/router/vue-router.2.x.js'),
    rolesVar: 'role',
    // parseUserData: function (data) {
    //     // console.log(data)
    //     // data.status = 'success'
    //     return data;
    // },
    facebookOauth2Data: {
        clientId: '196729390739201'
    },
    googleOauth2Data: {
        clientId: '337636458732-tatve7q4qo4gnpfcenbv3i47id4offbg.apps.googleusercontent.com'
    }
});


router.map(Routers);

router.beforeEach(() => {
    window.scrollTo(0, 0);
});

router.afterEach(() => {

});

router.redirect({
    '*': "/403"
});
router.start(App, '#app');