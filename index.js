//Dependencies
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { checkSchema } = require('express-validator')

//for Socket
const { createServer } = require('http')
const { Server } = require('socket.io')

const multerObj = require('./app/aws/multer')
const configureDB = require('./app/config/mongodb')
//Controllers
const userCltr = require('./app/controller/userCltr')
const vehicleCltr = require('./app/controller/vehicleCltr')
const tripCltr = require('./app/controller/tripCltr')
const paymentCltr = require('./app/controller/paymentCltr')
const vehicletypeCltr = require('./app/controller/vehicletypeCltr')
const locationCltr = require('./app/controller/locationCltr')
const profileCltr = require('./app/controller/profileCltr')

//Validations
const { userSignupValidationSchema, userLoginValidationSchema } = require('./app/helpers/user-validation')
const { addVehicleValidationSchema } = require('./app/helpers/vehicleValidation')
const { tripValidationSchema } = require('./app/helpers/trip-validaton')
const { locationValidationSchema } = require('./app/helpers/location-validation')
const { userProfileValidationSchema, hostProfileValidationSchema } = require('./app/helpers/profile-validation')

//Auth
const { authenticateUser, authorizeUser } = require('./app/middleware/authentication')
const port = process.env.PORT

const app = express()
//converting recieved data into json
app.use(express.json())
//cors enabled
app.use(cors())

//http server
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

//Socket connection
io.on('connection', (socket) => {
  console.log("connected to", socket.id)

  //Joining room
  socket.on("join_room", (data) => {
    const { userId, tripId } = data
    console.log(tripId, "user")
    socket.join(tripId) //trip Id will be the room Id

    socket.on("position", (data) => {
      console.log(data, "host")
      socket.to(tripId).emit("user_position", { data })
    })

    socket.on('disconnected', () => {
      console.log("user disconnected", socket.id)
    })
  })
})


//configure database
configureDB()

//User's API's
//User Registration
app.post('/api/users/register', checkSchema(userSignupValidationSchema), userCltr.register)
//User Verify
app.get('/api/users/verify/:token', userCltr.verify)
//User Login
app.post('/api/users/login', checkSchema(userLoginValidationSchema), userCltr.login)
//User account
app.get('/api/users/account', authenticateUser, authorizeUser(['admin', 'user', 'host']), userCltr.account)
//User Profile query
app.get('/api/users/profile', authenticateUser, authorizeUser(['admin', 'user', 'host']), profileCltr.profile)
//User Profile Add
app.post('/api/users/add-doc', authenticateUser, authorizeUser(['user']), multerObj.addDocs(), checkSchema(userProfileValidationSchema), profileCltr.addUserProfile)
//Book Trip
app.post('/api/trips/book', authenticateUser, authorizeUser(['admin', 'user']), checkSchema(tripValidationSchema), tripCltr.book)
//get All my trips
app.get('/api/trips/list', authenticateUser, authorizeUser(['admin', 'user']), tripCltr.list)

//get trip details
app.get('/api/trips/:id', authenticateUser, authorizeUser(['admin', 'user', "host"]), tripCltr.detail)

//Start Trip For user before 15min
app.get('/api/trips/:id/start', authenticateUser, authorizeUser(['user']), tripCltr.startTrip)

//End Ride
app.get('/api/trips/:id/end', authenticateUser, authorizeUser(['user']), tripCltr.endTrip)

//List all city
app.get('/api/locations/list', locationCltr.list)

//Query Vehicles
app.post('/api/vehicles/query', vehicleCltr.query)



//PAYMENT APIS
//Make Payment
app.post('/api/payments', authenticateUser, authorizeUser(['user']), paymentCltr.pay) //Validation

//update Payment
app.get('/api/payments/update/:id', authenticateUser, authorizeUser(['user']), paymentCltr.update)

//delete payment
app.get('/api/payments/delete/:id', authenticateUser, authorizeUser(['user']), paymentCltr.destroy)


//Host's API's  
//List Vehicle
app.get('/api/host/all-vehicles', authenticateUser, authorizeUser(['host']), vehicleCltr.getVehicles)

//list vehicle
app.get('/api/host/pagination', authenticateUser, authorizeUser(['host']), vehicleCltr.pagination)

//Search Vehicle
app.get('/api/vehicles/search', authenticateUser, authorizeUser(['host']), vehicleCltr.search)

//Add vehicle
app.post('/api/host/add-vehicle', authenticateUser, authorizeUser(['host']), multerObj.addVehicle(), checkSchema(addVehicleValidationSchema), vehicleCltr.addVehicle)

//Change status of vehicle
app.put('/api/host/:id/change-status', authenticateUser, authorizeUser(['host']), vehicleCltr.changeStatus)
//Host Profile Add
app.post('/api/host/add-doc', authenticateUser, authorizeUser(['host']), multerObj.addDocs(), checkSchema(hostProfileValidationSchema), profileCltr.addHostProfile)
//Vehicle Type List
app.get('/api/vehicletype/hostlist', authenticateUser, authorizeUser(['host']), vehicletypeCltr.listhost)


//Admin's API's
//Get all Users
app.get('/api/admin/users', authenticateUser, authorizeUser(['admin']), userCltr.list)
//Search users
app.get('/api/admin/:id/search-users', authenticateUser, authorizeUser(['admin']), userCltr.search)
//List all vehicles
app.get('/api/admin/vehicles', authenticateUser, authorizeUser(['admin']), vehicleCltr.list)
//Get Vehicle info
app.get('/api/admin/:id/vehicle-info', authenticateUser, authorizeUser(["host", 'admin']), vehicleCltr.info)
//Approve Host's vehicle
app.get('/api/admin/:id/approve', authenticateUser, authorizeUser(['admin']), vehicleCltr.approve)
//Reject Host's vehicle
app.get('/api/admin/:id/reject', authenticateUser, authorizeUser(['admin']), vehicleCltr.reject)

//Add City
app.post('/api/locations/add', authenticateUser, authorizeUser(['admin']), checkSchema(locationValidationSchema), locationCltr.add)//validation 
app.put('/api/locations/:id/edit', authenticateUser, authorizeUser(['admin']), locationCltr.edit)
//delete City
app.delete('/api/locations/:id/delete', authenticateUser, authorizeUser(['admin']), locationCltr.delete)//validation 


//vehicletype apis
//list vehicletype
app.get('/api/vehicletype/list', authenticateUser, authorizeUser(['admin']), vehicletypeCltr.list)
//add vehicletype
app.post('/api/vehicletype/add', authenticateUser, authorizeUser(['admin']), vehicletypeCltr.add)
//edit vehicletypes
app.put('/api/vehicletype/:id/edit', authenticateUser, authorizeUser(['admin']), vehicletypeCltr.edit)
//delete vehicletype
app.delete('/api/vehicletype/:id/delete', authenticateUser, authorizeUser(['admin']), vehicletypeCltr.delete)


//Profile Approve
app.get('/api/profiles/:id/approve', authenticateUser, authorizeUser(['admin']), profileCltr.approveUnverified)
//Profile unApproved List
app.get('/api/profiles/list', authenticateUser, authorizeUser(['admin']), profileCltr.unVerifiedList)

//Profile Search
app.get('/api/profiles', authenticateUser, authorizeUser(['admin']), profileCltr.searchProfile)

//Profile reject
app.get('/api/profiles/:id/reject', authenticateUser, authorizeUser(['admin']), profileCltr.rejectProfile)

httpServer.listen(port, () => {
  console.log("server running on port", port)
})