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

// 获取用户的贡献
router.get('/', contributionController.getContributions);

router.patch(
    '/:id',
    [
        body('isCheck').isInt({ min: 1, max: 3 }).withMessage('审核状态必须是1-3之间的整数')
    ],
    contributionController.updateContributionStatus
);

router.post('/:id/approve', contributionController.approveContribution);

module.exports = router;