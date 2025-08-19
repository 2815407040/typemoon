const pool = require('../config/db');

// 获取所有角色
async function getRoles() {
    const sql = 'SELECT * FROM sys_role';
    const [rows] = await pool.execute(sql);
    return rows;
}

// 新增角色
async function addRole(role) {
    const { roleName, roleDescribe } = role;
    const sql = 'INSERT INTO sys_role (roleName, roleDescribe) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [roleName, roleDescribe]);
    return result;
}

// 更新角色
async function updateRole(id, role) {
    const { roleName, roleDescribe } = role;
    const sql = 'UPDATE sys_role SET roleName = ?, roleDescribe = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [roleName, roleDescribe, id]);
    return result;
}

// 删除角色
async function deleteRole(id) {
    const sql = 'DELETE FROM sys_role WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result;
}

module.exports = { getRoles, addRole, updateRole, deleteRole };