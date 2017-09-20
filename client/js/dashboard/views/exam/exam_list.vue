<template>
  <div>
    <!-- lr-right-middle -->
    <div class="lr-right-middle">
      <i-input class="common-default-size common-left-btn" size="small" v-model="searchData.name"
               placeholder="考试名称(模糊查询)"></i-input>
      <i-button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh(true)" icon="ios-search">
        搜索
      </i-button>
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
      v-model="generatePaperModal.visible"
      :mask-closable="false"
      :closable="false"
    >

      <i-form ref="generatePaperModalValidate" :model="generatePaperModal.editObj"
              :rules="generatePaperModal.validate"
              :label-width="80"
              class="z-form">
        <Form-item label="数量" prop="cnt">
          <Input-number :max="100" :min="1" v-model="generatePaperModal.editObj.cnt"
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
  </div>
</template>
<style>
</style>
<script type="text/ecmascript-6">


  var ezjsUtil = Vue.ezjsUtil; var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  var filterUtil = ezjsUtil.filterUtil;

  export default{
    props: {},
    data(){
      return {
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
              render: (h, params) => {
                var row = params.row;
                if(row.startTime) {
                  return h('div', this.formatDate(row.startTime));
                }else{
                  return h('div', '');
                }
              }
            },
            {
              title: '考试时长',
              render: (h, params) => {
                var row = params.row;
                return h('div', row.duration / 60 + '\'' + row.duration % 60 + '\'\'');
              }
            },
            {
              title: '试卷数量',
              render: (h, params) => {
                var row = params.row;
                return h('div', row.paperCnt + '套');
              }
            },
            {
              title: '试卷总分值',
              render: (h, params) => {
                var row = params.row;
                return h('div', row.totalScore + '分');
              }
            },
            {
              title: '考试状态',
              render: (h, params) => {
                var row = params.row;
                return h('div', dict.getVal('examStatus', row.status));
              }
            },
            {
              title: '创建时间',
              render: (h, params) => {
                var row = params.row;
                return h('div', this.formatDate(params.row.createTime));
              }
            },
            {
              title: '操作',
              key: 'action',
              // width: 150,
              align: 'center',
              render: (h, params) => {
                var index = params.index;
                var id = params.row.id;
                var _this = this;
                const detail = function () {
                  var url = '/company/exam/detail/' + id;
                  _this.$router.push(url);
                };
                const edit = function () {
                  var url = '/company/exam/edit?id=' + id;
                  _this.$router.push(url);
                };
                const paperList = function () {
                  _this.paperList(index)
                };
                const monitor = function () {
                  var url = '/company/exam/monitor/' + id;
                  _this.$router.push(url);
                };
                const paperOfStaffList = function () {
                  var url = '/company/exam/paperOfStaffList/' + id;
                  _this.$router.push(url);
                };
                const tableDataRemove = function () {
                  _this.tableDataRemove(index)
                }
                return (
                  <div>
                    <i-button type="primary" size="small" onClick={detail} >详情</i-button>&nbsp;
                    <i-button type="primary" size="small" v-show={params.row.status == 1} onClick={edit} >编辑</i-button>&nbsp;
                    <i-button type="primary" size="small" v-show={params.row.status == 1} onClick={paperList} >查看试卷</i-button>&nbsp;
                    <i-button type="primary" size="small" v-show={params.row.status == -1 || params.row.status == 4 || params.row.status == 5} onClick={monitor} >考试现场监控</i-button>&nbsp;
                    <i-button type="primary" size="small" v-show={params.row.status == -1 || params.row.status == 6} onClick={paperOfStaffList} >考试结果</i-button>&nbsp;
                    <i-button type="error" size="small" v-show={params.row.status == 1 || params.row.status == 3} onClick={tableDataRemove} >删除</i-button>
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
    created: function () {
      this.clearSearchData()
      this.tableDataRefresh(true)
    },
    methods: {
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
      paperList(index){
        var _this = this;
        var currentEditObj = _this.tableData.data[index];
        // _this.$parent.$data.currentEditObj = currentEditObj;
        var go = '/company/exam/paperList/' + currentEditObj.id;
        _this.$router.push(go)
      },
      route2(path){
        this.$router.push(path)
      }
    }
  }
</script>
