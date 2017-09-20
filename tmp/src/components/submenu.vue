<style scoped lang="less">
.clean {
    clear: both;
}

* {

    #head-portrait {
        width: 180px;
        text-align: center;
        padding: 10px 0;

        #head-portrait-pic {
            margin: 8px auto;
            width: 60px;
            height:60px;
            /*border-radius: 30px;*/

            img {
                width: 100%;
                border-radius: 50%;
            }
        }

        p {
            font-size: 14px;
            color: #fff;
        }

    }
}

.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
    padding: 8px 24px;
}

</style>

<template>
    <div id="head-portrait">
        <div class="clean"></div>
        <div id="head-portrait-pic">
            <img :src="$auth.user().company_logo">
        </div>
        <p>{{$auth.user().name}}</p>
        <p>{{$auth.user().company_name}}</p>
    </div>
    <Menu :theme="theme_submenu" width="180px" accordion>
        <Menu-item key="1"
            v-link="{path: '/admin/index', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('admin')"><Icon type="ios-home-outline"></Icon>首页</Menu-item>
        <Menu-item key="2"
            v-link="{path: '/admin/companies', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('admin')"><Icon type="social-buffer-outline"></Icon>学校管理</Menu-item>
        <Menu-item key="3"
            v-link="{path: '/company/index', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('leader')"><Icon type="ios-home-outline"></Icon>首页</Menu-item>
        <Menu-item key="4"
            v-link="{path: '/company/leaders', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('leader')"><Icon type="ios-people-outline"></Icon>教师管理</Menu-item>
        <Menu-item key="5"
            v-link="{path: '/company/course', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('leader')"><Icon type="ios-people-outline"></Icon>课程管理</Menu-item>
        <Menu-item key="6"
            v-link="{path: '/company/staffs', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('leader')"><Icon type="ios-people-outline"></Icon>班级与学生管理</Menu-item>
        <Menu-item key="7"
            v-link="{path: '/company/exam', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('leader')"><Icon type="ios-people-outline"></Icon>考试管理</Menu-item>
        <!-- <Menu-item key="8"
            v-link="{path: '/company/settings', activeClass: 'ivu-menu-item-active ivu-menu-item-selected'}"
            v-show="$auth.check('leader')"><Icon type="ios-people-outline"></Icon>系统管理</Menu-item> -->

    </Menu>
</template>

<script>
import su from 'libs/sessionUtil'


    export default {
        ready() {
        },
        data () {
            return {
                theme_submenu: 'dark'
            }
        }
    }
</script>
