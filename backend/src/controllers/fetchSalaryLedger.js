const { Deduction, SalaryLedger, Employee } = require("../models");

function normalizeDate(dateStr) {
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

exports.getSalaryReport = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    let { periodStart, periodEnd } = req.body;

    periodStart = normalizeDate(periodStart);
    periodEnd = normalizeDate(periodEnd);

    const reports = await Promise.all(
      employees.map(async (employee) => {
        const ledger = await SalaryLedger.findOne({
          where: { employeeId: employee.employeeId, periodStart, periodEnd },
        });

        if (!ledger) {
          return {
            employeeId: employee.employeeId,
            name: `${employee.firstname} ${employee.lastname}`,
            error: "No Ledger Found",
          };
        }

        // ✅ Fetch all deductions for this ledger
        const deductions = await Deduction.findAll({
          where: { salaryLedgerId: ledger.id },
        });

        // ✅ Aggregate totals
        let totals = {
          absentDays: 0,
          lateDays: 0,
          absentAmount: 0,
          lateAmount: 0,
          advanceAmount: 0,
          pf: 0,
          totalDeduction: 0,
        };

        deductions.forEach((d) => {
          totals.absentDays += d.absent_days || 0;
          totals.lateDays += d.late_days || 0;
          totals.absentAmount += d.absent_amount || 0;
          totals.lateAmount += d.late_amount || 0;
          totals.advanceAmount += d.advance_amount || 0;
          totals.pf += d.pf_amount || 0;

          totals.totalDeduction +=
            (d.absent_amount || 0) +
            (d.late_amount || 0) +
            (d.advance_amount || 0) +
            (d.pf_amount || 0);
        });

        const netSalary = ledger.payableAmount - totals.totalDeduction;

        return {
          employeeId: employee.employeeId,
          name: `${employee.firstname} ${employee.lastname}`,
          grossSalary: ledger.payableAmount,
          ...totals,
          netSalary,
        };
      }),
    );

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error generating salary reports", err);
    res.status(500).json({ error: err.message });
  }
};
