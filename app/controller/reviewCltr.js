const Review = require('../model/reviewModel')
const Vehicle = require('../model/vehicleModel')
const { validationResult } = require('express-validator')
const _ = require('lodash')

const reviewCltr = {}


reviewCltr.add = async (req, res) => {
  const body = _.pick(req.body, ["vehicleId", "rating", "comment"])
  const userId = req.user.id
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    //Check if user alrady gave reviews
    const reviewFound = await Review.findOne({ userId: userId, vehicleId: body.vehicleId })
    if (!reviewFound) {
      const review = new Review(body)
      review.userId = userId
      await review.save()

      //update rating in vehicle
      await Vehicle.findOneAndUpdate({ _id: body.vehicleId }, { $push: { ratings: review } })
      res.json(review)
    }
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = reviewCltr