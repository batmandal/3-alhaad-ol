const Faq = require("../models/Faq")

const FAQ_CATEGORIES = {
  general: "Ерөнхий",
  lost: "Алдсан зүйл",
  found: "Олдсон зүйл",
  reward: "Шагнал",
}

function shape(f) {
  const obj = f.toObject({ versionKey: false })
  obj.id = obj._id.toString()
  delete obj._id
  return obj
}

exports.list = async (req, res, next) => {
  try {
    const { category } = req.query
    const filter = category && category !== "all" ? { category } : {}
    const data = await Faq.find(filter).sort({ createdAt: 1 })
    res.json({
      total: data.length,
      categories: FAQ_CATEGORIES,
      data: data.map(shape),
    })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const f = await Faq.findById(req.params.id)
    if (!f) return res.status(404).json({ error: `'${req.params.id}' id-тай асуулт олдсонгүй` })
    res.json(shape(f))
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { question, answer, category } = req.body
    if (!question || !answer || !category) {
      return res.status(400).json({ message: "question, answer, category required" })
    }
    const f = await Faq.create({ question: question.trim(), answer, category })
    res.status(201).json({ data: shape(f) })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const f = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!f) return res.status(404).json({ message: "Not found" })
    res.json({ data: shape(f) })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const f = await Faq.findByIdAndDelete(req.params.id)
    if (!f) return res.status(404).json({ message: "Not found" })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
