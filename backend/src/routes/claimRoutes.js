const express = require("express")
const ctrl = require("../controllers/claimController")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

router.post("/", requireAuth, ctrl.submit)
router.get("/me", requireAuth, ctrl.myClaims)
router.get("/post/:postId", requireAuth, ctrl.listForPost)
router.patch("/:id/approve", requireAuth, ctrl.approve)
router.patch("/:id/reject", requireAuth, ctrl.reject)

module.exports = router
