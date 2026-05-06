const Withdrawal = require("../models/Withdrawal")

function shape(w) {
  const obj = w.toObject({ versionKey: false })
  obj.id = obj._id.toString()
  obj.userId = obj.user?.toString?.() || obj.user
  obj.postId = obj.post?.toString?.() || obj.post
  delete obj._id
  delete obj.user
  delete obj.post
  return obj
}

exports.submit = async (req, res, next) => {
  try {
    const { postId, amount, bankName, accountNumber } = req.body
    if (!postId || !amount || !bankName || !accountNumber) {
      return res.status(400).json({ message: "All fields required" })
    }
    const w = await Withdrawal.create({
      user: req.user._id,
      post: postId,
      amount,
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      status: "pending",
    })
    res.status(201).json({ data: shape(w) })
  } catch (err) {
    next(err)
  }
}

exports.listAll = async (req, res, next) => {
  try {
    const list = await Withdrawal.find().sort({ createdAt: -1 })
    res.json({ data: list.map(shape) })
  } catch (err) {
    next(err)
  }
}

exports.listMine = async (req, res, next) => {
  try {
    const list = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ data: list.map(shape) })
  } catch (err) {
    next(err)
  }
}

exports.complete = async (req, res, next) => {
  try {
    const w = await Withdrawal.findById(req.params.id)
    if (!w) return res.status(404).json({ message: "Not found" })
    w.status = "completed"
    await w.save()
    res.json({ data: shape(w) })
  } catch (err) {
    next(err)
  }
}
