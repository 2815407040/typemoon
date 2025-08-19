// src/router/menuRoutes.js
// 定义系统菜单数据，与 src/router/index.js 中的路由配置对应
const menuRoutes = [
    {
        path: '/index',
        name: 'Index',
        meta: {
            title: '首页',
            icon: 'HomeFilled' // Element Plus 图标名称
        },
        children: [
            {
                path: 'system/user',
                name: 'User',
                meta: {
                    title: '用户管理',
                    icon: 'User'
                }
            },
            {
                path: 'system/role',
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'UserFilled'
                }
            },
            {
                path: 'system/menu',
                name: 'Menu',
                meta: {
                    title: '菜单管理',
                    icon: 'Menu'
                }
            }
        ]
    },
    {
        path: '/HomeView',
        name: 'HomeView',
        meta: {
            title: '内容首页',
            icon: 'House'
        },
        children: [
            {
                path: '',
                name: 'search',
                meta: {
                    title: '搜索页',
                    icon: 'Search'
                }
            },
            {
                path: 'show/:title/:lineNumber',
                name: 'show',
                meta: {
                    title: '详情页',
                    icon: 'Document'
                }
            }
        ]
    }
]

export default menuRoutes