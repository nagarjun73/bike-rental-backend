//import dependencies
require('dotenv').config()
const _ = require('lodash')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
//import files
const User = require('../model/userModel')
const transporter = require('../../config/nodemailerConfig')

const userCltr = {}

userCltr.register = async (req, res) => {
  //checking if any validation errors
  const errors = validationResult(req)
  //if any validation errors send error object
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  //sanitizing input data using loadash
  const body = _.pick(req.body, ["name", 'email', 'mobileNumber', 'password'])
  try {
    const usr = new User(body)
    //generating salt
    const salt = await bcryptjs.genSalt()
    //generating hashed password
    const hashedPassword = await bcryptjs.hash(body.password, salt)
    usr.password = hashedPassword
    const result = await usr.save()
    console.log(result)
    if (result) {

      //generating token for verification
      const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
      const url = `http://localhost:${process.env.PORT}/api/verify/${token}`

      //sending verification link using nodemailer 
      const sentMail = await transporter.sendMail({
        from: process.env.EMAIL,
        to: result.email,
        subject: "Verify your Bike Rental Account",
        html: `<div><p>Hey Thank you for Joining Bike Rentals. Please verify your account from below Link</p><a href=${url}>Verify</a></div>`
      })
      console.log(sentMail)

      res.json({
        msg: `${result.name}, Please Verify your email send to your email address to access your account`
      })
    }

  } catch (e) {
    res.json(e)
  }
}

userCltr.verify = async (req, res) => {
  const token = req.params.token
  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    console.log(verifyToken.id)
    const user = await User.findOne({ _id: verifyToken.id })
    if (user.verified == false) {
      user.verified = !user.verified
      const verified = await user.save()
      if (verified) {
        res.json({ msg: "Your account has been successfully verified" })
      }
    } else {
      res.json({ msg: "Your account has already been verified." })
    }
  } catch (e) {
    res.json(e)
  }
}

module.exports = userCltr