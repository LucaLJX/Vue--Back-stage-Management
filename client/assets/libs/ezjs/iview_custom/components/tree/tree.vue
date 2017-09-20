<template>
  <div :class="prefixCls">
    <Ezjs-Tree-node
      v-for="item in data"
      :key="item"
      :data="item"
      visible>
    </Ezjs-Tree-node>
    <div :class="[prefixCls + '-empty']" v-if="!data.length">{{ localeEmptyText }}</div>
  </div>
</template>
<script type="text/ecmascript-6">
  import EzjsTreeNode from './node.vue';
  import {findComponentsDownward} from '../../utils/assist';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';

  const prefixCls = 'ivu-tree';

  export default {
    name: 'EzjsTree',
    mixins: [Emitter, Locale],
    components: {EzjsTreeNode},
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      emptyText: {
        type: String
      }
    },
    data () {
      return {
        prefixCls: prefixCls
      };
    },
    computed: {
      localeEmptyText () {
        if (this.emptyText === undefined) {
          return this.t('i.tree.emptyText');
        } else {
          return this.emptyText;
        }
      }
    },
    methods: {
      //获取被选中的节点
      getSelectedNodes () {
        const nodes = findComponentsDownward(this, 'EzjsTreeNode');
        return nodes.filter(node => node.data.selected).map(node => node.data);
      },
      // 展开并选中指定节点, 可以不是根节点
      setSelectedNodeWithExpand(id){
        var _this = this;
        var resArr = [];
        // 深度遍历, 找到这些节点
        function dfs(root) {
          if (root.id == id) {
            root.selected = true;
            if (root.children && root.children.length) {
              root.expand = true;
            }
            resArr.push({
              id: root.id,
              selected: true,
              expand: root.children && root.children.length > 0
            })
          } else {
            if (root.children && root.children.length) {
              for (var index = 0; index < root.children.length; index++) {
                var node = root.children[index];
                dfs(node);
                if (node.selected || node.expand) {
//                  console.log(JSON.stringify(node));
                  root.expand = true;
                  resArr.push({
                    id: root.id,
                    selected: false,
                    expand: true
                  })
                } else {
                }
              }
            } else {

            }
          }
        }

        this.data.forEach(root => {
          dfs(root);
        })

        //取消选中
        const nodes = findComponentsDownward(_this, 'EzjsTreeNode');
        nodes.forEach(node => {
          var inArr = null;
          var nodeId = node.data.id;
          for (var index = 0; index < resArr.length; index++) {
            var ch = resArr[index];
            if (ch.id == nodeId) {
              inArr = ch;
            }
          }
          if (inArr) {
            _this.$set(node.data, 'selected', inArr.selected);
            _this.$set(node.data, 'expand', inArr.expand);
          } else {
            _this.$set(node.data, 'selected', false);
          }
        });

        this.$emit('on-select-change', this.getSelectedNodes());
      },
      updateData (isInit = true) {
      }
    },
    mounted () {
      this.updateData();
      this.$on('selected', ori => {
        const nodes = findComponentsDownward(this, 'EzjsTreeNode');
        nodes.forEach(node => {
          this.$set(node.data, 'selected', false);
        });
        this.$set(ori, 'selected', true);
      });
      this.$on('on-selected', () => {
        this.$emit('on-select-change', this.getSelectedNodes());
      });
      this.$on('toggle-expand', (payload) => {
        this.$emit('on-toggle-expand', payload);
      });
    },
    watch: {
      data () {
        this.$nextTick(() => {
          this.updateData();
        });
      }
    }
  };
</script>
