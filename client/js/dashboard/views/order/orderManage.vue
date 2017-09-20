<style lang="less" scoped>
  .modal-form-img {
    max-width: 100px;
  }
  // cr-right-middle
  .float-left {
    display: block;
    float: left;
  }
  .cr-right-middle-p {
    height: 24px;
    line-height: 24px;
  }
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
      <Input class="common-default-size common-left-btn float-left" size="small" v-model="searchData.orderNum" placeholder="订单编号查询" style="width: 120px;"></Input>
      <Select v-model="searchData.orderStateCode" size="small" placeholder="订单状态" class="common-short-size common-left-btn float-left" clearable style="width: 100px;">
        <Option v-for="item in dict.orderStates" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</Option>
      </Select>
      <!-- 时间区间 -->
      <p class="float-left cr-right-middle-p" style="margin-left: 10px;">时间区间：</p>
      <DatePicker class="common-left-btn float-left" type="date" size="small" placeholder="选择开始时间" style="width: 120px" v-model="searchData.begin" format="yyyy-MM-dd"></DatePicker>
      <p class="float-left cr-right-middle-p" style="margin-right: 6px;">--</p>
      <DatePicker class="common-left-btn float-left" type="date" size="small" placeholder="选择结束时间" style="width: 120px" v-model="searchData.end" format="yyyy-MM-dd"></DatePicker>
      <!-- 价格区间 -->
      <p class="float-left cr-right-middle-p" style="margin-left: 10px;">价格区间(单位:元)：</p>
      <Input-number class="common-left-btn float-left" size="small" :max="searchData.maxPrice" :min="1" v-model="searchData.minPrice"></Input-number>
      <p class="float-left cr-right-middle-p" style="margin-right: 6px;">~</p>
      <Input-number class="common-left-btn float-left" size="small" :max="10000" :min="searchData.minPrice" v-model="searchData.maxPrice"></Input-number>

      <Button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh" icon="ios-search">
        搜索
      </Button>

      <!-- tb-container-table -->
      <div class="z-table-container">
        <Table class="z-table" border :content="tableData.self" :columns="tableData.columns" :data="tableData.data" stripe ellipsis></Table>
      </div>
      <div class="z-flip-container">
        <div class="z-flip-page">
          <Page class="z-leader-manage-page" :current="tableData.flipInfo.pageNo" :total="tableData.flipInfo.totalCount" simple @on-change="changePage"></Page>
        </div>
        <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
      </div>

    </div>

    <!-- modal -->
    <!-- 详情modal -->
    <Modal v-model="detailData.visible" :title="detailData.title" :closable="false" :mask-closable="false" @on-ok="closeDetail" @on-cancel="closeDetail" width="800">
      <Form label-position="right" :label-width="80">
        <Form-item label="订单编号">
          <p>{{ detailData.detailObj.orderNum }}</p>
        </Form-item>
        <Form-item label="订单状态">
          <p>{{ detailData.detailObj.state | orderStateFilter }}</p>
        </Form-item>
        <Form-item label="创建时间">
          <p>{{ fmtFullTime(detailData.detailObj.createTime) }}</p>
        </Form-item>
        </Form-item>
        <Form-item label="订单总价">
          <p>{{ detailData.detailObj.totalPrice }}元</p>
        </Form-item>
        <Form-item label="商品列表">
          <Table class="z-table" border :columns="detailData.detailColumns" :data="detailData.detailObj.orderItems" stripe ellipsis></Table>
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
          title: '订单管理',
          link: '/orderManage'
        },

        searchData: {
          orderNum: '', //订单编号
          orderStateCode: '', // 订单状态：0待付款，12订单完成，13订单取消，14，订单关闭
          begin: '', // 开始时间
          end: '', //结束时间
          minPrice: 1, //最低价格
          maxPrice: 10000, //最高价格
          pageNo: 1
        },

        tableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageNo: 1,
            pageSize: 0
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
              title: '订单编号',
              key: 'orderNum',
              align: 'center',
            },
            {
              title: '订单状态',
              key: 'state',
              width: 90,
              align: 'center',
              render: (h, params) => {
                var state = params.row.state;
                switch (state) {
                  case 0:
                    return h('div', '待付款');
                    break;
                  case 12:
                    return h('div', '订单完成');
                    break;
                  case 13:
                    return h('div', '订单取消');
                    break;
                  case 14:
                    return h('div', '订单关闭');
                    break;
                }
              }
            },
            {
              title: '订单时间',
              key: 'createTime',
              align: 'center',
              render: (h, params) => {
                var timeStr = params.row.createTime;
                if (!timeStr) {
                  return h('div', '未知');
                } else {
                  return h('div', this.fmtFullTime(timeStr));
                }
              }
            },
            {
              title: '订单总价',
              key: 'totalPrice',
              width: 100,
              align: 'center',
              render: (h, params) => {
                let _totalPrice = params.row.totalPrice / 100;
                return h('div', _totalPrice);
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
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.index);
                      }
                    }
                  }, '查看'),
                ]);
              },
            }
          ],
        },
        // detail
        detailData: {
          title: '查看详情',
          teacherId: null,
          detailObj: {},
          detailColumns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
            {
              title: '名称',
              key: 'goodsTitle',
              width: 150,
              align: 'center',
            },
            {
              title: '价格',
              key: 'goodsPrice',
              width: 150,
              align: 'center',
              render: (h, params) => {
                let _goodsPrice = params.row.goodsPrice / 100;
                return h('div', _goodsPrice);
              }
            },
            {
              title: '物流状态',
              key: 'trackNewestInfo',
              align: 'center',
              render: (h, params) => {
                var trackNewestInfo = params.row.trackNewestInfo;
                if (!trackNewestInfo) {
                  return h('div', '查询失败');
                } else {
                  return h('div', trackNewestInfo);
                }
              }
            },
            {
              title: '评价状态',
              key: 'commentState',
              width: 90,
              align: 'center',
              render: (h, params) => {
                var commentState = params.row.commentState;
                switch (commentState) {
                  case 0:
                    return h('div', '不可评价');
                    break;
                  case 1:
                    return h('div', '可评价');
                    break;
                  case 2:
                    return h('div', '已评价');
                    break;
                }
              }
            },
          ],
          visible: false,
        },
      }
    },
    filters: {
      orderStateFilter: function (value) {
        switch (value) {
          case 0:
            return '待付款';
            break;
          case 12:
            return '订单完成';
            break;
          case 13:
            return '订单取消';
            break;
          case 14:
            return '订单关闭';
            break;
        }
      },
    },
    created: function () {
      this.tableDataRefresh();
    },
    methods: {
      // 转换图片路径 token-->url
      fmtImgUrl (token) {
        var _this = this, url = '';
        if (token != null && token != '') {
          url = ezjsUtil.nfsUtil.getFileUrl(token);
        } else {
          url = '/images/thumbnail/thumbnail-img.jpg';
        }
        return url;
      },
      //转换日期格式
      fmtDate (timeStr) {
        var oldTimeStr = new Date(timeStr);
        var yearStr = oldTimeStr.getFullYear().toString();
        var monthStr = (oldTimeStr.getMonth() + 1).toString();
        if (monthStr.length == 1) {
          monthStr = '0' + monthStr;
        }
        var dateStr = oldTimeStr.getDate().toString();
        if (dateStr.length == 1) {
          dateStr = '0' + dateStr;
        }
        var newTimeStr = yearStr + '-' + monthStr + '-' + dateStr;
        return newTimeStr;
      },
      // 转换日期时间格式
      fmtFullTime (timeStr) {
        var oldTimeStr = new Date(timeStr);
        var yearStr = oldTimeStr.getFullYear().toString();
        var monthStr = (oldTimeStr.getMonth() + 1).toString();
        if (monthStr.length == 1) {
          monthStr = '0' + monthStr;
        }
        var dateStr = oldTimeStr.getDate().toString();
        if (dateStr.length == 1) {
          dateStr = '0' + dateStr;
        }
        var hourStr = oldTimeStr.getHours().toString();
        if (hourStr.length == 1) {
          hourStr = '0' + hourStr;
        }
        var minStr = oldTimeStr.getMinutes().toString();
        if (minStr.length == 1) {
          minStr = '0' + minStr;
        }
        var secStr = oldTimeStr.getSeconds().toString();
        if (secStr.length == 1) {
          secStr = '0' + secStr;
        }
        var newTimeStr = yearStr + '-' + monthStr + '-' + dateStr + ' ' + hourStr + ':' + minStr + ':' + secStr;
        return newTimeStr;
      },
      // 清空搜索条件
      clearSearchObj () {
        this.searchData.name = '';
        this.searchData.pageNo = 1;
      },
      // 获取table数据
      tableDataRefresh () {
        var _this = this;
        if (typeof(_this.searchData.begin) == 'object') {
          _this.searchData.begin = _this.fmtDate(_this.searchData.begin);
        }
        if (typeof(_this.searchData.end) == 'object') {
          _this.searchData.end = _this.fmtDate(_this.searchData.end);
        }
        ezjsUtil.request(apiConstants.ace_order_flip,{
          orderNum: _this.searchData.orderNum, //订单编号
          orderStateCode: _this.searchData.orderStateCode, // 订单状态：0待付款，12订单完成，13订单取消，14，订单关闭
          begin: _this.searchData.begin, // 开始时间
          end: _this.searchData.end, //结束时间
          minPrice: _this.searchData.minPrice * 100, //最低价格
          maxPrice: _this.searchData.maxPrice * 100, //最高价格
          pageNo: _this.searchData.pageNo,
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.tableData.data = data.listInfo;
            _this.tableData.flipInfo.totalCount = data.flipInfo.totalCount;
            _this.tableData.flipInfo.pageNo = data.flipInfo.pageNo;
            _this.tableData.flipInfo.pageSize = data.flipInfo.pageSize;
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
        _this.detailData.detailObj = _this.tableData.data[_index];
        _this.detailData.visible = true;
      },
      // 关闭详情
      closeDetail () {
        this.detailData.detailObj = {};
        this.detailData.visible = false;
      },
    }
  }
</script>
