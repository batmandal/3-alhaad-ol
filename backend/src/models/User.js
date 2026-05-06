const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
  {
    sisiId: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    facebook: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

UserSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    sisiId: this.sisiId,
    phone: this.phone,
    email: this.email,
    facebook: this.facebook,
    name: this.name,
    isAdmin: this.isAdmin,
  }
}

module.exports = mongoose.model("User", UserSchema)
