<template>
  <collapse-transition>
    <ul :class="classes" v-show="visible">
      <li>
                <span :class="arrowClasses" @click="handleExpand">
                    <Icon type="arrow-right-b"></Icon>
                </span>
        <span :class="titleClasses" v-html="data.title" @click="handleSelect"></span>
        <Ezjs-Tree-node
          v-for="item in data.children"
          :key="item"
          :data="item"
          :visible="data.expand">
        </Ezjs-Tree-node>
      </li>
    </ul>
  </collapse-transition>
</template>
<script type="text/ecmascript-6">
  import Icon from '../icon/icon.vue';
  import CollapseTransition from '../base/collapse-transition';
  import Emitter from '../../mixins/emitter';
  import {findComponentsDownward} from '../../utils/assist';

  const prefixCls = 'ivu-tree';

  export default {
    name: 'EzjsTreeNode',
    mixins: [Emitter],
    components: {Icon, CollapseTransition},
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        prefixCls: prefixCls,
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}-children`
        ];
      },
      selectedCls () {
        return [
          {
            [`${prefixCls}-node-selected`]: this.data.selected
          }
        ];
      },
      arrowClasses () {
        return [
          `${prefixCls}-arrow`,
          {
            [`${prefixCls}-arrow-disabled`]: this.data.disabled,
            [`${prefixCls}-arrow-open`]: this.data.expand,
            [`${prefixCls}-arrow-hidden`]: !(this.data.children && this.data.children.length)
          }
        ];
      },
      titleClasses () {
        return [
          `${prefixCls}-title`,
          {
            [`${prefixCls}-title-selected`]: this.data.selected
          }
        ];
      }
    },
    methods: {
      handleExpand () {
        if (this.data.disabled) return;
        this.$set(this.data, 'expand', !this.data.expand);
        this.dispatch('EzjsTree', 'toggle-expand', this.data);
      },
      handleSelect () {
        if (this.data.disabled) return;
        if (this.data.selected) {
          this.dispatch('EzjsTree', 'selected', this.data);//再次触发点击
//          return; //不可以取消选中节点
//          this.data.selected = false;
        } else {
          this.dispatch('EzjsTree', 'selected', this.data);
        }
        this.dispatch('EzjsTree', 'on-selected');
      },
    },
    created () {
      // created node.vue first, mounted tree.vue second
    },
    mounted () {

    }
  };
</script>
