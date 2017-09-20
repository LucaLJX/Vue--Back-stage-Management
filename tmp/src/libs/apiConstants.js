let apiConstants = {

    'company_flip': {
        url: '/admin/company/flip',
        method: 'post',
        desc: ''
    },
    'company_edit': {
        url: '/admin/company/edit',
        method: 'post',
        desc: ''
    },
    'company_removeById': {
        url: '/admin/company/remove/:id',
        method: 'get',
        desc: ''
    },

    'leader_flip': {
        url: '/company/leader/flip',
        method: 'post',
        desc: ''
    },
    'leader_edit': {
        url: '/company/leader/edit',
        method: 'post',
        desc: ''
    },
    'leader_removeById': {
        url: '/company/leader/remove/:id',
        method: 'get',
        desc: ''
    },
    'leader_grantClass': {
        url: '/company/leader/grantClass',
        method: 'post',
        desc: '给指定教师授权班级'
    },
    'leader_grantedClass': {
        url: '/company/leader/grantedClass',
        method: 'post',
        desc: '获得教师所有授权的班级信息'
    },


    'course_allSubjectTree': {
        url: '/company/course/allSubjectTree/:companyId',
        method: 'get',
        desc: '指定学校的所有课程及其下的专题的树形结构.'
    },
    'course_subject_allQuestionStem': {
        url: '/company/course/subject/questionStem',
        method: 'post',
        desc: '获得指定专题下的所有题干信息.'
    },
    'course_subject_createNodeUnderParent': {
        url: '/company/course/subject/createNodeUnderParent',
        method: 'post',
        desc: '在指定节点下创建节点.(章节或者知识点).'
    },
    'course_subject_RemoveById': {
        url: '/company/course/subject/remove/:id',
        method: 'post',
        desc: '删除节点.(章节或者知识点).'
    },

    'question_import2RootFromXls': {
        url: '/company/question/import2RootFromXls',
        method: 'post',
        desc: ''
    },
    'question_detail': {
        url: '/company/question/detail/:id',
        method: 'post',
        desc: ''
    },
    'question_edit': {
        url: '/company/question/edit',
        method: 'post',
        desc: ''
    },
    'question_RemoveByStemId': {
        url: '/company/question/remove/:id',
        method: 'post',
        desc: ''
    },

    'department_tree': {
        url: '/company/department/tree/:companyId',
        method: 'get',
        desc: '指定学校的所有学院/专业/年级的树形结构.'
    },
    'department_createNodeUnderParent': {
        url: '/company/department/createNodeUnderParent',
        method: 'post',
        desc: '在指定节点下创建节点.(学院/专业/年级).'
    },
    'department_RemoveById': {
        url: '/company/department/remove/:id',
        method: 'post',
        desc: '删除节点.(学院/专业/年级).'
    },
    'staff_list': {
        url: '/company/staff/list',
        method: 'post',
        desc: '获得指定专业下的所有学生信息.'
    },
    'staff_import2RootFromXls': {
        url: '/company/staff/import2RootFromXls',
        method: 'post',
        desc: ''
    },
    'staff_detail': {
        url: '/company/staff/detail/:id',
        method: 'post',
        desc: ''
    },
    'staff_edit': {
        url: '/company/staff/edit',
        method: 'post',
        desc: ''
    },
    'staff_resetPassword': {
        url: '/company/staff/resetPassword/:id',
        method: 'post',
        desc: ''
    },
    'staff_RemoveById': {
        url: '/company/staff/remove/:id',
        method: 'post',
        desc: ''
    },

    'exam_flip': {
        url: '/company/exam/flip',
        method: 'post',
        desc: ''
    },
    'exam_edit': {
        url: '/company/exam/edit',
        method: 'post',
        desc: ''
    },
    'exam_detail': {
        url: '/company/exam/detail/:id',
        method: 'post',
        desc: ''
    },
    'exam_removeById': {
        url: '/company/exam/remove/:id',
        method: 'get',
        desc: ''
    },
    'exam_generatePaper': {
        url: '/company/exam/generatePaper/:id',
        method: 'post',
        desc: ''
    },
    'exam_viewPaper': {
        url: '/company/exam/flipPaper/:id',
        method: 'post',
        desc: ''
    },
    'exam_paperDetail': {
        url: '/company/exam/paper/detail/:id',
        method: 'post',
        desc: ''
    },
    'exam_staffPaperScoreDetail': {
        url: '/company/exam/staff/paper/detail/:staffPaperInExamId',
        method: 'post',
        desc: '学生考试试卷得分信息'
    },
    'exam_removePaper': {
        url: '/company/exam/paper/remove/:id',
        method: 'post',
        desc: ''
    },
    'exam_releaseById': {
        url: '/company/exam/release/:id',
        method: 'get',
        desc: ''
    },
    'exam_releaseCancelById': {
        url: '/company/exam/releaseCancel/:id',
        method: 'get',
        desc: ''
    },

    'exam_testing_monitor': {
        url: '/company/exam/testing/monitor/:id',
        method: 'post',
        desc: ''
    },
    'exam_testing_viewPaperOfStaff': {
        url: '/company/exam/testing/viewPaperOfStaff',
        method: 'post',
        desc: ''
    },
    'exam_testing_autoMarkingPaperOfStaff': {
        url: '/company/exam/testing/autoMarkingPaperOfStaff',
        method: 'post',
        desc: ''
    },


};


export default apiConstants;