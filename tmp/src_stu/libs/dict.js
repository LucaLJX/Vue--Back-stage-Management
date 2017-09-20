/**
 * Created by aresn on 16/7/18.
 */
let dict = {
    leaderRoles: [
        {
            dictKey: 1,
            dictVal: '教师组长'
        },
        {
            dictKey: 2,
            dictVal: '普通教师'
        }
    ],
    difficulty: [
        {
            dictKey: 3,
            dictVal: '易'
        },
        {
            dictKey: 6,
            dictVal: '中'
        },
        {
            dictKey: 9,
            dictVal: '难'
        }
    ],
    questionType: [
        {dictKey: 1, dictVal: '单选题'},
        {dictKey: 2, dictVal: '多选题'},
        {dictKey: 3, dictVal: '判断题'},
        {dictKey: 4, dictVal: '填空题'},
        {dictKey: 5, dictVal: '主观题'},
    ],
    staffSex: [
        {dictKey: 1, dictVal: '男'},
        {dictKey: 0, dictVal: '女'},
    ],
    examStatus: [
        {dictKey: 1, dictVal: '已创建'},
        {dictKey: 2, dictVal: '生成试卷中'},
        {dictKey: 3, dictVal: '已生成试卷'},
        {dictKey: 4, dictVal: '已发布'},
        {dictKey: 5, dictVal: '考试开始'},
        {dictKey: 6, dictVal: '考试结束'},
        {dictKey: 12, dictVal: '结束'},

    ],
};

dict.getVal = function (name, key) {
    var arr = dict[name];
    for(var i in arr) {
        var item = arr[i];
        if(item.dictKey == key) {
            return item.dictVal;
        }
    }
    return "";
};

export default dict;