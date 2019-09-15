import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import home from '../views/home/'
import login from '../views/login/'
import article from '../views/home/article/'

const routes = [
    { path: '/login', component: login },
    {
        path: '/home',
        component: home,
        children: [
            { path: "/article", component: article }
        ]
    },
    { path: '', redirect: '/login' },
]

const router = new VueRouter({
    routes
})

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
    NProgress.start();

    if (to.path == "/home") {
        let res = window.localStorage.getItem('userInfo')
        if (res) {
            next()
        } else {
            Vue.prototype.$message.error('请先登录！')
            router.push('/login')
        }
    } else {
        next();
    }
})

export default router