const pool = require('../config/db');

// 创建贡献
async function createContribution(contribution) {
    const { userId, name, indexTitle, body } = contribution;
    const sql = `
        INSERT INTO contribution (userId, name, indexTitle, body, is_check)
        VALUES (?, ?, ?, ?, 0)  -- 新增时默认未审核
    `;
    const [result] = await pool.execute(sql, [userId, name, indexTitle, body]);
    return result;
}

async function getContributions(isCheck = 0) {
    const sql = `
        SELECT * FROM contribution 
        WHERE is_check = ? 
    `;
    const [rows] = await pool.execute(sql, [isCheck]);

    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM contribution WHERE is_check = ?`;
    const [countResult] = await pool.execute(countSql, [isCheck]);

    return {
        list: rows,
        total: countResult[0].total
    };
}

async function updateContributionStatus(id, isCheck) {
    const sql = `
    UPDATE contribution 
    SET is_check = ?
    WHERE id = ?
  `;
    const [result] = await pool.execute(sql, [isCheck, id]);
    return result;
}

const fs = require('fs').promises;
const path = require('path');

// 处理通过审核后的Markdown文件写入
async function insertIntoFateMd(indexTitle, name, body) {
    const filePath = path.join(__dirname, '../../public/Fate.md'); // 根据实际路径调整
    let content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    let index1Line = -1;
    let index1Level = 0;

    // 找到index1（匹配的标题）
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) {
            const level = line.match(/#+/)[0].length;
            const title = line.replace(/#+/, '').trim();
            if (title === indexTitle) {
                index1Line = i;
                index1Level = level;
                break;
            }
        }
    }

    if (index1Line === -1) {
        throw new Error('未找到匹配的标题');
    }

    // 寻找index2（下一个同级或更高级别标题）
    let index2Line = lines.length; // 默认插入到文件末尾
    for (let i = index1Line + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) {
            const level = line.match(/#+/)[0].length;
            if (level <= index1Level) {
                index2Line = i;
                break;
            }
        }
    }

    // 插入新内容
    const newLines = [
        `${'#'.repeat(index1Level)} ${name}`, // 标题
        '', // 空行分隔
        body, // 正文
        ''  // 空行分隔
    ];
    lines.splice(index2Line, 0, ...newLines);

    // 写回文件
    await fs.writeFile(filePath, lines.join('\n'), 'utf8');
}

module.exports = {
    createContribution,
    getContributions,
    insertIntoFateMd // 新增导出
};

