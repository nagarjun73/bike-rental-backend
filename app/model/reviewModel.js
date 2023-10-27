const { Schema, model } = require('mongoose')

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle"
  },
  rating: Number,
  comment: String
}, { timestamps: true })

const Review = model("Review", reviewSchema)
module.exports = Review