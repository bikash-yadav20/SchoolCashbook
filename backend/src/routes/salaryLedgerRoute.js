const express = require("express");
const router = express.Router();
const {
  generateMonthlySalary,
} = require("../controllers/salaryLedgerController");
const { addDeduction } = require("../controllers/deductionController");
const { getSalaryReport } = require("../controllers/fetchSalaryLedger");
const { getPeriodData } = require("../controllers/getPeriod");

router.post("/salary-ledger", generateMonthlySalary);
router.post("/salary-deduction", addDeduction);
router.post("/salary-full-report", getSalaryReport);
router.get("/period", getPeriodData);

module.exports = router;
