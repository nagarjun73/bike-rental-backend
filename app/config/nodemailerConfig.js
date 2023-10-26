require('dotenv').config()
const user = process.env.EMAIL
const pass = process.env.APP_PASSWORD
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass
  }
})

module.exports = transporter