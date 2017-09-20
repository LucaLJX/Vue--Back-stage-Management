<style scoped lang="less">
</style>
<template>
    <div class="lr-right-middle">
        <div class="history-back-container">
            <i-button type="primary" size="small" v-show="obj.status == 1" v-link="'/company/exam/edit?id=' + $route.params.id">编辑</i-button>
            <i-button type="primary" size="small" @click="viewPaper()">查看试卷</i-button>
            <i-button type="primary" size="small" @click="releaseConfirm()" v-show="obj.paperCnt && obj.status == 3">发布考试</i-button>
            <i-button type="ghost" size="small" @click="releaseCancelConfirm()" v-show="obj.status == 4">取消发布</i-button>
        </div>
        <Card class="z-form-static" dis-hover>
            <p slot="title">基本信息</p>
            <div class="z-form-item">
                <label>考试名称:</label>
                <div>{{{obj.name}}}</div>
            </div>
            <div class="z-form-item">
                <label>考试状态:</label>
                <div>{{ dict.getVal('examStatus', obj.status) }}</div>
            </div>
            <div class="z-form-item">
                <label>试卷数量:</label>
                <div>{{ obj.paperCnt }}套</div>
            </div>
            <div class="z-form-item">
                <label>开始时间:</label>
                <div>{{{obj.startTime | formatDate}}}</div>
            </div>
            <div class="z-form-item">
                <label>考试时长:</label>
                <div>{{obj.duration}}min</div>
            </div>
            <div class="z-form-item">
                <label>参与班级:</label>
                <div>{{{ departmentsName }}}</div>
            </div>
            <div class="z-form-item">
                <label>考试内容:</label>
                <div>{{{ subjectsName }}}</div>
            </div>

        </Card>
        <i-form
                :label-width="80"
                class="z-form">
            <Card class="z-card" dis-hover>
                <p slot="title">考试分值</p>
                <Form-item :label="'题目类型'" :label-width="100">
                    <Row>
                        <i-col span="4" offset="1">
                            出题数量
                        </i-col>
                        <i-col span="4" offset="1">
                            题目分数
                        </i-col>
                        <i-col span="4" offset="1">
                            该题型总分
                        </i-col>
                    </Row>
                </Form-item>
                <Form-item
                        v-for="item in questionStrategy.options"
                        :label="item.label" :label-width="100"
                >
                    <Row>
                        <i-col span="4" offset="1">
                            {{item.cnt}}道
                        </i-col>
                        <i-col span="4" offset="1">
                            {{item.score}}分
                        </i-col>
                        <i-col span="4" offset="1">
                            {{item.cnt * item.score}}分
                        </i-col>
                    </Row>
                </Form-item>
                <Form-item :label="'合计'" :label-width="100" style="border-top: solid 1px #e3e8ee;">
                    <Row>
                        <i-col span="4" offset="1">
                            {{ 'cnt' | questionStrategyTotal }}道题
                        </i-col>
                        <i-col span="4" offset="6">
                            {{ 'score' | questionStrategyTotal }}分
                        </i-col>
                    </Row>
                </Form-item>
            </Card>
        </i-form>
    </div>

</template>

