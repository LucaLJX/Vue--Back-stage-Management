<style scoped lang="less">
</style>

<template>
    <!-- common-top -->
    <div class="common-top-container">
        <div class="common-top-ver-line"></div>
        <a class="common-top-title-left" v-link="pageData.link">{{ pageData.title }}</a>
        <div class="common-top-right">

        </div>
    </div>

    <div class="common-right-container">
        <!-- lr-left -->
        <div class="lr-left-container">
            <div class="lr-left-title">{{treeData.title}}</div>
            <div>
                <treeview :value.sync="treeData.currentValue"
                          :model.sync="treeData.data"
                          class="form-control treeview-custom"
                ></treeview>
            </div>
        </div>

        <!-- lr-right-container -->
        <div class="lr-right-container">

            <div class="lr-right-top">
                <div class="lr-right-top-left">
                    <Icon class="common-top-icon" type="arrow-right-b" size="20"></Icon>
                    <div class="common-top-title-left">{{ treeData.currentNodeByEachName }}</div>
                </div>
                <div class="lr-right-top-right">
                    <i-button class="common-right-btn" type="primary" size="small" v-link="'/company/course/import/' + treeData.currentValue">批量导入试题
                    </i-button>

                    <i-button class="common-right-btn" type="primary" size="small" :disabled="treeData.createSectionState === 0" @click="modelFormShow(1)">
                        {{treeData.createSectionState == 2 ? '编辑章节': '新增章节'}}
                    </i-button>
                    <i-button class="common-right-btn" type="primary" size="small" :disabled="treeData.createKnowledgeState === 0" @click="modelFormShow(2)">
                        {{treeData.createKnowledgeState == 2 ? '编辑知识点': '新增知识点'}}
                    </i-button>
                    <i-button class="common-right-btn" type="error" size="small"
                        v-show="treeData.createKnowledgeState == 2 || treeData.createSectionState == 2"
                        @click="treeNodeRemove()">
                        {{treeData.createSectionState == 2 ? '删除章节': ''}}
                        {{treeData.createKnowledgeState == 2 ? '删除知识点': ''}}
                    </i-button>
                    <Dropdown placement="bottom-end" v-show="treeData.allowCreateQuestion">
                        <i-button class="common-right-btn" type="primary" size="small">
                            新增试题
                            <Icon type="arrow-down-b"></Icon>
                        </i-button>
                        <Dropdown-menu slot="list">
                            <Dropdown-item v-link="'/company/course/question/edit?questionType=1'">单选题</Dropdown-item>
                            <Dropdown-item v-link="'/company/course/question/edit?questionType=2'">多选题</Dropdown-item>
                            <Dropdown-item v-link="'/company/course/question/edit?questionType=3'">判断题</Dropdown-item>
                            <Dropdown-item v-link="'/company/course/question/edit?questionType=4'">填空题</Dropdown-item>
                            <Dropdown-item v-link="'/company/course/question/edit?questionType=5'">主观题</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </div>
            </div>

            <router-view></router-view>

        </div>
    </div>

    <Modal
            :title="modelFormData.title"
            :visible.sync="modelFormData.visible"
            :mask-closable="false"
            :closable="false"
    >
        <i-form v-ref:model-form-data-validate :model="modelFormData.editObj" :rules="modelFormData.validate"
                :label-width="80"
                class="z-form">
            <Form-item label="名称" prop="name">
                <i-input :value.sync="modelFormData.editObj.name" placeholder="请输入名称"
                         class="z-form-controller"></i-input>
            </Form-item>
        </i-form>
        <div slot="footer">
            <i-button type="text" @click="modelFormCancel('modelFormDataValidate')">取消</i-button>
            <i-button type="primary" @click="modelFormSubmit('modelFormDataValidate')"
                      :loading="modelFormData.loading">
                提交
            </i-button>
        </div>
    </Modal>
</template>

