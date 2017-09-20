<template>
    <div class="treeview {{class}}">
        <div class="node-data" v-for="(index, node) in model">
            <div class="node" :class="{'active': isSelected(index)}" @click.prevent="select(index, node[valuename])">
                <span class="icon node-parent-toggled" v-show="areValidNodes(node[children]) && isOpened(index)">
                    <img src="/src/images/tree-view-open.png">
                </span>
                <span
                    class="icon node-parent" v-show="areValidNodes(node[children]) && !isOpened(index)">
                    <img src="/src/images/tree-view-close.png">
                </span>
                <span class="icon node" v-if="!areValidNodes(node[children])">
                    <img src="/src/images/tree-view-file.png">
                </span>
                <label>{{{node[labelname]}}}</label>
            </div>
            <div v-if="areValidNodes(node[children])" class="children" v-show="isOpened(index)">
                <div class="margin"></div>
                <div class="nodes">
                    <treeview :id="id" :value.sync="value" :labelname="labelname" :valuename="valuename"
                              :children="children" :model="node[children]" :parent.once="index"
                              class="inner"></treeview>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    @import "../styles/vue.tree-view.css";
    @import "../styles/vue.tree-view-custom.css";
</style>
<script>
    export default {
        props: {
            /**
             * Unique identifier for treeview.
             * @since 1.0.0
             * @var string
             */
            id: {
                Type: String,
                default: 'tv_' + Math.ceil(Math.random() * 100000),
            },
            /**
             * Value of the selected node in the tree.
             * @since 1.0.0
             * @var mixed
             */
            value: [String, Number],
            /**
             * Initial tree composition.
             * @since 1.0.0
             * @since 1.0.2 Renamed to model.
             * @var array
             */
            model: {
                Type: Array,
                default: function () {
                    return [];
                },
            },
            /**
             * Additional CSS class to apply to component.
             * @since 1.0.0
             * @var string
             */
            class: {
                Type: String,
                default: '',
            },
            /**
             * Name of the child nodes property.
             * @since 1.0.0
             * @var string
             */
            children: {
                Type: String,
                default: 'nodes',
            },
            /**
             * Name of the property holding the node name.
             * @since 1.0.0
             * @var string
             */
            labelname: {
                Type: String,
                default: 'label',
            },
            /**
             * Name of the property holding the node value.
             * @since 1.0.0
             * @var string
             */
            valuename: {
                Type: String,
                default: 'value',
            },
            /**
             * Parent node model index.
             * @since 1.0.2
             * @var int
             */
            parent: {
                Type: Number,
                default: undefined,
            },
        },
        methods: {
            /**
             * Selects a node from tree view.
             * @since 1.0.0
             * @since 1.0.1 Node is passed to event.
             *
             * @param int   index Tree index selected.
             * @param mixed value Value selected.
             */
            select: function (index, value) {
                // Unselect from current level, children and parents
                this.toggleOpen(index);
                this.$set('value', value);
                // Call to event.
                this.$dispatch('treeview_click', {
                    model: this.model[index],
                    label: this.model[index][this.labelname],
                    value: this.model[index][this.valuename],
                });
            },
            /**
             * Toggles open / close node.
             * @since 1.0.0
             *
             * @param int index Index to open
             */
            toggleOpen: function (index) {
                // Return if no children
                if (!this.areValidNodes(this.model[index][this.children]))
                    return;
                // Init
                if (this.model[index].isOpened == undefined)
                    this.$set('model[' + index + '].isOpened', this.hasSelectedChild(index));
                // General
                this.$set('model[' + index + '].isOpened', !this.model[index].isOpened);
            },
            /**
             * Returns flag indicating if nodes are valid or not.
             * @since 1.0.0
             * @since 1.0.2 Renamed
             *
             * @param array nodes Nodes to validate.
             */
            areValidNodes: function (nodes) {
                return nodes != undefined
                        && Object.prototype.toString.call(nodes) === '[object Array]'
                        && nodes.length > 0;
            },
            /**
             * Returns flag indicating if tree view has a node selected.
             * @since 1.0.2
             *
             * @return bool
             */
            hasSelected: function () {
                // Check children
                for (var i in this.model) {
                    if (this.isSelected(i) || this.hasSelectedChild(i))
                        return true;
                }
                return false;
            },
            /**
             * Returns flag indicating if node at specified index has a child selcted or not.
             * @since 1.0.2
             *
             * @param int index Index to check
             *
             * @return bool
             */
            hasSelectedChild: function (index) {
                for (var i in this.$children) {
                    if (this.$children[i].parent == index
                            && this.$children[i].hasSelected()
                    )
                        return true;
                }
                return false;
            },
            /**
             * Returns flag indicating if node at specified index is selected or not.
             * @since 1.0.2
             *
             * @param int index Index to check
             *
             * @return bool
             */
            isSelected: function (index) {
                return this.value && this.model[index][this.valuename] == this.value;
            },

            /**
             * Returns flag indicating if node is opened or not.
             * @since 1.0.2
             *
             * @param int index Index to check
             *
             * @return bool
             */
            isOpened: function (index) {
                return (this.model[index].isOpened != undefined && this.model[index].isOpened)
                        || this.hasSelectedChild(index);
            },
        },
    }
</script>
