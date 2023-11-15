const _ = require('lodash')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
//importing models
const Payment = require('../model/paymentModel')
const Trip = require('../model/tripModel')

const paymentCltr = {}

//function for doing payments
paymentCltr.pay = async (req, res) => {
  const body = _.pick(req.body, ["amount", "tripId"])
  try {
    //crateing session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: "Booking Fee",
          },
          unit_amount: body.amount * 100,
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    })

    //creating new payment data
    const payment = new Payment(body)
    payment.userId = req.user.id
    payment.paymentType = "card"
    payment.stripTransactionId = session.id
    await payment.save()
    //responding with url to do payment in frintend
    res.json({ id: session.id, url: session.url })

  } catch (e) {
    res.status(400).json(e)
  }
}

//function for updating payment and booking status if payment success
paymentCltr.update = async (req, res) => {
  const id = req.params.id
  try {
    const updatePayment = await Payment.findOneAndUpdate({ stripTransactionId: id }, { paymentStatus: "Successful" }, { runValidators: true, new: true })
    const upDateTrip = await Trip.findByIdAndUpdate(updatePayment.tripId, { tripStatus: "booked", paymentId: updatePayment._id }, { runValidators: true, new: true })
    res.json(upDateTrip)
  } catch (e) {
    res.status(400).json(e)
  }
}

//function for deleting payment and booking if payment failed
paymentCltr.destroy = async (req, res) => {
  const id = req.params.id
  try {
    const deletePayment = await Payment.findOneAndDelete({ stripTransactionId: id })
    const deleteTrip = await Trip.findByIdAndDelete(deletePayment.tripId)
    res.json(deleteTrip)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = paymentCltr