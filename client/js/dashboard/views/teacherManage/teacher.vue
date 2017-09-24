<style lang="less" scoped>
  .modal-form-img {
    max-width: 100px;
  }
</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <div class="common-top-right">
        <Button class="common-right-btn" type="primary" size="small" @click="modelFormEdit(-1)" icon="ios-personadd-outline">新增讲师
        </Button>
      </div>
    </div>

    <!-- tb-container -->
    <div class="tb-container">

      <!-- tb-container-top -->
      <Input class="common-default-size common-left-btn" size="small" v-model="searchData.name" placeholder="姓名查询(模糊查询)"></Input>
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
    <!-- 新增、修改modal -->
    <Modal v-model="editData.visible" :title="editData.title" :closable="false" :mask-closable="false">
      <Form label-position="right" :label-width="60" :model="editData.editObj" :rules="editData.validate" ref="editObj">
        <Form-item label="姓名" prop="name">
          <Input v-model="editData.editObj.name" placeholder="请输入讲师姓名" style="width: 150px" @on-change="edit_name"></Input>
        </Form-item>
        <Form-item label="头像" prop="avatar">
          <img class="modal-form-img" :src="fmtImgUrl(editData.editObj.avatar)" alt="">
          <p>推荐尺寸：150像素*150像素</p>
          <Upload :action="$nfs.uploadUrl" :data="$nfs.types.teachers" :on-success="uploadImgSuccess" :on-progress="disableConfirm" :multiple="false" :on-error="handleError" :default-file-list="imgUploadList" accept="image/gif, image/jpeg, image/png, image/bmp" :format="['jpg','jpeg','png','bmp']">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传头像</Button>
          </Upload>
          <!-- <Button type="ghost" icon="ios-crop" @click="showCropper">裁剪上传</Button> -->
        </Form-item>
        <Form-item label="介绍" prop="introduce_1">
          <Input v-model="editData.editObj.introduce_1" placeholder="请输入讲师介绍" @on-change="edit_introduce_1"></Input>
        </Form-item>
        <Form-item prop="introduce_2">
          <Input v-model="editData.editObj.introduce_2" placeholder="请输入讲师介绍" @on-change="edit_introduce_2"></Input>
        </Form-item>
        <Form-item prop="introduce_3">
          <Input v-model="editData.editObj.introduce_3" placeholder="请输入讲师介绍" @on-change="edit_introduce_3"></Input>
        </Form-item>
        <Form-item label="描述" prop="description">
          <Input v-model="editData.editObj.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入讲师描述" @on-change="edit_description"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="edit_cancel('editObj')">取消</Button>
        <Button type="primary" :loading="editData.loading" @click="edit_ok('editObj')">确定</Button>
      </div>
    </Modal>
    <!-- 详情modal -->
    <Modal v-model="detailData.visible" :title="detailData.title" :closable="false" :mask-closable="false" @on-ok="closeDetail" @on-cancel="closeDetail">
      <Form label-position="right" :label-width="80">
        <Form-item label="姓名">
          <p>{{ detailData.detailObj.name }}</p>
        </Form-item>
        <Form-item label="头像">
          <img class="modal-form-img" :src="fmtImgUrl(detailData.detailObj.avatar)" alt="">
        </Form-item>
        <Form-item label="介绍">
          <ul>
            <li v-for="item in detailData.detailIntroduceList">
            {{ item }}
            </li>
          </ul>
          <!-- <p>{{ detailData.detailObj.introduce }}</p> -->
        </Form-item>
        <Form-item label="描述">
          <p>{{ detailData.detailObj.description }}</p>
        </Form-item>
        <Form-item label="创建时间">
          <p>{{  fmtFullTime(detailData.detailObj.createTime) }}</p>
        </Form-item>
      </Form>
    </Modal>

    <!-- 图片上传裁剪 -->
    <Modal v-model="imgUploadData.visible" :mask-closable="false" :title="imgUploadData.title" width="750">
      <imgCropper :imgType="$nfs.types.teachers.type" :proportionX="10" :proportionY="10" v-if="imgUploadData.visible"></imgCropper>
      <div slot="footer">
      </div>
    </Modal>

  </div>
</template>

