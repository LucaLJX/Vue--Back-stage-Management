<style scoped>
  .left-content {
    position: fixed;
    height: 100%;
    background-color: #1c2438;
    z-index: 910;
    width: 180px;
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
    <div class="left-content">
      <submenu></submenu>
    </div>
    <headbar></headbar>
    <div class="right-content">
      <div class="right-main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import submenu from './submenu'
  import headbar from './headbar'

  export default {
    components: {submenu, headbar},
    data () {
      return {}
    },
    beforeCreate () {
      console.log('creating layout');
      // 模拟 获取当前登录用户信息
//      var keep = false;
//      var keep = true;
//      var user = Vue.ezjsUtil.$auth.user();
//      if (user && keep) {
//        console.log('user in session: ', user);
//      } else {
//        var currentUserFromAjax = {
//          "id": 1,
//          "name": "朱劲松",
//          "num": "teacher_test",
//
//          "role": ["teacher", "leader"],
//          "leader_id": 1,
//
//          "company_id": 2,
//          "company_logo": "/src/images/head-pic.jpg",
//          "company_name": "北京信息科技大学",
//        };
//        Vue.ezjsUtil.$auth.user(currentUserFromAjax);
//      }

    },
    methods: {}
  }
</script>
