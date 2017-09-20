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

    '/index': {
        component (resolve) {
            require(['./views/index.vue'], resolve);
        },
    },
    '/staff/index': {
        component (resolve) {
            require(['./views/index.vue'], resolve);
        },
    },

    '/staff/exam': {
        component (resolve) {
            require(['./views/staff/exam.vue'], resolve);
        },
        auth: 'staff',
        subRoutes: {
            'list': {
                component (resolve) {
                    require(['./views/staff/exam_list.vue'], resolve);
                },
            },
            'detail/:id': {
                component (resolve){
                    require(['./views/staff/exam_detail.vue'], resolve)
                }
            },
            'testing/:examId': {
                component (resolve){
                    require(['./views/staff/exam_testing.vue'], resolve)
                }
            },
        }
    },

    '/403': {
        component (resolve) {
            require(['./views/403.vue'], resolve);
        },
    },

};
export default routers;