const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  name: String,
  email: String,
  mobileNumber: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "host", "user"],
    default: "user"
  },
  verified: {
    type: Boolean,
    default: false
  },
}, { timestamps: true })

const User = model("User", userSchema)

module.exports = User