const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  employeeList,
} = require("../controllers/employeeController");
const upload = require("../middleware/multer/multer");

router.post("/create-employee", upload.single("profile"), auth, createEmployee);
router.put("/update-employee/:employeeId", auth, updateEmployee);
router.get("/employees-list/:empStatus", employeeList);
router.get("/all-employees/:periodStart/:periodEnd", getEmployees);

module.exports = router;
