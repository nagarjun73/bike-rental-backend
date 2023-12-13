//import dependencies
require('dotenv').config()
const _ = require('lodash')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const transporter = require('../config/nodemailerConfig')
//import Models
const User = require('../model/userModel')
const Profile = require('../model/profileModel')

const userCltr = {}

userCltr.register = async (req, res) => {
  //checking if any validation errors
  const errors = validationResult(req)

  //if any validation errors send error object
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //sanitizing input data using loadash
  const body = _.pick(req.body, ["name", 'email', 'mobileNumber', 'password', "role"])
  try {

    //checking if user is already registerd and verified
    const foundUser = await User.findOne({ $or: [{ email: body.email }, { mobileNumber: body.mobileNumber }] })

    if (foundUser) {
      //if found user not verified
      if (foundUser.verified == false) {

        //generating token for verification
        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        const url = `${process.env.BACKEND_URL}/api/users/verify/${token}`

        //sending verification link using nodemailer 
        const sentMail = await transporter.sendMail({
          from: process.env.EMAIL,
          // to: foundUser.email,
          to: 'invisiblecircuit@gmail.com',
          subject: "Verify your Bike Rental Account",
          html: `<div><p>Hey Thank you for Joining Bike Rentals. Please verify your account from below Link</p><a href=${url}>Verify</a></div>`
        })
        res.status(400).json({ errors: [{ msg: "account has already been registered with this email. Please verify the email which sent to you to Activate it." }] })

      } else if (foundUser.verified == true) {

        //if found user verified
        res.status(400).json({ errors: [{ msg: 'Email is already in use.' }] })
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
      if (result) {

        //generating token for verification
        const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        const url = `${process.env.BACKEND_URL}/api/users/verify/${token}`

        //sending verification link using nodemailer 
        const sentMail = await transporter.sendMail({
          from: process.env.EMAIL,
          // to: result.email,
          to: 'invisiblecircuit@gmail.com',
          subject: "Verify your Bike Rental Account",
          html: `<div><p>Hey Thank you for Joining Bike Rentals. Please verify your account from below Link</p><a href=${url}>Verify</a></div>`
        })

        res.json({
          msg: `${result.name}, Please Verify your email send to your email address to access your account`
        })
      }
    }
  } catch (e) {
    res.staus(400).json(e)
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
    res.status(400).json(e)
  }
}

userCltr.login = async (req, res) => {
  try {
    //Check if any Validation errors
    const errors = validationResult(req)

    //If any errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Sanitize input data
    const body = _.pick(req.body, ['emailOrMobile', 'password'])
    //Checking if user present on database
    const user = await User.findOne({ $or: [{ email: body.emailOrMobile }, { mobileNumber: body.emailOrMobile }] })
    if (!user) {
      res.status(404).json({ errors: "Invalid email / password" })
    } else {
      //Checking if user verified
      const userVerified = user.verified
      if (userVerified) {
        //comparing input password with found user using bcryptjs
        const verified = await bcryptjs.compare(body.password, user.password)
        if (!verified) {
          res.status(404).json({ errors: "Invalid password." })
        } else {

          //generating token after password verified
          const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
          res.json({ token: token })
        }
      } else {
        //generating token for verification
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        const url = `${process.env.BACKEND_URL}/api/users/verify/${token}`
        //sending verification link using nodemailer 
        const sentMail = await transporter.sendMail({
          from: process.env.EMAIL,
          to: result.email,
          subject: "Verify your Bike Rental Account",
          html: `<div><p>Hey Thank you for Joining Bike Rentals. Please verify your account from below Link</p><a href=${url}>Verify</a></div>`
        })
        res.status(401).json({ errors: "Your Account is not Verified. Check your Email and verify" })
      }
    }
  } catch (e) {
    res.status(400).json(e)
  }
}

userCltr.account = async (req, res) => {
  try {
    const id = req.user.id
    const account = await User.findById({ _id: id })
    const body = _.pick(account, ['_id', 'name', "email", "mobileNumber", "role", "verified"])
    res.json(body)
  } catch (e) {
    res.status(500).json({ errors: 'something went wrong' })
  }
}

userCltr.editAccount = async (req, res) => {
  try {
    const id = req.user.id
    const body = _.pick(req.body, ["name", "mobileNumber"])
    const editUser = await User.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    const prof = _.pick(editUser, ['_id', 'name', "email", "mobileNumber", "role", "verified"])
    res.json(prof)
  } catch (e) {
    res.status(500).json({ errors: 'something went wrong while editing user' })
  }
}



userCltr.list = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (e) {
    res.status(404).json(e)
  }
}

userCltr.search = async (req, res) => {
  try {
    const id = req.params.id
    const foundUser = await User.findById(id)
    res.json(foundUser)
  } catch (e) {
    res.status(404).json(e)
  }
}



module.exports = userCltr