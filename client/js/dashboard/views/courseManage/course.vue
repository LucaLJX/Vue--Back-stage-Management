<style lang="less" scoped>

</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <div class="common-top-right"></div>
    </div>

    <div class="common-right-container">
      <!-- cr-left -->
      <div class="cr-left-container">
        <div class="cr-left-title">{{ treeData.title }}</div>
        <div class="cr-left-tree">
          <Ezjs-Tree ref="tree4Documents" @on-select-change="treeNodeSelectHandler" :data="treeData.formatedData"></Ezjs-Tree>
        </div>
      </div>

      <!-- cr-right-container -->
      <div class="cr-right-container">
        <div class="cr-right-top">
          <div class="cr-right-top-left">
            <Icon class="common-top-icon" type="arrow-right-b" size="20"></Icon>
            <div class="common-top-title-left">{{ selectedNode.fullTitle }}</div>
          </div>
          <div class="cr-right-top-right">
            <Button class="common-right-btn float-right" size="small" type="primary" @click="editSortNum" v-show="treeData.showBtn">
              修改排序
            </Button>
            <Button class="common-right-btn" type="primary" size="small" @click="modelFormShow(3)">新增二级目录</Button>
            <Button class="common-right-btn" type="primary" size="small" @click="modelFormShow(1)" :disabled="treeData.createLevel1State === 0" v-show="treeData.showBtn">修改二级目录</Button>
            <Button class="common-right-btn" type="primary" size="small" @click="modelFormShow(2)" v-show="treeData.showBtn">{{ treeData.createLevel2State == 2 ? '修改三级目录' : '新增三级目录' }}</Button>
            <Button class="common-right-btn" type="error" size="small" @click="treeNodeRemove" v-show="treeData.showBtn">删除</Button>
          </div>
        </div>

        <router-view></router-view>

      </div>
    </div>
    <!-- modal  -->
    <Modal
      :title="modelFormData.title"
      v-model="modelFormData.visible"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="modelFormDataValidate" :model="modelFormData.editObj" :rules="modelFormData.validate"
              :label-width="80"
              class="z-form">
        <Form-item label="名称" prop="name">
          <i-input v-model="modelFormData.editObj.name" placeholder="请输入名称"
                   class="z-form-controller"></i-input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modelFormCancel('modelFormDataValidate')">取消</Button>
        <Button type="primary" @click="modelFormSubmit('modelFormDataValidate')"
          :loading="modelFormData.loading">
          提交
        </Button>
      </div>
    </Modal>
    <!-- 弹出框--修改优先级 -- 树节点 -->
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

  import EzjsTree from '../../../../assets/libs/ezjs/iview_custom/components/tree/index'

  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;

  export default {
    components: { EzjsTree },
    data() {
      return {
        // 当前页面的信息：名称、链接
        pageData: {
          title: '',
          link: ''
        },
        // 是否是切换页面
        // 树-数据
        treeData: {
          title: '',
          srcData: [], //后台返回的数据
          formatedData: [], //重构后用于tree组件的数据
          createLevel1State: 1, // 0: disable, 1: create, 2: edit
          createLevel2State: 0,
          allowUpload: false, //只有二级节点可以上传
          showBtn: false,
        },
        // 当前选中的节点
        selectedNode: {
          id: 0,
          title: '',
          fullTitle: '',
          code: '',
          sortNum: 0,
          parentId: null,
          childrenLength: 0, //判断树是否有子节点，删除树节点的时候用得到（如果有，不能删）
        },
        // 表单
        modelFormData: {
          title: '',
          editObj: {
            id: null,
            name: '',
            type: '',
            parent_id: null,
          },
          validate: {
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ],
          },
          loading: false,
          visible: false,
        },
        // sortNum -- 树节点
        sortNumData: {
          title: '修改优先级',
          visible: false,
          loading: false,
          editObj: {
            id: null,
            name: '',
            type: null,
            sortNum: 0,
            parent_id: null
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
    beforeRouteUpdate (to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
      var _this = this;
      next();
      if (to.params.type != from.params.type) {
        _this.selectedNode = {
          id: 0,
          title: '',
          fullTitle: '',
          code: '',
          sortNum: 0,
          childrenLength: 0,
        }
      }
      var typeChange = _this.$route.path.indexOf('/list');
      var listChange = _this.$route.path.indexOf('/documentList');
      if (typeChange == -1 && listChange == -1) {
        _this.treeDataRefresh();
      }
    },
    created: function () {
      var _this = this;

      _this.treeDataRefresh(); //组件加载完成--自动获取tree
    },
    mounted: function () {

    },
    methods: {
      // 获取tree数据
      treeDataRefresh (toSelectId) {
        var _this = this;
        switch (_this.$route.params.type) {
          case '51':
            _this.pageData.title = 'UCM';
            _this.pageData.link = '/courseManage/courseManage/51';
            _this.treeData.title = 'UCM';
            break;
          case '52':
            _this.pageData.title = '专业能力/素质';
            _this.pageData.link = '/courseManage/courseManage/52';
             _this.treeData.title = '专业能力/素质';
            break;
          case '53':
            _this.pageData.title = '通识类';
            _this.pageData.link = '/courseManage/courseManage/53';
             _this.treeData.title = '通识类';
            break;
        }
        ezjsUtil.request(apiConstants.documentInModule_getCoModuleByType,
          {
            dataType: 'tree',
            type: _this.$route.params.type
          },
          function (err, data) {
            if (err) {
              return;
            }
            _this.treeData.srcData = data;

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
                      //如果是第一树节点，则展开
                      // 这里不需要写成expand: depth == 0
                      // 因为后面，会调用方法自动展开选中节点（第一个根节点或者其他）
                      expand: false,
                      selected: depth == 0, //默认选中根节点
                      id: node.id,
                      depth: depth,
                      code: node.code,
                      sortNum: node.sortNum
                    })
                  } else {
                    newTree.push({
                      title: node.title,
                      fullTitle: node.fullTitle,
                      parentId: node.parentId,
                      //如果是第一树节点，则展开
                      // 这里不需要写成expand: depth == 0
                      // 因为后面，会调用方法自动展开选中节点（第一个根节点或者其他）
                      expand: false,
                      id: node.id,
                      selected: depth == 0, //默认选中根节点
                      depth: depth,
                      code: node.code,
                      sortNum: node.sortNum,
                      children: null,
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
                      //这个selected字段一定要传，
                      //  不然下面的setSelectedNodeWithExpand不起作用
                      selected: false,
                      id: node.id,
                      depth: depth,
                      code: node.code,
                      sortNum: node.sortNum
                    })
                  } else {
                    newTree.push({
                      title: node.title,
                      fullTitle: node.fullTitle,
                      parentId: node.parentId,
                      expand: false, //如果不是第一个树节点，则不展开
                      //这个selected字段一定要传
                      // 不然下面的setSelectedNodeWithExpand不起作用
                      selected: false,
                      id: node.id,
                      depth: depth,
                      code: node.code,
                      sortNum: node.sortNum,
                      children: null,
                    })
                  }
                }
              }
              return newTree;
            }

            _this.treeData.formatedData = formatTreeData(_this.treeData.srcData, 0);

            //默认选中第一个根节点
            var defaultSelectedNodeId =  _this.treeData.formatedData[0].id;
            if (toSelectId) {
              // 如果toSelectId传参，则defaultSelectedNodeId为传参的值
              defaultSelectedNodeId = toSelectId;
            } else {
              if (_this.$route.query.subjectId) {
                // 如果路由上的subjectid有值，则defaultSelectedNodeId为路由上的subjectid的值
                defaultSelectedNodeId = _this.$route.query.subjectId;
              } else if (_this.selectedNode.id != 0) {
                // 如果没有传参、路由subjectid也没值，则defaultSelectedNodeId为选中的节点的id（选中id不为0）
                defaultSelectedNodeId = _this.selectedNode.id;
              }
            }

            _this.$nextTick(() => {
              // 调用方法，展开选中的节点
              _this.$refs.tree4Documents.setSelectedNodeWithExpand(defaultSelectedNodeId);
            });

          }
        )
      },
      // 点击选中节点
      treeNodeSelectHandler (node) {
        var model = node[0], _this = this;
        if (!model) {
          // 如果没有选中节点（不可能的情况）
          return;
        }
        _this.updateSelectedNode(model);
        _this.watchCreate();
        _this.tableDataRefresh();
      },
      // 获取选中的树节点的数据
      updateSelectedNode (model) {
        var _this = this;
        _this.selectedNode.id = model.id;
        _this.selectedNode.parentId = model.parentId;
        _this.selectedNode.fullTitle = model.fullTitle;
        _this.selectedNode.title = model.title;
        _this.selectedNode.code = model.code;
        _this.selectedNode.sortNum = model.sortNum;
        if (!model.children) {
          // 如果选中的节点没有children
          _this.selectedNode.childrenLength = 0;
        } else {
          // 如果选中的节点有children
          _this.selectedNode.childrenLength = model.children.length;
        }
      },
      // 根据选中的tree节点，渲染右侧的表格
      tableDataRefresh () {
        var _this = this;
        _this.$router.push({path:'/courseManage/courseManage/' + _this.$route.params.type + '/list/' + _this.selectedNode.id ,query: {subjectId: _this.selectedNode.id, subjectCode: _this.selectedNode.code, subjectTitle: _this.selectedNode.title, subjectSortNum: _this.selectedNode.sortNum, subjectParentId: _this.selectedNode.parentId}});
      },
      // 根据code值，获取面包屑全称
      treeCode2Label (code) {
        var _this = this;
        if (!code) {
          return '';
        }
        var arr = _this.treeData.formatedData;

        function codeInNodes (code, nodes) {
          for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (code.indexOf(node.code) != -1) {
              if (!node.children) {
                return node.fullTitle;
              } else {
                return codeInNodes(code, node.children);
              }
            }
          }
        }

        var fullTitle = codeInNodes(code, arr);
        return '' + fullTitle;
      },
      // 监听选中节点，展示对应可用按钮
      watchCreate () {
        var _this = this;
        var nodeCode = _this.selectedNode.code;
        var depth = nodeCode.split('#').length - 2;
        if (depth == 1) {
          // 选中的是一级节点
          _this.treeData.showBtn = true;
          _this.treeData.createLevel1State = 2;
          _this.treeData.createLevel2State = 1;
        } else if (depth == 2) {
          // 选中的是二级节点
          _this.treeData.showBtn = true;
          _this.treeData.createLevel1State = 0;
          _this.treeData.createLevel2State = 2;
        } else {
          _this.treeData.showBtn = false;
        }
      },
      // 展示新增、修改弹框
      modelFormShow (from) {
        var _this = this;
        if (from == 1) { //修改level 1
          _this.modelFormData.title = '修改一级目录';
          _this.modelFormData.editObj = {
            name: _this.selectedNode.title,
            id: _this.selectedNode.id,
            type: _this.$route.params.type
          };
        } else if (from == 3) { //创建level 1
          _this.modelFormData.title = '创建一级目录';
          _this.modelFormData.editObj = {
            name: '',
            id: null,
            type: _this.$route.params.type
          };
        } else if (from == 2) { //level 2
          if (_this.treeData.createLevel2State == 1) { // 创建level 2
            _this.modelFormData.title = '创建二级目录';
            _this.modelFormData.editObj = {
              name:'',
              id: null,
              type: _this.$route.params.type,
              parent_id: _this.selectedNode.id
            };
          } else if (_this.treeData.createLevel2State == 2) { // 修改level 2
            _this.modelFormData.title = '修改二级目录';
            _this.modelFormData.editObj = {
              name: _this.selectedNode.title,
              id: _this.selectedNode.id,
              type: _this.$route.params.type,
              parent_id: _this.selectedNode.parentId
            };
          }
        }
        _this.modelFormData.visible = true;
      },
      // 取消新增、修改
      modelFormCancel(name){
        //清空填写的内容
        this.$refs[name].resetFields();
        //隐藏modal
        this.modelFormData.visible = false;
        this.modelFormData.loading = false;
      },
      // 确认新增、修改
      modelFormSubmit(name){
        var _this = this;
        this.$refs[name].validate(function (valid) {
          if (valid) {
            _this.modelFormData.loading = true;

            ezjsUtil.request(apiConstants.documentInModule_edit, _this.modelFormData.editObj,
              function (err, data) {
                if (err) {
                  _this.modelFormData.loading = false;
                  return;
                }
                //清空填写的内容
                _this.$refs[name].resetFields();
                _this.treeDataRefresh(_this.selectedNode.id);
                //隐藏modal
                _this.modelFormData.visible = false;
                _this.modelFormData.loading = false;
              }
            );
          } else {
            _this.$Message.error('表单验证失败!');
          }
        })
      },
      // 删除目录
      treeNodeRemove(){
        var _this = this, msg = '';
        if (_this.selectedNode.childrenLength != 0) {//有子节点,无法删除
          msg = '请先删除一级目录下的二级目录，再删除一级目录!';
          return _this.$Modal.error({
            title: '删除失败',
            content: '<p>' + msg + '</p>',
          })
        }
        if (_this.treeData.createLevel1State == 2) {
          msg += '一级目录';
        }
        if (_this.treeData.createLevel2State == 2) {
          msg += '二级目录';
        }
        msg += '<b> ' + _this.selectedNode.title + ' </b>';
        _this.$Modal.confirm({
          title: '确认删除么',
          content: '<p>您确定删除' + msg + '么?</p>',
          loading: true,
          onOk() {
            ezjsUtil.request(apiConstants.documentInModule_remove,
              {
                _id: _this.selectedNode.id
              },
              function (err, data) {
                _this.$Modal.remove();
                if (err) {
                  return;
                }
                _this.$Message.success('删除成功!');
                _this.treeDataRefresh(_this.selectedNode.parentId);
              }
            )
          }
        });
      },
      // sortNum--show
      editSortNum () {
        var _this = this;
        _this.sortNumData.editObj.id = _this.selectedNode.id;
        _this.sortNumData.editObj.name = _this.selectedNode.title;
        _this.sortNumData.editObj.parent_id = _this.selectedNode.parentId;
        _this.sortNumData.editObj.sortNum = _this.selectedNode.sortNum;
        _this.sortNumData.editObj.type = _this.$route.params.type;
        _this.sortNumData.visible = true;
      },
      // sortNum--edit_ok
      editSortNum_ok (name) {
        var _this = this;
        _this.$refs[name].validate(function (valid) {
          if (valid) {
            _this.sortNumData.loading = true;
            ezjsUtil.request(apiConstants.documentInModule_edit, _this.sortNumData.editObj,
              function (err, data) {
                if (err) {
                  _this.sortNumData.loading = false;
                  return;
                }
                _this.$Message.success("修改优先级成功！");
                _this.sortNumData.visible = false;
                _this.$refs[name].resetFields();
                _this.sortNumData.loading = false;
                _this.sortNumData.editObj = {
                  id: null,
                  name: '',
                  type: null,
                  sortNum: 0,
                  parent_id: null
                };
                _this.treeDataRefresh(_this.selectedNode.id);
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
          id: null,
          name: '',
          type: null,
          sortNum: 0,
          parent_id: null
        };
        this.sortNumData.loading = false;
        this.sortNumData.visible = false;
      },
      // 构建课程目录
      readCodeLabel (code) {
        if (!code) {
          return '';
        }
        var nCode = '#' + code;
        let _this = this;
        let arr = _this.treeData.formatedData;
        function codeInNodes(code, nodes) {
          for (let i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if(code == ('#' + node.code)) {
              return node.fullTitle
            }
            if (code.indexOf("#" + node.code) != -1) {
              var children = node.children;
              if (!children) {
                return node.fullTitle;
              } else {
                return codeInNodes(code, children);
              }
            }
          }
        }

        var fullTitle = codeInNodes(nCode, arr);
        return '' + fullTitle;
      },
    },
  }
</script>



