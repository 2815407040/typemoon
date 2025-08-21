const express = require('express');
const router = express.Router();
const fateController = require('../controllers/fateController');

// 更新Fate.md
router.post('/update-fate-md', fateController.updateFateMd);

// 获取Fate.md内容（可选，用于测试）
router.get('/fate-md', fateController.getFateMd);

module.exports = router;