<style scoped lang="less">
    #company-manage-table-container {
        margin-top: 16px;
    }
</style>

<template>

    <!-- common-top -->
    <div class="common-top-container">
        <div class="common-top-ver-line"></div>
        <a class="common-top-title-left" v-link="pageData.link">{{ pageData.title }}</a>
        <div class="common-top-right">
            <i-button class="common-right-btn" type="primary" size="small" @click="modelFormEdit()"
                      icon="ios-personadd-outline">新增学校
            </i-button>
            <i-button class="common-right-btn" type="primary" size="small" @click="tableDataRefresh()"
                      icon="ios-personadd-outline">刷新
            </i-button>
        </div>
    </div>


    <!-- tb-container -->
    <div class="tb-container">
        <i-input class="common-default-size common-left-btn" size="small" :value.sync="searchData.name"
                 placeholder="学校名称(模糊查询)"></i-input>
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
                    title: '学校管理',
                    link: '/company/companies'
                },

                searchData: {
                    name: '',
                },

                tableData: {
                    self: this,
                    columns: [
                        { type: 'index', width: 40, align: 'center'},
                        { title: '学校名称', key: 'name' },
                        {
                            title: 'logo',
                            key: 'logo',
                            width: 150,
                            align: 'center',
                            render (row, column, index) {
                                return `<img src="${ row.logo }" style="width:50px;header:50px;margin-top:14px;margin-bottom:14px;"></img>`;
                            }
                        },
                        {
                            title: '联系人',
                            key: 'contact_name'
                        },
                        {
                            title: '联系电话',
                            key: 'contact_phone'
                        },
                        {
                            title: '联系邮箱',
                            key: 'contact_email'
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 210,
                            align: 'center',
                            render (row, column, index) {
                                return `<i-button type="primary" size="small" @click="modelFormEdit(${index})">编辑</i-button>`
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

            };
        },
        created: function () {
            var _this = this;
            _this.tableDataRefresh();
        },

        methods: {
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
                ezjsUtil.request(apiConstants.company_flip,
                        {
                            name: _this.searchData.name,
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

        }
    }

</script>