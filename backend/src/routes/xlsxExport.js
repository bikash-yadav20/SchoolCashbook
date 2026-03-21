const { exportDailyLedger } = require("../controllers/xlsxExport");
const express = require("express");
const router = express.Router();

router.get("/daily-ledger", exportDailyLedger);

module.exports = router;
