<style scoped lang="less">

</style>

<template>
    <div class="login-container">
        <div class="form-wrapper">
            <h1 class="login-title">学生在线考试系统</h1>
            <i-form v-ref:login-user :model="loginUser" :rules="ruleInline" @keyup="handleSubmit($event)" >
                <Form-item prop="user">
                    <i-input type="text" :value.sync="loginUser.username" placeholder="用户名(学号)">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </i-input>
                </Form-item>
                <Form-item prop="password">
                    <i-input type="password" :value.sync="loginUser.password" placeholder="密码">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </i-input>
                </Form-item>
                <div v-show="error" style="color:red; word-wrap:break-word;margin-bottom: 12px;">{{ error | json }}</div>
                <Form-item>
                    <i-button type="primary" @click="handleSubmit()">登录</i-button>
                </Form-item>
            </i-form>
        </div>
    </div>

</template>

<script type="text/javascript">


    export default {
        data () {
            return {
                context: 'login context',
                loginUser: {
                    username: '2011011042',
                    password: '123456'
                },
                rememberMe: false,
                error: null
            }
        },
        created: function () {
            this.loginUser.authType = 3;
            if(this.$route.path.indexOf('/login') == 0){
                this.loginUser.companyName = this.$route.params.companyName;
                if(!this.loginUser.companyName){
                    this.error = '请检查登录地址是否携带学校信息'
                }
            }
        },
        methods:{
        	handleSubmit(ev){
                var sub = true;
                if(ev){
                    if(ev.keyCode!=13){
                        sub = false;
                    }
                }
                if(!sub){
                    return;
                }
                this.$auth.login({
                    body: this.loginUser,
                    rememberMe: this.rememberMe,
                    redirect: '/staff/index',
                    success() {
                        console.log('success ' + this.context);
                        // this.$route.router.go('/staff/index');
                    },
                    error(res) {
                        console.log('error ' + this.context);
                        this.error = res.data.message;
                    }
                });

        	}
        }
    }
</script>