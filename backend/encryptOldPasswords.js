const bcrypt = require('bcrypt');
const pool = require('./config/db'); // 引入数据库连接池

// 批量加密现有明文密码
async function encryptOldPasswords() {
    try {
        // 1. 查询所有用户（只获取id和password，避免数据过多）
        const [users] = await pool.execute('SELECT id, password FROM sys_user');
        console.log(`共发现 ${users.length} 个用户，开始处理...`);

        // 2. 遍历用户，加密明文密码
        for (const user of users) {
            const { id, password } = user;

            // 跳过已加密的密码（bcrypt哈希以$开头）
            if (password.startsWith('$')) {
                console.log(`用户 ${id} 的密码已加密，跳过`);
                continue;
            }

            // 加密明文密码
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. 更新数据库
            await pool.execute(
                'UPDATE sys_user SET password = ? WHERE id = ?',
                [hashedPassword, id]
            );
            console.log(`用户 ${id} 的密码已加密并更新`);
        }

        console.log('所有明文密码处理完成！');
    } catch (error) {
        console.error('处理失败:', error);
    } finally {
        // 关闭连接池
        await pool.end();
    }
}

// 执行脚本
encryptOldPasswords();