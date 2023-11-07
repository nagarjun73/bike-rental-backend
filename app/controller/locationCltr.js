const _ = require('lodash')
const Location = require('../model/locationsModel')
const { validationResult } = require('express-validator')

const locationCltr = {}

locationCltr.list = async (req, res) => {
  try {
    const locationList = await Location.find()
    res.json(locationList)
  } catch (e) {
    res.json(e)
  }
}

locationCltr.add = async (req, res) => {
  const body = _.pick(req.body, ['name'])
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }

    const location = new Location(body)
    await location.save()
    res.json(location)
  } catch (e) {
    res.status(401).json(e)
  }
}

locationCltr.delete = async (req, res) => {
  const id = req.params.id
  try {
    const deleteVehicle = await Location.findByIdAndDelete(id)
    res.json(deleteVehicle)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = locationCltr