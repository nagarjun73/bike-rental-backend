const _ = require('lodash')

const chargeCltr = {}

chargeCltr.add = async (req, res) => {
  const body = _.pick(req.body, ['name', "minCc", "maxCc", "perDayKmLimit", "perDayCharge"])
  try {
    console.log(body)

  } catch (e) {
    res.status(401).json(e)
  }
}

module.exports = chargeCltr