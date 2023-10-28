const { Schema, model } = require('mongoose')

const chargeSchema = new Schema({
  name: String,
  minCc: Number,
  maxCc: Number,
  perDayKmLimit: Number,
  perDayCharge: Number
})

const Charge = model("Charge", chargeSchema)

module.exports = Charge