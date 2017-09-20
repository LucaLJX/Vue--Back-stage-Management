<style lang="less">
</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <div class="common-top-right">
        <i-button class="common-right-btn" type="primary" size="small" @click="route2('/company/exam/edit')"
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

  </div>
</template>

<script type="text/ecmascript-6">


  var ezjsUtil = Vue.ezjsUtil; var dict = ezjsUtil.dictUtil;
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
    watch: {
      '$route': function () {
        var _this = this;
        if (this.$route.path === '/company/exam') {
          _this.$router.push('/company/exam/list')
        }
      }
    },
    created: function () {
      var _this = this;
      if (this.$route.path === '/company/exam') {
        _this.$router.push('/company/exam/list')
      }
    },

    methods: {
      route2(path){
        this.$router.push(path)
      }
    }
  }
</script>
