const mongoose = require("mongoose")

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "lost", "found", "reward"],
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Faq", FaqSchema)
