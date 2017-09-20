<style scoped>
    .left-content {
        position: fixed;
        height: 100%;
        background-color: #464c5b;
        z-index: 910;
    }
    .right-content {
        width: 100%;
        padding-left: 180px;
    }
    .right-main-content {
        padding-top: 40px;
    }
</style>
<template>
    <div>
        <div class="left-content" v-show="$auth.check()">
            <submenu></submenu>
        </div>
        <headbar></headbar>
        <div class="right-content">
            <div class="right-main-content">
                <router-view></router-view>
            </div>
        </div>
        <footbar></footbar>
    </div>
</template>
<script>
import submenu from 'components/submenu'
import headbar from 'components/headbar'
import footbar from 'components/footbar'

import treeView from 'components/treeview'
import Vue from 'vue'
Vue.component('treeview', treeView)

import su from 'libs/sessionUtil'
window.sessionUtil = su;

// //FIXME:模拟登录用户
// su.set('loginUser', {
//     id: '1',
//     name: 'XX老师',
// });
// su.set('loginCompany', {
//     id: '2',
//     name: '北京大学'
// })

    export default {
        components: { submenu, headbar, footbar },
        data () {
            return {}
        },
        ready () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    }
</script>
