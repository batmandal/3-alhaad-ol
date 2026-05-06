const express = require("express")
const ctrl = require("../controllers/adminController")
const { requireAuth, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.use(requireAuth, requireAdmin)
router.get("/stats", ctrl.stats)
router.get("/transactions", ctrl.listTransactions)
router.get("/security-logs", ctrl.listSecurityLogs)

module.exports = router
