const _ = require('lodash')
const { differenceInDays } = require('date-fns')
const Trip = require('../model/tripModel')

const tripCltr = {}

tripCltr.book = async (req, res) => {
  try {
    //Sanitize
    const body = _.pick(req.body, ["vehicleId", "hostId", "tripStartDate", "tripEndDate", "perDayCharge"])
    const userId = req.user.id
    const tripDays = differenceInDays(new Date(body.tripEndDate), new Date(body.tripStartDate)) + 1

    const trip = new Trip(body)
    trip.userId = userId
    trip.amount = body.perDayCharge * tripDays
    await trip.save()
    res.json(trip)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = tripCltr