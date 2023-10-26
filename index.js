require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multerMiddleware = require('./app/aws/multer')

const configureDB = require('./app/config/mongodb')
const userCltr = require('./app/controller/userCltr')
const vehicleCltr = require('./app/controller/vehicleCltr')
const { checkSchema } = require('express-validator')
const { userSignupValidationSchema, userLoginValidationSchema } = require('./app/helpers/user-validation')
const { addVehicleValidationSchema } = require('./app/helpers/vehicleValidation')
const { authenticateUser, authorizeUser } = require('./app/middleware/authentication')
const port = process.env.PORT

const app = express()

//converting recieved data into json
app.use(express.json())
//cors enabled
app.use(cors())

//configure database
configureDB()

//User's API's
app.post('/api/user/register', checkSchema(userSignupValidationSchema), userCltr.register)
app.get('/api/user/verify/:token', userCltr.verify)
app.post('/api/user/login', checkSchema(userLoginValidationSchema), userCltr.login)
app.get('/api/user/profile', authenticateUser, authorizeUser(['admin', 'user', 'host']), userCltr.profile)

//Host's API's
app.post('/api/vehicle/add', authenticateUser, authorizeUser(['admin', 'host']), multerMiddleware(), checkSchema(addVehicleValidationSchema), vehicleCltr.addVehicle)

app.post('/api/vehicle/add', multerMiddleware(),)

app.listen(port, () => {
  console.log("server running on port", port)
})