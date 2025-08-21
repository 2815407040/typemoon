const fs = require('fs');
const path = require('path');

// 定义Fate.md的路径（根据实际项目调整）
const FATE_MD_PATH = path.join(__dirname, '../../public/Fate.md');

// 更新Fate.md内容
exports.updateFateMd = async (req, res) => {
    try {
        const { content } = req.body;

        // 验证内容是否存在
        if (!content) {
            return res.status(400).json({ message: '内容不能为空' });
        }

        // 写入文件
        fs.writeFileSync(FATE_MD_PATH, content, 'utf8');

        res.json({ message: 'Fate.md更新成功' });
    } catch (error) {
        console.error('更新Fate.md失败:', error);
        res.status(500).json({
            message: '更新Fate.md失败',
            error: error.message
        });
    }
};

// 获取Fate.md内容（供测试用）
exports.getFateMd = async (req, res) => {
    try {
        if (!fs.existsSync(FATE_MD_PATH)) {
            return res.status(404).json({ message: 'Fate.md不存在' });
        }

        const content = fs.readFileSync(FATE_MD_PATH, 'utf8');
        res.send(content);
    } catch (error) {
        console.error('读取Fate.md失败:', error);
        res.status(500).json({
            message: '读取Fate.md失败',
            error: error.message
        });
    }
};