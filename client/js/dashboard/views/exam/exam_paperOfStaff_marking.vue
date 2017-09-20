<template>
  <div>
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
        <div class="z-form-item" v-show="currentExam.startTime">
          <label>开始时间:</label>
          <div>{{ formatDate(currentExam.startTime) }}</div>
        </div>
        <div class="z-form-item">
          <label>考试时长:</label>
          <div>{{currentExam.duration}}秒</div>
        </div>
      </Card>
    </div>

    <div class="lr-right-middle">
      <Card class="z-form-static" dis-hover>
        <p slot="title">考生信息</p>
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
          <div>{{ formatDate(currentPaperScore.startTime) }}</div>
        </div>
        <div class="z-form-item">
          <label>交卷时间:</label>
          <div>{{ formatDate(currentPaperScore.submitTime, '未手动交卷') }}</div>
        </div>
        <div class="z-form-item">
          <label>状态:</label>
          <div>{{dict.getVal('stuPaperStatus', currentPaperScore.status)}}</div>
        </div>
        <div class="z-form-item">
          <label>得分:</label>
          <div v-show="currentPaperScore.totalScore || currentPaperScore.totalScore == 0">{{currentPaperScore.totalScore}}</div>
          <div v-show="!currentPaperScore.totalScore && currentPaperScore.totalScore != 0">
            未阅卷
            <Button type="primary" size="small" @click="autoMarkingPaper">自动阅卷</Button>
          </div>
        </div>
      </Card>
    </div>

    <div class="common-top-action-container" v-show="currentPaperScore.totalScore || currentPaperScore.totalScore == 0">
      <a>考生试卷信息</a>
      <div class="common-top-right">
      </div>
    </div>

    <div class="z-table-container">
      <i-form
        :label-width="80"
        class="z-form">
        <Card class="z-card" dis-hover v-show="allQuestions[1].questions">
          <p slot="title">单选题(每道题{{allQuestions[1].score}}分)</p>
          <div class="question-container" :class="allQuestions[1].questions.length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[1].questions" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <div class="question-choices">
              <p class="answer-tip">选项:</p>
              <p v-for="(choice,i) in q.choices" :key="i">{{optionAlias[i]}}. {{choice.content}}</p>
            </div>
            <Card class="z-card">
              <p slot="title">判题结果</p>
              <p>正确答案: {{ rightChoiceFilter(q.choices) }}</p>
              <p>学生答案: {{ staffChoiceFilter(q.ansByStu, q.choices) }}</p>
              <p>得分: {{q.score}}</p>
            </Card>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[2].questions">
          <p slot="title">多选题(每道题{{allQuestions[2].score}}分)</p>
          <div class="question-container" :class="allQuestions[2].questions.length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[2].questions" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <div class="question-choices">
              <p class="answer-tip">选项: TODO:多选题{{q.ansByStu}}</p>
              <Radio-group v-model="q.ansByStu" vertical>
                <Radio label="choice.id" v-for="(choice, i) in q.choices" :key="i">
                  <span>{{optionAlias[i]}}.&nbsp;&nbsp;{{choice.content}}</span>
                </Radio>
              </Radio-group>
            </div>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[3].questions">
          <p slot="title">判断题(每道题{{allQuestions[3].score}}分)</p>
          <div class="question-container" :class="allQuestions[3].questions.length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[3].questions" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <Card class="z-card">
              <p slot="title">判题结果</p>
              <p>正确答案: {{q.judgmentAnswer ? '对':'错'}}</p>
              <p>学生答案: {{q.ansByStu == '1' ? '对': ''}}{{q.ansByStu == '-1' ? '错': ''}}</p>
              <p>得分: {{q.score}}</p>
            </Card>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[4].questions">
          <p slot="title">填空题(每道题{{allQuestions[4].score}}分)</p>
          <div class="question-container" :class="allQuestions[4].questions.length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[4].questions" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <Card class="z-card">
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
          <div class="question-container" :class="allQuestions[5].questions.length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[5].questions" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <Card class="z-card">
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
  </div>

</template>
<style>
  .answer-tip {
    font-weight: bold;
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
<script type="text/ecmascript-6">


  var ezjsUtil = Vue.ezjsUtil; var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  var filterUtil = ezjsUtil.filterUtil;

  export default{
    props: {},
    data(){
      return {
        dict: dict,
        currentExam: {},
        currentPaperScore: {},
        currentStaff: {},

        optionAlias: ['A', 'B', 'C', 'D', 'E', 'F', 'G',],

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
    components: {},
    filters: {

    },
    created: function () {
      this.initExamInfo()
      this.initStaffPaperScoreInfo()
      this.initStaffInfo()
    },
    methods: {
      formatDate(time, msg){
        if(!time) {
          return msg ? msg : "无";
        }
        var date = new Date(Number.parseInt(time));
        return filterUtil.formatDate(date);
      },
      rightChoiceFilter(choices){
        var res = '', _this = this;
        for (var i in choices) {
          var choice = choices[i];
          if (choice.isRight) {
            res += _this.optionAlias[i] + ','
          }
        }
        return res
      },
      staffChoiceFilter(choiceId, choices){
        var res = '', _this = this;
        for (var i in choices) {
          var choice = choices[i];
          if (choice.id == choiceId) {
            res += _this.optionAlias[i] + ','
          }
        }
        return res
      },
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
            if(_this.currentPaperScore.totalScore || _this.currentPaperScore.totalScore == 0){
              _this.initPaperInfo()
            }
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


      initPaperInfo(){
        var _this = this;
        ezjsUtil.request(apiConstants.exam_testing_viewPaperMarkingResult,
          {
            staffPaperInExamId: _this.$route.params.staffPaperInExamId,
          },
          function (err, data) {
            if (err) {
              return;
            }
            for (var key in _this.allQuestions) {
              if (data.questions[key]) {
                _this.allQuestions[key] = data.questions[key]
              }
            }
            _this.staffPaperInExamId = _this.$route.params.staffPaperInExamId;
          }
        );

      },
      autoMarkingPaper(){
        var _this = this;
        ezjsUtil.request(apiConstants.exam_testing_autoMarkingPaperOfStaff,
          {
            staffPaperInExamId: _this.$route.params.staffPaperInExamId,
          },
          function (err, data) {
            if (err) {
              return;
            }
//            for (var key in _this.allQuestions) {
//              if (data[key]) {
//                _this.allQuestions[key] = data[key]
//              }
//            }
            _this.staffPaperInExamId = _this.$route.params.staffPaperInExamId;
            _this.initStaffPaperScoreInfo()
            _this.initPaperInfo()
          }
        );
      }


    }
  }
</script>
