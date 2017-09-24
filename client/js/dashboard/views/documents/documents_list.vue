<style lang="less" scoped>
  .float-right {
    float: right;
  }
  // modal - 详情
  .modal-form-item-p .modal-form-item-btn {
    margin-left: 30px;
  }
  .modal-form-img {
    max-width: 150px;
  }
</style>


<template>
  <div>
    <!-- cr-right-middle -->
    <div class="cr-right-middle">
      <Input class="common-short-size common-left-btn" size="small" v-model="searchData.title" placeholder="标题"></Input>
      <Select v-model="searchData.type" size="small" placeholder="文件类型" class="common-short-size common-left-btn" clearable>
        <Option v-for="item in dict.documentsTypes" v-model="item.dictKey" :key="item.dictKey">{{ item.dictVal }}</Option>
      </Select>
      
      <Button class="common-left-btn" size="small" type="primary" @click="tableDataRefresh" icon="ios-search">
        搜索
      </Button>
      
      
      <Button class="common-right-btn float-right" size="small" type="primary" @click="editFile(-1)" v-show="selectedNodeLevel == 3">
        新增文件
      </Button>
    </div>

    <!-- cr-import-0 页面内table的区域 -->
    <div class="z-table-container">
      <Table class="z-table" border :columns="tableData.columns"
      :data="tableData.data" stripe></Table>
    </div>

    <!-- cr-right-bottom -->
    <div class="z-flip-container">
      <div class="z-flip-page">
        <Page class="z-leader-manage-page" :current="tableData.flipInfo.pageNo"
        :total="tableData.flipInfo.totalCount" @on-change="tableChangePage"
        simple></Page>
      </div>
      <p class="z-flip-text">共{{tableData.flipInfo.totalCount}}条</p>
    </div>

    <!-- modal -->
    <!--弹出框--添加文件-->
    <Modal v-model="editModal" :title="editModalTitle" :closable="false" :mask-closable="false">
      <Form label-position="right" :label-width="80" :model="editObj" :rules="formRules" ref="editObj">
        <Form-item label="标题" prop="title">
          <Input v-model="editObj.title" placeholder="请输入标题..." @on-change="edit_title"></Input>
        </Form-item>
        <Form-item label="描述" prop="description">
          <Input v-model="editObj.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述..." @on-change="edit_description"></Input>
        </Form-item>
        <Form-item label="缩略图">
          <img class="modal-form-img" :src="fmtImgUrl(editObj.thumbnail)">
          <p>推荐尺寸：1.首页焦点图素材封面：750像素*330像素</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.课程视频素材封面：750像素*412像素</p>
          <Upload :action="$nfs.uploadUrl" :data="$nfs.types.documents" :on-success="uploadImgSuccess" :on-progress="disableConfirm" :multiple="false" :default-file-list="imgUploadList" :on-error="handleError" accept="image/gif, image/jpeg, image/png, image/bmp" :format="['jpg','jpeg','png','bmp']">
            <Button type="ghost" icon="ios-cloud-upload-outline">直接上传</Button>
          </Upload>
          <!-- <Button type="ghost" icon="ios-crop" @click="showCropper">裁剪上传</Button> -->
        </Form-item>
        <Form-item label="文件类型" v-show="isEdit == false">
          <RadioGroup v-model="editObj.type" @on-change="edit_type">
            <Radio label="1">文本</Radio>
            <Radio label="8">视频</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="文件类型" v-show="isEdit == true">
          <p>{{ editObj.type == 1 ? '文本' : '视频' }}</p>
        </Form-item>
        <Form-item label="文本类型" prop="path" v-if="editObj.type == 1">
          <Tabs size="small" type="card"  @on-click="tabClick" v-model="tabValue">
            <Tab-pane label="pdf文件" name="tabUpload">
              <Upload :action="$nfs.uploadUrl" :data="$nfs.types.documents" accept="application/pdf" ref="uploadFile" :on-progress="disableConfirm" :on-error="handleError" :on-remove="removeUploadList" :default-file-list="uploadList" :format="['pdf']" :on-success="uploadFileSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文本</Button>
              </Upload>
            </Tab-pane>
            <Tab-pane label="网页链接" name="tabLink">
              <Input v-model="editObj.path" placeholder="请输入网页链接..." @on-change="edit_path"></Input>
            </Tab-pane>
            <Tab-pane label="资源标识" name="tabToken">
              <Input v-model="editObj.path" placeholder="请输入已有文本资源标识..." @on-change="edit_path"></Input>
            </Tab-pane>
            <Tab-pane label="HTML代码" name="tabHtml">
              <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="editObj.content" placeholder="请输入html代码..." @on-change="edit_content"></Input>
              <p>推荐使用<a href="http://ipaiban.com/" target="_blank">“i排版”</a></p>
            </Tab-pane>
          </Tabs>
        </Form-item>
        <Form-item label="视频类型" prop="path" v-if="editObj.type == 8">
          <Tabs size="small" type="card"  @on-click="tabClick" v-model="tabValue">
            <Tab-pane label="视频文件" name="tabUpload">
              <Upload :action="$nfs.uploadUrl" :data="$nfs.types.documents" ref="uploadFile" accept="video/mp4" :default-file-list="uploadList" :on-progress="disableConfirm" :on-error="handleError" :on-remove="removeUploadList" :format="['mp4']" :on-success="uploadFileSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传视频</Button>
            </Upload>
            </Tab-pane>
            <Tab-pane label="视频链接" name="tabLink">
              <Row>
                <Col span="4">
                  视频链接
                </Col>
                <Col span="20">
                  <Input v-model="editObj.path" placeholder="请输入视频链接..." @on-change="edit_path"></Input>
                </Col>
              </Row>
              <Row style="margin-top: 10px;">
                <Col span="4">
                  视频时长
                </Col>
                <Col span="5">
                  <InputNumber :max="7200" :min="0" v-model="editObj.videoDuration" @on-change="edit_videoDuration"></InputNumber>
                </Col>
                <Col span="5">
                  秒
                </Col>
              </Row>
            </Tab-pane>
            <Tab-pane label="资源标识" name="tabToken">
              <Row>
                <Col span="4">
                  资源标识
                </Col>
                <Col span="20">
                  <Input v-model="editObj.path" placeholder="请输入已有视频资源标识..." @on-change="edit_path"></Input>
                </Col>
              </Row>
              <Row style="margin-top: 10px;">
                <Col span="4">
                  视频时长
                </Col>
                <Col span="5">
                  <InputNumber :max="7200" :min="0" v-model="editObj.videoDuration" @on-change="edit_videoDuration"></InputNumber>
                </Col>
                <Col span="5">
                  秒
                </Col>
              </Row>
            </Tab-pane>
          </Tabs>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="edit_cancel('editObj')">取消</Button>
        <Button type="primary" :loading="editModal_loading" @click="edit_ok('editObj')">确定</Button>
      </div>
    </Modal> 
    <!-- 弹出框--修改优先级 -- 文件 -->
    <Modal
      :title="fileSortNum.title"
      v-model="fileSortNum.visible"
      :mask-closable="false"
      :closable="false"
    >
      <Form :label-width="100" class="z-form" :model="fileSortNum.editObj" :rules="fileSortNum.formRules" ref="sortNumObj">
        <Form-item label="设置优先级"  prop="sortNum">
          <Input v-model="fileSortNum.editObj.sortNum" placeholder="请输入优先级" style="width: 120px;"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="editSortNum_cancel('sortNumObj')">取消</Button>
        <Button type="primary" :loading="fileSortNum.loading" @click="editSortNum_ok('sortNumObj')">确定</Button>
      </div>
    </Modal>

    <!-- 弹出框-查看 -->
    <Modal v-model="detailModal" :title="detailObj.type == 1 ? '文本详情' : '视频详情'" :closable="false" :mask-closable="false">
      <Form label-position="right" :label-width="80">
        <Form-item label="标题：">
          <p>{{ detailObj.title }}</p>
        </Form-item>
        <Form-item label="描述：">
          <p v-show="detailObj.description">{{ detailObj.description }}</p>
          <p v-show="!detailObj.description">无</p>
        </Form-item>
        <Form-item label="创建时间">
          <p>{{  fmtFullTime(detailObj.createTime) }}</p>
        </Form-item>
        <Form-item label="资料类型：">
          <p class="modal-form-item-p">{{ detailObj.type == 1 ? '文本' : '视频' }}
            <Button class="modal-form-item-btn" type="ghost" size="small" @click="showPreview">预览</Button>
          </p>
        </Form-item>
        <Form-item label="视频时长：" v-show="detailObj.type == 8">
          <p>{{ videoTime }}</p>
        </Form-item>
        <Form-item label="资源标识：">
          <p>{{ detailObj.path }}
          </p>
        </Form-item>
        <Form-item label="缩略图：">
          <img class="modal-form-img" :src="fmtDetailImgUrl(detailObj.thumbnail)">
        </Form-item>
      </Form>
    </Modal>

    <!-- 视频预览 -->
    <Modal v-model="myVideoModal" :mask-closable="false" :closable="false" width="700">
      <commonVideo v-if="createVideo" :commonSrc="commonSrc" :commonPic="commonPic"></commonVideo>
      <div slot="footer">
        <Button type="ghost" @click="closePreview">关闭</Button>
      </div>
    </Modal>

    <!-- 关联题库  -->
    <Modal v-model="relateQuestionData.visible" :title="relateQuestionData.title" :closable="false" :mask-closable="false" @on-ok="relateQuestion_ok" @on-cancel="relateQuestion_cancel">
      <Tree :data="relateQuestionData.treeData" show-checkbox @on-check-change="changeTreeNodeCheck"></Tree>
    </Modal>

    <!-- 图片上传裁剪 -->
    <Modal v-model="imgUploadData.visible" :mask-closable="false" :title="imgUploadData.title" width="850">
      <imgCropper :imgType="$nfs.types.documents.type" :proportionX="16" :proportionY="9" :isMultipurpose="true" v-if="imgUploadData.visible"></imgCropper>
      <div slot="footer">
      </div>
    </Modal>

  </div>
