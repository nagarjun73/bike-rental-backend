const { Schema, model } = require('mongoose')

const addressSchema = new Schema({
  fullName: String,
  mobile: Number,
  houseNumber: String,
  area: String,
  landmark: String,
  pincode: Number,
  city: String,
  state: String
}, { timestamps: true })

const Address = model("Address", addressSchema)

module.exports = Address