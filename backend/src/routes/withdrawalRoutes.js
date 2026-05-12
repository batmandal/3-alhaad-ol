const express = require("express")
const ctrl = require("../controllers/withdrawalController")
const { requireAuth, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.post("/", requireAuth, ctrl.submit)
router.get("/me", requireAuth, ctrl.listMine)

// ТЕСТ: requireAuth, requireAdmin-ийг түр хасаад шалгах
router.get("/", ctrl.listAll) 

router.patch("/:id/complete", requireAuth, requireAdmin, ctrl.complete)

module.exports = router