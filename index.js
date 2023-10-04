require('dotenv').config()
const express = require('express')
const cors = require('cors')
const configureDB = require('./config/mongodb')
const port = process.env.PORT

const app = express()

//converting recieved data into json
app.use(express.json())
//cors enabled
app.use(cors())

//configure database
configureDB()

app.listen(port, () => {
  console.log("server running on port", port)
})