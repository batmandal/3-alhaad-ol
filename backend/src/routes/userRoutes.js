const express = require("express")
const ctrl = require("../controllers/userController")
const { requireAuth, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.get("/", requireAuth, requireAdmin, ctrl.list)
router.patch("/me", requireAuth, ctrl.updateMe)
router.get("/:id", requireAuth, ctrl.getById)

module.exports = router
