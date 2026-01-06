const express = require("express");
const router = express.Router();
const cashController = require("../controllers/cashController");

// Opening balance (start day)
router.post("/opening", cashController.startDay);

// Closing balance (close day)
router.post("/closing", cashController.closeDay);

//get Closing balance from database

router.get("/opening-balance", cashController.getClosingBalance);

module.exports = router;
