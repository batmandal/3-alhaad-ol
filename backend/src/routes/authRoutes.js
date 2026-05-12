const express = require("express")
const ctrl = require("../controllers/authController")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

router.post("/signup", ctrl.signup)
router.post("/login", ctrl.login)
router.get("/me", requireAuth, ctrl.me)

module.exports = router
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});