<script>
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
    var apiConstants = ezjsUtil.constants.api;
    var su = ezjsUtil.sessionUtil;
    var filterUtil = ezjsUtil.filterUtil;

    export default{
        props: {},
        data(){
            return {
                dict: dict,
                obj: {},
                departmentsName: '',
                subjectsName: '',
                questionStrategy: {
                    options: [ //label不能包含 ,和 |
                    ],

                }
            };
        },
        components: {},
        filters: {
            questionStrategyTotal(type){
                var total = this.getQuestionStrategyTotal();
                if (type == 'cnt') {
                    return total.cnt;
                } else if (type == 'score') {
                    return total.score;
                }
                return 0;
            },
            formatDate(time){
                var date = new Date(Number.parseInt(time));
                return filterUtil.formatDate(date);
            },
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
                ezjsUtil.request(apiConstants.exam_detail,
                        {
                            _id: _this.$route.params.id
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.obj = (data);

                            _this.treeDataRefresh(apiConstants.department_tree, data.departmentIds, function (name) {
                                _this.departmentsName = name;
                            });
                            _this.treeDataRefresh(apiConstants.course_allSubjectTree, data.subjectIds, function (name) {
                                _this.subjectsName = name;
                            });
                            _this.questionStrategyRefresh(data.strategy);
                        }
                );
            },
            treeDataRefresh(api, checkedIds, cb){
                var _this = this;
                ezjsUtil.request(api,
                        {
                            _companyId: this.$auth.user().company_id
                        },
                        function (err, treeData) {
                            var checkedArr = checkedIds.split(',');

                            var names = '';
                            function formatTreeData(arr, parentName) {
                                var current;
                                for (var i = 0; i < arr.length; i++) {
                                    var node = arr[i];
                                    if (parentName) {
                                        current = parentName + '/' + node.label;
                                    } else {
                                        current = node.label;
                                    }
                                    for (var cIndex in checkedArr) {
                                        var cId = checkedArr[cIndex];
                                        if (node.value == cId) {
                                            names += current + '<br>';
                                        }
                                    }
                                    if (node.nodes && node.nodes.length > 0) {
                                        formatTreeData(node.nodes, current)
                                    } else {
                                        continue;
                                    }
                                }
                            }

                            formatTreeData(treeData);
                            cb && cb(names);

                        }
                );
            },


            //出题策略
            getQuestionStrategyTotal(){
                var total = {
                    cnt: 0,
                    score: 0
                };
                var options = this.questionStrategy.options;
                for (var i = 0; i < options.length; i++) {
                    var op = options[i];
                    total.cnt += op.cnt;
                    total.score += op.cnt * op.score;
                }
                return total;
            },
            questionStrategyRefresh(strategy){
//                var obj = JSON.parse(strategy);
//                this.questionStrategy.options = obj;

                var arr = strategy.split('|');
                this.questionStrategy.options = [];
                for (var i = 0; i < arr.length; i++) {
                    var it = arr[i];
                    if (it && it.length > 0) {
                        var s = it.split(',');
                        this.questionStrategy.options.push({
                            index: Number.parseInt(s[0]),
                            label: s[1],
                            cnt: Number.parseInt(s[2]),
                            score: Number.parseInt(s[3]),
                        });
                    }

                }
//                console.log(arr);
            },

            // status = 3
            viewPaper(index){
                var _this = this;
                var go = '/company/exam/viewPaper/' + _this.obj.id;
                _this.$route.router.go(go)
            },

            // status = 4. release
            releaseConfirm(index){
                var _this = this;
                var content = '<p>发布后,本场考试将对参与考试的学生可见</p>';
                content += '<p>将无法继续生成试卷,无法删除试卷</p>';
                content += '<p>将无法修改考试信息</p>';
                content += '<p>将无法删除考试, 但可以取消发布</p>';
                content += '<p>确认现在发布么?</p>';
                _this.$Modal.confirm({
                    title: '发布确认?',
                    content: content,
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.exam_releaseById,
                                {
                                    _id: _this.obj.id
                                },
                                function(err, data) {
                                    _this.$Modal.remove();
                                    if(err){
                                        return;
                                    }
                                    _this.$Message.success('发布成功!');
                                    _this.getDetail()

                                }
                        )
                    }
                });
            },
            releaseCancelConfirm(){
                var _this = this;
                var content = '<p>取消发布后,本场考试将不开放给参与考试的学生</p>';
                content += '<p>确认取消么?</p>';
                _this.$Modal.confirm({
                    title: '取消发布确认?',
                    content: content,
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.exam_releaseCancelById,
                                {
                                    _id: _this.obj.id
                                },
                                function(err, data) {
                                    _this.$Modal.remove();
                                    if(err){
                                        return;
                                    }
                                    _this.$Message.success('取消发布成功!');
                                    _this.getDetail()

                                }
                        )
                    }
                });
            }
        }
    }
</script>