</template>

<script>
  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  var su = ezjsUtil.sessionUtil;
  import commonVideo from '../../components/video';
  import imgCropper from '../../components/imgCropper';
  // bus
  import Bus from '../../components/bus/bus.js'

  export default {
    components: { commonVideo, imgCropper, Bus },
    data () {
      const validatePath = (rule, value, callback) => {
        if (this.editObj.path == '' && this.editObj.content == '') {
          callback(new Error('请指定文件内容'));
        } else {
          if (this.editObj.type == 8) {
            if (this.editObj.videoDuration == 0) {
              callback(new Error('请指定视频文件时长'));
            } else {
              this.editObj.path = this.editObj.path.split(' ').join('');
              callback();
            }
          } else if (this.editObj.type == 1) {
            this.editObj.path = this.editObj.path.split(' ').join('');
            callback();
          }
        }
      };
      return {
        dict: dict,

        selectedNodeLevel: 1,
        searchData: {
          docTreeCode: '',
          title: '',
          type: '',
          pageNo: 1
        },
        tableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageNo: 1,
            pageSize: 1
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
              title: '所在结构',
              align: 'center',
              key: 'docTreeCode',
              render: (h, params) => {
                let fullTitle = this.treeLabelFilter(params.row.docTreeCode);
                return h('div', fullTitle);
              }
            },
            {
              title: '优先级',
              key: 'sortNum',
              align: 'center'
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
              title: '操作',
              key: 'action',
              width: 250,
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
                        this.editFile(params.index);
                      }
                    }
                  }, '修改'),
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
                        this.editFileSortNum(params.index);
                      }
                    }
                  }, '设置优先级'),
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
                        this.relateQuestion(params.index);
                      }
                    }
                  }, '关联试题'),
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
        // 新增、修改--素材
        imgUploadList: [],
        editModal: false,
        editModalTitle: '',
        editModal_loading: false,
        isEdit: false, //是否是修改
        tabValue: 'tabUpload',
        tabBefore: 'tabUpload',
        editObj: {
          id: null,
          title: '',
          path: '',
          description: '',
          content: '',
          type: 1,
          thumbnail: '',
          sortNum: 0,
          doc_tree_id: '',
          videoDuration: 0, // 视频时长--单位秒
        },
        copyEditObj: {
          id: null,
          title: '',
          path: '',
          description: '',
          content: '',
          type: 1,
          thumbnail: '',
          sortNum: 0,
          doc_tree_id: '',
          videoDuration: 0, // 视频时长--单位秒
        },
        uploadList: [],
        formRules: {
          path: [
            { required: true, validator: validatePath, trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请填写名称', trigger: 'blur' },
            { type: 'string', max: 30, message: '名称长度不能超过30', trigger: 'blur' }
          ],
          description: [
            // { required: true, message: '请填写描述', trigger: 'blur' },
            { type: 'string', max: 100, message: '描述长度不能超过100', trigger: 'blur' }
          ],
        },
        // 查看详情
        detailModal: false,
        detailObj: {},
        videoTime: '',
        // 视频预览
        myVideoModal: false,
        createVideo: false,
        commonSrc: '',
        commonPic: '',
        
        // sortNum -- 文件
        fileSortNum: {
          title: '设置文件优先级',
          visible: false,
          loading: false,
          editObj: {
            id: null,
            title: '',
            path: '',
            type: null,
            sortNum: null,
            doc_tree_id: null
          },
          formRules: {
            sortNum: [
              { required: true, message: '请输入优先级', trigger: 'blur' },
              { pattern:  /^[1-9]\d{0,5}$/, message: '优先级必须为首位不为0且不超过100000的正整数', trigger: 'blur' },
            ],
          }
        },
        // 关联题库
        relateQuestionData: {
          title: '关联题库',
          visible: false,
          relateObj: {
            documentationId: null,
            subjectCodes: '',
          },
          relatedData: {
            codes: '',
            codesArr: []
          },
          treeData: [],
        },

        // 图片上传截取
        imgUploadData: {
          visible: false,
          title: '上传图片',
          imgToken: '',
        },
      }
    },
    watch: {
      '$route': 'routeChangeHandler'
    },
    created: function () {
      Bus.$on('getTarget', imgToken => {  
        var _this = this;
        console.log(imgToken);  
        _this.editObj.thumbnail = imgToken;
        _this.copyEditObj = Object.assign({}, _this.editObj);
        _this.imgUploadData.visible = false;
      });  
    },
    mounted () {
      this.routeChangeHandler();
    },
    methods: {
      // 转换图片路径 token-->url
      fmtImgUrl (token) {
        var _this = this, url = '';
        if (token != null && token != '') {
          url = ezjsUtil.nfsUtil.getFileUrl(token);
        } else {
          if (_this.editObj.type == 1) {
            url = '/images/thumbnail/thumbnail-pdf.jpg';
          } else if (_this.editObj.type == 8) {
            url = '/images/thumbnail/thumbnail-video.jpg';
          }
        }
        return url;
      },
      fmtDetailImgUrl (token) {
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
      // 监测路由变化，变化则调用
      routeChangeHandler (transition) {
        this.clearSearchData();
        this.tableDataRefresh();
      },
      // 获取表格数据
      tableDataRefresh () {
        var _this = this;
        _this.searchData.docTreeCode = _this.$route.query.subjectCode;
        _this.selectedNodeLevel = _this.$route.query.subjectCode.split('#').length - 1;
        ezjsUtil.request(apiConstants.co_documentation_flipByCoDocTreeCode,_this.searchData,
          function (err, data) {
            if (err) {
              return;
            }
            _this.tableData.data = data.listInfo;
            _this.tableData.flipInfo.totalCount = data.flipInfo.totalCount;
            _this.tableData.flipInfo.pageNo = data.flipInfo.pageNo;
            _this.tableData.flipInfo.pageSize = data.flipInfo.pageSize;
          }
        );
      },
      // 清空搜索条件
      clearSearchData(){
        var _this = this;
        _this.searchData = {
          docTreeCode: _this.$route.query.subjectCode,
          title: '',
          type: '',
          pageNo: 1
        }
      },
      // 翻页
      tableChangePage (pageNo) {
        var _this = this;
        _this.searchData.pageNo = pageNo;
        _this.tableDataRefresh();
      },
      // 删除文件
      tableDataRemove (index) {
        var _this = this, _index = index, type = '';
        if (_this.tableData.data[_index].type == 1) {
          type = '文本';
        } else if (_this.tableData.data[_index].type == 1) {
          type = '视频';
        }
        _this.$Modal.confirm({
          title: '确认删除',
          content: '<p>您确定删除' + type + _this.tableData.data[_index].title + '吗？</p>',
          onOk: () => {
            ezjsUtil.request(apiConstants.co_documentation_remove,
              {
                _id: _this.tableData.data[_index].id
              },
              function (err, data) {
                if (err) {
                  return;
                }
                _this.$Message.success('删除成功!');
                _this.tableDataRefresh();
              }
            )
          },
          onCancel: () => {
            _this.$Message.info('取消操作!');
          }
        });
      },
      // 新增、修改--弹出框
      editFile (index) {
        var _this = this, _index = index;
        _this.editModal_loading = false;
        if (_index == -1) {
          // 说明是新增
          _this.isEdit = false;
          _this.editModalTitle = '添加文件';
          _this.editObj.doc_tree_id = _this.$route.params.subjectId;
          _this.copyEditObj.doc_tree_id = _this.$route.params.subjectId;
        } else {
          // 修改
          _this.isEdit = true;
          // 原始数据
          _this.editObj.id = _this.tableData.data[_index].id;
          _this.editObj.title = _this.tableData.data[_index].title;
          _this.editObj.path = _this.tableData.data[_index].path;
          _this.editObj.description = _this.tableData.data[_index].description;
          _this.editObj.content = _this.tableData.data[_index].content;
          _this.editObj.type = _this.tableData.data[_index].type;
          _this.editObj.thumbnail = _this.tableData.data[_index].thumbnail;
          _this.editObj.sortNum = _this.tableData.data[_index].sortNum;
          _this.editObj.doc_tree_id = _this.$route.params.subjectId;
          _this.editObj.videoDuration = _this.tableData.data[_index].videoDuration;
          // 数据copy
          _this.copyEditObj = Object.assign({}, _this.editObj);
          // 判断是视频还是文件
          if (_this.editObj.type == 1) {
            _this.editModalTitle = '修改文件';
          } else if (_this.editObj.type == 8) {
            _this.editModalTitle = '修改视频';
          }
        }
        _this.editModal = true;
      },
      // 新增、修改--各项数据
      edit_title () {
        this.copyEditObj.title = this.editObj.title;
      },
      edit_description () {
        this.copyEditObj.description = this.editObj.description;
      },
      edit_type (type) {
        this.copyEditObj.type = this.editObj.type;
        this.editObj.path = '';
        this.editObj.videoDuration = 0;
        this.editObj.content = '';
        this.copyEditObj = Object.assign({}, this.editObj);
        this.uploadList = [];
        this.tabValue = 'tabUpload';
        this.tabBefore = 'tabUpload';
      },
      edit_videoDuration () {
        this.copyEditObj = Object.assign({}, this.editObj);
        this.$refs['editObj'].resetFields();
        this.editObj = Object.assign({}, this.copyEditObj);
      },
      // 上传图片成功
      uploadImgSuccess (res, file) {
        var _this = this;
        _this.imgUploadList = [];
        _this.editModal_loading = false;
        _this.editObj.thumbnail = res.data.token;
        _this.copyEditObj = Object.assign({}, _this.editObj);
      },
      // 切换tab
      tabClick () {
        var _this = this;
        if (_this.tabValue != _this.tabBefore) {
          _this.editObj.path = '';
          _this.editObj.videoDuration = 0;
          _this.editObj.content = '';
          _this.copyEditObj = Object.assign({}, _this.editObj);
          _this.uploadList = [];
          _this.tabBefore = _this.tabValue;
        }
      },
      edit_path () {
        this.copyEditObj = Object.assign({}, this.editObj);
      },
      edit_content() {
        this.copyEditObj = Object.assign({}, this.editObj);
      },
      // 上传过程中
      disableConfirm () {
        var _this = this;
        _this.editModal_loading = true;
      },
      // 上传失败
      handleError(error, file) {
        this.$Message.error('上传失败！');
        this.imgUploadList = [];
        this.editModal_loading = false;
      },
      // 移除上传文件列表
      removeUploadList () {
        this.uploadList = [];
        this.editObj.path = '';
        this.copyEditObj.path = '';
      },
      // 上传文件（视频、文本）成功
      uploadFileSuccess (res, file) {
        var _this = this;
        _this.editModal_loading = false;
        _this.$refs['editObj'].resetFields();
        // 删除之前传的内容
        if (_this.$refs.uploadFile.fileList.length > 1) {
          _this.$refs.uploadFile.fileList.splice(0, 1);
        }
        _this.copyEditObj.path = res.data.token;
        if (_this.copyEditObj.type == 8) {
          _this.copyEditObj.videoDuration = res.data.metadata.duration;
        }
        _this.editObj = Object.assign({}, _this.copyEditObj);
      },
      // 确认-新增、修改
      edit_ok (name) {
        var _this = this, msg = '';
        if (_this.isEdit == false) {
          msg = '新增';
        } else {
          msg = '修改';
        }
        _this.$refs[name].validate(function (valid) {
          if (valid) {
            _this.editModal_loading = true;
            // todo: edit接口
            ezjsUtil.request(apiConstants.co_documentation_edit,_this.editObj,
              function (err, data) {
                if (err) {
                  _this.editModal_loading = false;
                  return;
                }
                _this.$Message.success(msg + "成功！");
                _this.tableDataRefresh();
                _this.editModal = false;
                _this.$refs[name].resetFields();
                _this.editModal_loading = false;
                _this.editObj = {
                                  id: null,
                                  title: '',
                                  path: '',
                                  description: '',
                                  content: '',
                                  type: 1,
                                  thumbnail: '',
                                  sortNum: 0,
                                  doc_tree_id: '',
                                  videoDuration: 0, // 视频时长--单位秒
                                };
                _this.copyEditObj = {
                                  id: null,
                                  title: '',
                                  path: '',
                                  description: '',
                                  content: '',
                                  type: 1,
                                  thumbnail: '',
                                  sortNum: 0,
                                  doc_tree_id: '',
                                  videoDuration: 0, // 视频时长--单位秒
                                };
                _this.uploadList = [];
              }
            )
          } else {
            _this.editModal_loading = false;
            _this.$Message.error('表单验证失败!');
          }
        });
      },
      // 取消-新增、修改
      edit_cancel (name) {
        var _this = this;
        _this.editModal_loading = false;
        _this.$Message.info('取消操作！');
        _this.editModal = false;
        _this.$refs[name].resetFields();
        _this.editObj = {
                          id: null,
                          title: '',
                          path: '',
                          description: '',
                          content: '',
                          type: 1,
                          thumbnail: '',
                          sortNum: 0,
                          doc_tree_id: '',
                          videoDuration: 0, // 视频时长--单位秒
                        };
        _this.copyEditObj = {
                          id: null,
                          title: '',
                          path: '',
                          description: '',
                          content: '',
                          type: 1,
                          thumbnail: '',
                          sortNum: 0,
                          doc_tree_id: '',
                          videoDuration: 0, // 视频时长--单位秒
                        };
        _this.uploadList = [];
        _this.tabValue = 'tabUpload';
        _this.tabBefore = 'tabUpload';
      },
      // 查看详情
      showDetail (index) {
        var _this = this, _index = index;
        ezjsUtil.request(apiConstants.co_documentation_detail, 
        {
          _id: _this.tableData.data[_index].id
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.detailObj = data;
            if (data.type == 8) {
              let minTime = null, secTime = null;
              minTime = Math.floor(data.videoDuration / 60);
              secTime = data.videoDuration - minTime * 60;
              if (minTime == 0) {
                _this.videoTime = secTime.toString() + '秒';
              } else {
                _this.videoTime = minTime.toString() + '分' + secTime.toString() + '秒';
              } 
            }
            _this.detailModal = true;
          }
        )
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
      // 设置文件优先级--show
      editFileSortNum (index) {
        var _this = this, _index = index;
        _this.fileSortNum.editObj.id = _this.tableData.data[_index].id;
        _this.fileSortNum.editObj.title = _this.tableData.data[_index].title;
        _this.fileSortNum.editObj.path = _this.tableData.data[_index].path;
        _this.fileSortNum.editObj.type = _this.tableData.data[_index].type;
        _this.fileSortNum.editObj.sortNum = _this.tableData.data[_index].sortNum;
        _this.fileSortNum.editObj.doc_tree_id = _this.$route.params.subjectId;
        _this.fileSortNum.visible = true;
      },
      // 设置文件优先级--ok
      editSortNum_ok (name) {
        var _this = this;
        _this.$refs[name].validate(function (valid) {
          if (valid) {
            _this.fileSortNum.loading = true;
            ezjsUtil.request(apiConstants.co_documentation_edit, _this.fileSortNum.editObj,
              function (err, data) {
                if (err) {
                  _this.fileSortNum.loading = false;
                  return;
                }
                _this.$Message.success("修改优先级成功！");
                _this.tableDataRefresh();
                _this.fileSortNum.visible = false;
                _this.$refs[name].resetFields();
                _this.fileSortNum.loading = false;
                _this.fileSortNum.editObj = {
                  id: null,
                  title: '',
                  path: '',
                  type: null,
                  sortNum: null,
                  doc_tree_id: null
                };
              }
            )
          } else {
            _this.fileSortNum.loading = false;
            _this.$Message.error('表单验证失败!');
          }
        });
      },
      // sortNum--edit_cancel
      editSortNum_cancel (name) {
        this.fileSortNum.editObj = {
          id: null,
          title: '',
          path: '',
          type: null,
          sortNum: null,
          doc_tree_id: null
        };
        this.fileSortNum.loading = false;
        this.fileSortNum.visible = false;
      },
      // 关联试题--获取已关联的试题节点数据
      relateQuestion (index) {
        var _this = this, _index = index;
        _this.relateQuestionData.relateObj.documentationId = _this.tableData.data[_index].id;
        ezjsUtil.request(apiConstants.documentationWithQuestion_getSubjectCode,{
          _documentationId: _this.relateQuestionData.relateObj.documentationId
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.relateQuestionData.relatedData.codesArr = data;
            _this.relateQuestionData.relatedData.codes = data.join(',');
            _this.getRelateTreeData();
          }
        );
      },
      // 关联试题--获取试题树结构
      getRelateTreeData () {
        var _this = this;
        ezjsUtil.request(apiConstants.course_allSubjectTree,
        {
        },
          function (err, data) {
            if (err) {
              return;
            }
            // 重构数据
            function fmtTreeData (arr, depth) {
              var newTree = [];
              for (var i = 0; i < arr.length; i++) {
                var node = arr[i];
                if (node.nodes.length == 0) {
                  // 无children
                  if (_this.relateQuestionData.relatedData.codesArr.indexOf(node.code) != -1) {
                    // 已经关联
                    newTree.push({
                      title: node.label,
                      fullTitle: node.fullLabel,
                      code: node.code,
                      id: node.value,
                      children: null,
                      // 扩展
                      checked: true,
                      depth: depth,
                      expand: depth == 0 || depth == 1
                    });
                  } else {
                    // 未关联
                    newTree.push({
                      title: node.label,
                      fullTitle: node.fullLabel,
                      code: node.code,
                      id: node.value,
                      children: null,
                      // 扩展
                      checked: false,
                      depth: depth,
                      expand: depth == 0 || depth == 1
                    });
                  }
                } else {
                  // 有children
                  newTree.push({
                    title: node.label,
                    fullTitle: node.fullLabel,
                    code: node.code,
                    id: node.value,
                    children: fmtTreeData(node.nodes, depth + 1),
                    // 扩展
                    depth: depth,
                    expand: depth == 0 || depth == 1
                  });
                }
              }
              return newTree;
            }

            _this.relateQuestionData.treeData = fmtTreeData(data, 0);
            _this.relateQuestionData.visible = true;
          }
        );
      },
      // 关联试题--勾选
      changeTreeNodeCheck (nodes) {
        var _this = this;
        if (nodes.length == 0) {
          _this.relateQuestionData.relateObj.subjectCodes = '';
        } else {
          var checkedArr = [];
          for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var codeLength = node.code.split('#').length - 1;
            if (codeLength == 3) {
              checkedArr.push(node.code);
            }
          }
          _this.relateQuestionData.relateObj.subjectCodes = checkedArr.join(',');
        }
      },
      // 关联试题--确认
      relateQuestion_ok () {
        var _this = this;
        ezjsUtil.request(apiConstants.documentationWithQuestion_bindSubjectNode2Documentation,_this.relateQuestionData.relateObj,
          function (err, data) {
            if (err) {
              return;
            }
            _this.$Message.success('操作成功！');
            _this.relateQuestionData.treeData = [];
            _this.relateQuestionData.relateObj = {
              documentationId: null,
              subjectCodes: '',
            };
            _this.relateQuestionData.relatedData = {
              codes: '',
              codesArr: [],
            };
          }
        );
      },
      // 关联试题--取消
      relateQuestion_cancel () {
        this.$Message.info('取消操作！');
        this.relateQuestionData.treeData = [];
        this.relateQuestionData.relateObj = {
          documentationId: null,
          subjectCodes: '',
        };
        this.relateQuestionData.relatedData = {
          codes: '',
          codesArr: [],
        };
      },
      // 上传图片------------------------------------
      showCropper () {
        let _this = this;
        _this.imgUploadData.visible = true;
      },
      // 渲染路径
      treeLabelFilter (code) {
        var _this = this;
        return '' + _this.$parent.readCodeLabel(code);
      },
    },
  }
</script>
