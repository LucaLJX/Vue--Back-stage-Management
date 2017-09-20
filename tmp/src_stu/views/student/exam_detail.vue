<style scoped lang="less">
</style>
<template>
    <div class="lr-right-middle">
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
                <label>试卷分数:</label>
                <div>{{ obj.totalScore }}</div>
            </div>
            <div class="z-form-item">
                <label>开始时间:</label>
                <div>{{{obj.startTime | formatDate}}}</div>
            </div>
            <div class="z-form-item">
                <label>考试时长:</label>
                <div>{{obj.duration}}min</div>
            </div>
        </Card>
    </div>

    <div class="lr-right-middle" v-show="showScore">
        <Card class="z-form-static" dis-hover>
            <p slot="title">考试成绩</p>
            <div class="z-form-item">
                <label>开考时间:</label>
                <div>{{currentPaperScore.startTime | formatDate}}</div>
            </div>
            <div class="z-form-item">
                <label>交卷时间:</label>
                <div>{{currentPaperScore.submitTime | formatDate}}</div>
            </div>
            <div class="z-form-item">
                <label>得分:</label>
                <div>{{currentPaperScore.totalScore}}分</div>
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
    var filterUtil = ezjsUtil.filterUtil;

    export default{
        props: {},
        data(){
            return {
                dict: dict,

                currentPaperScore: {},
                showScore: false,

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
            formatDate(time){
                if(!time) {
                    return '无';
                }
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

                        }
                );

                if(_this.$route.query.showScore == '1') {
                    ezjsUtil.request(apiConstants.exam_staffPaperScoreDetail,
                            {
                                examId: _this.$route.params.id,
                                staffId: _this.$auth.user().staff_id
                            },
                            function (err, data) {
                                if (err) {
                                    return;
                                }
                                _this.currentPaperScore = (data);
                                _this.showScore = true;

                            }
                    );
                }


            },
        }
    }
</script>
