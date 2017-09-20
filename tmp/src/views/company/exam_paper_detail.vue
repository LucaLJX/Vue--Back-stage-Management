<template>
    <div class="lr-right-middle">
        <Card class="z-form-static" dis-hover>
            <p slot="title">考试信息</p>
            <div class="z-form-item">
                <label>考试名称:</label>
                <div>{{currentEditObj.name}}</div>
            </div>
            <div class="z-form-item">
                <label>考试状态:</label>
                <div>{{ dict.getVal('examStatus', currentEditObj.status) }}</div>
            </div>
            <div class="z-form-item">
                <label>开始时间:</label>
                <div>{{currentEditObj.startTime | formatDate}}</div>
            </div>
            <div class="z-form-item">
                <label>考试时长:</label>
                <div>{{currentEditObj.duration}}min</div>
            </div>
        </Card>
    </div>
        <!-- lr-right-middle
        <div class="lr-right-middle">
            <i-input class="common-default-size common-left-btn" size="small" :value.sync="searchData.name"
                 placeholder="考试名称(模糊查询)"></i-input>
            <i-button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh(true)" icon="ios-search">搜索</i-button>
        </div>-->

        <div class="common-top-action-container">
            <a>试卷详情</a>
        </div>

        <!-- lr-import-0 页面内table的区域 -->
        <div class="z-table-container">
            <Card class="z-form-static" dis-hover v-show="allQuestions[1]">
                <p slot="title">单选题</p>
                <Collapse>
                    <Panel v-for="q in allQuestions[1]">
                        第{{$index + 1}}题(序号{{q.id}})
                        <div slot="content">
                            <p>{{q.stem}}</p>
                            <div class="answer-container">
                                <p class="answer-tip">答案:</p>
                                <p v-for="choice in q.choices">{{choice.isRight?'对':'错'}} | {{choice.content}}</p>
                            </div>
                        </div>
                    </Panel>
                </Collapse>

            </Card>
            <Card class="z-form-static" dis-hover v-show="allQuestions[2]">
                <p slot="title">多选题</p>
                <Collapse>
                    <Panel v-for="q in allQuestions[2]">
                        第{{$index + 1}}题(序号{{q.id}})
                        <div slot="content">
                            <p>{{q.stem}}</p>
                            <div class="answer-container">
                                <p class="answer-tip">答案:</p>
                                <p v-for="choice in q.choices">{{choice.isRight?'对':'错'}} | {{choice.content}}</p>
                            </div>
                        </div>
                    </Panel>
                </Collapse>

            </Card>

            <Card class="z-form-static" dis-hover v-show="allQuestions[3]">
                <p slot="title">判断题</p>
                <Collapse>
                    <Panel v-for="q in allQuestions[3]">
                        第{{$index + 1}}题(序号{{q.id}})
                        <div slot="content">
                            <p>{{q.stem}}</p>
                            <div class="answer-container">
                                <p class="answer-tip">答案: {{q.judgmentAnswer ? '对':'错'}}</p>
                            </div>
                        </div>
                    </Panel>
                </Collapse>

            </Card>

            <Card class="z-form-static" dis-hover v-show="allQuestions[4]">
                <p slot="title">填空题</p>
                <Collapse>
                    <Panel v-for="q in allQuestions[4]">
                        第{{$index + 1}}题(序号{{q.id}})
                        <div slot="content">
                            <p>{{q.stem}}</p>
                            <div class="answer-container">
                                <p class="answer-tip">答案:</p>
                                <p class="answer-text-container">{{q.textAnswer}}</p>
                            </div>
                        </div>
                    </Panel>
                </Collapse>

            </Card>
            <Card class="z-form-static" dis-hover v-show="allQuestions[5]">
                <p slot="title">主观题</p>
                <Collapse>
                    <Panel v-for="q in allQuestions[5]">
                        第{{$index + 1}}题(序号{{q.id}})
                        <div slot="content">
                            <p>{{{q.stem}}}</p>
                            <div class="answer-container">
                                <p class="answer-tip">答案:</p>
                                <p >{{q.textAnswer}}</p>
                            </div>
                        </div>
                    </Panel>
                </Collapse>

            </Card>
        </div>

</template>
<style>
    .answer-tip {
        font-weight:bold;
    }
    .answer-container {
        margin: 6px 0 0 28px;
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

                currentEditObj: {},

                allQuestions: {},

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
                            _this.currentEditObj = (data);
                        }
                );
            },
            initPaper(){
                var _this = this;
                ezjsUtil.request(apiConstants.exam_paperDetail,
                        {
                            _id: _this.$route.params.id
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.allQuestions = (data);
                        }
                );
            },
        }
    }
</script>
