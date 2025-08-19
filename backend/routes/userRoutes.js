const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');

// 注册路由（带参数验证）
router.post(
    '/register',
    [
        body('userName').notEmpty().withMessage('用户名不能为空'),
        body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
        body('email').isEmail().withMessage('邮箱格式不正确')
    ],
    userController.register
);

// 登录路由
router.post('/login', userController.login);

// 获取用户列表
router.get('/', userController.getUsers);

// 更新用户
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;