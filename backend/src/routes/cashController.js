const express = require("express");
const router = express.Router();
const cashController = require("../controllers/cashController");
const auth = require("../middleware/auth");

// Opening balance (start day)
router.post("/opening", auth, cashController.startDay);

// Closing balance (close day)
router.post("/closing", auth, cashController.closeDay);

//get Closing balance from database

router.get("/opening-balance", auth, cashController.getClosingBalance);

module.exports = router;
