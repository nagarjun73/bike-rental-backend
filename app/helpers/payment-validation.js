
const Trip = require('../model/tripModel')

const tripIdSchema = {
  notEmpty: {
    errorMessage: "Trip ID is empty",
    bail: true
  },
  isMongoId: {
    errorMessage: "Invalid ID format",
    bail: true
  },
  custom: {
    //checks wheather id found in database
    options: async (value, { req, res }) => {
      const id = req.tripId
      const findId = await Trip.findById(id)
      if (findId) {
        return true
      } else {
        throw new Error("Trip ID not found")
      }
    }
  }
}

const amountSchema = {
  notEmpty: {
    errorMessage: "Amount is Empty",
    bail: true
  },
  custom: {
    //checks wheather amount matches to specific tripId
    options: async (value, { req, res }) => {
      const id = req.tripId
      const amount = req.amount
      const findTrip = await Trip.findById(id)
      if (findTrip.amount == amount) {
        return true
      } else {
        throw new Error("Invalid amount")
      }
    }
  }
}

const paymentValidationSchema = {
  tripId: tripIdSchema,
  amount: amountSchema
}

module.exports = paymentValidationSchema