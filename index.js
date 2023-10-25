require('dotenv').config()
const express = require('express')
const cors = require('cors')
const configureDB = require('./config/mongodb')
const userCltr = require('./app/controller/userCltr')
const { checkSchema } = require('express-validator')
const { userSignupValidationSchema, userLoginValidationSchema } = require('./app/helpers/user-validation')
const { authenticateUser, authorizeUser } = require('./app/middleware/authentication')
const port = process.env.PORT

const app = express()

//converting recieved data into json
app.use(express.json())
//cors enabled
app.use(cors())

//configure database
configureDB()

app.post('/api/user/register', checkSchema(userSignupValidationSchema), userCltr.register)
app.get('/api/user/verify/:token', userCltr.verify)
app.post('/api/user/login', checkSchema(userLoginValidationSchema), userCltr.login)
app.get('/api/user/profile', authenticateUser, authorizeUser(['admin', 'user', 'host']), userCltr.profile)

app.listen(port, () => {
  console.log("server running on port", port)
})