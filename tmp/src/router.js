/**
 * Created by aresn on 16/8/22.
 */
const routers = {
    '/login': {
        component (resolve) {
            require(['./views/login.vue'], resolve);
        }
    },
    '/login/:companyName': {
        component (resolve) {
            require(['./views/login.vue'], resolve);
        }
    },
    '/adminLogin': {
        component (resolve) {
            require(['./views/login.vue'], resolve);
        }
    },


    '/index': {
        component (resolve) {
            require(['./views/index.vue'], resolve);
        },
    },

    //route for 运营管理平台
    '/admin/index': {
        component (resolve) {
            require(['./views/admin/index.vue'], resolve);
        },
        auth: 'admin',
    },
    '/admin/companies': {
        component (resolve) {
            require(['./views/admin/companies.vue'], resolve);
        },
        auth: 'admin',
    },

    //route for 学校管理平台
    '/company/index': {
        component (resolve) {
            require(['./views/index.vue'], resolve);
        },
        auth: 'leader',
    },

    '/company/staffs': {
        component (resolve) {
            require(['./views/company/staffs.vue'], resolve);
        },
        auth: 'leader',
        subRoutes: {
            'list/:id': {
                component (resolve) {
                    require(['./views/company/staffs_list.vue'], resolve);
                },
            },
            'import/:id': {
                component (resolve) {
                    require(['./views/company/staffs_import_by_xls.vue'], resolve);
                },
            },
            'detail/:id': {
                component (resolve){
                    require(['./views/company/staffs_detail.vue'], resolve)
                }
            },
            'edit': {
                component (resolve){
                    require(['./views/company/staffs_edit.vue'], resolve)
                }
            },
        }
    },

    '/company/leaders': {
        component (resolve) {
            require(['./views/company/leaders.vue'], resolve);
        },
        auth: 'leader',
    },

    '/company/course': {
        component (resolve) {
            require(['./views/company/course.vue'], resolve);
        },
        auth: 'leader',
        subRoutes: {
            'list/:id': {
                component (resolve) {
                    require(['./views/company/course_list.vue'], resolve);
                },
            },
            'import/:id': {
                component (resolve) {
                    require(['./views/company/course_import_by_xls.vue'], resolve);
                },
            },
            'question/:id': {
                component (resolve){
                    require(['./views/company/course_question_detail.vue'], resolve)
                }
            },
            'question/edit': {
                component (resolve){
                    require(['./views/company/course_question_edit.vue'], resolve)
                }
            },
        }
    },

    '/company/exam': {
        component (resolve) {
            require(['./views/company/exam.vue'], resolve);
        },
        auth: 'leader',
        subRoutes: {
            'list': {
                component (resolve) {
                    require(['./views/company/exam_list.vue'], resolve);
                },
            },
            'detail/:id': {
                component (resolve){
                    require(['./views/company/exam_detail.vue'], resolve)
                }
            },
            'edit': {
                component (resolve){
                    require(['./views/company/exam_edit.vue'], resolve)
                }
            },
            'viewPaper/:id': {
                component (resolve){
                    require(['./views/company/exam_view_paper.vue'], resolve)
                }
            },
            ':examId/paperDetail/:id': {
                component (resolve){
                    require(['./views/company/exam_paper_detail.vue'], resolve)
                }
            },
            'monitor/:id': {
                component (resolve){
                    require(['./views/company/exam_monitor.vue'], resolve)
                }
            },
            'testResult/:id': {
                component (resolve){
                    require(['./views/company/exam_testing_result.vue'], resolve)
                }
            },
            'paperView/:examId/:staffPaperInExamId': {
                component (resolve){
                    require(['./views/company/exam_testing_paper.vue'], resolve)
                }
            },
            'marking/:examId/:staffPaperInExamId': {
                component (resolve){
                    require(['./views/company/exam_testing_paper_marking.vue'], resolve)
                }
            },
        }
    },

    '/403': {
        component (resolve) {
            require(['./views/403.vue'], resolve);
        },
    },

    // '/submenu': {
    //     component (resolve) {
    //         require(['./views/submenu.vue'], resolve);
    //     }
    // },
};
export default routers;