<style scoped lang="less">
</style>

<template>
  <div>
    <!-- common-top -->
    <div class="common-top-container">
      <div class="common-top-ver-line"></div>
      <router-link class="common-top-title-left" :to="pageData.link">{{ pageData.title }}</router-link>
      <div class="common-top-right">

      </div>
    </div>

    <div class="common-right-container">
      <!-- cr-left -->
      <div class="cr-left-container">
        <div class="cr-left-title">{{treeData.title}}</div>
        <div class="cr-left-tree">
          <Ezjs-Tree
            ref="tree4Staff"
            @on-select-change="treeNodeSelectHandler"
            :data="treeData.formatedData"></Ezjs-Tree>
        </div>
      </div>

      <!-- cr-right-container -->
      <div class="cr-right-container">

        <div class="cr-right-top">
          <div class="cr-right-top-left">
            <Icon class="common-top-icon" type="arrow-right-b" size="20"></Icon>
            <div class="common-top-title-left">{{ selectedNode.fullName }}</div>
          </div>
          <div class="cr-right-top-right">
            <i-button class="common-right-btn" type="primary" size="small"
                      @click="route2Import">批量导入学生
            </i-button>
            <i-button class="common-right-btn" type="primary" size="small" @click="route2Create"
                      :disabled="treeData.depth != 4">新增学生
            </i-button>

            <!-- <i-button class="common-right-btn" type="primary" size="small" :disabled="treeData.createSectionState === 0" @click="modelFormShow(1)">
                {{treeData.createSectionState == 2 ? '编辑章节': '新增章节'}}
            </i-button>
            <i-button class="common-right-btn" type="primary" size="small" :disabled="treeData.createKnowledgeState === 0" @click="modelFormShow(2)">
                {{treeData.createKnowledgeState == 2 ? '编辑知识点': '新增知识点'}}
            </i-button>
            <i-button class="common-right-btn" type="error" size="small"
                v-show="treeData.createKnowledgeState == 2 || treeData.createSectionState == 2"
                @click="treeNodeRemove()">
                {{treeData.createSectionState == 2 ? '删除章节': ''}}
                {{treeData.createKnowledgeState == 2 ? '删除知识点': ''}}
            </i-button> -->
          </div>
        </div>

        <router-view></router-view>

      </div>
    </div>

    <Modal
      :title="modelFormData.title"
      v-model="modelFormData.visible"
      :mask-closable="false"
      :closable="false"
    >
      <i-form ref="modelFormDataValidate" :model="modelFormData.editObj" :rules="modelFormData.validate"
              :label-width="80"
              class="z-form">
        <Form-item label="名称" prop="name">
          <i-input v-model="modelFormData.editObj.name" placeholder="请输入名称"
                   class="z-form-controller"></i-input>
        </Form-item>
      </i-form>
      <div slot="footer">
        <i-button type="text" @click="modelFormCancel('modelFormDataValidate')">取消</i-button>
        <i-button type="primary" @click="modelFormSubmit('modelFormDataValidate')"
                  :loading="modelFormData.loading">
          提交
        </i-button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import EzjsTree from '../../../../assets/libs/ezjs/iview_custom/components/tree/index'
  var ezjsUtil = Vue.ezjsUtil;
  var dict = ezjsUtil.dictUtil;
  var apiConstants = ezjsUtil.constants.api;
  var su = ezjsUtil.sessionUtil;

  export default {
    components: {EzjsTree},
    data () {
      return {
        dict: dict,

        pageData: {
          title: '学生管理',
          link: '/company/staff'
        },

        treeData: {
          title: '学校',
          depth: 0,
          allowCreateQuestion: false, // 只有叶子节点才能创建题目
          createSectionState: 1, //0: disable, 1: create, 2: edit
          createKnowledgeState: 0, //
          srcData: [],
          formatedData: []
        },
        selectedNode: {//当前选中节点
          id: 0,
          name: '',
          fullName: '',
          code: '',
          childrenSize: 0,
        },
        rootNode: {
          id: 0,
          name: ''
        },

        modelFormData: {
          title: '新增章节',
          initObj: {
            id: null,
            name: '',
          },
          editObj: {
            id: null,
            name: '',
          },
          editIndex: null,//正在编辑的table索引
          validate: {
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ],
          },
          loading: false,
          visible: false,
        },

      }
    },
    watch: {
      '$route': function () {
        var _this = this;
        if(this.$route.path == '/company/staff') {
          _this.treeDataRefresh()
        }
      }
    },
    created: function () {
      var _this = this;

      _this.treeDataRefresh()

    },

    methods: {
      treeDataRefresh(toSelectId){
        var _this = this;
        ezjsUtil.request(apiConstants.department_tree,
          {
          },
          function (err, srcData) {
            _this.treeData.srcData = srcData;

            _this.rootNode = {
              id: srcData[0].value,
              name: srcData[0].label
            }

            function formatTreeData(arr, depth, parentId) {
              var newTree = [];
              for (var i = 0; i < arr.length; i++) {
                var node = arr[i];
                newTree.push({
                  title: node.label,
                  children: formatTreeData(node.nodes, depth + 1, node.value),
                  expand: depth == 0, //默认只展开第一层节点
                  selected: depth == 0, //默认选中根节点
                  //扩展字段
                  id: node.value,
                  depth: depth,
                  code: node.code,
                  fullLabel: node.fullLabel,
                  parentId: parentId
                })
              }
              return newTree;
            }
            _this.treeData.formatedData = formatTreeData(srcData, 0, null);

            // 默认选中第一个根节点.
            var defaultSelectedNodeId = srcData[0].value
            if (toSelectId) {
              defaultSelectedNodeId = toSelectId;
            } else {
              if (_this.$route.params.subjectId) {
                defaultSelectedNodeId = _this.$route.params.subjectId;
              } else if (_this.selectedNode.id != 0) {
                defaultSelectedNodeId = _this.selectedNode.id;
              }
            }

            console.log("默认选中", defaultSelectedNodeId);
            _this.$nextTick(() => {
              _this.$refs.tree4Staff.setSelectedNodeWithExpand(defaultSelectedNodeId);
            });
          }
        );
      },
      treeNodeSelectHandler(node){
        var model = node[0], _this = this;
        if (!model) {
          //impossible
          return;
        }
        console.log('选中节点: ' + model.title);
        _this.updateSelectedNode(model);
        _this.watchCreate();
        // _this.clearSearchData();
        _this.tableDataRefresh();
      },
      updateSelectedNode(model){
        var _this = this;
        _this.selectedNode.id = model.id;
        _this.selectedNode.parentId = model.parentId;
        _this.selectedNode.fullName = model.fullLabel;
        _this.selectedNode.name = model.title;
        _this.selectedNode.code = model.code;
        if (model.children) {
          _this.selectedNode.childrenSize = model.children.length;
        } else {
          _this.selectedNode.childrenSize = 0;
        }
      },
      tableDataRefresh(){
        var _this = this;
        _this.$router.push('/company/staff/' + _this.selectedNode.id + '?r=' + Math.random());
      },
      treeCode2Label(code){
        if (!code) {
          return '';
        }
        var _this = this;
        var arr = _this.treeData.srcData;

        function codeInNodes(code, nodes) {
          for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (code.indexOf(node.code) != -1) {
              var children = node.nodes;
              if (children.length == 0) {
                return node.fullLabel;
              } else {
                return codeInNodes(code, children)
              }
            }
          }
        }

        var fullLabel = codeInNodes(code, arr);
        return '' + fullLabel
      },
      //判断是否可以创建题目或者课程节点
      watchCreate(){
        var _this = this;
        var nodeCode = _this.selectedNode.code;
        var depth = nodeCode.split('#').length - 1;
        _this.treeData.depth = depth;
        if (depth == 3) {
          _this.treeData.allowCreateQuestion = true;
        } else {
          _this.treeData.allowCreateQuestion = false;
        }

        if (depth == 1) {
          _this.treeData.createSectionState = 1;
          _this.treeData.createKnowledgeState = 0;
        } else if (depth == 2) {
          _this.treeData.createSectionState = 2;
          _this.treeData.createKnowledgeState = 1;
        } else if (depth == 3) {
          _this.treeData.createSectionState = 0;
          _this.treeData.createKnowledgeState = 2;
        } else {
          _this.treeData.createSectionState = 0;
          _this.treeData.createKnowledgeState = 0;
        }
      },
      modelFormShow(from){
        var _this = this;
        if (from == 1) {//section
          if (_this.treeData.createSectionState == 1) {
            _this.modelFormData.title = '新增章节'
            _this.modelFormData.editObj = {
              id: null,
              name: '',
              parentId: _this.selectedNode.id,
              toRoot: true
            }
          } else if (_this.treeData.createSectionState == 2) {
            _this.modelFormData.title = '编辑章节'
            _this.modelFormData.editObj = {
              id: _this.selectedNode.id,
              name: _this.selectedNode.name
            }

          }
          _this.modelFormData.visible = true

        }
        if (from == 2) {//knowledge
          if (_this.treeData.createKnowledgeState == 1) {
            _this.modelFormData.title = '新增知识点'
            _this.modelFormData.editObj = {
              id: null,
              name: '',
              parentId: _this.selectedNode.id,
              toRoot: false
            }
          } else if (_this.treeData.createKnowledgeState == 2) {
            _this.modelFormData.title = '编辑知识点'
            _this.modelFormData.editObj = {
              id: _this.selectedNode.id,
              name: _this.selectedNode.name
            }
          }
          _this.modelFormData.visible = true

        }
      },
      modelFormCancel(name){
        //清空填写的内容
        this.$refs[name].resetFields();
        //隐藏modal
        this.modelFormData.visible = false;
      },
      modelFormSubmit(name){
        var _this = this;
        this.$refs[name].validate(function (valid) {
          if (valid) {
            // loading && submit by ajax
            _this.modelFormData.loading = true;

            var creating = true;
            if (_this.modelFormData.editObj.id) {
              creating = false;
            }
            console.log(_this.modelFormData.editObj)
            ezjsUtil.request(apiConstants.department_createNodeUnderParent, _this.modelFormData.editObj,
              function (err, data) {
                if (err) {
                  return;
                }
                //清空填写的内容
                _this.$refs[name].resetFields();
                _this.treeDataRefresh()
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
      treeNodeRemove(){
        var _this = this, msg = '';
        if (_this.selectedNode.childrenSize != 0) {//有子节点,无法删除
          msg = '请先删除章节下的知识点,在删除章节!';
          return _this.$Modal.error({
            title: '删除失败',
            content: '<p>' + msg + '</p>',
          })
        }
        if (_this.treeData.createSectionState == 2) {
          msg += '章节'
        }
        if (_this.treeData.createKnowledgeState == 2) {
          msg += '知识点'
        }
        msg += '<b> ' + _this.selectedNode.name + ' </b>';
        _this.$Modal.confirm({
          title: '确认删除么',
          content: '<p>您确定删除' + msg + '么?</p>',
          loading: true,
          onOk() {
            ezjsUtil.request(apiConstants.department_RemoveById,
              {
                _id: _this.selectedNode.id
              },
              function (err, data) {
                _this.$Modal.remove();
                if (err) {
                  return;
                }
                _this.$Message.success('删除成功!');
                _this.treeDataRefresh(_this.selectedNode.parentId)

              }
            )
          }
        });
      },
      route2Import(){
        this.$router.push('/company/staff/' + this.selectedNode.id + '/import');
      },
      route2Create(){
        this.$router.push('/company/staff/' + this.selectedNode.id + '/staffEdit?t=' + Math.random());
      }
    }

  }
</script>
