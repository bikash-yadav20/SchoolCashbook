const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createEmployee,
  getEmployees,
} = require("../controllers/employeeController");
const upload = require("../middleware/multer/multer");

router.post("/create-employee", upload.single("profile"), createEmployee);
router.get("/all-employees", getEmployees);

module.exports = router;
