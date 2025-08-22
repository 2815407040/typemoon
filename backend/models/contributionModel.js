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

async function getContributions() {
    const sql = `SELECT * FROM contribution`;
    const [rows] = await pool.execute(sql);
    return rows;
}
// // 获取用户的贡献列表
// async function getUserContributions(userId) {
//     const sql = 'SELECT * FROM contribution WHERE userId = ? ORDER BY id DESC';
//     const [rows] = await pool.execute(sql, [userId]);
//     return rows;
// }

module.exports = {
    createContribution,
    getContributions
};