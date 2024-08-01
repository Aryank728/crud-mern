const express = require('express');
const tableRoutes = require('./tableRoutes');

const router = express.Router();

router.use('/api', tableRoutes);

module.exports = router;
