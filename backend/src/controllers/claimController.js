const Claim = require("../models/Claim")
const Post = require("../models/Post")
const { normalizeAnswer } = require("../utils/normalize")

function shapeClaim(c) {
  const obj = c.toObject({ versionKey: false })
  obj.id = obj._id.toString()
  obj.postId = obj.post?.toString?.() || obj.post
  obj.claimantId = obj.claimant?.toString?.() || obj.claimant
  delete obj._id
  delete obj.post
  delete obj.claimant
  return obj
}

exports.submit = async (req, res, next) => {
  try {
    const { postId, answers } = req.body
    if (!postId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "postId and answers required" })
    }
    const post = await Post.findById(postId).select("+correctAnswer +verificationQuestions")
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (post.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot claim your own post" })
    }
    const existing = await Claim.findOne({
      post: post._id,
      claimant: req.user._id,
      status: { $in: ["pending", "approved"] },
    })
    if (existing) return res.status(409).json({ message: "Claim already exists" })

    const questions =
      post.verificationQuestions?.length
        ? post.verificationQuestions
        : post.verificationQuestion && post.correctAnswer
          ? [{ question: post.verificationQuestion, answer: post.correctAnswer }]
          : []
    if (!questions.length) {
      return res.status(400).json({ message: "Post has no verification questions" })
    }
    const answersCorrect = questions.map(
      (q, i) => normalizeAnswer(answers[i] ?? "") === normalizeAnswer(q.answer)
    )
    const claim = await Claim.create({
      post: post._id,
      postTitle: post.title,
      postType: post.type,
      claimant: req.user._id,
      claimantName: req.user.name,
      claimantEmail: req.user.email,
      claimantPhone: req.user.phone,
      answers,
      answersCorrect,
      status: "pending",
    })
    res.status(201).json({ data: shapeClaim(claim) })
  } catch (err) {
    next(err)
  }
}

exports.listForPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" })
    }
    const claims = await Claim.find({ post: post._id }).sort({ createdAt: -1 })
    res.json({ data: claims.map(shapeClaim) })
  } catch (err) {
    next(err)
  }
}

exports.myClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id }).sort({ createdAt: -1 })
    res.json({ data: claims.map(shapeClaim) })
  } catch (err) {
    next(err)
  }
}

exports.approve = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
    if (!claim) return res.status(404).json({ message: "Claim not found" })
    const post = await Post.findById(claim.post)
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" })
    }
    claim.status = "approved"
    await claim.save()
    await Claim.updateMany(
      { post: claim.post, _id: { $ne: claim._id }, status: "pending" },
      { status: "rejected" }
    )
    res.json({ data: shapeClaim(claim) })
  } catch (err) {
    next(err)
  }
}

exports.reject = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
    if (!claim) return res.status(404).json({ message: "Claim not found" })
    const post = await Post.findById(claim.post)
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (!req.user.isAdmin && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" })
    }
    claim.status = "rejected"
    await claim.save()
    res.json({ data: shapeClaim(claim) })
  } catch (err) {
    next(err)
  }
}
