const pool = require('../config/db');

// 获取所有菜单
async function getMenus() {
    const sql = 'SELECT * FROM sys_menu';
    const [rows] = await pool.execute(sql);
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

// 删除菜单
async function deleteMenu(id) {
    const sql = 'DELETE FROM sys_menu WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result;
}

module.exports = { getMenus, addMenu, updateMenu, deleteMenu };