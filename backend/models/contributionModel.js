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

// 修改更新审核状态的方法（check是关键字，需要用反引号包裹）
// 添加更新审核状态的方法
async function updateContributionCheckStatus(id, checkStatus) {
    const sql = 'UPDATE contribution SET `check` = ? WHERE id = ?';
    // 注意：check是MySQL关键字，需要用反引号包裹
    const [result] = await pool.execute(sql, [checkStatus, id]);
    return result;
}

module.exports = {
    createContribution,
    getUserContributions,
    getAllContributions,
    updateContributionCheckStatus // 新增导出
};

async function updateContributionStatus(id, checkStatus) {
    const sql = 'UPDATE contribution SET check = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [checkStatus, id]);
    return result;
}

// 修改获取所有贡献的方法
async function getAllContributions() {
    const sql = `
        SELECT c.*, u.userName
        FROM contribution c
                 JOIN sys_user u ON c.userId = u.id
        WHERE c.check = 0
        ORDER BY c.id DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}
module.exports = {
    createContribution,
    getUserContributions,
    getAllContributions,
    updateContributionCheckStatus,  // 导出新方法
    updateContributionStatus
};