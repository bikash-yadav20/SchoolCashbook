"use strict";

var _require = require("../models"),
    DailyCashBalance = _require.DailyCashBalance;

exports.startDay = function _callee(req, res) {
  var inputDate, yesterday, opening, today;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          inputDate = req.body.date || new Date().toISOString().slice(0, 10);
          _context.next = 3;
          return regeneratorRuntime.awrap(DailyCashBalance.findOne({
            order: [["date", "DESC"]]
          }));

        case 3:
          yesterday = _context.sent;
          opening = yesterday ? yesterday.next_opening_balance : 0;
          _context.next = 7;
          return regeneratorRuntime.awrap(DailyCashBalance.create({
            date: inputDate,
            opening_balance: opening
          }));

        case 7:
          today = _context.sent;
          res.json(today);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.closeDay = function _callee2(req, res) {
  var inputDate, cashFees, expenses, closing, today, opening, nextOpening;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          inputDate = req.body.date || new Date().toISOString().slice(0, 10);
          cashFees = Number(req.body.cash_fees_total);
          expenses = Number(req.body.expenses_total);
          closing = Number(req.body.closing_balance);
          _context2.next = 6;
          return regeneratorRuntime.awrap(DailyCashBalance.findOne({
            where: {
              date: inputDate
            }
          }));

        case 6:
          today = _context2.sent;

          if (today) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Day not started"
          }));

        case 9:
          opening = Number(today.opening_balance);
          nextOpening = cashFees - expenses - closing;
          today.cash_fees_total = cashFees;
          today.expenses_total = expenses;
          today.closing_balance = closing;
          today.next_opening_balance = nextOpening;
          today.closed = 1;
          _context2.next = 18;
          return regeneratorRuntime.awrap(today.save());

        case 18:
          res.json({
            message: "Day closed",
            finalCash: nextOpening,
            nextOpeningBalance: nextOpening
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getClosingBalance = function _callee3(req, res) {
  var inputDate, today;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          inputDate = req.query.date || new Date().toISOString().slice(0, 10);
          _context3.next = 4;
          return regeneratorRuntime.awrap(DailyCashBalance.findOne({
            where: {
              date: inputDate
            }
          }));

        case 4:
          today = _context3.sent;

          if (today) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Day not started"
          }));

        case 7:
          return _context3.abrupt("return", res.json({
            date: today.date,
            opening_balance: today.opening_balance,
            cash_fees_total: today.cash_fees_total,
            expenses_total: today.expenses_total,
            closing_balance: today.closing_balance,
            next_opening_balance: today.next_opening_balance
          }));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            error: "Server error"
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};