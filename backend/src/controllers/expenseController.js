const { Expense } = require("../models");
const { expenseSchema } = require("../middleware/validate");

exports.createExpense = async (req, res) => {
  try {
    const { error, value } = expenseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { expense_amount, reason, date } = value;

    const row = await Expense.create({
      expense_amount,
      reason,
      date: date || new Date().toISOString().slice(0, 10),
      created_by: req.user.id,
    });

    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: "Failed to create expense" });
  }
};

exports.listByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const rows = await Expense.findAll({
      where: { date: targetDate },
      order: [["createdAt", "DESC"]],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

exports.totalsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const rows = await Expense.findAll({ where: { date: targetDate } });
    const total_expenses = rows.reduce(
      (sum, r) => sum + Number(r.expense_amount),
      0
    );
    res.json({ date: targetDate, total_expenses });
  } catch (e) {
    res.status(500).json({ error: "Failed to calculate expense totals" });
  }
};

exports.deleteExp = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ success: true, id });
  } catch (err) {
    console.error("Expense deletion error:", err);
    res.status(500).json({ error: "Failed to delete fee" });
  }
};
