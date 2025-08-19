const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');

// 用户注册
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await userModel.register(req.body);
        res.status(201).json({ message: '注册成功', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: '注册失败', error: error.message });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await userModel.login(userName, password);
        if (user) {
            // 不返回密码
            const { password, ...userInfo } = user;
            res.json({ message: '登录成功', user: userInfo });
        } else {
            res.status(401).json({ message: '用户名或密码错误' });
        }
    } catch (error) {
        res.status(500).json({ message: '登录失败', error: error.message });
    }
};

// 获取用户列表
exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: '获取用户列表失败', error: error.message });
    }
};

// 更新用户
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.updateUser(id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: '更新成功' });
        } else {
            res.status(404).json({ message: '用户不存在' });
        }
    } catch (error) {
        res.status(500).json({ message: '更新失败', error: error.message });
    }
};

// 删除用户
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.deleteUser(id);
        if (result.affectedRows > 0) {
            res.json({ message: '删除成功' });
        } else {
            res.status(404).json({ message: '用户不存在' });
        }
    } catch (error) {
        res.status(500).json({ message: '删除失败', error: error.message });
    }
};