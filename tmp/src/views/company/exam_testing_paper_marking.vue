<template>
    <div class="lr-right-middle">
        <Card class="z-form-static" dis-hover>
            <p slot="title">考试信息</p>
            <div class="z-form-item">
                <label>考试名称:</label>
                <div>{{currentExam.name}}</div>
            </div>
            <div class="z-form-item">
                <label>考试状态:</label>
                <div>{{ dict.getVal('examStatus', currentExam.status) }}</div>
            </div>
            <div class="z-form-item">
                <label>试卷数量:</label>
                <div>{{ currentExam.paperCnt }}套</div>
            </div>
            <div class="z-form-item">
                <label>试卷总分:</label>
                <div>{{ currentExam.totalScore }}分</div>
            </div>
            <div class="z-form-item">
                <label>开始时间:</label>
                <div>{{currentExam.startTime | formatDate}}</div>
            </div>
            <div class="z-form-item">
                <label>考试时长:</label>
                <div>{{currentExam.duration}}min</div>
            </div>
        </Card>
    </div>

    <div class="lr-right-middle">
        <Card class="z-form-static" dis-hover>
            <p slot="title">学生信息</p>
            <div class="z-form-item">
                <label>姓名:</label>
                <div>{{currentStaff.name}}</div>
            </div>
            <div class="z-form-item">
                <label>学号:</label>
                <div>{{currentStaff.num}}</div>
            </div>
        </Card>
    </div>

    <div class="lr-right-middle">
        <Card class="z-form-static" dis-hover>
            <p slot="title">试卷信息</p>
            <div class="z-form-item">
                <label>开考时间:</label>
                <div>{{currentPaperScore.startTime | formatDate}}</div>
            </div>
            <div class="z-form-item">
                <label>交卷时间:</label>
                <div>{{currentPaperScore.submitTime | formatDate}}</div>
            </div>
            <div class="z-form-item">
                <label>状态:</label>
                <div>{{dict.getVal('stuPaperStatus', currentPaperScore.status)}}</div>
            </div>
            <div class="z-form-item">
                <label>得分:</label>
                <div>{{currentPaperScore.totalScore}}</div>
            </div>
        </Card>
    </div>

        <div class="common-top-action-container">
            <a>学生试卷信息</a>
            <div class="common-top-right">
            </div>
        </div>

        <div class="z-table-container">
            <i-form
                    :label-width="80"
                    class="z-form">
                <Card class="z-card" dis-hover v-show="allQuestions[1].questions">
                    <p slot="title">单选题(每道题{{allQuestions[1].score}}分)</p>
                    <div class="question-container" :class="allQuestions[1].questions.length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[1].questions">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <div class="question-choices">
                            <p class="answer-tip">选项:</p>
                            <p v-for="choice in q.choices">{{optionAlias[$index]}}. {{choice.content}}</p>
                        </div>
                        <Card class="z-card" >
                            <p slot="title">判题结果</p>
                            <p>正确答案: {{q.choices | rightChoiceFilter}}</p>
                            <p>学生答案: {{q.ansByStu | staffChoiceFilter q.choices }}</p>
                            <p>得分: {{q.score}}</p>
                        </Card>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[2].questions">
                    <p slot="title">多选题(每道题{{allQuestions[2].score}}分)</p>
                    <div class="question-container" :class="allQuestions[2].questions.length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[2].questions">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <div class="question-choices">
                            <p class="answer-tip">选项:</p>
                            <Radio-group :model.sync="q.ansByStu" vertical>
                                <Radio :value="choice.id" v-for="choice in q.choices">
                                    <span>{{optionAlias[$index]}}.&nbsp;&nbsp;{{choice.content}}</span>
                                </Radio>
                            </Radio-group>
                        </div>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[3].questions">
                    <p slot="title">判断题(每道题{{allQuestions[3].score}}分)</p>
                    <div class="question-container" :class="allQuestions[3].questions.length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[3].questions">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <Card class="z-card" >
                            <p slot="title">判题结果</p>
                            <p>正确答案: {{q.judgmentAnswer ? '对':'错'}}</p>
                            <p>学生答案: {{q.ansByStu == '1' ? '对': ''}}{{q.ansByStu == '-1' ? '错': ''}}</p>
                            <p>得分: {{q.score}}</p>
                        </Card>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[4].questions">
                    <p slot="title">填空题(每道题{{allQuestions[4].score}}分)</p>
                    <div class="question-container" :class="allQuestions[4].questions.length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[4].questions">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <Card class="z-card" >
                            <p slot="title">判题结果</p>
                            <p>正确答案: {{q.textAnswer}}</p>
                            <p>学生答案: {{q.ansByStu}}</p>
                            <p>匹配度: {{q.percent}}</p>
                            <p>得分: {{q.score}}</p>
                        </Card>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[5].questions">
                    <p slot="title">主观题(每道题{{allQuestions[5].score}}分)</p>
                    <div class="question-container" :class="allQuestions[5].questions.length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[5].questions">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <Card class="z-card" >
                            <p slot="title">判题结果</p>
                            <p>正确答案: {{q.textAnswer}}</p>
                            <p>学生答案: {{q.ansByStu}}</p>
                            <p>匹配度: {{q.percent}}</p>
                            <p>得分: {{q.score}}</p>
                        </Card>
                    </div>

                </Card>
            </i-form>

        </div>

