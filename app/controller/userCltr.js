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

    //checking if user is already registerd and verified
    const foundUser = await User.findOne({ $or: [{ email: body.email }, { mobileNumber: body.mobileNumber }] })

    if (foundUser) {
      //if found user not verified
      if (foundUser.verified == false) {

        //generating token for verification
        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        const url = `http://localhost:${process.env.PORT}/api/user/verify/${token}`

        //sending verification link using nodemailer 
        const sentMail = await transporter.sendMail({
          from: process.env.EMAIL,
          to: foundUser.email,
          subject: "Verify your Bike Rental Account",
          html: `<div><p>Hey Thank you for Joining Bike Rentals. Please verify your account from below Link</p><a href=${url}>Verify</a></div>`
        })
        res.status(400).json({ errors: "account has already been registered with this email. Please verify the email which sent to you to Activate it." })

      } else if (foundUser.verified == true) {

        //if found user verified
        res.status(400).json({ errors: 'Email is already in use.' })
      }

    } else {

      //If user not found
      const usr = new User(body)

      //generating salt
      const salt = await bcryptjs.genSalt()

      //generating hashed password
      const hashedPassword = await bcryptjs.hash(body.password, salt)
      usr.password = hashedPassword

      //making first user Admin
      const totalUsers = await User.countDocuments()
      if (!totalUsers) {
        usr.role = 'admin'
      }
      const result = await usr.save()
      console.log(result)
      if (result) {

        //generating token for verification
        const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        const url = `http://localhost:${process.env.PORT}/api/user/verify/${token}`

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
    }
  } catch (e) {
    res.json(e)
  }
}

// This function handles Email Verification
userCltr.verify = async (req, res) => {
  const token = req.params.token
  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

    //checking if token user present
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

userCltr.login = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
  }
  try {
    // Sanitize input data
    const body = _.pick(req.body, ['emailOrMobile', 'password'])
    //Checking if user present on database
    const user = await User.findOne({ $or: [{ email: body.emailOrMobile }, { mobileNumber: body.emailOrMobile }] })
    if (!user) {
      res.status(400).json({ errors: "Invalid login credentials. Please check your username and password." })
    } else {

      //comparing input password with found user using bcryptjs
      const verified = await bcryptjs.compare(body.password, user.password)
      if (!verified) {
        res.json({ errors: "Invalid password." })
      } else {

        //generating token after password verified
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.json({ token: token })
      }
    }
  } catch (e) {
    res.json(e)
  }
}

userCltr.profile = async (req, res) => {
  try {
  } catch (e) {
    res.json(e)
  }
}

module.exports = userCltr