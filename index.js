require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const upload = multer({ limits: { fileSize: 5000000 } })

const configureDB = require('./app/config/mongodb')
const userCltr = require('./app/controller/userCltr')
const vehicleCltr = require('./app/controller/vehicleCltr')
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

//User's API's
app.post('/api/user/register', checkSchema(userSignupValidationSchema), userCltr.register)
app.get('/api/user/verify/:token', userCltr.verify)
app.post('/api/user/login', checkSchema(userLoginValidationSchema), userCltr.login)
app.get('/api/user/profile', authenticateUser, authorizeUser(['admin', 'user', 'host']), userCltr.profile)

//Host's API's
app.post('/api/vehicle/add', authenticateUser, authorizeUser(['admin', 'host']), upload.fields([{ name: 'vehicleImage', maxCount: 5 }, { name: 'registrationCertificate', maxCount: 2 }, { name: 'insuranceCerificate', maxCount: 2 }, { name: 'emissionCertificate', maxCount: 2 }]), vehicleCltr.addVehicle)

app.listen(port, () => {
  console.log("server running on port", port)
})