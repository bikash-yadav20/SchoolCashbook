const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  login,
  signUp,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signUp);
router.put("/reset-password", auth, resetPassword);
module.exports = router;
