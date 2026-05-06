const { verifyToken } = require("../utils/jwt")
const User = require("../models/User")

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ""
    const token = header.startsWith("Bearer ") ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: "Not authenticated" })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: "User not found" })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin only" })
  }
  next()
}

module.exports = { requireAuth, requireAdmin }
