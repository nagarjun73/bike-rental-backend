const { Schema, model } = require('mongoose')

const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: "Trip"
  },
  amount: String,
  paymentType: String,
  paymentStatus: String, //"Pending",
}, { timestamps: true })

const Payment = model("Payment", paymentSchema)

module.exports = Payment