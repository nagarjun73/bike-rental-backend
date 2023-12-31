const { Schema, model } = require('mongoose')

const tripSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle"
  },
  tripStatus: {
    type: String,
    enum: ["pending", "booked", "inprogress", "completed"],
    default: "pending"
  },
  tripStartDate: Date,
  tripEndDate: Date,
  amount: {
    type: Number,
  },
  distance: {
    type: Number,
    default: 0
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    default: null
  }
}, { timestamps: true })

const Trip = model("Trip", tripSchema)

module.exports = Trip