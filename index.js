//Dependencies
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { checkSchema } = require('express-validator')

const multerMiddleware = require('./app/aws/multer')
const configureDB = require('./app/config/mongodb')
//Controllers
const userCltr = require('./app/controller/userCltr')
const vehicleCltr = require('./app/controller/vehicleCltr')
const tripCltr = require('./app/controller/tripCltr')
const paymentCltr = require('./app/controller/paymentCltr')
//Validations
const { userSignupValidationSchema, userLoginValidationSchema } = require('./app/helpers/user-validation')
const { addVehicleValidationSchema } = require('./app/helpers/vehicleValidation')
//Auth
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
//User Registration
app.post('/api/users/register', checkSchema(userSignupValidationSchema), userCltr.register)
//User Verify
app.get('/api/users/verify/:token', userCltr.verify)
//User Login
app.post('/api/users/login', checkSchema(userLoginValidationSchema), userCltr.login)
//User Profile
app.get('/api/users/profile', authenticateUser, authorizeUser(['admin', 'user', 'host']), userCltr.profile)
//Book Trip
app.post('/api/trips/book', authenticateUser, authorizeUser(['admin', 'user']), tripCltr.book)
//Make Payment
app.post('/api/payment', paymentCltr.pay)

//Host's API's  
//List Vehicle
app.get('/api/host/all-vehicles', authenticateUser, authorizeUser(['host']), vehicleCltr.getVehicles)
//Add vehicle
app.post('/api/host/add-vehicle', authenticateUser, authorizeUser(['host']), multerMiddleware(), checkSchema(addVehicleValidationSchema), vehicleCltr.addVehicle)
//Change status of vehicle
app.put('/api/host/:id/change-status', authenticateUser, authorizeUser(['host']), vehicleCltr.changeStatus)


//Admin's API's
//Get all Users
app.get('/api/admin/users', authenticateUser, authorizeUser(['admin']), userCltr.list)
//Search users
app.get('/api/admin/:id/search-users', authenticateUser, authorizeUser(['admin']), userCltr.search)
//List all vehicles
app.get('/api/admin/vehicles', authenticateUser, authorizeUser(['admin']), vehicleCltr.list)
//Get Vehicle info
app.get('/api/admin/:id/vehicle-info', authenticateUser, authorizeUser(['admin']), vehicleCltr.info)
//Approve Host's vehicle
app.get('/api/admin/:id/approve', authenticateUser, authorizeUser(['admin']), vehicleCltr.approve)

app.listen(port, () => {
  console.log("server running on port", port)
})