<script type="text/javascript">
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
    var apiConstants = ezjsUtil.constants.api;
    //    import treeView from 'components/treeview'
    //    import Vue from 'vue'
    //    Vue.component('treeview', treeView)

    export default {
//        components: {treeView},
        ready() {

        },
        data () {
            return {
                dict: dict,

                pageData: {
                    title: '课程管理',
                    link: '/company/course'
                },

                treeData: {
                    title: '课程',
                    currentNodeByEachName: '',
                    currentNodeName: '',
                    currentNodeCode: '',
                    currentNodeHasChildren: 0,
                    allowCreateQuestion: false, // 只有叶子节点才能创建题目
                    createSectionState: 1, //0: disable, 1: create, 2: edit
                    createKnowledgeState: 0, //
                    currentValue: 0,
                    currentRoot: {
                        id: 0,
                        label: ''
                    },
                    data: [],
                },

                modelFormData: {
                    title: '新增章节',
                    initObj: {
                        id: null,
                        name: '',
                    },
                    editObj: {
                        id: null,
                        name: '',
                    },
                    editIndex: null,//正在编辑的table索引
                    validate: {
                        name: [
                            {required: true, message: '名称不能为空', trigger: 'blur'}
                        ],
                    },
                    loading: false,
                    visible: false,
                },

            }
        },
        route: {
            data: function(transition) {
                var _this = this;
                if(transition.to.path === '/company/course'){
                    _this.treeDataRefresh()
                }
            }
        },
        created: function () {
            var _this = this;

            _this.treeDataRefresh()

            _this.$on('treeview_click', function (selected) {
                var model = selected.model;
                _this.treeData.currentNodeByEachName = model.fullLabel;
                _this.treeData.currentNodeName = model.label;
                _this.treeData.currentNodeCode = model.code;
                _this.treeData.currentNodeHasChildren = model.nodes.length;
                _this.watchCreate();
                // _this.clearSearchData();
                _this.tableDataRefresh();
            })
        },

        methods: {
            treeDataRefresh(){
                var _this = this;
                ezjsUtil.request(apiConstants.course_allSubjectTree,
                    {
                        _companyId: this.$auth.user().company_id
                    },
                    function(err, data){
                        if(data.length == 1){
                            data[0].isOpened = true;
                            data[0].disableToggleOpen = true;
                        }
                        _this.treeData.data = data;
                        // 默认选中第一个根节点.
                        _this.treeData.currentValue = _this.treeData.data[0] && _this.treeData.data[0].value;
                        _this.treeData.currentNodeByEachName = _this.treeData.data[0] && _this.treeData.data[0].label;
                        _this.treeData.currentNodeName = _this.treeData.data[0] && _this.treeData.data[0].label;
                        _this.treeData.currentNodeCode = _this.treeData.data[0] && _this.treeData.data[0].code;

                        // 根节点信息
                        _this.treeData.currentRoot = {
                            id: _this.treeData.currentValue,
                            label: _this.treeData.currentNodeByEachName
                        }
                        if(_this.$route.path == '/company/course'
                            || _this.$route.path.indexOf('/company/course/list') == 0){
                            _this.tableDataRefresh();
                        }
                    }
                );
            },
            tableDataRefresh(){
                var _this = this;
                _this.$route.router.go('/company/course/list/' + _this.treeData.currentValue);
            },
            treeCode2Label(code){
                if(!code) {
                    return '';
                }
                var _this = this;
                var arr = _this.treeData.data;

                function codeInNodes(code, nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        if(code.indexOf(node.code) != -1){
                            var children = node.nodes;
                            if(children.length == 0){
                                return node.fullLabel;
                            }else{
                                return codeInNodes(code, children)
                            }
                        }
                    }
                }
                var fullLabel = codeInNodes(code, arr);
                return '' + fullLabel
            },
            //判断是否可以创建题目或者课程节点
            watchCreate(){
                var _this = this;
                var nodeCode = _this.treeData.currentNodeCode;
                var depth = nodeCode.split('#').length - 1;
                if(depth == 3){
                    _this.treeData.allowCreateQuestion = true;
                }else{
                    _this.treeData.allowCreateQuestion = false;
                }

                if(depth == 1){
                    _this.treeData.createSectionState = 1;
                    _this.treeData.createKnowledgeState = 0;
                }else if(depth == 2){
                    _this.treeData.createSectionState = 2;
                    _this.treeData.createKnowledgeState = 1;
                }else if(depth == 3){
                    _this.treeData.createSectionState = 0;
                    _this.treeData.createKnowledgeState = 2;
                }else{
                    _this.treeData.createSectionState = 0;
                    _this.treeData.createKnowledgeState = 0;
                }
            },
            modelFormShow(from){
                var _this = this;
                if(from == 1){//section
                    if(_this.treeData.createSectionState == 1){
                        _this.modelFormData.title = '新增章节'
                        _this.modelFormData.editObj = {
                            id: null,
                            name: '',
                            parentId: _this.treeData.currentValue,
                            toRoot: true
                        }
                    }else if(_this.treeData.createSectionState == 2){
                        _this.modelFormData.title = '编辑章节'
                        _this.modelFormData.editObj = {
                            id: _this.treeData.currentValue,
                            name: _this.treeData.currentNodeName
                        }

                    }
                    _this.modelFormData.visible = true

                }
                if(from == 2){//knowledge
                    if(_this.treeData.createKnowledgeState == 1){
                        _this.modelFormData.title = '新增知识点'
                        _this.modelFormData.editObj = {
                            id: null,
                            name: '',
                            parentId: _this.treeData.currentValue,
                            toRoot: false
                        }
                    }else if(_this.treeData.createKnowledgeState == 2){
                        _this.modelFormData.title = '编辑知识点'
                        _this.modelFormData.editObj = {
                            id: _this.treeData.currentValue,
                            name: _this.treeData.currentNodeName
                        }
                    }
                    _this.modelFormData.visible = true

                }
            },
            modelFormCancel(name){
                //清空填写的内容
                this.$refs[name].resetFields();
                //隐藏modal
                this.modelFormData.visible = false;
            },
            modelFormSubmit(name){
                var _this = this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        // loading && submit by ajax
                        _this.modelFormData.loading = true;

                        var creating = true;
                        if(_this.modelFormData.editObj.id){
                            creating = false;
                        }
                        console.log(_this.modelFormData.editObj)
                        ezjsUtil.request(apiConstants.course_subject_createNodeUnderParent, _this.modelFormData.editObj,
                            function(err, data) {
                                if(err){
                                    return;
                                }
                                //清空填写的内容
                                _this.$refs[name].resetFields();
                                _this.treeDataRefresh()
                                //隐藏modal
                                _this.modelFormData.visible = false;
                                _this.modelFormData.loading = false;
                            }
                        );
                    } else {
                        _this.$Message.error('表单验证失败!');
                    }
                })
            },
            treeNodeRemove(){
                var _this = this, msg = '';
                if(_this.treeData.currentNodeHasChildren != 0){//有子节点,无法删除
                    msg = '请先删除章节下的知识点,在删除章节!';
                    return _this.$Modal.error({
                        title: '删除失败',
                        content: '<p>' + msg + '</p>',
                    })
                }
                if(_this.treeData.createSectionState == 2){
                    msg += '章节'
                }
                if(_this.treeData.createKnowledgeState == 2){
                    msg += '知识点'
                }
                msg += '<b> ' + _this.treeData.currentNodeName + ' </b>';
                _this.$Modal.confirm({
                    title: '确认删除么',
                    content: '<p>您确定删除'+ msg +'么?</p>',
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.course_subject_RemoveById,
                            {
                                _id: _this.treeData.currentValue
                            },
                            function(err, data) {
                                _this.$Modal.remove();
                                if(err){
                                    return;
                                }
                                _this.$Message.success('删除成功!');
                                _this.treeDataRefresh()

                            }
                        )
                    }
                });
            },
        }

    }
</script>