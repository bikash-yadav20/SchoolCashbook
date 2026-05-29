const express = require("express");

const router = express.Router();
const {
  deductionRule,
  createDeductionRule,
  getDeductionRules,
} = require("../controllers/deductionRulesController");

router.get("/deduction-types", deductionRule);
router.post("/create-deduction-rule", createDeductionRule);
router.get("/get-deduction-rules", getDeductionRules);

module.exports = router;
