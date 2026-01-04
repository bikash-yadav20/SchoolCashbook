const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createExpense, listByDate, totalsByDate } = require('../controllers/expenseController');

router.post('/', auth, createExpense);
router.get('/', auth, listByDate);
router.get('/totals', auth, totalsByDate);

module.exports = router;
