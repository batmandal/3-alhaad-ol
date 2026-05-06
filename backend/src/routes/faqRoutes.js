const express = require("express")
const ctrl = require("../controllers/faqController")
const { requireAuth, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.get("/", ctrl.list)
router.get("/:id", ctrl.getById)
router.post("/", requireAuth, requireAdmin, ctrl.create)
router.patch("/:id", requireAuth, requireAdmin, ctrl.update)
router.delete("/:id", requireAuth, requireAdmin, ctrl.remove)

module.exports = router
