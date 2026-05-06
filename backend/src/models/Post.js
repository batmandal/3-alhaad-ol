const mongoose = require("mongoose")

const VerificationQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
)

const PostSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "pending_payment", "published"],
      default: "published",
    },
    rewardAmount: { type: Number },
    fbShare: { type: Boolean, default: false },
    verificationQuestion: { type: String },
    correctAnswer: { type: String, select: false },
    verificationQuestions: { type: [VerificationQuestionSchema], default: undefined, select: false },
    finderRewardAmount: { type: Number },
    escrow: { type: Boolean, default: false },
    escrowPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
)

PostSchema.index({ type: 1, status: 1 })
PostSchema.index({ category: 1 })
PostSchema.index({ location: 1 })

module.exports = mongoose.model("Post", PostSchema)
