const { Schema, model } = require('mongoose')

const vehicletypeSchema = new Schema({
  name: String,
  minCc: Number,
  maxCc: Number,
  perDayKmLimit: Number,
  perDayCharge: Number,
  perHourCharge: Number
})

const Vehicletype = model("Vehicletype", vehicletypeSchema)

module.exports = Vehicletype