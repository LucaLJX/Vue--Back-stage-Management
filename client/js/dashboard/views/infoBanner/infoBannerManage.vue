<style lang="less" scoped>
  .modal-form-img {
    max-width: 150px;
  }
  .modal-form-btn {
    margin-left: 30px;
  }
  .float-right {
    float: right;
  }
  // modal - 关联
  .relate-container .relate-left-container {
    border: 1px solid #d3d8e0;
  }
  .relate-container .relate-left-container .relate-tree-title {
    border-bottom: 1px solid #d3d8e0;
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .relate-container .relate-left-container .relate-tree-body {
    padding-left: 8px;
    padding-bottom: 60px;
    max-height: 600px;
    overflow: auto;
  }
  .relate-container .relate-right-container {
    padding-left: 15px;
  }
  .relate-container .relate-right-container .relate-right-table-container {
    margin-top: 15px;
  }
  .relate-container .relate-right-container .relate-right-table-container .relate-right-page-container {
    margin-top: 10px;
    height: 24px;
  }
  .relate-container .relate-right-container .relate-right-table-container .relate-right-page-container .relate-right-page {
    float: right;
  }
  .relate-container .relate-right-container .relate-right-table-container .relate-right-page-container p {
    display: block;
    float: right;
    line-height: 24px;
  }
</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <!-- <div class="common-top-right">
        <Button class="common-right-btn" type="primary" size="small" @click="modelFormEdit(-1)" icon="ios-personadd-outline">新增讲师
        </Button>
      </div> -->
    </div>

    <!-- tb-container -->
    <div class="tb-container">

      <!-- tb-container-top -->
      <Input class="common-default-size common-left-btn" size="small" v-model="searchData.title" placeholder="标题查询(模糊查询)" style="width: 150px;"></Input>
      <Select v-model="searchData.type" size="small" placeholder="文件类型" class="common-short-size common-left-btn" clearable style="width: 100px;">
        <Option v-for="item in dict.documentsTypes" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</Option>
      </Select>
      <Button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh" icon="ios-search">
        搜索
      </Button>

      <Button class="common-right-btn float-right" size="small" type="primary" @click="showRelateModal">
        关联素材
      </Button>
      <Button class="common-right-btn float-right" size="small" type="primary" @click="tableDataRemove(-1)">
        批量删除
      </Button>
      <!-- tb-container-table -->
       <div class="z-table-container">
        <Table class="z-table" border :content="tableData.self" :columns="tableData.columns" :data="tableData.data" stripe ellipsis @on-selection-change="changeTableNodes"></Table>
      </div>
      <div class="z-flip-container">
        <div class="z-flip-page">
          <Page class="z-leader-manage-page" :current="tableData.flipInfo.pageNo" :total="tableData.flipInfo.totalCount" simple @on-change="changePage"></Page>
        </div>
        <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
      </div> 

    </div>

    <!-- modal -->
    
    <!-- 素材关联 -->
    <!--弹出框--添加关联-->
    <Modal v-model="relateModal" title="关联素材" width="1080" @on-ok="tableDataRefresh" @on-cancel="tableDataRefresh" :mask-closable="false">
      <Row class="relate-container">
        <Col span="5" class="relate-left-container">
          <div class="relate-tree-title">
            素材库
          </div>
          <div class="relate-tree-body">
            <h3>全部素材</h3>
            <Ezjs-Tree ref="tree4Documents" @on-select-change="treeNodeSelectHandler" :data="relateTreeData"></Ezjs-Tree>
          </div>
        </Col>
        <Col span="19" class="relate-right-container">
          <div class="relate-right-btn-container">
            <Input class="common-left-btn" v-model="relateSearchObj.title" size="small" placeholder="请输入标题进行查询" style="width: 150px"></Input>
            <Select v-model="relateSearchObj.type" size="small" placeholder="文件类型" class="common-short-size common-left-btn" clearable>
              <Option v-for="item in dict.documentsTypes" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</Option>
            </Select>
            <Button class="common-left-btn" size="small" type="ghost" icon="ios-search" @click="relateTableDataRefresh">查询</Button>
            <Button class="common-left-btn float-right" size="small" type="ghost" @click="relateDocument(-1)">批量添加</Button>
          </div>
          <div class="relate-right-table-container">
            <Table stripe border 
            :columns="relateTableData.columns" :data="relateTableData.data" @on-selection-change="relateTableDataSelect"
            ></Table>
            <div class="relate-right-page-container">
              <Page class="relate-right-page" :current="relateTableData.flipInfo.pageNo" :total="relateTableData.flipInfo.totalCount" simple @on-change="relateChangePage"></Page>
              <p>共{{ relateTableData.flipInfo.totalCount }}条记录</p>
            </div>
          </div>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
    <!-- 弹出框-查看 -->
    <Modal v-model="detailModal" :title="detailObj.type == 1 ? '文本详情' : '视频详情'" :closable="false" :mask-closable="false">
      <Form label-position="right" :label-width="80">
        <Form-item label="标题：">
          <p>{{ detailObj.title }}</p>
        </Form-item>
        <Form-item label="描述：">
          <p>{{ detailObj.description }}</p>
        </Form-item>
        <Form-item label="创建时间：">
          <p>{{ fmtFullTime(detailObj.createTime) }}</p>
        </Form-item>
        <Form-item label="资料类型：">
          <p class="modal-form-item-p">{{ detailObj.type == 1 ? '文本' : '视频' }}
            <Button class="modal-form-btn" type="ghost" size="small" @click="showPreview">预览</Button>
          </p>
        </Form-item>
        <Form-item label="资源标识：">
          <p>{{ detailObj.path }}
          </p>
        </Form-item>
        <Form-item label="缩略图：">
          <img class="modal-form-img" :src="fmtImgUrl(detailObj.thumbnail)">
        </Form-item>
      </Form>
    </Modal>
    <!-- 视频预览 -->
    <Modal v-model="myVideoModal" :mask-closable="false" :closable="false" width="700" style="z-index: 10000">
      <commonVideo v-if="createVideo" :commonSrc="commonSrc" :commonPic="commonPic"></commonVideo>
      <div slot="footer">
        <Button type="ghost" @click="closePreview">关闭</Button>
      </div>
    </Modal>
    <!-- 弹出框--修改优先级 -->
    <Modal
      :title="sortNumData.title"
      v-model="sortNumData.visible"
      :mask-closable="false"
      :closable="false"
    >
      <Form :label-width="100" class="z-form" :model="sortNumData.editObj" :rules="sortNumData.formRules" ref="sortNumObj">
        <Form-item label="设置优先级" prop="sortNum">
          <Input v-model="sortNumData.editObj.sortNum" placeholder="请输入优先级" style="width: 120px;"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="editSortNum_cancel('sortNumObj')">取消</Button>
        <Button type="primary" :loading="sortNumData.loading" @click="editSortNum_ok('sortNumObj')">确定</Button>
      </div>
    </Modal>
  </div>
</template>


<script>

  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  import EzjsTree from '../../../../assets/libs/ezjs/iview_custom/components/tree/index';
  import commonVideo from '../../components/video';

  export default {
    components: { EzjsTree,commonVideo },
    data () {
      return {
        dict: dict,

        pageData: {
          title: '焦点图管理',
          link: '/infoBannerManage'
        },
        // 根节点数据
        moduleData: {
          id: null,
          code: null,
          title: ''
        },
        // searchData
        searchData: {
          pageNo: 1,
          title: '',
          type: null,
          moduleId: null
        },
        // tableData
        tableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageNo: 1,
            pageSize: 1
          },
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '标题',
              key: 'title',
              align: 'center'
            },
            {
              title: '描述',
              key: 'description',
              align: 'center'
            },
            {
              title: '缩略图',
              key: 'thumbnail',
              width: 150,
              render: (h, params) => {
                var url = params.row.thumbnail;
                if (url == null) {
                  url = params.row.type == 1 ? '/images/thumbnail/thumbnail-pdf.jpg' : '/images/thumbnail/thumbnail-video.jpg';
                } else {
                  url = ezjsUtil.nfsUtil.getFileUrl(url)
                }
                return h('img', {
                  attrs: {
                    src: url
                  },
                  style: {
                    maxWidth: '110px',
                    display: 'block',
                    margin: '6px auto'
                  },
                });
              }
            },
            {
              title: '类型',
              key: 'type',
              align: 'center',
              render: (h, params) => {
                var type = params.row.type;
                switch (type) {
                  case 1:
                    return h('div', '文本');
                    break;
                  case 8:
                    return h('div', '视频');
                    break;
                }
              }
            },
            {
              title: '创建时间',
              key: 'createTime',
              align: 'center',
              width: 130,
              render: (h, params) => {
                var createTime = params.row.createTime;
                return h('div', this.fmtFullTime(createTime));
              }
            },
            {
              title: '优先级',
              key: 'sortNum',
              align: 'center',
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.index);
                      }
                    }
                  }, '查看'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editSortNum(params.index);
                      }
                    }
                  }, '修改优先级'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.tableDataRemove(params.index);
                      }
                    }
                  }, '删除'),
                ]);
              }
            }
          ]
        },
        // detail
        detailModal: false,
        detailObj: {},
        // 删除
        removeData: {
          ids: null,
          length: 0,
        },
        // 视频预览
        myVideoModal: false,
        createVideo: false,
        commonSrc: '',
        commonPic: '',
        // 关联素材
        relateModal: false,
        relateSearchObj: {
          docTreeCode: '',
          title: '',
          type: '',
          moduleId: null,
          pageNo: 1
        },
        relateSelectedNode: {
          id: '',
          code: '',
          title: ''
        },
        relateDocumentIds: '',
        relateDocumentIdsLength: 0,
        relateTreeData: [],
        relateTableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageNo: 1,
            pageSize: 10,
          },
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '标题',
              key: 'title',
              align: 'center'
            },
            {
              title: '描述',
              key: 'description',
              align: 'center'
            },
            {
              title: '缩略图',
              key: 'thumbnail',
              width: 150,
              render: (h, params) => {
                var url = params.row.thumbnail;
                if (url == null) {
                  url = params.row.type == 1 ? '/images/thumbnail/thumbnail-pdf.jpg' : '/images/thumbnail/thumbnail-video.jpg';
                } else {
                  url = ezjsUtil.nfsUtil.getFileUrl(url)
                }
                return h('img', {
                  attrs: {
                    src: url
                  },
                  style: {
                    maxWidth: '110px',
                    display: 'block',
                    margin: '6px auto'
                  },
                });
              }
            },
            {
              title: '类型',
              key: 'type',
              align: 'center',
              render: (h, params) => {
                var type = params.row.type;
                switch (type) {
                  case 1:
                    return h('div', '文本');
                    break;
                  case 8:
                    return h('div', '视频');
                    break;
                }
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 120,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style : {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.relateShowDetail(params.index);
                      }
                    }
                  }, '查看'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.relateDocument(params.index);
                      }
                    }
                  }, '添加'),
                ]);
              }
            }
          ]
        },
        // sortNum 
        sortNumData: {
          title: '修改优先级',
          visible: false,
          loading: false,
          editObj: {
            moduleHasDocumentationId: null,
            sortNum: 0,
          },
          formRules: {
            sortNum: [
              { required: true, message: '请输入优先级', trigger: 'blur' },
              { pattern:  /^[1-9]\d{0,5}$/, message: '优先级必须为首位不为0且不超过100000的正整数', trigger: 'blur' },
            ],
          }
        },
      }
    },
    created: function () {
      this.getModuleData();
    },
    methods: {
      // 转换图片路径 token-->url
      fmtImgUrl (token) {
        var _this = this, url = '';
        if (token != null && token != '') {
          url = ezjsUtil.nfsUtil.getFileUrl(token);
        } else {
          if (_this.detailObj.type == 1) {
            url = '/images/thumbnail/thumbnail-pdf.jpg';
          } else if (_this.detailObj.type == 8) {
            url = '/images/thumbnail/thumbnail-video.jpg';
          }
        }
        return url;
      },
      // 转换文件路径
      fmtFilePath (token) {
        var _this = this, url = '';
        url = ezjsUtil.nfsUtil.getFileUrl(token);
        return url;
      },
      // 转换时间格式
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
      // 获取根节点数据
      getModuleData () {
        var _this = this;
        ezjsUtil.request(apiConstants.documentInModule_getCoModuleByType,{
          type: 21
        },
          function (err, data) {
            if (err) {
              return;
            }
            console.log('课程数据是');
            console.log(data);
            _this.moduleData.title = data[0].title;
            _this.moduleData.code = data[0].code;
            _this.moduleData.id = data[0].id;
            _this.searchData.moduleId = data[0].id;
            _this.tableDataRefresh();
          }
        );
      },
      // 获取table数据
      tableDataRefresh () {
        var _this = this;
        ezjsUtil.request(apiConstants.documentRefModule_flipDocInModule,_this.searchData,
          function (err, data) {
            if (err) {
              return;
            }
            console.log('模块table数据');
            console.log(data);
            _this.tableData.data = data.listInfo;
            _this.tableData.flipInfo.totalCount = data.flipInfo.totalCount;
            _this.tableData.flipInfo.pageNo = data.flipInfo.pageNo;
            _this.tableData.flipInfo.pageSize = data.flipInfo.pageSize;
          }
        );
      },
      // 翻页
      changePage (page) {
        this.searchData.pageNo = page;
        this.tableDataRefresh();
      },
      // 查看详情
      showDetail (index) {
        var _this = this, _index = index;
        console.log(_this.tableData.data[_index]);
        ezjsUtil.request(apiConstants.co_documentation_detail, 
        {
          _id: _this.tableData.data[_index].docId
        },
          function (err, data) {
            if (err) {
              return;
            }
            console.log(data);
            _this.detailObj = data;
          }
        )
        _this.detailModal = true;
      },
      // 删除--选择
      changeTableNodes (nodes) {
        var _this = this;
        console.log(nodes);
        _this.removeData.length = nodes.length;
        var removeIdsArr = [];
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          removeIdsArr.push(node.mhdId);
        }
        _this.removeData.ids = removeIdsArr.join(',');
      },
      // 删除
      tableDataRemove (index) {
        var _this = this, _index = index, msg = '';

        function remove (documentIds) {
          ezjsUtil.request(apiConstants.documentInModule_removeDocFromModuleByMhdIds, 
          {
            moduleHasDocumentationIds: documentIds,
            moduleId: _this.moduleData.id
          },
            function (err, data) {
              if (err) {
                return;
              }
              _this.$Message.success('删除成功！');
              _this.tableDataRefresh();
            }
          )
        }
        if (_index == -1) {
          // 批量
          msg = '批量删除';
          _this.$Modal.confirm({
            title: msg,
            content: '<p>是否' + msg + _this.removeData.length + '个素材？</p>',
            onOk: () => {
              remove(_this.removeData.ids);
            },
            onCancel: () => {
              _this.$Message.info('取消操作！');
            }
          });
        } else {
          // 单个
          msg = '确认删除';
          _this.$Modal.confirm({
            title: msg,
            content: '<p>是否' + msg + '素材' + _this.tableData.data[_index].title + '？</p>',
            onOk: () => {
              remove(_this.tableData.data[_index].mhdId);
            },
            onCancel: () => {
              _this.$Message.info('取消操作！');
            }
          });
        }
      },
      // sortNum--show
      editSortNum (index) {
        var _this = this, _index = index;
        _this.sortNumData.editObj.moduleHasDocumentationId = _this.tableData.data[_index].mhdId;
        _this.sortNumData.editObj.sortNum =_this.tableData.data[_index].sortNum;
        _this.sortNumData.visible = true;
      },
      editSortNum_ok (name) {
        var _this = this;
        _this.$refs[name].validate(function (valid) {
          if (valid) {
            _this.sortNumData.loading = true;
            ezjsUtil.request(apiConstants.documentRefModule_updateSortNum, _this.sortNumData.editObj,
              function (err, data) {
                if (err) {
                  _this.sortNumData.loading = false;
                  return;
                }
                _this.$Message.success("修改优先级成功！");
                _this.tableDataRefresh();
                _this.sortNumData.visible = false;
                _this.$refs[name].resetFields();
                _this.sortNumData.loading = false;
                _this.sortNumData.editObj = {
                  moduleHasDocumentationId: null,
                  sortNum: 0,
                };
              }
            )
          } else {
            _this.sortNumData.loading = false;
            _this.$Message.error('表单验证失败!');
          }
        });
      },
      // sortNum--edit_cancel
      editSortNum_cancel (name) {
        this.sortNumData.editObj = {
          moduleHasDocumentationId: null,
          sortNum: 0,
        };
        this.sortNumData.loading = false;
        this.sortNumData.visible = false;
      },
      // 预览
      showPreview () {
        var _this = this;
        _this.commonSrc = _this.fmtFilePath(_this.detailObj.path);
        _this.commonPic = _this.fmtImgUrl(_this.detailObj.thumbnail);
        if (_this.detailObj.type == 1) {
          // 文本
          window.open(_this.commonSrc);
        } else if (_this.detailObj.type == 8) {
          _this.myVideoModal = true;
          _this.createVideo = true;
        }
      },
      // 关闭预览
      closePreview() {
        var _this = this;
        if (_this.showPreviewType == 1) {
          // 是pdf
        } else if (_this.detailObj.type == 8) {
          // 是video
          _this.myVideoModal = false;
          _this.createVideo = false;
        }
      },
      // 关联素材-------------------------------------------------------------
      // 关联素材--弹出弹出框
      showRelateModal () {
        var _this = this;
        _this.relateSearchObj.docTreeCode = null;
        _this.relateSearchObj.title = '';
        _this.relateSearchObj.type = '';
        _this.relateSearchObj.pageNo = 1;
        _this.relateSearchObj.moduleId = _this.moduleData.id;
        _this.relateModal = true;
        _this.relateTreeDataRefresh();
      },
      // 获取树的数据
      relateTreeDataRefresh() {
        var _this = this;
        ezjsUtil.request(apiConstants.co_docTree_getTreeList,
          {
            dataType: 'tree'
          },
          function (err, data) {
            if (err) {
              return;
            }
            _this.relateTreeData = data;
            
            //重构treeData，默认选中第一级节点 
            function formatTreeData(arr, depth) {
              var newTree = [];
              for (var i = 0; i < arr.length; i++) {
                var node = arr[i];
                if (i == 0) {
                  if (node.children != null) {
                    newTree.push({
                      title: node.title,
                      fullTitle: node.fullTitle,
                      parentId: node.parentId,
                      children: formatTreeData(node.children, depth + 1),
                      expand: false, 
                      selected: depth == 0, //默认选中根节点
                      id: node.id,
                      depth: depth,
                      code: node.code,
                    })
                  } else {
                    newTree.push({
                      title: node.title,
                      fullTitle: node.fullTitle,
                      parentId: node.parentId,
                      expand: false, 
                      id: node.id,
                      selected: depth == 0, //默认选中根节点
                      depth: depth,
                      code: node.code,
                    })
                  }
                } else {
                  if (node.children != null) {
                    newTree.push({
                      title: node.title,
                      fullTitle: node.fullTitle,
                      parentId: node.parentId,
                      children: formatTreeData(node.children, depth + 1),
                      expand: false, //如果不是第一个树节点，则不展开
                      selected: false,
                      id: node.id,
                      depth: depth,
                      code: node.code,
                    })
                  } else {
                    newTree.push({
                      title: node.title,
                      fullTitle: node.fullTitle,
                      parentId: node.parentId,
                      expand: false, //如果不是第一个树节点，则不展开
                      selected: false,
                      id: node.id,
                      depth: depth,
                      code: node.code,
                    })
                  }
                }
              }
              return newTree;
            } 

            _this.relateTreeData = formatTreeData(_this.relateTreeData, 0);
            //默认选中第一个根节点
            var defaultSelectedNodeId =  _this.relateTreeData[0].id;
            _this.$nextTick(() => {
              // 调用方法，展开选中的节点
              _this.$refs.tree4Documents.setSelectedNodeWithExpand(defaultSelectedNodeId);
            });
          }
        )
      },
      // 关联素材--选中树节点
      treeNodeSelectHandler (node) {
        var _this = this, model = node[0];
        if (!model) {
          // 如果没有选中节点（不可能的情况）
          return;
        }
        _this.clearRelateSearchObj(); //清空关联素材搜索条件
        _this.updateSelectedNode(model); //保存选中的节点数据
        _this.relateTableDataRefresh (); //获取table数据
      },
      // 关联素材--保存选中的节点数据
      updateSelectedNode (model) {
        var _this = this;
        _this.relateSelectedNode.id = model.id;
        _this.relateSelectedNode.title = model.title;
        _this.relateSelectedNode.code = model.code;
      },
      // 关联素材--清空搜索条件
      clearRelateSearchObj () {
        this.relateSearchObj = {
          docTreeCode: '',
          title: '',
          type: '',
          moduleId: this.moduleData.id,
          pageNo: 1
        }
      },
      // 关联素材--获取table数据
      relateTableDataRefresh () {
        var _this = this;
        _this.relateSearchObj.docTreeCode = _this.relateSelectedNode.code;
        ezjsUtil.request(apiConstants.documentRefModule_flipByCoDocTreeCodeNotSelect,_this.relateSearchObj,
          function (err, data) {
            if (err) {
              return;
            }
            _this.relateTableData.data = data.listInfo;
            _this.relateTableData.flipInfo.totalCount = data.flipInfo.totalCount;
            _this.relateTableData.flipInfo.pageNo = data.flipInfo.pageNo;
            _this.relateTableData.flipInfo.pageSize = data.flipInfo.pageSize;
          }
        )
      },
      // 关联素材--翻页
      relateChangePage (page) {
        this.relateSearchObj.pageNo = page;
        this.relateTableDataRefresh();
      },
      // 关联素材--勾选
      relateTableDataSelect (nodes) {
        var _this = this, documentsArr = [];
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          documentsArr.push(node.id);
        }
        _this.relateDocumentIds = documentsArr.join(',');
        _this.relateDocumentIdsLength = nodes.length;
      },
      // 关联素材
      relateDocument (index) {
        var _this = this, msg = '', _index = index;
        // 添加的方法
        function relate_ok (documentIds, moduleId) {
          ezjsUtil.request(apiConstants.documentInModule_addDoc2Module,
          {
            documentationIds: documentIds,
            coModuleId: moduleId
          },
            function (err, data) {
              if (err) {
                return;
              }
              _this.$Message.success('添加成功！');
              _this.relateTableDataRefresh();
            }
          )
        }

        if (_index == -1) {
          // 批量
          if (_this.relateDocumentIdsLength == 0) {
            _this.$Modal.warning({
              title: '添加失败',
              content: '请至少选中一个素材，再进行添加'
            });
          } else {
            msg = '批量添加';
            _this.$Modal.confirm({
              title: msg,
              content: '<p>是否确认' + msg + _this.relateDocumentIdsLength + '个素材到课程' + _this.moduleData.title + '？</p>',
              onOk: () => {
                relate_ok(_this.relateDocumentIds, _this.moduleData.id);
              },
              onCancel: () => {
                _this.$Message.info('取消操作！');
              }
            });
          }
        } else {
          // 单个
          msg = '确认添加';
          _this.$Modal.confirm({
            title: msg,
            content: '<p>是否' + msg + '素材' + _this.relateTableData.data[_index].title + '到课程' + _this.moduleData.title + '？</p>',
            onOk: () => {
              relate_ok(_this.relateTableData.data[_index].id, _this.moduleData.id);
            },
            onCancel: () => {
              _this.$Message.info('取消操作！');
            }
          });
        }
      },
      // 关联素材--查看素材
      relateShowDetail (index) {
        var _this = this, _index = index;
        ezjsUtil.request(apiConstants.co_documentation_detail, 
        {
          _id: _this.relateTableData.data[_index].id
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.detailObj = data;
          }
        )
        _this.detailModal = true;
      },
    }
  }
</script>
