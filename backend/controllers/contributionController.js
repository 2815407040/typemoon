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

// 获取所有未审核贡献（移除分页逻辑）
exports.getContributions = async (req, res) => {
    try {
        // 固定查询 isCheck=0 的数据，不处理分页参数
        const result = await contributionModel.getContributions(0);
        res.json({
            list: result.list,
            total: result.total
        });
    } catch (error) {
        res.status(500).json({
            message: '获取贡献列表失败',
            error: error.message
        });
    }
};

exports.updateContributionStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { isCheck } = req.body;

        await contributionModel.updateContributionStatus(id, isCheck);
        res.json({ message: '审核状态更新成功' });
    } catch (error) {
        res.status(500).json({
            message: '更新审核状态失败',
            error: error.message
        });
    }
};

// ... 原有代码保持不变

// 处理通过审核并写入Markdown
exports.approveContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const contribution = await contributionModel.getContributions().then(res =>
            res.list.find(item => item.id === parseInt(id))
        );

        if (!contribution) {
            return res.status(404).json({ message: '贡献内容不存在' });
        }

        // 写入Fate.md
        await contributionModel.insertIntoFateMd(
            contribution.indexTitle,
            contribution.name,
            contribution.body
        );

        // 更新is_check状态为1
        await contributionModel.updateContributionStatus(id, 1);

        res.json({ message: '操作成功' });
    } catch (error) {
        res.status(500).json({
            message: '操作失败',
            error: error.message
        });
    }
};