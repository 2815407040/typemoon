const contributionModel = require('../models/contributionModel');
const { validationResult } = require('express-validator');
const {getUserContributions} = require("../models/contributionModel");

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

exports.getContributions = async (req, res) => {
    try{
        const contributions = await contributionModel.getContributions();
        res.json(contributions);
    }catch(error){
    }
}
// 获取用户的贡献
// exports.getUserContributions = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const contributions = await contributionModel.getUserContributions(userId);
//         res.json(contributions);
//     } catch (error) {
//         res.status(500).json({
//             message: '获取贡献列表失败',
//             error: error.message
//         });
//     }
// };