<template>
        <!-- lr-import-0 页面内table的区域 -->
        <div class="z-table-container">
            <i-form
                    :label-width="80"
                    class="z-form">
                <Form-item>
                    <i-button type="primary"
                              @click="cacheAnswer()"
                              :loading="testingFormData.cacheLoading">
                        缓存答案
                    </i-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i-button type="primary"
                              @click="submitAnswer()"
                              :loading="testingFormData.submitLoading">
                        提交试卷
                    </i-button>
                </Form-item>

                <Card class="z-card" dis-hover v-show="allQuestions[1]">
                    <p slot="title">单选题</p>
                    <div class="question-container" :class="allQuestions[1].length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[1]">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <div class="question-choices">
                            <p class="answer-tip">选项:</p>
                            <Radio-group :model.sync="q.ansByStu" vertical>
                                <Radio :value="choice.id" v-for="choice in q.choices">
                                    <span>{{optionAlias[$index]}}.&nbsp;{{choice.content}}</span>
                                </Radio>
                            </Radio-group>
                        </div>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[2]">
                    <p slot="title">多选题</p>
                    <div class="question-container" :class="allQuestions[2].length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[2]">
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

                <Card class="z-card" dis-hover v-show="allQuestions[3]">
                    <p slot="title">判断题</p>
                    <div class="question-container" :class="allQuestions[3].length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[3]">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <div class="question-choices">
                            <Radio-group :model.sync="q.ansByStu" vertical>
                                <Radio :value="1">
                                    <span>对</span>
                                </Radio>
                                <Radio :value="-1">
                                    <span>错</span>
                                </Radio>
                            </Radio-group>
                        </div>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[4]">
                    <p slot="title">填空题</p>
                    <div class="question-container" :class="allQuestions[4].length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[4]">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <div class="question-choices">
                            <p class="answer-tip">答案: </p>
                            <i-input :value.sync="q.ansByStu" placeholder="请输入..." class="z-form-controller"></i-input>
                        </div>
                    </div>

                </Card>

                <Card class="z-card" dis-hover v-show="allQuestions[5]">
                    <p slot="title">主观题</p>
                    <div class="question-container" :class="allQuestions[5].length != $index+1 ? 'question-hr': ''" v-for="q in allQuestions[5]">
                        <h5>第{{$index + 1}}题(序号{{q.id}})</h5>
                        <p class="question-item">
                            {{{q.stem}}}
                        </p>
                        <div class="question-choices">
                            <p class="answer-tip">答案: </p>
                            <i-input :value.sync="q.ansByStu" placeholder="请输入..."
                                 type="textarea" :autosize="{minRows: 5,maxRows: 50}"
                                 class="z-form-controller"></i-input>
                        </div>
                    </div>

                </Card>
                <Form-item>
                    <i-button type="primary"
                              @click="cacheAnswer()"
                              :loading="testingFormData.cacheLoading">
                        缓存答案
                    </i-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i-button type="primary"
                              @click="submitAnswer()"
                              :loading="testingFormData.submitLoading">
                        提交试卷
                    </i-button>
                </Form-item>
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

                optionAlias: ['A','B','C','D','E','F','G',],

                currentTestingExam: {},

                allQuestions: {},

                testingFormData: {
                    cacheLoading: false,
                    submitLoading: false
                }

            }
        },
        components:{
        },
        filters: {
            formatDate(time){
                var date = new Date(Number.parseInt(time));
                return filterUtil.formatDate(date);
            },
        },
        route: {
            data: function(transition) {
                console.log('start to refresh table data.')
            }
        },
        created: function () {
            this.$parent.pageData.title = '考试中'
            this.init()
            this.initPaper()
        },
        methods: {
            init() {
                var _this = this;
                ezjsUtil.request(apiConstants.exam_detail,
                        {
                            _id: _this.$route.params.examId
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.currentTestingExam = (data);
                        }
                );
            },
            initPaper(){
                var _this = this;
                ezjsUtil.request(apiConstants.exam_getPaper4Testing,
                        {
                            examId: _this.$route.params.examId,
                            staffId: _this.$auth.user().staff_id
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.allQuestions = (data.questions);
                            _this.staffPaperInExamId = data.staffPaperInExamId;
                        }
                );
            },

            getAnsmap(){
                var _this = this;
                var map = {};
                for(var type in _this.allQuestions){
                    var list = _this.allQuestions[type];
                    for (var i = 0; i < list.length; i++) {
                        var question = list[i];
                        if(question.ansByStu){
                            map[question.id] = question.ansByStu;
                        }
                    }
                }
                return map;
            },
            update2Server(api, cb){
                var _this = this;
                var map = _this.getAnsmap();
                _this.$http.post(ezjsUtil.buildUrl(api.url),
                                {
                                    staffPaperInExamId: _this.staffPaperInExamId,
                                    staffId: _this.$auth.user().staff_id,
                                    ans: map
                                },
                                {
                                    emulateJSON: false
                                })
                                .then(function (response) {
                                    var data = (response.data)
                                    cb && cb(data)
                                })
                                .catch(function (response) {
                                    console.log(response)
                                    var msg = '网络异常或者服务器异常,请联系管理员.';
                                    if(response.body && response.body.message){
                                        msg = response.body.message;
                                    }
                                    _this.$Message.error(msg, 3)
                                })
            },
            cacheAnswer(){
                var _this = this;
                this.update2Server(apiConstants.exam_cacheAnswer4Testing, function(data){
                    _this.$Message.info('缓存成功', 2)
                })
            },
            submitAnswer(){
                var _this = this;
                this.update2Server(apiConstants.exam_submitAnswer4Testing, function(data){
                    _this.$Message.info('提交成功,请关闭系统后离开考场', 2);
                    _this.$route.router.go('/staff/exam');
                })
            },
        }
    }
</script>
