const { SalaryLedger, Deduction, Employee } = require("../models");

exports.generateMonthlySalary = async (req, res) => {
  try {
    const employees = await Employee.findAll();

    let { periodStart, periodEnd } = req.body;
    const now = new Date();

    periodStart = new Date(periodStart.split(" ")[0]);
    periodEnd = new Date(periodEnd.split(" ")[0]);

    if (!periodStart || !periodEnd) {
      if (now.getDate() < 15) {
        periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 15);
        periodEnd = new Date(now.getFullYear(), now.getMonth(), 15);
      } else {
        periodStart = new Date(now.getFullYear(), now.getMonth(), 15);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 16);
      }
    }

    const result = [];

    for (const emp of employees) {
      let ledger = await SalaryLedger.findOne({
        where: {
          employeeId: emp.employeeId,
          periodStart,
          periodEnd,
        },
      });

      if (!ledger) {
        ledger = await SalaryLedger.create({
          employeeId: emp.employeeId,
          payableAmount: emp.salary,
          periodStart,
          periodEnd,
          isPaid: false,
        });
      }

      if (emp.pf) {
        const existingDeduction = await Deduction.findOne({
          where: {
            salaryLedgerId: ledger.id,
            type: "PF",
          },
        });

        if (!existingDeduction) {
          await Deduction.create({
            salaryLedgerId: ledger.id,
            pf_amount: emp.pf,
            type: "PF",
            description: "PF Deduction",
          });
        }
      }

      result.push(ledger);
    }

    res
      .status(200)
      .json({ Message: "monthly ledger created", ledgers: result });
  } catch (err) {
    console.error("error creating salary ledger", err);
    res.status(400).json({ error: err.message });
  }
};
