const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  pinExpense,
  getPriorities,
} = require("../controllers/priorityController");

router.put("/:id/pin", auth, pinExpense);
router.get("/priorities", auth, getPriorities);

module.exports = router;
