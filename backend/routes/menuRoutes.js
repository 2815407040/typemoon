const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// 获取所有菜单
router.get('/', menuController.getMenus);

// 新增菜单
router.post('/', menuController.addMenu);

// 更新菜单
router.put('/:id', menuController.updateMenu);

// 删除菜单
router.delete('/:id', menuController.deleteMenu);

module.exports = router;