const express = require("express");
const { empSalaryReport } = require("../controllers/employeeSalaryReport");
router = express.Router();

router.get("/emp-salary-report/:employeeId", empSalaryReport);

module.exports = router;
