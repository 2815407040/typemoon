const pool = require('../config/db');
const bcrypt = require('bcrypt');  // 用于密码加密

// 用户注册
async function register(user) {
    const { userName, password, email } = user;
    // 密码加密（加盐10次）
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
    INSERT INTO sys_user (userName, password, email, role) 
    VALUES (?, ?, ?, '2')
  `;
    const [result] = await pool.execute(sql, [userName, hashedPassword, email]);
    return result;
}

// typemoon/backend/models/userModel.js
async function login(userName, password) {
    const sql = 'SELECT * FROM sys_user WHERE userName = ?';
    const [rows] = await pool.execute(sql, [userName]);
    if (rows.length === 0) {
        console.log(`用户不存在: ${userName}`); // 新增日志
        return null;
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`密码验证结果: ${isPasswordValid}`); // 新增日志
    return isPasswordValid ? user : null;
}

// 获取用户列表
async function getUsers() {
    const sql = 'SELECT id, userName, email, role, isLocked, createTime FROM sys_user';
    const [rows] = await pool.execute(sql);
    return rows;
}

// 更新用户信息
async function updateUser(id, userData) {
    const { email, role, isLocked } = userData;
    const sql = `
    UPDATE sys_user 
    SET email = ?, role = ?, isLocked = ? 
    WHERE id = ?
  `;
    const [result] = await pool.execute(sql, [email, role, isLocked, id]);
    return result;
}

// 删除用户
async function deleteUser(id) {
    const sql = 'DELETE FROM sys_user WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result;
}

module.exports = {
    register,
    login,
    getUsers,
    updateUser,
    deleteUser
};