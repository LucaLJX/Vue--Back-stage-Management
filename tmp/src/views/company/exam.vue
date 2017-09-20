<style lang="less">
</style>

<template>

    <!-- common-top -->
    <div class="common-top-container">
        <div class="common-top-ver-line"></div>
        <a class="common-top-title-left" v-link="pageData.link">{{ pageData.title }}</a>
        <div class="common-top-right">
            <i-button class="common-right-btn" type="primary" size="small" v-link="'/company/exam/edit'"
                    v-show="$route.path.indexOf('/company/exam/edit') == -1"
                      >创建考试
            </i-button>
            <i-button type="ghost" size="small" onclick="history.back()"
                    v-show="$route.path != '/company/exam/list'">
                <Icon type="android-arrow-back"></Icon>
                &nbsp;返回
            </i-button>
        </div>
    </div>

    <!-- tb-container -->
    <div class="tb-container">
        <router-view></router-view>
    </div>

</template>

<script type="text/javascript">
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
    var apiConstants = ezjsUtil.constants.api;

    export default {
        data () {
            return {
                dict: dict,

                pageData: {
                    title: '考试管理',
                    link: '/company/exam'
                },

            };
        },
        route: {
            data: function(transition) {
                var _this = this;
                console.log(transition.to.path)
                if(transition.to.path === '/company/exam'){
                    _this.$route.router.go('/company/exam/list')
                }
            }
        },
        created: function () {
            var _this = this;
            if(this.$route.router.path === '/company/exam'){
                _this.$route.router.go('/company/exam/list')
            }
        },

        methods: {

        }
    }
</script>