const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSummeryByDateRange,
  getOverallSum,
  overallTotalOnline,
  overallTotalCash,
  getExpenseSummeryByDateRange,
  overallTotalExpense,
} = require("../controllers/summeryController");

router.get("/range-total", auth, getSummeryByDateRange);
router.get("/overall-total", auth, getOverallSum);
router.get("/overall-online", auth, overallTotalOnline);
router.get("/overall-cash", auth, overallTotalCash);
router.get("/range-expense", auth, getExpenseSummeryByDateRange);
router.get("/overall-expense", auth, overallTotalExpense);

module.exports = router;
