<template>
  <div>
    <!-- cr-right-middle -->
    <div class="cr-right-middle">
      <i-select v-model="searchData.questionType" size="small" placeholder="题目类型"
                class="common-short-size common-left-btn" clearable>
        <i-option v-for="item in dict.questionType" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</i-option>
      </i-select>
      <i-select v-model="searchData.difficulty" size="small" placeholder="选择难易度"
                class="common-short-size common-left-btn" clearable>
        <i-option v-for="item in dict.difficulty" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</i-option>
      </i-select>
      <i-input class="common-short-size common-left-btn" size="small" v-model="searchData.stem"
               placeholder="题干"></i-input>
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
          difficulty: '',
          stem: '',
          questionType: '',
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
              title: '题干信息',
              // ellipsis: true,
              key: 'stem'
            },
            {
              title: '章节/知识点',
              width: 120,
              key: 'subjectCode',
              render: (h, params) => {
                return h('div', this.treeCode2LabelFilter(params.row.subjectCode));
              }
            },
            {
              title: '题目类型',
              width: 100,
              key: 'questionType',
              render: (h, params) => {
                var row = params.row;
                return h('div',
                  dict.getVal('questionType', row.questionType)
                );
              }
            },
            {
              title: '难易度',
              width: 100,
              key: 'difficulty',
              render: (h, params) => {
                var row = params.row;
                return h('div',
                  dict.getVal('difficulty', row.difficulty)
                );
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
//      ezjsUtil.eventHub.$on('course-tree-click', this.routeChangeHandler)
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
            ezjsUtil.request(apiConstants.question_RemoveByStemId,
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
        // console.log(_this.$parent.$data.selectedNode.code)
        ezjsUtil.request(apiConstants.course_subject_allQuestionStem,
          {
            // subjectCode: _this.$parent.$data.selectedNode.code,
            subjectCode: _this.$route.query.subjectCode,
            questionType: _this.searchData.questionType,
            stem: _this.searchData.stem,
            difficulty: _this.searchData.difficulty,
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
          difficulty: '',
          stem: '',
          questionType: '',
        }
      },
      tableChangePage(pageNo){
        var _this = this;
        _this.tableData.flipInfo.currentPage = pageNo
        _this.tableDataRefresh()
      },
      tableRowDetail(rowId){
        this.$router.push('/company/course/' + this.$parent.$data.selectedNode.id + '/question/' + rowId);
      },
      tableRowEdit(rowId){
        this.$router.push('/company/course/' + this.$parent.$data.selectedNode.id + '/questionEdit?id=' + rowId);
      }
    }
  }
</script>
