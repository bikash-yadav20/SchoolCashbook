"use strict";

var _require = require("../models"),
    SalaryLedger = _require.SalaryLedger,
    Deduction = _require.Deduction,
    Employee = _require.Employee;

exports.generateMonthlySalary = function _callee(req, res) {
  var employees, _req$body, periodStart, periodEnd, now, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, emp, ledger, existingDeduction;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Employee.findAll());

        case 3:
          employees = _context.sent;
          _req$body = req.body, periodStart = _req$body.periodStart, periodEnd = _req$body.periodEnd;
          now = new Date();
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

          result = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 13;
          _iterator = employees[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 35;
            break;
          }

          emp = _step.value;
          _context.next = 19;
          return regeneratorRuntime.awrap(SalaryLedger.findOne({
            where: {
              employeeId: emp.employeeId,
              periodStart: periodStart,
              periodEnd: periodEnd
            }
          }));

        case 19:
          ledger = _context.sent;

          if (ledger) {
            _context.next = 24;
            break;
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(SalaryLedger.create({
            employeeId: emp.employeeId,
            payableAmount: emp.salary,
            periodStart: periodStart,
            periodEnd: periodEnd,
            isPaid: false
          }));

        case 23:
          ledger = _context.sent;

        case 24:
          if (!emp.pf) {
            _context.next = 31;
            break;
          }

          _context.next = 27;
          return regeneratorRuntime.awrap(Deduction.findOne({
            where: {
              salaryLedgerId: ledger.id,
              type: "PF"
            }
          }));

        case 27:
          existingDeduction = _context.sent;

          if (existingDeduction) {
            _context.next = 31;
            break;
          }

          _context.next = 31;
          return regeneratorRuntime.awrap(Deduction.create({
            salaryLedgerId: ledger.id,
            pf_amount: emp.pf,
            type: "PF",
            description: "PF Deduction"
          }));

        case 31:
          result.push(ledger);

        case 32:
          _iteratorNormalCompletion = true;
          _context.next = 15;
          break;

        case 35:
          _context.next = 41;
          break;

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 41:
          _context.prev = 41;
          _context.prev = 42;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 44:
          _context.prev = 44;

          if (!_didIteratorError) {
            _context.next = 47;
            break;
          }

          throw _iteratorError;

        case 47:
          return _context.finish(44);

        case 48:
          return _context.finish(41);

        case 49:
          res.status(200).json({
            Message: "monthly ledger created",
            ledgers: result
          });
          _context.next = 56;
          break;

        case 52:
          _context.prev = 52;
          _context.t1 = _context["catch"](0);
          console.error("error creating salary ledger", _context.t1);
          res.status(400).json({
            error: _context.t1.message
          });

        case 56:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 52], [13, 37, 41, 49], [42,, 44, 48]]);
};