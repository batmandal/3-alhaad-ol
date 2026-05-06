const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["escrow_deposit", "escrow_release", "fee"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
    },
    date: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Transaction", TransactionSchema)
