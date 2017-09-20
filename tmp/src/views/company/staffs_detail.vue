<style scoped lang="less">
</style>
<template>
    <div class="lr-right-middle">
        <div class="history-back-container">
            <i-button type="primary" size="small" v-link="'/company/staffs/edit?id=' + $route.params.id">编辑</i-button>
            <i-button type="primary" size="small" @click="resetPassword()">重置密码</i-button>
            <i-button type="ghost" size="small" onclick="history.back()"><Icon type="android-arrow-back"></Icon>&nbsp;返回</i-button>
        </div>
        <Card  class="z-form-static" dis-hover>
            <div class="z-form-item">
                <label>姓名:</label>
                <div>{{{obj.name}}}</div>
            </div>
            <div class="z-form-item">
                <label>学号:</label>
                <div>{{{obj.num}}}</div>
            </div>
            <div class="z-form-item">
                <label>性别:</label>
                <div>{{dict.getVal('staffSex', obj.sex)}}</div>
            </div>
            <div class="z-form-item">
                <label>班级:</label>
                <div>{{ obj.departmentCode  | treeCode2LabelFilter}}</div>
            </div>

        </Card>
    </div>

</template>

<script>
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
    var apiConstants = ezjsUtil.constants.api;
    var su = ezjsUtil.sessionUtil;

    export default{
        props: {},
        data(){
            return {
                dict: dict,
                obj: {},
            };
        },
        components: {},
        filters: {
            treeCode2LabelFilter(code){
                var _this = this;
                return '' + _this.$parent.treeCode2Label(code);
            }
        },
        route: {
            data: function (transition) {
            }
        },
        created: function () {
            var _this = this;
            _this.getDetail();
        },
        methods: {
            getDetail(){
                var _this = this;
                ezjsUtil.request(apiConstants.staff_detail,
                        {
                            _id: _this.$route.params.id
                        },
                        function(err, data) {
                            if (err) {
                                return;
                            }
                            _this.obj = (data);
                        }
                );
            },
            resetPassword () {
                var _this = this;
                _this.$Modal.confirm({
                    title: '确认重置密码么',
                    content: '<p>该用户的密码将重置为123456, 确认?</p>',
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.staff_resetPassword,
                            {
                                _id: _this.$route.params.id
                            },
                            function(err, data) {
                                _this.$Modal.remove();
                                if(err){
                                    return;
                                }
                                _this.$Message.success('密码重置成功!');
                                _this.tableDataRefresh()

                            }
                        )
                    }
                });
            },
        }
    }
</script>
