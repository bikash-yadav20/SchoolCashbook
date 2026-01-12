const { Fee } = require("../models");
const { feeSchema } = require("../middleware/validate");

exports.createFee = async (req, res) => {
  try {
    const { error, value } = feeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { total_amount, online_amount, reason, date } = value;

    if (online_amount > total_amount) {
      return res
        .status(400)
        .json({ error: "Online amount cannot exceed total amount" });
    }
    const cash_amount = (Number(total_amount) - Number(online_amount)).toFixed(
      2
    );

    const row = await Fee.create({
      total_amount,
      online_amount,
      cash_amount,
      reason,
      date: date || new Date().toISOString().slice(0, 10),
      created_by: req.user.id,
    });

    res.status(201).json(row);
  } catch (e) {
    console.error("Fee creation error:", e);
    res.status(500).json({
      error: "Failed to create fee",
      details: e.message,
    });
  }
};

exports.listByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const rows = await Fee.findAll({
      where: { date: targetDate },
      order: [["createdAt", "DESC"]],
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch fees" });
  }
};

exports.totalsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const rows = await Fee.findAll({ where: { date: targetDate } });
    const totals = rows.reduce(
      (acc, r) => {
        acc.total_fees += Number(r.total_amount);
        acc.total_online += Number(r.online_amount);
        acc.total_cash += Number(r.cash_amount);
        return acc;
      },
      { total_fees: 0, total_online: 0, total_cash: 0 }
    );
    res.json({ date: targetDate, ...totals });
  } catch (e) {
    res.status(500).json({ error: "Failed to calculate fee totals" });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Fee.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ error: "Fee not found" });
    }

    res.json({ success: true, id });
  } catch (err) {
    console.error("Fee deletion error:", err);
    res.status(500).json({ error: "Failed to delete fee" });
  }
};
