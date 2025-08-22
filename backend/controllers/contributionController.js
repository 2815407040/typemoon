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

// 新增：处理审核状态更新
exports.updateContributionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { check } = req.body;

        if (check === undefined) {
            return res.status(400).json({ message: '审核状态不能为空' });
        }

        await contributionModel.updateContributionStatus(id, check);
        res.json({ message: '审核状态更新成功' });
    } catch (error) {
        res.status(500).json({
            message: '更新审核状态失败',
            error: error.message  // 输出具体错误信息便于调试
        });
    }
};