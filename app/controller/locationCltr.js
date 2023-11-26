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
      return res.status(400).json({ errors: errors.array() })
    }

    const location = new Location(body)
    await location.save()
    res.json(location)
  } catch (e) {
    res.status(401).json(e)
  }
}

locationCltr.edit = async (req, res) => {
  const id = req.params.id
  const body = req.body
  try {
    const editCity = await Location.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    res.json(editCity)
  } catch (e) {
    res.status(400).json(e)
  }
}

locationCltr.delete = async (req, res) => {
  const id = req.params.id
  try {
    const deleteCity = await Location.findByIdAndDelete(id)
    res.json(deleteCity)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = locationCltr