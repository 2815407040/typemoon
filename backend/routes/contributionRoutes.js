const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const { body } = require('express-validator');

// 创建贡献（带参数验证）
router.post(
    '/',
    [
        body('userId').notEmpty().withMessage('用户ID不能为空'),
        body('name').notEmpty().withMessage('名称不能为空'),
        body('indexTitle').notEmpty().withMessage('标题不能为空'),
        body('body').notEmpty().withMessage('内容不能为空')
    ],
    contributionController.createContribution
);

router.post('/update-fate-md', async (req, res) => {
    try {
        const { content } = req.body;
        // 保存到Fate.md文件
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../../public/Fate.md');
        fs.writeFileSync(filePath, content, 'utf8');
        res.json({ message: 'Fate.md更新成功' });
    } catch (error) {
        res.status(500).json({ message: '更新Fate.md失败', error: error.message });
    }
});

// 获取用户的贡献
router.get('/user/:userId', contributionController.getUserContributions);

// 获取所有贡献
router.get('/', contributionController.getAllContributions);

// 添加更新审核状态的路由

router.patch('/:id', contributionController.updateContributionStatus);
module.exports = router;