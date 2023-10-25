const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers['authorization']
    const user = await jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (e) {
    res.json(e)
  }
}

module.exports = authenticateUser