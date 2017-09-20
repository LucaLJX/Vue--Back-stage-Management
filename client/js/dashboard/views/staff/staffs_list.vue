<template>
  <div>
    <!-- cr-right-middle -->
    <div class="cr-right-middle">
      <i-input class="common-short-size common-left-btn" size="small" v-model="searchData.name"
               placeholder="姓名"></i-input>
      <i-input class="common-short-size common-left-btn" size="small" v-model="searchData.num"
               placeholder="学号"></i-input>
      <i-select v-model="searchData.sex" size="small" placeholder="性别"
                class="common-short-size common-left-btn" clearable>
        <i-option v-for="item in dict.staffSex" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</i-option>
      </i-select>

      <i-button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh(true)" icon="ios-search">
        搜索
      </i-button>
    </div>

    <!-- cr-import-0 页面内table的区域 -->
    <div class="z-table-container">
      <i-table class="z-table" border :content="tableData.self" :columns="tableData.columns"
               :data="tableData.data" stripe></i-table>
    </div>

    <!-- cr-right-bottom -->
    <div class="z-flip-container">
      <div class="z-flip-page">
        <Page class="z-leader-manage-page" :current="tableData.flipInfo.currentPage"
              :total="tableData.flipInfo.totalCount" @on-change="tableChangePage"
              simple></Page>
      </div>
      <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
    </div>
  </div>
</template>
<style>
</style>
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
              render: (h, params) => {
                return h('div', dict.getVal('staffSex', params.row.sex));
              }
            },
            {
              title: '班级',
              key: 'departmentCode',
              render: (h, params) => {
                return h('div', this.treeCode2LabelFilter(params.row.departmentCode));
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                var row = params.row;
                var _this = this;
                const detailOnClick = function () {
                  _this.tableRowDetail(row.id)
                }
                const editOnClick = function () {
                  _this.tableRowEdit(row.id)
                }
                const removeOnClick = function () {
                  _this.tableDataRemove(row.id)
                }
                return (
                  <div>
                    <i-button type="primary" size="small" onClick={detailOnClick} >详情</i-button>&nbsp;
                    <i-button type="primary" size="small" onClick={editOnClick} >编辑</i-button>&nbsp;
                    <i-button type="error" size="small" onClick={removeOnClick} >删除</i-button>
                  </div>
                )
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
    components: {},

    watch: {
      '$route': 'routeChangeHandler'
    },
    mounted(){
      console.log('page course_list created.')
      this.routeChangeHandler();
    },
    methods: {
      treeCode2LabelFilter(code){
        var _this = this;
        return '' + _this.$parent.treeCode2Label(code);
      },
      routeChangeHandler: function (transition) {
        console.log('start to refresh table data.')
        this.clearSearchData()
        this.tableDataRefresh(true)
      },
      tableDataRemove (rowId) {
        var _this = this;
        _this.$Modal.confirm({
          title: '确认删除么',
          content: '<p>您确定删除该题目么?</p>',
          loading: true,
          onOk() {
            ezjsUtil.request(apiConstants.staff_RemoveById,
              {
                _id: rowId
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
        console.log(_this.$parent.$data.selectedNode.code)
        ezjsUtil.request(apiConstants.staff_list,
          {
            departmentCode: _this.$parent.$data.selectedNode.code,
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
      tableRowDetail(rowId){
        this.$router.push('/company/staff/' + this.$parent.$data.selectedNode.id + '/staffDetail/' + rowId);
      },
      tableRowEdit(rowId){
        this.$router.push('/company/staff/' + this.$parent.$data.selectedNode.id + '/staffEdit?id=' + rowId);
      }
    }
  }
</script>
