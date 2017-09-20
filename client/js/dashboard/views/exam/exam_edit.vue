<style lang="less">
  .z-vue-tree {
    line-height: 18px;
  }
</style>
<template>
  <div class="lr-right-middle">
    <div class="">
      <i-form ref="modelFormDataValidate" :model="modelFormData.editObj" :rules="modelFormData.validate"
              :label-width="80"
              class="z-form">
        <Card class="z-card" dis-hover>
          <p slot="title">基本信息</p>
          <Form-item label="考试名称" prop="name">
            <i-input v-model="modelFormData.editObj.name" placeholder="考试名称"
                     class="z-form-controller"></i-input>
          </Form-item>
          <Form-item label="开始时间" prop="startTimeDate">
            <Date-picker type="datetime"
                         format="yyyy-MM-dd HH:mm"
                         v-model="modelFormData.editObj.startTimeDate"
                         @on-change="handleChangeStartTime"
                         placeholder="选择考试开始时间" style="width: 200px"></Date-picker>
          </Form-item>
          <Form-item label="考试时长" prop="duration">
            <Input-number :max="360" :min="1" v-model="modelFormData.editObj.duration"></Input-number>
            分钟
          </Form-item>
        </Card>
        <Card class="z-card" dis-hover>
          <p slot="title">参与班级</p>
          <div class="z-vue-tree">
            <Tree ref="grantedClassTree" :data="grantedClasses.treeData" show-checkbox></Tree>
          </div>
        </Card>
        <Card class="z-card" dis-hover>
          <p slot="title">考试内容</p>
          <div class="z-vue-tree">
            <Tree ref="grantedCourseTree" :data="grantedCourse.treeData" show-checkbox></Tree>
          </div>
        </Card>
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
            v-for="(item, index) in questionStrategy.options"
            :label="item.label" :label-width="100"
            :key="index"
          >
            <Row>
              <i-col span="4" offset="1">
                <Input-number :max="100" :min="0" v-model="item.cnt"></Input-number>
              </i-col>
              <i-col span="4" offset="1">
                <Input-number :max="100" :min="1" v-model="item.score"></Input-number>
              </i-col>
              <i-col span="4" offset="1">
                {{item.cnt * item.score}}分
              </i-col>
            </Row>
          </Form-item>
          <Form-item :label="'合计'" :label-width="100" style="border-top: solid 1px #e3e8ee;">
            <Row>
              <i-col span="4" offset="1">
                {{ questionStrategyTotal('cnt') }}道题
              </i-col>
              <i-col span="4" offset="6">
                {{ questionStrategyTotal('score') }}分
              </i-col>
            </Row>
          </Form-item>
        </Card>
        <Form-item>
          <i-button type="primary"
                    @click="modelFormSubmit('modelFormDataValidate')"
                    :loading="modelFormData.loading">
            保存
          </i-button>
          <!--<i-button type="ghost" @click="modelFormCancel('modelFormDataValidate')" style="margin-left: 8px">取消</i-button>-->
          <i-button type="ghost" onclick="history.back()" style="margin-left: 8px">
            <Icon type="android-arrow-back"></Icon>
            &nbsp;返回
          </i-button>
        </Form-item>
      </i-form>
    </div>

  </div>

</template>

