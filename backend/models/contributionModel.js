const pool = require('../config/db');

// 创建贡献
async function createContribution(contribution) {
    const { userId, name, indexTitle, body } = contribution;
    const sql = `
        INSERT INTO contribution (userId, name, indexTitle, body) 
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [userId, name, indexTitle, body]);
    return result;
}

// 获取用户的贡献列表
async function getUserContributions(userId) {
    const sql = 'SELECT * FROM contribution WHERE userId = ? ORDER BY id DESC';
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
}

// 获取所有贡献
async function getAllContributions() {
    const sql = `
        SELECT c.*, u.userName 
        FROM contribution c
        JOIN sys_user u ON c.userId = u.id
        ORDER BY c.id DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

module.exports = {
    createContribution,
    getUserContributions,
    getAllContributions
};