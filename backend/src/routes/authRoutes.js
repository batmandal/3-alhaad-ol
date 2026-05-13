const express = require("express")
const ctrl = require("../controllers/authController")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

router.post("/register", ctrl.register) // Энд ctrl.register байгаа тул контроллер дээрээ register гэж нэрлэх ёстой
router.post("/login", ctrl.login)
router.post("/logout", (req, res) => {
    res.json({ success: true, message: "Logged out" })
})
router.get("/me", requireAuth, ctrl.me)

module.exports = router