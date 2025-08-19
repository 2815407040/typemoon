const roleModel = require('../models/roleModel');
const { validationResult } = require('express-validator');

// 获取角色列表
exports.getRoles = async (req, res) => {
    try {
        const roles = await roleModel.getRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: '获取角色列表失败', error: error.message });
    }
};

// 新增角色
exports.addRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await roleModel.addRole(req.body);
        res.status(201).json({ message: '角色新增成功', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: '新增角色失败', error: error.message });
    }
};

// 更新角色
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleModel.updateRole(id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: '角色更新成功' });
        } else {
            res.status(404).json({ message: '角色不存在' });
        }
    } catch (error) {
        res.status(500).json({ message: '更新角色失败', error: error.message });
    }
};

// 删除角色
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleModel.deleteRole(id);
        if (result.affectedRows > 0) {
            res.json({ message: '角色删除成功' });
        } else {
            res.status(404).json({ message: '角色不存在' });
        }
    } catch (error) {
        res.status(500).json({ message: '删除角色失败', error: error.message });
    }
};