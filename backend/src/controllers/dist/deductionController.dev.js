"use strict";

var _require = require("../models"),
    Deduction = _require.Deduction,
    SalaryLedger = _require.SalaryLedger,
    Employee = _require.Employee,
    Expense = _require.Expense;

exports.addDeduction = function _callee(req, res) {
  var _req$body, employeeId, deduction_date, absent_days, late_days, advance_amount, description, ledger, employee, grossPay, absent_amount, late_amount, adv, expense, totalAmount, deductionType, deduction;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, employeeId = _req$body.employeeId, deduction_date = _req$body.deduction_date, absent_days = _req$body.absent_days, late_days = _req$body.late_days, advance_amount = _req$body.advance_amount, description = _req$body.description; // Find latest salary ledger for the employee

          _context.next = 4;
          return regeneratorRuntime.awrap(SalaryLedger.findOne({
            where: {
              employeeId: employeeId
            },
            order: [["periodStart", "DESC"]]
          }));

        case 4:
          ledger = _context.sent;

          if (ledger) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "No salary ledger found for the employee"
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(Employee.findOne({
            where: {
              employeeId: employeeId
            }
          }));

        case 9:
          employee = _context.sent;

          if (employee) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Employee not found"
          }));

        case 12:
          grossPay = employee.salary; // Calculate deduction amounts

          absent_amount = 0;
          late_amount = 0;

          if (absent_days && absent_days > 0) {
            absent_amount = Math.floor(grossPay / 30 * absent_days);
          }

          if (late_days && late_days > 0) {
            // 0.2 day penalty per late day
            late_amount = Math.floor(grossPay / 30 * 0.2 * late_days);
          }

          adv = advance_amount || 0; // Add advance expense if applicable

          expense = null;

          if (!(adv > 0)) {
            _context.next = 23;
            break;
          }

          _context.next = 22;
          return regeneratorRuntime.awrap(Expense.create({
            expense_amount: adv,
            reason: "Advance taken by ".concat(employee.firstname, " ").concat(employee.lastname),
            date: deduction_date,
            created_by: 1
          }));

        case 22:
          expense = _context.sent;

        case 23:
          // Total deduction = absent + late + advance
          totalAmount = absent_amount + late_amount + adv; // Decide type label

          deductionType = "General";

          if (absent_days && late_days) {
            deductionType = "Combined";
          } else if (absent_days) {
            deductionType = "Absent";
          } else if (late_days) {
            deductionType = "Late";
          } else if (adv > 0) {
            deductionType = "Advance";
          } // Create deduction record


          _context.next = 28;
          return regeneratorRuntime.awrap(Deduction.create({
            salaryLedgerId: ledger.id,
            type: deductionType,
            absent_days: absent_days,
            late_days: late_days,
            deduction_date: deduction_date,
            advance_amount: adv,
            description: description,
            absent_amount: absent_amount,
            late_amount: late_amount,
            total_deduction: totalAmount
          }));

        case 28:
          deduction = _context.sent;
          res.status(200).json({
            message: "Deduction processed successfully",
            deduction: deduction,
            expense: expense
          });
          _context.next = 36;
          break;

        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](0);
          console.error("Error adding deduction", _context.t0);
          res.status(400).json({
            error: _context.t0.message
          });

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 32]]);
};