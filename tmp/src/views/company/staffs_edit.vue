<style scoped lang="less">
</style>
<template>
    <div class="lr-right-middle">
        <div class="history-back-container">
            <i-button type="ghost" size="small" onclick="history.back()">
                <Icon type="android-arrow-back"></Icon>
                &nbsp;返回
            </i-button>
        </div>
        <Card class="z-form-static" dis-hover>
            <p slot="title">基础信息(不可修改)</p>
            <div class="z-form-item" v-show="modelFormData.editObj.id">
                <label>学号:</label>
                <div>{{modelFormData.editObj.num}}</div>
            </div>
            <div class="z-form-item">
                <label>班级:</label>
                <div>{{ modelFormData.editObj.departmentCode  | treeCode2LabelFilter}}</div>
            </div>
        </Card>
        <div class="">
            <i-form v-ref:model-form-data-validate :model="modelFormData.editObj" :rules="modelFormData.validate"
                    :label-width="80"
                    class="z-form">
                <Card class="z-card" dis-hover>
                    <p slot="title">题目内容编辑</p>
                    <Form-item label="学号" prop="num" v-show="!modelFormData.editObj.id">
                        <i-input :value.sync="modelFormData.editObj.num" placeholder="学号"
                                 class="z-form-controller"></i-input>
                    </Form-item>
                    <Form-item label="姓名" prop="name">
                        <i-input :value.sync="modelFormData.editObj.name" placeholder="姓名"
                                 class="z-form-controller"></i-input>
                    </Form-item>
                    <Form-item label="性别" prop="sex">
                        <i-select :model.sync="modelFormData.editObj.sex" placeholder="选择性别"
                                  class="z-form-controller">
                            <i-option v-for="item in dict.staffSex" :value="item.dictKey">{{ item.dictVal }}
                            </i-option>
                        </i-select>
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

<script>
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
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
                        name: '',
                        num: '',
                        sex: '',
                        departmentCode: '',
                    },
                    validate: {
                        num: [
                            {required: true, message: '学号不能为空', trigger: 'blur'}
                        ],
                        name: [
                            {required: true, message: '姓名不能为空', trigger: 'blur'}
                        ],
                        sex: [
                            {required: true, message: '性别不能为空', trigger: 'blur', type: 'number'},
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
        filters: {
            treeCode2LabelFilter(code){
                var _this = this;
                return '' + _this.$parent.treeCode2Label(code);
            }
        },
        route: {
            data: function (transition) {
                this.init()
            }
        },
        created: function () {
            this.init()
        },
        methods: {
            init(){
                var _this = this;
                var id = _this.$route.query.id;
                if (id) {
                    _this.getDetail(id);
                } else {
                    //初始化
                    var parentTreeChoosenNode = _this.$parent.treeData.currentNodeCode;
                    if (!parentTreeChoosenNode) {
                        return _this.$route.router.go('/company/staffs');
                    }
                    var editObj = {
                        id: null,
                        name: '',
                        num: '',
                        sex: '',
                        departmentCode: parentTreeChoosenNode,
                        companyId: _this.$auth.user().company_id,
                        departmentId: _this.$parent.treeData.currentValue,
                    }
                    _this.modelFormData.validate.num = [
                        {required: true, message: '学号不能为空', trigger: 'blur'}
                    ]
                    _this.modelFormData.editObj = editObj;

                }
            },
            getDetail(id){
                var _this = this;
                ezjsUtil.request(apiConstants.staff_detail,
                        {
                            _id: id
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.modelFormData.editObj = (data);
                        }
                );
            },
            modelFormCancel(name){
                //清空填写的内容
                this.$refs[name].resetFields();
            },
            modelFormSubmit(name){
                var _this = this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {

                        // loading && submit by ajax
                        _this.modelFormData.loading = true;
                        ezjsUtil.request(apiConstants.staff_edit, _this.modelFormData.editObj,
                            function(err, data) {
                                if(err){
                                    _this.modelFormData.loading = false;
                                    return;
                                }
                                //清空填写的内容
                                _this.$refs[name].resetFields();
                                var id = data.id;
                                if(id){
                                    _this.$route.router.go('/company/staffs/detail/' + id);
                                }
                                // _this.modelFormData.loading = false;
                            }
                        );

                    } else {
                        _this.$Message.error('表单验证失败!');
                    }
                })
            },
        }
    }
</script>
