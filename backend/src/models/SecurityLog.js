const mongoose = require("mongoose")

const SecurityLogSchema = new mongoose.Schema(
  {
    timestamp: { type: String, required: true },
    email: { type: String, required: true },
    action: { type: String, required: true },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },
    ip: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model("SecurityLog", SecurityLogSchema)
