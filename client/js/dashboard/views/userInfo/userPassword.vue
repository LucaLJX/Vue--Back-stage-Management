<style lang="less" scoped>

</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <div class="common-top-right"></div>
    </div>
    <!-- tb-container -->
    <div class="tb-container">
      <Card>
        <p slot="title">修改密码</p>
        <Form ref="editObj" :model="editData.editObj" :rules="editData.validate" inline label-position="right" :label-width="80" style="width: 450px;">
          <Form-item label="您的旧密码" prop="oldPassword">
            <Input type="password" v-model="editData.editObj.oldPassword" placeholder="请输入旧密码" style="width: 300px;"></Input>
          </Form-item>
          <Form-item label="输入新密码" prop="newPassword">
            <Input type="password" v-model="editData.editObj.newPassword" placeholder="请输入新密码" style="width: 300px;"></Input>
          </Form-item>
          <Form-item label="新密码确认" prop="confirmPassword">
            <Input type="password" v-model="editData.editObj.confirmPassword" placeholder="请再次输入新密码" style="width: 300px;"></Input>
          </Form-item>
          <Form-item label="温馨提示">
            <p>为了您的账户安全，请妥善保存好您的密码!</p>
          </Form-item>
        </Form>
        <Button type="primary" @click="edit_ok('editObj')">确定</Button>
      </Card>
    </div>

  </div>
</template>

<script>

  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;

  export default {
    data () {
      const validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length < 8) {
            callback(new Error('密码长度不能小于8位'));
          } else if (value.length > 16) {
            callback(new Error('密码长度不能超过16位'));
          } else if (reg.test(value) == false) {
            callback(new Error('密码只能是数字、字母组合，且不能只用其中一种'));
          } else {
            if (this.editData.editObj.newPassword != '') {
              // 对新密码的第二个密码框单独验证
              this.$refs.editObj.validateField('confirmPassword');
            }
            callback();
          }
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else {
          if (value !== this.editData.editObj.newPassword) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        }
      };
      return {
        // 当前页面的信息：名称、链接
        pageData: {
          title: '修改密码',
          link: '/userPassword'
        },
        editData: {
          loginNum: '',
          editObj: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          },
          validate: {
            oldPassword: [
              { validator: validateOldPass, trigger: 'blur' },
            ],
            newPassword: [
              { validator: validatePass, trigger: 'blur' },
            ],
            confirmPassword: [
              { validator: validatePassCheck, trigger: 'blur' },
            ],
          }

        },
      }
    },
    created: function () {
    },
    methods: {
      edit_ok (name) {
        var _this = this;
        _this.$refs[name].validate(function(valid) {
          if (valid) {
            ezjsUtil.request(apiConstants.company_leader_updatePassword,{
              oldPassword: _this.editData.editObj.oldPassword,
              newPassword: _this.editData.editObj.newPassword

            },
              function (err, data) {
                if (err) {
                  return;
                }
                _this.$Message.success('修改成功！');
                _this.$refs[name].resetFields();
              }
            )
          } else {
            _this.$Message.error('表单验证失败!');
          }
        });
      },
    }
  }
</script>
