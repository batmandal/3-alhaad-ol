const mongoose = require("mongoose")

const ClaimSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    postTitle: { type: String, required: true },
    postType: { type: String, enum: ["lost", "found"], required: true },
    claimant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    claimantName: { type: String, required: true },
    claimantEmail: { type: String, required: true },
    claimantPhone: { type: String, required: true },
    answers: { type: [String], default: [] },
    answersCorrect: { type: [Boolean], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

ClaimSchema.index({ post: 1, claimant: 1 })

module.exports = mongoose.model("Claim", ClaimSchema)
