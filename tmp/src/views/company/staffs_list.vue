<template>
        <!-- lr-right-middle -->
        <div class="lr-right-middle">
            <i-input class="common-short-size common-left-btn" size="small" :value.sync="searchData.name"
                     placeholder="姓名"></i-input>
            <i-input class="common-short-size common-left-btn" size="small" :value.sync="searchData.num"
                     placeholder="学号"></i-input>
            <i-select :model.sync="searchData.sex" size="small" placeholder="性别"
                    class="common-short-size common-left-btn" clearable>
                <i-option v-for="item in dict.staffSex" :value="item.dictKey">{{ item.dictVal }}</i-option>
            </i-select>

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
    var su = ezjsUtil.sessionUtil;

    export default{
        props: {
        },
        data(){
            return{
                dict: dict,

                searchData: {
                    name: '',
                    num: '',
                    sex: '',
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
                            title: '姓名',
                            // ellipsis: true,
                            key: 'name'
                        },
                        {
                            title: '学号',
                            key: 'num',
                        },
                        {
                            title: '性别',
                            key: 'sex',
                            render(row, column, index){
                                return dict.getVal('staffSex', row.sex);
                            }
                        },
                        {
                            title: '班级',
                            key: 'departmentCode',
                            render(row, column, index){
                                return '{{"' + row.departmentCode + '" | treeCode2LabelFilter}}'
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 150,
                            align: 'center',
                            render (row, column, index) {
                                return `<i-button type="primary" size="small" v-link="'/company/staffs/detail/' + ${row.id}">详情</i-button> <i-button type="primary" size="small" v-link="'/company/staffs/edit?id=' + ${row.id}">编辑</i-button>`
                                    +` <i-button type="error" size="small" @click="tableDataRemove(${index})">删除</i-button>`
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
            treeCode2LabelFilter(code){
                var _this = this;
                return '' + _this.$parent.treeCode2Label(code);
            }
        },
        route: {
            data: function(transition) {
                console.log('start to refresh table data.')
                this.clearSearchData()
                this.tableDataRefresh(true)
            }
        },
        methods: {
            tableDataRemove (index) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '确认删除么',
                    content: '<p>您确定删除该题目么?</p>',
                    loading: true,
                    onOk() {
                        ezjsUtil.request(apiConstants.staff_RemoveById,
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
                console.log(_this.$parent.$data.treeData.currentNodeCode)
                ezjsUtil.request(apiConstants.staff_list,
                    {
                        departmentCode: _this.$parent.$data.treeData.currentNodeCode,
                        name: _this.searchData.name,
                        num: _this.searchData.num,
                        sex: _this.searchData.sex,
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
                    num: '',
                    sex: '',
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
