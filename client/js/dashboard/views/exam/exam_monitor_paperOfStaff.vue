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

    <div class="common-top-action-container">
      <a>学生试卷信息</a>
      <div class="common-top-right">
      </div>
    </div>

    <div class="z-table-container">
      <i-form
        :label-width="80"
        class="z-form">
        <Card class="z-card" dis-hover v-show="allQuestions[1]">
          <p slot="title">单选题</p>
          <div class="question-container" :class="allQuestions[1].length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[1]" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <div class="question-choices">
              <p class="answer-tip">选项:</p>
              <p v-for="choice in q.choices" :key="choice.id">编号{{choice.id}}. {{choice.content}}</p>
            </div>
            <Card class="z-card">
              <p slot="title">判题结果</p>
              <p>学生给出的答案: {{q.ansByStu}}</p>
            </Card>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[2]">
          <p slot="title">多选题</p>
          <div class="question-container" :class="allQuestions[2].length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[2]" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <div class="question-choices">
              <p class="answer-tip">选项:</p>
              <Radio-group v-model="q.ansByStu" vertical>
                <Radio label="choice.id" v-for="(choice, i) in q.choices" :key="i">
                  <span>{{optionAlias[i]}}.&nbsp;&nbsp;{{choice.content}}</span>
                </Radio>
              </Radio-group>
            </div>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[3]">
          <p slot="title">判断题</p>
          <div class="question-container" :class="allQuestions[3].length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[3]" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <Card class="z-card">
              <p slot="title">判题结果</p>
              <p>学生给出的答案: {{q.ansByStu == '1' ? '对' : '错'}}</p>
            </Card>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[4]">
          <p slot="title">填空题</p>
          <div class="question-container" :class="allQuestions[4].length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[4]" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <Card class="z-card">
              <p slot="title">判题结果</p>
              <p>学生给出的答案: {{q.ansByStu}}</p>
            </Card>
          </div>

        </Card>

        <Card class="z-card" dis-hover v-show="allQuestions[5]">
          <p slot="title">主观题</p>
          <div class="question-container" :class="allQuestions[5].length != index+1 ? 'question-hr': ''"
               v-for="(q, index) in allQuestions[5]" :key="index">
            <h5>第{{index + 1}}题(序号{{q.id}})</h5>
            <p class="question-item">
              <div v-html="q.stem"></div>
            </p>
            <Card class="z-card">
              <p slot="title">判题结果</p>
              <p>学生给出的答案: {{q.ansByStu}}</p>
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
        currentStaff: {},

        optionAlias: ['A', 'B', 'C', 'D', 'E', 'F', 'G',],

        currentTestingExam: {},

        allQuestions: {},

      }
    },
    components: {},
    created: function () {
      this.initExamInfo()
      this.initStaffInfo()
      this.initPaper()
    },
    methods: {
      formatDate(time){
        var date = new Date(Number.parseInt(time));
        return filterUtil.formatDate(date);
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
        ezjsUtil.request(apiConstants.exam_testing_viewPaperOfStaffInMonitor,
          {
            staffPaperInExamId: _this.$route.params.staffPaperInExamId,
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


    }
  }
</script>
