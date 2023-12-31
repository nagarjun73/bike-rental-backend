const _ = require('lodash')
const { intervalToDuration } = require('date-fns')
const Trip = require('../model/tripModel')
const Profile = require('../model/profileModel')
const Vehicle = require('../model/vehicleModel')
const { validationResult } = require('express-validator')
const { addMinutes } = require('date-fns')

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

    if (days == 0 && hours < 3) {
      res.status(400).json({ errors: "Trips should br minimum 3 hours long" })
    } else {
      //Find charges 
      const vehicle = await Vehicle.findById(body.vehicleId).populate(['vehicleType'])
      console.log(vehicle)

      const trip = new Trip(body)
      trip.userId = userId
      trip.amount = (vehicle.vehicleType.perDayCharge * days) + (vehicle.vehicleType.perHourCharge * hours)
      const booked = await trip.save()
      await Profile.findOneAndUpdate({ userId: userId }, { $push: { tripHistory: trip } })
      await Profile.findOneAndUpdate({ _id: booked.hostId }, { $push: { hostedTrips: trip } })
      await Vehicle.findOneAndUpdate({ _id: vehicle._id }, { $push: { trips: trip } })

      const trips = await Trip.findById(booked._id).populate("vehicleId", ["model", "registrationNumber"])
      const profile = await Profile.findOne({ userId: trip.hostId }).populate('userId', ["name"])
      const details = _.pick(profile, ['address', "userId"])
      res.json({ trips, details })
    }
  } catch (e) {
    res.status(400).json(e)
  }
}


tripCltr.detail = async (req, res) => {
  const id = req.params.id
  try {
    const trips = await Trip.findById(id).populate("vehicleId", ["model", "registrationNumber"])
    const profile = await Profile.findOne({ userId: trips.hostId }).populate('userId', ["name"])
    const details = _.pick(profile, ['address', "userId"])
    res.json({ trips, details })
  } catch (e) {
    res.status(400).json(e)
  }
}

tripCltr.reloadDetail = async (req, res) => {
  const id = req.params.id
  try {
    const trips = await Trip.findById(id).populate("vehicleId", ["model", "registrationNumber"])
    res.json(trips)
  } catch (e) {
    res.status(400).json(e)
  }
}

tripCltr.list = async (req, res) => {
  const id = req.user.id
  const page = req.query.page
  const sort = req.query.sort
  const limit = 5
  try {
    const tripList = await Trip
      .find({ userId: id })
      .sort({ createdAt: sort })
      .populate("vehicleId")
      .skip(page * limit)
      .limit(limit)
    res.json(tripList)
  } catch (e) {
    res.status(404).json(e)
  }
}



tripCltr.startTrip = async (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  try {
    const trip = await Trip.findOneAndUpdate({ _id: id, userId: userId, tripStartDate: { $lt: addMinutes(new Date(), 15) } }, { tripStatus: "inprogress" }, { runValidators: true, new: true })
    res.json(trip);
  } catch (e) {
    res.status(500).json(e)
  }
}

tripCltr.endTrip = async (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  try {
    const trip = await Trip.findOneAndUpdate({ _id: id, userId: userId }, { tripStatus: "completed" }, { runValidators: true, new: true })
    res.json(trip)
  } catch (e) {
    res.status(500).json(e)
  }
}

tripCltr.distroy = async (req, res) => {
  const id = req.params.id
  try {
    const trip = await Trip.findOneAndDelete(id)
    res.json(trip)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = tripCltr