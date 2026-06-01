"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// controllers/fetchSalaryLedger.js
var _require = require("../models"),
    Deduction = _require.Deduction,
    SalaryLedger = _require.SalaryLedger,
    Employee = _require.Employee;

var ExcelJS = require("exceljs");

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
} // Shared helper


function buildSalaryReports(periodStart, periodEnd) {
  var employees;
  return regeneratorRuntime.async(function buildSalaryReports$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Employee.findAll());

        case 2:
          employees = _context2.sent;
          return _context2.abrupt("return", Promise.all(employees.map(function _callee(employee) {
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

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
} // JSON controller


exports.getSalaryReport = function _callee2(req, res) {
  var _req$body, periodStart, periodEnd, reports;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, periodStart = _req$body.periodStart, periodEnd = _req$body.periodEnd;
          periodStart = normalizeDate(periodStart);
          periodEnd = normalizeDate(periodEnd);
          _context3.next = 6;
          return regeneratorRuntime.awrap(buildSalaryReports(periodStart, periodEnd));

        case 6:
          reports = _context3.sent;
          res.status(200).json(reports);
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error("Error generating salary reports", _context3.t0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Excel controller


exports.downloadSalaryReport = function _callee3(req, res) {
  var _req$body2, periodStart, periodEnd, reports, workbook, worksheet;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, periodStart = _req$body2.periodStart, periodEnd = _req$body2.periodEnd;
          periodStart = normalizeDate(periodStart);
          periodEnd = normalizeDate(periodEnd);
          _context4.next = 6;
          return regeneratorRuntime.awrap(buildSalaryReports(periodStart, periodEnd));

        case 6:
          reports = _context4.sent;
          workbook = new ExcelJS.Workbook();
          worksheet = workbook.addWorksheet("Salary Report");
          worksheet.columns = [{
            header: "Employee ID",
            key: "employeeId",
            width: 15
          }, {
            header: "Name",
            key: "name",
            width: 25
          }, {
            header: "Gross Salary",
            key: "grossSalary",
            width: 15
          }, {
            header: "Absent Days",
            key: "absentDays",
            width: 15
          }, {
            header: "Absent Amount",
            key: "absentAmount",
            width: 15
          }, {
            header: "Late Days",
            key: "lateDays",
            width: 15
          }, {
            header: "Late Amount",
            key: "lateAmount",
            width: 15
          }, {
            header: "Advance Amount",
            key: "advanceAmount",
            width: 15
          }, {
            header: "PF Amount",
            key: "pf",
            width: 15
          }, {
            header: "Total Deduction",
            key: "totalDeduction",
            width: 20
          }, {
            header: "Net Salary",
            key: "netSalary",
            width: 15
          }];
          reports.forEach(function (report) {
            return worksheet.addRow(report);
          });
          res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          res.setHeader("Content-Disposition", "attachment; filename=salary_report.xlsx");
          _context4.next = 15;
          return regeneratorRuntime.awrap(workbook.xlsx.write(res));

        case 15:
          res.end();
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.error("Error generating Excel report", _context4.t0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
};