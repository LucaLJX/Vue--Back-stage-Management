<style lang="less" scoped>
  .float-right {
    float: right;
  }
  // modal - 详情
  .modal-form-item-p .modal-form-item-btn {
    margin-left: 30px;
  }
  .modal-form-item-img {
    max-height: 80px;
    min-height: 60px;
  }
  // modal - 新增、修改
  .modal-form-img {
    max-width: 100px;
  }
  // modal - 选择讲师
  .modal-btn-container {
    height: 40px;
  }
  .modal-btn-container .modal-btn-left {
    float: left;
    margin-right: 10px;
  }
  .modal-page-container {
    height: 24px;
    margin-top: 15px;
  }
  .modal-page-container .modal-page {
    float: right;
  }
  .modal-page-container p {
    display: block;
    float: right;
    height: 24px;
    line-height: 24px;
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
    <!-- cr-right-middle -->
    <div class="cr-right-middle">
      <!--标题  -->
      <p class="float-left cr-right-middle-p" style="">标题搜索：</p>
      <Input class="common-short-size common-left-btn float-left" size="small" v-model="searchData.title" placeholder="标题"></Input>
      <p class="float-left cr-right-middle-p" style="margin-left: 10px;">价格区间(单位:元)：</p>
      <Input-number class="common-left-btn float-left" size="small" :max="searchData.currentPrice_hi" :min="1" v-model="searchData.currentPrice_lo"></Input-number>
      <p class="float-left cr-right-middle-p" style="margin-right: 6px;">~</p>
      <Input-number class="common-left-btn float-left" size="small" :max="10000" :min="searchData.currentPrice_lo" v-model="searchData.currentPrice_hi"></Input-number>
      
      <Button class="common-left-btn float-left" size="small" type="primary" @click="tableDataRefresh" icon="ios-search">
        搜索
      </Button>
      
      <Button class="common-right-btn float-right" size="small" type="primary" @click="edit(-1)" v-show="selectedNodeLevel == 2">
        新增课程
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

    
    <!-- 新增、修改 -->
    <Modal v-model="editModal" :title="editModalTitle" :mask-closable="false" :closable="false">
      <Form :label-width="100" :model="editData" :rules="editRule" ref="editData">
        <Form-item label="名称" prop="title">
          <Input v-model="editData.title" placeholder="请输入名称..." @on-change="edit_title"></Input>
        </Form-item>
        <Form-item label="描述" prop="description">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="editData.description" placeholder="请输入描述..." @on-change="edit_description"></Input>
        </Form-item>
        <Form-item label="封面" prop="coverImg">
          <img class="modal-form-img" :src="fmtImgUrl(editData.coverImg)" alt="">
          <p>（注意：课程封面推荐图片尺寸为180像素*210像素）</p>
          <Upload :action="$nfs.uploadUrl" :data="$nfs.types.course" :on-success="uploadImgSuccess" :on-progress="disableConfirm" :default-file-list="imgUploadList" :multiple="false" :on-error="handleError"  accept="image/gif, image/jpeg, image/png, image/bmp" :format="['jpg','jpeg','png','bmp']">
            <Button type="ghost" icon="ios-cloud-upload-outline">直接上传</Button>
          </Upload>
          <Button type="ghost" icon="ios-crop" @click="showCropper">裁剪上传</Button>
        </Form-item>
        <Form-item label="课时" prop="classHour">
          <Input-number :max="10000" :min="1" v-model="editData.classHour" @on-change="edit_classHour"></Input-number>
        </Form-item>
        <Form-item label="原价" prop="originalPrice">
          <Input-number :max="10000" :min="1" v-model="editData.originalPrice" @on-change="edit_originalPrice"></Input-number>
        </Form-item>
        <Form-item label="现价" prop="currentPrice">
          <Input-number :max="10000" :min="1" v-model="editData.currentPrice" @on-change="edit_currentPrice"></Input-number>
        </Form-item>
        <Form-item label="讲师" prop="aceTeacherId">
          <p v-show="!editData.aceTeacherId">未选中讲师</p>
          <p v-show="editData.aceTeacherId">{{ aceSelectedTeacher.name }}</p>
          <Button type="ghost" @click="showSelectTeacher">选择讲师</Button>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="edit_cancel('editData')">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit_ok('editData')">确定</Button>
      </div>
    </Modal>
    <!-- 选择讲师 -->
    <Modal v-model="selectTeacherModal" :mask-closable="false" width="800" title="选择讲师">
      <div class="modal-btn-container">
        <Input class="modal-btn-left" size="small" v-model="teacherSearchObj.name" placeholder="姓名查询(模糊查询)" style="width: 150px;"></Input>
        <Button size="small" class="modal-btn-left" type="primary" @click="getTeacherData">搜索</Button>
      </div>
      <div class="modal-table-container">
        <Table class="modal-table" border :columns="teacherTableData.columns" :data="teacherTableData.data" stripe></Table>
      </div>
      <div class="modal-page-container">
        <Page class="modal-page" :current="teacherTableData.flipInfo.pageNo"
        :total="teacherTableData.flipInfo.totalCount" @on-change="changeTeacherPage"
        simple></Page>
        <p>共{{teacherTableData.flipInfo.totalCount}}条</p>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <!-- 查看详情 -->
    <Modal v-model="detailData.visible" :mask-closable="false" :closable="false"  :title="detailData.title">
      <Form label-position="right" :label-width="80">
        <Form-item label="标题：">
          <p>{{ detailData.detailObj.title }}</p>
        </Form-item>
        <Form-item label="描述：">
          <p>{{ detailData.detailObj.description }}</p>
        </Form-item>
        <Form-item label="创建时间：">
          <p>{{ fmtFullTime(detailData.detailObj.createTime) }}</p>
        </Form-item>
        <Form-item label="封面图：">
          <img class="modal-form-item-img" :src="fmtImgUrl(detailData.detailObj.coverImg)">
        </Form-item>
        <Form-item label="课时：">
          <p>{{ detailData.detailObj.classHour }}</p>
        </Form-item>
        <Form-item label="原价：">
          <p>{{ detailData.detailObj.originalPrice }}</p>
        </Form-item>
        <Form-item label="现价：">
          <p>{{ detailData.detailObj.currentPrice }}</p>
        </Form-item>
      </Form>
    </Modal>
    <!-- 弹出框--修改优先级  -->
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
    
    <!-- 图片上传裁剪 -->
    <Modal v-model="imgUploadData.visible" :mask-closable="false" :title="imgUploadData.title" width="750">
      <imgCropper :imgType="$nfs.types.course.type" :proportionX="18" :proportionY="21" v-if="imgUploadData.visible"></imgCropper>
      <div slot="footer">
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
  import imgCropper from '../../components/imgCropper';
  // bus
  import Bus from '../../components/bus/bus.js'

  export default {
    components: { imgCropper, Bus },
    data () {
      const validateOriginalPrice = (rule, value, callback) => {
        if (value == 0) {
          callback(new Error('请输入原价'));
        } else {
          callback();
        }
      };
      const validateCurrentPrice = (rule, value, callback) => {
        if (value == 0) {
          callback(new Error('请输入现价'));
        } else {
          if (this.editData.currentPrice >= this.editData.originalPrice) {
            callback(new Error('现价必须小于原价'));  
          } else {
            callback();
          }
        }
      };
      const validateTeacher = (rule, value, callback) => {
        if (value == null) {
          callback(new Error('请选择讲师'));
        } else {
          callback();
        }
      };
      return {
        clientWidth: null,
        selectedNodeLevel: 1,
        // searchData
        searchData: {
          coModuleType: null, //模块type
          coModuleCode: null, //模块code
          title: '',
          currentPrice_lo: 1, //现价--最小值
          currentPrice_hi: 10000, // 现价--最大值
          pageNo: 1,
        },
        tableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageNo: 1,
            pageSize: 10
          },
          columns: [
            {
              type: '#',
              width: 100,
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
              title: '封面',
              key: 'coverImg',
              align: 'center',
              width: 150,
              render: (h, params) => {
                var url = params.row.coverImg;
                if(url == null) {
                  url = '/images/thumbnail/thumbnail-img.jpg';
                } else {
                  url = ezjsUtil.nfsUtil.getFileUrl(url)
                }
                return h('img', {
                  attrs:{
                    src: url
                  },
                  style: {
                    maxWidth: '110px',
                    display: 'block',
                    margin: '6px auto',
                  },
                });
              }
            },
            {
              title: '讲师',
              width: 100,
              key: 'teacherName',
            },
            {
              title: '原价',
              key: 'originalPrice',
              width: 80,
              align: 'center',
              render: (h, params) => {
                let _originalPrice = params.row.originalPrice / 100;
                return h('div', _originalPrice);
              }
            },
            {
              title: '现价',
              key: 'currentPrice',
              width: 80,
              align: 'center',
              render: (h, params) => {
                let _currentPrice = params.row.currentPrice / 100;
                return h('div', _currentPrice);
              }
            },
            {
              title: '优先级',
              key: 'sortNum',
              width: 80,
              align: 'center'
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
                      size: 'small',
                    },
                    style: {
                      marginRight: '12px'
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
                      size: 'small',
                    },
                    style: {
                      marginRight: '12px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.index);
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.tableDataRemove(params.index);
                      }
                    }
                  }, '删除'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
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
                      type: 'primary',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.routeList(params.index);
                      }
                    }
                  }, '查看关联')
                ]);
              },
            }
          ]
        },
        // edit -- 新增、修改课程
        imgUploadList: [],
        editModal: false, // edit-modal 展示
        editModalTitle: '',
        modal_loading: false, // edit-modal 按钮是否可用
        editData: {
          id: null, //课程id
          title: '', //课程title
          description: '', 
          coverImg: '', // 封面图片
          originalPrice: 0, //原价
          currentPrice: 0, // 现价
          aceTeacherId: null, //讲师id
          coModuleCode: null, //模块节点code
          coModuleType: null, //模块type
          classHour: 1,
        },
        editCopyData: {
          id: null, //课程id
          title: '', //课程title
          description: '', 
          coverImg: '', // 封面图片
          originalPrice: 0, //原价
          currentPrice: 0, // 现价
          aceTeacherId: null, //讲师id
          coModuleCode: null, //模块节点code
          coModuleType: null, //模块type
          classHour: 1,
        },
        editRule: {
          title: [
            { required: true, message: '请填写名称', trigger: 'blur' },
            { type: 'string', max: 15, message: '名称长度不能超过15个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请填写描述', trigger: 'blur' },
            { type: 'string', max: 200, message: '描述长度不能超过200个字符', trigger: 'blur' }
          ],
          coverImg: [
            { required: true, message: '请上传封面', trigger: 'blur' },
          ],
          aceTeacherId: [
            { required: true, validator: validateTeacher, trigger: 'blur' },
          ],
          originalPrice: [
            { required: true, validator: validateOriginalPrice, trigger: 'blur' }
          ],
          currentPrice: [
            { required: true, validator: validateCurrentPrice, trigger: 'blur' }
          ]
        },
        // 选择讲师
        selectTeacherModal: false,
        aceSelectedTeacher: { //选中的讲师
          id: null,
          name: '',
        },
        aceChangeSelect: {
          id: null,
          name: '',
          length: null
        },
        teacherSearchObj: {
          name: '',
          pageNo: 1
        },
        teacherTableData: {
          data: [],
          flipInfo: {
            totalCount: 0,
            pageNo: 1,
            pageSize: 10,
          },
          columns: [
            {
              type: '#',
              width: 100,
              align: 'center',
              render: (h, params) => {
                var _index = params.index + 1 + (this.teacherTableData.flipInfo.pageNo - 1) * this.teacherTableData.flipInfo.pageSize;
                return h ('div', _index)
              }
            },
            {
              title: '姓名',
              key: 'name',
              width: 150,
              align: 'center'
            },
            {
              title: '头像',
              key: 'avatar',
              align: 'center',
              width: 150,
              render: (h, params) => {
                var url = params.row.avatar;
                if(url == null) {
                  url = '/images/thumbnail/thumbnail-img.jpg';
                } else {
                  url = ezjsUtil.nfsUtil.getFileUrl(url)
                }
                return h('img', {
                  attrs:{
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
              title: '介绍',
              key:'introduce',
              render: (h, params) => {
                var arr = [], introduceList = [];
                introduceList = params.row.introduce.split(';');
                for (var i = 0; i < introduceList.length; i++) {
                  var listNode = introduceList[i];
                  arr.push(h("li",i + 1 + '.' + listNode));
                }
                return h ('ul', arr 
                )
              }
            },
            {
              title: '描述',
              key: 'description',
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
                        this.changeTeacher(params.index);
                      }
                    }
                  }, '添加')
                ]);
              }, 
            }     
          ],
        },
        // 详情
        detailData: {
          visible: false,
          title: '查看课程详情',
          detailObj: {},
        },
        // sortNum -- 树节点
        sortNumData: {
          title: '修改优先级',
          visible: false,
          loading: false,
          editObj: {
            id: null, //课程id
            title: '', //课程title
            description: '', 
            coverImg: '', // 封面图片
            originalPrice: 0, //原价
            currentPrice: 0, // 现价
            aceTeacherId: null, //讲师id
            coModuleCode: null, //模块节点code
            coModuleType: null, //模块type
            sortNum: null,
          },
          formRules: {
            sortNum: [
              { required: true, message: '请输入优先级', trigger: 'blur' },
              { pattern:  /^[1-9]\d{0,5}$/, message: '优先级必须为首位不为0且不超过100000的正整数', trigger: 'blur' },
            ],
          }
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
      this.routeChangeHandler();
      // 监听bus传参
      Bus.$on('getTarget', imgToken => {  
        var _this = this;
        console.log(imgToken);  
        _this.editCopyData.coverImg = imgToken;
        _this.$refs['editData'].resetFields();
        _this.editData = Object.assign({}, _this.editCopyData);
        _this.imgUploadData.visible = false;
      });  
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
      // 清空搜索条件
      clearSearchData(){
        var _this = this;
        _this.searchData = {
          coModuleType: _this.$route.params.type, //模块type
          coModuleCode: _this.$route.query.subjectCode, //模块code
          title: '',
          currentPrice_lo: 1, //现价--最小值
          currentPrice_hi: 10000, // 现价--最大值
          pageNo: 1,
        }
      },
      // 获取table数据
      tableDataRefresh () {
        var _this = this;
        _this.selectedNodeLevel = _this.$route.query.subjectCode.split('#').length - 2;
        ezjsUtil.request(apiConstants.ace_course_flip,{
          coModuleType: _this.searchData.coModuleType, //模块type
          coModuleCode: _this.searchData.coModuleCode, //模块code
          title: _this.searchData.title,
          currentPrice_lo: _this.searchData.currentPrice_lo * 100, //现价--最小值
          currentPrice_hi: _this.searchData.currentPrice_hi * 100, // 现价--最大值
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
        );
      },
      // 翻页
      tableChangePage (page) {
        this.searchData.pageNo = page;
        this.tableDataRefresh();
      },
      // 删除
      tableDataRemove (index) {
        var _this = this, _index = index, msg = '';
        _this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除课程' + _this.tableData.data[_index].title + '？</p>',
          onOk: () => {
            ezjsUtil.request(apiConstants.ace_course_removeCourse,{
              courseId: _this.tableData.data[_index].id
            },
              function (err, data) {
                if (err) {
                  return;
                }
                _this.$Message.success('删除成功！');
                _this.tableDataRefresh();
              }
            );
          },
          onCancel: () => {
            _this.$Message.info('取消操作！');
          }
        });

      },
      // 新增、修改------------------------------------------------------
      // 新增、修改--展示
      edit (index) {
        var _this = this, _index = index;
        _this.editData.coModuleCode = _this.$route.query.subjectCode;
        _this.editData.coModuleType = _this.$route.params.type;
        _this.editCopyData.coModuleCode = _this.$route.query.subjectCode;
        _this.editCopyData.coModuleType = _this.$route.params.type;
        if (_index == -1) {
          // 新增
          _this.editModalTitle = '新增课程';
        } else {
          // 修改
          _this.editModalTitle = '修改课程';
          _this.editData.id = _this.tableData.data[_index].id;
          _this.editData.title = _this.tableData.data[_index].title;
          _this.editData.description = _this.tableData.data[_index].courseDescription;
          _this.editData.coverImg = _this.tableData.data[_index].coverImg;
          _this.editData.originalPrice = _this.tableData.data[_index].originalPrice / 100;
          _this.editData.currentPrice = _this.tableData.data[_index].currentPrice / 100;
          _this.editData.aceTeacherId = _this.tableData.data[_index].aceTeacherId;
          _this.editData.classHour = _this.tableData.data[_index].classHour;
          _this.editData.coModuleCode = _this.tableData.data[_index].coModuleCode;
          // copy
          _this.editCopyData = Object.assign({}, _this.editData);  
          // 默认选中的教师
          _this.aceSelectedTeacher.id = _this.tableData.data[_index].aceTeacherId;
          _this.aceSelectedTeacher.name = _this.tableData.data[_index].teacherName;
        }
        _this.editModal = true;
      },
      // 新增、修改--title
      edit_title () {
        this.editCopyData.title = this.editData.title;
      },
      // 新增、修改--description
      edit_description () {
        this.editCopyData.description = this.editData.description;
      },
      // 新增、修改--封面上传 -- 成功
      uploadImgSuccess (res, file) {
        var _this = this;
        _this.imgUploadList = [];
        _this.$refs['editData'].resetFields();
        _this.editCopyData.coverImg = res.data.token;
        // 取回
        _this.editData = Object.assign({}, _this.editCopyData);
        _this.modal_loading = false;
      },
      // 新增、修改--封面上传 -- 过程中
      disableConfirm () {
        var _this = this;
        _this.modal_loading = true;
      },
      // 新增、修改--封面上传 -- 失败
      handleError(error, file) {
        this.$Message.error('上传失败！');
        this.imgUploadList = [];
        this.modal_loading = false;
      },
      // 新增、修改--课时
      edit_classHour () {
        this.editCopyData = Object.assign({}, this.editData);  
      },
      // 新增、修改--originalPrice--原价
      edit_originalPrice () {
        this.editCopyData.originalPrice = this.editData.originalPrice;
        this.$refs['editData'].resetFields();
        // 取回
        this.editData = Object.assign({}, this.editCopyData);
      },
      // 新增、修改--currentPrice--现价
      edit_currentPrice () {
        this.editCopyData.currentPrice = this.editData.currentPrice;
        this.$refs['editData'].resetFields();
        // 取回
        this.editData = Object.assign({}, this.editCopyData);
      },
      // 新增、修改--选讲师--展示
      showSelectTeacher () {
        var _this = this;
        _this.getTeacherData();
      },
      // 新增、修改--选讲师--获取讲师数据
      getTeacherData () {
        var _this = this;
        ezjsUtil.request(apiConstants.ace_teacher_flip,_this.teacherSearchObj,
          function (err, data) {
            if (err) {
              return;
            }

            function fmtTeacherData (nodes) {
              var newTableData = [];
              for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.id == _this.aceSelectedTeacher.id) {
                  newTableData.push({
                    avatar: node.avatar,
                    description: node.description,        
                    id: node.id,      
                    introduce: node.introduce,        
                    name: node.name,        
                    _checked: true,
                  });
                } else {
                  newTableData.push({
                    avatar: node.avatar,
                    description: node.description,        
                    id: node.id,      
                    introduce: node.introduce,        
                    name: node.name,        
                    _checked: false,
                  });
                }
              }
              return newTableData;
            }
            _this.teacherTableData.data = fmtTeacherData(data.listInfo);
            _this.teacherTableData.flipInfo.totalCount = data.flipInfo.totalCount;
            _this.teacherTableData.flipInfo.pageNo = data.flipInfo.pageNo;
            _this.teacherTableData.flipInfo.pageSize = data.flipInfo.pageSize;

            _this.selectTeacherModal = true;
          }
        )
      },
      // 新增、修改--选讲师--翻页
      changeTeacherPage (page) {
        this.teacherSearchObj.pageNo = page;
        this.getTeacherData();
      },

      // 新增修改--选择讲师
      changeTeacher (index) {
        let _this = this, _index = index;
        console.log(_this.teacherTableData.data[_index]);
        _this.$Modal.confirm({
          title: '选择讲师',
          content: '<p>是否确认选择讲师' + _this.teacherTableData.data[_index].name + '？</p>',
          onOk: () => {
            _this.aceSelectedTeacher.id = _this.teacherTableData.data[_index].id;
            _this.aceSelectedTeacher.name = _this.teacherTableData.data[_index].name;
            _this.editData.aceTeacherId = _this.aceSelectedTeacher.id;
            _this.editCopyData = Object.assign({}, _this.editData);
            _this.selectTeacherModal = false;
          },
          onCancel: () => {

          }
        });
      },
      // 新增、修改--确认
      edit_ok (name) {
        var _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.modal_loading = true;
            _this.editData.originalPrice = _this.editData.originalPrice * 100;
            _this.editData.currentPrice = _this.editData.currentPrice * 100;
            ezjsUtil.request(apiConstants.ace_course_createOrUpdate,_this.editData,
              function (err, data) {
                if (err) {
                  return;
                }
                _this.modal_loading = false;
                _this.$refs[name].resetFields();
                _this.editModal = false;
                _this.editCopyData = {
                  id: null, //课程id
                  title: '', //课程title
                  description: '', 
                  coverImg: '', // 封面图片
                  originalPrice: 0, //原价
                  currentPrice: 0, // 现价
                  aceTeacherId: null, //讲师id
                  coModuleCode: null, //模块节点code
                  coModuleType: null, //模块type
                  classHour: 1,
                };
                _this.$Message.success(_this.editModalTitle + '成功！');
                _this.tableDataRefresh();
              }
            )
          } else {
            _this.$Message.error('表单验证失败！');
          }
        })
      },
      // 新增、修改--取消
      edit_cancel (name) {
        var _this = this;
        _this.$refs[name].resetFields();
        _this.editModal = false;
        _this.editCopyData = {
          id: null, //课程id
          title: '', //课程title
          description: '', 
          coverImg: '', // 封面图片
          originalPrice: 0, //原价
          currentPrice: 0, // 现价
          aceTeacherId: null, //讲师id
          coModuleCode: null, //模块节点code
          coModuleType: null, //模块type
          classHour: 1,
        };
        _this.$Message.info('取消操作！');
      },
      // 查看详情
      showDetail (index) {
        var _this = this, _index = index;
        ezjsUtil.request(apiConstants.ace_course_detail,{
          courseId: _this.tableData.data[_index].id
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.detailData.detailObj = data;
            _this.detailData.visible = true;
          }
        )
      },
      // sortNum--show
      editSortNum (index) {
        var _this = this;
        _this.sortNumData.editObj.id = _this.tableData.data[index].id;
        _this.sortNumData.editObj.title = _this.tableData.data[index].title;
        _this.sortNumData.editObj.description = _this.tableData.data[index].description;
        _this.sortNumData.editObj.coverImg = _this.tableData.data[index].coverImg;
        _this.sortNumData.editObj.originalPrice = _this.tableData.data[index].originalPrice;
        _this.sortNumData.editObj.currentPrice = _this.tableData.data[index].currentPrice;
        _this.sortNumData.editObj.aceTeacherId = _this.tableData.data[index].aceTeacherId;
        _this.sortNumData.editObj.sortNum = _this.tableData.data[index].sortNum;
        _this.sortNumData.editObj.coModuleCode = _this.tableData.data[index].coModuleCode;
        _this.sortNumData.editObj.coModuleType = _this.$route.params.type;
        _this.sortNumData.visible = true;
      },
      // sortNum--edit_ok
      editSortNum_ok (name) {
        var _this = this;
        _this.$refs[name].validate(function (valid) {
          if (valid) {
            _this.sortNumData.loading = true;
            ezjsUtil.request(apiConstants.ace_course_createOrUpdate, _this.sortNumData.editObj,
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
                  id: null, //课程id
                  title: '', //课程title
                  description: '', 
                  coverImg: '', // 封面图片
                  originalPrice: 0, //原价
                  currentPrice: 0, // 现价
                  aceTeacherId: null, //讲师id
                  coModuleCode: null, //模块节点code
                  coModuleType: null, //模块type
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
          id: null, //课程id
          title: '', //课程title
          description: '', 
          coverImg: '', // 封面图片
          originalPrice: 0, //原价
          currentPrice: 0, // 现价
          aceTeacherId: null, //讲师id
          coModuleCode: null, //模块节点code
          coModuleType: null, //模块type
        };
        this.sortNumData.loading = false;
        this.sortNumData.visible = false;
      },
      // 删除
      remove (index) {
        var _this = this, _index = index;
        _this.$Modal.confirm({
          title: '删除课程',
          content: '<p>是否确认删除课程' + _this.tableData.data[_index].title + '？</p>',
          onOk: () => {
            ezjsUtil.request(apiConstants.ace_course_removeCourse, {
              courseId: _this.tableData.data[_index].id
            },
              function (err, data) {
                if (err) {
                  return;
                }
                _this.$Message.success('删除成功！');
                _this.tableDataRefresh();
              }
            );
          },
          onCancel: () => {
            _this.$Message.info('取消操作！');
          }
        });
      },

      // 查看素材列表
      routeList (index) {
        var _this = this;
        _this.$router.push({path:'/courseManage/courseManage/' + _this.$route.params.type + '/documentList/' + _this.tableData.data[index].id ,query: {subjectCode: _this.$route.query.subjectCode, subjectTitle: _this.tableData.data[index].title}});
      },
      // 上传图片------------------------------------
      showCropper () {
        let _this = this;
        _this.imgUploadData.visible = true;
      },

    }
  }
</script>

