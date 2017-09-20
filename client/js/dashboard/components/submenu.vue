<template>

  <Menu :theme="theme_submenu" :active-name="currentActiveName" :open-names="openName" @on-select="handleMenuSelect" width="100%" accordion>
      <Menu-item name="home">
        <Icon type="home"></Icon>
        首页
      </Menu-item>
      <!-- <Menu-item name="staff">
        <Icon type="ios-people"></Icon>
        班级与学生管理
      </Menu-item>
      <Menu-item name="exam">
        <Icon type="ios-paper"></Icon>
        考试管理
      </Menu-item>  -->
      <!-- 内容管理 -->
      <Submenu name="contentManage">
        <template slot="title">
            <Icon type="document-text"></Icon>
            内容管理
        </template>
        <Menu-item name="course">题库管理</Menu-item>
        <Menu-item name="documents">素材管理</Menu-item>
      </Submenu>
      <!--焦点图  -->
      <Menu-item name="infoBannerManage">
        <Icon type="images"></Icon>
        焦点图管理
      </Menu-item>
      <Menu-item name="userManage">
        <Icon type="person-stalker"></Icon>
        用户管理
      </Menu-item>
      <Menu-item name="teacherManage">
        <Icon type="person"></Icon>
        讲师管理
      </Menu-item>
      <!-- 课程管理 -->
      <Submenu name="courseManage">
        <template slot="title">
            <Icon type="calendar"></Icon>
            课程管理
        </template>
        <Menu-item name="courseManage-1">UCM</Menu-item>
        <Menu-item name="courseManage-2">专业能力/素质</Menu-item>
        <Menu-item name="courseManage-3">通识类</Menu-item>
      </Submenu>
      <!-- 系统管理 -->
      <Submenu name="systemManage">
        <template slot="title">
            <Icon type="gear-b"></Icon>
            系统管理
        </template>
        <Menu-item name="userInfo">个人信息管理</Menu-item>
        <Menu-item name="leader">管理员管理</Menu-item>
      </Submenu>
      <!-- 订单管理 -->
      <Menu-item name="orderManage">
        <Icon type="ios-cart"></Icon>
        订单管理
      </Menu-item>
  </Menu>
</template>

<script>
  export default {
    data () {
      return {
        theme_submenu: 'dark',
        currentActiveName: 'home',
        openName: [],
      }
    },
    created: function (){
      var path = this.$route.path;
      if (path.indexOf('/company/course') == 0) {
        this.currentActiveName = 'course';
        this.openName = ['contentManage'];
      } else if (path.indexOf('/company/leader') == 0) {
        this.currentActiveName = 'leader';
        this.openName = ['systemManage'];
      } else if (path.indexOf('/company/staff') == 0) {
        this.currentActiveName = 'staff';
      } else if (path.indexOf('/company/exam') == 0) {
        this.currentActiveName = 'exam';
        // new
        // 素材管理
      } else if (path.indexOf('/company/documents') == 0) {
        this.currentActiveName = 'documents';
        this.openName = ['contentManage'];
        // 课程管理
      } else if (path.indexOf('/courseManage/courseManage/51') == 0) {
        this.currentActiveName = 'courseManage-1';
        this.openName = ['courseManage'];
      } else if (path.indexOf('/courseManage/courseManage/52') == 0) {
        this.currentActiveName = 'courseManage-2';
        this.openName = ['courseManage'];
      } else if (path.indexOf('/courseManage/courseManage/53') == 0) {
        this.currentActiveName = 'courseManage-3';
        this.openName = ['courseManage'];
        // 讲师管理
      } else if (path.indexOf('/teacherManage') == 0) {
        this.currentActiveName = 'teacherManage';
        // 首页焦点图
      } else if (path.indexOf('/infoBannerManage') == 0) {
        this.currentActiveName = 'infoBannerManage';
        // 登录信息
      } else if (path.indexOf('/userInfo') == 0) {
        this.currentActiveName = 'userInfo';
        this.openName = ['systemManage'];
        // 用户管理
      } else if (path.indexOf('/userManage') == 0) {
        this.currentActiveName = 'userManage';
      } else if (path.indexOf('/orderManage') == 0) {
        this.currentActiveName = 'orderManage';
      } else {
        this.currentActiveName = 'home';
      }
    },
    methods: {
      handleMenuSelect(name){
        if (name === 'home') {
          this.$router.push('/');
        } else if (name === 'course') {
          this.$router.push('/company/course');
        } else if (name === 'leader') {
          this.$router.push('/company/leader');
        } else if (name === 'staff') {
          this.$router.push('/company/staff');
        } else if (name === 'exam') {
          this.$router.push('/company/exam');
        } else if (name === 'documents') {
          // new
          // 素材管理
          this.$router.push('/company/documents');
        } else if (name == 'courseManage-1') {
          // 课程管理
          this.$router.push('/courseManage/courseManage/51');
        } else if (name == 'courseManage-2') {
          this.$router.push('/courseManage/courseManage/52');
        } else if (name == 'courseManage-3') {
          this.$router.push('/courseManage/courseManage/53');
        } else if (name == 'teacherManage') {
          // 讲师管理
          this.$router.push('/teacherManage');
        } else if (name == 'infoBannerManage') {
          // 首页焦点图
          this.$router.push('/infoBannerManage');
        } else if (name == 'userInfo') {
          // 个人信息
          this.$router.push('/userInfo');
        } else if (name == 'userManage') {
          // 用户管理
          this.$router.push('/userManage');
        } else if (name == 'orderManage') {
          // 订单管理
          this.$router.push('/orderManage');
        } 
      }
    }
  }
</script>
<style scoped lang="less" scoped>
  // .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
  //   padding: 8px 24px;
  // }
  .ivu-menu-submenu .ivu-menu .ivu-menu-item {
    padding-left: 50px;
  }
</style>
