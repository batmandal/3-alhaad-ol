const Post = require("../models/Post")
const { normalizeAnswer } = require("../utils/normalize")

function shapePost(p, { includeAnswer = false } = {}) {
  const obj = p.toObject({ versionKey: false })
  obj.id = obj._id.toString()
  obj.authorId = obj.author?.toString?.() || obj.author
  delete obj._id
  delete obj.author
  if (!includeAnswer) {
    delete obj.correctAnswer
    delete obj.verificationQuestions
  }
  return obj
}

exports.list = async (req, res, next) => {
  try {
    const { type, status, category, location, search, mine } = req.query
    const filter = {}
    if (type) filter.type = type
    if (status) filter.status = status
    else filter.status = "published"
    if (category && category !== "бүгд") filter.category = category
    if (location && location !== "бүгд") filter.location = location
    if (mine === "true" && req.user) filter.author = req.user._id
    if (search) {
      const re = new RegExp(search.trim(), "i")
      filter.$or = [{ title: re }, { description: re }]
    }
    const posts = await Post.find(filter).sort({ createdAt: -1 })
    res.json({ data: posts.map((p) => shapePost(p)) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const p = await Post.findById(req.params.id)
    if (!p) return res.status(404).json({ message: "Post not found" })
    res.json({ data: shapePost(p) })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const {
      type, title, description, category, location, date, imageUrl,
      verificationQuestion, correctAnswer, verificationQuestions,
      rewardAmount, finderRewardAmount, fbShare, status,
    } = req.body
    if (!type || !title || !description || !category || !location || !date || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" })
    }
    if (!verificationQuestion?.trim() || !correctAnswer?.trim()) {
      return res.status(400).json({ message: "Verification question and answer required" })
    }
    const post = await Post.create({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      date,
      imageUrl,
      author: req.user._id,
      status: status || "pending_payment",
      verificationQuestion: verificationQuestion.trim(),
      correctAnswer: correctAnswer.trim(),
      verificationQuestions,
      rewardAmount,
      finderRewardAmount,
      fbShare,
    })
    res.status(201).json({ data: shapePost(post) })
  } catch (err) {
    next(err)
  }
}

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    if (!["draft", "pending_payment", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" })
    }
    post.status = status
    await post.save()
    res.json({ data: shapePost(post) })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" })
    }
    await post.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

exports.verifyAnswer = async (req, res, next) => {
  try {
    const { answer } = req.body
    const post = await Post.findById(req.params.id).select("+correctAnswer")
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!post.correctAnswer) {
      return res.status(400).json({ ok: false, message: "Verification not configured" })
    }
    const ok = normalizeAnswer(answer) === normalizeAnswer(post.correctAnswer)
    if (!ok) return res.status(400).json({ ok: false, message: "Wrong answer" })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
