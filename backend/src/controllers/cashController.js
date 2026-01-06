const { DailyCashBalance } = require("../models");

exports.startDay = async (req, res) => {
  const inputDate = req.body.date || new Date().toISOString().slice(0, 10);

  const yesterday = await DailyCashBalance.findOne({
    order: [["date", "DESC"]],
  });

  const opening = yesterday ? yesterday.next_opening_balance : 0;

  const today = await DailyCashBalance.create({
    date: inputDate,
    opening_balance: opening,
  });

  res.json(today);
};

exports.closeDay = async (req, res) => {
  const inputDate = req.body.date || new Date().toISOString().slice(0, 10);

  const cashFees = Number(req.body.cash_fees_total);
  const expenses = Number(req.body.expenses_total);
  const closing = Number(req.body.closing_balance);

  const today = await DailyCashBalance.findOne({
    where: { date: inputDate },
  });

  if (!today) return res.status(404).json({ error: "Day not started" });

  const opening = Number(today.opening_balance);
  const nextOpening = cashFees - expenses - closing;

  today.cash_fees_total = cashFees;
  today.expenses_total = expenses;
  today.closing_balance = closing;
  today.next_opening_balance = nextOpening;

  await today.save();

  res.json({
    message: "Day closed",
    finalCash: nextOpening,
    nextOpeningBalance: nextOpening,
  });
};

exports.getClosingBalance = async (req, res) => {
  try {
    const inputDate = req.query.date || new Date().toISOString().slice(0, 10);

    const today = await DailyCashBalance.findOne({
      where: { date: inputDate },
    });

    if (!today) {
      return res.status(404).json({ error: "Day not started" });
    }

    return res.json({
      date: today.date,
      opening_balance: today.opening_balance,
      cash_fees_total: today.cash_fees_total,
      expenses_total: today.expenses_total,
      closing_balance: today.closing_balance,
      next_opening_balance: today.next_opening_balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
