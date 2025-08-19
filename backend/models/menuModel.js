const pool = require('../config/db');

// 获取所有菜单
async function getMenus() {
    const sql = 'SELECT * FROM sys_menu';
    const [rows] = await pool.execute(sql);
    return rows;
}

// 根据父菜单ID获取子菜单
async function getMenusByParentId(pid) {
    const sql = 'SELECT * FROM sys_menu WHERE pid = ?';
    const [rows] = await pool.execute(sql, [pid]);
    return rows;
}

// 新增菜单
async function addMenu(menu) {
    const { menuName, path, pid } = menu;
    const sql = 'INSERT INTO sys_menu (menuName, path, pid) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [menuName, path, pid || 0]);
    return result;
}

// 更新菜单
async function updateMenu(id, menu) {
    const { menuName, path, pid } = menu;
    const sql = 'UPDATE sys_menu SET menuName = ?, path = ?, pid = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [menuName, path, pid, id]);
    return result;
}

// 删除菜单前检查是否有子菜单
async function hasChildren(id) {
    const sql = 'SELECT COUNT(*) as count FROM sys_menu WHERE pid = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0].count > 0;
}

// 删除菜单
async function deleteMenu(id) {
    const sql = 'DELETE FROM sys_menu WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result;
}

module.exports = {
    getMenus,
    getMenusByParentId,
    addMenu,
    updateMenu,
    deleteMenu,
    hasChildren
};