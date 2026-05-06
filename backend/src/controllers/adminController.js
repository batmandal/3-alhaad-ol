const User = require("../models/User")
const Post = require("../models/Post")
const Claim = require("../models/Claim")
const Transaction = require("../models/Transaction")
const SecurityLog = require("../models/SecurityLog")

exports.stats = async (req, res, next) => {
  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const [
      totalUsers, totalPosts, publishedPosts, monthPosts,
      pendingClaims, approvedClaims,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "published", createdAt: { $gte: monthStart } }),
      Claim.countDocuments({ status: "pending" }),
      Claim.countDocuments({ status: "approved" }),
    ])
    const recovered = await Claim.distinct("claimant", { status: "approved" })
    res.json({
      totalUsers,
      totalPosts,
      publishedPosts,
      monthPosts,
      pendingClaims,
      approvedClaims,
      recoveredUsers: recovered.length,
    })
  } catch (err) {
    next(err)
  }
}

exports.listTransactions = async (req, res, next) => {
  try {
    const data = await Transaction.find().sort({ createdAt: -1 }).limit(200)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

exports.listSecurityLogs = async (req, res, next) => {
  try {
    const data = await SecurityLog.find().sort({ createdAt: -1 }).limit(200)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}
