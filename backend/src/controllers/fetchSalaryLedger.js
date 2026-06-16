// controllers/fetchSalaryLedger.js
const { Deduction, SalaryLedger, Employee } = require("../models");
const ExcelJS = require("exceljs");

function normalizeDate(dateStr) {
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

// Shared helper
async function buildSalaryReports(periodStart, periodEnd) {
  const employees = await Employee.findAll();

  return Promise.all(
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
        status: employee.status,
        ...totals,
        netSalary,
      };
    }),
  );
}

// JSON controller
exports.getSalaryReport = async (req, res) => {
  try {
    let { periodStart, periodEnd } = req.body;
    periodStart = normalizeDate(periodStart);
    periodEnd = normalizeDate(periodEnd);

    const reports = await buildSalaryReports(periodStart, periodEnd);
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error generating salary reports", err);
    res.status(500).json({ error: err.message });
  }
};

// Excel controller
exports.downloadSalaryReport = async (req, res) => {
  try {
    let { periodStart, periodEnd } = req.body;
    periodStart = normalizeDate(periodStart);
    periodEnd = normalizeDate(periodEnd);

    const reports = await buildSalaryReports(periodStart, periodEnd);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Salary Report");

    worksheet.columns = [
      { header: "Employee ID", key: "employeeId", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Gross Salary", key: "grossSalary", width: 15 },
      { header: "Absent Days", key: "absentDays", width: 15 },
      { header: "Absent Amount", key: "absentAmount", width: 15 },
      { header: "Late Days", key: "lateDays", width: 15 },
      { header: "Late Amount", key: "lateAmount", width: 15 },
      { header: "Advance Amount", key: "advanceAmount", width: 15 },
      { header: "PF Amount", key: "pf", width: 15 },
      { header: "Total Deduction", key: "totalDeduction", width: 20 },
      { header: "Net Salary", key: "netSalary", width: 15 },
    ];

    reports.forEach((report) => worksheet.addRow(report));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=salary_report.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel report", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper for all reports of a single employee
const buildReportsForEmployee = async (employee) => {
  const ledgers = await SalaryLedger.findAll({
    where: { employeeId: employee.employeeId },
    order: [["periodEnd", "DESC"]], // sort latest first
  });

  if (!ledgers.length) {
    return [];
  }

  return Promise.all(
    ledgers.map(async (ledger) => {
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
        periodStart: ledger.periodStart,
        periodEnd: ledger.periodEnd,
        grossSalary: ledger.payableAmount,
        paymentStatus: ledger.isPaid ? "Paid" : "Unpaid",
        ...totals,
        netSalary,
      };
    }),
  );
};

// Controller for single employee
exports.getAllReportsForEmployee = async (req, res) => {
  try {
    let { employeeId } = req.params;
    const employee = await Employee.findOne({ where: { employeeId } });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const reports = await buildReportsForEmployee(employee);
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error generating employee salary reports", err);
    res.status(500).json({ error: err.message });
  }
};
