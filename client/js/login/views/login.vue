<style scoped lang="less">

</style>

<template>
  <div class="login-container">
    <div class="form-wrapper">
      <h1 class="login-title">考试管理系统</h1>
      <i-form ref="loginUser" :model="loginUser" :rules="ruleInline" @keyup="handleSubmit($event)">
        <Form-item prop="user">
          <i-input type="text" v-model="loginUser.username" placeholder="用户名" @on-enter="handleSubmit">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </Form-item>
        <Form-item prop="password">
          <i-input type="password" v-model="loginUser.password" placeholder="密码" @on-enter="handleSubmit">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </i-input>
        </Form-item>
        <div style="color:red; word-wrap:break-word;margin-bottom: 12px;">{{ error }}&nbsp;</div>
        <Form-item>
          <i-button type="primary" @click="handleSubmit()">登录</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        context: 'login context',
        loginUser: {
          username: '',
          password: '',
          companyName: null,
          companyId: 1
        },
        error: null,
        ruleInline: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    mounted(){
      var qs = {};
      var s = location.search.replace(/^\?|#.*$/g, '');
      if (s) {
        var qsParts = s.split('&');
        var i, nv;
        for (i = 0; i < qsParts.length; i++) {
          nv = qsParts[i].split('=');
          qs[nv[0]] = nv[1];
        }
      }
      // if (qs.companyId) {
      //   this.loginUser.companyId = qs.companyId
      // } else if (qs.companyName) {
      //   this.loginUser.companyName = qs.companyName
      // }
      // if (!this.loginUser.companyName && !this.loginUser.companyId) {
      //   this.error = '请检查登录地址是否携带学校信息'
      // }
    },
    methods: {
      handleSubmit(ev){
        var sub = true;
        if (ev) {
          if (ev.keyCode != 13) {
            sub = false;
          }
        }
        if (!sub) {
          return;
        }

        this.$http.post('/login', this.loginUser).then(res => {
          var resBody = res.body
          var code = resBody.code;
          var msg = resBody.message
          if (code == 200) {//success
            location.href = '/dashboard';
          }
          //failed
          this.error = (msg)
        })

      }
    }
  }
</script>
