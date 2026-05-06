const User = require("../models/User")

exports.list = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ data: users.map((u) => u.toPublicJSON()) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id)
    if (!u) return res.status(404).json({ message: "User not found" })
    res.json({ data: u.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, email, sisiId } = req.body
    if (!name || !phone || !email || !sisiId) {
      return res.status(400).json({ message: "All fields are required" })
    }
    const next_ = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      sisiId: sisiId.trim(),
    }
    const dup = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [{ phone: next_.phone }, { email: next_.email }, { sisiId: next_.sisiId }],
    })
    if (dup) return res.status(409).json({ message: "Phone/email/SISI ID already taken" })

    Object.assign(req.user, next_)
    await req.user.save()
    res.json({ user: req.user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}
