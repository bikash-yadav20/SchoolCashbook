const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { todaySummary } = require('../controllers/dashboardController');

router.get('/today', auth, todaySummary);

module.exports = router;
