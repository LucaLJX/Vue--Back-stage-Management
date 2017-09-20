<style scoped lang="less">
</style>
<template>
  <div class="cr-right-middle">
    <div class="history-back-container">
      <i-button type="primary" size="small" @click="tableRowEdit">编辑
      </i-button>
      <i-button type="ghost" size="small" @click="historyGo()">
        <Icon type="android-arrow-back"></Icon>
        &nbsp;返回
      </i-button>
    </div>
    <Card class="z-form-static" dis-hover>
      <div class="z-form-item">
        <label>题目序号:</label>
        <div>{{obj.id}}</div>
      </div>
      <div class="z-form-item">
        <label>题目类型:</label>
        <div>{{dict.getVal('questionType', obj.questionType)}}</div>
      </div>
      <div class="z-form-item">
        <label>章节/知识点:</label>
        <div>{{ treeCode2LabelFilter(obj.subjectCode) }}</div>
      </div>
      <div class="z-form-item">
        <label>难易度:</label>
        <div>{{dict.getVal('difficulty', obj.difficulty)}}</div>
      </div>
      <div class="z-form-item">
        <label>题干信息:</label>
        <div v-html="obj.stem"></div>
      </div>

      <div class="z-form-item" v-show="obj.questionType == 4 || obj.questionType == 5">
        <label>答案:</label>
        <div>{{obj.textAnswer}}&nbsp;</div>
      </div>
      <div class="z-form-item" v-show="obj.questionType == 3">
        <label>答案:</label>
        <div>{{obj.judgmentAnswer ? '对' : '错'}}</div>
      </div>

    </Card>

    <div class="z-table-container" v-show="obj.choices && obj.choices.length != 0">
      <i-table class="z-table" border :content="tableData.self" :columns="tableData.columns"
               :data="obj.choices" stripe></i-table>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">

  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  var su = ezjsUtil.sessionUtil;

  export default{
    props: {},
    data(){
      return {
        dict: dict,
        obj: {},
        tableData: {
          self: this,
          columns: [
            {type: 'index', width: 40, align: 'center'},
            {title: '选项内容', key: 'content'},
            {
              title: '是否为正确答案', key: 'isRight',
              render(h, params){
                var row = params.row;
                return h('div', row.isRight ? "正确" : "错误")
              }
            },
          ],
          data: [],
        }
      };
    },
    components: {},

    created: function () {
      var _this = this;
      _this.getQuestionDetail();
    },
    methods: {
      treeCode2LabelFilter(code){
        var _this = this;
        return '' + _this.$parent.treeCode2Label(code);
      },
      getQuestionDetail(){
        var _this = this;
        ezjsUtil.request(apiConstants.question_detail,
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
      },
      historyGo(){
        return this.$router.go(-1);
      },
      tableRowEdit(){
        this.$router.push('/company/course/' + this.$parent.$data.selectedNode.id + '/questionEdit?id=' + this.$route.params.id);
      }
    }
  }
</script>