<script type="text/ecmascript-6">


  var ezjsUtil = Vue.ezjsUtil; var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  var su = ezjsUtil.sessionUtil;
  var filterUtil = ezjsUtil.filterUtil;

  export default{
    props: {},
    data(){
      return {
        dict: dict,
        modelFormData: {
          editObj: {
            id: null,
            name: '',
            startTimeDate: null,
            duration: 60,
          },
          validate: {
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ],
            startTimeDate: [
              {required: true, message: '考试开始时间不能为空', trigger: 'blur', type: 'date'}
            ],
            duration: [
              {required: true, message: '考试时长不能为空', trigger: 'blur', type: 'number'}
            ],
          },
          loading: false,
        },

        grantedClasses: {
          treeData: [],
        },

        grantedCourse: {
          treeData: [],
        },

        questionStrategy: {
          options: [ //label不能包含 ,和 |
            {index: 1, label: '单选题', cnt: 0, score: 2},
            {index: 2, label: '多选题', cnt: 0, score: 2},
            {index: 3, label: '判断题', cnt: 0, score: 2},
            {index: 4, label: '填空题', cnt: 0, score: 2},
            {index: 5, label: '主观题', cnt: 0, score: 2},
          ],

        }
      };
    },
    components: {},
    route: {
      data: function (transition) {
        // this.init()
      }
    },
    created: function () {
      this.init()
    },
    methods: {
      questionStrategyTotal(type){
        var total = this.getQuestionStrategyTotal();
        if (type == 'cnt') {
          return total.cnt;
        } else if (type == 'score') {
          return total.score;
        }
        return 0;
      },
      init(){
        var _this = this;
        var id = _this.$route.query.id;
        if (id) {
          _this.getDetail(id);
        } else {
          //初始化
          // _this.modelFormData.editObj = _this.modelFormData.initObj;
          _this.classTreeDataRefresh()
          _this.courseTreeDataRefresh()
        }
      },
      getDetail(id){
        var _this = this;
        ezjsUtil.request(apiConstants.exam_detail,
          {
            _id: id
          },
          function (err, data) {
            if (err) {
              return;
            }
            _this.modelFormData.editObj = {
              id: data.id,
              name: data.name,
              startTimeDate: new Date(data.startTime),
              duration: data.duration,
            };

            var startTime = new Date(Number.parseInt(data.startTime));
            _this.modelFormData.editObj.startTime = filterUtil.formatDate(startTime);

            _this.classTreeDataRefresh(data.departmentIds);
            _this.courseTreeDataRefresh(data.subjectIds);
            _this.questionStrategyRefresh(data.strategy);
          }
        );
      },

      handleChangeStartTime(date){
        var _this = this;
        console.log(date)
        _this.modelFormData.editObj.startTime = date;

      },
      modelFormCancel(name){
        //清空填写的内容
        this.$refs[name].resetFields();
      },
      modelFormSubmit(name){
        var _this = this;
        this.$refs[name].validate(function (valid) {
          if (valid) {

            var departmentIds = _this.getIdsOfCheckedLeafNodes('grantedClassTree');
            var subjectIds = _this.getIdsOfCheckedLeafNodes('grantedCourseTree');
            if (departmentIds.length == 0) {
              return _this.$Message.error('请至少选择一个班级!');
            }
            if (subjectIds.length == 0) {
              return _this.$Message.error('请至少选择一个知识点!');
            }
            var total = _this.getQuestionStrategyTotal();
            if (total.score == 0 || total.cnt == 0) {
              return _this.$Message.error('请至少出一道题并且总分大于0')
            }
            var strategy = _this.parseQuestionStrategy();

            _this.modelFormData.editObj.departmentIds = departmentIds;
            _this.modelFormData.editObj.subjectIds = subjectIds;
            _this.modelFormData.editObj.strategy = strategy;
            _this.modelFormData.editObj.totalScore = total.score;

            // loading && submit by ajax
            // _this.modelFormData.loading = true;
            ezjsUtil.request(apiConstants.exam_edit, _this.modelFormData.editObj,
              function (err, data) {
                if (err) {
                  return;
                }
                //清空填写的内容
                _this.$refs[name].resetFields();
                var id = data.id;
                if (id) {
                  _this.$router.push('/company/exam/detail/' + id);
                }
              }
            );

          } else {
            _this.$Message.error('表单验证失败!');
          }
        })
      },

      getIdsOfCheckedLeafNodes(ref){
        var ids = ',';
        var checkedNodes = this.$refs[ref].getCheckedNodes();
        for (var i = 0; i < checkedNodes.length; i++) {
          var node = checkedNodes[i];
          if (!node.children) {
            ids += node.id + ',';
          }
        }
        return ids;
      },

      // course tree
      courseTreeDataRefresh(checkedIds){
        var _this = this;
        ezjsUtil.request(apiConstants.course_allSubjectTree,
          {
          },
          function (err, treeData) {
            var checkedArr = [];
            if (checkedIds) {
              console.log('考试范围', checkedIds);
              checkedArr = checkedIds.split(',');
            }

            function formatTreeData(arr) {
              var newTree = []
              for (var i = 0; i < arr.length; i++) {
                var node = arr[i];
                var checked = false;
                for (var cIndex in checkedArr) {
                  var cId = checkedArr[cIndex];
                  if (node.value == cId) {
                    checked = true;
                  }
                }

                var nn = {
                  expand: true,
                  title: node.label,
                  // disabled: !checked,
                  id: node.value,
                  checked: checked
                };
                if(node.nodes && node.nodes.length > 0) {
                  nn.children = formatTreeData(node.nodes)
                }
                newTree.push(nn)
              }
              return newTree;
            }

            _this.grantedCourse.treeData = formatTreeData(treeData)

          }
        );
      },

      // classes tree
      classTreeDataRefresh(checkedIds){
        var _this = this;
        ezjsUtil.request(apiConstants.department_tree,
          {
          },
          function (err, treeData) {

            //获取该教师已经授权的班级信息
            ezjsUtil.request(apiConstants.leader_grantedClass,
              {
              },
              function (err, data) {
                var grantedArr = data.departmentIds;
                var granted = grantedArr.join(',');
                granted = ',' + granted + ',';
                console.log(granted);

                var checkedArr = [];
                if (checkedIds) {
                  console.log('已授权班级', checkedIds);
                  checkedArr = checkedIds.split(',');
                }

                function formatTreeData(arr) {
                  var newTree = []
                  for (var i = 0; i < arr.length; i++) {
                    var node = arr[i];
                    var enable = false;
                    if (granted.indexOf(',' + node.value + ',') != -1) {
                      enable = true;
                    }

                    var checked = false;
                    for (var cIndex in checkedArr) {
                      var cId = checkedArr[cIndex];
                      if (node.value == cId) {
                        checked = true;
                      }
                    }

                    var nn = {
                      expand: true,
                      title: node.label,
                      disabled: !enable,
                      id: node.value,
                      checked: checked
                    };
                    if(node.nodes && node.nodes.length > 0) {
                      nn.children = formatTreeData(node.nodes)
                    }
                    newTree.push(nn)
                  }
                  return newTree;
                }

                _this.grantedClasses.treeData = formatTreeData(treeData)
              }
            );

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
      parseQuestionStrategy(){
        var options = this.questionStrategy.options;
//                var strategy = JSON.stringify(options);
        var strategy = '';
        for (var i = 0; i < options.length; i++) {
          var op = options[i];
          strategy += op.index + ',' + op.label + ',' + op.cnt + ',' + op.score + '|';
        }
        return strategy;
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
      }
    }
  }
</script>
