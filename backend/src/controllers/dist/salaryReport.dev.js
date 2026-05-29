"use strict";

var _require = require("../models"),
    Employee = _require.Employee,
    SalaryLedger = _require.SalaryLedger,
    Deduction = _require.Deduction;

exports.getSalaryReport = function _callee(req, res) {
  var employeeId, employee, report;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          employeeId = req.params.employeeId;
          _context.next = 4;
          return regeneratorRuntime.awrap(Employee.findOne({
            where: {
              employeeId: employeeId
            },
            include: [{
              model: SalaryLedger,
              as: "SalaryLedgers",
              include: [{
                model: Deduction,
                as: "Deductions"
              }]
            }]
          }));

        case 4:
          employee = _context.sent;

          if (employee) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Employee not found"
          }));

        case 7:
          // Transform the data for a clean report
          report = employee.SalaryLedgers.map(function (ledger) {
            var totalDeductions = ledger.Deductions.reduce(function (sum, d) {
              return sum + d.amount;
            }, 0);
            return {
              salaryLedgerId: ledger.id,
              gross_salary: ledger.payableAmount,
              total_deductions: totalDeductions,
              net_salary: ledger.payableAmount - totalDeductions,
              periodStart: ledger.periodStart,
              periodEnd: ledger.periodEnd,
              isPaid: ledger.isPaid,
              deductions: ledger.Deductions.map(function (d) {
                return {
                  type: d.type,
                  amount: d.amount,
                  description: d.description
                };
              })
            };
          });
          res.json({
            employeeId: employee.employeeId,
            name: "".concat(employee.firstname, " ").concat(employee.lastname),
            designation: employee.designation,
            salary: employee.salary,
            report: report
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching salary report", _context.t0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};