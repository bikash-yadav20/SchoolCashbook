const { Fee } = require("../models");
const { feeSchema } = require("../middleware/validate");

//Helper function for data comparison----

const prepare = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .sort()
    .join(" ");
};

const similarity = (a, b) => {
  let w1 = prepare(a).split(" ");
  let w2 = prepare(b).split(" ");
  let match = w1.filter((w) => w2.includes(w)).length;

  return match / Math.max(w1.length, w2.length);
};

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
      2,
    );

    const targetDate = date || new Date().toISOString().slice(0, 10);

    const existingData = await Fee.findAll({
      where: { date: targetDate },
    });

    for (let old of existingData) {
      let sameAmount =
        Number(old.total_amount) === Number(total_amount) &&
        Number(old.online_amount) === Number(online_amount);

      let similarData = similarity(old.reason, reason) > 0.7;

      if (sameAmount && similarData) {
        return res.status(409).json({
          warning: "⚠️ Simillar Entry already exists",
          existing: old,
        });
      }
    }
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
      { total_fees: 0, total_online: 0, total_cash: 0 },
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
