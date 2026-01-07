const { Fee } = require("../models");
const { Expense } = require("../models");
const { Op } = require("sequelize");

//Get overall summery-------

exports.getOverallSum = async (req, res) => {
  try {
    const total = await Fee.sum("total_amount");
    res.json({ total: total || 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// get summery by date range

exports.getSummeryByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (
    !startDate ||
    !endDate ||
    isNaN(new Date(startDate)) ||
    isNaN(new Date(endDate))
  ) {
    return res.status(400).json({ error: "Invalid date range" });
  }

  try {
    const total = await Fee.sum("total_amount", {
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.json({ total: total || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

/// get overall_online total

exports.overallTotalOnline = async (req, res) => {
  try {
    const onlineTotal = await Fee.sum("online_amount");
    res.json({ onlineTotal: onlineTotal || 0 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database Query Failed" });
  }
};

// get overall cash summery

exports.overallTotalCash = async (req, res) => {
  try {
    const cashTotal = await Fee.sum("cash_amount");
    res.json({ cashTotal: cashTotal || 0 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database Query Failed" });
  }
};

//Expense summery by data range

exports.getExpenseSummeryByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (
    !startDate ||
    !endDate ||
    isNaN(new Date(startDate)) ||
    isNaN(new Date(endDate))
  ) {
    return res.status(400).json({ error: "Invalid date range" });
  }

  try {
    const total = await Expense.sum("expense_amount", {
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.json({ total: total || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// get overall expenses

exports.overallTotalExpense = async (req, res) => {
  try {
    const expenseTotal = await Expense.sum("expense_amount");
    res.json({ expenseTotal: expenseTotal || 0 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database Query Failed" });
  }
};