<script>
  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  import imgCropper from '../../components/imgCropper';
  // bus
  import Bus from '../../components/bus/bus.js'

  export default {
    components: { imgCropper, Bus },
    data () {
      return {
        dict: dict,

        pageData: {
          title: '讲师管理',
          link: '/teacherManage'
        },

        searchData: {
          name: '',
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
                      size: 'small',
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.modelFormEdit(params.index);
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
                        this.remove(params.index);
                      }
                    }
                  }, '删除'),
                ]);
              },
            }
          ],
        },
        // edit
        imgUploadList: [],
        editData: {
          title: '新增',
          editObj: {
            id: null,
            name: '',
            avatar: '', // 图片
            introduce_1: '', // 介绍 1
            introduce_2: '', // 介绍 2
            introduce_3: '', // 介绍 3
            description: '', //描述
          },
          editCopyObj: {
            id: null,
            name: '',
            avatar: '', // 图片
            introduce_1: '', // 介绍 1
            introduce_2: '', // 介绍 2
            introduce_3: '', // 介绍 3
            description: '', //描述
          },
          validate: {
            name: [
              {required: true, message: '请填写姓名', trigger: 'blur'},
              { type: 'string', max: 15, message: '姓名长度不能超过15个字符', trigger: 'blur' }
            ],
            avatar: [
              {required: true, message: '请上传头像', trigger: 'blur'},
            ],
            introduce_1: [
              {required: true, message: '请顺序填写至少两句介绍', trigger: 'blur'},
              { type: 'string', max: 20, message: '介绍长度不能超过20个字符', trigger: 'blur' },
              { pattern: /^(?!.*;)/, message: '介绍中不能填写分号', trigger: 'blur' }
            ],
            introduce_2: [
              {required: true, message: '请顺序填写至少两句介绍', trigger: 'blur'},
              { type: 'string', max: 20, message: '介绍长度不能超过20个字符', trigger: 'blur' },
              { pattern: /^(?!.*;)/, message: '介绍中不能填写分号', trigger: 'blur' }
            ],
            introduce_3: [
              { type: 'string', max: 20, message: '介绍长度不能超过20个字符', trigger: 'blur' },
              { pattern: /^(?!.*;)/, message: '介绍中不能填写分号', trigger: 'blur' }
            ],
            description: [
              {required: true, message: '请填写描述', trigger: 'blur'},
              { type: 'string', max: 300, message: '描述长度不能超过300个字符', trigger: 'blur' }
            ],
            
          },
          loading: false,
          visible: false,
        },
        // detail
        detailData: {
          title: '查看详情',
          teacherId: null,
          detailObj: {},
          detailIntroduceList: [],
          visible: false,
        },
        // 图片上传截取
        imgUploadData: {
          visible: false,
          title: '上传图片',
          imgToken: '',
        },
      }
    },
    created: function () {
      this.tableDataRefresh();
      // 监听bus传参
      Bus.$on('getTarget', imgToken => {  
        var _this = this;
        _this.imgUploadList = [];
        _this.editData.editCopyObj.avatar = imgToken;
        _this.cleanWarring();
        _this.imgUploadData.visible = false;
      });  
    },
    methods: {
      // 清除校验
      cleanWarring () {
        let _this = this;
        _this.$refs['editObj'].resetFields();
        _this.editData.editObj = Object.assign({}, _this.editData.editCopyObj);
      },
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
      // 清空搜索条件
      clearSearchObj () {
        this.searchData.name = '';
        this.searchData.pageNo = 1;
      },
      // 获取table数据
      tableDataRefresh () {
        var _this = this;
        ezjsUtil.request(apiConstants.ace_teacher_flip,_this.searchData,
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
        _this.detailData.teacherId = _this.tableData.data[_index].id;
        ezjsUtil.request(apiConstants.ace_teacher_detail,{
          id: _this.detailData.teacherId
        },
          function (err, data) {
            if (err) {
              return;
            }
            _this.detailData.detailObj = data;
            var detailIntroduceArr = _this.detailData.detailObj.introduce.split(';');
            for (var i = 0; i < detailIntroduceArr.length; i++) {
              var node = detailIntroduceArr[i];
              _this.detailData.detailIntroduceList.push(node);
            }
            _this.detailData.visible = true;
          }
        )
      },
      // 关闭详情
      closeDetail () {
        this.detailData.detailObj = {};
        this.detailData.detailIntroduceList = [];
        this.detailData.visible = false;
      },
      // 删除
      remove (index) {
        var _this = this, _index = index, msg = '删除讲师';
        
        function remove_ok(id) {
          ezjsUtil.request(apiConstants.ace_teacher_remove,{
            id: id
          },
            function (err, data) {
              if (err) {
                return;
              }
              _this.$Message.success(msg + '成功！');
              _this.tableDataRefresh();
            }
          )
        }
        
        _this.$Modal.confirm({
          title: msg,
          content: '<p>是否' + msg + _this.tableData.data[_index].name + '？</p>',
          onOk: () => {
            remove_ok(_this.tableData.data[_index].id);
          },
          onCancel: () => {
            _this.$Message.info('取消操作！');
          }
        });
      },

      // edit
      // edit -- 弹出表单
      modelFormEdit (index) {
        var _this = this, _index = index;
        if (_index == -1) {
          // 新增
          _this.editData.title = '新增讲师';
        } else {
          // 修改
          _this.editData.title = '修改讲师';
          _this.editData.editObj.id = _this.tableData.data[_index].id;
          _this.editData.editObj.name = _this.tableData.data[_index].name;
          _this.editData.editObj.avatar = _this.tableData.data[_index].avatar;
          _this.editData.editObj.description = _this.tableData.data[_index].description;

          _this.editData.editObj.introduce = _this.tableData.data[_index].introduce;
          var introduceArr = _this.tableData.data[_index].introduce.split(';');
          _this.editData.editObj.introduce_1 = introduceArr[0];
          _this.editData.editObj.introduce_2 = introduceArr[1];
          if (introduceArr.length == 3) {
            _this.editData.editObj.introduce_3 = introduceArr[2];
          } else {
            _this.editData.editObj.introduce_3 = '';
          }
          // copy
          _this.editData.editCopyObj.id = _this.editData.editObj.id;
          _this.editData.editCopyObj.name = _this.editData.editObj.name;
          _this.editData.editCopyObj.avatar = _this.editData.editObj.avatar;
          _this.editData.editCopyObj.description = _this.editData.editObj.description;
          _this.editData.editCopyObj.introduce_1 = _this.editData.editObj.introduce_1;
          _this.editData.editCopyObj.introduce_2 = _this.editData.editObj.introduce_2;
          _this.editData.editCopyObj.introduce_3 = _this.editData.editObj.introduce_3;
        }
        _this.editData.visible = true;
      },
      // edit -- ok
      edit_ok (name) {
        var _this = this;
        _this.$refs[name].validate(function(valid) {
          if (valid) {
            _this.editData.loading = true;
            var editObj = {
              id: _this.editData.editObj.id,
              name: _this.editData.editObj.name,
              avatar: _this.editData.editObj.avatar,
              introduce: '',
              description: _this.editData.editObj.description
            };
            if (_this.editData.editObj.introduce_3 == '') {
              editObj.introduce = _this.editData.editObj.introduce_1 + ';' + _this.editData.editObj.introduce_2;
            } else {
              editObj.introduce = _this.editData.editObj.introduce_1 + ';' + _this.editData.editObj.introduce_2 + ';' + _this.editData.editObj.introduce_3;
            }
            ezjsUtil.request(apiConstants.ace_teacher_createOrUpdate,editObj,
              function (err, data) {
                if (err) {
                  return;
                }
                _this.$Message.info(_this.editData.title + "成功！");
                _this.editData.loading = false;
                _this.$refs[name].resetFields();
                _this.editData.visible = false;
                _this.editData.editCopyObj = {
                  id: null,
                  name: '',
                  avatar: '', // 图片
                  introduce_1: '', // 介绍 1
                  introduce_2: '', // 介绍 2
                  introduce_3: '', // 介绍 3
                  description: '', //描述
                };
                _this.clearSearchObj();
                _this.tableDataRefresh();
              }
            )
          } else {
            _this.editData.loading = false;
            _this.$Message.error('表单验证失败!');
          }
        });
      },
      edit_cancel (name) {
        this.$refs[name].resetFields();
        this.editData.editCopyObj = {
          id: null,
          name: '',
          avatar: '', // 图片
          introduce: '', // 介绍
          description: '', //描述
        };
        this.editData.loading = false;
        this.editData.visible = false;
        this.$Message.info('取消操作！');
      },
      // edit -- name
      edit_name () {
        this.editData.editCopyObj.name = this.editData.editObj.name;
      },
      // edit -- introduce
      edit_introduce_1 () {
        this.editData.editCopyObj.introduce_1 = this.editData.editObj.introduce_1;
      },
      edit_introduce_2 () {
        this.editData.editCopyObj.introduce_2 = this.editData.editObj.introduce_2;
      },
      edit_introduce_3 () {
        this.editData.editCopyObj.introduce_3 = this.editData.editObj.introduce_3;
      },
      // edit -- description
      edit_description () {
        this.editData.editCopyObj.description = this.editData.editObj.description;
      },
      // edit -- 上传图片 -- 成功
      uploadImgSuccess (res, file) {
        var _this = this;
        _this.imgUploadList = [];
        _this.$refs['editObj'].resetFields();
        _this.editData.editObj.avatar = res.data.token;
        _this.editData.editCopyObj.avatar = res.data.token;
        // 取回
        _this.editData.editObj.id = _this.editData.editCopyObj.id;
        _this.editData.editObj.name = _this.editData.editCopyObj.name;
        _this.editData.editObj.introduce = _this.editData.editCopyObj.introduce;
        _this.editData.editObj.description = _this.editData.editCopyObj.description;

        _this.editData.loading = false;
      },
      //  edit -- 上传图片 -- 上传过程中
      disableConfirm () {
        var _this = this;
        _this.editData.loading = true;
      },
      // edit -- 上传图片 -- 上传失败
      handleError(error, file) {
        this.$Message.error('上传失败！');
        this.imgUploadList = [];
        this.modal_loading = false;
      },
      // 上传图片------------------------------------
      showCropper () {
        let _this = this;
        _this.imgUploadData.visible = true;
      },
    }
  }
</script>
