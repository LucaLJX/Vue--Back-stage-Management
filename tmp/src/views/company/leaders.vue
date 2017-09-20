<style lang="less">
</style>

<template>

    <!-- common-top -->
    <div class="common-top-container">
        <div class="common-top-ver-line"></div>
        <a class="common-top-title-left" v-link="pageData.link">{{ pageData.title }}</a>
        <div class="common-top-right">
            <i-button class="common-right-btn" type="primary" size="small" @click="modelFormEdit()"
                      icon="ios-personadd-outline">新增教师
            </i-button>
            <i-button class="common-right-btn" type="primary" size="small" @click="tableDataRefresh()"
                      icon="ios-personadd-outline">刷新
            </i-button>
        </div>
    </div>

    <!-- tb-container -->
    <div class="tb-container">

        <!-- tb-container-top -->
        <i-select :model.sync="searchData.role" size="small" placeholder="选择教师角色"
                  class="common-short-size common-left-btn" clearable>
            <i-option v-for="item in dict.leaderRoles" :value="item.dictKey">{{ item.dictVal }}</i-option>
        </i-select>
        <i-input class="common-short-size common-left-btn" size="small" :value.sync="searchData.num"
                 placeholder="教师编号"></i-input>
        <i-input class="common-default-size common-left-btn" size="small" :value.sync="searchData.name"
                 placeholder="教师姓名(模糊查询)"></i-input>
        <i-button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh(true)" icon="ios-search">
            搜索
        </i-button>

        <!-- tb-container-table -->
        <div class="z-table-container">
            <i-table class="z-table" border :content="tableData.self" :columns="tableData.columns"
                     :data="tableData.data" stripe></i-table>
        </div>
        <div class="z-flip-container">
            <div class="z-flip-page">
                <Page class="z-leader-manage-page" :current="tableData.flipInfo.currentPage"
                      :total="tableData.flipInfo.totalCount"
                      simple></Page>
            </div>
            <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
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
            <Form-item label="教师姓名" prop="name">
                <i-input :value.sync="modelFormData.editObj.name" placeholder="请输入姓名"
                         class="z-form-controller"></i-input>
            </Form-item>
            <Form-item label="教师编号" prop="num">
                <i-input :value.sync="modelFormData.editObj.num" placeholder="请输入教师编号(作为登录账户,初始密码123456)"
                         class="z-form-controller"></i-input>
            </Form-item>
            <Form-item label="教师角色" prop="role">
                <i-select :model.sync="modelFormData.editObj.role" placeholder="选择教师角色"
                          class="z-form-controller">
                    <i-option v-for="item in dict.leaderRoles" :value="item.dictKey">{{ item.dictVal }}</i-option>
                </i-select>
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

    <Modal
            :title="grantWithClassModal.title"
            :visible.sync="grantWithClassModal.visible"
            :mask-closable="false"
            :closable="false"
    >
        <div class="z-vue-tree">
            <Tree v-ref:grant-class-tree :data="grantWithClassModal.treeData" show-checkbox></Tree>
        </div>
        <div slot="footer">
            <i-button type="text" @click="grantWithClassModalCancel()">取消</i-button>
            <i-button type="primary" @click="grantWithClassModalSubmit()"
                      :loading="grantWithClassModal.loading">
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

    export default {
        data () {
            return {
                dict: dict,

                pageData: {
                    title: '教师管理',
                    link: '/company/leaders'
                },

                searchData: {
                    name: '',
                    num: '',
                    role: '',
                },

                tableData: {
                    self: this,
                    columns: [
                        {
                            type: 'index',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: '教师姓名',
                            key: 'name'
                        },
                        {
                            title: '教师编号',
                            key: 'num'
                        },
                        {
                            title: '教师角色',
                            key: 'role',
                            render (row, column, index){
                                return dict.getVal('leaderRoles', row.role);
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 210,
                            align: 'center',
                            render (row, column, index) {
                                return `<i-button type="primary" size="small" @click="modelFormEdit(${index})">编辑</i-button>`
                                        + ` <i-button type="primary" size="small" @click="grantWithClass(${index})">班级授权</i-button>`
                                        + ` <i-button type="error" size="small" @click="tableDataRemove(${index})">删除</i-button>`;
                            }
                        },
                    ],
                    data: [],
                    flipInfo: {
                        currentPage: 1,
                        totalCount: 0
                    },
                },

                modelFormData: {
                    title: '新增教师',
                    initObj: {
                        id: null,
                        name: '',
                        num: '',
                        role: ''
                    },
                    editObj: {
                        id: null,
                        name: '',
                        num: '',
                        role: ''
                    },
                    editIndex: null,//正在编辑的table索引
                    validate: {
                        name: [
                            {required: true, message: '姓名不能为空', trigger: 'blur'}
                        ],
                        num: [
                            {required: true, message: '编号不能为空,将用作教师登录账号', trigger: 'blur'},
                        ],
                        role: [
                            {required: true, message: '请选择教师角色', trigger: 'change', type: 'number'}
                        ],
                    },
                    loading: false,
                    visible: false,
                },

                grantWithClassModal: {
                    title: '班级授权',
                    editLeader: null,//正在编辑的对象
                    validate: {
                        name: [
                            {required: true, message: '姓名不能为空', trigger: 'blur'}
                        ],
                    },
                    loading: false,
                    visible: false,
                    treeData: []
                },

            };
        },
        created: function () {
            var _this = this;

            _this.tableDataRefresh();
        },

        methods: {
            modelFormEdit (index) {
                this.modelFormData.visible = true
                if (typeof index == 'undefined') {//create
                    this.modelFormData.editObj = JSON.parse(JSON.stringify(this.modelFormData.initObj));
                    this.modelFormData.editIndex = null;
                } else {//edit
                    var eData = this.tableData.data[index];
                    this.modelFormData.editIndex = index;
                    this.modelFormData.editObj = JSON.parse(JSON.stringify(eData));
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
                        if (_this.modelFormData.editObj.id) {
                            creating = false;
                        }
                        console.log(_this.modelFormData.editObj)
                        _this.modelFormData.editObj.companyId = _this.$auth.user().company_id;
                        ezjsUtil.request(apiConstants.leader_edit, _this.modelFormData.editObj,
                                function (err, data) {
                                    if (err) {
                                        return;
                                    }
                                    //清空填写的内容
                                    _this.$refs[name].resetFields();
                                    //隐藏modal
                                    _this.modelFormData.visible = false;
                                    //刷新表单, 新增时回到第一页
                                    if (creating) {
                                        _this.tableDataRefresh(true)
                                    } else {
                                        _this.tableDataRefresh()
                                    }
                                    _this.modelFormData.loading = false;
                                }
                        );
                    } else {
                        _this.$Message.error('表单验证失败!');
                    }
                })
            },

            tableDataRemove (index) {
                var _this = this;
                var msg = '教师' + '<b> ' + _this.tableData.data[index].name + ' </b>';
                _this.$Modal.confirm({
                    title: '确认删除么',
                    content: '<p>您确定删除' + msg + '么?</p>',
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.leader_removeById,
                                {
                                    _id: _this.tableData.data[index].id
                                },
                                function (err, data) {
                                    _this.$Modal.remove();
                                    if (err) {
                                        return;
                                    }
                                    _this.$Message.success('删除成功!');
                                    _this.tableDataRefresh()

                                }
                        )
                    }
                });
            },
            tableDataRefresh(fromPageNo1){
                var _this = this;
                if (fromPageNo1) {
                    _this.tableData.flipInfo.currentPage = 1;
                }
                ezjsUtil.request(apiConstants.leader_flip,
                        {
                            companyId: _this.$auth.user().company_id,
                            role: _this.searchData.role,
                            name: _this.searchData.name,
                            num: _this.searchData.num,
                            pageNo: _this.tableData.flipInfo.currentPage,
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            var listInfo = data.listInfo;
                            _this.tableData.data = listInfo;

                            _this.tableData.flipInfo.totalCount = data.flipInfo.totalCount
                        }
                );
            },

            //班级授权弹出框
            grantWithClass(index){
                var eData = this.tableData.data[index];
                this.grantWithClassModal.editLeader = eData;
                this.grantWithClassModal.title = '班级授权(授权给 ' + this.grantWithClassModal.editLeader.name + ' )';
                this.grantWithClassModal.visible = true
                this.treeDataRefresh()
            },
            grantWithClassModalCancel(name){
                var _this = this;
                _this.grantWithClassModal.treeData = []
                //隐藏modal
                _this.grantWithClassModal.visible = false;
            },
            grantWithClassModalSubmit(name){
                var _this = this;
                var ids = '';
                var checkedNodes = this.$refs['grantClassTree'].getCheckedNodes();
                for (var i = 0; i < checkedNodes.length; i++) {
                    var node = checkedNodes[i];
                    if (node.isLeaf) {
                        ids += node.id + ',';
                    }
                }
                if (ids.length == 0) {
                    return _this.$Message.error('请至少选择一个班级!');
                }
                this.grantWithClassModal.loading = true;
                ezjsUtil.request(apiConstants.leader_grantClass,
                        {
                            leaderId: _this.grantWithClassModal.editLeader.id,
                            classIds: ids
                        },
                        function (err, data) {
                            _this.$Message.success('授权成功!');
                            _this.grantWithClassModal.visible = false;
                            _this.grantWithClassModal.loading = false;
                            _this.grantWithClassModal.treeData = []
                        }
                );
            },
            treeDataRefresh(){
                var _this = this;
                ezjsUtil.request(apiConstants.department_tree,
                        {
                            _companyId: _this.$auth.user().company_id
                        },
                        function (err, treeData) {

                            //获取该教师已经授权的班级信息
                            ezjsUtil.request(apiConstants.leader_grantedClass,
                                    {
                                        leaderId: _this.grantWithClassModal.editLeader.id
                                    },
                                    function (err, data) {
                                        var grantedArr = data.departmentIds;
                                        var granted = grantedArr.join(',');
                                        granted = ',' + granted + ',';
                                        console.log(granted);

                                        function formatTreeData(arr) {
                                            var newTree = []
                                            for (var i = 0; i < arr.length; i++) {
                                                var node = arr[i];
                                                var checked = false;
                                                if (granted.indexOf(',' + node.value + ',') != -1) {
                                                    checked = true;
                                                }
                                                newTree.push({
                                                    expand: true,
                                                    title: node.label,
                                                    children: formatTreeData(node.nodes),
                                                    id: node.value,
                                                    checked: checked
                                                })
                                            }
                                            return newTree;
                                        }

                                        _this.grantWithClassModal.treeData = formatTreeData(treeData)
                                    }
                            );

                        }
                );
            },
        }
    }
</script>