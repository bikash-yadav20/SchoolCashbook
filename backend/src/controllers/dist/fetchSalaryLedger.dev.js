"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("../models"),
    Deduction = _require.Deduction,
    SalaryLedger = _require.SalaryLedger,
    Employee = _require.Employee;

function normalizeDate(dateStr) {
  if (dateStr.includes("/")) {
    var _dateStr$split = dateStr.split("/"),
        _dateStr$split2 = _slicedToArray(_dateStr$split, 3),
        day = _dateStr$split2[0],
        month = _dateStr$split2[1],
        year = _dateStr$split2[2];

    return "".concat(year, "-").concat(month, "-").concat(day);
  }

  return dateStr;
}

exports.getSalaryReport = function _callee2(req, res) {
  var employees, _req$body, periodStart, periodEnd, reports;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Employee.findAll());

        case 3:
          employees = _context2.sent;
          _req$body = req.body, periodStart = _req$body.periodStart, periodEnd = _req$body.periodEnd;
          periodStart = normalizeDate(periodStart);
          periodEnd = normalizeDate(periodEnd);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all(employees.map(function _callee(employee) {
            var ledger, deductions, totals, netSalary;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(SalaryLedger.findOne({
                      where: {
                        employeeId: employee.employeeId,
                        periodStart: periodStart,
                        periodEnd: periodEnd
                      }
                    }));

                  case 2:
                    ledger = _context.sent;

                    if (ledger) {
                      _context.next = 5;
                      break;
                    }

                    return _context.abrupt("return", {
                      employeeId: employee.employeeId,
                      name: "".concat(employee.firstname, " ").concat(employee.lastname),
                      error: "No Ledger Found"
                    });

                  case 5:
                    _context.next = 7;
                    return regeneratorRuntime.awrap(Deduction.findAll({
                      where: {
                        salaryLedgerId: ledger.id
                      }
                    }));

                  case 7:
                    deductions = _context.sent;
                    // ✅ Aggregate totals
                    totals = {
                      absentDays: 0,
                      lateDays: 0,
                      absentAmount: 0,
                      lateAmount: 0,
                      advanceAmount: 0,
                      pf: 0,
                      totalDeduction: 0
                    };
                    deductions.forEach(function (d) {
                      totals.absentDays += d.absent_days || 0;
                      totals.lateDays += d.late_days || 0;
                      totals.absentAmount += d.absent_amount || 0;
                      totals.lateAmount += d.late_amount || 0;
                      totals.advanceAmount += d.advance_amount || 0;
                      totals.pf += d.pf_amount || 0;
                      totals.totalDeduction += (d.absent_amount || 0) + (d.late_amount || 0) + (d.advance_amount || 0) + (d.pf_amount || 0);
                    });
                    netSalary = ledger.payableAmount - totals.totalDeduction;
                    return _context.abrupt("return", _objectSpread({
                      employeeId: employee.employeeId,
                      name: "".concat(employee.firstname, " ").concat(employee.lastname),
                      grossSalary: ledger.payableAmount
                    }, totals, {
                      netSalary: netSalary
                    }));

                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 9:
          reports = _context2.sent;
          res.status(200).json(reports);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("Error generating salary reports", _context2.t0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};