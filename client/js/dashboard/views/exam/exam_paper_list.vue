<template>
  <div>
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
        <div class="z-form-item" v-show="currentEditObj.startTime">
          <label>开始时间:</label>
          <div>{{ formatDate(currentEditObj.startTime) }}</div>
        </div>
        <div class="z-form-item">
          <label>考试时长:</label>
          <div>{{currentEditObj.duration}}秒</div>
        </div>
      </Card>
    </div>
    <!-- lr-right-middle
    <div class="lr-right-middle">
        <i-input class="common-default-size common-left-btn" size="small" v-model="searchData.name"
             placeholder="考试名称(模糊查询)"></i-input>
        <i-button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh(true)" icon="ios-search">搜索</i-button>
    </div>-->

    <div class="common-top-action-container">
      <a>试卷列表</a>
      <div class="common-top-right">
        <i-button type="primary" size="small" @click="route2('/company/exam/detail/' + $route.params.id)">详情</i-button>
        <i-button type="primary" size="small" v-show="currentEditObj.status == 1"
                  @click="route2('/company/exam/edit?id=' + $route.params.id)">编辑
        </i-button>
        <i-button type="primary" size="small" v-show="currentEditObj.status == 1 || currentEditObj.status == 3"
                  @click="generatePaper()">生成试卷
        </i-button>
        <i-button type="primary" size="small" v-show="currentEditObj.status == 1 || currentEditObj.status == 2 || currentEditObj.status == 3" :disabled="currentEditObj.paperCnt == 0"
                  @click="releaseConfirm()">发布考试
        </i-button>
        <i-button type="ghost" size="small" v-show="currentEditObj.status == 4" @click="releaseCancelConfirm()">取消发布
        </i-button>
      </div>
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
        <Form-item label="试卷数量" prop="cnt">
          <Input-number :max="100" :min="1" v-model="generatePaperModal.editObj.cnt"
                        placeholder="请输入此次生成的试卷数量"></Input-number>
          <p>请输入此次生成的试卷数量</p>
          <p style="font-weight: bold;">注意:</p>
          <p>1. 成功生成试卷后将不可编辑考试信息,请确认考试信息填写无误</p>
          <p>2. 可多次生成试卷,也可删除特定的试卷</p>
          <p>3. 所有生成的有效试卷都将用于此次考试,并随机发放给每一个考生,每个考生仅作答一套试卷.</p>
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
              title: '试卷编号',
              // ellipsis: true,
              key: 'orderNum'
            },
            {
              title: '创建时间',
              render: (h, params) => {
                var row = params.row;
                return h('div', this.formatDate(row.createTime));
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
                var row = params.row;
                var _this = this;
                const detail = function () {
                  var url = '/company/exam/' + row.examId + '/paperDetail/' + id;
                  _this.$router.push(url);
                };
                const tableDataRemove = function () {
                  _this.tableDataRemove(index)
                }
                return (
                  <div>
                    <i-button type="primary" size="small" onClick={detail} >详情</i-button>&nbsp;
                    <i-button type="error" size="small" v-show="currentEditObj.status != 4" onClick={tableDataRemove} >删除</i-button>
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
      this.initExamInfo()
      this.clearSearchData()
      this.tableDataRefresh(true)
    },
    methods: {
      formatDate(time){
        if(!time) {
          return '';
        }
        var date = new Date(Number.parseInt(time));
        return filterUtil.formatDate(date);
      },
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
      tableDataRemove (index) {
        var _this = this;
        _this.$Modal.confirm({
          title: '确认删除么',
          content: '<p>您确定删除该题目么?</p>',
          loading: true,
          onOk() {
            ezjsUtil.request(apiConstants.exam_removePaper,
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
        _this.initExamInfo()
        if (fromPageNo1) {
          _this.tableData.flipInfo.currentPage = 1;
        }
        ezjsUtil.request(apiConstants.exam_paperFlip,
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

      // status = 2, generate.
      generatePaper(index){
        var _this = this;
        _this.generatePaperModal.editObj.examId = _this.currentEditObj.id;
        _this.generatePaperModal.visible = true;
      },
      generatePaperModalCancel(name){
        //清空填写的内容
        this.$refs[name].resetFields();
        //隐藏modal
        this.generatePaperModal.visible = false;
      },
      generatePaperModalSubmit(name){
        var _this = this;
        this.$refs[name].validate(function (valid) {
          if (valid) {
            // loading && submit by ajax
            _this.generatePaperModal.loading = true;

            ezjsUtil.request(apiConstants.exam_generatePaper,
              {
                cnt: _this.generatePaperModal.editObj.cnt,
                _id: _this.generatePaperModal.editObj.examId
              },
              function (err, data) {
                if (err) {
                  _this.generatePaperModal.loading = false;
                  return;
                }
                //清空填写的内容
                _this.$refs[name].resetFields();
                //隐藏modal
                _this.generatePaperModal.visible = false;
                _this.tableDataRefresh()
                _this.generatePaperModal.loading = false;
              }
            );
          } else {
            _this.$Message.error('表单验证失败!');
          }
        })
      },


      // status = 4. release
      releaseConfirm(){
        var _this = this;
        var content = '<p>发布后,本场考试将对参与考试的学生可见</p>';
        content += '<p>将无法继续生成试卷,无法删除试卷</p>';
        content += '<p>将无法修改考试信息</p>';
        content += '<p>将无法删除考试, 但可以取消发布</p>';
        content += '<p>确认现在发布么?</p>';
        _this.$Modal.confirm({
          title: '发布确认?',
          content: content,
          loading: true,
          onOk() {
            ezjsUtil.request(apiConstants.exam_releaseById,
              {
                _id: _this.currentEditObj.id
              },
              function (err, data) {
                _this.$Modal.remove();
                if (err) {
                  return;
                }
                _this.$Message.success('发布成功!');
                _this.tableDataRefresh()

              }
            )
          }
        });
      },
      releaseCancelConfirm(){
        var _this = this;
        var content = '<p>取消发布后,本场考试将不开放给参与考试的学生</p>';
        content += '<p>确认取消么?</p>';
        _this.$Modal.confirm({
          title: '取消发布确认?',
          content: content,
          loading: true,
          onOk() {
            ezjsUtil.request(apiConstants.exam_releaseCancelById,
              {
                _id: _this.currentEditObj.id
              },
              function (err, data) {
                _this.$Modal.remove();
                if (err) {
                  return;
                }
                _this.$Message.success('取消发布成功!');
                _this.tableDataRefresh()

              }
            )
          }
        });
      },
      route2(path){
        this.$router.push(path)
      }
    }
  }
</script>
