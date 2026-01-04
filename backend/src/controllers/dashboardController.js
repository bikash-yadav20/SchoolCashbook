const { Fee, Expense } = require('../models');

exports.todaySummary = async (req, res) => {
  try {
    const targetDate = new Date().toISOString().slice(0,10);

    const fees = await Fee.findAll({ where: { date: targetDate } });
    const expenses = await Expense.findAll({ where: { date: targetDate } });

    const totals = fees.reduce((acc, r) => {
      acc.today_total_fees += Number(r.total_amount);
      acc.today_online += Number(r.online_amount);
      acc.today_cash += Number(r.cash_amount);
      return acc;
    }, { today_total_fees: 0, today_online: 0, today_cash: 0 });

    const today_total_expenses = expenses.reduce((sum, r) => sum + Number(r.expense_amount), 0);
    const final_cash = totals.today_cash - today_total_expenses;

    res.json({
      date: targetDate,
      today_total_fees: Number(totals.today_total_fees.toFixed(2)),
      today_cash: Number(totals.today_cash.toFixed(2)),
      today_online: Number(totals.today_online.toFixed(2)),
      today_total_expenses: Number(today_total_expenses.toFixed(2)),
      today_final_cash_in_cashbox: Number(final_cash.toFixed(2)),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};
