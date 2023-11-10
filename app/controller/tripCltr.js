const _ = require('lodash')
const { intervalToDuration } = require('date-fns')
const Trip = require('../model/tripModel')
const Profile = require('../model/profileModel')
const Vehicle = require('../model/vehicleModel')
const { validationResult } = require('express-validator')

const tripCltr = {}

tripCltr.book = async (req, res) => {
  //checking errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    //Sanitize input data
    const body = _.pick(req.body, ["vehicleId", "hostId", "tripStartDate", "tripEndDate"])
    const userId = req.user.id

    //Calculting trip time difference using date-fns
    const { days, hours } = intervalToDuration({ start: new Date(body.tripStartDate), end: new Date(body.tripEndDate) })

    //Find charges 
    const vehicle = await Vehicle.findById(body.vehicleId).populate(['vehicleType'])
    console.log(vehicle)

    const trip = new Trip(body)
    trip.userId = userId
    trip.amount = (vehicle.vehicleType.perDayCharge * days) + (vehicle.vehicleType.perHourCharge * hours)
    const booked = await trip.save()
    await Profile.findOneAndUpdate({ userId: userId }, { $push: { tripHistory: trip } })
    await Vehicle.findOneAndUpdate({ _id: vehicle._id }, { $push: { trips: trip } })
    res.json(booked)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = tripCltr