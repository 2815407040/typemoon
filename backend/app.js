// 在app.js中
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const menuRoutes = require('./routes/menuRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const app = express();
const port = 3001;

// 中间件
app.use(cors({
    origin: 'http://localhost:5173', // 允许前端地址访问
    credentials: true
}));
app.use(express.json());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);5
app.use('/api/menus', menuRoutes); // 确保菜单路由已正确配置
app.use('/api/contributions', contributionRoutes);
// 启动服务器
app.listen(port, () => {
    console.log(`后端服务器运行在 http://localhost:${port}`);
});
// 在已有的路由注册后添加

