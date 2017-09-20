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
                <label>试卷数量:</label>
                <div>{{ currentEditObj.paperCnt }}套</div>
            </div>
            <div class="z-form-item">
                <label>试卷总分:</label>
                <div>{{ currentEditObj.totalScore }}分</div>
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
            <a>当前考生信息</a><small>每分钟自动刷新考生信息</small>
            <div class="common-top-right">
            </div>
        </div>

        <!-- lr-import-0 页面内table的区域 -->
        <div class="z-table-container">
            <i-table class="z-table" border :content="tableData.self" :columns="tableData.columns"
                     :data="tableData.data" stripe></i-table>
        </div>

        <!-- lr-right-bottom
        <div class="z-flip-container">
            <div class="z-flip-page">
                <Page class="z-leader-manage-page" :current="tableData.flipInfo.currentPage"
                      :total="tableData.flipInfo.totalCount" @on-change="tableChangePage"
                      simple></Page>
            </div>
            <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
        </div>-->

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

                currentEditObj: {},

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
                            title: '学生姓名',
                            // ellipsis: true,
                            key: 'staffName'
                        },
                        { title: '学生学号',key: 'staffNum' },
                        { title: '试卷编号',key: 'paperOrderNum' },
                        { title: '当前IP',key: 'currentIp' },
                        {
                            title: '考试状态',
                            render(row, column, index){
                                return dict.getVal('stuPaperStatus', row.status);
                            }
                        },
                        {
                            title: '开始考试时间',
                            render(row){
                                if(row.startTime){
                                    return '{{"' + row.startTime + '" | formatDate}}'
                                }
                                return '';
                            }
                        },
                        {
                            title: '交卷时间',
                            render(row){
                                if(row.submitTime){
                                    return '{{"' + row.submitTime + '" | formatDate}}'
                                }
                                return '';
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            // width: 150,
                            align: 'center',
                            render (row, column, index) {
                                return '';//`<i-button type="primary" size="small" v-show="${row.status == 3}" v-link="'/company/exam/' + ${row.id}">阅卷</i-button>`;

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
        },
        route: {
            data: function(transition) {
                console.log('start to refresh table data.')
            }
        },
        created: function () {
            this.initExamInfo()
            this.clearSearchData()
            this.tableDataRefresh(true)
            var _this = this;
            var tableRefresh = this.tableDataRefresh;

            setInterval(function() {
                tableRefresh();
                _this.$Message.success('考生信息已更新!');
            }, 60*1000)

        },
        methods: {
            initExamInfo() {
                var _this = this;
                ezjsUtil.request(apiConstants.exam_detail,
                        {
                            _id: _this.$route.params.id
                        },
                        function (err, data) {
                            if (err) {
                                return;
                            }
                            _this.currentEditObj = (data);
                        }
                );
            },
            tableDataRefresh(fromPageNo1){
                var _this = this;
                _this.initExamInfo()
                if(fromPageNo1){
                    _this.tableData.flipInfo.currentPage = 1;
                }
                ezjsUtil.request(apiConstants.exam_testing_monitor,
                    {
                        _id: _this.$route.params.id,
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


        }
    }
</script>
