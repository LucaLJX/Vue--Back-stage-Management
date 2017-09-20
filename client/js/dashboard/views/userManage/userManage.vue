<style lang="less" scoped>

</style>

<template>
  <div>

    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
    </div>

    <!-- tb-container -->
    <div class="tb-container">
      
      <!-- tb-container-top -->
      <Input class="common-default-size common-left-btn" size="small" v-model="searchData.name" placeholder="昵称查询(模糊查询)" style="width: 150px;"></Input>
      <Select v-model="searchData.sex" size="small" placeholder="性别" class="common-short-size common-left-btn" clearable style="width: 100px;">
        <Option v-for="item in dict.staffSex" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</Option>
      </Select>
      <Button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh" icon="ios-search">
        搜索
      </Button>

      <!-- tb-container-table -->
       <div class="z-table-container">
        <Table class="z-table" border :columns="tableData.columns" :data="tableData.data" stripe ellipsis ></Table>
      </div>
      <div class="z-flip-container">
        <div class="z-flip-page">
          <Page class="z-leader-manage-page" :current="tableData.flipInfo.pageNo" :total="tableData.flipInfo.totalCount" simple @on-change="changePage"></Page>
        </div>
        <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
      </div> 

    </div>

    <!-- 弹出框-查看 -->
    <Modal v-model="detailData.visible" :title="detailData.title" :closable="false" :mask-closable="false">
      <Form label-position="right" :label-width="60">
        <Form-item label="昵称">
          <p>{{ detailData.detailObj.name }}</p>
        </Form-item>
        <Form-item label="编号">
          <p>{{ detailData.detailObj.num }}</p>
        </Form-item>
        <Form-item label="性别">
          <p>{{ detailData.detailObj.sex }}</p>
        </Form-item>
      </Form>
    </Modal>

  </div>
</template>

<script>

  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;

  export default {
    data () {
      return {
        dict: dict,
        pageData: {
          title: '用户管理',
          link: '/userManage'
        },

        searchData: {
          departmentCode: null,
          name: '',
          num: '',
          sex: '',
          pageNo: 1,
        },

        tableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageSize: 1,
            pageNo: 1,
          },
          columns: [
            {
              type: '#',
              width: 60,
              align: 'center',
              render: (h, params) => {
                var _index = params.index + 1 + (this.tableData.flipInfo.pageNo - 1) * this.tableData.flipInfo.pageSize;
                return h ('div', _index)
              }
            },
            {
              title: '姓名',
              key: 'name',
              align: 'center'
            },
            {
              title: '编号',
              key: 'num',
              align: 'center'
            },
            {
              title: '性别',
              key: 'sex',
              render: (h, params) => {
                return h('div', dict.getVal('staffSex', params.row.sex));
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 100,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.index);
                      }
                    }
                  }, '查看'),
                ]);
              }
            }
          ]
        },
        // 查看详情
        detailData: {
          detailObj: {},
          visible: false,
          title: '查看详情',
        }
      }
    },
    created: function () {
      this.getDepartmentData();
    },
    methods: {
      // 获取部门树
      getDepartmentData () {
        var _this = this;
        ezjsUtil.request(apiConstants.company_department_tree,{
         
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.searchData.departmentCode = data[0].code;
            _this.tableDataRefresh();
          }
        )
      },
      // 获取table数据
      tableDataRefresh () {
        var _this = this;
        ezjsUtil.request(apiConstants.company_staff_list,_this.searchData,
          function (err, data) {
            if (err) {
              return;
            }
            console.log(data);
            _this.tableData.data = data.listInfo;
            _this.tableData.flipInfo.totalCount = data.flipInfo.totalCount;
            _this.tableData.flipInfo.pageSize = data.flipInfo.pageSize;
            _this.tableData.flipInfo.pageNo = data.flipInfo.pageNo;
          }
        )
      },
      // 翻页
      changePage (page) {
        this.searchData.pageNo = page;
        this.tableDataRefresh();
      },
      // 查看详情
      showDetail (index) {
        var _this = this, _index = index;
        _this.detailData.detailObj.name = _this.tableData.data[_index].name;
        _this.detailData.detailObj.num = _this.tableData.data[_index].num;
        switch (_this.tableData.data[_index].sex) {
          case 1:
            _this.detailData.detailObj.sex = '男';
            break;
          case 0:
            _this.detailData.detailObj.sex = '女';
            break;
        }
        _this.detailData.visible = true;
      },
    }
  }
</script>
