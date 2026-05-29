const { Deduction, SalaryLedger, Employee, Expense } = require("../models");

exports.addDeduction = async (req, res) => {
  try {
    const {
      employeeId,
      deduction_date,
      absent_days,
      late_days,
      advance_amount,
      description,
    } = req.body;

    // Find latest salary ledger for the employee
    const ledger = await SalaryLedger.findOne({
      where: { employeeId },
      order: [["periodStart", "DESC"]],
    });

    if (!ledger) {
      return res
        .status(404)
        .json({ error: "No salary ledger found for the employee" });
    }

    // Get employee salary
    const employee = await Employee.findOne({ where: { employeeId } });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const grossPay = employee.salary;

    // Calculate deduction amounts
    let absent_amount = 0;
    let late_amount = 0;

    if (absent_days && absent_days > 0) {
      absent_amount = Math.floor((grossPay / 30) * absent_days);
    }

    if (late_days && late_days > 0) {
      // 0.2 day penalty per late day
      late_amount = Math.floor((grossPay / 30) * 0.2 * late_days);
    }

    const adv = advance_amount || 0;

    // Add advance expense if applicable
    let expense = null;
    if (adv > 0) {
      expense = await Expense.create({
        expense_amount: adv,
        reason: `Advance taken by ${employee.firstname} ${employee.lastname}`,
        date: deduction_date,
        created_by: 1,
      });
    }

    // Total deduction = absent + late + advance
    const totalAmount = absent_amount + late_amount + adv;

    // Decide type label
    let deductionType = "General";
    if (absent_days && late_days) {
      deductionType = "Combined";
    } else if (absent_days) {
      deductionType = "Absent";
    } else if (late_days) {
      deductionType = "Late";
    } else if (adv > 0) {
      deductionType = "Advance";
    }

    // Create deduction record
    const deduction = await Deduction.create({
      salaryLedgerId: ledger.id,
      type: deductionType,
      absent_days,
      late_days,
      deduction_date,
      advance_amount: adv,
      description,
      absent_amount,
      late_amount,
      total_deduction: totalAmount,
    });

    res.status(200).json({
      message: "Deduction processed successfully",
      deduction,
      expense,
    });
  } catch (err) {
    console.error("Error adding deduction", err);
    res.status(400).json({ error: err.message });
  }
};
