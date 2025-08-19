const menuRoutes = [
    {
        path: '/index',
        name: 'Index',
        meta: {
                title: '首页',
},
children: [
    {
        path: 'system/user',
        name: 'User',
        meta: {
                title: '用户管理',
}
},
{
    path: 'system/role',
        name: 'Role',
    meta: {
    title: '角色管理',
}
},
{
    path: 'system/menu',
        name: 'Menu',
    meta: {
    title: '菜单管理',
}
}
]
},
{
    path: '/HomeView',
        name: 'HomeView',
    meta: {
    title: '内容首页',
},
    children: [
        {
            path: '',
            name: 'search',
            meta: {
                    title: '搜索页',
}
},
    {
        path: 'show/:title/:lineNumber',
            name: 'show',
        meta: {
        title: '详情页',
    }
    }
]
}
]