const menuModel = require('../models/menuModel');
const { validationResult } = require('express-validator');

// 获取所有菜单
exports.getMenus = async (req, res) => {
    try {
        const menus = await menuModel.getMenus();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: '获取菜单列表失败', error: error.message });
    }
};

// 新增菜单
exports.addMenu = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 检查父菜单是否存在
        if (req.body.pid && req.body.pid !== 0) {
            const parentMenu = await menuModel.getMenusByParentId(req.body.pid);
            if (parentMenu.length === 0) {
                return res.status(400).json({ message: '父菜单不存在' });
            }
        }

        const result = await menuModel.addMenu(req.body);
        res.status(201).json({ message: '菜单新增成功', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: '新增菜单失败', error: error.message });
    }
};

// 更新菜单
exports.updateMenu = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        // 检查菜单是否存在
        const menus = await menuModel.getMenus();
        const menuExists = menus.some(menu => menu.id == id);
        if (!menuExists) {
            return res.status(404).json({ message: '菜单不存在' });
        }

        // 检查父菜单是否存在且不是自身
        if (req.body.pid) {
            if (req.body.pid == id) {
                return res.status(400).json({ message: '不能将自身设置为父菜单' });
            }
            const parentMenu = await menuModel.getMenusByParentId(req.body.pid);
            if (parentMenu.length === 0 && req.body.pid !== 0) {
                return res.status(400).json({ message: '父菜单不存在' });
            }
        }

        const result = await menuModel.updateMenu(id, req.body);
        if (result.affectedRows > 0) {
            res.json({ message: '菜单更新成功' });
        } else {
            res.status(404).json({ message: '菜单不存在' });
        }
    } catch (error) {
        res.status(500).json({ message: '更新菜单失败', error: error.message });
    }
};

// 删除菜单
exports.deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;

        // 检查是否有子菜单
        const hasChildren = await menuModel.hasChildren(id);
        if (hasChildren) {
            return res.status(400).json({ message: '存在子菜单，无法删除' });
        }

        const result = await menuModel.deleteMenu(id);
        if (result.affectedRows > 0) {
            res.json({ message: '菜单删除成功' });
        } else {
            res.status(404).json({ message: '菜单不存在' });
        }
    } catch (error) {
        res.status(500).json({ message: '删除菜单失败', error: error.message });
    }
};