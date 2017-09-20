<template>
        <!-- lr-right-middle -->
        <div class="lr-right-middle">
            <i-input class="common-default-size common-left-btn" size="small" :value.sync="searchData.name"
                 placeholder="考试名称(模糊查询)"></i-input>
            <i-button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh(true)" icon="ios-search">搜索</i-button>
        </div>

        <!-- lr-import-0 页面内table的区域 -->
        <div class="z-table-container">
            <i-table class="z-table" border :content="tableData.self" :columns="tableData.columns"
                     :data="tableData.data" stripe></i-table>
        </div>

        <!-- lr-right-bottom -->
        <div class="z-flip-container">
            <div class="z-flip-page">
                <Page class="z-leader-manage-page" :current="tableData.flipInfo.currentPage"
                      :total="tableData.flipInfo.totalCount" @on-change="tableChangePage"
                      simple></Page>
            </div>
            <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
        </div>

    <Modal
            :title="generatePaperModal.title"
            :visible.sync="generatePaperModal.visible"
            :mask-closable="false"
            :closable="false"
    >

        <i-form v-ref:generate-paper-modal-validate :model="generatePaperModal.editObj" :rules="generatePaperModal.validate"
                :label-width="80"
                class="z-form">
            <Form-item label="数量" prop="cnt">
                <Input-number :max="100" :min="1" :value.sync="generatePaperModal.editObj.cnt"
                              placeholder="请输入此次生成的试卷数量"></Input-number>
                <p>请输入此次生成的试卷数量</p>
            </Form-item>
        </i-form>
        <div slot="footer">
            <i-button type="text" @click="generatePaperModalCancel('generatePaperModalValidate')">取消</i-button>
            <i-button type="primary" @click="generatePaperModalSubmit('generatePaperModalValidate')"
                      :loading="generatePaperModal.loading">
                提交
            </i-button>
        </div>
    </Modal>
</template>
<style>
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

                generatePaperModal: {
                    title: '生成试卷',
                    editObj: {
                        cnt: 1
                    },
                    validate: {
                        cnt: [{required: true, message: '请输入此次生成的试卷数量', trigger: 'change', type: 'number'}]
                    },
                    loading: false,
                    visible: false,
                },

                searchData: {
                    name: '',
                },
                tableData: {
                    self: this,
                    columns: [
                        {
                            type: 'index',
                            width: 40,
                            align: 'center'
                        },
                        {
                            title: '考试名称',
                            // ellipsis: true,
                            key: 'name'
                        },
                        {
                            title: '开始时间',
                            render(row){
                                return '{{"' + row.startTime + '" | formatDate}}'
                            }
                        },
                        {
                            title: '考试时长',
                            render(row, column, index){
                                return row.duration + 'min';
                            }
                        },
                        {
                            title: '试卷数量',
                            render(row, column, index){
                                return row.paperCnt + '套';
                            }
                        },
                        {
                            title: '试卷总分值',
                            render(row, column, index){
                                return row.totalScore + '分';
                            }
                        },
                        {
                            title: '考试状态',
                            render(row, column, index){
                                return dict.getVal('examStatus', row.status);
                            }
                        },
                        {
                            title: '创建时间',
                            render(row){
                                return '{{"' + row.createTime + '" | formatDate}}'
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            // width: 150,
                            align: 'center',
                            render (row, column, index) {
                                return `<i-button type="primary" size="small" v-link="'/company/exam/detail/' + ${row.id}">详情</i-button>`
                                        + ` <i-button type="primary" size="small" v-show="${row.status == 1}" v-link="'/company/exam/edit?id=' + ${row.id}">编辑</i-button>`
                                        + ` <i-button type="primary" size="small" @click="viewPaper(${index})">查看试卷</i-button>`
                                        + ` <i-button type="primary" size="small" v-show="${row.status == 4 || row.status == 5}" v-link="'/company/exam/monitor/' + ${row.id}">考试现场监控</i-button>`
                                        + ` <i-button type="primary" size="small" v-show="${row.status == 6}" v-link="'/company/exam/testResult/' + ${row.id}">考试结果</i-button>`

                                        + ` <i-button type="error" size="small" v-show="${row.status == 1 || row.status == 3}" @click="tableDataRemove(${index})">删除</i-button>`
                                        ;
                            }
                        },
                    ],
                    data: [],
                    flipInfo: {
                        currentPage: 1,
                        totalCount: 0
                    },
                },
            }
        },
        components:{
        },
        filters: {
            formatDate(time){
                var date = new Date(Number.parseInt(time));
                return filterUtil.formatDate(date);
            },
            departmentFilter(codes){
                return codes
            },
            strategyFilter(codes){
                return codes
            },
        },
        route: {
            data: function(transition) {
                console.log('start to refresh table data.')
            }
        },
        created: function () {
            this.clearSearchData()
            this.tableDataRefresh(true)
        },
        methods: {

            tableDataRemove (index) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '确认删除么',
                    content: '<p>您确定删除该考试么?</p>',
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.exam_removeById,
                            {
                                _id: _this.tableData.data[index].id
                            },
                            function(err, data) {
                                _this.$Modal.remove();
                                if(err){
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
                if(fromPageNo1){
                    _this.tableData.flipInfo.currentPage = 1;
                }
                ezjsUtil.request(apiConstants.exam_flip,
                    {
                        name: _this.searchData.name,
                        pageNo: _this.tableData.flipInfo.currentPage
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
            clearSearchData(){
                var _this = this;
                _this.searchData = {
                    name: '',
                }
            },
            tableChangePage(pageNo){
                var _this = this;
                _this.tableData.flipInfo.currentPage = pageNo
                _this.tableDataRefresh()
            },

            // status = 3
            viewPaper(index){
                var _this = this;
                var currentEditObj = _this.tableData.data[index];
                // _this.$parent.$data.currentEditObj = currentEditObj;
                var go = '/company/exam/viewPaper/' + currentEditObj.id;
                _this.$route.router.go(go)
            },

        }
    }
</script>
