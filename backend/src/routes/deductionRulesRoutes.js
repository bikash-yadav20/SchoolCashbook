const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
const {
  deductionRule,
  createDeductionRule,
  getDeductionRules,
} = require("../controllers/deductionRulesController");

router.get("/deduction-types", auth, deductionRule);
router.post("/create-deduction-rule", auth, createDeductionRule);
router.get("/get-deduction-rules", auth, getDeductionRules);

module.exports = router;
