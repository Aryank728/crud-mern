const fs = require('fs');
const path = require('path');

module.exports = function (req, res, next) {
    const filePath = path.join(__dirname, '../currentIp.json');
    let allowedIp;

    try {
        const ipData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        allowedIp = ipData.allowedIp;
    } catch (error) {
        console.error('Failed to read allowed IP:', error);
        return res.status(500).send('Server error');
    }

    const clientIp = req.ip || req.connection.remoteAddress;

    if (clientIp === allowedIp) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
};
