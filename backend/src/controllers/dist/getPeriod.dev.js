"use strict";

var SalaryLedger = require("../models/salaryLedger");

exports.getPeriodData = function _callee(req, res) {
  var record, periods;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(SalaryLedger.findAll({
            attributes: ["periodStart", "periodEnd"],
            group: ["periodStart", "periodEnd"],
            order: [["periodStart", "DESC"]]
          }));

        case 3:
          record = _context.sent;
          periods = record.map(function (r) {
            return {
              periodStart: new Date(r.periodStart).toLocaleDateString("en-GB"),
              periodEnd: new Date(r.periodEnd).toLocaleDateString("en-GB")
            };
          });
          res.status(200).json(periods);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching periods", _context.t0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};