<style scoped lang="less">
</style>
<template>
    <div class="cr-right-middle">
        <div class="history-back-container">
            <i-button type="ghost" size="small" onclick="history.back()">
                <Icon type="android-arrow-back"></Icon>
                &nbsp;返回
            </i-button>
        </div>
        <Card class="z-form-static" dis-hover>
            <p slot="title">题目基础信息(不可修改)</p>
            <div class="z-form-item" v-show="modelFormData.editObj.id">
                <label>题目序号:</label>
                <div>{{modelFormData.editObj.id}}</div>
            </div>
            <div class="z-form-item">
                <label>题目类型:</label>
                <div>{{dict.getVal('questionType', modelFormData.editObj.questionType)}}</div>
            </div>
            <div class="z-form-item">
                <label>章节/知识点:</label>
                <div>{{ treeCode2LabelFilter(modelFormData.editObj.subjectCode) }}</div>
            </div>
        </Card>
        <div class="">
            <i-form ref="modelFormDataValidate" :model="modelFormData.editObj" :rules="modelFormData.validate"
                    :label-width="80"
                    class="z-form">
                <Card class="z-card" dis-hover>
                    <p slot="title">题目内容编辑</p>
                    <Form-item label="难易度" prop="difficulty">
                        <i-select v-model="modelFormData.editObj.difficulty" placeholder="选择难易度"
                                  class="z-form-controller">
                            <i-option v-for="item in dict.difficulty" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}
                            </i-option>
                        </i-select>
                    </Form-item>
                    <Form-item label="题干信息" prop="stem">
                        <i-input v-model="modelFormData.editObj.stem" placeholder="题干信息"
                                 type="textarea" :autosize="{minRows: 5,maxRows: 50}"
                                 class="z-form-controller"></i-input>
                    </Form-item>
                    <Form-item label="答案" prop="textAnswer"
                               v-show="modelFormData.editObj.questionType == 4 || modelFormData.editObj.questionType == 5">
                        <i-input v-model="modelFormData.editObj.textAnswer" placeholder="请输入..."
                                 type="textarea" :autosize="{minRows: 5,maxRows: 50}"
                                 class="z-form-controller"></i-input>
                    </Form-item>
                    <Form-item label="答案" prop="judgmentAnswer" v-show="modelFormData.editObj.questionType == 3">
                        <i-switch v-model="modelFormData.editObj.judgmentAnswer">
                            <span slot="open">对</span>
                            <span slot="close">错</span>
                        </i-switch>
                    </Form-item>
                </Card>
                <Card class="z-card" dis-hover
                      v-show="modelFormData.editObj.questionType == 1 || modelFormData.editObj.questionType == 2">
                    <p slot="title">选项编辑</p>
                    <Form-item
                            v-for="(item, index) in modelFormData.editObj.choices"
                            :label="'选项' + (index + 1)"
                            :key="index"
                            :prop="'choices.' + index + '.content'"
                            :rules="{required: true, message: '项目' + (index + 1) +'不能为空', trigger: 'blur'}">
                        <Row>
                            <i-col span="14">
                                <i-input v-model="item.content" placeholder="请输入..."></i-input>
                            </i-col>
                            <i-col span="4" offset="1">
                                <i-switch v-model="item.isRight" >
                                    <span slot="open">对</span>
                                    <span slot="close">错</span>
                                </i-switch>
                            </i-col>
                            <i-col span="4">
                                <i-button type="ghost" @click="handleRemoveChoice(item)">删除</i-button>
                            </i-col>
                        </Row>
                    </Form-item>
                    <Form-item>
                        <Row>
                            <i-col span="12">
                                <i-button type="dashed" long @click="handleAddChoice" icon="plus-round">新增</i-button>
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

    var ezjsUtil = Vue.ezjsUtil;
    var dict = ezjsUtil.dictUtil;
    var apiConstants = ezjsUtil.constants.api;
    var su = ezjsUtil.sessionUtil;

    export default{
        props: {},
        data(){
            return {
                dict: dict,
                modelFormData: {
                    editObj: {
                        id: null,
                        difficulty: 0,
                        judgmentAnswer: false,
                        stem: '',
                        textAnswer: '',
                        questionType: 0,
                        subjectCode: '',
                        stemType: 1,// 暂时仅支持文字类型.
                        choices: []
                    },
                    validate: {
                        difficulty: [
                            {required: true, message: '难易度不能为空', trigger: 'blur', type: 'number'}
                        ],
                        stem: [
                            {required: true, message: '题干信息不能为空', trigger: 'blur'},
                        ],
                    },
                    loading: false,
                },
            };
        },
        http: {
            emulateJSON: false
        },
        components: {},
      watch: {
        '$route': 'init'
      },
        created: function () {
            this.init()
          console.log(this.$route.query)
        },
        methods: {
          treeCode2LabelFilter(code){
            var _this = this;
            return '' + _this.$parent.treeCode2Label(code);
          },
            init(){
                var _this = this;
                var id = _this.$route.query.id;
                if (id) {
                    _this.getQuestionDetail(id);
                } else {
                    //初始化待创建的问题
                    var parentTreeChoosenNode = _this.$parent.$data.selectedNode.code;
                    if (!parentTreeChoosenNode) {
                        return _this.$router.push('/company/course');
                    }
                    var subjectId = _this.$parent.$data.selectedNode.id;
                    var editObj = {
                        id: null,
                        difficulty: 0,
                        judgmentAnswer: false,
                        stem: '',
                        textAnswer: '',
                        questionType: _this.$route.query.questionType,
                        subjectCode: parentTreeChoosenNode,
                        stemType: 1,// 暂时仅支持文字类型.
                        subjectId: subjectId,
                        choices: []

                    }
                    _this.modelFormData.editObj = editObj;
                    if (_this.modelFormData.editObj.questionType == 1 || _this.modelFormData.editObj.questionType == 2) {
                        // TODO
                        // _this.modelFormData.validate
                    } else if (_this.modelFormData.editObj.questionType == 3) {
                        //判断, do nothing
                    } else if (_this.modelFormData.editObj.questionType == 4 || _this.modelFormData.editObj.questionType == 5) {
                        _this.modelFormData.validate.textAnswer = [
                            {required: true, message: '答案不能为空', trigger: 'blur'},
                        ]
                    }
                }
            },
            getQuestionDetail(id){
                var _this = this;
                ezjsUtil.request(apiConstants.question_detail,
                        {
                            _id: id
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            data.stem = data.stem.split("<br>").join('\n');
                            _this.modelFormData.editObj = (data);
                        }
                );
            },
            handleAddChoice () {
                this.modelFormData.editObj.choices.push({
                    content: '',
                    isRight: false
                });
            },
            handleRemoveChoice (item) {
              var index = this.modelFormData.editObj.choices.indexOf(item)
              this.modelFormData.editObj.choices.splice(index, 1)
            },

            modelFormCancel(name){
                //清空填写的内容
                this.$refs[name].resetFields();
            },
            modelFormSubmit(name){
                var _this = this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        // validate choices
                        var choices = _this.modelFormData.editObj.choices;
                        var rightCnt = 0;
                        for(var index in choices){
                            var choice = choices[index];
                            if(choice.isRight){
                                rightCnt++;
                            }
                        }

                        if(rightCnt == 0){
                            if (_this.modelFormData.editObj.questionType == 1 || _this.modelFormData.editObj.questionType == 2) {
                                return _this.$Message.error('请至少选择一个正确选项!');
                            } 
                        }

                        // loading && submit by ajax
                        _this.modelFormData.loading = true;

                        //TODO: 对以下方法进行封装, 提供ezjsUtil.requestByJSON方法
                        _this.$http.post(ezjsUtil.buildUrl(apiConstants.question_edit.url), _this.modelFormData.editObj,
                                {
                                    emulateJSON: false
                                })
                                .then(function (response) {
                                    var data = (response.data)
                                    //拿到editObj.id, 前往详情页面
                                    console.log(data.data)
                                    var stemId = data.data.id;
                                    if(stemId){
                                        _this.$router.push('/company/course/' + _this.$parent.$data.selectedNode.id + '/question/' + stemId);
                                    }
                                    // _this.modelFormData.loading = false;
                                })
                                .catch(function (response) {
                                    console.log(response)
                                    _this.modelFormData.loading = false;
                                    var msg = '网络异常或者服务器异常,请联系管理员.';
                                    if(response.body && response.body.message){
                                        msg = response.body.message;
                                    }
                                    _this.$Message.error(msg, 3)
                                })
                    } else {
                        _this.$Message.error('表单验证失败!');
                    }
                })
            },
        }
    }
</script>
