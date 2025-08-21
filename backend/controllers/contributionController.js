const contributionModel = require('../models/contributionModel');
const { validationResult } = require('express-validator');

// 创建贡献
exports.createContribution = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await contributionModel.createContribution(req.body);
        res.status(201).json({
            message: '贡献创建成功',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: '创建贡献失败',
            error: error.message
        });
    }
};

// 获取用户的贡献
exports.getUserContributions = async (req, res) => {
    try {
        const { userId } = req.params;
        const contributions = await contributionModel.getUserContributions(userId);
        res.json(contributions);
    } catch (error) {
        res.status(500).json({
            message: '获取贡献列表失败',
            error: error.message
        });
    }
};

// 获取所有贡献
exports.getAllContributions = async (req, res) => {
    try {
        const contributions = await contributionModel.getAllContributions();
        res.json(contributions);
    } catch (error) {
        res.status(500).json({
            message: '获取所有贡献失败',
            error: error.message
        });
    }
};

// 修改contributionController.js中的更新方法
exports.updateContributionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { check } = req.body;

        // 验证参数
        if (!id || check === undefined) {
            return res.status(400).json({ message: 'ID和审核状态不能为空' });
        }

        if (![1, 2, 3].includes(check)) {
            return res.status(400).json({ message: '无效的审核状态' });
        }

        const result = await contributionModel.updateContributionCheckStatus(id, check);

        // 检查是否有记录被更新
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '未找到该贡献记录' });
        }

        res.json({ message: '审核状态更新成功' });
    } catch (error) {
        console.error('更新审核状态失败:', error); // 记录详细错误
        res.status(500).json({
            message: '更新审核状态失败',
            error: error.message
        });
    }
};