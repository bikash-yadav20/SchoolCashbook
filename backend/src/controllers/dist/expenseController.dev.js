"use strict";

var _require = require("../models"),
    Expense = _require.Expense,
    DailyCashBalance = _require.DailyCashBalance;

var _require2 = require("../middleware/validate"),
    expenseSchema = _require2.expenseSchema;

exports.createExpense = function _callee(req, res) {
  var _expenseSchema$valida, error, value, expense_amount, reason, date, isClosed, row;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _expenseSchema$valida = expenseSchema.validate(req.body), error = _expenseSchema$valida.error, value = _expenseSchema$valida.value;

          if (!error) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: error.message
          }));

        case 4:
          expense_amount = value.expense_amount, reason = value.reason, date = value.date;
          _context.next = 7;
          return regeneratorRuntime.awrap(DailyCashBalance.findOne({
            where: {
              date: date
            }
          }));

        case 7:
          isClosed = _context.sent;

          if (!(isClosed && isClosed.closed)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Day is already closed, cannot add expense"
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(Expense.create({
            expense_amount: expense_amount,
            reason: reason,
            date: date || new Date().toISOString().slice(0, 10),
            created_by: req.user.id
          }));

        case 12:
          row = _context.sent;
          res.status(201).json(row);
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: "Failed to create expense"
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.listByDate = function _callee2(req, res) {
  var date, targetDate, rows;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          date = req.query.date;
          targetDate = date || new Date().toISOString().slice(0, 10);
          _context2.next = 5;
          return regeneratorRuntime.awrap(Expense.findAll({
            where: {
              date: targetDate
            },
            order: [["createdAt", "DESC"]]
          }));

        case 5:
          rows = _context2.sent;
          res.json(rows);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: "Failed to fetch expenses"
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.totalsByDate = function _callee3(req, res) {
  var date, targetDate, rows, total_expenses;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          date = req.query.date;
          targetDate = date || new Date().toISOString().slice(0, 10);
          _context3.next = 5;
          return regeneratorRuntime.awrap(Expense.findAll({
            where: {
              date: targetDate
            }
          }));

        case 5:
          rows = _context3.sent;
          total_expenses = rows.reduce(function (sum, r) {
            return sum + Number(r.expense_amount);
          }, 0);
          res.json({
            date: targetDate,
            total_expenses: total_expenses
          });
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: "Failed to calculate expense totals"
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.deleteExp = function _callee4(req, res) {
  var id, deleted;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Expense.destroy({
            where: {
              id: id
            }
          }));

        case 4:
          deleted = _context4.sent;

          if (!(deleted === 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "Expense not found"
          }));

        case 7:
          res.json({
            success: true,
            id: id
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error("Expense deletion error:", _context4.t0);
          res.status(500).json({
            error: "Failed to delete fee"
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};