const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  generateMonthlySalary,
  markPaid,
  getPaymentStatus,
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

/* updating payment status route */

router.put("/update-payment/:employeeId", auth, markPaid);
router.get("/payment-status/:periodStart/:periodEnd", auth, getPaymentStatus);

module.exports = router;
