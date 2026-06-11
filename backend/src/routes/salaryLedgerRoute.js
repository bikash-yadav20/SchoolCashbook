const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  generateMonthlySalary,
} = require("../controllers/salaryLedgerController");
const { addDeduction } = require("../controllers/deductionController");
const {
  getSalaryReport,
  downloadSalaryReport,
  getAllReportsForEmployee,
} = require("../controllers/fetchSalaryLedger");
const { getPeriodData } = require("../controllers/getPeriod");

router.post("/salary-ledger", auth, generateMonthlySalary);
router.post("/salary-deduction", auth, addDeduction);
router.post("/salary-full-report", auth, getSalaryReport);
router.post("/download-full-report", auth, downloadSalaryReport);
router.get("/salary-report/:employeeId", auth, getAllReportsForEmployee);
router.get("/period", auth, getPeriodData);

module.exports = router;
