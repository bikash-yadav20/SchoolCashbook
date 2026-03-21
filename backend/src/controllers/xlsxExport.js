const XLSX = require("xlsx");
const { Expense } = require("../models");
const { Fee } = require("../models");
const { DailyCashBalance } = require("../models");

// export daily ledger report as xlsx-----
exports.exportDailyLedger = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);

    const feeRows = await Fee.findAll({
      where: { date: targetDate },
      attributes: [
        "reason",
        "cash_amount",
        "online_amount",
        "total_amount",
        "date",
      ],
      order: [["createdAt", "DESC"]],
    });

    const expenseRows = await Expense.findAll({
      where: { date: targetDate },
      attributes: ["reason", "expense_amount", "date"],
      order: [["createdAt", "DESC"]],
    });

    const dailyCashflow = await DailyCashBalance.findAll({
      where: { date: targetDate },
      attributes: [
        "opening_balance",
        "cash_fees_total",
        "closing_balance",
        "next_opening_balance",
      ],
    });

    const feeData = feeRows.map((row) => row.toJSON());
    const expenseData = expenseRows.map((row) => row.toJSON());
    const dailyCashflowData = dailyCashflow.map((row) => row.toJSON());

    const workbook = XLSX.utils.book_new();
    const feeSheet = XLSX.utils.json_to_sheet(feeData);
    const expenseSheet = XLSX.utils.json_to_sheet(expenseData);
    const dailyCashflowSheet = XLSX.utils.json_to_sheet(dailyCashflowData);
    XLSX.utils.book_append_sheet(workbook, feeSheet, "Fees");
    XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expenses");
    XLSX.utils.book_append_sheet(workbook, dailyCashflowSheet, "Cash Flow");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.attachment(`ledger_${targetDate}.xlsx`);
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating ledger report");
  }
};
