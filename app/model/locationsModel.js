const { Schema, model } = require('mongoose')

const locationSchema = new Schema({
  name: String
}, { timestamps: true })

const Location = model("Location", locationSchema)

module.exports = Location