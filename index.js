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
app.post('/api/users/register', checkSchema(userSignupValidationSchema), userCltr.register)
app.get('/api/users/verify/:token', userCltr.verify)
app.post('/api/users/login', checkSchema(userLoginValidationSchema), userCltr.login)
app.get('/api/users/profile', authenticateUser, authorizeUser(['admin', 'user', 'host']), userCltr.profile)

//Host's API's
app.get('/api/host/all-vehicles', authenticateUser, authorizeUser(['host']), vehicleCltr.getVehicles)
app.post('/api/host/add-vehicle', authenticateUser, authorizeUser(['host']), multerMiddleware(), checkSchema(addVehicleValidationSchema), vehicleCltr.addVehicle)
app.put('/api/host/:id/change-status', authenticateUser, authorizeUser(['host']), vehicleCltr.changeStatus)


//Admin's API's
app.get('/api/admin/users', authenticateUser, authorizeUser(['admin']), userCltr.list)
app.get('/api/admin/:id/search-users', authenticateUser, authorizeUser(['admin']), userCltr.search)

app.get('/api/admin/vehicles', authenticateUser, authorizeUser(['admin']), vehicleCltr.list)

app.get('/api/admin/:id/vehicle-info', authenticateUser, authorizeUser(['admin']), vehicleCltr.info)

app.listen(port, () => {
  console.log("server running on port", port)
})