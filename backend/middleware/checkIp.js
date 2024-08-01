// middleware/checkIp.js
module.exports = function (req, res, next) {
    const allowedIp = '152.58.187.38'; // Replace this with your actual IP address
    const clientIp = req.ip || req.connection.remoteAddress;

    if (clientIp === allowedIp) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
};
