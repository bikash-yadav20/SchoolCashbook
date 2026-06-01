const { Deduction, SalaryLedger, Employee } = require("../models");

exports.empSalaryReport = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const ledger = await SalaryLedger.findOne({
      where: { employeeId },
      order: [["periodStart", "DESC"]],
    });

    if (!ledger) {
      return res.status(404).json({
        employeeId,
        error: "No ledger found",
      });
    }

    const deductions = await Deduction.findAll({
      where: { salaryLedgerId: ledger.id },
    });

    let totals = {
      absentDays: 0,
      lateDays: 0,
      absentAmount: 0,
      lateAmount: 0,
      advanceAmount: 0,
      pf: 0,
      totalDeduction: 0,
      description: "",
    };

    deductions.forEach((d) => {
      totals.absentDays += d.absent_days || 0;
      totals.absentAmount += d.absent_amount || 0;
      totals.lateDays += d.late_days || 0;
      totals.lateAmount += d.late_amount || 0;
      totals.advanceAmount += d.advance_amount || 0;
      totals.pf += d.pf_amount || 0;
      totals.description = d.description || "";

      totals.totalDeduction +=
        (d.absent_amount || 0) +
        (d.late_amount || 0) +
        (d.advance_amount || 0) +
        (d.pf_amount || 0);
    });

    const netSalary = ledger.payableAmount - totals.totalDeduction;

    // ✅ Return final report
    return res.status(200).json({
      employeeId,
      grossSalary: ledger.payableAmount,
      ...totals,
      netSalary,
    });
  } catch (error) {
    console.error("Error generating employee salary report", error);
    res.status(500).json({ error: error.message });
  }
};
