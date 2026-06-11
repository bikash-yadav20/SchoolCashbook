const express = require("express");
const { empSalaryReport } = require("../controllers/employeeSalaryReport");
const auth = require("../middleware/auth");
router = express.Router();

router.get("/emp-salary-report/:employeeId", auth, empSalaryReport);

module.exports = router;
