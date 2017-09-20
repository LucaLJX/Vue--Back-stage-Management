let apiConstants = {

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
    url: '/company/course/allSubjectTree',
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
    method: 'get',
    desc: ''
  },

  'department_tree': {
    url: '/company/department/tree',
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
    method: 'get',
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

  //exam

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
    method: 'post',
    desc: ''
  },
  'exam_generatePaper': {
    url: '/company/exam/paper/generate/:id',
    method: 'post',
    desc: ''
  },
  'exam_paperFlip': {
    url: '/company/exam/paper/flip/:id',
    method: 'post',
    desc: ''
  },
  'exam_paperDetail': {
    url: '/company/exam/paper/detail/:id',
    method: 'post',
    desc: ''
  },
  'exam_removePaper': {
    url: '/company/exam/paper/remove/:id',
    method: 'post',
    desc: ''
  },
  'exam_releaseById': {
    url: '/company/exam/release/:id',
    method: 'post',
    desc: ''
  },
  'exam_releaseCancelById': {
    url: '/company/exam/releaseCancel/:id',
    method: 'post',
    desc: ''
  },

  'exam_staffPaperScoreDetail': {
    url: '/company/exam/staff/paper/detail/:staffPaperInExamId',
    method: 'post',
    desc: '学生考试试卷得分信息'
  },
  'exam_testing_monitor': {
    url: '/company/exam/testing/monitor/:id',
    method: 'post',
    desc: ''
  },
  'exam_testing_viewPaperOfStaffInMonitor': {
    url: '/company/exam/testing/viewPaperOfStaffInMonitor',
    method: 'post',
    desc: ''
  },
  'exam_testing_autoMarkingPaperOfStaff': {
    url: '/company/exam/testing/autoMarkingPaperOfStaff',
    method: 'post',
    desc: ''
  },
  'exam_testing_viewPaperMarkingResult': {
    url: '/company/exam/testing/viewPaperMarkingResult',
    method: 'post',
    desc: ''
  },

  // ------------------------------------------------------------------------
  // 素材管理--树管理--zjs
  'co_docTree_getTreeList': {
    url: '/co/docTree/getTreeList',
    method: 'post',
    desc: '获取素材树数据'
  },
  'co_docTree_edit': {
    url: '/co/docTree/edit',
    method: 'post',
    desc: '新增、修改素材树'
  },
  'co_docTree_remove': {
    url: '/co/docTree/remove/:id',
    method: 'get',
    desc: '删除素材树节点'
  },
  // 素材管理--文件管理--zjs
  'co_documentation_flipByCoDocTreeCode': {
    url: '/co/documentation/flipByCoDocTreeCode',
    method: 'post',
    desc: '根据code获取树节点上面的文件列表'
  },
  'co_documentation_edit': {
    url: '/co/documentation/edit',
    method: 'post',
    desc: '新增修改文件'
  },
  'co_documentation_detail': {
    url: '/co/documentation/detail/:id',
    method: 'get',
    desc: '根据id查看文件详情'
  },
  'co_documentation_remove': {
    url: '/co/documentation/remove/:id',
    method: 'get',
    desc: '删除文件'
  },
  // 素材关联题库--zjs
  'documentationWithQuestion_bindSubjectNode2Documentation': {
    url: '/documentationWithQuestion/bindSubjectNode2Documentation',
    method: 'post',
    desc: '素材关联题库试题节点'
  },
  'documentationWithQuestion_getSubjectCode': {
    url: '/documentationWithQuestion/getSubjectCode/:documentationId',
    method: 'get',
    desc: '获取素材文件下关联的试题节点数据'
  },
  // 模块管理--zjs
  // 21--焦点图
  // 51--课程-UCM
  // 52--课程-专业能力
  // 53--课程-通识类
  'documentInModule_getCoModuleByType': {
    url: '/documentInModule/getCoModuleByType',
    method: 'post',
    desc: '根据type获取不同类型的模块树'
  },
  'documentInModule_edit': {
    url: '/documentInModule/edit',
    method: 'post',
    desc: '修改不同type下面的树节点'
  },
  'documentInModule_remove': {
    url: '/documentInModule/remove/:id',
    method: 'get',
    desc: '删除不同type下的树节点'
  },
  // 课程管理--zjs
  'ace_course_createOrUpdate': {
    url: '/ace/course/createOrUpdate',
    method: 'post',
    desc: '新增、修改课程'
  },
  'ace_course_flip': {
    url: '/ace/course/flip',
    method: 'post',
    desc: '获取课程数据'
  },
  'ace_course_detail': {
    url: '/ace/course/detail',
    method: 'post',
    desc: '查看课程详情'
  },
  'ace_course_removeCourse': {
    url: '/ace/course/removeCourse',
    method: 'post',
    desc: '删除课程'
  },
  // 课程文件关联--zjs
  'ace_courseRefDoc_flipDocumentationsOfCourse': {
    url: '/ace/courseRefDoc/flipDocumentationsOfCourse',
    method: 'post',
    desc: '分页查看课程下已经关联的素材'
  },
  'ace_courseRefDoc_removeDocsFromCourse': {
    url: '/ace/courseRefDoc/removeDocsFromCourse',
    method: 'post',
    desc: '删除课程下已经关联的素材'
  },
  'ace_courseRefDoc_addVideoByDocumentation': {
    url: '/ace/courseRefDoc/addVideoByDocumentation',
    method: 'post',
    desc: '关联素材到课程下面'
  },
  'ace_courseRefDoc_flipDocumentationsNotRelated2Course': {
    url: '/ace/courseRefDoc/flipDocumentationsNotRelated2Course',
    method: 'post',
    desc: '关联素材到课程下面'
  },
  'ace_courseRefDoc_updateDocInfoInCourse': {
    url: '/ace/courseRefDoc/updateDocInfoInCourse',
    method: 'post',
    desc: '修改课程下关联的素材排序'
  },
  'ace_courseRefDoc_setDocAsFree': {
    url: '/ace/courseRefDoc/setDocAsFree',
    method: 'post',
    desc: '修改课程下某个素材为免费'
  },
  // 模块文件关联--zjs
  'documentRefModule_flipDocInModule': {
    url: '/documentRefModule/flipDocInModule',
    method: 'post',
    desc: '查看课程下已经关联的素材'
  },
  'documentRefModule_flipByCoDocTreeCodeNotSelect': {
    url: '/documentRefModule/flipByCoDocTreeCodeNotSelect',
    method: 'post',
    desc: '查看课程下未关联的素材'
  },
  'documentInModule_addDoc2Module': {
    url: '/documentInModule/addDoc2Module',
    method: 'post',
    desc: '关联素材到模块'
  },
  'documentInModule_removeDocFromModuleByMhdIds': {
    url: '/documentInModule/removeDocFromModuleByMhdIds',
    method: 'post',
    desc: '删除模块下关联的素材'
  },
  'documentRefModule_updateSortNum': {
    url: '/documentRefModule/updateSortNum',
    method: 'post',
    desc: '修改模块下关联素材的sortNum'
  },
  // 讲师管理--zjs
  'ace_teacher_createOrUpdate': {
    url: '/ace/teacher/createOrUpdate',
    method: 'post',
    desc: '新增修改讲师'
  },
  'ace_teacher_flip': {
    url: '/ace/teacher/flip',
    method: 'post',
    desc: '查询讲师列表'
  },
  'ace_teacher_detail': {
    url: '/ace/teacher/detail',
    method: 'post',
    desc: '根据id查看讲师详情'
  },
  'ace_teacher_remove': {
    url: '/ace/teacher/remove',
    method: 'post',
    desc: '根据id查看讲师详情'
  },
  // 个人信息管理--zjs
  'company_leader_detailSelf': {
    url: '/company/leader/detailSelf',
    method: 'get',
    desc: '查询当前登录信息'
  },
  'company_leader_editName': {
    url: '/company/leader/editName',
    method: 'post',
    desc: '修改信息'
  },
  'company_leader_updatePassword': {
    url: '/company/leader/updatePassword',
    method: 'post',
    desc: '修改密码'
  },
  // 用户管理 -- zjs
  'company_department_tree': {
    url: '/company/department/tree',
    method: 'get',
    desc: '获取所有的部门'
  },
  'company_staff_list': {
    url: '/company/staff/list',
    method: 'post',
    desc: '获取用户table数据'
  },
  // 订单管理 -- zjs
  'ace_order_flip': {
    url: '/ace/order/flip',
    method: 'post',
    desc: '获取课程订单数据'
  },

};


export default apiConstants;
