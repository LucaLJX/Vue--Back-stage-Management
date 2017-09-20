<style lang="less" scoped>

</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <div class="common-top-right">
        <Button size="small" type="primary" @click="editPassword">修改密码</Button>
      </div>
    </div>
    <!-- tb-container -->
    <div class="tb-container">
      <Card>
        <p slot="title">登录信息</p>
        <Form ref="editObj" :model="editData.editObj" :rules="editData.validate" inline label-position="right" :label-width="80" style="width: 250px;">
          <Form-item label="用户昵称" prop="name">
            <Input type="text" v-model="editData.editObj.name" placeholder="用户昵称">
            </Input>
          </Form-item>
          <Form-item label="登录账号" prop="user">
            <p>{{ editData.loginNum }}</p>
          </Form-item>
        </Form>
        <Button type="primary" @click="edit_ok('editObj')">确定</Button>
      </Card>
    </div>
    <!-- modal -->
    <Modal v-model="passwordData.visible" :title="passwordData.title" :closable="false" :mask-closable="false">
      <Form label-position="right" :label-width="80" :model="passwordData.passwordObj" :rules="passwordData.validate" ref="editPassword">
        <Form-item label="您的旧密码" prop="oldPassword">
          <Input type="password" v-model="passwordData.passwordObj.oldPassword" placeholder="请输入旧密码" style="width: 300px;"></Input>
        </Form-item>
        <Form-item label="输入新密码" prop="newPassword">
          <Input type="password" v-model="passwordData.passwordObj.newPassword" placeholder="请输入新密码" style="width: 300px;"></Input>
        </Form-item>
        <Form-item label="新密码确认" prop="confirmPassword">
          <Input type="password" v-model="passwordData.passwordObj.confirmPassword" placeholder="请再次输入新密码" style="width: 300px;"></Input>
        </Form-item>
        <Form-item label="温馨提示">
          <p>为了您的账户安全，请妥善保存好您的密码!</p>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="editPassword_cancel('editPassword')">取消</Button>
        <Button type="primary" :loading="passwordData.loading" @click="editPassword_ok('editPassword')">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>

var ezjsUtil = Vue.ezjsUtil;
var dict = ezjsUtil.dictUtil;
var apiConstants = ezjsUtil.constants.api;

export default {
  data() {
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
          if (this.passwordData.passwordObj.newPassword != '') {
            // 对新密码的第二个密码框单独验证
            this.$refs.editPassword.validateField('confirmPassword');
          }
          callback();
        }
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.passwordData.passwordObj.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
    };
    return {
      // 当前页面的信息：名称、链接
      pageData: {
        title: '修改信息',
        link: '/userInfo'
      },
      editData: {
        loginNum: '',
        editObj: {
          name: '',
        },
        validate: {
          name: [
            { required: true, message: '请填写昵称', trigger: 'blur' },
            { type: 'string', max: 15, message: '昵称长度不能超过15个字符', trigger: 'blur' }
          ],
        }
      },
      passwordData: {
        title: '修改密码',
        visible: false,
        loading: false,
        passwordObj: {
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
      }
    }
  },
  created: function() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      var _this = this;
      ezjsUtil.request(apiConstants.company_leader_detailSelf, {

      },
        function(err, data) {
          if (err) {
            return;
          }
          _this.editData.editObj.name = data.leader.name;
          _this.editData.loginNum = data.leader.num;
        }
      )
    },
    edit_ok(name) {
      var _this = this;
      _this.$refs[name].validate(function(valid) {
        if (valid) {
          ezjsUtil.request(apiConstants.company_leader_editName, _this.editData.editObj,
            function(err, data) {
              if (err) {
                return;
              }
              _this.$Message.success('修改成功！');
              _this.$refs[name].resetFields();
              _this.getUserInfo();
            }
          )
        } else {
          _this.$Message.error('表单验证失败!');
        }
      });
    },
    // 修改密码
    editPassword () {
      this.passwordData.visible = true;
    },
    editPassword_ok (name) {
      var _this = this;
      _this.$refs[name].validate(function(valid) {
        if (valid) {
          _this.passwordData.loading = true;
          ezjsUtil.request(apiConstants.company_leader_updatePassword,{
            oldPassword: _this.passwordData.passwordObj.oldPassword,
            newPassword: _this.passwordData.passwordObj.newPassword

          },
            function (err, data) {
              if (err) {
                return;
              }
              _this.$Message.success('修改成功！');
              _this.$refs[name].resetFields();
              _this.passwordData.loading = false;
              _this.passwordData.visible = false;
            }
          )
        } else {
          _this.$Message.error('表单验证失败!');
        }
      });
    },
    editPassword_cancel (name) {
      var _this = this;
      _this.$Message.info('取消修改');
      _this.$refs[name].resetFields();
      _this.passwordData.loading = false;
      _this.passwordData.visible = false;
    }
  }
}
</script>
