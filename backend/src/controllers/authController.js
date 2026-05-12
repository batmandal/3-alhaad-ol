const User = require("../models/User")
const { signToken } = require("../utils/jwt")

// Signup гэснийг Register болгож өөрчлөв (Routes-тэйгээ ижил болгох)
exports.register = async (req, res, next) => {
  try {
    const { sisiId, phone, email, password, facebook, name } = req.body
    if (!sisiId || !phone || !email || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" })
    }
    const exists = await User.findOne({
      $or: [{ sisiId: sisiId.trim() }, { phone: phone.trim() }, { email: email.trim().toLowerCase() }],
    })
    if (exists) {
      return res.status(409).json({ message: "SISI ID, phone, or email already registered" })
    }
    const user = await User.create({
      sisiId: sisiId.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      facebook: facebook?.trim(),
      name: name.trim(),
      password,
    })
    const token = signToken({ sub: user._id.toString() })
    res.status(201).json({ token, user: user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { phoneOrEmail, password } = req.body
    if (!phoneOrEmail || !password) {
      return res.status(400).json({ message: "phoneOrEmail and password required" })
    }
    const q = phoneOrEmail.trim().toLowerCase()
    const user = await User.findOne({
      $or: [{ phone: phoneOrEmail.trim() }, { email: q }],
    }).select("+password")
    if (!user) return res.status(401).json({ message: "Invalid credentials" })
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(401).json({ message: "Invalid credentials" })
    const token = signToken({ sub: user._id.toString() })
    res.json({ token, user: user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

exports.me = async (req, res) => {
  res.json({ user: req.user.toPublicJSON() })
}