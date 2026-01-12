const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createFee,
  listByDate,
  totalsByDate,
  deleteFee,
} = require("../controllers/feeController");

router.post("/", auth, createFee);
router.get("/", auth, listByDate);
router.get("/totals", auth, totalsByDate);
router.delete("/:id", auth, deleteFee);

module.exports = router;
