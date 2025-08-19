const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const port = 3001;  // 避免与前端开发服务器冲突（前端可能用3000）

// 中间件
app.use(cors());  // 解决跨域问题
app.use(express.json());  // 解析JSON请求体

// 路由
app.use('/api/users', userRoutes);    // 用户相关接口
app.use('/api/roles', roleRoutes);    // 角色相关接口
app.use('/api/menus', menuRoutes);    // 菜单相关接口

// 启动服务器
app.listen(port, () => {
    console.log(`后端服务器运行在 http://localhost:${port}`);
});

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // 允许前端地址访问
    credentials: true
}));