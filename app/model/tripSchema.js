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
    enum: ["Booked", "In progress", "Completed"],
    default: "Booked"
  },
  tripStartDateTime: Date,
  tripEndDateTime: Date,
  distance: Number,
  tripStartOdo: Number,
  tripEndOdo: Number,
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "Payment"
  }
}, { timestamps: true })

const Trip = model("Trip", tripSchema)

module.exports = Trip