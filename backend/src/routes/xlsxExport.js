const { exportDailyLedger } = require("../controllers/xlsxExport");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/daily-ledger", auth, exportDailyLedger);

module.exports = router;
