require('dotenv').config()
const express = require('express')
const cors = require('cors')
const configureDB = require('./config/mongodb')
const userCltr = require('./app/controller/userCltr')
const { checkSchema } = require('express-validator')
const userSignupValidationSchema = require('./app/helpers/user-validation')
const port = process.env.PORT

const app = express()

//converting recieved data into json
app.use(express.json())
//cors enabled
app.use(cors())

//configure database
configureDB()

app.post('/api/register', checkSchema(userSignupValidationSchema), userCltr.register)
app.get('/api/verify/:token', userCltr.verify)
app.post('/api/login', userCltr.login)

app.listen(port, () => {
  console.log("server running on port", port)
})