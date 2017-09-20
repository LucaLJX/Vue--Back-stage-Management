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
                            title: '试卷总分',
                            key: 'totalScore'
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
                            title: '考试状态',
                            render(row, column, index){
                                return dict.getVal('examStatus', row.status);
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            // width: 150,
                            align: 'center',
                            render (row, column, index) {
                                return `<i-button type="primary" size="small" v-link="'/staff/exam/detail/' + ${row.id}">详情</i-button>`
                                        + ` <i-button type="primary" size="small" v-show="${row.status == 7}" v-link="'/staff/exam/detail/' + ${row.id} + '?showScore=1'">查看得分</i-button>`
                                        + ` <i-button type="primary" size="small" v-link="'/staff/exam/testing/' + ${row.id}">开始考试</i-button>`
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

            tableDataRefresh(fromPageNo1){
                var _this = this;
                if(fromPageNo1){
                    _this.tableData.flipInfo.currentPage = 1;
                }
                ezjsUtil.request(apiConstants.exam_flipAll,
                    {
                        name: _this.searchData.name,
                        staffId: _this.$auth.user().staff_id,
                        departmentId: _this.$auth.user().department_id,
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
