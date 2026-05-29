const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  leaveTypes,
  createLeaveRule,
  getLeaveRule,
} = require("../controllers/leaveRulesControllers");

router.get("/leave-types", auth, leaveTypes);
router.post("/create-leave", auth, createLeaveRule);
router.get("/leave-rules", auth, getLeaveRule);

module.exports = router;
