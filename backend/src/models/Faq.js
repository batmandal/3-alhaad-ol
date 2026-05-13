const mongoose = require("mongoose")

const FaqSchema = new mongoose.Schema(
  {
    question: { 
      type: String, 
      required: true, 
      trim: true 
    },
    answer: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      enum: ["general", "lost", "found", "reward"],
      required: true,
      index: true, // Ангиллаар шүүхэд хурдан болгоно
    },
    order: { 
      type: Number, 
      default: 0 // Асуултуудын харагдах дарааллыг удирдахад хэрэгтэй
    },
    isActive: {
      type: Boolean,
      default: true // Түр харуулахгүй байх шаардлага гарвал ашиглана
    }
  },
  { timestamps: true,

toJSON: { virtuals: true },
toObject: { virtuals: true }
  }
)

FaqSchema.virtual("id").get(function () {
  return this._id.toHexString()
})
module.exports = mongoose.model("Faq", FaqSchema)
