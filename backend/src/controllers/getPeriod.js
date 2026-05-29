const SalaryLedger = require("../models/salaryLedger");

exports.getPeriodData = async (req, res) => {
  try {
    const record = await SalaryLedger.findAll({
      attributes: ["periodStart", "periodEnd"],
      group: ["periodStart", "periodEnd"],
      order: [["periodStart", "DESC"]],
    });

    const periods = record.map((r) => ({
      periodStart: new Date(r.periodStart).toLocaleDateString("en-GB"),
      periodEnd: new Date(r.periodEnd).toLocaleDateString("en-GB"),
    }));
    res.status(200).json(periods);
  } catch (err) {
    console.error("Error fetching periods", err);
    res.status(500).json({ error: err.message });
  }
};
