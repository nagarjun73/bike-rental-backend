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
  amount: Number,
  paymentType: String,
  stripTransactionId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'Successful'],
    default: "pending"
  }
}, { timestamps: true })

const Payment = model("Payment", paymentSchema)

module.exports = Payment