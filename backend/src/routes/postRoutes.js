const express = require("express")
const ctrl = require("../controllers/postController")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

router.get("/", ctrl.list)
router.get("/:id", ctrl.getById)
router.post("/", requireAuth, ctrl.create)
router.patch("/:id/status", requireAuth, ctrl.updateStatus)
router.delete("/:id", requireAuth, ctrl.remove)
router.post("/:id/verify", ctrl.verifyAnswer)

module.exports = router
