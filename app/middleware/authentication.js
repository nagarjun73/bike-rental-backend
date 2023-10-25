const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers['authorization']
    const user = await jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (e) {
    res.status(401).json({ errors: "Authentication Error. Please Login again." })
  }
}

const authorizeUser = (role) => {
  return function (req, res, next) {
    if (!role.includes(req.user.role)) {
      res.status(401).json({ errors: "You are not Authorized." })
    } else {
      next()
    }
  }
}

module.exports = { authenticateUser, authorizeUser }