</template>
<style>
    .answer-tip {
        font-weight:bold;
    }
    .answer-container {
        margin: 6px 0 0 28px;
    }

    .question-container {
        padding: 10px 8px 10px 8px;
    }
    .question-hr {
        border-bottom: 1px solid #e3e8ee;
    }
    .question-container .question-choices {
        margin: 8px 0 0 16px;
    }
</style>
<script>
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
    var apiConstants = ezjsUtil.constants.api;
    var filterUtil = ezjsUtil.filterUtil;

    export default{
        props: {
        },
        data(){
            return{
                dict: dict,
                currentExam: {},
                currentPaperScore: {},
                currentStaff: {},

                optionAlias: ['A','B','C','D','E','F','G',],

                currentTestingExam: {},

                allQuestions: {
                    1: {},
                    2: {},
                    3: {},
                    4: {},
                    5: {},
                },

            }
        },
        components:{
        },
        filters: {
            formatDate(time){
                var date = new Date(Number.parseInt(time));
                return filterUtil.formatDate(date);
            },
            rightChoiceFilter(choices){
                var res = '', _this = this;
                for(var i in choices){
                    var choice = choices[i];
                    if(choice.isRight){
                        res += _this.optionAlias[i] + ','
                    }
                }
                return res
            },
            staffChoiceFilter(choiceId, choices){
                var res = '', _this = this;
                for(var i in choices){
                    var choice = choices[i];
                    if(choice.id == choiceId){
                        res += _this.optionAlias[i] + ','
                    }
                }
                return res
            }
        },
        route: {
            data: function(transition) {
                console.log('start to refresh table data.')
            }
        },
        created: function () {
            this.initExamInfo()
            this.initStaffPaperScoreInfo()
            this.initStaffInfo()
            this.initPaper()
        },
        methods: {
            initExamInfo() {
                var _this = this;
                ezjsUtil.request(apiConstants.exam_detail,
                        {
                            _id: _this.$route.params.examId
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.currentExam = (data);
                        }
                );
            },
            initStaffPaperScoreInfo() {
                var _this = this;
                ezjsUtil.request(apiConstants.exam_staffPaperScoreDetail,
                        {
                            _staffPaperInExamId: _this.$route.params.staffPaperInExamId
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.currentPaperScore = (data);
                        }
                );
            },
            initStaffInfo() {
                var _this = this;
                ezjsUtil.request(apiConstants.staff_detail,
                        {
                            _id: _this.$route.query.staffId
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.currentStaff = (data);
                        }
                );
            },


            initPaper(){
                var _this = this;
                ezjsUtil.request(apiConstants.exam_testing_autoMarkingPaperOfStaff,
                        {
                            staffPaperInExamId: _this.$route.params.staffPaperInExamId,
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            for(var key in _this.allQuestions){
                                if(data[key]){
                                    _this.allQuestions[key] = data[key]
                                }
                            }
                            _this.staffPaperInExamId = _this.$route.params.staffPaperInExamId;
                        }
                );
            },


        }
    }
</script>
