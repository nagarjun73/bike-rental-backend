const _ = require('lodash')
const Trip = require('../model/tripModel')

const tripCltr = {}

tripCltr.book = async (req, res) => {
  try {
    //Sanitize
    const body = _.pick(req.body, ["vehicleId", "hostId", "tripStartDate", "tripEndDate", "amount"])
    const userId = req.user.id
    console.log(userId)

    const trip = new Trip(body)
    trip.userId = userId
    await trip.save()
    res.json(trip)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = tripCltr