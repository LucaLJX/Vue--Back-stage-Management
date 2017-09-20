<style scoped lang="less">
    .lr-import-1-container {
        border: 1px solid #ddd;
        margin-top: 20px;

        .lr-import-1-middle {
            border-top: 1px solid #ddd;
            padding: 16px;
            font-size: 14px;

            .lr-import-1-bottom-text {
                font-size: 12px;
                line-height: 20px;
            }
            p{
                line-height: 2.5;
            }
        }
    }
</style>
<template>
    <div class="lr-right-middle">
        <div class="history-back-container">
            <i-button type="ghost" size="small" onclick="history.back()"><Icon type="android-arrow-back"></Icon>&nbsp;返回</i-button>
        </div>
    </div>
    <div class="lr-import-1-container">
        <div class="lr-import-steps-container">
            <Steps class="lr-import-steps" :current="currentStep">
                <Step class="lr-import-step" title="选择文件"></Step>
                <Step class="lr-import-step" title="解析中"></Step>
                <Step class="lr-import-step" title="导入完成"></Step>
            </Steps>
        </div>
        <div class="lr-import-1-middle" v-show="currentStep == 0">
            <p class="common-top-margin-15">批量导入题目到课程:<span class="color-primary">{{ $parent.$data.treeData.currentRoot.label }}</span></p>
            <p class="common-top-margin-15">题干相同时,是否覆盖:
                <span class="color-primary">
                    <Switch :checked.sync="rewrite" size="large">
                        <span slot="open">覆盖</span>
                        <span slot="close">忽略</span>
                    </Switch>
                </span>
            </p>

            <p class="common-top-margin-15">请选择要导入的文件
                <span class="color-primary">
                    <Upload action="/api/common/file/uploadTmp"
                        :on-success="handleUploadSuccess" :format="['xls']" accept="application/vnd.ms-excel"
                        :max-size="20480"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        >
                        <i-button type="ghost" icon="ios-cloud-upload-outline">上传文件</i-button>
                    </Upload>
                </span>
            </p>

        </div>
        <div class="lr-import-1-middle" v-show="currentStep == 0">
            <div class="lr-import-1-bottom-text">
                <h3 class="common-top-margin-15">导入说明：</h3>
                <p>1.请使用Excel等软件编辑模板文件，点击<a href="/api/file/sys/数据库考试系统V2--题目导入模板.xls" target="_blank">下载模版</a>：</p>
                <p>2.该模板文件共有4个工作表，按顺序依次为:选择题、填空题、判断题、主观题</p>
                <p>3.每个工作表各列内容不完全相同，请参考示例填写，特殊列说明：</p>
                <p>(1)唯一编号，主要用于导出结果提醒，方便定位题目</p>
                <p>(2)章节和知识点不存在时，导入过程中，系统会自动创建</p>
                <p>(3)导入时优先根据‘题干’列进行匹配，若在该章节/知识点下匹配到该题干信息，则可按需覆盖或者忽略</p>
            </div>
        </div>
        <div class="lr-import-1-middle" v-show="currentStep == 1">
            <p class="common-top-margin-15">批量导入题目到<span class="color-primary">{{ $parent.$data.treeData.currentRoot.label }}</span></p>
            <p class="common-top-margin-15">文件上传成功,正在解析中,请耐心等待......</p>
        </div>
        <div class="lr-import-1-middle" v-show="currentStep == 2">
            <p class="common-top-margin-15">批量导入题目到<span class="color-primary">{{ $parent.$data.treeData.currentRoot.label }}</span></p>
            <p class="common-top-margin-15">文件解析完成.</p>
            <p class="common-top-margin-15"></p>
            <p class="common-top-margin-15">成功导入: {{ parseMess.succAll }}条, 其中:</p>
            <p class="common-top-margin-15">选择题: {{ parseMess.succ0 }}条</p>
            <p class="common-top-margin-15">填空题: {{ parseMess.succ1 }}条</p>
            <p class="common-top-margin-15">判断题: {{ parseMess.succ2 }}条</p>
            <p class="common-top-margin-15">主观题: {{ parseMess.succ3 }}条</p>
            <p class="common-top-margin-15"></p>
            <p class="common-top-margin-15">失败: {{ parseMess.failAll }}条, 详情如下:</p>
            <i-table class="z-table" border :content="tableData.self" :columns="tableData.columns"
                     :data="parseMess.errorMesses" stripe></i-table>
        </div>
    </div>
</template>

<script>
    import dict from '../../libs/dict'
    import Vue from 'vue'
    var ezjsUtil = Vue.ezjsUtil;
    var apiConstants = ezjsUtil.constants.api;
    var su = ezjsUtil.sessionUtil;

    export default{
        props: {},
        data(){
            return {
                dict: dict,
                currentStep: 0,
                parseMess: {},
                tableData: {
                    self: this,
                    columns: [
                        { type: 'index', width: 40, align: 'center' },
                        { title: '题目类型', key: 'type' },
                        { title: '题目编号', key: 'code' },
                        { title: '失败原因', key: 'reson' },
                    ],
                },
                rewrite: false
            }
        },
        components: {},
        filters: {},
        route: {
            data: function (transition) {
            }
        },
        methods: {
            handleUploadSuccess(res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
                // 将上传成功的文件地址交由后台进行业务处理
                this.parseXlsFile(res.data.name)
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 xls 格式的文件。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 20M。'
                });
            },
            parseXlsFile(fileName){
                var _this = this;
                _this.currentStep = 1;
                ezjsUtil.request(apiConstants.question_import2RootFromXls,
                    {
                        fileName: fileName,
                        courseId: _this.$parent.$data.treeData.currentRoot.id,
                        rewrite: _this.rewrite
                    },
                    function (err, data) {
                        if (err) {
                            return;
                        }
                        console.log(data)
                        _this.currentStep = 2;
                        _this.parseMess = data;
                    }
                );
            }
        }
    }
</script>
