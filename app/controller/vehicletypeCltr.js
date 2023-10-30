const _ = require('lodash')
const Vehicletype = require('../model/vehicletypeModel')

const vehicletypeCltr = {}

vehicletypeCltr.add = async (req, res) => {
  const body = _.pick(req.body, ['name', "minCc", "maxCc", "perDayKmLimit", "perDayCharge", "perHourCharge"])
  try {
    const type = new Vehicletype(body)
    await type.save()
    res.json(type)
  } catch (e) {
    res.status(401).json(e)
  }
}

vehicletypeCltr.edit = async (req, res) => {
  const body = _.pick(req.body, ['name', "minCc", "maxCc", "perDayKmLimit", "perDayCharge", "perHourCharge"])
  const id = req.params.id
  try {
    const update = await Vehicletype.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    res.json(update)
  } catch (e) {
    res.status(400).json(e)
  }
}

vehicletypeCltr.delete = async (req, res) => {
  try {
    const id = req.params.id
    const deleteVehicletype = await Vehicletype.findByIdAndRemove({ _id: id })
    res.json(deleteVehicletype)
  } catch (e) {
    res.status(400).json(e)
  }
}

vehicletypeCltr.list = async (req, res) => {
  try {
    const list = await Vehicletype.find()
    res.json(list)
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = vehicletypeCltr