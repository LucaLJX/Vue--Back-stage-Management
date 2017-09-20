<style scoped lang="less">
  .headbar {
    background-color: #f1f1f1;
    position: fixed;
    top: 0;
    width: 100%;
    padding-left: 180px;
    height: 40px;
    z-index: 900;
    font-size: 16px;
    line-height: 40px;
    color: #919191;
    border-bottom: 1px solid #ddd;

  a {
    text-decoration: none;
    color: #919191;
    font-size: 14px;
  }

  .headbar-icon-1 {
    font-size: 18px;
    line-height: 40px;
    width: 30px;
    display: block;
    float: left;
    margin-left: 20px;
    /* margin: 14px 3px 16px 25px; */
  }

  .headbar-right {
    float: right;

  p {
    font-size: 12px;
    display: block;
    float: right;
    margin-right: 20px;

  }

  .headbar-icon-box {
    display: block;
    width: 40px;
    height: 40px;
    border-left: 1px solid #ddd;
    float: right;
    text-align: center;

  .headbar-icon-2 {
    display: inline-block;
    font-size: 18px;
    line-height: 40px;
  }

  .headbar-icon-2:hover {
    color: #3091f2;
  }

  }
  }
  }
</style>
<template>
  <div class="headbar">
    <a href="/index">
      <Icon type="ios-people-outline" class="headbar-icon-1"></Icon>
      管理控制台</a>
    <div class="headbar-right">
      <a @click="logout()" class="headbar-icon-box">
        <Icon type="log-out" class="headbar-icon-2"></Icon>
      </a>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        context: 'headbar'
      }
    },

    methods: {
      logout() {
        this.$http.get('/logout').then(res => {
          var resBody = res.body
          var code = resBody.code;
          var msg = resBody.message
          if (code == 200) {//success
            location.href = '/login'; //TODO: 获得当前登录企业的id.  ?companyId=
          }
          //failed
          Vue.prototype.$Message.error("退出系统失败,请直接关闭浏览器.", 3)
        })
      },
    }
  }


</script>
