export default new VueRouter({
  routes: [
    {
      path: '/',
      component (resolve) {
        require(['../components/layout'], resolve)
      },
      children: [
        {
          path: '/',
          component(resolve){
            require(['../views/welcome'], resolve)
          }
        },
        {
          path: '/welcome',
          component(resolve){
            require(['../views/welcome'], resolve)
          }
        },
        {
          path: '/company/leader',
          component(resolve){
            require(['../views/company/leaders'], resolve)
          }
        },
        {
          path: '/company/course',
          component (resolve) {
            require(['../views/course/course.vue'], resolve);
          },
          children: [
            {
              path: ':subjectId',
              component (resolve) {
                require(['../views/course/course_list.vue'], resolve);
              },
            },
            {
              path: ':subjectId/import',
              component (resolve) {
                require(['../views/course/course_import_by_xls.vue'], resolve);
              },
            },
            {
              path: ':subjectId/question/:id',
              component (resolve){
                require(['../views/course/course_question_detail.vue'], resolve)
              }
            },
            {
              path: ':subjectId/questionEdit',
              component (resolve){
                require(['../views/course/course_question_edit.vue'], resolve)
              }
            },
          ]
        },
        // ----------------------------------------------------------
        // 素材管理
        {
          path: '/company/documents',
          component (resolve) {
            require(['../views/documents/documents.vue'], resolve);
          },
          children: [
            {
              path: ':subjectId',
              component (resolve) {
                require(['../views/documents/documents_list.vue'], resolve);
              },
            },
          ]
        },
        // 课程管理
        {
          path: '/courseManage/courseManage/:type',
          component (resolve) {
            require(['../views/courseManage/course.vue'], resolve);
          },
          children: [
            {
              path: 'list/:id',
              component (resolve) {
                require(['../views/courseManage/course_list.vue'], resolve);
              },
            },
            {
              path: 'documentList/:courseId',
              component (resolve) {
                require(['../views/courseManage/course_documentList.vue'], resolve);
              },
            },
          ]
        },
        // 讲师管理
        {
          path: '/teacherManage',
          component (resolve) {
            require(['../views/teacherManage/teacher.vue'], resolve);
          },
        },
        // 用户管理
        {
          path: '/userManage',
          component (resolve) {
            require(['../views/userManage/userManage.vue'], resolve);
          },
        },
        // 焦点图管理
        {
          path: '/infoBannerManage',
          component (resolve) {
            require(['../views/infoBanner/infoBannerManage.vue'], resolve);
          },
        },
        // 登录用户信息
        {
          path: '/userInfo',
          component (resolve) {
            require(['../views/userInfo/userInfo.vue'], resolve);
          },
        },
        // 订单管理
        {
          path: '/orderManage',
          component (resolve) {
            require(['../views/order/orderManage.vue'], resolve);
          },
        },
        // -------------------------------------------------------------------
        {
          path: '/company/staff',
          component (resolve) {
            require(['../views/staff/staffs.vue'], resolve);
          },
          children: [
            {
              path: ':nodeId',
              component (resolve) {
                require(['../views/staff/staffs_list.vue'], resolve);
              },
            },
            {
              path: ':nodeId/import/',
              component (resolve) {
                require(['../views/staff/staffs_import_by_xls.vue'], resolve);
              },
            },
            {
              path: ':nodeId/staffDetail/:id',
              component (resolve) {
                require(['../views/staff/staffs_detail.vue'], resolve);
              },
            },
            {
              path: ':nodeId/staffEdit',
              component (resolve) {
                require(['../views/staff/staffs_edit.vue'], resolve);
              },
            },

          ]
        },

        {
          path: '/company/exam',
          component (resolve) {
            require(['../views/exam/exam.vue'], resolve);
          },
          children: [
            {//考试列表
              path: 'list',
              component (resolve) {
                require(['../views/exam/exam_list.vue'], resolve);
              },
            },
            {//考试详情
              path: 'detail/:id',
              component (resolve) {
                require(['../views/exam/exam_detail.vue'], resolve);
              },
            },
            {//考试编辑
              path: 'edit',
              component (resolve) {
                require(['../views/exam/exam_edit.vue'], resolve);
              },
            },
            {//考试的 试卷列表
              path: 'paperList/:id',
              component (resolve) {
                require(['../views/exam/exam_paper_list.vue'], resolve);
              },
            },
            {//考试中的试卷详情
              path: ':examId/paperDetail/:id',
              component (resolve) {
                require(['../views/exam/exam_paper_detail.vue'], resolve);
              },
            },
            {//考试过程监控
              path: 'monitor/:id',
              component (resolve) {
                require(['../views/exam/exam_monitor.vue'], resolve);
              },
            },
            {//监控状态下(阅卷之前). 学生答题详情.试卷详情.
              path: 'monitorPaperOfStaff/:examId/:staffPaperInExamId',
              component (resolve) {
                require(['../views/exam/exam_monitor_paperOfStaff.vue'], resolve);
              },
            },

            {//考试结果,参与考试的学生列表. FIXME:这个和考试过程监控 目前似乎实现方式相同.(建议把上面两个页面取消)
              path: 'paperOfStaffList/:id',
              component (resolve) {
                require(['../views/exam/exam_paperOfStaff_list.vue'], resolve);
              },
            },
            {//阅卷结果,
              path: 'paperOfStaffMarking/:examId/:staffPaperInExamId',
              component (resolve) {
                require(['../views/exam/exam_paperOfStaff_marking.vue'], resolve);
              },
            },


          ]
        },

      ]
    },
  ]
});

