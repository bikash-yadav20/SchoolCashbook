"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../models"),
    Fee = _require.Fee,
    DailyCashBalance = _require.DailyCashBalance;

var _require2 = require("../middleware/validate"),
    feeSchema = _require2.feeSchema; //Helper function for data comparison----


var prepare = function prepare(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ").sort().join(" ");
};

var similarity = function similarity(a, b) {
  var w1 = prepare(a).split(" ");
  var w2 = prepare(b).split(" ");
  var match = w1.filter(function (w) {
    return w2.includes(w);
  }).length;
  return match / Math.max(w1.length, w2.length);
};

exports.createFee = function _callee(req, res) {
  var _feeSchema$validate, error, value, total_amount, online_amount, reason, date, isclosed, cash_amount, targetDate, existingData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, old, sameAmount, similarData, row;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _feeSchema$validate = feeSchema.validate(req.body), error = _feeSchema$validate.error, value = _feeSchema$validate.value;

          if (!error) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: error.message
          }));

        case 4:
          total_amount = value.total_amount, online_amount = value.online_amount, reason = value.reason, date = value.date;
          _context.next = 7;
          return regeneratorRuntime.awrap(DailyCashBalance.findOne({
            where: {
              date: date
            }
          }));

        case 7:
          isclosed = _context.sent;

          if (!(isclosed && isclosed.closed)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Day is already closed, cannot add fees"
          }));

        case 10:
          if (!(online_amount > total_amount)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Online amount cannot exceed total amount"
          }));

        case 12:
          cash_amount = (Number(total_amount) - Number(online_amount)).toFixed(2);
          targetDate = date || new Date().toISOString().slice(0, 10);
          _context.next = 16;
          return regeneratorRuntime.awrap(Fee.findAll({
            where: {
              date: targetDate
            }
          }));

        case 16:
          existingData = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 20;
          _iterator = existingData[Symbol.iterator]();

        case 22:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 31;
            break;
          }

          old = _step.value;
          sameAmount = Number(old.total_amount) === Number(total_amount) && Number(old.online_amount) === Number(online_amount);
          similarData = similarity(old.reason, reason) > 0.7;

          if (!(sameAmount && similarData)) {
            _context.next = 28;
            break;
          }

          return _context.abrupt("return", res.status(409).json({
            warning: "⚠️ Simillar Entry already exists",
            existing: old
          }));

        case 28:
          _iteratorNormalCompletion = true;
          _context.next = 22;
          break;

        case 31:
          _context.next = 37;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](20);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 37:
          _context.prev = 37;
          _context.prev = 38;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 40:
          _context.prev = 40;

          if (!_didIteratorError) {
            _context.next = 43;
            break;
          }

          throw _iteratorError;

        case 43:
          return _context.finish(40);

        case 44:
          return _context.finish(37);

        case 45:
          _context.next = 47;
          return regeneratorRuntime.awrap(Fee.create({
            total_amount: total_amount,
            online_amount: online_amount,
            cash_amount: cash_amount,
            reason: reason,
            date: date || new Date().toISOString().slice(0, 10),
            created_by: req.user.id
          }));

        case 47:
          row = _context.sent;
          res.status(201).json(row);
          _context.next = 55;
          break;

        case 51:
          _context.prev = 51;
          _context.t1 = _context["catch"](0);
          console.error("Fee creation error:", _context.t1);
          res.status(500).json({
            error: "Failed to create fee",
            details: _context.t1.message
          });

        case 55:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 51], [20, 33, 37, 45], [38,, 40, 44]]);
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
          return regeneratorRuntime.awrap(Fee.findAll({
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
            error: "Failed to fetch fees"
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.totalsByDate = function _callee3(req, res) {
  var date, targetDate, rows, totals;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          date = req.query.date;
          targetDate = date || new Date().toISOString().slice(0, 10);
          _context3.next = 5;
          return regeneratorRuntime.awrap(Fee.findAll({
            where: {
              date: targetDate
            }
          }));

        case 5:
          rows = _context3.sent;
          totals = rows.reduce(function (acc, r) {
            acc.total_fees += Number(r.total_amount);
            acc.total_online += Number(r.online_amount);
            acc.total_cash += Number(r.cash_amount);
            return acc;
          }, {
            total_fees: 0,
            total_online: 0,
            total_cash: 0
          });
          res.json(_objectSpread({
            date: targetDate
          }, totals));
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: "Failed to calculate fee totals"
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.deleteFee = function _callee4(req, res) {
  var id, deleted;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Fee.destroy({
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
            error: "Fee not found"
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
          console.error("Fee deletion error:", _context4.t0);
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