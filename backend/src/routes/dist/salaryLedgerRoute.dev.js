"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/salaryLedgerController"),
    generateMonthlySalary = _require.generateMonthlySalary;

var _require2 = require("../controllers/deductionController"),
    addDeduction = _require2.addDeduction;

var _require3 = require("../controllers/fetchSalaryLedger"),
    getSalaryReport = _require3.getSalaryReport;

var _require4 = require("../controllers/getPeriod"),
    getPeriodData = _require4.getPeriodData;

router.post("/salary-ledger", generateMonthlySalary);
router.post("/salary-deduction", addDeduction);
router.post("/salary-full-report", getSalaryReport);
router.get("/period", getPeriodData);
module.exports = router;