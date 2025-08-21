import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import HomeView from '../views/HomeView.vue'
import Search from '../views/search.vue'
import Show from '../views/show.vue'
import Contribution from '../views/contribution.vue'
import Cookies from 'js-cookie'

const routes = [
    {
        path: '/',  // 根路径
        redirect: '/login'  // 重定向到登录页
    },
    {
        path: '/login',
        name: 'Login',
        component: Login  // 引入登录组件
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/index',
        name: 'Index',
        component: () => import('../views/system/index.vue'),
        children: [
            {
                path: 'system/user',
                name: 'User',
                component: () => import('../views/system/user.vue'),
            },
            {
                path: 'system/role',
                name: 'Role',
                component: () => import('../views/system/role.vue'),
            },
            {
                path: 'system/menu',
                name: 'Menu',
                component: () => import('../views/system/menu.vue'),
            },
            {
                path: 'system/contributionCheck',
                name: 'ContributionCheck',
                component: () => import('../views/system/contributionCheck.vue'),
            }

        ]
    },
    {
        path: '/HomeView',
        name: 'HomeView',
        component: HomeView,
        children: [
            {
                path: '',
                name: 'search',
                component: Search
            },
            {
                path: 'show/:title/:lineNumber',
                name: 'show',
                component: Show,
                props: true  // 允许将路由参数作为props传递
            },
            {
                path: 'contribution',
                name: 'Contribution',
                component: () => import('../views/Contribution.vue')
            }
        ]
    }


]

const router = createRouter({
    history: createWebHistory(),  // 使用HTML5 history模式
    routes
})

router.beforeEach((to, from, next) => {
    // 白名单：无需登录即可访问的页面
    const whiteList = ['/login', '/register']
    if (whiteList.includes(to.path)) {
        next()
        return
    }

    // 验证 Cookie 中是否存在用户信息
    const userCookie = Cookies.get('currentUser')
    if (userCookie) {
        // 已登录：允许访问
        next()
    } else {
        // 未登录：强制跳转到登录页
        next('/login')
    }
})

export default router